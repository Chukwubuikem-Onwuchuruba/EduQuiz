"use client";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface ScoreDistributionProps {
  accuracy: number;
}

const COLORS = ["#FF8042", "#00C49F", "#FFBB28"];

export default function ScoreDistribution({
  accuracy,
}: ScoreDistributionProps) {
  const data = [
    { name: "Correct", value: accuracy },
    { name: "Incorrect", value: 100 - accuracy },
  ];

  return (
    <div className="w-full h-64 mt-6">
      <h3 className="text-lg font-semibold mb-4">Score Distribution</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
