import { useState } from "react";
import { CalendarCheck, Newspaper, User } from "lucide-react";
import { useParams } from "react-router-dom"; 
import StudentManagement from "./StudentManagement"; 

const TABS = [
  { icon: User, label: "Danh sách học sinh", index: 0 },
  { icon: CalendarCheck, label: "Bài giảng", index: 1 },
  { icon: Newspaper, label: "Đề thi", index: 2 },
];

const ClassDetail = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { id } = useParams(); 

  const renderContent = () => {
    switch (selectedIndex) {
      case 0:
        // 🚀 ĐÃ SỬA: Xóa cái khung đỏ đi, bật lại bảng danh sách học sinh
        return id ? <StudentManagement classId={Number(id)} /> : <div>Không tìm thấy ID lớp!</div>;
      case 1:
        return <div className="p-10 text-center text-gray-500">Khu vực quản lý bài giảng (Sáng mai làm)</div>;
      case 2:
        return <div className="p-10 text-center text-gray-500">Khu vực quản lý đề thi</div>;
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-12 min-h-screen bg-slate-50">
      {/* Sidebar bên trái */}
      <div className="sticky top-0 col-span-2 h-screen border-r border-slate-200 bg-white">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-blue-700">MENU QUẢN LÝ</h2>
        </div>
        <div className="p-4 flex flex-col gap-2">
          {TABS.map((tab, index) => (
            <div
              key={index}
              onClick={() => setSelectedIndex(tab.index)}
              className={
                "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all cursor-pointer " +
                (selectedIndex === tab.index 
                  ? "bg-blue-600 text-white shadow-md" 
                  : "text-slate-600 hover:bg-slate-100")
              }
            >
              <tab.icon size={20} />
              {tab.label}
            </div>
          ))}
        </div>
      </div>

      {/* Nội dung bên phải */}
      <div className="col-span-10 p-8 overflow-y-auto h-screen">
          {renderContent()}
      </div>
    </div>
  );
};

export default ClassDetail;