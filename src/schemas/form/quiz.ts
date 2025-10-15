import { z } from "zod";

export const quizCreationSchema = z.object({
  topic: z
    .string()
    .min(3, { message: "Topic must be at least 3 characters long." }),
  type: z.enum(["mcq", "open_ended"]),
  // amount: z.number().min(3).max(10),
  amount: z.number().min(1).max(10),
  difficulty: z
    .enum(["easy", "intermediate", "hard"])
    .default("intermediate")
    .transform((v) => v),
});

export const checkAnswerSchema = z.object({
  questionId: z.string(),
  userAnswer: z.string(),
});

export const endQuizSchema = z.object({
  quizId: z.string(),
});

export type QuizCreationSchema = z.infer<typeof quizCreationSchema>;
