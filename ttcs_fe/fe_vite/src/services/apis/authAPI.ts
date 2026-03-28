import { type AxiosResponse } from "axios";
import axiosInstance from "../../services/axiosInstance"; // Đã chuẩn!

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
      // Không cần tự chèn Header chứa Token nữa, axiosInstance sẽ tự lo!
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

  logout: async (): Promise<AxiosResponse | null> => {
    try {
      const response = await axiosInstance.post("auth/logout", {});
      return response;
    } catch (error) {
      console.log("Error in logout of AuthAPI: ", error); // Đã sửa chữ login thành logout cho chuẩn
      return null;
    }
  },
};

export default AuthAPI;