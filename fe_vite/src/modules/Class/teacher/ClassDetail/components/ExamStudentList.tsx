import { useState } from "react";
import type { Student } from "../../../../../share/interfaces/student.interface";
import examAPI from "../../../../../services/apis/examAPI";
import type { KetQua } from "../../../../../services/apis/examAPI";
import axiosInstance from "../../../../../services/axiosInstance";

const formatDuration = (seconds: number | string) => {
  const sec = typeof seconds === "string" ? parseInt(seconds, 10) : Number(seconds);
  if (sec === null || sec === undefined || isNaN(sec)) return "-";
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
    if (s === 0) return `${m} phút`;
    return `${m} phút ${s} giây`;
  }

  return `${sec} giây`;
};

const ExamStudentList = ({ students }: { students: Student[] }) => {
  // Các state để quản lý Popup Nhận xét
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  // Data lấy từ API
  const [ketQuaDetail, setKetQuaDetail] = useState<KetQua | null>(null);
  const [teacherFeedback, setTeacherFeedback] = useState("");
  
  // Trạng thái loading
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Mở popup và gọi API lấy chi tiết nhận xét
  const handleOpenFeedback = async (student: Student) => {
    setSelectedStudent(student);
    setIsOpen(true);
    setIsLoading(true);
    setTeacherFeedback(""); // Reset ô nhập liệu

    try {
      // Giả sử student.id chính là ketQuaId lưu trong DB
      const data = await examAPI.getKetQuaById(student.id.toString());
      if (data) {
        setKetQuaDetail(data);
        setTeacherFeedback(data.nhanXetGiaoVien || "");
      }
    } catch (error) {
      console.error("Lỗi lấy dữ liệu:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Lưu nhận xét xuống Backend
  const handleSaveFeedback = async () => {
    if (!selectedStudent) return;
    setIsSaving(true);
    try {
      // GỌI API ĐỂ LƯU (Cần Quyết viết thêm API này bên Backend)
      await axiosInstance.put(`/api/ket-qua/${selectedStudent.id}/giao-vien-nhan-xet`, {
        nhanXetGiaoVien: teacherFeedback
      });
      alert("Đã lưu nhận xét giáo viên thành công!");
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      alert("Lỗi khi lưu nhận xét. Vui lòng kiểm tra lại API.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 border border-indigo-100 mb-8 relative">
      <h3 className="font-bold text-indigo-700 mb-4">Danh sách học sinh chi tiết</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-indigo-50 border-b border-indigo-100">
              <th className="p-3 font-bold text-indigo-700 w-16">STT</th>
              <th className="p-3 font-bold text-indigo-700">Họ tên</th>
              <th className="p-3 font-bold text-indigo-700">Lần thi</th>
              <th className="p-3 font-bold text-indigo-700">Điểm</th>
              <th className="p-3 font-bold text-indigo-700">Thời gian làm</th>
              <th className="p-3 font-bold text-indigo-700 text-center">Đánh giá</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, idx) => (
              <tr key={student.id} className="border-b border-indigo-50 hover:bg-indigo-50/30 transition-colors">
                <td className="p-3 text-slate-500">{idx + 1}</td>
                <td className="p-3 font-semibold text-slate-800">{student.name}</td>
                <td className="p-3">{student.attempt}</td>
                <td className="p-3 font-bold text-blue-600">{student.score}</td>
                <td className="p-3">{formatDuration(student.time)}</td>
                <td className="p-3 text-center">
                  <button 
                    onClick={() => handleOpenFeedback(student)}
                    className="text-indigo-600 hover:text-white hover:bg-indigo-500 border border-indigo-200 px-3 py-1 rounded-lg text-xs font-semibold transition-all"
                  >
                    Nhận xét
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ========================================== */}
      {/* KHỐI POPUP (MODAL) NHẬP NHẬN XÉT CỦA GIÁO VIÊN */}
      {/* ========================================== */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in-up">
            
            <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800">Đánh giá bài làm: {selectedStudent?.name}</h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-red-500 font-bold text-xl leading-none">&times;</button>
            </div>

            <div className="p-5 max-h-[70vh] overflow-y-auto">
              {isLoading ? (
                <div className="text-center text-slate-500 py-6">Đang tải dữ liệu bài làm...</div>
              ) : (
                <div className="space-y-5">
                  {/* Ô 1: Nhận xét hệ thống */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">🤖 Gợi ý từ Hệ thống:</label>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                      {ketQuaDetail?.nhanXetHeThong || "Hệ thống chưa có đánh giá."}
                    </div>
                  </div>

                  {/* Ô 2: Giáo viên nhập */}
                  <div>
                    <label className="block text-sm font-bold text-blue-700 mb-2">👩‍🏫 Nhận xét của Thầy/Cô:</label>
                    <textarea 
                      className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-700 transition-all"
                      rows={5}
                      placeholder="Nhập lời khuyên, động viên hoặc nhắc nhở dành cho học sinh này..."
                      value={teacherFeedback}
                      onChange={(e) => setTeacherFeedback(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 font-medium transition-colors"
              >
                Hủy
              </button>
              <button 
                onClick={handleSaveFeedback}
                disabled={isLoading || isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving ? "Đang lưu..." : "Lưu nhận xét"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamStudentList;