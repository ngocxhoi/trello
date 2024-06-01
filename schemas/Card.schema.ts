import { z } from "zod";

export const CardSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  listId: z.string(),
});
