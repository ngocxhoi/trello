import { z } from "zod";

export const ListSchema = z.object({
  name: z.string().min(1).max(255),
  boardId: z.string().optional(),
});
