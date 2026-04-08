// 🚀 ĐÃ SỬA: Thêm chữ -dom vào sau react-router
import { Outlet } from "react-router-dom"; 
import TeacherSideBar from "../components/Sidebar/TeacherSideBar";
import TopBar from "../components/TopBar/topbar";

const TeacherLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <TeacherSideBar />
      <div className="grid h-full flex-1 grid-rows-[auto_1fr] overflow-hidden px-4">
        <div className="grid min-h-0 grid-rows-[auto_1fr] rounded-3xl dark:bg-[rgb(var(--color-darkmode-700))]">
          <TopBar />
          <div className="scrollbar h-full overflow-y-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherLayout;