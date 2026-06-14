import Logo from "./icon.svg";
import { LuHouse } from "react-icons/lu";
import { PiExam } from "react-icons/pi";
import { SiGoogleclassroom } from "react-icons/si";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";

const TABS = [
  { icon: LuHouse, link: "/teacher", label: "Trang chủ" },
  { icon: SiGoogleclassroom, link: "/teacher/class/management", label: "Quản lý lớp" },
  { icon: PiExam, link: "/teacher/exam/management", label: "Quản lý đề" },
];

const TeacherSideBar = () => {
  return (
    <nav className="hidden h-screen w-24 bg-blue-800 dark:bg-[#1b253b] md:block">
      <div className="flex flex-col items-center pt-5">
        <Link to="/teacher">
          <img src={Logo} alt="Logo" className="w-12 h-12" />
        </Link>
        <div className="mt-9 space-y-1">
          {TABS.map((tab, index) => (
            <NavLink
              key={index}
              to={tab.link}
              end={tab.link === "/teacher"}
              className={({ isActive }) =>
                `flex flex-col items-center px-4 py-3 ${
                  isActive
                    ? "rounded-l-full bg-slate-100 text-blue-800 mr-[-1px]"
                    : "text-white"
                }`
              }
            >
              <tab.icon className="size-6" />
              <span className="mt-1 text-xs">{tab.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default TeacherSideBar;
