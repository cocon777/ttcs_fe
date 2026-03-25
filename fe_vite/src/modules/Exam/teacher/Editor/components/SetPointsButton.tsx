import { SquareDivide } from "lucide-react";
import { useState } from "react";
import type { NoiDungDe } from "../utils/formatExam";

interface SetPointsButtonProps {
  de: NoiDungDe;
  setDe: React.Dispatch<React.SetStateAction<NoiDungDe>>;
}

const SetPointsButton: React.FC<SetPointsButtonProps> = (props) => {
  const { de, setDe } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [tongDiem, setTongDiem] = useState<number>(0);

  const soCau = de ? Object.keys(de.cauHois).length : 0;

  const handleChiaDiem = () => {
    if (tongDiem <= 0) return;
    if (!de || soCau === 0) return;

    const diemMoiCau = tongDiem / soCau;

    const cauHoisMoi = Object.fromEntries(
      Object.entries(de.cauHois).map(([key, cauHoi]) => [
        key,
        { ...cauHoi, diem: diemMoiCau },
      ]),
    );

    setDe({ cauHois: cauHoisMoi });
    setIsOpen(false);
  };

  return (
    <div>
      <button
        type="button"
        className="flex items-center justify-center gap-1.5 rounded-md border-x border-slate-300 bg-blue-800 px-3 py-1.5 shadow-sm hover:cursor-pointer hover:bg-blue-700 dark:border-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <SquareDivide strokeWidth={1.6} className="size-4 text-white" />
        <div className="text-xs font-medium text-white">Chia điểm</div>
      </button>

      {isOpen && (
        <div
          className="fixed right-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-black/50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-5/6 max-w-[600px] rounded-md border-x border-slate-300 bg-white px-4 py-3 shadow-sm dark:border-none dark:bg-darkmode-600"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="py-3 text-base font-semibold dark:text-slate-300">
              Chia điểm nhanh
            </div>

            <div className="py-3">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm dark:text-slate-300">
                  Tổng điểm ({soCau} câu hỏi)
                </div>
                <input
                  type="number"
                  className="w-24 appearance-none rounded-md border border-gray-300 px-3 py-2 text-center text-sm dark:bg-darkmode-800 dark:text-slate-300"
                  defaultValue={tongDiem}
                  onChange={(e) => setTongDiem(Number(e.target.value))}
                />
              </div>
              {tongDiem <= 0 && (
                <p className="mt-1 text-xs text-red-500">
                  Vui lòng nhập điểm lớn hơn 0
                </p>
              )}
            </div>

            <div className="float-right flex items-center justify-center gap-3 py-3">
              <div
                className="rounded border px-8 py-2 hover:cursor-pointer hover:bg-gray-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-darkmode-400"
                onClick={() => setIsOpen(false)}
              >
                Đóng
              </div>
              <div
                className="rounded bg-blue-800 px-8 py-2 hover:cursor-pointer hover:bg-blue-700"
                onClick={handleChiaDiem}
              >
                <div className="text-white">Chia điểm</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SetPointsButton;
