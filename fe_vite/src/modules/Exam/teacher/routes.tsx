import TeacherLayout from "../../../share/layouts/teacherLayout";
import EditorLayout from "../../../share/layouts/editorLayout";
import ExamManagement from "./ExamManagement/examManagement";
import Editor from "./Editor/editor";
import ExamInfor from "./ExamInfor/examInfor";
import ExamConfig from "./ExamConfig/examConfig";
const ExamRoutes = {
  path: "exam",
  children: [
    {
      path: "",
      element: <TeacherLayout />,
      children: [
        { path: "management", element: <ExamManagement /> },
        { path: "exam-infor/:deId", element: <ExamInfor /> },
        {
          path: "exam-config/:deId",
          element: <ExamConfig />,
        },
      ],
    },
    {
      path: "editor",
      element: <EditorLayout />,
      children: [{ path: "", element: <Editor /> }],
    },
  ],
};

export default ExamRoutes;
