import AdminLayout from "../../../share/layouts/adminLayout";
import AdminDashboard from "./dashBoard";
const DashboardRoutes = {
  path: "",
  element: <AdminLayout />,
  children: [
    { path: "", element: <AdminDashboard /> },
    {
      path: "dashboard",
      element: <AdminDashboard />,
    },
  ],
};

export default DashboardRoutes;