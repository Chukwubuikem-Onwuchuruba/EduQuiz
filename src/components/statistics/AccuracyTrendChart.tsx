"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface AccuracyTrendChartProps {
  questions: Array<{
    questionText: string;
    isCorrect: boolean;
    percentageCorrect?: number;
  }>;
}

export default function AccuracyTrendChart({
  questions,
}: AccuracyTrendChartProps) {
  const data = questions.map((question, index) => ({
    name: `Q${index + 1}`,
    accuracy: question.isCorrect ? 100 : question.percentageCorrect || 0,
    correct: question.isCorrect ? 100 : 0,
  }));

  return (
    <div className="w-full h-64 mt-6">
      <h3 className="text-lg font-semibold mb-4">
        Question-by-Question Accuracy
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="accuracy"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <Line type="monotone" dataKey="correct" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
