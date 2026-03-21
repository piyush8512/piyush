import { Document, Schema, model, models } from "mongoose";

export interface ILead extends Document {
  sessionId: string;
  name?: string;
  email?: string;
  interest?: string;
  source?: string;
  consentToContact: boolean;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    sessionId: { type: String, required: true, index: true },
    name: { type: String, trim: true, maxlength: 120 },
    email: { type: String, trim: true, lowercase: true, maxlength: 320, index: true },
    interest: { type: String, trim: true, maxlength: 200 },
    source: { type: String, trim: true, default: "chatbot" },
    consentToContact: { type: Boolean, default: false, index: true },
    metadata: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true,
  }
);

LeadSchema.index({ createdAt: -1 });

const Lead = models.Lead || model<ILead>("Lead", LeadSchema);

export default Lead;
