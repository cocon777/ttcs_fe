import { Fragment, useState } from "react";
import { FileText } from "lucide-react";
import type { HocSinhLop } from "../../../../../share/interfaces/infor.interface";
import { useParams } from "react-router";
import { StudentClassroomAPI } from "../../../../../services/apis/studentClassAPI";

interface AddStudentProps {
  listStudent: HocSinhLop[];
  setListStudent: (listStudent: HocSinhLop[]) => void;
}

const AddStudent: React.FC<AddStudentProps> = ({
  listStudent,
  setListStudent,
}) => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [studentCode, setStudentCode] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { classId } = useParams();

  const handleSubmit = async () => {
    if (!studentCode.trim()) {
      setError("Vui lòng nhập mã học sinh");
      return;
    }

    const response = await StudentClassroomAPI.addToClassByStudentCode(
      studentCode.trim(),
      classId ? parseInt(classId) : -1,
    );

    if (response) {
      setListStudent([...listStudent, response.data]);
      setStudentCode("");
      setError("");
      setOpen(false);
    } else {
      setError("Mã học sinh không tồn tại hoặc đã có trong lớp");
    }
  };

  return (
    <Fragment>
      <div
        className="flex items-center gap-2 rounded-md bg-blue-800 px-3 py-2.5 shadow-sm hover:cursor-pointer hover:bg-blue-700"
        onClick={() => setOpen(true)}
      >
        <FileText strokeWidth={1.5} className="size-4 text-white" />
        <div className="text-sm font-semibold text-white">Thêm học sinh</div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-[400px] max-w-[80vw] rounded-md bg-white p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 border-b-2 border-blue-900 pb-2 text-sm font-semibold">
              Thêm Học sinh vào lớp
            </div>

            <input
              type="text"
              value={studentCode}
              onChange={(e) => {
                setStudentCode(e.target.value);
                setError(""); // xóa lỗi khi user gõ lại
              }}
              className="w-full rounded-md border border-slate-300 px-4 py-2.5 text-sm shadow-sm"
              placeholder="Nhập mã học sinh (ma_HS)"
            />

            {/* hiện lỗi ngay dưới input */}
            {error && <div className="mt-1 text-xs text-red-500">{error}</div>}

            <div className="mt-4 flex items-center justify-end gap-4">
              <div
                className="rounded-md bg-gray-100 px-8 py-2.5 hover:cursor-pointer"
                onClick={() => {
                  setOpen(false);
                  setStudentCode("");
                  setError("");
                }}
              >
                <div className="text-sm font-semibold text-slate-500">Hủy</div>
              </div>
              <div
                onClick={handleSubmit}
                className="rounded-md bg-blue-800 px-10 py-2.5 hover:cursor-pointer hover:bg-blue-700"
              >
                <div className="text-sm font-semibold text-white">Xác nhận</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default AddStudent;

// 3. BE cần làm gì (để hoàn chỉnh)
// Endpoint POST /student-classes/add-by-code cần thực hiện:
// sql-- 1. Tìm học sinh theo mã
// SELECT id FROM hoc_sinh WHERE ma_HS = :studentCode;

// -- 2. Thêm vào hoc_sinh_lop
// INSERT INTO hoc_sinh_lop (lop_hoc_id, hoc_sinh_id)
// VALUES (:classroomId, :hocSinhId);
