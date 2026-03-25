// import { DateTimeFormat, isoDateUtil } from "../../../../../Utils/date";
import { useNavigate } from "react-router-dom";
import type { De } from "../../../../../share/interfaces/exam.interface";
interface DeHang {
  de: De;
}

const ExamRow: React.FC<DeHang> = (props) => {
  const navigate = useNavigate();

  const { de } = props;
  const { tieuDe, daXuatBan } = de;

  const handleRowClick = () => {
    navigate(`/teacher/exam/exam-results-list/${de.id}`);
  };

  return (
    <tr
      className="group transition-all duration-150 hover:cursor-pointer hover:bg-blue-100 hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:text-gray-400 dark:hover:bg-darkmode-500"
      onClick={handleRowClick}
    >
      <td className="px-6 py-4">
        <div className="whitespace-nowrap font-medium text-slate-700 dark:text-gray-300">
          {tieuDe}
        </div>
      </td>
      <td className="px-6 py-4 text-slate-600 dark:text-gray-400">
        {daXuatBan ? "Đã xuất bản" : "Chưa xuất bản"}
      </td>
      <td className="px-6 py-4 text-slate-600 dark:text-gray-400">
        {de.giaoChoLop && de.giaoChoLop.length > 0
          ? de.giaoChoLop.map((gcl) => gcl.lop?.tenLop).join(", ")
          : "—"}
      </td>
    </tr>
  );
};

export default ExamRow;
