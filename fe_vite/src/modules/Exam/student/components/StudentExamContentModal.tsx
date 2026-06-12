import { useEffect, useState } from "react";
import CreateExamAPI from "../../../../services/apis/createExamAPI";

import renderContent from "../../../../share/utils/renderContent";

interface StudentExamContentModalProps {
  deId: number;
  tieuDe: string;
  onClose: () => void;
}

const StudentExamContentModal = ({
  deId,
  tieuDe,
  onClose,
}: StudentExamContentModalProps) => {
  const [de, setDe] = useState<any>(null);
  const [showAnswers, setShowAnswers] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    CreateExamAPI.getContent(String(deId)).then((res) => {
      if (res?.data) setDe(res.data);
      setLoading(false);
    });
  }, [deId]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="grid h-[82vh] w-[820px] max-w-[92vw] grid-rows-[auto,auto,1fr] rounded-xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
          <div>
            <p className="font-semibold text-gray-800">{tieuDe}</p>
            <p className="text-xs text-gray-400">Nội dung đề thi</p>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-xl font-bold text-slate-400 hover:text-red-500"
          >
            ×
          </button>
        </div>

        {/* Toggle đáp án – điểm khác biệt so với ExamContent của GV */}
        <div className="flex items-center gap-3 border-b border-gray-200 bg-gray-50 px-5 py-2.5">
          <span className="text-sm font-medium text-gray-600">
            Hiển thị đáp án
          </span>
          <button
            onClick={() => setShowAnswers((prev) => !prev)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              showAnswers ? "bg-blue-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                showAnswers ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          {showAnswers && (
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
              Đang hiện đáp án
            </span>
          )}
        </div>

        {/* Nội dung câu hỏi – tái sử dụng logic render từ ExamContent.tsx */}
        <div className="space-y-4 overflow-y-auto px-5 py-4">
          {loading ? (
            <div className="py-12 text-center text-gray-400">Đang tải...</div>
          ) : (
            de?.cauHois?.map((cauHoi: any) => {
              const dapAnDung = cauHoi.luaChons
                .filter((lc: any) => lc.laDapAn)
                .map((lc: any) => lc.kyHieu);

              return (
                <div
                  key={cauHoi.id}
                  className="rounded-xl border border-gray-200 p-4 shadow-sm"
                >
                  <p className="font-semibold text-gray-800">
                    Câu {cauHoi.thuTu}:{" "}
                    <span className="font-normal">
                      {renderContent(cauHoi.noiDung)}
                    </span>
                  </p>

                  <ul className="mt-3 space-y-1.5">
                    {cauHoi.luaChons.map((lc: any) => (
                      <li
                        key={lc.kyHieu}
                        className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                          showAnswers && lc.laDapAn
                            ? "border-emerald-400 bg-emerald-50 font-semibold text-emerald-700"
                            : "border-gray-200"
                        }`}
                      >
                        <span className="font-semibold">{lc.kyHieu}.</span>{" "}
                        {renderContent(lc.noiDung)}
                      </li>
                    ))}
                  </ul>

                  {showAnswers && dapAnDung.length > 0 && (
                    <p className="mt-2.5 text-sm font-semibold text-emerald-600">
                      ✓ Đáp án: {dapAnDung.join(", ")}
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
export default StudentExamContentModal;
