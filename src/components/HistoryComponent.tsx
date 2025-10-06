import { Clock, CopyCheck, Edit2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import MCQCounter from "./MCQCounter";
import Quiz from "../../mongoDB/Quiz";
import connectDB from "@/lib/mongoose";

type Props = {
  limit: number;
  userId: string;
};

const HistoryComponent = async ({ limit, userId }: Props) => {
  await connectDB();

  const quizzes = await Quiz.find({
    userId: userId,
  })
    .sort({ timeStarted: -1 })
    .limit(limit)
    .exec();

  return (
    <div className="space-y-8">
      {quizzes.map((quiz) => {
        return (
          <div className="flex items-center justify-between" key={quiz.id}>
            <div className="flex items-center">
              {quiz.quizType === "mcq" ? (
                <CopyCheck className="mr-3" />
              ) : (
                <Edit2 className="mr-3" />
              )}
              <div className="ml-4 space-y-1">
                <Link
                  className="text-base font-medium leading-none underline"
                  href={`/statistics/${quiz.id}`}
                >
                  {quiz.topic}
                </Link>
                <p className="flex items-center px-2 py-1 text-xs text-white rounded-lg w-fit bg-slate-800">
                  <Clock className="w-4 h-4 mr-1" />
                  {new Date(quiz.timeEnded ?? 0).toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  {quiz.quizType === "mcq" ? "Multiple Choice" : "Open-Ended"}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HistoryComponent;
