import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import examAPI from "../../../../services/apis/examAPI";
import UserAPI from "../../../../services/apis/userAPI";
import type { ExamData } from "../../../../services/apis/examAPI";

const getExamStartStorageKey = (examId: string) =>
  `student.exam.startAt.${examId}`;

const ExamPreviewPage = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const classId = searchParams.get("classId");

  const [exam, setExam] = useState<ExamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [startingExam, setStartingExam] = useState(false);
  const [studentName, setStudentName] = useState("");

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

  useEffect(() => {
    const fetchExam = async () => {
      if (!examId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const data = await examAPI.getExamById(examId);
      setExam(data);
      setLoading(false);
    };

    fetchExam();
  }, [examId]);

  const handleStartExam = async () => {
    if (!exam) return;
    setStartingExam(true);
    localStorage.setItem(getExamStartStorageKey(exam.id), String(Date.now()));
    // Simulate a small delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 500));
    navigate(
      classId
        ? `/student/take-exam/${exam.id}?classId=${encodeURIComponent(classId)}`
        : `/student/take-exam/${exam.id}`,
    );
  };

  const backToExamList = () => {
    if (classId) {
      navigate(`/student/classroom/${classId}/exams`);
      return;
    }

    navigate("/student");
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="rounded-lg bg-white px-8 py-6 shadow-sm">
          <p className="text-slate-600">Đang tải thông tin đề thi...</p>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-sm">
          <p className="mb-4 text-lg font-semibold text-slate-900">
            Không tìm thấy đề thi
          </p>
          <button
            onClick={backToExamList}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        {/* Close button */}
        <div className="mb-6 flex justify-between items-start">
          <h1 className="flex-1 text-2xl font-semibold text-slate-900">
            {exam.title}
          </h1>
          <button
            onClick={backToExamList}
            className="text-slate-400 hover:text-slate-600 text-lg"
          >
            ✕
          </button>
        </div>

        {/* Info Grid */}
        <div className="mb-8 space-y-4 rounded-lg bg-slate-50 p-6">
          <div className="flex justify-between py-2 border-b border-slate-200">
            <span className="font-semibold text-slate-700">
              Thời gian làm bài:
            </span>
            <span className="text-slate-600">
              {Math.floor(exam.durationSeconds / 60)} phút
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-200">
            <span className="font-semibold text-slate-700">
              Số lượng câu hỏi:
            </span>
            <span className="text-slate-600">{exam.questions.length} câu</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="font-semibold text-slate-700">Thí sinh:</span>
            <span className="text-slate-600">
              {studentName || "Không có dữ liệu"}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={backToExamList}
            className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            Quay lại
          </button>
          <button
            onClick={handleStartExam}
            disabled={startingExam}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-70 transition"
          >
            {startingExam ? "Đang vào phòng thi..." : "Bắt đầu thi"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamPreviewPage;
