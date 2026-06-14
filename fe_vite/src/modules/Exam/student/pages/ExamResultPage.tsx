import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import examAPI from "../../../../services/apis/examAPI";
import type { KetQua } from "../../../../services/apis/examAPI";
import UserAPI from "../../../../services/apis/userAPI";

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

const formatDuration = (totalSeconds: number) => {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds || 0));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours} giờ`);
  if (minutes > 0) parts.push(`${minutes} phút`);
  if (seconds > 0) parts.push(`${seconds} giây`);

  if (parts.length === 0) return "0 giây";
  return parts.join(" ");
};

const ExamResultPage = () => {
  const { ketQuaId } = useParams<{ ketQuaId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const classId =
    searchParams.get("classId") ?? getCachedClassIdByResult(ketQuaId);

  const [result, setResult] = useState<KetQua | null>(null);
  const [studentName, setStudentName] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAssignedToClass, setIsAssignedToClass] = useState(false);
  const [isAfterEnd, setIsAfterEnd] = useState(false);

  // 2 state để quản lý việc đóng/mở ô nhận xét
  const [isOpenSystemFB, setIsOpenSystemFB] = useState(false);
  const [isOpenTeacherFB, setIsOpenTeacherFB] = useState(false);

  useEffect(() => {
    const fetchResult = async () => {
      if (!ketQuaId) {
        setLoading(false);
        return;
      }

      const data = await examAPI.getKetQuaById(ketQuaId);
      setResult(data);
      // Determine whether the underlying exam was assigned to a class (phamViGiao === 'LOP')
      try {
        const info = await examAPI.getKetQuaInfo(ketQuaId);
        const deId = info?.de?.id;
        if (deId) {
          const exam = await examAPI.getExamById(String(deId));
          const assigned =
            exam?.phamViGiao === "LOP" || (exam?.maLopGiao?.length ?? 0) > 0;
          setIsAssignedToClass(Boolean(assigned));
          // determine whether current time is after exam end
          if (exam?.ketThuc) {
            const end = new Date(exam.ketThuc);
            if (!Number.isNaN(end.getTime())) {
              setIsAfterEnd(Date.now() > end.getTime());
            } else {
              setIsAfterEnd(true);
            }
          } else {
            setIsAfterEnd(true);
          }
        }
      } catch (err) {
        // ignore and leave as false
        console.error("Error fetching exam info:", err);
      }
      setLoading(false);
    };

    fetchResult();
  }, [ketQuaId]);

  useEffect(() => {
    const fetchStudentName = async () => {
      const response = await UserAPI.getInfo();
      const ten = response?.data?.ten;
      if (typeof ten === "string" && ten.trim()) {
        setStudentName(ten);
      }
    };

    fetchStudentName();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <p className="rounded-lg bg-white px-5 py-3 text-slate-700 shadow-sm">
          Đang tải kết quả...
        </p>
      </div>
    );
  }

  if (!result || !ketQuaId) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-xl bg-white p-6 text-center shadow-sm">
          <h1 className="text-lg font-semibold text-slate-900">
            Không tìm thấy kết quả
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

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto w-full max-w-2xl rounded-2xl bg-white p-8 shadow-sm border border-slate-100">
        <h1 className="text-2xl font-bold text-slate-900 text-center mb-6">
          Kết quả bài thi
        </h1>

        {/* Khối hiển thị thông tin cơ bản */}
        <div className="grid grid-cols-2 gap-4 rounded-xl border border-slate-200 bg-slate-50 p-5 text-slate-700">
          <div className="space-y-2">
            <p>
              <span className="font-semibold text-slate-500 text-sm uppercase">
                Học sinh
              </span>
              <br />
              <span className="text-lg font-medium">
                {studentName || "Không có dữ liệu"}
              </span>
            </p>
            <p>
              <span className="font-semibold text-slate-500 text-sm uppercase">
                Số câu đúng
              </span>
              <br />
              <span className="text-lg">
                {result.soCauDung}/{result.tongSoCau}
              </span>
            </p>
          </div>
          <div className="space-y-2">
            <p>
              <span className="font-semibold text-slate-500 text-sm uppercase">
                Điểm số
              </span>
              <br />
              <span className="text-3xl font-bold text-blue-600">
                {result.diemSo}
              </span>
            </p>
            <p>
              <span className="font-semibold text-slate-500 text-sm uppercase">
                Thời gian làm
              </span>
              <br />
              <span className="text-md">
                {formatDuration(result.thoiGianLamGiay)}
              </span>
            </p>
          </div>
        </div>

        {/* KHỐI GIAO DIỆN NHẬN XÉT ĐÓNG/MỞ (ACCORDION) */}
        <div className="mt-6 space-y-3">
          {/* Ô 1: NHẬN XÉT CỦA HỆ THỐNG */}
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
            <button
              onClick={() => setIsOpenSystemFB(!isOpenSystemFB)}
              className="w-full px-4 py-3 bg-slate-50 flex justify-between items-center font-medium text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <span className="flex items-center gap-2">
                🤖 <span>Phân tích từ Hệ thống</span>
              </span>
              <span className="text-xs font-semibold text-slate-500 bg-slate-200 px-2 py-1 rounded">
                {isOpenSystemFB ? "Thu gọn ▲" : "Xem chi tiết ▼"}
              </span>
            </button>

            {isOpenSystemFB && (
              <div className="p-5 border-t border-slate-200 text-slate-700 text-sm whitespace-pre-wrap leading-relaxed bg-white">
                {result.nhanXetHeThong ||
                  "Hệ thống chưa có đánh giá cho bài làm này."}
              </div>
            )}
          </div>

          {/* Ô 2: NHẬN XÉT CỦA GIÁO VIÊN */}
          <div className="border border-blue-200 rounded-lg overflow-hidden bg-white shadow-sm">
            <button
              onClick={() => setIsOpenTeacherFB(!isOpenTeacherFB)}
              className="w-full px-4 py-3 bg-blue-50 flex justify-between items-center font-medium text-blue-900 hover:bg-blue-100 transition-colors"
            >
              <span className="flex items-center gap-2">
                👩‍🏫 <span>Lời khuyên từ Giáo viên</span>
              </span>
              <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                {isOpenTeacherFB ? "Thu gọn ▲" : "Xem chi tiết ▼"}
              </span>
            </button>

            {isOpenTeacherFB && (
              <div className="p-5 border-t border-blue-100 text-sm leading-relaxed bg-white">
                {result.nhanXetGiaoVien &&
                result.nhanXetGiaoVien.trim() !== "" ? (
                  <p className="text-slate-800 whitespace-pre-wrap font-medium">
                    {result.nhanXetGiaoVien}
                  </p>
                ) : (
                  <p className="text-slate-400 italic flex items-center justify-center py-2">
                    Giáo viên chưa để lại nhận xét cho bài làm này.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {!isAssignedToClass && isAfterEnd && (
            <button
              onClick={() =>
                navigate(
                  classId
                    ? `/student/results/${ketQuaId}/detail?classId=${encodeURIComponent(
                        classId,
                      )}`
                    : `/student/results/${ketQuaId}/detail`,
                )
              }
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Xem chi tiết bài làm
            </button>
          )}
          <button
            onClick={() => navigate("/student")}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamResultPage;
