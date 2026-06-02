// import { LogOut } from "lucide-react";
// import { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import UserAPI from "../../../services/apis/userAPI";
// import AuthAPI from "../../../services/apis/authAPI";
// import type { NguoiDung } from "../../interfaces/user.interface";
// // import UserAvatar from "../userAvatar";

// const Menu = () => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState<NguoiDung>({} as NguoiDung);

//   const fetchUserInfo = useCallback(async () => {
//     try {
//       const response = await UserAPI.getInfo();
//       if (response?.status === 200) {
//         setUser(response.data);
//       }
//     } catch (error) {
//       console.error("Error fetching user info:", error);
//     }
//   }, []);

//   useEffect(() => {
//     fetchUserInfo();
//   }, [fetchUserInfo]);

//   const handleLogout = useCallback(() => {
//     AuthAPI.logout();
//     navigate("/auth/login", { replace: true });
//   }, [navigate]);

//   return (
//     <div className="flex items-center gap-3 pr-4">
//       {/* {user?.ten && <UserAvatar ten={user.ten} />} */}

//       <div className="text-sm font-medium text-slate-800 dark:text-gray-300">
//         {user.ten}
//       </div>

//       <button
//         type="button"
//         onClick={handleLogout}
//         className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-darkmode-400"
//       >
//         <LogOut strokeWidth={1.5} className="size-4" />
//         Đăng xuất
//       </button>
//     </div>
//   );
// };

// export default Menu;

import { LogOut, User, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import UserAPI from "../../../services/apis/userAPI";
import AuthAPI from "../../../services/apis/authAPI";
import type { NguoiDung } from "../../interfaces/user.interface";
import { VaiTro } from "../../constant/constant";

const ROLE_LABELS: Record<VaiTro, string> = {
  [VaiTro.ADMIN]: "Quản trị viên",
  [VaiTro.GV]: "Giáo viên",
  [VaiTro.HS]: "Học sinh",
};

const Menu = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<NguoiDung>({} as NguoiDung);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    UserAPI.getInfo().then((res) => {
      if (res?.status === 200) setUser(res.data);
    });
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    AuthAPI.logout();
    navigate("/auth/login", { replace: true });
  };

  const goToAccount = () => {
    navigate(
      user.vaiTro === VaiTro.GV ? "/teacher/account" : "/student/account",
    );
    setIsOpen(false);
  };

  // Lấy chữ cái đầu của tên cuối (VD: "Nguyễn Văn A" → "A")
  const initial = user.ten
    ? user.ten.trim().split(" ").pop()![0].toUpperCase()
    : "?";

  return (
    <div ref={ref} className="relative">
      {/* ===== Trigger button ===== */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        {user.anhDaiDien ? (
          <img
            src={user.anhDaiDien}
            alt="avatar"
            className="h-9 w-9 rounded-full object-cover ring-2 ring-blue-100"
          />
        ) : (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
            {initial}
          </div>
        )}

        <div className="hidden text-left sm:block">
          <p className="text-sm font-semibold leading-tight text-slate-800 dark:text-slate-200">
            {user.ten}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {ROLE_LABELS[user.vaiTro]}
          </p>
        </div>

        <ChevronDown
          className={`size-4 shrink-0 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* ===== Dropdown panel ===== */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
          {/* Tài khoản */}
          <div className="p-1.5">
            <button
              onClick={goToAccount}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <User className="size-4" strokeWidth={1.5} />
              Tài khoản
            </button>
          </div>

          <div className="mx-3 border-t border-slate-100 dark:border-slate-700" />

          {/* Đăng xuất */}
          <div className="p-1.5">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-slate-800"
            >
              <LogOut className="size-4" strokeWidth={1.5} />
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  );
};;

export default Menu;