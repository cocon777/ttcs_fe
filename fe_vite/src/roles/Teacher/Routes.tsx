import TeacherHomeRoutes from "./TeacherHome/routes";

const TeacherRoutes = {
  path: "teacher",
  children: [{ ...TeacherHomeRoutes }],
};

export default TeacherRoutes;
