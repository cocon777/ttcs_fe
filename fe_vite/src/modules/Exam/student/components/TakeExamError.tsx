interface TakeExamErrorProps {
  error: string | null;
  onBack: () => void;
  onRetry: () => void;
}

const TakeExamError = ({ error, onBack, onRetry }: TakeExamErrorProps) => {
  return (
    <div className="flex h-screen items-center justify-center px-4 py-6">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-lg font-semibold text-slate-900">
          Không thể mở đề thi
        </p>
        <p className="mt-2 text-sm text-slate-600">
          {error ?? "Du lieu de thi khong hop le"}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Về trang học sinh
          </button>
          <button
            type="button"
            onClick={onRetry}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Thử lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default TakeExamError;
