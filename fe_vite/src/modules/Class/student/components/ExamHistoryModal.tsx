// ExamHistoryModal.tsx
import { useState } from "react";
import type {
  ExamListItem,
  LichSuItem,
  ChiTietKetQua,
} from "../../../../services/apis/examAPI";
import examAPI from "../../../../services/apis/examAPI";
import renderContent from "../../../../share/utils/renderContent";

type Props = {
  exam: ExamListItem;
  historyList: LichSuItem[];
  historyLoading: boolean;
  isAfterEnd: boolean;
  onClose: () => void;
};

const formatDuration = (seconds: number) => {
  if (!seconds || seconds === 0) return "0 giây";
  if (seconds >= 3600) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return m > 0 ? `${h} giờ ${m} phút` : `${h} giờ`;
  }
  if (seconds >= 60) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return s > 0 ? `${m} phút ${s} giây` : `${m} phút`;
  }
  return `${seconds} giây`;
};

const ExamHistoryModal = ({
  exam,
  historyList,
  historyLoading,
  isAfterEnd,
  onClose,
}: Props) => {
  const [expandedAttemptId, setExpandedAttemptId] = useState<number | null>(
    null,
  );
  const [attemptDetails, setAttemptDetails] = useState<
    Record<number, ChiTietKetQua | null>
  >({});
  const [loadingAttemptId, setLoadingAttemptId] = useState<number | null>(null);

  const handleToggleAttemptDetail = async (ketQuaId: number) => {
    if (exam.phamViGiao === "LOP" && !isAfterEnd) return;

    if (expandedAttemptId === ketQuaId) {
      setExpandedAttemptId(null);
      return;
    }
    setExpandedAttemptId(ketQuaId);
    if (attemptDetails[ketQuaId] !== undefined) return;

    setLoadingAttemptId(ketQuaId);
    const detail = await examAPI.getChiTietKetQuaByKetQuaId(String(ketQuaId));
    setAttemptDetails((prev) => ({ ...prev, [ketQuaId]: detail }));
    setLoadingAttemptId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-4xl rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-xl border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Lịch sử làm bài
            </h2>
            <p className="text-sm text-slate-500">{exam.title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-2xl font-bold text-slate-400 hover:text-red-500"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {historyLoading ? (
            <div className="py-12 text-center text-slate-500">
              Đang tải lịch sử...
            </div>
          ) : historyList.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-slate-500">
                Bạn chưa có lịch sử làm bài cho đề thi này.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {historyList.map((item) => {
                const isExpanded = expandedAttemptId === item.ketQuaId;
                const detail = attemptDetails[item.ketQuaId];
                const isLoadingThis = loadingAttemptId === item.ketQuaId;
                const isAssignedAndBeforeEnd =
                  exam.phamViGiao === "LOP" && !isAfterEnd;

                return (
                  <div
                    key={item.ketQuaId}
                    className="overflow-hidden rounded-xl border border-slate-200"
                  >
                    {/* Summary row */}
                    <div className="flex items-center justify-between bg-slate-50 px-5 py-4">
                      <div className="flex items-center gap-6">
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-700">
                          Lần {item.lanThu}
                        </span>
                        <span className="text-sm font-semibold text-slate-800">
                          Điểm:{" "}
                          <span className="text-blue-600">
                            {item.diemSo ?? 0}/10
                          </span>
                        </span>
                        <span className="text-sm text-slate-500">
                          ⏱ {formatDuration(item.thoiGianLamGiay)}
                        </span>
                      </div>
                      <button
                        onClick={() => handleToggleAttemptDetail(item.ketQuaId)}
                        disabled={isAssignedAndBeforeEnd}
                        title={
                          isAssignedAndBeforeEnd
                            ? "Chi tiết bị khóa cho đến khi đề kết thúc"
                            : undefined
                        }
                        className={`rounded-lg border px-4 py-1.5 text-sm font-semibold transition ${
                          isAssignedAndBeforeEnd
                            ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400"
                            : "border-blue-200 text-blue-600 hover:bg-blue-50"
                        }`}
                      >
                        {isExpanded ? "Thu gọn ▲" : "Xem chi tiết ▼"}
                      </button>
                    </div>

                    {/* Expanded */}
                    {isExpanded && (
                      <div className="border-t border-slate-200 bg-white p-5">
                        {isLoadingThis ? (
                          <p className="py-6 text-center text-slate-500">
                            Đang tải chi tiết...
                          </p>
                        ) : (
                          <div className="space-y-5">
                            {item.nhanXetHeThong && (
                              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                                <p className="mb-2 text-sm font-bold text-slate-700">
                                  🤖 Nhận xét hệ thống:
                                </p>
                                <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
                                  {item.nhanXetHeThong}
                                </p>
                              </div>
                            )}

                            {item.nhanXetGiaoVien && (
                              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                                <p className="mb-2 text-sm font-bold text-blue-700">
                                  👩‍🏫 Nhận xét của giáo viên:
                                </p>
                                <p className="whitespace-pre-wrap text-sm leading-relaxed text-blue-800">
                                  {item.nhanXetGiaoVien}
                                </p>
                              </div>
                            )}

                            {detail && detail.cauHoiList.length > 0 && (
                              <div>
                                <p className="mb-3 border-b-2 border-blue-500 pb-2 text-sm font-bold uppercase tracking-wide text-blue-600">
                                  Chi tiết bài làm
                                </p>
                                <div className="space-y-3">
                                  {detail.cauHoiList.map((cauHoi) => (
                                    <article
                                      key={cauHoi.cauHoiId}
                                      className="rounded-lg border border-slate-200 bg-white p-4"
                                    >
                                      <p className="text-sm font-bold text-slate-900">
                                        Câu {cauHoi.thuTu}:{" "}
                                        {renderContent(cauHoi.noiDung)}
                                      </p>
                                      <div className="mt-3 grid gap-2 text-sm text-slate-700 md:grid-cols-2">
                                        {cauHoi.luaChons.map((luaChon) => {
                                          const isSelected =
                                            cauHoi.dapAnDaChon ===
                                            luaChon.kyHieu;
                                          const isCorrect = luaChon.laDapAn;
                                          return (
                                            <p
                                              key={`${cauHoi.cauHoiId}-${luaChon.kyHieu}`}
                                              className={`rounded border px-3 py-2 ${
                                                isCorrect
                                                  ? "border-emerald-400 bg-emerald-50"
                                                  : isSelected
                                                    ? "border-rose-400 bg-rose-50"
                                                    : "border-slate-200 bg-white"
                                              }`}
                                            >
                                              <span className="font-semibold">
                                                {luaChon.kyHieu}.
                                              </span>{" "}
                                              {renderContent(luaChon.noiDung)}
                                            </p>
                                          );
                                        })}
                                      </div>
                                      <div className="mt-3 flex flex-wrap gap-3 text-sm">
                                        <span className="font-semibold text-emerald-600">
                                          ✓ Đáp án đúng:{" "}
                                          {cauHoi.dapAnDung || "-"}
                                        </span>
                                        {cauHoi.dapAnDaChon &&
                                          cauHoi.dapAnDaChon !==
                                            cauHoi.dapAnDung && (
                                            <span className="font-semibold text-rose-600">
                                              ✗ Đã chọn: {cauHoi.dapAnDaChon}
                                            </span>
                                          )}
                                      </div>
                                    </article>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamHistoryModal;
