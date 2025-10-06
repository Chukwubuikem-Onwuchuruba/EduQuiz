import { buttonVariants } from "@/components/ui/button";
import { getAuthSession } from "@/lib/nextauth";
import { LucideLayoutDashboard } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import ResultsCard from "@/components/statistics/ResultsCard";
import AccuracyCard from "@/components/statistics/AccuracyCard";
import TimeTakenCard from "@/components/statistics/TimeTakenCard";
import QuestionsList from "@/components/statistics/QuestionsList";
import connectDB from "@/lib/mongoose";
import Quiz from "../../../../mongoDB/Quiz";

type Props = {
  params: {
    quizId: string;
  };
};

const Statistics = async ({ params: { quizId } }: Props) => {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/");
  }
  await connectDB();
  const rawQuiz = await Quiz.findById(quizId)
    .populate("questions")
    .lean()
    .exec();
  if (!rawQuiz) {
    return redirect("/");
  }
  const quiz = JSON.parse(JSON.stringify(rawQuiz));

  let accuracy: number = 0;

  if (quiz.quizType === "mcq") {
    let totalCorrect = quiz.questions.reduce((acc, question) => {
      if (question.isCorrect) {
        return acc + 1;
      }
      return acc;
    }, 0);
    accuracy = (totalCorrect / quiz.questions.length) * 100;
  } else if (quiz.quizType === "open_ended") {
    let totalPercentage = quiz.questions.reduce((acc, question) => {
      return acc + (question.percentageCorrect ?? 0);
    }, 0);
    accuracy = totalPercentage / quiz.questions.length;
  }
  accuracy = Math.round(accuracy * 100) / 100;

  return (
    <>
      <div className="p-8 mx-auto max-w-7xl">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Summary</h2>
          <div className="flex items-center space-x-2">
            <Link href="/dashboard" className={buttonVariants()}>
              <LucideLayoutDashboard className="mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>

        <div className="grid gap-4 mt-4 md:grid-cols-7">
          <ResultsCard accuracy={accuracy} />
          <AccuracyCard accuracy={accuracy} />
          <TimeTakenCard
            timeEnded={new Date(quiz.timeEnded ?? 0)}
            timeStarted={new Date(quiz.timeStarted ?? 0)}
          />
        </div>
        <QuestionsList questions={quiz.questions} />
      </div>
    </>
  );
};

export default Statistics;
