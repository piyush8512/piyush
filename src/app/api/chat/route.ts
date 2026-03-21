import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db/mongoose";
import Conversation from "@/lib/db/models/Conversation";
import Lead from "@/lib/db/models/Lead";
import {
  detectIntent,
  needsPortfolioContext,
  getContextForIntent,
  ChatIntent,
} from "@/lib/ai/intent-detector";
import { buildPrompt, retrieveRAGContext, sanitizePrompt, RAGContext } from "@/lib/ai/prompt-builder";
import { checkRateLimit } from "@/lib/rateLimit";
import { ChatMessageSchema, formatValidationError } from "@/lib/validation/schemas";

const CHAT_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-1.5-flash-latest",
];

function isQuotaError(error: unknown): boolean {
  const message =
    error instanceof Error ? error.message : JSON.stringify(error);
  return (
    message.includes("RESOURCE_EXHAUSTED") ||
    message.includes("Quota exceeded") ||
    message.includes("429")
  );
}

function isModelUnavailableError(error: unknown): boolean {
  const message =
    error instanceof Error ? error.message : JSON.stringify(error);
  return (
    message.includes("is no longer available") ||
    message.includes("is not found") ||
    message.includes("NOT_FOUND")
  );
}

function quotaFallbackMessage(): string {
  return "I am temporarily unavailable due to AI quota limits. Please retry in about a minute, or use the contact section to reach me directly.";
}

function noContextFallbackMessage(intent: ChatIntent): string {
  switch (intent) {
    case ChatIntent.PROJECTS:
      return "I cannot access indexed project data right now, so I do not want to invent details. Please try again after embeddings are synced, or open the Projects section on the site.";
    case ChatIntent.SKILLS:
      return "I cannot access indexed skills data right now, so I do not want to guess. Please try again after embeddings are synced, or check the Skills section on the site.";
    case ChatIntent.EXPERIENCE:
    case ChatIntent.RESUME:
    case ChatIntent.ABOUT:
    case ChatIntent.TESTIMONIALS:
      return "I cannot access indexed portfolio context right now, so I do not want to provide possibly incorrect details. Please try again shortly.";
    default:
      return "I cannot access indexed portfolio context right now. Please try again shortly.";
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = (request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown").split(",")[0];

    // Check rate limit
    const rateLimit = await checkRateLimit(ip);
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: "Too many requests. Please try again later.",
          retryAfter: rateLimit.retryAfter,
        },
        { status: 429 }
      );
    }

    // Parse and validate request
    const body = await request.json();
    const parsed = ChatMessageSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(formatValidationError(parsed.error), {
        status: 400,
      });
    }
    const { message, sessionId, email, name } = parsed.data;

    // Connect to database
    await connectToDatabase();

    // Detect user intent
    const intentResult = await detectIntent(message);

    // Retrieve relevant context if needed
    let ragContext: RAGContext[] = [];
    if (needsPortfolioContext(intentResult.intent)) {
      const contextConfig = getContextForIntent(intentResult.intent);
      ragContext = await retrieveRAGContext(
        message,
        contextConfig.embedSearchTerms,
        contextConfig.retrievalLimit
      );

      // Prevent hallucinations: if portfolio context is required but unavailable,
      // return a deterministic response instead of calling the model.
      if (ragContext.length === 0) {
        const fallbackText = noContextFallbackMessage(intentResult.intent);

        await Conversation.create({
          sessionId,
          userMessage: sanitizePrompt(message),
          assistantMessage: fallbackText,
          intent: intentResult.intent,
          contextChunkIds: [],
          tokenUsage: {
            promptTokens: 0,
            completionTokens: 0,
            totalTokens: 0,
          },
          modelName: "deterministic-no-context",
          latencyMs: 0,
        });

        return new Response(fallbackText, {
          status: 200,
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
      }
    }

    // Build system prompt with context
    const systemPrompt = await buildPrompt(
      intentResult.intent,
      message,
      ragContext
    );

    // Sanitize user message to prevent prompt injection
    const sanitizedMessage = sanitizePrompt(message);

    // Get conversation history for context
    const conversationHistory = await Conversation.find({ sessionId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("userMessage assistantMessage");

    // Build messages array
    const messages = [
      ...conversationHistory
        .reverse()
        .map((msg) => [
          { role: "user" as const, content: msg.userMessage },
          { role: "assistant" as const, content: msg.assistantMessage },
        ])
        .flat(),
      { role: "user" as const, content: sanitizedMessage },
    ];

    // Track request latency
    const startTime = Date.now();

    let assistantText = "";
    let usage = { inputTokens: 0, outputTokens: 0 };

    let usedModel = "";

    for (const modelName of CHAT_MODELS) {
      try {
        const result = await generateText({
          model: google(modelName),
          system: systemPrompt,
          messages,
          temperature: 0.7,
          maxRetries: 0,
        });
        assistantText = result.text;
        usage = {
          inputTokens: result.usage?.inputTokens || 0,
          outputTokens: result.usage?.outputTokens || 0,
        };
        usedModel = modelName;
        break;
      } catch (error) {
        if (!isQuotaError(error) && !isModelUnavailableError(error)) {
          throw error;
        }
      }
    }

    if (!assistantText) {
      assistantText = quotaFallbackMessage();
    }

    try {
      const latencyMs = Date.now() - startTime;

      // Save conversation to database
      await Conversation.create({
        sessionId,
        userMessage: sanitizedMessage,
        assistantMessage: assistantText,
        intent: intentResult.intent,
        contextChunkIds: ragContext.map((c) => c.text),
        tokenUsage: {
          promptTokens: usage.inputTokens,
          completionTokens: usage.outputTokens,
          totalTokens: usage.inputTokens + usage.outputTokens,
        },
        modelName: usedModel || "fallback-message",
        latencyMs,
      });

      // Capture lead if email provided
      if (email && name) {
        await Lead.findOneAndUpdate(
          { sessionId },
          {
            sessionId,
            name,
            email,
            interest: intentResult.intent,
            source: "chatbot",
            consentToContact: true,
          },
          { upsert: true }
        );
      }
    } catch (error) {
      console.error("Error saving conversation:", error);
    }

    return new Response(assistantText, {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error("Chat API error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        formatValidationError(error),
        { status: 400 }
      );
    }

    if (isQuotaError(error) || isModelUnavailableError(error)) {
      return new Response(quotaFallbackMessage(), {
        status: 200,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({ ok: true });
}
