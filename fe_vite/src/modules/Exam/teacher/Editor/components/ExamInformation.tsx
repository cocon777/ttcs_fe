import { CircleAlert } from "lucide-react";
import getExamStats from "../utils/getExamStats";
import type { NoiDungDe } from "../utils/formatExam";

interface ExamInformationButtonProps {
  de: NoiDungDe;
}

const ExamInformation: React.FC<ExamInformationButtonProps> = (props) => {
  const { de } = props;

  const { totalMultiChoice, totalUnanswered } = getExamStats(de);

  const diemMoiCau =
    totalMultiChoice > 0 ? Math.round((10 / totalMultiChoice) * 100) / 100 : 0;
  return (
    <div className="flex items-center justify-center gap-2 border-x border-slate-300 px-1 py-2.5">
      <CircleAlert
        strokeWidth={1.6}
        className="size-4 text-gray-800 dark:text-slate-300"
      />
      <div className="text-[13px] text-gray-900 dark:text-slate-300">Tổng:</div>
      <div className="text-[14px] text-gray-500 dark:text-slate-400">
        {totalMultiChoice} câu · {diemMoiCau} đ/câu
        {totalUnanswered > 0 && (
          <span className="ml-1 text-red-500">
            ({totalUnanswered} chưa có đáp án)
          </span>
        )}
      </div>
    </div>
  );
};

export default ExamInformation;
