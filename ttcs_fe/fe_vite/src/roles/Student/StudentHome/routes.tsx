import StudentLayout from "../../../share/layouts/studentLayout";
import StudentHome from "./studentHome";

const StudentHomeRoutes = {
  path: "",
  element: <StudentLayout />,
  children: [
    { path: "", element: <StudentHome /> },
    { path: "studenthome", element: <StudentHome /> },
  ],
};

export default StudentHomeRoutes;