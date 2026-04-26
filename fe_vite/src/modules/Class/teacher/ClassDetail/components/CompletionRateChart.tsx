import React from "react";
import { Bar } from "react-chartjs-2";

interface CompletionRateChartProps {
  data: any;
}

const CompletionRateChart: React.FC<CompletionRateChartProps> = ({ data }) => (
  <div className="bg-white rounded-xl shadow p-6 border border-indigo-100 flex flex-col items-center">
    <h3 className="font-bold text-indigo-700 mb-4">Tỉ lệ hoàn thành</h3>
    <div className="w-full max-w-xs">
      <Bar
        data={data}
        options={{ indexAxis: "y", plugins: { legend: { display: true } } }}
      />
    </div>
  </div>
);

export default CompletionRateChart;
