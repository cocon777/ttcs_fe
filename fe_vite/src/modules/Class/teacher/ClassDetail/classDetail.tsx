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
  
  // Đã xóa 1 dòng thừa, chỉ giữ lại 1 khai báo id duy nhất
  const { id } = useParams(); 

  const renderContent = () => {
    switch (selectedIndex) {
      case 0:
        return id ? (
          <StudentManagement classId={Number(id)} />
        ) : (
          <div>Không tìm thấy lớp</div>
        );

      case 1:
        return (
          <div className="p-10 text-center text-gray-500">
            Khu vực quản lý bài giảng
          </div>
        );
      case 2:
        return (
          <div className="p-10 text-center text-gray-500">
            Khu vực quản lý đề thi
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-12 min-h-screen bg-white">
      {/* Sidebar bên trái */}
      <div className="sticky top-0 col-span-2 h-[660px] border-r border-gray-300 dark:border-darkmode-400">
        <div className="pl-6 pr-3 pt-6">
          <div className="mb-6 px-2 text-xs font-bold uppercase text-slate-400">
            Menu quản lý
          </div>
          {TABS.map((tab, index) => (
            <div
              key={index}
              onClick={() => setSelectedIndex(tab.index)}
              className={
                "flex items-center gap-2 rounded-md px-3 py-2.5 mb-1 transition-all hover:cursor-pointer " +
                (selectedIndex === tab.index
                  ? "bg-blue-800 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300")
              }
            >
              <tab.icon className="size-4" strokeWidth={1.5} />
              <div className="text-sm font-medium">{tab.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Nội dung bên phải */}
      <div className="col-span-10 bg-slate-50/50 p-6">{renderContent()}</div>
    </div>
  );
};

export default ClassDetail;