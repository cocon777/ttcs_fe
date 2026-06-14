import React from "react";

interface HardestQuestionsTableProps {
  hardestQuestions: any[];
  onShowDetail: (q: any) => void;
}

const HardestQuestionsTable: React.FC<HardestQuestionsTableProps> = ({
  hardestQuestions,
  onShowDetail,
}) => (
  <div className="bg-white rounded-xl shadow p-6 border border-indigo-100 mb-8">
    <h3 className="font-bold text-indigo-700 mb-4">
      Danh sách câu hỏi hay trả lời sai
    </h3>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              STT
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              ID câu hỏi
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Xem chi tiết
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Số HS làm sai
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {hardestQuestions.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center text-gray-400 py-4">
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            hardestQuestions.map((q, idx) => (
              <tr key={q.id}>
                <td className="px-4 py-2">{idx + 1}</td>
                <td className="px-4 py-2">{q.id}</td>
                <td className="px-4 py-2">
                  <button
                    className="text-indigo-700 underline cursor-pointer hover:text-indigo-500"
                    onClick={() => onShowDetail(q)}
                  >
                    Xem chi tiết
                  </button>
                </td>
                <td className="px-4 py-2">{q.wrongCount}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default HardestQuestionsTable;
