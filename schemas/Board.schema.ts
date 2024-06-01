import { z } from "zod";

export const BoardSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  coverImage: z.string().optional(),
});
