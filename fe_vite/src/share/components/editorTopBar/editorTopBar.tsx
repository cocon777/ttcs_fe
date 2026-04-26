import { useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Menu from "../Menu/menu";
import convertToJSON from "../../../modules/Exam/teacher/Editor/utils/formatExam";
import type { NoiDungDe } from "../../../modules/Exam/teacher/Editor/utils/formatExam";
// [THÊM] Import ExamAPI để gọi tạo đề trực tiếp (lấy từ CreateExam)
import CreateExamAPI from "../../../services/apis/createExamAPI";

const EDITOR_PATH = "/teacher/exam/editor";
// [XÓA] Không còn dùng CREATE_PATH để navigate sang trang CreateExam nữa
// const CREATE_PATH = "/teacher/exam/editor/create";

interface FormErrors {
  tieuDe?: string;
  noiDungDe?: string;
}

const EditorTopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [tieuDe, setExamName] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  // [THÊM] Trạng thái loading khi đang gọi API tạo đề
  const [isSubmitting, setIsSubmitting] = useState(false);

  // const examJSON = convertToJSON(localStorage.getItem("noiDungDe") || "");

  const validateExam = useCallback(
    (noiDungDe: NoiDungDe): string | undefined => {
      if (Object.keys(noiDungDe.cauHois).length === 0) {
        return "Đề thi không có câu hỏi nào!";
      }

      const cauThieuLuaChon = Object.values(noiDungDe.cauHois)
        .filter((cauHoi) => Object.keys(cauHoi.luaChons).length === 0)
        .map((cauHoi) => `Câu ${cauHoi.thuTu}`);

      if (cauThieuLuaChon.length > 0) {
        return `Thiếu lựa chọn: ${cauThieuLuaChon.join(", ")}`;
      }

      const cauThieuDapAn = Object.values(noiDungDe.cauHois)
        .filter(
          (cauHoi) => !Object.values(cauHoi.luaChons).some((lc) => lc.laDapAn),
        )
        .map((cauHoi) => `Câu ${cauHoi.thuTu}`);

      if (cauThieuDapAn.length > 0) {
        return `Chưa có đáp án đúng: ${cauThieuDapAn.join(", ")}`;
      }

      return undefined;
    },
    [],
  );

  const handleExamNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExamName(e.target.value);
    if (errors.tieuDe) setErrors((prev) => ({ ...prev, tieuDe: undefined }));
  };

  const handleCancel = () => {
    setExamName("");
    setErrors({});
  };

  // [SỬA] handleContinue → async, gọi ExamAPI.create trực tiếp thay vì navigate sang CreateExam
  const handleContinue = useCallback(async () => {
    const newErrors: FormErrors = {};

    if (!tieuDe.trim()) {
      newErrors.tieuDe = "Vui lòng nhập tên bài thi!";
    }

    // [SỬA] Đọc examJSON từ localStorage tại thời điểm submit
    // const currentExamJSON = convertToJSON(localStorage.getItem("exam") || "");
    const storedJson = localStorage.getItem("exam_json");
    const currentExamJSON = storedJson
      ? (JSON.parse(storedJson) as NoiDungDe)
      : convertToJSON(localStorage.getItem("exam") || "");

    if (currentExamJSON) {
      const examError = validateExam(currentExamJSON);
      if (examError) newErrors.noiDungDe = examError;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSubmitting(true);

      // [THÊM] Gọi API tạo đề trực tiếp — bỏ grade, subject, purpose như CreateExam cũ
      const response = await CreateExamAPI.create({
        tieuDe: tieuDe.trim(),
        noiDungDe: currentExamJSON,
        // [XÓA] gradeId, subjectId, purposeId, examDescribe không còn nữa
      });

      if (response?.status === 201) {
        const userString = localStorage.getItem("user");
        const user = userString ? JSON.parse(userString) : null;
        const isStudent = user?.role?.includes("HS") || user?.vaiTro === "HS";
        navigate(isStudent ? "/student/my-exams" : "/teacher/exam/management");
      }
    } catch (error) {
      console.error("Lỗi khi tạo đề:", error);
      setErrors((prev) => ({
        ...prev,
        noiDungDe: "Tạo đề thất bại, vui lòng thử lại!",
      }));
    } finally {
      setIsSubmitting(false);
    }
  }, [tieuDe, validateExam, navigate]);

  // const openExamNameInput = location.pathname === EDITOR_PATH;

  const openExamNameInput =
    location.pathname === EDITOR_PATH ||
    location.pathname === "/student/exam-editor";

  const renderExamNameInput = () => (
    <div className="col-span-6">
      {openExamNameInput && (
        <div className="flex items-start gap-2">
          <div className="flex flex-1 flex-col">
            <input
              type="text"
              placeholder="Nhập tên đề ..."
              className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none dark:bg-darkmode-800 dark:text-slate-300 ${
                errors.tieuDe
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-blue-500 dark:border-darkmode-400 dark:focus:border-blue-400"
              }`}
              value={tieuDe}
              onChange={handleExamNameChange}
            />
            {errors.tieuDe && (
              <span className="mt-1 text-xs text-red-500">{errors.tieuDe}</span>
            )}
            {errors.noiDungDe && (
              <span className="mt-1 text-xs text-red-500">
                {errors.noiDungDe}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleCancel}
            // [THÊM] Disable khi đang submit
            disabled={isSubmitting}
            className="rounded-md bg-gray-200 px-6 py-2.5 text-sm font-medium text-gray-600 shadow-sm transition-colors hover:bg-gray-300 disabled:opacity-50 dark:bg-darkmode-400 dark:text-slate-300 dark:hover:bg-darkmode-300"
          >
            Hủy
          </button>

          <button
            type="button"
            onClick={handleContinue}
            // [THÊM] Disable + đổi text khi đang submit
            disabled={isSubmitting}
            className="rounded-md bg-blue-800 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? "Đang tạo..." : "Tạo đề"}
          </button>
        </div>
      )}
    </div>
  );

  const renderActions = () => (
    <div className="col-span-4">
      <div className="flex items-center justify-end gap-5 pr-2">
        <Menu />
      </div>
    </div>
  );

  return (
    <header className="w-full border-b border-slate-200 bg-white px-3 py-4 dark:border-darkmode-400 dark:bg-darkmode-600">
      <div className="grid grid-cols-10">
        {renderExamNameInput()}
        {renderActions()}
      </div>
    </header>
  );
};

export default EditorTopBar;
