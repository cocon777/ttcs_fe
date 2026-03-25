import { Check } from "lucide-react";
import type { NoiDungDe } from "../utils/formatExam";

interface QuestionBoxProps {
  cauHoiKey: string;
  de: NoiDungDe;
  handleGoToLine: () => void;
}

const QuestionBox: React.FC<QuestionBoxProps> = (props) => {
  const { cauHoiKey, de, handleGoToLine } = props;
  const { noiDung, luaChons, mucDo, thuTu, diem } = de.cauHois[cauHoiKey];

  return (
    <div
      className="w-full rounded-md border border-gray-400 bg-white py-6 transition-all duration-200 hover:border-blue-500 hover:shadow-[0_0_0_2px_rgba(59,130,246,0.2)]"
      id={`question-${thuTu}`}
    >
      <div className="flex items-center gap-2 px-7 text-sm">
        <div className="rounded-sm border border-gray-400 px-3 py-0.5">
          <div className="text-sm font-semibold text-blue-600">{cauHoiKey}</div>
        </div>

        {/* Hiển thị điểm */}
        <div className="border-r border-gray-400 pr-3">
          <div className="text-sm text-blue-700">
            {diem > 0 ? (
              <div className="text-sm text-blue-700">
                {Math.round(diem * 100) / 100} Điểm
              </div>
            ) : (
              <div className="text-sm text-red-500">Chưa có điểm</div>
            )}
          </div>
        </div>

        <div className="rounded-sm border border-gray-400 px-2 py-0.5 text-sm text-gray-600 dark:text-slate-300">
          {mucDo}
        </div>
      </div>

      <div className="mt-2 space-y-1 px-7">
        <div
          className="rounded-sm border border-gray-300 p-1 hover:cursor-pointer"
          onClick={handleGoToLine}
        >
          <div className="text-sm">{noiDung}</div>
        </div>

        {Object.keys(luaChons).map((kyHieu) => {
          const { noiDung: noiDungLuaChon, laDapAn } = luaChons[kyHieu];

          return (
            <div
              className="relative flex items-center justify-start gap-1"
              key={kyHieu}
            >
              {laDapAn && (
                <Check className="-ml-4 size-3 text-blue-700" strokeWidth={5} />
              )}

              <div
                className={
                  "rounded-sm border p-1 px-1.5 " +
                  (laDapAn
                    ? "border-blue-700 text-blue-700"
                    : "border-gray-300")
                }
              >
                <div className="text-sm font-semibold">{kyHieu}</div>
              </div>

              <div
                className={
                  "rounded-sm border p-1 pl-1.5 pr-5 " +
                  (laDapAn
                    ? "border-blue-700 text-blue-700"
                    : "border-gray-300")
                }
              >
                <div className="text-sm">{noiDungLuaChon}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionBox;
