import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import CreateExamAPI from "../../../../services/apis/createExamAPI";
import examAPI from "../../../../services/apis/examAPI";
import type { De } from "../../../../share/interfaces/exam.interface";
import type {
  LichSuItem,
  ExamListItem,
} from "../../../../services/apis/examAPI";
type ModalType = "duration" | "content" | "history" | null;
import StudentExamContentModal from "./StudentExamContentModal";
import ExamHistoryModal from "../../../Class/student/components/ExamHistoryModal";

interface StudentExamCardProps {
  de: De;
  onDeleted?: (id: number) => void;
}

const StudentExamCard = ({ de, onDeleted }: StudentExamCardProps) => {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [thoiGianInput, setThoiGianInput] = useState<number>(de.thoiGian ?? 30);
  const [starting, setStarting] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyList, setHistoryList] = useState<LichSuItem[]>([]);

  const getHocSinhId = (): number | null => {
    try {
      return JSON.parse(localStorage.getItem("user") ?? "{}")?.id ?? null;
    } catch {
      return null;
    }
  };

  const handleOpenHistory = async () => {
    setActiveModal("history");
    setHistoryLoading(true);
    const id = getHocSinhId();
    if (id) {
      const list = await examAPI.getLichSuLamBai(id, de.id);
      setHistoryList(list);
    }
    setHistoryLoading(false);
  };

  const handleStart = async () => {
    setStarting(true);
    await CreateExamAPI.updateDuration(de.id, thoiGianInput);
    localStorage.setItem(`student.exam.startAt.${de.id}`, String(Date.now()));
    navigate(`/student/take-exam/${de.id}`);
  };

  // Chuyển De → ExamListItem để tái sử dụng ExamHistoryModal
  const examListItem: ExamListItem = {
    id: String(de.id),
    title: de.tieuDe,
    durationSeconds: (de.thoiGian ?? 0) * 60,
    gioiHanNop: de.gioiHanNop ?? null,
    questions: [],
    phamViGiao: "TU", // đề tự soạn luôn là TU
    batDau: de.batDau,
    ketThuc: de.ketThuc,
  };

  const handleRemove = async () => {
    if (!de.id) return;

    const response = await CreateExamAPI.remove(String(de.id));

    if (response?.status !== 200) {
      toast.error("Xóa đề thất bại");
      return;
    }

    toast.success("Xóa đề thành công");

    onDeleted?.(de.id);
  };

  return (
    <>
      <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-white px-5 py-4 shadow-sm transition-colors hover:border-blue-200">
        {/* Thông tin đề */}
        <div className="flex min-w-0 items-center gap-6">
          <h3 className="truncate font-semibold text-gray-800">{de.tieuDe}</h3>

          {de.thoiGian && (
            <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              {de.thoiGian} phút
            </span>
          )}

          <span className="shrink-0 text-sm text-gray-400">
            Tạo:{" "}
            {de.createdAt
              ? new Date(de.createdAt).toLocaleDateString("vi-VN")
              : "—"}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveModal("content")}
            className="whitespace-nowrap rounded-md border border-blue-300 px-4 py-1.5 text-xs font-semibold text-gray-600 hover:bg-blue-200"
          >
            📄 Nội dung
          </button>

          <Link
            to={`/student/exam-editor?deId=${de.id}`}
            className="whitespace-nowrap rounded-md border border-blue-300 px-4 py-1.5 text-xs font-semibold text-gray-600 hover:bg-blue-200"
          >
            ✏️ Sửa đề
          </Link>

          <button
            onClick={handleRemove}
            className="whitespace-nowrap rounded-md border border-red-300 px-4 py-1.5 text-xs font-semibold text-gray-600 hover:bg-red-200"
          >
            🗑️ Xóa đề
          </button>

          <button
            onClick={() => setActiveModal("duration")}
            className="whitespace-nowrap rounded-md bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
          >
            ▶ Làm bài
          </button>

          <button
            onClick={handleOpenHistory}
            className="whitespace-nowrap rounded-md border border-blue-300 px-4 py-1.5 text-xs font-semibold text-gray-600 hover:bg-blue-200"
          >
            📋 Lịch sử
          </button>
        </div>
      </div>

      {/* Modal đặt thời gian trước khi làm bài */}
      {activeModal === "duration" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-1 text-base font-semibold text-gray-800">
              {de.tieuDe}
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
                onClick={() => setActiveModal(null)}
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

      {/* Modal nội dung đề */}
      {activeModal === "content" && (
        <StudentExamContentModal
          deId={de.id}
          tieuDe={de.tieuDe}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* Modal lịch sử – tái sử dụng ExamHistoryModal của ClassExamListPage.
          isAfterEnd=true vì đề TU không có giới hạn thời gian xem đáp án */}
      {activeModal === "history" && (
        <ExamHistoryModal
          exam={examListItem}
          historyList={historyList}
          historyLoading={historyLoading}
          isAfterEnd={true}
          onClose={() => setActiveModal(null)}
        />
      )}
    </>
  );
};
export default StudentExamCard;
