import { createBrowserRouter, Navigate } from "react-router-dom"; // Thêm chữ Navigate ở đây
import App from "../App";
import AdminRoutes from "../roles/Admin/Routes";
import TeacherRoutes from "../roles/Teacher/Routes";
import StudentRoutes from "../roles/Student/Routes";
import AuthRoutes from "../pages/Auth/routes";
// Tạm thời comment trang HomePage lại để nó không gây lỗi nữa
// import HomePage from "../pages/HomePage/homePage"; 

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // 🚀 NÂNG CẤP TẠI ĐÂY: Vừa vào web (/) là tự động "đá" sang trang Login
      { index: true, element: <Navigate to="/auth/login" replace /> },
      
      { ...AdminRoutes },
      { ...TeacherRoutes },
      { ...StudentRoutes },
      { ...AuthRoutes },
    ],
  },
]);