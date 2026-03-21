import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import Booking from "@/lib/db/models/Booking";
import { createCalendarEvent, updateCalendarEvent } from "@/lib/calendar/google-calendar";
import { sendBookingConfirmation } from "@/lib/email/resend-client";
import { CreateBookingSchema, formatValidationError } from "@/lib/validation/schemas";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = (request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown").split(",")[0];

    // Check rate limit (5 booking requests per hour per IP)
    const rateLimit = await checkRateLimit(`booking_${ip}`);
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: "Too many booking requests. Please try again later.",
          retryAfter: rateLimit.retryAfter,
        },
        { status: 429 }
      );
    }

    // Parse and validate request
    const body = await request.json();
    const validation = CreateBookingSchema.safeParse(body);

    if (!validation.success) {
      const error = formatValidationError(validation.error);
      return NextResponse.json(error, { status: 400 });
    }

    const { visitorName, visitorEmail, slotStart, slotEnd, purpose, timezone, sessionId } = validation.data;

    // Connect to database
    await connectToDatabase();

    // Check for conflicts
    const existingBooking = await Booking.findOne({
      slotStart: { $lt: new Date(slotEnd) },
      slotEnd: { $gt: new Date(slotStart) },
      status: { $in: ["PENDING", "CONFIRMED"] },
    });

    if (existingBooking) {
      return NextResponse.json(
        {
          error: "This time slot is no longer available. Please select another time.",
        },
        { status: 409 }
      );
    }

    // Create calendar event
    let calendarEventId = "";
    try {
      const calendarEvent = await createCalendarEvent(
        `Meeting with ${visitorName}`,
        `Purpose: ${purpose}\n\nBooking ID: pending`,
        new Date(slotStart),
        new Date(slotEnd),
        visitorEmail
      );
      calendarEventId = calendarEvent.eventId;
    } catch (error) {
      console.error("Calendar creation failed:", error);
      return NextResponse.json(
        {
          error: "Failed to reserve calendar slot. Please try again.",
        },
        { status: 500 }
      );
    }

    // Save booking to database
    const booking = await Booking.create({
      sessionId,
      visitorName,
      visitorEmail,
      timezone,
      slotStart: new Date(slotStart),
      slotEnd: new Date(slotEnd),
      purpose,
      calendarEventId,
      status: "PENDING",
      emailSent: false,
    });

    // Update calendar event with booking ID
    try {
      await updateCalendarEvent(
        calendarEventId,
        {
          title: `Meeting with ${visitorName}`,
          description: `Purpose: ${purpose}\n\nBooking ID: ${booking._id}`,
          startTime: new Date(slotStart),
          endTime: new Date(slotEnd),
        }
      );
    } catch (error) {
      console.warn("Failed to update calendar event description:", error);
    }

    // Send confirmation email
    try {
      await sendBookingConfirmation({
        visitorName,
        visitorEmail,
        slotStart: new Date(slotStart),
        slotEnd: new Date(slotEnd),
        purpose,
        bookingId: booking._id.toString(),
        timezone,
      });

      // Mark booking as confirmed after email sent
      await Booking.updateOne(
        { _id: booking._id },
        { status: "CONFIRMED", emailSent: true }
      );
    } catch (error) {
      console.error("Email sending failed:", error);
      // Don't fail the booking if email fails, but mark for retry
      await Booking.updateOne(
        { _id: booking._id },
        { status: "PENDING", emailSent: false }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          bookingId: booking._id,
          visitorName: booking.visitorName,
          visitorEmail: booking.visitorEmail,
          slotStart: booking.slotStart.toISOString(),
          slotEnd: booking.slotEnd.toISOString(),
          timezone: booking.timezone,
          status: booking.status,
          message: "Booking confirmed! Check your email for confirmation details.",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Booking creation error:", error);

    return NextResponse.json(
      {
        error: "Failed to create booking",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const bookingId = request.nextUrl.searchParams.get("id");

    if (!bookingId) {
      return NextResponse.json(
        { error: "Booking ID required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const booking = await Booking.findById(bookingId).select(
      "visitorName visitorEmail slotStart slotEnd purpose timezone status createdAt"
    );

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          bookingId: booking._id,
          visitorName: booking.visitorName,
          visitorEmail: booking.visitorEmail,
          slotStart: booking.slotStart.toISOString(),
          slotEnd: booking.slotEnd.toISOString(),
          timezone: booking.timezone,
          purpose: booking.purpose,
          status: booking.status,
          createdAt: booking.createdAt.toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Booking retrieval error:", error);

    return NextResponse.json(
      { error: "Failed to retrieve booking" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({ ok: true });
}
