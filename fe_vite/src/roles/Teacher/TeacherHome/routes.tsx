import TeacherLayout from "../../../share/layouts/teacherLayout";
import TeacherHome from "./teacherHome";

const TeacherHomeRoutes = {
    path: "",
    element: <TeacherLayout />,
    children: [
        { path: "", element: <TeacherHome /> },
        {path : "teacherhome", element : <TeacherHome/>}
    ]
}

export default TeacherHomeRoutes;