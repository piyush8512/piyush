import { Document, Schema, model, models } from "mongoose";

export type ConversationIntent =
  | "BOOKING"
  | "PROJECTS"
  | "SKILLS"
  | "EXPERIENCE"
  | "ABOUT"
  | "CONTACT"
  | "RESUME"
  | "TESTIMONIALS"
  | "FAQ"
  | "GENERAL";

export interface IConversation extends Document {
  sessionId: string;
  userMessage: string;
  assistantMessage: string;
  intent: ConversationIntent;
  contextChunkIds: string[];
  tokenUsage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
  modelName?: string;
  latencyMs?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    sessionId: { type: String, required: true, index: true },
    userMessage: { type: String, required: true, trim: true, maxlength: 1000 },
    assistantMessage: { type: String, required: true, trim: true, maxlength: 4000 },
    intent: {
      type: String,
      required: true,
      enum: ["BOOKING", "PROJECTS", "SKILLS", "EXPERIENCE", "ABOUT", "CONTACT", "RESUME", "TESTIMONIALS", "FAQ", "GENERAL"],
      default: "GENERAL",
      index: true,
    },
    contextChunkIds: { type: [String], default: [] },
    tokenUsage: {
      promptTokens: { type: Number, min: 0 },
      completionTokens: { type: Number, min: 0 },
      totalTokens: { type: Number, min: 0 },
    },
    modelName: { type: String, trim: true },
    latencyMs: { type: Number, min: 0 },
  },
  {
    timestamps: true,
  }
);

ConversationSchema.index({ sessionId: 1, createdAt: -1 });

const Conversation = models.Conversation || model<IConversation>("Conversation", ConversationSchema);

export default Conversation;
