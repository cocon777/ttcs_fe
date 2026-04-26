import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CreateExamAPI from "../../../../services/apis/createExamAPI";
import type { De } from "../../../../share/interfaces/exam.interface";

const StudentExamManagement = () => {
  const navigate = useNavigate();
  const [dsDe, setDsDe] = useState<De[]>([]);
  const [modal, setModal] = useState<{
    deId: number;
    tieuDe: string;
    thoiGian: number | null;
  } | null>(null);
  const [thoiGianInput, setThoiGianInput] = useState<number>(30);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    CreateExamAPI.getPreviewsExamList().then((res) => {
      if (res?.data) setDsDe(res.data);
    });
  }, []);

  const openModal = (de: De) => {
    setThoiGianInput(de.thoiGian ?? 30);
    setModal({ deId: de.id, tieuDe: de.tieuDe, thoiGian: de.thoiGian });
  };

  const handleStart = async () => {
    if (!modal) return;
    setStarting(true);
    await CreateExamAPI.updateDuration(modal.deId, thoiGianInput);
    // Lưu thời điểm bắt đầu
    localStorage.setItem(
      `student.exam.startAt.${modal.deId}`,
      String(Date.now()),
    );
    navigate(`/student/take-exam/${modal.deId}`);
  };

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-800">Đề thi của tôi</h1>
        <Link
          to="/student/exam-editor"
          className="flex h-10 items-center gap-2 rounded-md bg-blue-500 px-6 text-sm font-bold text-white"
        >
          Tạo đề thi
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg bg-white shadow-md">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200">
            <tr className="text-gray-800">
              <td className="px-6 py-4 font-semibold">Tiêu đề</td>
              <td className="px-6 py-4 font-semibold">Thời gian</td>
              <td className="px-6 py-4 font-semibold">Ngày tạo</td>
              <td className="px-6 py-4 font-semibold"></td>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {dsDe.map((de) => (
              <tr key={de.id} className="hover:bg-blue-50">
                <td className="px-6 py-4 font-medium text-slate-700">
                  {de.tieuDe}
                </td>
                <td className="px-6 py-4 text-slate-500">
                  {de.thoiGian ? `${de.thoiGian} phút` : "Chưa đặt"}
                </td>
                <td className="px-6 py-4 text-slate-500">
                  {de.createdAt
                    ? new Date(de.createdAt).toLocaleDateString("vi-VN")
                    : "—"}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => openModal(de)}
                    className="rounded-md bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                  >
                    Làm bài
                  </button>
                </td>
              </tr>
            ))}
            {dsDe.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-sm text-slate-400"
                >
                  Chưa có đề nào. Hãy tạo đề mới!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal cấu hình thời gian */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setModal(null)}
        >
          <div
            className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-1 text-base font-semibold text-gray-800">
              {modal.tieuDe}
            </h2>
            <p className="mb-4 text-xs text-gray-500">
              Đặt thời gian trước khi bắt đầu làm bài
            </p>

            <label className="mb-1 block text-sm font-medium text-gray-700">
              Thời gian làm bài (phút)
            </label>
            <input
              type="number"
              min={1}
              value={thoiGianInput}
              onChange={(e) => setThoiGianInput(Number(e.target.value))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
            <p className="mt-1 text-xs text-gray-400">
              Nhập 0 để không giới hạn thời gian
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setModal(null)}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleStart}
                disabled={starting}
                className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {starting ? "Đang vào..." : "Bắt đầu"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentExamManagement;
