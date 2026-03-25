import { Outlet } from "react-router";

const ExamLayout = () => {
  return (
    <div className="h-screen w-screen bg-slate-100">
      <Outlet />
    </div>
  );
};

export default ExamLayout;