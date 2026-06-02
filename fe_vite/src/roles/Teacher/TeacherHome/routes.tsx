import TeacherLayout from "../../../share/layouts/teacherLayout";
import TeacherHome from "./teacherHome";
import AccountPage from "../../../pages/Account/AccountPage";

const TeacherHomeRoutes = {
    path: "",
    element: <TeacherLayout />,
    children: [
        { path: "", element: <TeacherHome /> },
        { path: "teacherhome", element: <TeacherHome /> },
        { path: "account", element: <AccountPage /> },
    ]
}

export default TeacherHomeRoutes;