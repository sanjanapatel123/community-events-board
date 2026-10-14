import { z } from "zod";

export const favouritesSchema = z
  .object({
    categories: z
      .array(z.enum(["MUSIC", "WORKSHOP", "FOOD", "SPORTS", "KIDS"]))
      .max(5)
      .refine(
        (categories) => new Set(categories).size === categories.length,
        "Duplicate categories are not allowed",
      ),
  })
  .strict();

export const feedQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).max(100000).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(9),
  })
  .strict();
