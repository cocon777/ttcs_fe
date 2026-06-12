import { useState } from "react";
import type { Student } from "../../../../../share/interfaces/student.interface";
import examAPI from "../../../../../services/apis/examAPI";
import type {
  KetQuaInfo,
  ChiTietKetQua,
} from "../../../../../services/apis/examAPI";
import axiosInstance from "../../../../../services/axiosInstance";
import renderContent from "../../../../../share/utils/renderContent";
import toast from "react-hot-toast";

const formatDuration = (seconds: number | string) => {
  const sec =
    typeof seconds === "string" ? parseInt(seconds, 10) : Number(seconds);
  if (!sec || isNaN(sec)) return "-";
  if (sec === 0) return "0 giây";
  if (sec >= 3600) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    if (m === 0 && s === 0) return `${h} giờ`;
    if (s === 0) return `${h} giờ ${m} phút`;
    return `${h} giờ ${m} phút ${s} giây`;
  }
  if (sec >= 60) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return s === 0 ? `${m} phút` : `${m} phút ${s} giây`;
  }
  return `${sec} giây`;
};

const ExamStudentList = ({ students }: { students: Student[] }) => {
  // State: Popup Xem chi tiết 
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailStudent, setDetailStudent] = useState<Student | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailInfo, setDetailInfo] = useState<KetQuaInfo | null>(null);
  const [detailChiTiet, setDetailChiTiet] = useState<ChiTietKetQua | null>(
    null,
  );
  const [detailTeacherFeedback, setDetailTeacherFeedback] = useState("");
  const [isSavingDetail, setIsSavingDetail] = useState(false);

  //  Handler: Xem chi tiết
  const handleOpenDetail = async (student: Student) => {
    setDetailStudent(student);
    setIsDetailOpen(true);
    setDetailLoading(true);
    setDetailInfo(null);
    setDetailChiTiet(null);
    setDetailTeacherFeedback("");
    try {
      const [info, chiTiet] = await Promise.all([
        examAPI.getKetQuaInfo(student.id),
        examAPI.getChiTietKetQuaByKetQuaId(student.id.toString()),
      ]);
      setDetailInfo(info);
      setDetailChiTiet(chiTiet);
      setDetailTeacherFeedback(info?.nhanXetGiaoVien ?? "");
    } catch (error) {
      console.error("Lỗi lấy chi tiết:", error);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleSaveDetailFeedback = async () => {
    if (!detailStudent) return;
    setIsSavingDetail(true);
    try {
      await axiosInstance.put(
        `/api/ket-qua/${detailStudent.id}/giao-vien-nhan-xet`,
        { nhanXetGiaoVien: detailTeacherFeedback },
      );
      toast.success("Đã lưu nhận xét thành công!");
      // Cập nhật lại state local
      setDetailInfo((prev) =>
        prev ? { ...prev, nhanXetGiaoVien: detailTeacherFeedback } : prev,
      );
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi lưu nhận xét.");
    } finally {
      setIsSavingDetail(false);
    }
  };

  return (
    <div className="mb-8 rounded-xl border border-indigo-100 bg-white p-6 shadow">
      <h3 className="mb-4 font-bold text-indigo-700">
        Danh sách học sinh đã làm
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-indigo-100 bg-indigo-50">
              <th className="w-16 p-3 font-bold text-indigo-700">STT</th>
              <th className="p-3 font-bold text-indigo-700">Họ tên</th>
              <th className="p-3 font-bold text-indigo-700">Lần thi</th>
              <th className="p-3 font-bold text-indigo-700">Điểm</th>
              <th className="p-3 font-bold text-indigo-700">Thời gian làm</th>
              <th className="p-3 text-center font-bold text-indigo-700">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, idx) => (
              <tr
                key={student.id}
                className="border-b border-indigo-50 transition-colors hover:bg-indigo-50/30"
              >
                <td className="p-3 text-slate-500">{idx + 1}</td>
                <td className="p-3 font-semibold text-slate-800">
                  {student.name}
                </td>
                <td className="p-3">{student.attempt}</td>
                <td className="p-3 font-bold text-blue-600">{student.score}</td>
                <td className="p-3">{formatDuration(student.time)}</td>
                <td className="p-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleOpenDetail(student)}
                      className="rounded-lg border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-600 transition-all hover:border-emerald-400 hover:bg-emerald-50"
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* POPUP XEM CHI TIẾT  */}
      {isDetailOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-8 backdrop-blur-sm">
          <div className="w-full max-w-4xl rounded-xl bg-white shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-xl border-b border-slate-200 bg-white px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Chi tiết bài làm
                </h2>
                <p className="text-sm text-slate-500">{detailStudent?.name}</p>
              </div>
              <button
                onClick={() => setIsDetailOpen(false)}
                className="text-xl font-bold text-slate-400 hover:text-red-500"
              >
                ×
              </button>
            </div>

            {detailLoading ? (
              <div className="py-16 text-center text-slate-500">
                Đang tải dữ liệu...
              </div>
            ) : (
              <div className="p-6 space-y-6">
                {/* Tóm tắt điểm */}
                {detailInfo && (
                  <div className="grid grid-cols-3 gap-4 rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 p-5">
                    <div className="text-center">
                      <p className="text-3xl font-black text-blue-700">
                        {detailInfo.diemSo ?? 0}
                        <span className="text-lg font-normal text-slate-500">
                          /10
                        </span>
                      </p>
                      <p className="mt-1 text-xs text-slate-500 uppercase tracking-wide">
                        Điểm số
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-black text-indigo-700">
                        {detailInfo.lanThu}
                      </p>
                      <p className="mt-1 text-xs text-slate-500 uppercase tracking-wide">
                        Lần thi
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-black text-slate-700">
                        {formatDuration(detailInfo.thoiGianLamGiay)}
                      </p>
                      <p className="mt-1 text-xs text-slate-500 uppercase tracking-wide">
                        Thời gian làm
                      </p>
                    </div>
                  </div>
                )}

                {/* Nhận xét tự động của hệ thống */}
                {detailInfo?.nhanXetHeThong && (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <p className="mb-2 text-sm font-bold text-slate-700">
                      🤖 Nhận xét hệ thống:
                    </p>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
                      {detailInfo.nhanXetHeThong}
                    </p>
                  </div>
                )}

                {/* Nhận xét của giáo viên*/}
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <p className="mb-2 text-sm font-bold text-blue-700">
                    👩‍🏫 Nhận xét của Thầy/Cô:
                  </p>
                  <textarea
                    className="w-full rounded-lg border border-blue-200 bg-white p-3 text-sm text-slate-700 outline-none transition-all focus:ring-2 focus:ring-blue-400"
                    rows={4}
                    placeholder="Nhập nhận xét, lời khuyên hoặc động viên..."
                    value={detailTeacherFeedback}
                    onChange={(e) => setDetailTeacherFeedback(e.target.value)}
                  />
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={handleSaveDetailFeedback}
                      disabled={isSavingDetail}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isSavingDetail ? "Đang lưu..." : "💾 Lưu nhận xét"}
                    </button>
                  </div>
                </div>

                {/* Chi tiết câu hỏi */}
                {detailChiTiet && detailChiTiet.cauHoiList.length > 0 && (
                  <div>
                    <div className="mb-4 border-b-2 border-indigo-500 pb-2">
                      <p className="text-sm font-bold uppercase tracking-wide text-indigo-600">
                        Chi tiết bài làm — {detailChiTiet.cauHoiList.length} câu
                      </p>
                    </div>
                    <div className="space-y-3">
                      {detailChiTiet.cauHoiList.map((cauHoi) => (
                        <article
                          key={cauHoi.cauHoiId}
                          className="rounded-lg border border-slate-200 bg-white p-4"
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
                          <div className="mt-3 flex flex-wrap gap-3 text-sm">
                            <span className="font-semibold text-emerald-600">
                              ✓ Đáp án đúng: {cauHoi.dapAnDung || "-"}
                            </span>
                            {cauHoi.dapAnDaChon &&
                              cauHoi.dapAnDaChon !== cauHoi.dapAnDung && (
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
        </div>
      )}
    </div>
  );
};

export default ExamStudentList;
