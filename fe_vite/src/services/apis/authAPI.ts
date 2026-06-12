import { type AxiosResponse } from "axios";
import axiosInstance from "../../services/axiosInstance";

const AuthAPI = {
  register: async (
    ten: string,
    tenDangNhap: string,
    matKhau: string,
    email: string,
    vaiTro: string,
  ) => {
    try {
      const requestData = { tenDangNhap, email, matKhau, ten, vaiTro };
      const response = await axiosInstance.post("auth/signup", requestData);
      return response;
    } catch (error) {
      console.log("Error in register of AuthAPI: " + error);
    }
  },

  login: async (
    tenDangNhap: string,
    matKhau: string,
  ): Promise<AxiosResponse | null> => {
    try {
      const requestData = { tenDangNhap, matKhau };
      const response = await axiosInstance.post("auth/login", requestData);

      if (response && response.data) {
        const data = response.data; // Dữ liệu Java trả về

        // 1. Lưu Chìa khóa (Token)
        const token = data.accessToken || data.token;
        if (token) {
          localStorage.setItem("accessToken", token);
        }

        // Lưu thông tin User (quan trọng để lấy ID)
        const userInfo = {
          id: data.id,
          username: data.tenDangNhap || data.username,
          role: data.roles || data.vaiTro,
        };
        localStorage.setItem("user", JSON.stringify(userInfo));
      }

      return response;
    } catch (error) {
      console.log("Error in login of AuthAPI: ", error);
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  },
};

export default AuthAPI;
