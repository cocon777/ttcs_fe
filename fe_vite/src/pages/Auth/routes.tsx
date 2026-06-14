import AuthLayout from "../../share/layouts/authLayout";
import Login from "./Login/login";
import Register from "./Register/register";

const AuthRoutes = {
  path: "auth",
  children: [
    {
      path: "",
      element: <AuthLayout />,
      children: [
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
      ],
    },
  ],
};

export default AuthRoutes;
