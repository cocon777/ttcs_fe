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

  useEffect(() => {
    const fetchResult = async () => {
      if (!ketQuaId) {
        setLoading(false);
        return;
      }

      const data = await examAPI.getKetQuaById(ketQuaId);
      setResult(data);
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
      <div className="mx-auto w-full max-w-2xl rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Kết quả bài thi</h1>

        <div className="mt-6 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-5 text-slate-700">
          <p>
            <span className="font-semibold">Học sinh:</span>{" "}
            {studentName || "Không có dữ liệu"}
          </p>
          <p>
            <span className="font-semibold">Lần thử:</span> {result.lanThu}
          </p>
          <p>
            <span className="font-semibold">Số câu đúng:</span>{" "}
            {result.soCauDung}/{result.tongSoCau}
          </p>
          <p>
            <span className="font-semibold">Thời gian làm:</span>{" "}
            {formatDuration(result.thoiGianLamGiay)}
          </p>
          <p>
            <span className="font-semibold">Nhận xét hệ thống:</span>{" "}
            {result.nhanXetHeThong}
          </p>
          <p className="text-lg">
            <span className="font-semibold">Điểm số:</span> {result.diemSo}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() =>
              navigate(
                classId
                  ? `/student/results/${ketQuaId}/detail?classId=${encodeURIComponent(classId)}`
                  : `/student/results/${ketQuaId}/detail`,
              )
            }
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Xem chi tiết bài làm
          </button>
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
