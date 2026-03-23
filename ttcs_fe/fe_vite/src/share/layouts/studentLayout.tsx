import { Outlet } from "react-router";
import TopBar from "../components/TopBar/topbar";
import StudentSideBar from "../components/Sidebar/StudentSideBar";
const StudentLayout = () => {

  return (
    <div className="flex h-screen overflow-y-hidden">
      <StudentSideBar />
      <div className="flex flex-1 flex-col">
        <TopBar />
        <div className="flex-1 overflow-y-scroll">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default StudentLayout;
