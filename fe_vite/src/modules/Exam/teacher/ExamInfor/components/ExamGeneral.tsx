import { Calendar, Copy, Share2, User } from "lucide-react";
import CopyBox from "../../../../../share/components/CopyBox/CopyBox";
import { DateTimeFormat, isoDateUtil } from "../../../../../share/utils/date";
import type { De } from "../../../../../share/interfaces/exam.interface";

interface ExamGeneralProps {
  de: De;
}

export const ExamGeneral: React.FC<ExamGeneralProps> = (props) => {
  const { de } = props;

  const nguoiTao = de.nguoiTao;
  const { tieuDe, createdAt } = de;

  const deURL = `http://localhost:3000/exam/${de?.maHash}`;

  const handleCopyExamURL = () => {
    navigator.clipboard.writeText(deURL);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col items-start justify-between md:flex-row md:items-center">
        <div className="text-lg font-semibold">{tieuDe}</div>

        <div className="flex items-center gap-2">
          <CopyBox copyText={deURL}>
            <div
              className="flex gap-2 rounded-md border border-blue-800 px-2 py-1.5 hover:cursor-pointer hover:bg-slate-100 dark:bg-darkmode-700 dark:hover:bg-darkmode-600"
              onClick={handleCopyExamURL}
            >
              <Copy className="size-4 text-blue-700" />
              <div className="text-xs font-semibold text-blue-900 dark:text-blue-700">
                Copy link
              </div>
            </div>
          </CopyBox>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Calendar strokeWidth={1.5} className="size-4" />
          <div className="text-sm">{`Ngày tạo: ${isoDateUtil.toDateAndTime(createdAt, DateTimeFormat.FULL_DATE_TIME_FORMAT)}`}</div>
        </div>

        <div className="flex items-center gap-2">
          <User strokeWidth={1.5} className="size-4" />
          <div className="text-sm">{`Người tạo: ${nguoiTao?.id}`}</div>
        </div>
      </div>
    </div>
  );
};
