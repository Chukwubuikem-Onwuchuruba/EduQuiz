import { redirect } from "next/navigation";
import React from "react";
import Quiz from "../../../../../mongoDB/Quiz";
import { getAuthSession } from "@/lib/nextauth";
import MCQ from "@/components/MCQ";
import connectDB from "@/lib/mongoose";

type Props = {
  params: {
    quizId: string;
  };
};

const MCQPage = async (props: Props) => {
  const { quizId } = await props.params; // ✅ await params
  const session = await getAuthSession();

  if (!session?.user) {
    return redirect("/");
  }

  await connectDB(); // Connect to database

  const quiz = await Quiz.findById(quizId)
    .populate({
      path: "questions",
      select: "_id question options",
    })
    .exec();

  if (!quiz || quiz.quizType !== "mcq") {
    return redirect("/");
  }

  // ✅ convert to plain object before passing to client component
  return <MCQ quiz={JSON.parse(JSON.stringify(quiz))} />;
};

export default MCQPage;
