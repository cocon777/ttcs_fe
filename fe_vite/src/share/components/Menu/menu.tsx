import { LogOut } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import UserAPI from "../../../services/apis/userAPI";
import AuthAPI from "../../../services/apis/authAPI";
import type { NguoiDung } from "../../interfaces/user.interface";
// import UserAvatar from "../userAvatar";

const Menu = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<NguoiDung>({} as NguoiDung);

  const fetchUserInfo = useCallback(async () => {
    try {
      const response = await UserAPI.getInfo();
      if (response?.status === 200) {
        setUser(response.data);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  }, []);

  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  const handleLogout = useCallback(() => {
    AuthAPI.logout();
    navigate("/auth/login", { replace: true });
  }, [navigate]);

  return (
    <div className="flex items-center gap-3 pr-4">
      {/* {user?.ten && <UserAvatar ten={user.ten} />} */}

      <div className="text-sm font-medium text-slate-800 dark:text-gray-300">
        {user.ten}
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-darkmode-400"
      >
        <LogOut strokeWidth={1.5} className="size-4" />
        Đăng xuất
      </button>
    </div>
  );
};

export default Menu;
