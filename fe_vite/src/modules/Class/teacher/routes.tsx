import TeacherLayout from "../../../share/layouts/teacherLayout";
// import CreateLecture from "../../CreateLecture";
import ClassManagement from "./ClassManagement/classManagement";
import ClassDetail from "./ClassDetail/classDetail";
import ExamStatistics from "./ClassDetail/ExamStatistics";
import ExamDetailPage from "./ClassDetail/ExamDetailPage";

const TeacherClassRoutes = {
  path: "",
  element: <TeacherLayout />,
  children: [
    // { path: "class/tao-bai-giang", element: <CreateLecture /> },
    { path: "class/management", element: <ClassManagement /> },
    { path: "class/classroom-detail/:id", element: <ClassDetail /> },
    { path: "class/:classId/exam/:examId/detail", element: <ExamDetailPage /> },
    { path: "class/:classId/exam/:id/statistics", element: <ExamStatistics /> },
  ],
};

export default TeacherClassRoutes;
