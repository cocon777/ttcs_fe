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
      // header tự chèn bằng axiosInstance
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
      return response;
    } catch (error) {
      console.log("Error in login of AuthAPI: ", error);
      return null;
    }
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem("accessToken");
  },
};

export default AuthAPI;
