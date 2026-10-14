import { z } from "zod";

export const createEventSchema = z
  .object({
    title: z.string().trim().min(3).max(200),

    category: z.enum(["MUSIC", "WORKSHOP", "FOOD", "SPORTS", "KIDS"]),

    city: z.string().trim().min(2).max(100),

    startsAt: z
      .string()
      .datetime({ offset: true })
      .refine(
        (value) => new Date(value).getTime() > Date.now(),
        "Event date must be in the future",
      ),

    // String preserves exact decimal input for PostgreSQL.
    price: z
      .string()
      .regex(
        /^(0|[1-9]\d{0,9})(\.\d{1,2})?$/,
        "Enter a non-negative price with up to 2 decimal places",
      ),

    description: z.string().trim().min(10).max(10000),

    imageUrl: z
      .string()
      .url()
      .max(2048)
      .refine(
        (value) => ["http:", "https:"].includes(new URL(value).protocol),
        "Image URL must use HTTP or HTTPS",
      ),

    isActive: z.boolean().default(true),
  })
  .strict();

export const eventIdSchema = z.string().uuid();

export const eventStatusSchema = z
  .object({
    isActive: z.boolean(),
  })
  .strict();

export const adminEventQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).max(100000).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
  })
  .strict();

export const publicEventQuerySchema = z
  .object({
    category: z
      .enum(["MUSIC", "WORKSHOP", "FOOD", "SPORTS", "KIDS"])
      .optional(),

    city: z.string().trim().min(1).max(100).optional(),

    search: z.string().trim().min(1).max(200).optional(),

    page: z.coerce.number().int().min(1).max(100000).default(1),

    limit: z.coerce.number().int().min(1).max(50).default(9),
  })
  .strict();
