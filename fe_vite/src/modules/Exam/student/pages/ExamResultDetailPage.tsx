import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import examAPI from "../../../../services/apis/examAPI";
import type { ChiTietKetQua, KetQua } from "../../../../services/apis/examAPI";
import renderContent from "../../../../share/utils/renderContent";

const resultClassMapStorageKey = "student.result.classMap";

const getCachedClassIdByResult = (ketQuaId?: string): string | null => {
  if (!ketQuaId) return null;

  try {
    const raw = localStorage.getItem(resultClassMapStorageKey);
    if (!raw) return null;
    const map = JSON.parse(raw) as Record<string, string>;
    return map[ketQuaId] ?? null;
  } catch (error) {
    console.error("Error reading cached result class id:", error);
    return null;
  }
};

const formatDuration = (seconds: number) => {
  const daySeconds = 24 * 60 * 60;
  const days = Math.floor(seconds / daySeconds);
  const hours = Math.floor((seconds % daySeconds) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (days > 0) {
    return `${days} ngày ${hours} giờ ${minutes} phút`;
  }

  if (hours > 0) {
    return `${hours} giờ ${minutes} phút`;
  }

  if (minutes > 0)
    return `${minutes} phút`;
  
  return `${secs} giây`;
};

const ExamResultDetailPage = () => {
  const { ketQuaId } = useParams<{ ketQuaId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const classId =
    searchParams.get("classId") ?? getCachedClassIdByResult(ketQuaId);

  const [detail, setDetail] = useState<ChiTietKetQua | null>(null);
  const [ketQua, setKetQua] = useState<KetQua | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!ketQuaId) {
        setLoading(false);
        return;
      }

      const [detailData, ketQuaData] = await Promise.all([
        examAPI.getChiTietKetQuaByKetQuaId(ketQuaId),
        examAPI.getKetQuaById(ketQuaId),
      ]);

      setDetail(detailData);
      setKetQua(ketQuaData);
      setLoading(false);
    };

    fetchDetail();
  }, [ketQuaId]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <p className="rounded-lg bg-white px-5 py-3 text-slate-700 shadow-sm">
          Đang tải chi tiết bài làm...
        </p>
      </div>
    );
  }

  if (!detail || !ketQuaId) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-xl bg-white p-6 text-center shadow-sm">
          <h1 className="text-lg font-semibold text-slate-900">
            Không tìm thấy chi tiết kết quả
          </h1>
          <button
            onClick={() => navigate("/student")}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Về trang chủ học sinh
          </button>
        </div>
      </div>
    );
  }

  const tongSoCau = ketQua?.tongSoCau ?? detail.cauHoiList.length;
  const soCauDung = ketQua?.soCauDung ?? 0;
  const diemSo = ketQua?.diemSo ?? detail.tongDiem;

  return (
    <div className="min-h-screen w-full bg-slate-100 p-2 md:p-3">
      <div className="flex w-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-3 md:p-4">
        <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
          <aside className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <h2 className="text-3xl font-bold text-slate-900">
              Điểm: {diemSo}/10
            </h2>

            <div className="mt-4 rounded-md border border-slate-200 bg-white p-3">
              <p className="text-sm font-semibold text-slate-700">
                Thông tin chi tiết
              </p>
              <div className="mt-3 space-y-2 text-sm text-slate-700">
                <p className="flex items-start justify-between gap-3">
                  <span>Thời gian làm bài:</span>
                  <span className="font-semibold">
                    {formatDuration(ketQua?.thoiGianLamGiay ?? 0)}
                  </span>
                </p>
                <p className="flex items-start justify-between gap-3">
                  <span>Điểm tổng:</span>
                  <span className="font-semibold">{diemSo}/10</span>
                </p>
                <p className="flex items-start justify-between gap-3">
                  <span>Trắc nghiệm:</span>
                  <span className="font-semibold">
                    {soCauDung}/{tongSoCau} câu
                  </span>
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                if (classId) {
                  navigate(`/student/classroom/${classId}/exams`);
                  return;
                }

                navigate(`/student/results/${ketQuaId}`);
              }}
              className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Quay lại danh sách đề của lớp
            </button>
          </aside>

          <section className="rounded-lg border border-slate-200 bg-slate-50 p-3 md:p-4">
            <div className="rounded-md bg-white p-3">
              <div className="border-b-2 border-blue-500 pb-2 text-sm font-bold uppercase tracking-wide text-blue-600">
                Trắc nghiệm
              </div>

              <div className="mt-4 space-y-6">
                {detail.cauHoiList.map((cauHoi) => (
                  <article
                    key={cauHoi.cauHoiId}
                    className="rounded-md border border-slate-200 bg-white p-4"
                  >
                    <p className="text-sm font-bold text-slate-900">
                      Câu {cauHoi.thuTu}: {renderContent(cauHoi.noiDung)}
                    </p>

                    <div className="mt-3 grid gap-2 text-sm text-slate-700 md:grid-cols-2">
                      {cauHoi.luaChons.map((luaChon) => {
                        const isSelected =
                          cauHoi.dapAnDaChon === luaChon.kyHieu;
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

                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                      <p className="font-semibold text-emerald-600">
                        Đáp án đúng: {cauHoi.dapAnDung || "-"}
                      </p>
                      {cauHoi.dapAnDaChon &&
                      cauHoi.dapAnDaChon !== cauHoi.dapAnDung ? (
                        <p className="font-semibold text-rose-600">
                          Đã chọn: {cauHoi.dapAnDaChon}
                        </p>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ExamResultDetailPage;
