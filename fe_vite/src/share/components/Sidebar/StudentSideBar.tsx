// import Logo from "../../../icons.svg";
import { LuHouse } from "react-icons/lu";
import { SiGoogleclassroom } from "react-icons/si";
import { PiExam } from "react-icons/pi";
import { NavLink } from "react-router-dom";

const TABS = [
  { icon: LuHouse, link: "/student" },
  { icon: SiGoogleclassroom, link: "/student/classroom" },
  { icon: PiExam, link: "/student/exams" },
];

const StudentSideBar = () => {
  return (
    <nav className="h-screen w-24 bg-blue-800">
      <div className="flex flex-col items-center pt-5">
        {/* <img src={Logo} alt="" className="w-10" /> */}
        <div className="mt-9 space-y-1">
          {TABS.map((tab, index) => (
            <NavLink
              key={index}
              className={({ isActive }) =>
                `block px-6 py-3 ${
                  isActive
                    ? "rounded-l-full bg-white text-blue-800"
                    : "text-white"
                }`
              }
              to={tab.link}
            >
              <tab.icon className="size-6" />
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default StudentSideBar;
