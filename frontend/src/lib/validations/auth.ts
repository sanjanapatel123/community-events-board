import { z } from "zod";

export const authSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(254),
  password: z
    .string()
    .min(8, "Use at least 8 characters")
    .max(128, "Maximum 128 characters"),
});

export type AuthFormValues = z.infer<typeof authSchema>;
