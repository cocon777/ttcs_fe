import StudentHomeRoutes from "./StudentHome/routes";

const StudentRoutes = {
  path: "student",
  children: [{ ...StudentHomeRoutes }],
};

export default StudentRoutes;
