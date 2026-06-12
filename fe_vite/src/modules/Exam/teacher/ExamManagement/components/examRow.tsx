import { useNavigate } from "react-router-dom";
import type { De } from "../../../../../share/interfaces/exam.interface";

interface DeHang {
  de: De;
}

const ExamRow: React.FC<DeHang> = ({ de }) => {
  const navigate = useNavigate();
  const { tieuDe, daXuatBan, khoiLopTen, monHocTen, updatedAt } = de;

  const handleRowClick = () => {
    navigate(`/teacher/exam/exam-infor/${de.id}`);
  };

  const formatDate = (iso?: string) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <tr
      className="group transition-all duration-150 hover:cursor-pointer hover:bg-blue-100 hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:text-gray-400 dark:hover:bg-darkmode-500"
      onClick={handleRowClick}
    >
      <td className="px-6 py-4">
        <div className="whitespace-nowrap font-bold text-slate-700 dark:text-gray-300">
          {tieuDe}
        </div>
      </td>

      <td className="px-6 py-4 text-slate-600 dark:text-gray-400">
        {daXuatBan ? (
          <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
            Đã xuất bản
          </span>
        ) : (
          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-red-500">
            Chưa xuất bản
          </span>
        )}
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          {khoiLopTen ? (
            <span className="rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-600">
              {khoiLopTen}
            </span>
          ) : (
            <span className="text-xs text-slate-400">—</span>
          )}
          {monHocTen && (
            <span className="rounded-md bg-cyan-50 px-2 py-1 text-xs font-medium text-cyan-600">
              {monHocTen}
            </span>
          )}
        </div>
      </td>

      <td className="px-6 py-4 text-slate-600 dark:text-gray-400">
        {de.giaoChoLop && de.giaoChoLop.length > 0
          ? de.giaoChoLop.map((gcl) => gcl.lop?.tenLop).join(", ")
          : "—"}
      </td>

      <td className="px-6 py-4 text-xs text-slate-500 dark:text-gray-400">
        {formatDate(updatedAt)}
      </td>
    </tr>
  );
};

export default ExamRow;