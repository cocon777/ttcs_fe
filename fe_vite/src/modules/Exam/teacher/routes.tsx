import TeacherLayout from "../../../share/layouts/teacherLayout";
import EditorLayout from "../../../share/layouts/editorLayout";
import ExamManagement from "./ExamManagement/examManagement";
import Editor from "./Editor/editor";

const ExamRoutes = {
  path: "exam",
  children: [
    {
      path: "",
      element: <TeacherLayout />,
      children: [{ path: "management", element: <ExamManagement /> }],
    },
    {
      path: "editor",
      element: <EditorLayout />,
      children: [
        { path: "", element: <Editor /> },
      ],
    },
  ],
};

export default ExamRoutes;
