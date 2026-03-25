import { useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Menu from "../Menu/menu";
import convertToJSON from "../../../modules/Exam/teacher/Editor/utils/formatExam";
import type { NoiDungDe } from "../../../modules/Exam/teacher/Editor/utils/formatExam";

const EDITOR_PATH = "/teacher/exam/editor";
const CREATE_PATH = "/teacher/exam/editor/create";

interface FormErrors {
  examName?: string;
  exam?: string;
}

const EditorTopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [examName, setExamName] = useState("");
  //   const [openExamNameInput, setOpenExamNameInput] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});

  const examJSON = convertToJSON(localStorage.getItem("exam") || "");

  const validateExam = useCallback((exam: NoiDungDe): string | undefined => {
    if (Object.keys(exam.cauHois).length === 0) {
      return "Đề thi không có câu hỏi nào!";
    }

    const cauThieuLuaChon = Object.values(exam.cauHois)
      .filter((cauHoi) => Object.keys(cauHoi.luaChons).length === 0)
      .map((cauHoi) => `Câu ${cauHoi.thuTu}`);

    if (cauThieuLuaChon.length > 0) {
      return `Thiếu lựa chọn: ${cauThieuLuaChon.join(", ")}`;
    }

    const cauThieuDapAn = Object.values(exam.cauHois)
      .filter(
        (cauHoi) => !Object.values(cauHoi.luaChons).some((lc) => lc.laDapAn),
      )
      .map((cauHoi) => `Câu ${cauHoi.thuTu}`);

    if (cauThieuDapAn.length > 0) {
      return `Chưa có đáp án đúng: ${cauThieuDapAn.join(", ")}`;
    }

    return undefined;
  }, []);

  const handleExamNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExamName(e.target.value);
    if (errors.examName)
      setErrors((prev) => ({ ...prev, examName: undefined }));
  };

  const handleCancel = () => {
    setExamName("");
    setErrors({});
  };

  const handleContinue = useCallback(() => {
    const newErrors: FormErrors = {};

    if (!examName.trim()) {
      newErrors.examName = "Vui lòng nhập tên bài thi!";
    }

    if (examJSON) {
      const examError = validateExam(examJSON);
      if (examError) newErrors.exam = examError;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    localStorage.setItem("exam_config", examName);
    navigate(CREATE_PATH);
  }, [examName, examJSON, navigate, validateExam]);

  //   useEffect(() => {
  //     setOpenExamNameInput(location.pathname === EDITOR_PATH);
  //   }, [location.pathname]);
  const openExamNameInput = location.pathname === EDITOR_PATH;
  const renderExamNameInput = () => (
    <div className="col-span-6">
      {openExamNameInput && (
        <div className="flex items-start gap-2">
          <div className="flex flex-1 flex-col">
            <input
              type="text"
              placeholder="Nhập tên đề ..."
              className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none dark:bg-darkmode-800 dark:text-slate-300 ${
                errors.examName
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-blue-500 dark:border-darkmode-400 dark:focus:border-blue-400"
              }`}
              value={examName}
              onChange={handleExamNameChange}
            />
            {errors.examName && (
              <span className="mt-1 text-xs text-red-500">
                {errors.examName}
              </span>
            )}
            {errors.exam && (
              <span className="mt-1 text-xs text-red-500">{errors.exam}</span>
            )}
          </div>

          <button
            type="button"
            onClick={handleCancel}
            className="rounded-md bg-gray-200 px-6 py-2.5 text-sm font-medium text-gray-600 shadow-sm transition-colors hover:bg-gray-300 dark:bg-darkmode-400 dark:text-slate-300 dark:hover:bg-darkmode-300"
          >
            Hủy
          </button>

          <button
            type="button"
            onClick={handleContinue}
            className="rounded-md bg-blue-800 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Tạo đề
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
