import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import type { ExamListItem } from "../../../../services/apis/examAPI";

type ClassExamCardProps = {
  exam: ExamListItem;
  classId?: string;
};

const ClassExamCard = ({ exam, classId }: ClassExamCardProps) => {
  const previewPath = classId
    ? `/student/exams/${exam.id}?classId=${encodeURIComponent(classId)}`
    : `/student/exams/${exam.id}`;

  const formatTimeDisplay = (value?: string | null) => {
    if (!value) return "--";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "--";

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${hours}:${minutes} ${day}-${month}-${year}`;
  };

  // Determine if the exam can be started now
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

  return (
    <div className="rounded-md bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">{exam.title}</h2>
      {/* <p className="mt-2 text-sm text-slate-600">
        Số câu: {exam.questions.length}
      </p> */}
      <p className="mt-1 text-sm text-slate-600">
        Thời gian: {Math.floor(exam.durationSeconds / 60)} phút
      </p>
      {(exam.batDau || exam.ketThuc) ? (
        <div className="mt-2 space-y-1 text-xs text-slate-500">
          {exam.batDau ? (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 flex-shrink-0 text-slate-400" strokeWidth={2} />
              {formatTimeDisplay(exam.batDau)}
            </div>
          ) : null}
          {exam.ketThuc ? (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 flex-shrink-0 text-slate-400" strokeWidth={2} />
              {formatTimeDisplay(exam.ketThuc)}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="mt-4">
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
            className="inline-flex rounded-md bg-slate-300 px-4 py-2 text-sm font-medium text-white cursor-not-allowed"
          >
            Vào Làm
          </button>
        )}
      </div>
    </div>
  );
};

export default ClassExamCard;
