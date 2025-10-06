import { endQuizSchema } from "@/schemas/form/quiz";
import { NextResponse } from "next/server";
import Quiz from "../../../../mongoDB/Quiz";
import connectDB from "@/lib/mongoose";

export async function POST(req: Request, res: Response) {
  connectDB();
  try {
    const body = await req.json();
    const { quizId } = endQuizSchema.parse(body);

    const quiz = await Quiz.findById(quizId).exec();
    if (!quiz) {
      return NextResponse.json(
        {
          message: "Game not found",
        },
        {
          status: 404,
        }
      );
    }

    await Quiz.findByIdAndUpdate(
      quizId,
      { timeEnded: new Date() },
      { new: true }
    );
    return NextResponse.json({
      message: "Game ended",
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
