import TeacherLayout from "../../../share/layouts/teacherLayout";
// ĐÃ XÓA: import CreateLecture vì không còn dùng làm trang riêng nữa
import ClassManagement from "./ClassManagement/classManagement";
import ClassDetail from "./ClassDetail/classDetail";

const TeacherClassRoutes = {
  path: "", 
  element: <TeacherLayout />,
  children: [
    // ĐÃ XÓA: route class/tao-bai-giang
    
    { path: "class/management", element: <ClassManagement /> },
    
    // Giữ nguyên để vào chi tiết lớp
    { path: "class/classroom-detail/:id", element: <ClassDetail /> },
  ],
};

export default TeacherClassRoutes;