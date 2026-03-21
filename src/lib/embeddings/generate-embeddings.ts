import { embed } from "ai";
import { google } from "@ai-sdk/google";
import { fetchPortfolioContent } from "@/lib/sanity/context-fetcher";
import { connectToDatabase } from "@/lib/db/mongoose";
import Embedding from "@/lib/db/models/Embedding";

const EMBEDDING_MODEL = "text-embedding-004"; // Google's free embedding model
const BATCH_SIZE = 100;
const CHUNK_SIZE = 1000; // Character limit for text chunks

interface GenerateEmbeddingsOptions {
  skipExisting?: boolean;
  verbose?: boolean;
}

/**
 * Main function to generate and store embeddings for all portfolio content
 * Uses Google's free embedding API (included with Gemini free tier)
 */
export async function generatePortfolioEmbeddings(
  options: GenerateEmbeddingsOptions = {}
): Promise<void> {
  const { skipExisting = true, verbose = true } = options;

  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GOOGLE_GENERATIVE_AI_API_KEY environment variable is not set"
    );
  }

  try {
    // Connect to MongoDB
    if (verbose) console.log("📁 Connecting to MongoDB...");
    await connectToDatabase();

    // Fetch all portfolio content from Sanity
    if (verbose) console.log("🔍 Fetching portfolio content from Sanity...");
    const chunks = await fetchPortfolioContent();

    if (chunks.length === 0) {
      console.warn("⚠️  No content chunks found in Sanity");
      return;
    }

    if (verbose) console.log(`📄 Found ${chunks.length} content chunks`);

    // Process chunks and generate embeddings
    if (verbose) console.log("🚀 Generating embeddings...");

    let processedCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
      const batch = chunks.slice(i, i + BATCH_SIZE);

      // Filter out existing embeddings if skipExisting is true
      let chunksToProcess = batch;
      if (skipExisting) {
        const existingIds = await Embedding.find(
          {
            sourceType: { $in: batch.map((c) => c.sourceType) },
            sourceId: { $in: batch.map((c) => c.sourceId) },
          },
          "_id"
        );

        const existingIdSet = new Set(existingIds.map((e: any) => e.sourceId));
        chunksToProcess = batch.filter(
          (chunk) => !existingIdSet.has(chunk.sourceId)
        );
        skippedCount += batch.length - chunksToProcess.length;
      }

      if (chunksToProcess.length === 0) {
        continue;
      }

      // Generate embeddings for this batch using Google's free API
      const textsToEmbed = chunksToProcess.map((chunk) =>
        chunkText(chunk.chunkText, CHUNK_SIZE)
      );

      if (verbose) {
        console.log(`⏳ Processing batch ${Math.floor(i / BATCH_SIZE) + 1}...`);
      }

      // Use Google's embedding API (free with Gemini)
      const embeddingPromises = textsToEmbed.map((text) =>
        embed({
          model: google.textEmbedding("text-embedding-004"),
          value: text,
        })
      );

      const embeddingResults = await Promise.all(embeddingPromises);

      // Store embeddings in MongoDB
      const embeddingDocuments = chunksToProcess.map((chunk, index) => ({
        sourceType: chunk.sourceType,
        sourceId: chunk.sourceId,
        chunkText: chunk.chunkText,
        embeddingVector: embeddingResults[index].embedding,
        metadata: {
          title: chunk.metadata.title,
          tags: chunk.metadata.tags,
          url: chunk.metadata.url,
          updatedAt: new Date(),
        },
      }));

      // Upsert to handle updates
      for (const doc of embeddingDocuments) {
        await Embedding.findOneAndUpdate(
          { sourceId: doc.sourceId },
          doc,
          { upsert: true, new: true }
        );
      }

      processedCount += chunksToProcess.length;

      if (verbose) {
        console.log(
          `✅ Processed ${processedCount}/${chunks.length} chunks (${skippedCount} skipped)`
        );
      }
    }

    if (verbose) {
      console.log(
        `\n✨ Embedding generation complete!
- Total chunks: ${chunks.length}
- Processed: ${processedCount}
- Skipped (existing): ${skippedCount}
- Model: Google text-embedding-004 (Free Tier)`
      );
    }
  } catch (error) {
    console.error("❌ Error generating embeddings:", error);
    throw error;
  }
}

/**
 * Chunk text into smaller pieces if it exceeds the size limit
 */
function chunkText(text: string, maxSize: number): string {
  if (text.length <= maxSize) {
    return text;
  }

  // Try to chunk at sentence boundaries
  const sentences = text.split(/(?<=[.!?])\s+/);
  const chunks: string[] = [];
  let currentChunk = "";

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length < maxSize) {
      currentChunk += (currentChunk ? " " : "") + sentence;
    } else {
      if (currentChunk) chunks.push(currentChunk);
      currentChunk = sentence;
    }
  }

  if (currentChunk) chunks.push(currentChunk);

  // Return the first chunk (or the whole text if chunking at sentence boundaries didn't work)
  return chunks[0] || text.substring(0, maxSize);
}

/**
 * Update embeddings for specific content types
 */
export async function updateEmbeddings(
  sourceTypes: string[]
): Promise<void> {
  try {
    await connectToDatabase();

    // Delete old embeddings for these source types
    await Embedding.deleteMany({ sourceType: { $in: sourceTypes } });

    console.log(
      `🗑️  Deleted old embeddings for types: ${sourceTypes.join(", ")}`
    );

    // Regenerate all embeddings
    await generatePortfolioEmbeddings({ skipExisting: false, verbose: true });
  } catch (error) {
    console.error("Error updating embeddings:", error);
    throw error;
  }
}

/**
 * Get embedding statistics
 */
export async function getEmbeddingStats(): Promise<{
  totalEmbeddings: number;
  bySourceType: Record<string, number>;
  lastUpdated: Date | null;
}> {
  try {
    await connectToDatabase();

    const total = await Embedding.countDocuments();
    const byType = await Embedding.aggregate([
      {
        $group: {
          _id: "$sourceType",
          count: { $sum: 1 },
        },
      },
    ]);

    const lastDoc = await Embedding.findOne()
      .sort({ updatedAt: -1 })
      .select("updatedAt");

    return {
      totalEmbeddings: total,
      bySourceType: byType.reduce(
        (acc: Record<string, number>, item: any) => {
          acc[item._id] = item.count;
          return acc;
        },
        {} as Record<string, number>
      ),
      lastUpdated: lastDoc?.updatedAt || null,
    };
  } catch (error) {
    console.error("Error getting embedding statistics:", error);
    throw error;
  }
}
