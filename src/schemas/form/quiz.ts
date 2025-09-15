import { z } from "zod";

export const quizCreationSchema = z.object({
  topic: z
    .string()
    .min(3, { message: "Topic must be at least 3 characters long." }),
  type: z.enum(["mcq", "open_ended"]),
  amount: z.number().min(5).max(20),
});
