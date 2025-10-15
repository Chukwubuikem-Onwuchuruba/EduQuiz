// import { strict_output } from "@/lib/gpt";
// import { strict_output_gemini } from "@/lib/gemini";
// import { strict_output_deepseek } from "@/lib/deepseek";
// import { quizCreationSchema } from "@/schemas/form/quiz";
// import { NextResponse } from "next/server";
// import { ZodError } from "zod";
// import { getAuthSession } from "@/lib/nextauth";

// // POST mapped to /api/questions
// export const POST = async (req: Request) => {
//   try {
//     // need to protect the endpoint
//     // const session = await getAuthSession();
//     // if (!session?.user) {
//     //   return NextResponse.json(
//     //     {
//     //       error: "You must be logged in to take a quiz!",
//     //     },
//     //     {
//     //       status: 401,
//     //     }
//     //   );
//     // }
//     const body = await req.json();
//     const { amount, topic, type, difficulty } = quizCreationSchema.parse(body);

//     let questions: any = [];

//     if (type === "open_ended") {
//       questions = await strict_output_gemini(
//         "You are a helpful AI that is able to generate a pair of questions and answers. The length of the answer should not exceed 15 words. Store all the pairs of questions and answers in a JSON array.",
//         new Array(amount).fill(
//           `You are to generate a random hard open-ended question about ${topic}.`
//         ),
//         {
//           question: "question",
//           answer: "answer with max length of 15 words.",
//         }
//       );
//     } else if (type === "mcq") {
//       questions = await strict_output_gemini(
//         "You are a helpful AI that is able to generate multiple choice questions and answers. The length of each answer should not be more than 15 words. Store all answers and questions and options in a JSON array.",
//         new Array(amount).fill(
//           `You are to generate a random hard multiple choice question about ${topic}`
//         ),
//         {
//           question: "question",
//           answer: "answer with max length of 15 words",
//           option1: "option1 with max length of 15 words",
//           option2: "option2 with max length of 15 words",
//           option3: "option3 with max length of 15 words",
//         }
//       );
//     } else {
//       // handle mcq or fallback case
//       return NextResponse.json(
//         { error: "Unsupported quiz type" },
//         { status: 400 }
//       );
//     }

//     return NextResponse.json({ questions }, { status: 200 });
//   } catch (error) {
//     if (error instanceof ZodError) {
//       return NextResponse.json({ error: error.issues }, { status: 400 });
//     }

//     console.error("Unexpected error in /api/questions:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// };

// import { strict_output_gemini } from "@/lib/gemini";
// import { quizCreationSchema } from "@/schemas/form/quiz";
// import { NextResponse } from "next/server";
// import { ZodError } from "zod";

// export const POST = async (req: Request) => {
//   try {
//     const body = await req.json();
//     const { amount, topic, type, difficulty } = quizCreationSchema.parse(body);

//     let questions: any = [];

//     // Define difficulty-based prompts
//     const difficultyPrompts = {
//       easy: {
//         open_ended: `You are to generate a random easy open-ended question about ${topic}. The question should test basic knowledge and be straightforward to answer.`,
//         mcq: `You are to generate a random easy multiple choice question about ${topic}. The question should test basic knowledge with clear, obvious correct answers.`,
//       },
//       intermediate: {
//         open_ended: `You are to generate a random intermediate open-ended question about ${topic}. The question should require some understanding and application of concepts.`,
//         mcq: `You are to generate a random intermediate multiple choice question about ${topic}. The question should require some critical thinking with plausible distractors.`,
//       },
//       hard: {
//         open_ended: `You are to generate a random hard open-ended question about ${topic}. The question should test deep understanding, analysis, or complex concepts.`,
//         mcq: `You are to generate a random hard multiple choice question about ${topic}. The question should be challenging with subtle distinctions between options.`,
//       },
//     };

//     if (type === "open_ended") {
//       questions = await strict_output_gemini(
//         "You are a helpful AI that is able to generate a pair of questions and answers. The length of the answer should not exceed 15 words. Store all the pairs of questions and answers in a JSON array.",
//         new Array(amount).fill(difficultyPrompts[difficulty].open_ended),
//         {
//           question: "question",
//           answer: "answer with max length of 15 words.",
//         }
//       );
//     } else if (type === "mcq") {
//       questions = await strict_output_gemini(
//         "You are a helpful AI that is able to generate multiple choice questions and answers. The length of each answer should not be more than 15 words. Store all answers and questions and options in a JSON array.",
//         new Array(amount).fill(difficultyPrompts[difficulty].mcq),
//         {
//           question: "question",
//           answer: "answer with max length of 15 words",
//           option1: "option1 with max length of 15 words",
//           option2: "option2 with max length of 15 words",
//           option3: "option3 with max length of 15 words",
//         }
//       );
//     } else {
//       return NextResponse.json(
//         { error: "Unsupported quiz type" },
//         { status: 400 }
//       );
//     }

//     return NextResponse.json({ questions }, { status: 200 });
//   } catch (error) {
//     if (error instanceof ZodError) {
//       return NextResponse.json({ error: error.issues }, { status: 400 });
//     }

//     console.error("Unexpected error in /api/questions:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// };

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
    const body = await req.json();
    // Destructure the new difficulty field
    const { amount, topic, type, difficulty } = quizCreationSchema.parse(body);

    let questions: any = [];

    // Construct a generic prompt part based on difficulty
    // e.g., "easy multiple choice question" or "hard open-ended question"
    const difficultyPrompt = `${difficulty} ${
      type === "mcq" ? "multiple choice" : "open-ended"
    } question`;

    if (type === "open_ended") {
      questions = await strict_output_gemini(
        "You are a helpful AI that is able to generate a pair of questions and answers. The length of the answer should not exceed 15 words. Store all the pairs of questions and answers in a JSON array.",
        new Array(amount).fill(
          `You are to generate a random ${difficultyPrompt} about ${topic}.`
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
          `You are to generate a random ${difficultyPrompt} about ${topic}`
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
