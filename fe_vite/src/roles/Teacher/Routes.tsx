import TeacherLayout from "../../share/layouts/teacherLayout";
// Đã xóa import CreateLecture vì không còn dùng làm trang riêng nữa
import ClassManagement from "../../modules/Class/teacher/ClassManagement/classManagement";
import ClassDetail from "../../modules/Class/teacher/ClassDetail/classDetail"; 

const TeacherClassRoutes = {
  path: "teacher", 
  element: <TeacherLayout />,
  children: [
    // 🚀 Tiễn trang tạo bài giảng ra chuồng gà!
    { path: "class/management", element: <ClassManagement /> },
    
    // Giữ nguyên id để khớp với params trong component
    { path: "class/classroom-detail/:id", element: <ClassDetail /> },
  ],
};

export default TeacherClassRoutes;