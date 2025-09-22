import { getAuthSession } from "@/lib/nextauth";
import { quizCreationSchema } from "@/schemas/form/quiz";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import Quiz from "../../../../mongoDB/Quiz";
import TopicCount from "../../../../mongoDB/TopicCount";
import axios from "axios";
import Question from "../../../../mongoDB/Question";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongoose";

await dbConnect();

// Add connection check
if (mongoose.connection.readyState !== 1) {
  console.error("MongoDB not connected");
  // You might need to establish connection
}

export async function POST(req: Request, res: Response) {
  try {
    console.log("Quiz creation started");
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json(
        {
          error: "You must be logged in to take a quiz!",
        },
        {
          status: 401,
        }
      );
    }
    const body = await req.json();
    console.log("Request body:", body);
    const { amount, topic, type } = quizCreationSchema.parse(body);
    console.log("Parsed data:", { amount, topic, type });
    const quiz = await Quiz.create({
      quizType: type,
      timeStarted: new Date(),
      userId: session.user.id,
      topic,
    });
    console.log("Quiz created:", quiz);
    console.log("Calling questions API...");
    const { data } = await axios.post(`${process.env.API_URL}/api/questions`, {
      amount,
      topic,
      type,
    });
    console.log("Questions API response:", data);
    if (type === "mcq") {
      type multipleChoiceQuestion = {
        question: string;
        answer: string;
        option1: string;
        option2: string;
        option3: string;
      };
      const manyData = data.questions.map(
        (question: multipleChoiceQuestion) => {
          // mix up the options
          const options = [
            question.option1,
            question.option2,
            question.option3,
            question.answer,
          ].sort(() => Math.random() - 0.5);
          return {
            question: question.question,
            answer: question.answer,
            options: JSON.stringify(options),
            quizId: quiz._id,
            questionType: "mcq",
          };
        }
      );
      await Question.insertMany(manyData);
    } else if (type === "open_ended") {
      type openEndedQuestion = {
        question: string;
        answer: string;
      };
      const manyData = data.questions.map((question: openEndedQuestion) => {
        return {
          question: question.question,
          answer: question.answer,
          quizId: quiz._id,
          questionType: "open_ended",
        };
      });
      await Question.insertMany(manyData);
    }
    return NextResponse.json({ quizId: quiz._id }, { status: 200 });
  } catch (error) {
    console.error("Full error:", error);
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json(
      {
        error: "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}

// await TopicCount.findOneAndUpdate(
//       { topic }, // where clause (filter)
//       { $inc: { count: 1 } }, // update: increment count by 1
//       {
//         upsert: true, // create if doesn't exist
//         new: true, // return the updated document
//       }
//     );
