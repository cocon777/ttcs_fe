import type { AxiosResponse } from "axios";
import axiosInstance  from "../axiosInstance";

const GradeAPI = {
  getAll: async (): Promise<AxiosResponse | null> => {
    try {
      // 🚀 1. Lấy vé (Token) từ localStorage
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token");

      const response = await axiosInstance.get("grades", {
        headers: {
          "Content-Type": "application/json",
          // 🚀 2. Trình vé cho Backend kiểm tra
          Authorization: `Bearer ${token}`,
        },
      });

      return response;
    } catch (error) {
      console.error("Error in GradeAPI.getAll: ", error);
      return null;
    }
  },
};

export default GradeAPI;