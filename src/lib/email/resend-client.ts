import { Resend } from "resend";

function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  return new Resend(apiKey);
}

export interface BookingConfirmationData {
  visitorName: string;
  visitorEmail: string;
  slotStart: Date;
  slotEnd: Date;
  purpose: string;
  bookingId: string;
  timezone: string;
}

/**
 * Send booking confirmation email using Resend
 */
export async function sendBookingConfirmation(data: BookingConfirmationData): Promise<void> {
  try {
    const resend = getResendClient();
    const { visitorName, visitorEmail, slotStart, slotEnd, purpose, bookingId, timezone } = data;

    // Format dates for email
    const dateFormatter = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZone: timezone,
    });

    const startFormatted = dateFormatter.format(slotStart);
    const endFormatted = dateFormatter.format(slotEnd);

    const fromEmail = process.env.BOOKING_FROM_EMAIL || "noreply@example.com";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
        .header { background-color: #007bff; color: white; padding: 20px; border-radius: 5px; text-align: center; }
        .content { background-color: white; padding: 20px; margin-top: 20px; border-radius: 5px; }
        .booking-details { background-color: #f0f8ff; padding: 15px; border-left: 4px solid #007bff; margin: 15px 0; }
        .detail-row { margin: 10px 0; }
        .label { font-weight: bold; color: #555; }
        .button { display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Booking Confirmed! ✓</h1>
        </div>
        
        <div class="content">
            <p>Hi <strong>${visitorName}</strong>,</p>
            
            <p>Your meeting request has been confirmed. Here are the details:</p>
            
            <div class="booking-details">
                <div class="detail-row">
                    <span class="label">Date & Time:</span> ${startFormatted} - ${endFormatted}
                </div>
                <div class="detail-row">
                    <span class="label">Timezone:</span> ${timezone}
                </div>
                <div class="detail-row">
                    <span class="label">Purpose:</span> ${purpose}
                </div>
                <div class="detail-row">
                    <span class="label">Booking ID:</span> ${bookingId}
                </div>
            </div>
            
            <p>A calendar invitation has been sent to <strong>${visitorEmail}</strong>. Please add it to your calendar.</p>
            
            <p>If you need to reschedule or have any questions, please reply to this email.</p>
            
            <a href="${appUrl}/booking-confirmation?id=${bookingId}" class="button">View Booking Details</a>
            
        </div>
        
        <div class="footer">
            <p>This is an automated message. Please do not reply directly to this email.</p>
            <p>&copy; ${new Date().getFullYear()}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `;

    const response = await resend.emails.send({
      from: fromEmail,
      to: visitorEmail,
      subject: `Booking Confirmed - ${startFormatted}`,
      html: htmlContent,
    });

    if (response.error) {
      throw new Error(`Failed to send email: ${response.error.message}`);
    }

    console.log(`Booking confirmation email sent to ${visitorEmail}`);
  } catch (error) {
    console.error("Error sending booking confirmation email:", error);
    throw error;
  }
}

/**
 * Send booking reminder email (24 hours before)
 */
export async function sendBookingReminder(data: BookingConfirmationData): Promise<void> {
  try {
    const resend = getResendClient();
    const { visitorName, visitorEmail, slotStart, purpose, bookingId, timezone } = data;

    const dateFormatter = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZone: timezone,
    });

    const startFormatted = dateFormatter.format(slotStart);
    const fromEmail = process.env.BOOKING_FROM_EMAIL || "noreply@example.com";

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
        .header { background-color: #ffc107; color: #333; padding: 20px; border-radius: 5px; text-align: center; }
        .content { background-color: white; padding: 20px; margin-top: 20px; border-radius: 5px; }
        .detail-box { background-color: #fffacd; padding: 15px; border-left: 4px solid #ffc107; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Meeting Reminder - Tomorrow at ${startFormatted}</h1>
        </div>
        
        <div class="content">
            <p>Hi <strong>${visitorName}</strong>,</p>
            
            <p>This is a friendly reminder about your upcoming meeting:</p>
            
            <div class="detail-box">
                <p><strong>When:</strong> ${startFormatted}</p>
                <p><strong>Purpose:</strong> ${purpose}</p>
                <p><strong>Booking ID:</strong> ${bookingId}</p>
            </div>
            
            <p>We're looking forward to speaking with you!</p>
        </div>
    </div>
</body>
</html>
    `;

    const response = await resend.emails.send({
      from: fromEmail,
      to: visitorEmail,
      subject: `Reminder: Meeting Tomorrow - ${startFormatted}`,
      html: htmlContent,
    });

    if (response.error) {
      throw new Error(`Failed to send reminder email: ${response.error.message}`);
    }

    console.log(`Booking reminder email sent to ${visitorEmail}`);
  } catch (error) {
    console.error("Error sending booking reminder email:", error);
    throw error;
  }
}

/**
 * Send cancellation email
 */
export async function sendBookingCancellation(
  visitorName: string,
  visitorEmail: string,
  bookingId: string,
  reason?: string
): Promise<void> {
  try {
    const resend = getResendClient();
    const fromEmail = process.env.BOOKING_FROM_EMAIL || "noreply@example.com";

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
        .header { background-color: #dc3545; color: white; padding: 20px; border-radius: 5px; text-align: center; }
        .content { background-color: white; padding: 20px; margin-top: 20px; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Booking Cancelled</h1>
        </div>
        
        <div class="content">
            <p>Hi <strong>${visitorName}</strong>,</p>
            
            <p>Your booking (ID: <strong>${bookingId}</strong>) has been cancelled.</p>
            
            ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ""}
            
            <p>If you have any questions, please contact us.</p>
        </div>
    </div>
</body>
</html>
    `;

    const response = await resend.emails.send({
      from: fromEmail,
      to: visitorEmail,
      subject: "Booking Cancelled",
      html: htmlContent,
    });

    if (response.error) {
      throw new Error(`Failed to send cancellation email: ${response.error.message}`);
    }

    console.log(`Booking cancellation email sent to ${visitorEmail}`);
  } catch (error) {
    console.error("Error sending cancellation email:", error);
    throw error;
  }
}
