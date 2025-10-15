import { checkAnswerSchema } from "@/schemas/form/quiz";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import Question from "../../../../mongoDB/Question";
import connectDB from "@/lib/mongoose";
import stringSimilarity, { compareTwoStrings } from "string-similarity";
import { evaluateAnswer } from "@/lib/answerEvaluation";

connectDB();

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const { questionId, userAnswer } = checkAnswerSchema.parse(body);
    const question = await Question.findById(questionId);
    if (!question) {
      return NextResponse.json(
        {
          error: "Question not found!",
        },
        {
          status: 404,
        }
      );
    }
    await Question.updateOne({ _id: questionId }, { userAnswer: userAnswer });
    if (question.questionType === "mcq") {
      const isCorrect =
        question.answer.toLowerCase().trim() ===
        userAnswer.toLowerCase().trim();
      await Question.updateOne({ _id: questionId }, { isCorrect: isCorrect });
      return NextResponse.json(
        {
          isCorrect,
        },
        {
          status: 200,
        }
      );
    } else if (question.questionType === "open_ended") {
      let percentageSimilar = evaluateAnswer(question.answer, userAnswer);

      await Question.updateOne(
        { _id: questionId },
        { percentageCorrect: percentageSimilar }
      );

      return NextResponse.json({ percentageSimilar }, { status: 200 });
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: error.issues,
        },
        {
          status: 400,
        }
      );
    }
  }
}
