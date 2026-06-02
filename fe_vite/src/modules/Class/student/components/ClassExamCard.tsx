import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import type { ExamListItem } from "../../../../services/apis/examAPI";
import examAPI from "../../../../services/apis/examAPI";
import type {
  LichSuItem,
  ChiTietKetQua,
} from "../../../../services/apis/examAPI";
import renderContent from "../../../../share/utils/renderContent";

type ClassExamCardProps = {
  exam: ExamListItem;
  classId?: string;
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

const ClassExamCard = ({ exam, classId }: ClassExamCardProps) => {
  const previewPath = classId
    ? `/student/exams/${exam.id}?classId=${encodeURIComponent(classId)}`
    : `/student/exams/${exam.id}`;

  // ===== State lịch sử =====
  const [showHistory, setShowHistory] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyList, setHistoryList] = useState<LichSuItem[]>([]);
  const [expandedAttemptId, setExpandedAttemptId] = useState<number | null>(
    null,
  );
  const [attemptDetails, setAttemptDetails] = useState<
    Record<number, ChiTietKetQua | null>
  >({});
  const [loadingAttemptId, setLoadingAttemptId] = useState<number | null>(null);

  const getHocSinhId = (): number | null => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return null;
      const user = JSON.parse(raw);
      return user?.id ?? null;
    } catch {
      return null;
    }
  };

  const handleOpenHistory = async () => {
    const hocSinhId = getHocSinhId();
    if (!hocSinhId) return;
    setShowHistory(true);
    setHistoryLoading(true);
    setExpandedAttemptId(null);
    setAttemptDetails({});
    const list = await examAPI.getLichSuLamBai(hocSinhId, Number(exam.id));
    setHistoryList(list);
    setHistoryLoading(false);
  };

  const handleToggleAttemptDetail = async (ketQuaId: number) => {
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

  // ===== Tính trạng thái mở/đóng đề =====
  const now = Date.now();
  const parseSafe = (v?: string | null) => {
    if (!v) return null;
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? null : d;
  };
  const startDate = parseSafe(exam.batDau);
  const endDate = parseSafe(exam.ketThuc);
  const isBeforeStart = startDate ? now < startDate.getTime() : false;
  const isAfterEnd = endDate ? now > endDate.getTime() : false;
  const disabled = isBeforeStart || isAfterEnd;

  const formatTimeDisplay = (value?: string | null) => {
    if (!value) return "--";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "--";
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${hours}:${minutes} ${day}-${month}-${year}`;
  };

  return (
    <>
      <div className="rounded-md bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">{exam.title}</h2>
        <p className="mt-1 text-sm text-slate-600">
          Thời gian: {Math.floor(exam.durationSeconds / 60)} phút
        </p>

        {(exam.batDau || exam.ketThuc) && (
          <div className="mt-2 space-y-1 text-xs text-slate-500">
            {exam.batDau && (
              <div className="flex items-center gap-2">
                <Calendar
                  className="h-4 w-4 flex-shrink-0 text-slate-400"
                  strokeWidth={2}
                />
                {formatTimeDisplay(exam.batDau)}
              </div>
            )}
            {exam.ketThuc && (
              <div className="flex items-center gap-2">
                <Calendar
                  className="h-4 w-4 flex-shrink-0 text-slate-400"
                  strokeWidth={2}
                />
                {formatTimeDisplay(exam.ketThuc)}
              </div>
            )}
          </div>
        )}

        <div className="mt-4 flex items-center gap-3">
          {!disabled ? (
            <Link
              to={previewPath}
              className="inline-flex rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
            >
              Vào Làm
            </Link>
          ) : (
            <button
              disabled
              className="inline-flex cursor-not-allowed rounded-md bg-slate-300 px-4 py-2 text-sm font-medium text-white"
            >
              Vào Làm
            </button>
          )}
          <button
            onClick={handleOpenHistory}
            className="inline-flex rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            📋 Lịch sử
          </button>
        </div>
      </div>

      {/* ============ MODAL LỊCH SỬ ============ */}
      {showHistory && (
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
                onClick={() => setShowHistory(false)}
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
                            onClick={() =>
                              handleToggleAttemptDetail(item.ketQuaId)
                            }
                            className="rounded-lg border border-blue-200 px-4 py-1.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
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
                                {/* Nhận xét hệ thống */}
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

                                {/* Nhận xét giáo viên */}
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

                                {/* Chi tiết câu hỏi */}
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
                                                  {renderContent(
                                                    luaChon.noiDung,
                                                  )}
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
                                                  ✗ Đã chọn:{" "}
                                                  {cauHoi.dapAnDaChon}
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
      )}
    </>
  );
};

export default ClassExamCard;
