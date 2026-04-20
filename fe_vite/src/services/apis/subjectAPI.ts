import type { AxiosResponse } from "axios";
import axiosInstance from "../axiosInstance";

const SubjectAPI = {
  getByGradeId: async (
    gradeId: number | string,
  ): Promise<AxiosResponse | null> => {
    try {
      // 🚀 1. Lấy vé (Token) từ localStorage
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token");

      const response = await axiosInstance.get(`subjects/grade/${gradeId}`, {
        headers: {
          "Content-Type": "application/json",
          // 🚀 2. Kẹp vé vào yêu cầu gửi lên Backend
          Authorization: `Bearer ${token}`,
        },
      });

      return response;
    } catch (error) {
      console.log("Error in SubjectAPI.getByGradeId: ", error);
      return null;
    }
  },
};

export default SubjectAPI;