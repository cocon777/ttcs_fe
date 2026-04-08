import TeacherLayout from "../../share/layouts/teacherLayout";
import CreateLecture from "../../CreateLecture";
import ClassManagement from "../../modules/Class/teacher/ClassManagement/classManagement";
// ⚠️ Đảm bảo file classDetail.tsx này CHÍNH LÀ cái file tôi vừa code cho ông lúc nãy (cái có menu Bài giảng, Đề thi ấy)
import ClassDetail from "../../modules/Class/teacher/ClassDetail/classDetail"; 

const TeacherClassRoutes = {
  path: "teacher", 
  element: <TeacherLayout />,
  children: [
    { path: "class/tao-bai-giang", element: <CreateLecture /> },
    { path: "class/management", element: <ClassManagement /> },
    
    // 🚀 ĐÃ SỬA: Đổi :classId thành :id để khớp với giao diện
    { path: "class/classroom-detail/:id", element: <ClassDetail /> },
  ],
};

export default TeacherClassRoutes;