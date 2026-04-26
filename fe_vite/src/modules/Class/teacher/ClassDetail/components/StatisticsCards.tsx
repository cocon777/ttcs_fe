import React from "react";

interface CardData {
  label: string;
  value: string | number;
}

interface StatisticsCardsProps {
  data: CardData[];
}

const StatisticsCards: React.FC<StatisticsCardsProps> = ({ data }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
    {data.map((card, idx) => (
      <div
        key={idx}
        className="bg-white rounded-xl shadow p-6 flex flex-col items-center border border-indigo-100"
      >
        <div className="text-2xl font-bold text-indigo-700 mb-2">
          {card.value}
        </div>
        <div className="text-sm text-slate-500 font-semibold uppercase">
          {card.label}
        </div>
      </div>
    ))}
  </div>
);

export default StatisticsCards;
