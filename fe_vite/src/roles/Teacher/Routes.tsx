import TeacherHomeRoutes from "./TeacherHome/routes";
import ExamRoutes from "../../modules/Exam/teacher/routes";
import TeacherClassRoutes from "../../modules/Class/teacher/routes";

const TeacherRoutes = {
  path: "teacher",
  children: [
    { ...TeacherHomeRoutes },
    { ...ExamRoutes },
    { ...TeacherClassRoutes },
  ],
};

export default TeacherRoutes;
