import { Copy } from "lucide-react";
import toast from "react-hot-toast";
interface StudentCodeCardProps {
  maHS: string | null | undefined;
}

const StudentCodeCard = ({ maHS }: StudentCodeCardProps) => {
  const handleCopy = () => {
    if (!maHS) return;
    navigator.clipboard.writeText(maHS);
    toast.success("Đã sao chép mã học sinh!");
  };

  return (
    <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 dark:border-blue-900/40 dark:bg-blue-900/10">
      <div className="flex-1">
        <p className="text-xs font-medium text-blue-500 dark:text-blue-400">
          Mã học sinh của bạn
        </p>
        <p className="mt-0.5 text-lg font-bold tracking-widest text-blue-800 dark:text-blue-300">
          {maHS ?? "Chưa có mã"}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Báo mã này cho giáo viên để được thêm vào lớp học
        </p>
      </div>
      <button
        onClick={handleCopy}
        disabled={!maHS}
        className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
      >
        <Copy className="size-3.5" />
        Sao chép
      </button>
    </div>
  );
};

export default StudentCodeCard;
