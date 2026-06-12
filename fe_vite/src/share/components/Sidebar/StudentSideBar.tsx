import Logo from "./icon.svg";
import { LuHouse } from "react-icons/lu";
import { SiGoogleclassroom } from "react-icons/si";
import { PiExam } from "react-icons/pi";
import { NavLink, Link } from "react-router-dom";

const TABS = [
  { icon: LuHouse, link: "/student", label: "Trang chủ" },
  { icon: SiGoogleclassroom, link: "/student/classroom", label: "Lớp học" },
  { icon: PiExam, link: "/student/my-exams", label: "Tự luyện" },
];

const StudentSideBar = () => {
  return (
    <nav className="h-screen w-24 bg-blue-800">
      <div className="flex flex-col items-center pt-5">
        <Link to="/student">
          <img src={Logo} alt="Logo" className="w-12 h-12" />
        </Link>{" "}
        <div className="mt-9 space-y-1">
          {TABS.map((tab, index) => (
            <NavLink
              key={index}
              to={tab.link}
              end={tab.link === "/student"}
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

export default StudentSideBar;
