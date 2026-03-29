import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import UserAPI from "../../../services/apis/userAPI";
import AuthAPI from "../../../services/apis/authAPI";

interface LoginInfo {
  tenDangNhap: string;
  matKhau: string;
}

const Login = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState<LoginInfo>({
    tenDangNhap: "",
    matKhau: "",
  });
  const [message, setMessage] = useState<string>("");
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);

  const handleChangeInput = (name: string, newValue: string) => {
    setValues((preValues) => ({ ...preValues, [name]: newValue }));
    setMessage("");
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { tenDangNhap, matKhau } = values;

    if (!tenDangNhap || !matKhau) {
      setMessage("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      const response = await AuthAPI.login(tenDangNhap, matKhau);

      if (response && response.status === 200) {
        const loginData = response.data;
        const token = loginData.accessToken;

        if (token) {
          localStorage.setItem("accessToken", token);

          const vaiTro = loginData?.user?.vaiTro;
          console.log("VAI TRO HIEN TAI:", vaiTro);

          if (vaiTro === "ADMIN") {
            navigate("/admin");
          } else if (vaiTro === "GV") {
            navigate("/teacher");
          } else if (vaiTro === "HS") {
            navigate("/student");
          } else {
            navigate("/");
          }
        }
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      setMessage("Tài khoản hoặc mật khẩu không chính xác");
    }
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      try {
        const response = await UserAPI.getInfo();
        if (response?.status === 200) {
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserInfo();
  }, [navigate]);

  return (
    <div className="w-full pt-16">
      <form
        onSubmit={handleLogin}
        className="mx-auto flex w-127.5 flex-col items-center space-y-4 rounded-md bg-white px-6 py-4 shadow-lg"
      >
        <div className="text-2xl font-bold text-gray-800">Đăng nhập</div>

        <input
          value={values.tenDangNhap}
          name="tenDangNhap"
          onChange={(e) => handleChangeInput(e.target.name, e.target.value)}
          type="text"
          className="w-full rounded-md border border-slate-300 px-4 py-2.5 text-sm text-gray-800 shadow-sm"
          placeholder="Nhập tên đăng nhập"
        />

        <div className="relative w-full">
          <input
            value={values.matKhau}
            name="matKhau"
            onChange={(e) => handleChangeInput(e.target.name, e.target.value)}
            type={isShowPassword ? "text" : "password"}
            className="w-full rounded-md border border-slate-300 px-4 py-2.5 text-sm text-gray-800 shadow-sm"
            placeholder="Mật khẩu"
          />
          <button
            type="button"
            className="absolute right-2 top-2 text-gray-500"
            onClick={() => setIsShowPassword(!isShowPassword)}
          >
            {isShowPassword ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>

        {message && (
          <div className="w-full text-left text-xs text-red-500">{message}</div>
        )}

        <button
          type="submit"
          className="w-full rounded-md bg-blue-800 py-3 text-center hover:cursor-pointer hover:bg-blue-700"
        >
          <div className="text-sm font-semibold text-white">Đăng nhập</div>
        </button>

        <div className="flex items-center gap-1 text-sm">
          <div className="text-slate-400">Bạn chưa có tài khoản?</div>
          <Link
            to="/auth/register"
            className="font-semibold text-blue-600 hover:underline"
          >
            Tạo một tài khoản mới
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
