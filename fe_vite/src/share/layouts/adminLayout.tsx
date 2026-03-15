import { Outlet } from "react-router";
import TopBar from "../components/TopBar/topbar";

const AdminLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex h-full flex-1 flex-col overflow-hidden px-4">
        <TopBar />
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
