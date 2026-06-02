import StudentHome from "./studentHome";
import StudentLayout from "../../../share/layouts/studentLayout";
import AccountPage from "../../../pages/Account/AccountPage";
const StudentHomeRoutes = {
  path: "",
  element: <StudentLayout />,
  children: [
    { path: "", element: <StudentHome /> },
    { path: "studenthome", element: <StudentHome /> },
    { path: "account", element: <AccountPage /> },
  ],
};

export default StudentHomeRoutes;
