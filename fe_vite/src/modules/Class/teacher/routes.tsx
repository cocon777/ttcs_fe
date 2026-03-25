import TeacherLayout from "../../../share/layouts/teacherLayout";
import ClassManagement from "./ClassManagement/classManagement";
import ClassDetail from "./ClassDetail/classDetail";
const TeacherClassRoutes = {
  path: "class",
  element: <TeacherLayout />,
  children: [
    { path: "management", element: <ClassManagement /> },
    { path: "classroom-detail/:classId", element: <ClassDetail /> },
  ],
};

export default TeacherClassRoutes;
