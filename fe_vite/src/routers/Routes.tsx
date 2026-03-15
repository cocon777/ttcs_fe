import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import AdminRoutes from "../roles/Admin/Routes";
import TeacherRoutes from "../roles/Teacher/Routes";
import StudentRoutes from "../roles/Student/Routes";
import AuthRoutes from "../pages/Auth/routes";
import HomePage from "../pages/HomePage/homePage";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { ...AdminRoutes },
      { ...TeacherRoutes },
      { ...StudentRoutes },
      { ...AuthRoutes },
    ],
  },
]);
