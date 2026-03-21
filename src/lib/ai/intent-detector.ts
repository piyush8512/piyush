import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

const CHAT_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-1.5-flash-latest",
];

function isModelOrQuotaError(error: unknown): boolean {
  const message =
    error instanceof Error ? error.message : JSON.stringify(error);
  return (
    message.includes("RESOURCE_EXHAUSTED") ||
    message.includes("Quota exceeded") ||
    message.includes("429") ||
    message.includes("is no longer available") ||
    message.includes("is not found") ||
    message.includes("NOT_FOUND")
  );
}

/**
 * Intent types the chatbot can recognize
 */
export enum ChatIntent {
  BOOKING = "BOOKING",
  PROJECTS = "PROJECTS",
  SKILLS = "SKILLS",
  EXPERIENCE = "EXPERIENCE",
  ABOUT = "ABOUT",
  CONTACT = "CONTACT",
  RESUME = "RESUME",
  TESTIMONIALS = "TESTIMONIALS",
  FAQ = "FAQ",
  GENERAL = "GENERAL",
}

const IntentSchema = z.object({
  intent: z.nativeEnum(ChatIntent),
  confidence: z.number().min(0).max(1),
  reason: z.string(),
});

export interface IntentDetectionResult {
  intent: ChatIntent;
  confidence: number;
  reason: string;
}

/**
 * Detects the user's intent from their message
 */
export async function detectIntent(
  userMessage: string
): Promise<IntentDetectionResult> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GOOGLE_GENERATIVE_AI_API_KEY environment variable is not set"
    );
  }

  const systemPrompt = `You are an AI assistant specialized in understanding user intents in a conversation about a developer's portfolio.

Your job is to analyze user messages and determine what the user wants to know or do.

Intent definitions:
- BOOKING: User wants to schedule a meeting, call, or book a time slot
- PROJECTS: User asks about projects, portfolio items, or past work
- SKILLS: User asks about technical skills, expertise, or technologies
- EXPERIENCE: User asks about work experience, career history, or background
- ABOUT: User asks about who you are, background, personality, or general introduction
- CONTACT: User wants to get in touch, contact information, or leave a message
- RESUME: User asks for resume, CV, or detailed professional information
- TESTIMONIALS: User asks about references, testimonials, or what others say
- FAQ: User asks frequently asked questions
- GENERAL: Casual conversation, greetings, or general chat

Respond with:
1. The detected intent (one of the above)
2. Confidence score (0-1, where 1 is very confident)
3. Brief reason for your classification`;

  let lastError: unknown = null;

  for (const modelName of CHAT_MODELS) {
    try {
      const result = await generateObject({
        model: google(modelName),
        schema: IntentSchema,
        system: systemPrompt,
        prompt: `User message: "${userMessage}"`,
        temperature: 0.3,
        maxRetries: 0,
      });

      // Ensure confidence is valid
      const confidence = Math.max(0, Math.min(1, result.object.confidence));

      return {
        intent: result.object.intent,
        confidence,
        reason: result.object.reason,
      };
    } catch (error) {
      lastError = error;
      if (!isModelOrQuotaError(error)) {
        break;
      }
    }
  }

  console.error("Error detecting intent:", lastError);

  // Fallback to GENERAL intent if detection fails
  return {
    intent: ChatIntent.GENERAL,
    confidence: 0.5,
    reason: "Intent detection failed, defaulting to GENERAL",
  };
}

/**
 * Detects intent for multiple messages in parallel
 */
export async function detectIntentBatch(
  messages: string[]
): Promise<IntentDetectionResult[]> {
  return Promise.all(messages.map((msg) => detectIntent(msg)));
}

/**
 * Helper to check if intent is booking-related
 */
export function isBookingIntent(intent: ChatIntent): boolean {
  return intent === ChatIntent.BOOKING;
}

/**
 * Helper to check if intent requires portfolio context
 */
export function needsPortfolioContext(intent: ChatIntent): boolean {
  return [
    ChatIntent.PROJECTS,
    ChatIntent.SKILLS,
    ChatIntent.EXPERIENCE,
    ChatIntent.ABOUT,
    ChatIntent.RESUME,
    ChatIntent.TESTIMONIALS,
  ].includes(intent);
}

/**
 * Get relevant context for an intent
 */
export function getContextForIntent(intent: ChatIntent): {
  embedSearchTerms: string[];
  retrievalLimit: number;
} {
  switch (intent) {
    case ChatIntent.PROJECTS:
      return {
        embedSearchTerms: ["project", "work", "implementation", "portfolio"],
        retrievalLimit: 5,
      };
    case ChatIntent.SKILLS:
      return {
        embedSearchTerms: ["skill", "technology", "expertise", "proficiency"],
        retrievalLimit: 5,
      };
    case ChatIntent.EXPERIENCE:
      return {
        embedSearchTerms: [
          "experience",
          "work",
          "position",
          "company",
          "role",
        ],
        retrievalLimit: 5,
      };
    case ChatIntent.ABOUT:
      return {
        embedSearchTerms: ["about", "bio", "introduction", "background"],
        retrievalLimit: 3,
      };
    case ChatIntent.RESUME:
      return {
        embedSearchTerms: [
          "resume",
          "cv",
          "experience",
          "skills",
          "education",
        ],
        retrievalLimit: 8,
      };
    case ChatIntent.TESTIMONIALS:
      return {
        embedSearchTerms: ["testimonial", "reference", "quote"],
        retrievalLimit: 4,
      };
    case ChatIntent.BOOKING:
      return {
        embedSearchTerms: ["meeting", "availability", "schedule"],
        retrievalLimit: 2,
      };
    case ChatIntent.CONTACT:
      return {
        embedSearchTerms: ["contact", "email", "phone", "reach"],
        retrievalLimit: 2,
      };
    default:
      return {
        embedSearchTerms: ["portfolio", "work"],
        retrievalLimit: 3,
      };
  }
}
