import StudentLayout from "../../../share/layouts/studentLayout";
import ClassListPage from "./pages/ClassListPage";
import ClassDetailPage from "./pages/ClassDetailPage";
import ClassExamListPage from "./pages/ClassExamListPage";
import ClassLectureListPage from "./pages/ClassLectureListPage";

const StudentClassRoutes = {
  path: "",
  element: <StudentLayout />,
  children: [
    { path: "classroom", element: <ClassListPage /> },
    { path: "classroom/:classId", element: <ClassDetailPage /> },
    { path: "classroom/:classId/exams", element: <ClassExamListPage /> },
    {
      path: "classroom/:classId/lectures",
      element: <ClassLectureListPage />,
    },
  ],
};

export default StudentClassRoutes;
