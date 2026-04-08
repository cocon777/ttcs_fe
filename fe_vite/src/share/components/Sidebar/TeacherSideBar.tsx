import { LuHouse } from "react-icons/lu";
import { LiaSchoolSolid } from "react-icons/lia";
import { PiExam } from "react-icons/pi";
import { SiGoogleclassroom } from "react-icons/si";
// 1. Tôi đã thêm icon mới chuyên dùng cho "Tạo bài" ở đây
import { MdOutlinePostAdd } from "react-icons/md"; 
import { Link, NavLink } from "react-router-dom";

const TABS = [
  { icon: LuHouse, link: "/teacher" },
  { icon: SiGoogleclassroom, link: "/teacher/class/management" },
  { icon: LiaSchoolSolid, link: "/teacher/class/management" },
  { icon: PiExam, link: "/teacher/class/management" },
  // 2. Thêm một nút mới tinh vào danh sách Menu
  { icon: MdOutlinePostAdd, link: "/teacher/class/tao-bai-giang" },
];

const TeacherSideBar = () => {
  return (
    <nav className="hidden h-screen w-24 bg-blue-800 dark:bg-[#1b253b] md:block">
      <div className="flex flex-col items-center pt-5">
        <Link to="/">{/* <img src={Logo} alt="" className="w-10" /> */}</Link>
        <div className="mt-9 space-y-1">
          {TABS.map((tab, index) => (
            <NavLink
              key={index}
              className={({ isActive }) =>
                `block px-6 py-3 ${isActive ? "rounded-l-full bg-white text-blue-800" : "text-white"}`
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

export default TeacherSideBar;