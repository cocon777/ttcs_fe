import { useState, useEffect, useCallback } from "react";
import { Trash2, UserPlus, Loader2 } from "lucide-react";
import { StudentClassroomAPI } from "../../../../services/apis/studentClassAPI";

interface StudentManagementProps {
  classId: number;
}

const StudentManagement = ({ classId }: StudentManagementProps) => {
  const [students, setStudents] = useState<any[]>([]);
  const [studentCodeInput, setStudentCodeInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // 1. Tải danh sách học sinh của lớp
  const loadStudents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await StudentClassroomAPI.getByClassroomId(classId);
      if (res && res.status === 200) {
        setStudents(res.data);
      }
    } catch (err) {
      console.error("Lỗi lấy danh sách học sinh:", err);
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  // 2. Thêm học sinh bằng Mã học sinh (Student Code)
  const handleAddStudent = async () => {
    if (!studentCodeInput.trim()) {
      alert("Hãy nhập mã học sinh");
      return;
    }

    setActionLoading(true);
    try {
      const res = await StudentClassroomAPI.addToClassByStudentCode(
        studentCodeInput.trim(),
        classId,
      );
      if (res && res.status === 200) {
        alert("Thêm học sinh thành công!");
        setStudentCodeInput("");
        loadStudents(); // Tải lại bảng sau khi thêm
      } else {
        alert("Lỗi: Không tìm thấy mã học sinh hoặc học sinh đã có trong lớp!");
      }
    } catch (err) {
      alert("Đã xảy ra lỗi khi thêm học sinh!");
    } finally {
      setActionLoading(false);
    }
  };

  // 3. Xóa học sinh khỏi lớp
  // 3. Xóa học sinh khỏi lớp
  const handleRemove = async (hocSinhId: number) => {
    if (window.confirm("Xác nhận xóa tài khoản học sinh này khỏi lớp ?")) {
      try {
        // 🚀 Truyền thêm classId vào hàm delete
        const res = await StudentClassroomAPI.delete(classId, hocSinhId);
        if (res && res.status === 200) {
          loadStudents(); // Tải lại danh sách
        }
      } catch (err) {
        alert("Lỗi khi xóa học sinh!");
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden mt-8">
      {/* Header & Input */}
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Danh sách học sinh trong lớp
          </h2>
          <p className="text-sm text-slate-500">
            Quản lý và cập nhật thành viên của lớp học
          </p>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Nhập Mã học sinh (VD: HS001)..."
            className="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64 transition-all"
            value={studentCodeInput}
            onChange={(e) => setStudentCodeInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddStudent()}
          />
          <button
            onClick={handleAddStudent}
            disabled={actionLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors disabled:bg-slate-400"
          >
            {actionLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <UserPlus size={18} />
            )}
            Thêm
          </button>
        </div>
      </div>

      {/* Bảng danh sách */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100/80 border-b border-slate-200">
              <th className="p-4 font-bold text-slate-700 w-16">STT</th>
              <th className="p-4 font-bold text-slate-700">Tên học sinh</th>
              <th className="p-4 font-bold text-slate-700">Mã số học sinh</th>
              <th className="p-4 font-bold text-slate-700">Ngày vào lớp</th>
              <th className="p-4 font-bold text-slate-700 text-center">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-10 text-center">
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <Loader2 size={32} className="animate-spin" />
                    <p>Đang lấy danh sách học sinh...</p>
                  </div>
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-10 text-center text-slate-400 italic"
                >
                  Lớp học hiện tại chưa có học sinh nào.
                </td>
              </tr>
            ) : (
              students.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b border-slate-50 hover:bg-blue-50/30 transition-colors"
                >
                  <td className="p-4 text-slate-500">{index + 1}</td>

                  <td className="p-4 font-semibold text-slate-800">
                    {/* 🚀 Lấy tên từ Object nguoiDung (Bắt dự phòng hoTen hoặc tenNguoiDung) */}
                    {item.nguoiDung?.hoTen ||
                      item.nguoiDung?.tenNguoiDung ||
                      item.nguoiDung?.tenDangNhap ||
                      "Chưa cập nhật tên"}
                  </td>

                  <td className="p-4">
                    <span className="bg-slate-100 px-2 py-1 rounded text-xs font-mono font-bold text-slate-600">
                      {/* 🚀 Lấy trực tiếp maHS từ item (vì item chính là HocSinh) */}
                      {item.maHS || "Chưa có mã"}
                    </span>
                  </td>

                  <td className="p-4 text-slate-500">
                    {/* 🚀 Đổi từ ngayThamGia thành createdAt cho đúng với HocSinh.java */}
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString("vi-VN")
                      : "---"}
                  </td>

                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-all"
                      title="Xóa khỏi lớp"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentManagement;
