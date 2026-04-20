import { useState } from "react";
import { useParams } from "react-router-dom";
import { Users, BookOpen, FileText } from "lucide-react";
import StudentManagement from "././StudentManagement";
const ClassroomDetail = () => {
  // 1. Lấy cái ID lớp học từ trên thanh URL xuống
  const { id } = useParams();

  // 2. Cái "Công tắc" để chuyển Tab (Mặc định mở tab 'students')
  const [activeTab, setActiveTab] = useState<"students" | "lectures" | "exams">(
    "students",
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* 🟢 CỘT MENU BÊN TRÁI */}
      <div className="w-64 bg-white border-r border-slate-200 shadow-sm flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-blue-700">MENU QUẢN LÝ</h2>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-2">
          {/* Nút 1: Danh sách học sinh */}
          <button
            onClick={() => setActiveTab("students")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
              activeTab === "students"
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Users size={20} />
            Danh sách học sinh
          </button>

          {/* Nút 2: Bài giảng */}
          <button
            onClick={() => setActiveTab("lectures")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
              activeTab === "lectures"
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <BookOpen size={20} />
            Bài giảng
          </button>

          {/* Nút 3: Đề thi */}
          <button
            onClick={() => setActiveTab("exams")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
              activeTab === "exams"
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <FileText size={20} />
            Đề thi
          </button>
        </nav>
      </div>

      {/* 🟢 KHUNG NỘI DUNG BÊN PHẢI (Sẽ thay đổi theo công tắc) */}
      <div className="flex-1 p-8 overflow-y-auto">
        {/* NẾU activeTab là students -> Bật component StudentManagement anh em mình code nãy giờ lên */}
        {activeTab === "students" && <StudentManagement classId={Number(id)} />}

        {/* NẾU activeTab là lectures -> Hiện khung chờ để mai mốt code Bài giảng */}
        {activeTab === "lectures" && (
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-10 text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Giao diện Bài Giảng
            </h2>
            <p className="text-slate-500">
              Khu vực này sẽ code danh sách và thêm bài giảng vào đây!
            </p>
          </div>
        )}

        {/* NẾU activeTab là exams -> Hiện khung chờ */}
        {activeTab === "exams" && (
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-10 text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Giao diện Đề Thi
            </h2>
            <p className="text-slate-500">
              Chỗ này để tạo câu hỏi trắc nghiệm!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassroomDetail;
