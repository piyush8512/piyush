import { Document, Schema, model, models } from "mongoose";

export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "FAILED";

export interface IBooking extends Document {
  sessionId: string;
  visitorName: string;
  visitorEmail: string;
  timezone: string;
  slotStart: Date;
  slotEnd: Date;
  purpose?: string;
  calendarEventId?: string;
  status: BookingStatus;
  emailSent?: boolean;
  attendeeConfirmed?: boolean;
  attendeeConfirmedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    sessionId: { type: String, required: true, index: true },
    visitorName: { type: String, required: true, trim: true, maxlength: 120 },
    visitorEmail: { type: String, required: true, trim: true, lowercase: true, maxlength: 320, index: true },
    timezone: { type: String, required: true, trim: true, maxlength: 100 },
    slotStart: { type: Date, required: true, index: true },
    slotEnd: { type: Date, required: true, index: true },
    purpose: { type: String, trim: true, maxlength: 500 },
    calendarEventId: { type: String, trim: true, index: true },
    status: {
      type: String,
      required: true,
      enum: ["PENDING", "CONFIRMED", "CANCELLED", "FAILED"],
      default: "PENDING",
      index: true,
    },
    emailSent: { type: Boolean, default: false },
    attendeeConfirmed: { type: Boolean, default: false },
    attendeeConfirmedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

BookingSchema.index({ slotStart: 1, slotEnd: 1, status: 1 });
BookingSchema.index({ visitorEmail: 1, createdAt: -1 });

const Booking = models.Booking || model<IBooking>("Booking", BookingSchema);

export default Booking;
