import { z } from "zod";

export const SignUpSchema = z
  .object({
    name: z.string().min(3).max(50),
    email: z.string().email(),
    password: z.string().min(8),
    passwordConfirm: z.string().min(8),
  })
  .refine((data) => data.password == data.passwordConfirm, {
    message: "Passwords do not match",
    path: ["passwordConfirm"],
  });
