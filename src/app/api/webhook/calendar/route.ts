import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import Booking from "@/lib/db/models/Booking";
import { sendBookingCancellation } from "@/lib/email/resend-client";

/**
 * Webhook handler for calendar event updates
 * This can be called by Google Calendar to notify about event changes
 */

export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature (optional but recommended)
    const body = await request.json();

    // Parse webhook data
    const { eventId, status, reason } = body;

    if (!eventId) {
      return NextResponse.json(
        { error: "eventId required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find booking by calendar event ID
    const booking = await Booking.findOne({ calendarEventId: eventId });

    if (!booking) {
      console.warn(`No booking found for calendar event: ${eventId}`);
      return NextResponse.json(
        { message: "Booking not found, ignoring" },
        { status: 200 }
      );
    }

    // Handle different event statuses
    switch (status) {
      case "cancelled":
        await handleEventCancellation(booking);
        break;

      case "updated":
        await handleEventUpdate(booking, body);
        break;

      case "confirmed":
        await handleEventConfirmation(booking);
        break;

      default:
        console.log(`Unknown webhook status: ${status}`);
    }

    return NextResponse.json(
      { success: true, message: `Booking ${eventId} updated` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Webhook processing error:", error);

    return NextResponse.json(
      {
        error: "Failed to process webhook",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * Handle calendar event cancellation
 */
async function handleEventCancellation(booking: any): Promise<void> {
  try {
    // Update booking status
    await Booking.updateOne(
      { _id: booking._id },
      { status: "CANCELLED" }
    );

    // Send cancellation email
    await sendBookingCancellation(
      booking.visitorName,
      booking.visitorEmail,
      booking._id.toString(),
      "The calendar event was cancelled. Please contact us to reschedule."
    );

    console.log(`Booking ${booking._id} cancelled due to calendar event cancellation`);
  } catch (error) {
    console.error("Error handling event cancellation:", error);
    throw error;
  }
}

/**
 * Handle calendar event updates (time change, details change, etc.)
 */
async function handleEventUpdate(booking: any, webhookData: any): Promise<void> {
  try {
    const { newStart, newEnd, reason } = webhookData;

    // Update booking if times changed
    const updateData: any = { status: "CONFIRMED" };

    if (newStart) {
      updateData.slotStart = new Date(newStart);
    }

    if (newEnd) {
      updateData.slotEnd = new Date(newEnd);
    }

    await Booking.updateOne(
      { _id: booking._id },
      updateData
    );

    console.log(`Booking ${booking._id} updated:`, updateData);

    // Note: You could send an email here notifying the visitor of changes
    // await sendBookingUpdateNotification(booking, newStart, newEnd);
  } catch (error) {
    console.error("Error handling event update:", error);
    throw error;
  }
}

/**
 * Handle calendar event confirmation (when attendee confirms)
 */
async function handleEventConfirmation(booking: any): Promise<void> {
  try {
    // Update booking status
    await Booking.updateOne(
      { _id: booking._id },
      { 
        status: "CONFIRMED",
        attendeeConfirmed: true,
        attendeeConfirmedAt: new Date(),
      }
    );

    console.log(`Booking ${booking._id} confirmed by attendee`);
  } catch (error) {
    console.error("Error handling event confirmation:", error);
    throw error;
  }
}

/**
 * GET endpoint to verify webhook is working
 */
export async function GET() {
  return NextResponse.json({
    message: "Webhook endpoint is active",
    status: "ok",
  });
}

/**
 * OPTIONS endpoint for CORS
 */
export async function OPTIONS() {
  return NextResponse.json({ ok: true });
}
