import DashboardRoutes from "./Dashboard/routes";

const AdminRoutes = {
  path: "admin",
  children: [{ ...DashboardRoutes }],
};

export default AdminRoutes;