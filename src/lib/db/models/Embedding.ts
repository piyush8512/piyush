import { Document, Schema, model, models } from "mongoose";

export interface IEmbedding extends Document {
  sourceType: string;
  sourceId: string;
  chunkText: string;
  embeddingVector: number[];
  metadata?: {
    title?: string;
    tags?: string[];
    url?: string;
    updatedAt?: string;
    [key: string]: unknown;
  };
  createdAt: Date;
  updatedAt: Date;
}

const EmbeddingSchema = new Schema<IEmbedding>(
  {
    sourceType: { type: String, required: true, trim: true, index: true },
    sourceId: { type: String, required: true, trim: true, index: true },
    chunkText: { type: String, required: true, trim: true, maxlength: 5000 },
    embeddingVector: { type: [Number], required: true },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

EmbeddingSchema.index({ sourceType: 1, sourceId: 1 });

const Embedding = models.Embedding || model<IEmbedding>("Embedding", EmbeddingSchema);

export default Embedding;
