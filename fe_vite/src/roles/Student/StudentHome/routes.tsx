import StudentHome from "./studentHome";
import StudentLayout from "../../../share/layouts/studentLayout";

const StudentHomeRoutes = {
  path: "",
  element: <StudentLayout />,
  children: [
    { path: "", element: <StudentHome /> },
    { path: "studenthome", element: <StudentHome /> },
  ],
};

export default StudentHomeRoutes;
