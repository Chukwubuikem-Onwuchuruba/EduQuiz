import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import Link from "next/link";
import HistoryComponent from "../HistoryComponent";
import Quiz from "../../../mongoDB/Quiz";

type Props = {};

const RecentActivities = async (props: Props) => {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/");
  }
  const quizCount = await Quiz.countDocuments({
    userId: session.user.id,
  }).exec();
  return (
    <Card className="col-span-4 lg:col-span-3">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          <Link href="/history">Recent Activity</Link>
        </CardTitle>
        <CardDescription>
          You have taken a total of {quizCount} quizzes.
        </CardDescription>
      </CardHeader>
      <CardContent className="max-h-[580px] overflow-scroll">
        <HistoryComponent limit={10} userId={session.user.id} />
      </CardContent>
    </Card>
  );
};

export default RecentActivities;
