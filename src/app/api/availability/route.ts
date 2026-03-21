import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/calendar/google-calendar";
import { AvailabilityQuerySchema, formatValidationError } from "@/lib/validation/schemas";

export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const dateStart = searchParams.get("dateStart");
    const dateEnd = searchParams.get("dateEnd");
    const timezone = searchParams.get("timezone") || "UTC";

    // Validate input
    const query = {
      dateStart: dateStart || new Date().toISOString(),
      dateEnd: dateEnd || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      timezone,
    };

    const validation = AvailabilityQuerySchema.safeParse(query);
    if (!validation.success) {
      const error = formatValidationError(validation.error);
      return NextResponse.json(error, { status: 400 });
    }

    const { dateStart: start, dateEnd: end, timezone: tz } = validation.data;

    // Get slot duration from env (default 30 mins)
    const slotDuration = parseInt(process.env.BOOKING_SLOT_DURATION_MINUTES || "30", 10);

    // Fetch available slots
    const slots = await getAvailableSlots(
      new Date(start),
      new Date(end),
      slotDuration
    );

    // Transform for response
    const formattedSlots = slots.map((slot) => ({
      slotStart: slot.slotStart.toISOString(),
      slotEnd: slot.slotEnd.toISOString(),
      duration: slot.duration,
    }));

    return NextResponse.json(
      {
        success: true,
        data: {
          timezone: tz,
          dateRange: {
            start: start,
            end: end,
          },
          slots: formattedSlots,
          totalSlots: formattedSlots.length,
          slotDuration: slotDuration,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Availability check error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch availability",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({ ok: true });
}
