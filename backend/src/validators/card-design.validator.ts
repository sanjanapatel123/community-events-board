import { z } from "zod";

export const cardDesignSchema = z
  .object({
    theme: z.enum(["SUNSET", "OCEAN", "FOREST"]),

    stickers: z
      .array(z.enum(["music", "star", "party", "pizza", "heart"]))
      .max(3, "You can add up to 3 stickers"),
  })
  .strict();
