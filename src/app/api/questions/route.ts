import { strict_output } from "@/lib/gpt";
import { strict_output_gemini } from "@/lib/gemini";
import { strict_output_deepseek } from "@/lib/deepseek";
import { quizCreationSchema } from "@/schemas/form/quiz";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { getAuthSession } from "@/lib/nextauth";

// POST mapped to /api/questions
export const POST = async (req: Request) => {
  try {
    // need to protect the endpoint
    // const session = await getAuthSession();
    // if (!session?.user) {
    //   return NextResponse.json(
    //     {
    //       error: "You must be logged in to take a quiz!",
    //     },
    //     {
    //       status: 401,
    //     }
    //   );
    // }
    const body = await req.json();
    const { amount, topic, type } = quizCreationSchema.parse(body);

    let questions: any = [];

    if (type === "open_ended") {
      questions = await strict_output_gemini(
        "You are a helpful AI that is able to generate a pair of questions and answers. The length of the answer should not exceed 15 words. Store all the pairs of questions and answers in a JSON array.",
        new Array(amount).fill(
          `You are to generate a random hard open-ended question about ${topic}.`
        ),
        {
          question: "question",
          answer: "answer with max length of 15 words.",
        }
      );
    } else if (type === "mcq") {
      questions = await strict_output_gemini(
        "You are a helpful AI that is able to generate multiple choice questions and answers. The length of each answer should not be more than 15 words. Store all answers and questions and options in a JSON array.",
        new Array(amount).fill(
          `You are to generate a random hard multiple choice question about ${topic}`
        ),
        {
          question: "question",
          answer: "answer with max length of 15 words",
          option1: "option1 with max length of 15 words",
          option2: "option2 with max length of 15 words",
          option3: "option3 with max length of 15 words",
        }
      );
    } else {
      // handle mcq or fallback case
      return NextResponse.json(
        { error: "Unsupported quiz type" },
        { status: 400 }
      );
    }

    return NextResponse.json({ questions }, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }

    console.error("Unexpected error in /api/questions:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
