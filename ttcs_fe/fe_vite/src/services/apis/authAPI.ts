import { type AxiosResponse } from "axios";
import { axiosInstance } from "../../services/axiosInstance";

const accessToken = localStorage.getItem("accessToken");

const AuthAPI = {
  register: async (
    ten: string,
    tenDangNhap: string,
    matKhau: string,
    email : string,
    vaiTro: string,
  ) => {
    try {
      const requestData = {
        tenDangNhap,
        matKhau,
        email,
        ten,
        vaiTro,
      };

      const url = "auth/signup";

      const response = await axiosInstance.post(url, requestData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

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
      const requestData = {
        tenDangNhap,
        matKhau,
      };

      const response = await axiosInstance.post("auth/login", requestData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response;
    } catch (error) {
      console.log("Error in login of AuthAPI: ", error);
      return null;
    }
  },
  logout: async (): Promise<AxiosResponse | null> => {
    try {
      const response = await axiosInstance.post("auth/logout", {}, {});

      return response;
    } catch (error) {
      console.log("Error in login of AuthAPI: ", error);
      return null;
    }
  },
};

export default AuthAPI;