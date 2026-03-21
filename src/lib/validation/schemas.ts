import { z } from "zod";

/**
 * Chat endpoint validation schemas
 */
export const ChatMessageSchema = z.object({
  message: z
    .string()
    .min(1, "Message cannot be empty")
    .max(2000, "Message too long (max 2000 chars)"),
  sessionId: z
    .string()
    .min(1, "Session ID required")
    .max(100, "Invalid session ID"),
  email: z
    .string()
    .email("Invalid email format")
    .optional()
    .or(z.literal("")),
  name: z
    .string()
    .min(1, "Name required if provided")
    .max(120, "Name too long (max 120 chars)")
    .optional()
    .or(z.literal("")),
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;

/**
 * Booking endpoint validation schemas
 */
export const AvailabilityQuerySchema = z.object({
  dateStart: z
    .string()
    .datetime("Invalid date format")
    .describe("ISO 8601 start date"),
  dateEnd: z
    .string()
    .datetime("Invalid date format")
    .describe("ISO 8601 end date"),
  timezone: z
    .string()
    .default("UTC")
    .describe("IANA timezone (e.g., America/New_York)"),
});

export type AvailabilityQuery = z.infer<typeof AvailabilityQuerySchema>;

export const CreateBookingSchema = z.object({
  visitorName: z
    .string()
    .min(2, "Name too short")
    .max(120, "Name too long"),
  visitorEmail: z
    .string()
    .email("Invalid email format"),
  slotStart: z
    .string()
    .datetime("Invalid start time format"),
  slotEnd: z
    .string()
    .datetime("Invalid end time format"),
  purpose: z
    .string()
    .min(10, "Purpose too short")
    .max(500, "Purpose too long"),
  timezone: z
    .string()
    .default("UTC")
    .describe("IANA timezone"),
  sessionId: z
    .string()
    .min(1, "Session ID required"),
});

export type CreateBooking = z.infer<typeof CreateBookingSchema>;

/**
 * Email validation schemas
 */
export const EmailAddressSchema = z
  .string()
  .email("Invalid email address");

export const SendEmailSchema = z.object({
  to: EmailAddressSchema,
  subject: z
    .string()
    .min(5, "Subject too short")
    .max(200, "Subject too long"),
  html: z
    .string()
    .min(1, "Email body required"),
  replyTo: EmailAddressSchema.optional(),
  attachments: z
    .array(
      z.object({
        filename: z.string(),
        content: z.union([z.string(), z.instanceof(Buffer)]),
        contentType: z.string().optional(),
      })
    )
    .optional(),
});

export type SendEmail = z.infer<typeof SendEmailSchema>;

/**
 * Validation error formatter
 */
export function formatValidationError(error: z.ZodError): {
  message: string;
  fields: Record<string, string[]>;
} {
  const fields: Record<string, string[]> = {};

  error.issues.forEach((issue) => {
    const path = issue.path.join(".");
    if (!fields[path]) {
      fields[path] = [];
    }
    fields[path].push(issue.message);
  });

  return {
    message: "Validation failed",
    fields,
  };
}

/**
 * Safe validation wrapper
 */
export async function validateSchema<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<{ success: true; data: T } | { success: false; error: ReturnType<typeof formatValidationError> }> {
  try {
    const result = await schema.parseAsync(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: formatValidationError(error) };
    }
    throw error;
  }
}
