import StudentLayout from "../../share/layouts/studentLayout";
import ExamLayout from "../../share/layouts/examLayout";
import StudentHome from "./StudentHome/studentHome";
import TakeExamPage from "../../modules/Exam/student/pages/TakeExamPage";
import ClassListPage from "../../modules/Class/student/pages/ClassListPage";
import ClassDetailPage from "../../modules/Class/student/pages/ClassDetailPage";
import ClassExamListPage from "../../modules/Class/student/pages/ClassExamListPage";
import ClassLectureListPage from "../../modules/Class/student/pages/ClassLectureListPage";
import ExamPreviewPage from "../../modules/Exam/student/pages/ExamPreviewPage";
import ExamResultPage from "../../modules/Exam/student/pages/ExamResultPage";
import ExamResultDetailPage from "../../modules/Exam/student/pages/ExamResultDetailPage";

const StudentRoutes = {
  path: "student",
  children: [
    {
      path: "",
      element: <StudentLayout />,
      children: [
        { path: "", element: <StudentHome /> },
        { path: "studenthome", element: <StudentHome /> },
        { path: "classroom", element: <ClassListPage /> },
        { path: "classroom/:classId", element: <ClassDetailPage /> },
        { path: "classroom/:classId/exams", element: <ClassExamListPage /> },
        {
          path: "classroom/:classId/lectures",
          element: <ClassLectureListPage />,
        },
        { path: "results/:ketQuaId", element: <ExamResultPage /> },
        {
          path: "results/:ketQuaId/detail",
          element: <ExamResultDetailPage />,
        },
        { path: "exams", element: <></> },
        { path: "exams/:examId", element: <ExamPreviewPage /> },
      ],
    },
    {
      path: "take-exam/:examId",
      element: <ExamLayout />,
      children: [{ index: true, element: <TakeExamPage /> }],
    },
  ],
};

export default StudentRoutes;
