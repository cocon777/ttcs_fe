import { ArrowDownUp } from "lucide-react";
import type { NoiDungDe } from "../utils/formatExam";

interface GoToQuestionProps {
  de: NoiDungDe;
}

const GoToQuestion: React.FC<GoToQuestionProps> = ({ de }) => {
  const cauHoiKeys = Object.keys(de.cauHois);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const thuTu = e.target.value;
    const el = document.getElementById(`question-${thuTu}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <ArrowDownUp
        strokeWidth={1.6}
        className="size-5 text-gray-900 dark:text-slate-300"
      />

      <div className="text-[13px] text-gray-900 dark:text-slate-300">
        Đến câu
      </div>

      <select
        className="h-7 w-14 rounded border border-gray-300 px-1 text-center text-blue-600 text-sm font-bold"
        defaultValue=""
        onChange={handleChange}
      >
        <option value="" disabled>
          ---
        </option>
        {cauHoiKeys.map((key) => {
          const { thuTu } = de.cauHois[key];
          return (
            <option key={key} value={thuTu}>
              {thuTu}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default GoToQuestion;
