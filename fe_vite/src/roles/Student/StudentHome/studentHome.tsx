import { PiExam } from "react-icons/pi";
import { SiGoogleclassroom } from "react-icons/si";
import { TbChartBar, TbMessageChatbot, TbSchool } from "react-icons/tb";
import { Link } from "react-router-dom";
import UserAPI from "../../../services/apis/userAPI";
import { useEffect, useState } from "react";

const MAIN_TABS = [
  {
    icon: SiGoogleclassroom,
    label: "Lớp học",
    description: "Tham gia lớp, xem bài giảng, làm đề giáo viên giao",
    link: "/student/classroom",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-700",
  },
  {
    icon: PiExam,
    label: "Tự luyện đề",
    description: "Tự tạo và tự luyện đề",
    link: "/student/my-exams",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-700",
  },
  {
    icon: TbChartBar,
    extraIcon: TbMessageChatbot,
    label: "Phân tích kết quả",
    description:
      "Xem điểm số, phân tích bài làm và xem nhận xét của hệ thống/giáo viên",
    link: "/student/classroom",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-700",
  },
];

const STEPS = [
  "Vào trang Tài khoản xem Mã học sinh và báo cho giáo viên thêm vào lớp",
  "Vào lớp, xem bài giảng, làm đề giáo viên giao",
  "Xem kết quả, nhận xét từ giáo viên và từ hệ thống",
];

const StudentHome: React.FC = () => {
  const [tenHocSinh, setTenHocSinh] = useState<string>("");

  useEffect(() => {
    const fetchName = async () => {
      const res = await UserAPI.getInfo();
      if (res?.data?.ten) {
        setTenHocSinh(res.data.ten);
      } else {
        const userString = localStorage.getItem("user");
        const user = userString ? JSON.parse(userString) : null;
        setTenHocSinh(user?.tenDangNhap ?? "Học sinh");
      }
    };
    fetchName();
  }, []);
  return (
    <div className="mx-auto w-4/5 max-w-4xl py-10 text-gray-800">
      <div className="mb-8 flex items-center gap-6 rounded-2xl bg-gray-50 px-8 py-6">
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
          <TbSchool className="h-8 w-8 text-blue-700" />
        </div>
        <div>
          <h1 className="mb-1 text-xl font-semibold text-gray-900">
            Xin chào {tenHocSinh || "..."}
          </h1>
          <p className="text-lg leading-relaxed text-black-500">
            HỆ THỐNG QUẢN LÝ HỌC TẬP VÀ LUYỆN TẬP TRẮC NGHIỆM TRỰC TUYẾN
          </p>
          <p className="text-sm leading-relaxed text-gray-500">
            Quản lý lớp học,tạo đề thi, theo dõi kết quả và cung cấp phản hồi cho giáo viên/học
            sinh.
          </p>
        </div>
      </div>

      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-black-400">
        Chức năng chính
      </p>
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {MAIN_TABS.map((tab, index) => (
          <Link
            to={tab.link}
            key={index}
            className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
          >
            <div
              className={`mb-3 flex h-10 w-10 items-center justify-center gap-1 rounded-lg ${tab.iconBg}`}
            >
              <tab.icon className={`h-8 w-8 ${tab.iconColor}`} />

              {tab.extraIcon && (
                <tab.extraIcon className={`h-8 w-8 ${tab.iconColor}`} />
              )}
            </div>
            <p className="mb-1 text-sm font-semibold text-gray-800">
              {tab.label}
            </p>
            <p className="text-xs leading-relaxed text-gray-400">
              {tab.description}
            </p>
          </Link>
        ))}
      </div>

      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-black-400">
        Hướng dẫn nhanh
      </p>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {STEPS.map((step, index) => (
          <div
            key={index}
            className="flex items-start gap-3 rounded-xl bg-gray-50 px-4 py-3"
          >
            <span className="mt-0.5 text-lg font-semibold text-blue-700">
              {index + 1}
            </span>
            <p className="text-sm leading-relaxed text-gray-500">{step}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentHome;
