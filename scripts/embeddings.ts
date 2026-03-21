import { generatePortfolioEmbeddings, getEmbeddingStats, updateEmbeddings } from "@/lib/embeddings/generate-embeddings";

/**
 * CLI script for managing embeddings
 * Usage:
 *   node scripts/embeddings.ts generate       - Generate all embeddings
 *   node scripts/embeddings.ts update         - Update all embeddings (skip check)
 *   node scripts/embeddings.ts stats          - Show embedding statistics
 *   node scripts/embeddings.ts update:project - Update only project embeddings
 */

const command = process.argv[2];

async function main() {
  try {
    switch (command) {
      case "generate":
        console.log("🚀 Generating embeddings...\n");
        await generatePortfolioEmbeddings({
          skipExisting: true,
          verbose: true,
        });
        break;

      case "regenerate":
        console.log("🔄 Regenerating all embeddings...\n");
        await generatePortfolioEmbeddings({
          skipExisting: false,
          verbose: true,
        });
        break;

      case "update:project":
        console.log("🔄 Updating project embeddings...\n");
        await updateEmbeddings(["project", "project_details"]);
        break;

      case "update:skill":
        console.log("🔄 Updating skill embeddings...\n");
        await updateEmbeddings(["skill"]);
        break;

      case "update:about":
        console.log("🔄 Updating about embeddings...\n");
        await updateEmbeddings(["about"]);
        break;

      case "stats":
        console.log("📊 Embedding Statistics:\n");
        const stats = await getEmbeddingStats();
        console.log(`Total embeddings: ${stats.totalEmbeddings}`);
        console.log("\nBy source type:");
        Object.entries(stats.bySourceType).forEach(([type, count]) => {
          console.log(`  ${type}: ${count}`);
        });
        if (stats.lastUpdated) {
          console.log(`\nLast updated: ${stats.lastUpdated.toISOString()}`);
        }
        break;

      default:
        console.log(`
Embedding Management CLI

Usage:
  tsx scripts/embeddings.ts <command>

Commands:
  generate              Generate embeddings for all portfolio content
  regenerate            Force regenerate all embeddings (skip existing check)
  update:project        Update only project embeddings
  update:skill          Update only skill embeddings
  update:about          Update only about embeddings
  stats                 Show embedding statistics

Examples:
  tsx scripts/embeddings.ts generate
  tsx scripts/embeddings.ts stats
  tsx scripts/embeddings.ts update:project
        `);
    }
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

main();
