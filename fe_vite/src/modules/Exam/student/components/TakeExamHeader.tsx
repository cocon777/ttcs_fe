import Timer from "./Timer";
interface TakeExamHeaderProps {
  title: string;
  studentName: string;
  durationSeconds: number;
  onTimeUp: () => void;
  onSubmit: () => void;
  submitting?: boolean;
}

const TakeExamHeader = ({
  title,
  studentName,
  durationSeconds,
  onTimeUp,
  onSubmit,
  submitting = false,
}: TakeExamHeaderProps) => {
  return (
    <header className="flex flex-shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-3">
      <div className="flex items-center gap-3">
        <Timer initialSeconds={durationSeconds} onTimeUp={onTimeUp} />
      </div>

      <div className="flex-1 text-center">
        <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-xs font-medium text-slate-500">Thí sinh</p>
          <p className="text-sm font-semibold text-slate-900">{studentName}</p>
        </div>
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          {submitting ? "Dang nop..." : "Nộp bài"}
        </button>
      </div>
    </header>
  );
};

export default TakeExamHeader;
