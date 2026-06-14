import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import type {
  ExamListItem,
  LichSuItem,
} from "../../../../services/apis/examAPI";
import examAPI from "../../../../services/apis/examAPI";
import ExamHistoryModal from "./ExamHistoryModal";

type ClassExamCardProps = {
  exam: ExamListItem;
  classId?: string;
};

const ClassExamCard = ({ exam, classId }: ClassExamCardProps) => {
  const previewPath = classId
    ? `/student/exams/${exam.id}?classId=${encodeURIComponent(classId)}`
    : `/student/exams/${exam.id}`;

  const [showHistory, setShowHistory] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyList, setHistoryList] = useState<LichSuItem[]>([]);

  const now = Date.now();
  const parseSafe = (v?: string | null) => {
    if (!v) return null;
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? null : d;
  };
  const startDate = parseSafe(exam.batDau);
  const endDate = parseSafe(exam.ketThuc);
  const isBeforeStart = startDate ? now < startDate.getTime() : false;
  const isAfterEnd = endDate ? now > endDate.getTime() : false;
  const disabled = isBeforeStart || isAfterEnd;

  const getHocSinhId = (): number | null => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return null;
      return JSON.parse(raw)?.id ?? null;
    } catch {
      return null;
    }
  };

  const handleOpenHistory = async () => {
    const hocSinhId = getHocSinhId();
    if (!hocSinhId) return;
    setShowHistory(true);
    setHistoryLoading(true);
    const list = await examAPI.getLichSuLamBai(hocSinhId, Number(exam.id));
    setHistoryList(list);
    setHistoryLoading(false);
  };

  const formatTimeDisplay = (value?: string | null) => {
    if (!value) return "--";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "--";
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${hours}:${minutes} ${day}-${month}-${date.getFullYear()}`;
  };

  return (
    <>
      <div className="rounded-md bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">{exam.title}</h2>
        <p className="mt-1 text-sm text-slate-600">
          Thời gian: {Math.floor(exam.durationSeconds / 60)} phút
        </p>

        {(exam.batDau || exam.ketThuc) && (
          <div className="mt-2 space-y-1 text-xs text-slate-500">
            {exam.batDau && (
              <div className="flex items-center gap-2">
                <Calendar
                  className="h-4 w-4 flex-shrink-0 text-slate-400"
                  strokeWidth={2}
                />
                Thời gian bắt đầu: {formatTimeDisplay(exam.batDau)}
              </div>
            )}
            {exam.ketThuc && (
              <div className="flex items-center gap-2">
                <Calendar
                  className="h-4 w-4 flex-shrink-0 text-slate-400"
                  strokeWidth={2}
                />
                Thời gian kết thúc: {formatTimeDisplay(exam.ketThuc)}
              </div>
            )}
          </div>
        )}

        <div className="mt-4 flex items-center gap-3">
          {!disabled ? (
            <Link
              to={previewPath}
              className="inline-flex rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
            >
              Vào Làm
            </Link>
          ) : (
            <button
              disabled
              className="inline-flex cursor-not-allowed rounded-md bg-slate-300 px-4 py-2 text-sm font-medium text-white"
            >
              Vào Làm
            </button>
          )}
          <button
            onClick={handleOpenHistory}
            disabled={!isAfterEnd}
            title={
              !isAfterEnd
                ? "Lịch sử chỉ xem sau khi đề thi kết thúc"
                : undefined
            }
            className={`inline-flex rounded-md border px-4 py-2 text-sm font-medium ${
              !isAfterEnd
                ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400"
                : "border-slate-300 text-slate-600 hover:bg-slate-50"
            }`}
          >
            📋 Lịch sử
          </button>
        </div>
      </div>

      {showHistory && (
        <ExamHistoryModal
          exam={exam}
          historyList={historyList}
          historyLoading={historyLoading}
          isAfterEnd={isAfterEnd}
          onClose={() => setShowHistory(false)}
        />
      )}
    </>
  );
};

export default ClassExamCard;
