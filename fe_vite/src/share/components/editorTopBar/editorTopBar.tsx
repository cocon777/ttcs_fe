import { useState, useCallback } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Menu from "../Menu/menu";
import convertToJSON from "../../../modules/Exam/teacher/Editor/utils/formatExam";
import type { NoiDungDe } from "../../../modules/Exam/teacher/Editor/utils/formatExam";
import CreateExamAPI from "../../../services/apis/createExamAPI";
import toast from "react-hot-toast";
const EDITOR_PATH = "/teacher/exam/editor";

interface FormErrors {
  tieuDe?: string;
  noiDungDe?: string;
}

const EditorTopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Chế độ sửa khi có ?deId=...
  const editDeId = searchParams.get("deId");
  const editTieuDeInit = searchParams.get("tieuDe") ?? "";
  const isEditMode = Boolean(editDeId);

  const [tieuDe, setExamName] = useState(editTieuDeInit);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (isEditMode) {
      navigate(-1);
    } else {
      setExamName("");
      setErrors({});
    }
  };

  const getNoiDungDe = (): NoiDungDe => {
    const storedJson = localStorage.getItem("exam_json");
    return storedJson
      ? (JSON.parse(storedJson) as NoiDungDe)
      : convertToJSON(localStorage.getItem("exam") || "");
  };

  const validate = (): { noiDungDe: NoiDungDe; errors: FormErrors } | null => {
    const newErrors: FormErrors = {};

    if (!tieuDe.trim()) {
      newErrors.tieuDe = "Vui lòng nhập tên bài thi!";
    }

    const noiDungDe = getNoiDungDe();
    const examError = validateExam(noiDungDe);
    if (examError) newErrors.noiDungDe = examError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return null;
    }

    return { noiDungDe, errors: {} };
  };

  // ── Tạo đề mới ──────────────────────────────────────────
  const handleCreate = useCallback(async () => {
    const result = validate();
    if (!result) return;

    try {
      setIsSubmitting(true);
      const response = await CreateExamAPI.create({
        tieuDe: tieuDe.trim(),
        noiDungDe: result.noiDungDe,
      });

      if (response?.status === 201) {
        console.log(response);
        localStorage.removeItem("exam");
        localStorage.removeItem("exam_json");

        const userString = localStorage.getItem("user");
        const user = userString ? JSON.parse(userString) : null;

        const isStudent = user?.role?.includes("HS") || user?.vaiTro === "HS";

        navigate(
          isStudent
            ? "/student/my-exams"
            : `/teacher/exam/exam-infor/${response.data.id}`,
        );
        toast.success("Tạo đề mới thành công");
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
  }, [tieuDe, validate, navigate]);

  // ── Sửa đề: xóa cũ → tạo mới ────────────────────────────
  const handleUpdate = useCallback(async () => {
    if (!editDeId) return;

    const result = validate();
    if (!result) return;

    if (!window.confirm("Xác nhận lưu thay đổi? Đề cũ sẽ bị thay thế.")) return;

    try {
      setIsSubmitting(true);

      // 1. Xóa đề cũ
      const removeRes = await CreateExamAPI.remove(editDeId);
      if (removeRes?.status !== 200) {
        throw new Error("Xóa đề cũ thất bại");
      }

      // 2. Tạo đề mới với nội dung đã sửa
      const createRes = await CreateExamAPI.create({
        tieuDe: tieuDe.trim(),
        noiDungDe: result.noiDungDe,
      });

      if (createRes?.data?.id) {
        localStorage.removeItem("exam");
        localStorage.removeItem("exam_json");

        const userString = localStorage.getItem("user");
        const user = userString ? JSON.parse(userString) : null;

        const isStudent = user?.role?.includes("HS") || user?.vaiTro === "HS";

        navigate(
          isStudent
            ? "/student/my-exams"
            : `/teacher/exam/exam-infor/${createRes.data.id}`,
        );
        toast.success("Sửa đề : Xóa cũ và tạo mới thành công");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật đề:", error);
      setErrors((prev) => ({
        ...prev,
        noiDungDe: "Cập nhật đề thất bại, vui lòng thử lại!",
      }));
    } finally {
      setIsSubmitting(false);
    }
  }, [editDeId, tieuDe, validate, navigate]);

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
              placeholder={isEditMode ? "Tiêu đề đề thi..." : "Nhập tên đề ..."}
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
            disabled={isSubmitting}
            className="rounded-md bg-gray-200 px-6 py-2.5 text-sm font-medium text-gray-600 shadow-sm transition-colors hover:bg-gray-300 disabled:opacity-50 dark:bg-darkmode-400 dark:text-slate-300 dark:hover:bg-darkmode-300"
          >
            {isEditMode ? "Quay lại" : "Hủy"}
          </button>

          <button
            type="button"
            onClick={isEditMode ? handleUpdate : handleCreate}
            disabled={isSubmitting}
            className={`rounded-md px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${
              isEditMode
                ? "bg-amber-500 hover:bg-amber-600 focus:ring-amber-500"
                : "bg-blue-800 hover:bg-blue-700 focus:ring-blue-500"
            }`}
          >
            {isSubmitting
              ? "Đang xử lý..."
              : isEditMode
                ? "Lưu sửa đề"
                : "Tạo đề"}
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
