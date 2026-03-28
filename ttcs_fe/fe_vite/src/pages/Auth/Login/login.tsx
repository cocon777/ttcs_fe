import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AuthAPI from "../../../services/apis/authAPI";
import UserAPI from "../../../services/apis/userAPI";

// Định nghĩa kiểu dữ liệu cho Form
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
        // Lấy Token từ accessToken (đúng theo ảnh Network bạn gửi)
        const token = loginData.accessToken;

        if (token) {
          // Lưu token vào máy
          localStorage.setItem("accessToken", token);
          
          // Lấy vai trò để chuyển trang (Khớp với HOC_SINH / GIAO_VIEN của Backend)
          const vaiTro = loginData?.user?.vaiTro;
          console.log("VAI TRO HIEN TAI:", vaiTro);

          if (vaiTro === "ADMIN") {
            navigate("/admin");
          } else if (vaiTro === "GIAO_VIEN") {
            navigate("/teacher");
          } else if (vaiTro === "HOC_SINH") {
            navigate("/student");
          } else {
            // Nếu không có vai trò cụ thể, cứ vào trang chủ đã
            navigate("/"); 
          }
        }
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      setMessage("Tài khoản hoặc mật khẩu không chính xác");
    }
  };

  // Tạm đóng check user để tránh lỗi 403 đá ngược ra login
  /*
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
        console.log("Token check error", error);
      }
    };
    fetchUserInfo();
  }, []);
  */

  return (
    <div className="w-full pt-16">
      <form
        onSubmit={handleLogin}
        className="mx-auto flex w-[400px] max-w-full flex-col items-center space-y-4 rounded-md bg-white px-6 py-8 shadow-lg"
      >
        <div className="mb-4 text-2xl font-bold text-gray-800">Đăng nhập</div>
        
        <input
          value={values.tenDangNhap}
          name="tenDangNhap"
          onChange={(e) => handleChangeInput(e.target.name, e.target.value)}
          type="text"
          className="w-full rounded-md border border-slate-300 px-4 py-3 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Nhập tên đăng nhập"
        />
        
        <div className="relative w-full">
          <input
            value={values.matKhau}
            name="matKhau"
            onChange={(e) => handleChangeInput(e.target.name, e.target.value)}
            type={isShowPassword ? "text" : "password"}
            className="w-full rounded-md border border-slate-300 px-4 py-3 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Mật khẩu"
          />
          <button
            type="button"
            className="absolute right-3 top-3 text-gray-500"
            onClick={() => setIsShowPassword(!isShowPassword)}
          >
            {isShowPassword ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>
        
        {message && <div className="w-full text-left text-sm text-red-500">{message}</div>}

        <button
          type="submit"
          className="mt-2 w-full rounded-md bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Đăng nhập
        </button>

        <div className="mt-4 text-sm">
          Bạn chưa có tài khoản?{" "}
          <Link to="/auth/register" className="font-semibold text-blue-600 hover:underline">
            Đăng ký ngay
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;