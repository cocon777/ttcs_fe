import { LiaSchoolSolid } from "react-icons/lia";
import { PiExam } from "react-icons/pi";
import { SiGoogleclassroom } from "react-icons/si";
import { Link } from "react-router-dom";

const TABS = [
  {
    icon: SiGoogleclassroom,
    label: "Quản lý lớp",
    link: "/teacher/class/management",
  },
  {
    icon: LiaSchoolSolid,
    label: "Bài giảng",
    link: "/teacher/lesson/management",
  },
  { icon: PiExam, label: "Đề", link: "/teacher/exam/management" },
];

const TeacherHome: React.FC = () => {
  return (
    <div className="w-full text-gray-800">
      <div className="mx-auto w-4/5 pt-10">
        <div className="grid grid-cols-9 gap-9">
          {TABS.map((tab, index) => (
            <Link
              to={tab.link}
              key={index}
              className="col-span-6 h-full rounded-md bg-white shadow-sm duration-300 ease-in-out hover:scale-105 hover:shadow-md dark:bg-[rgb(var(--color-darkmode-600))] md:col-span-3"
            >
              <div className="p-8">
                <tab.icon
                  className="mx-auto size-12 text-blue-800"
                  strokeWidth={1.5}
                />
                <div className="mt-3 text-center font-medium">{tab.label}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherHome;
