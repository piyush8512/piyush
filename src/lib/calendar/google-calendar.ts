import { google } from "googleapis";
import { JWT } from "google-auth-library";

/**
 * Google Calendar provider for managing availability and bookings
 */

let calendarAuth: JWT | null = null;

function getGoogleAuth(): JWT {
  if (calendarAuth) {
    return calendarAuth;
  }

  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!clientEmail || !privateKey) {
    throw new Error(
      "GOOGLE_CLIENT_EMAIL and GOOGLE_PRIVATE_KEY environment variables are required"
    );
  }

  calendarAuth = new JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });

  return calendarAuth;
}

export interface AvailableSlot {
  slotStart: Date;
  slotEnd: Date;
  duration: number;
}

export interface CalendarEvent {
  eventId: string;
  summary: string;
  startTime: Date;
  endTime: Date;
}

/**
 * Get available time slots from Google Calendar
 */
export async function getAvailableSlots(
  dateStart: Date,
  dateEnd: Date,
  slotDuration: number = 30,
  workingHours = { start: 9, end: 18 }
): Promise<AvailableSlot[]> {
  try {
    const auth = getGoogleAuth();
    const calendar = google.calendar({ version: "v3", auth });
    const calendarId = process.env.GOOGLE_CALENDAR_ID;

    if (!calendarId) {
      throw new Error("GOOGLE_CALENDAR_ID environment variable is required");
    }

    // Get all events in date range
    const events = await calendar.events.list({
      calendarId,
      timeMin: dateStart.toISOString(),
      timeMax: dateEnd.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });

    // Extract busy times
    const busyTimes = (events.data.items || []).map((event) => ({
      start: new Date(event.start?.dateTime || event.start?.date || ""),
      end: new Date(event.end?.dateTime || event.end?.date || ""),
    }));

    // Generate available slots
    const slots: AvailableSlot[] = [];
    let current = new Date(dateStart);

    while (current < dateEnd) {
      const slotEnd = new Date(current.getTime() + slotDuration * 60 * 1000);

      // Check if slot is within working hours
      const dayOfWeek = current.getDay();
      const hour = current.getHours();

      if (dayOfWeek !== 0 && dayOfWeek !== 6 && hour >= workingHours.start && hour < workingHours.end) {
        // Check if slot conflicts with any busy time
        const isAvailable = !busyTimes.some(
          (busy) =>
            (current >= busy.start && current < busy.end) ||
            (slotEnd > busy.start && slotEnd <= busy.end) ||
            (current <= busy.start && slotEnd >= busy.end)
        );

        if (isAvailable) {
          slots.push({
            slotStart: new Date(current),
            slotEnd: new Date(slotEnd),
            duration: slotDuration,
          });
        }
      }

      current = new Date(current.getTime() + slotDuration * 60 * 1000);
    }

    return slots;
  } catch (error) {
    console.error("Error fetching available slots:", error);
    throw new Error("Failed to fetch available slots");
  }
}

/**
 * Create a calendar event for a booking
 */
export async function createCalendarEvent(
  title: string,
  description: string,
  startTime: Date,
  endTime: Date,
  guestEmail?: string
): Promise<{ eventId: string; htmlLink: string }> {
  try {
    const auth = getGoogleAuth();
    const calendar = google.calendar({ version: "v3", auth });
    const calendarId = process.env.GOOGLE_CALENDAR_ID;

    if (!calendarId) {
      throw new Error("GOOGLE_CALENDAR_ID environment variable is required");
    }

    const event = {
      summary: title,
      description,
      start: {
        dateTime: startTime.toISOString(),
        timeZone: "UTC",
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: "UTC",
      },
      attendees: guestEmail
        ? [{ email: guestEmail, responseStatus: "needsAction" }]
        : [],
      conferenceData: {
        conferenceDataVersion: 1,
        conferenceSolution: {
          key: {
            conferenceType: "hangoutsMeet",
          },
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 }, // 1 day before
          { method: "popup", minutes: 30 }, // 30 mins before
        ],
      },
    };

    const result = await calendar.events.insert({
      calendarId,
      requestBody: event as any,
      conferenceDataVersion: 1,
    });

    if (!result.data.id) {
      throw new Error("Failed to create calendar event");
    }

    return {
      eventId: result.data.id,
      htmlLink: result.data.htmlLink || "",
    };
  } catch (error) {
    console.error("Error creating calendar event:", error);
    throw new Error("Failed to create calendar event");
  }
}

/**
 * Cancel a calendar event
 */
export async function cancelCalendarEvent(eventId: string): Promise<void> {
  try {
    const auth = getGoogleAuth();
    const calendar = google.calendar({ version: "v3", auth });
    const calendarId = process.env.GOOGLE_CALENDAR_ID;

    if (!calendarId) {
      throw new Error("GOOGLE_CALENDAR_ID environment variable is required");
    }

    await calendar.events.delete({
      calendarId,
      eventId,
    });
  } catch (error) {
    console.error("Error canceling calendar event:", error);
    throw new Error("Failed to cancel calendar event");
  }
}

/**
 * Update a calendar event
 */
export async function updateCalendarEvent(
  eventId: string,
  updates: {
    title?: string;
    description?: string;
    startTime?: Date;
    endTime?: Date;
  }
): Promise<{ eventId: string }> {
  try {
    const auth = getGoogleAuth();
    const calendar = google.calendar({ version: "v3", auth });
    const calendarId = process.env.GOOGLE_CALENDAR_ID;

    if (!calendarId) {
      throw new Error("GOOGLE_CALENDAR_ID environment variable is required");
    }

    // Get existing event
    const existing = await calendar.events.get({
      calendarId,
      eventId,
    });

    // Prepare update
    const eventData: any = {
      summary: updates.title || existing.data.summary,
      description: updates.description || existing.data.description,
      start: updates.startTime
        ? {
            dateTime: updates.startTime.toISOString(),
            timeZone: "UTC",
          }
        : existing.data.start,
      end: updates.endTime
        ? {
            dateTime: updates.endTime.toISOString(),
            timeZone: "UTC",
          }
        : existing.data.end,
    };

    const result = await calendar.events.update({
      calendarId,
      eventId,
      requestBody: eventData,
    });

    if (!result.data.id) {
      throw new Error("Failed to update calendar event");
    }

    return { eventId: result.data.id };
  } catch (error) {
    console.error("Error updating calendar event:", error);
    throw new Error("Failed to update calendar event");
  }
}

/**
 * Get calendar event details
 */
export async function getCalendarEvent(eventId: string): Promise<CalendarEvent> {
  try {
    const auth = getGoogleAuth();
    const calendar = google.calendar({ version: "v3", auth });
    const calendarId = process.env.GOOGLE_CALENDAR_ID;

    if (!calendarId) {
      throw new Error("GOOGLE_CALENDAR_ID environment variable is required");
    }

    const result = await calendar.events.get({
      calendarId,
      eventId,
    });

    return {
      eventId: result.data.id || "",
      summary: result.data.summary || "",
      startTime: new Date(result.data.start?.dateTime || result.data.start?.date || ""),
      endTime: new Date(result.data.end?.dateTime || result.data.end?.date || ""),
    };
  } catch (error) {
    console.error("Error fetching calendar event:", error);
    throw new Error("Failed to fetch calendar event");
  }
}
