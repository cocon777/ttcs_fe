// import TeacherLayout from "../../../share/layouts/teacherLayout";
// import ClassManagement from "./ClassManagement/classManagement";
// import ClassDetail from "./ClassDetail/classDetail";
// const TeacherClassRoutes = {
//   path: "class",
//   element: <TeacherLayout />,
//   children: [
//     { path: "management", element: <ClassManagement /> },
//     { path: "classroom-detail/:classId", element: <ClassDetail /> },
//   ],
// };

// export default TeacherClassRoutes;

import TeacherLayout from "../../../share/layouts/teacherLayout";
// import CreateLecture from "../../CreateLecture";
import ClassManagement from "./ClassManagement/classManagement";
import ClassDetail from "./ClassDetail/classDetail";

const TeacherClassRoutes = {
  path: "",
  element: <TeacherLayout />,
  children: [
    // { path: "class/tao-bai-giang", element: <CreateLecture /> },
    { path: "class/management", element: <ClassManagement /> },
    { path: "class/classroom-detail/:id", element: <ClassDetail /> },
  ],
};

export default TeacherClassRoutes;
