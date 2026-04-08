import React from "react";
import ExamRow from "../components/examRow";
import type { De } from "../../../../../share/interfaces/exam.interface";

interface AllExamsProps {
  des: De[];
}

const AllExams: React.FC<AllExamsProps> = (props) => {
  const { des } = props;

  return (
    <div className="text-gray-800 dark:text-slate-300">
      <div className="mb-4 text-lg font-large">Tất cả đề đã tạo</div>

      <div className="relative min-w-[1100px] overflow-x-auto bg-white pb-8 shadow-md dark:bg-[rgb(var(--color-darkmode-600))] sm:rounded-lg">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200">
            <tr className="text-gray-800 dark:text-gray-300">
              <td scope="col" className="px-6 py-4 font-semibold">
                Tiêu đề
              </td>
              <td scope="col" className="px-6 py-4 font-semibold">
                Trạng thái
              </td>
              <td scope="col" className="px-6 py-4 font-semibold">
                Đã giao cho
              </td>
              <td scope="col" className="px-6 py-4 font-semibold">
                Sửa lần cuối
              </td>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {des.map((de) => (
              <ExamRow key={de.id} de={de} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllExams;
