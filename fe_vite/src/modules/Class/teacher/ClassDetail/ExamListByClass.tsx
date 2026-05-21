import { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import examAPI from "../../../../services/apis/examAPI";
import { useNavigate } from "react-router-dom";
import type { ExamListByClassProps } from "./interface/interface";

const ExamListByClass = ({ classId }: ExamListByClassProps) => {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Tải danh sách đề thi của lớp
  const loadExams = useCallback(async () => {
    setLoading(true);
    try {
      // Đảm bảo truyền classId là string
      const res = await examAPI.getExamListByClass(String(classId));
      let arr: any[] = [];
      if (res && Array.isArray(res)) arr = res;
      else if (
        res &&
        typeof res === "object" &&
        Array.isArray((res as any).data)
      )
        arr = (res as any).data;
      setExams(arr);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách đề thi!", err);
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    loadExams();
  }, [loadExams]);


  const formatDateTime = (value?: string | null) => {
    if (!value) return "---";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "---";
    return date.toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden mt-8">
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Danh sách đề thi đã giao cho lớp
          </h2>
          <p className="text-sm text-slate-500">
            Quản lý các đề thi đã được giao cho lớp học này
          </p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100/80 border-b border-slate-200">
              <th className="p-4 font-bold text-slate-700 w-16">STT</th>
              <th className="p-4 font-bold text-slate-700">Tiêu đề</th>
              <th className="p-4 font-bold text-slate-700">Mã đề</th>
              <th className="p-4 font-bold text-slate-700">Thời gian</th>
              <th className="p-4 font-bold text-slate-700">Ngày giao</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-10 text-center">
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <Loader2 size={32} className="animate-spin" />
                    <p>Đang lấy danh sách đề thi...</p>
                  </div>
                </td>
              </tr>
            ) : exams.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-10 text-center text-slate-400 italic"
                >
                  Lớp học hiện tại chưa có đề thi nào.
                </td>
              </tr>
            ) : (
              exams.map((item, index) => (
                <tr
                  key={item.id || index}
                  className="border-b border-slate-50 hover:bg-blue-50/30 transition-colors cursor-pointer"
                  onClick={() =>
                    navigate(`/teacher/class/${classId}/exam/${item.id}/detail`)
                  }
                >
                  <td className="p-4 text-slate-500">{index + 1}</td>
                  <td className="p-4 font-semibold text-slate-800">
                    {item.tieuDe || item.title || "Không có tiêu đề"}
                  </td>
                  <td className="p-4">
                    <span className="bg-slate-100 px-2 py-1 rounded text-xs font-mono font-bold text-slate-600">
                      {item.maHash || "---"}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500">
                    {item.thoiGian
                      ? item.thoiGian + " phút"
                      : item.durationSeconds
                        ? Math.round(item.durationSeconds / 60) + " phút"
                        : "---"}
                  </td>
                  <td className="p-4 text-slate-500">
                    {formatDateTime(item.batDau ?? item.createdAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExamListByClass;
