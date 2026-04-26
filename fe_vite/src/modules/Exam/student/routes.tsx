import ExamLayout from "../../../share/layouts/examLayout";
import TakeExamPage from "./pages/TakeExamPage";
import ExamPreviewPage from "./pages/ExamPreviewPage";
import ExamResultPage from "./pages/ExamResultPage";
import ExamResultDetailPage from "./pages/ExamResultDetailPage";
import StudentExamManagement from "./pages/StudentExamManagement";
import StudentLayout from "../../../share/layouts/studentLayout";
import EditorLayout from "../../../share/layouts/editorLayout";
import Editor from "../teacher/Editor/editor";

const StudentExamRoutes = {
  path: "",
  children: [
    {
      path: "",
      element: <StudentLayout />,
      children: [
        { path: "results/:ketQuaId", element: <ExamResultPage /> },
        { path: "results/:ketQuaId/detail", element: <ExamResultDetailPage /> },
        { path: "exams", element: <></> },
        { path: "exams/:examId", element: <ExamPreviewPage /> },
        { path: "my-exams", element: <StudentExamManagement /> },
      ],
    },
    {
      path: "take-exam/:examId",
      element: <ExamLayout />,
      children: [{ index: true, element: <TakeExamPage /> }],
    },
    {
      path: "exam-editor",
      element: <EditorLayout />,
      children: [{ index: true, element: <Editor /> }],
    },
  ],
};

export default StudentExamRoutes;
