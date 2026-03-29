import { useEffect } from "react";
import UserAPI from "../../services/apis/userAPI";
import { useNavigate } from "react-router";

const HomePage = () => {
  const navigate = useNavigate();

  const handleUserRedirect = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      return navigate("/auth/login", { replace: true });
    }

    try {
      const response = await UserAPI.getInfo();

      if (!response) {
        return navigate("/auth/login", { replace: true });
      }

      const user = response.data;

      if (user.vaiTro === "ADMIN") {
        navigate("/admin");
      } else if (user.vaiTro === "GV") {
        navigate("/teacher/teacherhome");
      } else {
        navigate("/student/studenthome");
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      navigate("/auth/login", { replace: true });
    }
  };

  useEffect(() => {
    handleUserRedirect();
  }, []);

  return <div>Homepage</div>;
};

export default HomePage;
