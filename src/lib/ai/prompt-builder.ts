import { ChatIntent } from "@/lib/ai/intent-detector";
import Embedding from "@/lib/db/models/Embedding";
import { fetchPortfolioContent } from "@/lib/sanity/context-fetcher";

export interface RAGContext {
  sourceType: string;
  text: string;
  title?: string;
  relevance: number;
}

/**
 * Builds a comprehensive system prompt for the chatbot
 */
export async function buildPrompt(
  intent: ChatIntent,
  _userQuery?: string,
  ragContext?: RAGContext[]
): Promise<string> {
  const baseSystemPrompt = `You are an intelligent AI assistant representing a talented developer on their portfolio website. You are knowledgeable about the developer's work, projects, skills, and experience.

Your responsibilities:
1. Provide accurate information about the developer's portfolio
2. Help with meeting scheduling and availability
3. Answer questions about projects and technical expertise
4. Capture visitor interest and facilitate contact
5. Be professional, friendly, and concise

Guidelines:
- Keep responses focused and relevant to the user's question
- If you don't know something, be honest about it
- For booking requests, be helpful about scheduling
- For contact inquiries, provide clear contact information
- Use the portfolio context provided to give accurate answers

Response format rules:
- Keep reply under 120 words unless user asks for deep detail
- Prefer short sections with clear line breaks
- For lists, use max 3 bullet points
- Do not use markdown headings (no # or ###)
- Never invent project names, metrics, or skills that are not in provided context`;

  // Add intent-specific instructions
  const intentInstructions = getIntentInstructions(intent);

  // Add portfolio context if available
  let contextSection = "";
  if (ragContext && ragContext.length > 0) {
    contextSection = buildContextSection(ragContext);
  }

  return `${baseSystemPrompt}

${intentInstructions}

${contextSection}`.trim();
}

/**
 * Gets specific instructions based on the detected intent
 */
function getIntentInstructions(intent: ChatIntent): string {
  const instructions: Record<ChatIntent, string> = {
    [ChatIntent.BOOKING]: `
Current Task: Help the user schedule a meeting or call.
- Ask about their availability and preferred time
- Mention that you're flexible and can accommodate their timezone
- Confirm: name, email, and what they want to discuss
- Suggest a specific time slot if possible
- Assure them you'll send a confirmation email`,

    [ChatIntent.PROJECTS]: `
Current Task: Discuss the developer's projects and portfolio work.
- Highlight relevant projects based on the user's interests
- Explain the technologies and methodologies used
- Share project outcomes and impact
- Offer to discuss specific projects in more detail
  - Ask if they'd like to see live demos or GitHub repositories
  Output style: Give 2 projects max, each in 2-3 lines.`,

    [ChatIntent.SKILLS]: `
Current Task: Discuss technical skills and expertise.
- Provide comprehensive overview of skills
- Categorize by proficiency level if relevant
- Explain context of how skills were developed
- Ask if they want to know more about specific technologies
  - Offer to discuss how skills apply to their needs
  Output style: Provide up to 6 skills in concise bullets, grouped by category.`,

    [ChatIntent.EXPERIENCE]: `
Current Task: Share information about work experience.
- Highlight key positions and responsibilities
- Discuss achievements and impact at each role
- Explain career progression and growth
- Mention any relevant accomplishments or awards
- Ask if they'd like to know about specific time periods`,

    [ChatIntent.ABOUT]: `
Current Task: Introduce the developer and share background.
- Provide a warm, professional introduction
- Share background and what drives their work
- Highlight personality and work philosophy
- Mention interests and values
- Be personable but professional`,

    [ChatIntent.CONTACT]: `
Current Task: Help the user get in touch.
- Provide clear contact methods (email, phone, social media)
- Offer to capture their inquiry or interest
- Suggest scheduling a call or meeting if appropriate
- Be helpful about the best way to reach the developer
- Ask what their inquiry is about`,

    [ChatIntent.RESUME]: `
Current Task: Provide comprehensive professional information.
- Summarize key experiences and skills
- Highlight education and certifications
- Mention key achievements and awards
- Provide links to resume/CV if available
- Offer to discuss any section in detail`,

    [ChatIntent.TESTIMONIALS]: `
Current Task: Share what others have said about the developer.
- Provide relevant testimonials and references
- Highlight praise and achievements
- Explain context of testimonials when relevant
- Offer to provide additional references
- Ask for specific feedback or endorsement if appropriate`,

    [ChatIntent.FAQ]: `
Current Task: Answer frequently asked questions.
- Provide clear, concise answers
- Anticipate follow-up questions
- Use examples when helpful
- Offer to elaborate on any topic
- Ask if they need clarification`,

    [ChatIntent.GENERAL]: `
Current Task: Have a helpful, friendly conversation.
- Be responsive and personable
- Ask clarifying questions if needed
- Offer relevant suggestions or information
- Keep the conversation flowing naturally
- Try to understand what they ultimately want to know
Output style: 2-4 short sentences.`,
  };

  return instructions[intent] || instructions[ChatIntent.GENERAL];
}

