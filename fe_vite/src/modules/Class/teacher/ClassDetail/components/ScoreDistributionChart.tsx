import React from "react";
import { Bar } from "react-chartjs-2";

interface ScoreDistributionChartProps {
  data: any;
}

const ScoreDistributionChart: React.FC<ScoreDistributionChartProps> = ({
  data,
}) => (
  <div className="bg-white rounded-xl shadow p-6 border border-indigo-100">
    <h3 className="font-bold text-indigo-700 mb-4">Phân phối điểm</h3>
    <Bar
      data={data}
      options={{ responsive: true, plugins: { legend: { display: false } } }}
    />
  </div>
);

export default ScoreDistributionChart;
