import { useState } from "react";
import { Loader2 } from "lucide-react";
import RoleTabs from "./rolesTab";
import type { nguoiDungMoi } from "./interface";
import { Link, useNavigate } from "react-router-dom";
import AuthAPI from "../../../services/apis/authAPI";

const Register = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState<nguoiDungMoi>({
    ten: "",
    tenDangNhap: "",
    email: "",
    matKhau: "",
    vaiTro: "HS",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!values.ten.trim()) {
      newErrors.ten = "Họ tên không được để trống";
    }

    if (!values.tenDangNhap.trim()) {
      newErrors.tenDangNhap = "Tên đăng nhập không được để trống";
    }

    if (!values.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) &&
      !/^[0-9]{10,11}$/.test(values.email)
    ) {
      newErrors.email = "Vui lòng nhập email hợp lệ";
    }

    if (!values.matKhau) {
      newErrors.matKhau = "Mật khẩu không được để trống";
    } else if (values.matKhau.length < 6 || values.matKhau.length > 30) {
      newErrors.matKhau = "Mật khẩu phải có độ dài từ 6-30 ký tự";
    } else {
      const hasUpperCase = /[A-Z]/.test(values.matKhau);
      const hasLowerCase = /[a-z]/.test(values.matKhau);
      const hasNumbers = /\d/.test(values.matKhau);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(values.matKhau);

      if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
        newErrors.matKhau =
          "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangeValues = (name: string, newValue: string) => {
    setValues((prevValues) => ({ ...prevValues, [name]: newValue }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await AuthAPI.register(
        values.ten,
        values.tenDangNhap,
        values.email,
        values.matKhau,
        values.vaiTro,
      );

      if (response?.status === 201) {
        navigate("/auth/login");
      } else {
        setErrors({ general: "Đăng ký không thành công. Vui lòng thử lại." });
      }
    } catch (error) {
      console.error(error);
      setErrors({ general: "Có lỗi xảy ra. Vui lòng thử lại sau." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="mx-auto max-w-md">
        <form
          className="rounded-lg bg-white p-8 shadow-lg"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 ">
              Đăng ký tài khoản
            </h1>
          </div>
          <h2 className="mb-2 text-center text-gray-700">Bạn là:</h2>
          <RoleTabs values={values} onChange={handleChangeValues} />
          <div className="mt-4 space-y-4">
            <div>
              <label
                htmlFor="ten"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Họ tên
              </label>
              <input
                id="ten"
                type="text"
                className={`w-full rounded-lg border px-4 py-3 text-sm text-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.ten ? "border-red-600" : "border-gray-300"
                }`}
                placeholder="Nhập họ tên của bạn"
                value={values.ten}
                name="ten"
                onChange={(e) =>
                  handleChangeValues(e.target.name, e.target.value)
                }
              />
              {errors.ten && (
                <p className="mt-1 text-xs text-red-600">{errors.ten}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="tenDangNhap"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Tên đăng nhập
              </label>
              <input
                id="tenDangNhap"
                type="text"
                className={`w-full rounded-lg border px-4 py-3 text-sm text-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.tenDangNhap ? "border-red-600" : "border-gray-300"
                }`}
                placeholder="Nhập tên đăng nhập của bạn"
                value={values.tenDangNhap}
                name="tenDangNhap"
                onChange={(e) =>
                  handleChangeValues(e.target.name, e.target.value)
                }
              />
              {errors.tenDangNhap && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.tenDangNhap}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="text"
                className={`w-full rounded-lg border px-4 py-3 text-sm text-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? "border-red-600" : "border-gray-300"
                }`}
                placeholder="Nhập email"
                value={values.email}
                name="email"
                onChange={(e) =>
                  handleChangeValues(e.target.name, e.target.value)
                }
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="matKhau"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Mật khẩu
              </label>

              <input
                id="matKhau"
                type="password"
                className={`w-full rounded-lg border px-4 py-3 text-sm text-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.matKhau ? "border-red-600" : "border-gray-300"
                }`}
                placeholder="Nhập mật khẩu "
                value={values.matKhau}
                name="matKhau"
                onChange={(e) =>
                  handleChangeValues(e.target.name, e.target.value)
                }
              />

              {errors.matKhau && (
                <p className="mt-1 text-xs text-red-600">{errors.matKhau}</p>
              )}
            </div>
          </div>
          {errors.general && (
            <div className="mt-4 rounded-lg bg-red-50 p-3 dark:bg-red-900/20">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}
          <div className="mt-6">
            <button
              type="button"
              onClick={handleRegister}
              disabled={isLoading}
              className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-600 dark:focus:ring-offset-darkmode-500"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang đăng ký...
                </>
              ) : (
                "Đăng ký"
              )}
            </button>
          </div>
          <div className="mt-6 text-center">
            <span className="text-sm text-gray-600 dark:text-slate-400">
              Đã có tài khoản?{" "}
            </span>
            <Link
              to="/auth/login"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
            >
              Đăng nhập
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
