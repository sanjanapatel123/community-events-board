import { z } from "zod";

export const eventFormSchema = z.object({
  title: z.string().trim().min(3, "Enter at least 3 characters").max(200),

  category: z.enum(["MUSIC", "WORKSHOP", "FOOD", "SPORTS", "KIDS"]),

  city: z.string().trim().min(2, "Enter a city").max(100),

  startsAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, "Select a date and time")
    .refine(
      (value) => new Date(`${value}:00+05:30`).getTime() > Date.now(),
      "Choose a future date and time",
    ),

  price: z
    .string()
    .regex(
      /^(0|[1-9]\d{0,9})(\.\d{1,2})?$/,
      "Enter a valid price, such as 499 or 499.50",
    ),

  description: z
    .string()
    .trim()
    .min(10, "Enter at least 10 characters")
    .max(10000),

  imageUrl: z
    .string()
    .url("Enter a valid image URL")
    .max(2048)
    .refine((value) => /^https?:\/\//i.test(value), "Use an HTTP or HTTPS URL"),

  isActive: z.boolean(),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;
