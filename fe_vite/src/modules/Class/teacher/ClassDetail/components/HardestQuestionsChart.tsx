import React from "react";
import { Bar } from "react-chartjs-2";

interface HardestQuestionsChartProps {
  data: any;
}

const HardestQuestionsChart: React.FC<HardestQuestionsChartProps> = ({
  data,
}) => (
  <div className="bg-white rounded-xl shadow p-6 border border-indigo-100">
    <h3 className="font-bold text-indigo-700 mb-4">
      Top 5 câu hỏi sai nhiều nhất
    </h3>
    <Bar
      data={data}
      options={{
        indexAxis: "y",
        responsive: true,
        plugins: { legend: { display: false } },
      }}
    />
  </div>
);

export default HardestQuestionsChart;
