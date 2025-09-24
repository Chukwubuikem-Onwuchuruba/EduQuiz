import { redirect } from "next/navigation";
import React from "react";
import Quiz from "../../../../../mongoDB/Quiz";
import { getAuthSession } from "@/lib/nextauth";
import MCQ from "@/components/MCQ";

type Props = {
  params: {
    quizId: string;
  };
};

const MCQPage = async ({ params: { quizId } }: Props) => {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/");
  }
  const quiz = await Quiz.findById(quizId)
    .populate({
      path: "questions",
      select: "question options",
    })
    .exec();
  if (!quiz || quiz.quizType !== "mcq") {
    return redirect("/");
  }
  return <MCQ quiz={quiz} />;
};

export default MCQPage;
