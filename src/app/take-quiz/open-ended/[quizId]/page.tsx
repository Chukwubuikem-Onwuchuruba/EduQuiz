import OpenEnded from "@/components/OpenEnded";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import React from "react";
import Quiz from "../../../../../mongoDB/Quiz";
import connectDB from "@/lib/mongoose";

type Props = {
  params: {
    quizId: string;
  };
};

const OpenEndedPage = async ({ params: { quizId } }: Props) => {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/");
  }

  await connectDB(); // Connect to database

  const quiz = await Quiz.findById(quizId)
    .populate({
      path: "questions",
      select: "_id question answer",
    })
    .exec();

  if (!quiz || quiz.quizType !== "open_ended") {
    return redirect("/quiz");
  }
  return <OpenEnded quiz={JSON.parse(JSON.stringify(quiz))} />;
};

export default OpenEndedPage;