/**
 * Builds a context section from RAG retrieval results
 */
function buildContextSection(ragContext: RAGContext[]): string {
  if (ragContext.length === 0) {
    return "";
  }

  let section =
    "Recent Portfolio Context (for reference when answering):\n\n";

  ragContext.forEach((context, index) => {
    section += `[${index + 1}] ${context.sourceType.toUpperCase()}`;
    if (context.title) {
      section += ` - ${context.title}`;
    }
    section += `\n${context.text}\n\n`;
  });

  return section;
}

/**
 * Retrieves relevant context from embeddings for a query
 */
export async function retrieveRAGContext(
  query: string,
  searchTerms: string[],
  limit: number = 3
): Promise<RAGContext[]> {
  try {
    // Note: This is a placeholder implementation
    // In a real system, you would:
    // 1. Generate an embedding for the query with Google embeddings
    // 2. Perform similarity search in the Embedding collection
    // 3. Return top-k results with relevance scores

    // For now, we'll do a simple MongoDB text search
    const embeddings = await Embedding.find({
      $or: searchTerms.map((term) => ({
        chunkText: { $regex: term, $options: "i" },
      })),
    })
      .limit(limit)
      .select("sourceType chunkText metadata");

    const fromEmbeddings = embeddings.map((doc: any) => ({
      sourceType: doc.sourceType,
      text: doc.chunkText,
      title: doc.metadata?.title,
      relevance: 0.8, // Placeholder relevance score
    }));

    if (fromEmbeddings.length > 0) {
      return fromEmbeddings;
    }

    // Fallback: query live Sanity content when embeddings are not available.
    const liveContent = await fetchPortfolioContent();
    const loweredQuery = query.toLowerCase();
    const loweredTerms = searchTerms.map((term) => term.toLowerCase());

    const scored = liveContent
      .map((chunk) => {
        const haystack = `${chunk.metadata.title || ""} ${chunk.chunkText}`.toLowerCase();

        let score = 0;
        if (haystack.includes(loweredQuery)) {
          score += 3;
        }
        for (const term of loweredTerms) {
          if (haystack.includes(term)) {
            score += 1;
          }
        }

        return { chunk, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ chunk, score }) => ({
        sourceType: chunk.sourceType,
        text: chunk.chunkText,
        title: chunk.metadata.title,
        relevance: Math.min(1, 0.5 + score * 0.1),
      }));

    return scored;
  } catch (error) {
    console.error("Error retrieving RAG context:", error);
    return [];
  }
}

/**
 * Creates a user message that includes conversation history context
 */
export function buildUserMessage(
  currentMessage: string,
  conversationHistory?: Array<{ role: "user" | "assistant"; content: string }>
): string {
  if (!conversationHistory || conversationHistory.length === 0) {
    return currentMessage;
  }

  // For the first message in a conversation, use it as-is
  if (conversationHistory.length === 0) {
    return currentMessage;
  }

  // Include last 2 exchanges for context
  const relevantHistory = conversationHistory.slice(-4);
  let message = "Conversation context:\n";

  relevantHistory.forEach((turn) => {
    message += `${turn.role === "user" ? "User" : "Assistant"}: ${turn.content}\n`;
  });

  message += `\nCurrent user message: ${currentMessage}`;

  return message;
}

/**
 * Validates and sanitizes the prompt to prevent injection attacks
 */
export function sanitizePrompt(prompt: string): string {
  // Remove any potential prompt injection attempts
  const suspiciousPatterns = [
    /ignore\s+previous\s+instructions/gi,
    /disregard\s+the\s+system\s+prompt/gi,
    /forget\s+about\s+your\s+instructions/gi,
  ];

  let sanitized = prompt;
  suspiciousPatterns.forEach((pattern) => {
    sanitized = sanitized.replace(pattern, "");
  });

  // Limit prompt length to prevent token overflow
  const MAX_PROMPT_LENGTH = 2000;
  if (sanitized.length > MAX_PROMPT_LENGTH) {
    sanitized = sanitized.substring(0, MAX_PROMPT_LENGTH);
  }

  return sanitized.trim();
}
