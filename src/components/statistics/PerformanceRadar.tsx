"use client";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

export default function PerformanceRadar({ questions }) {
  const data = calculateRadarMetrics(questions);

  return (
    <div className="w-full h-64 mt-6">
      <h3 className="text-lg font-semibold mb-4">Skills Assessment</h3>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis />
          <Radar
            name="Performance"
            dataKey="value"
            stroke="#6366F1" // indigo-500
            fill="#6366F1"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

function calculateRadarMetrics(questions) {
  const total = questions.length;

  const correct = questions.filter((q) => q.isCorrect).length;
  const accuracy = (correct / total) * 100;

  const times = questions.map((q) => q.timeSpent ?? 0);
  const avgTime = times.reduce((a, b) => a + b, 0) / total;

  const speed = Math.max(0, Math.min(100, (12 / avgTime) * 100));

  const variance =
    times.reduce((acc, time) => acc + Math.pow(time - avgTime, 2), 0) / total;
  const consistency = Math.max(0, 100 - Math.sqrt(variance) * 10);

  const efficiency = accuracy * 0.6 + speed * 0.4;

  return [
    { subject: "Accuracy", value: Math.round(accuracy) },
    { subject: "Speed", value: Math.round(speed) },
    { subject: "Consistency", value: Math.round(consistency) },
    { subject: "Efficiency", value: Math.round(efficiency) },
  ];
}
