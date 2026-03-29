import { type AxiosResponse } from "axios";
import axiosInstance from "../../services/axiosInstance";

const accessToken = localStorage.getItem("accessToken");

export const ClassroomAPI = {
  getStudents: async (classId: string | number): Promise<AxiosResponse> => {
    try {
      const response = await axiosInstance.get(
        `classrooms/${classId}/students`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      console.log("Add class api response: ", response);
      return response;
    } catch (error) {
      throw error;
    }
  },

  create: async (className: string, classYear: string) => {
    try {
      const response = await axiosInstance.post(
        "classrooms",
        {
          className,
          classYear,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      console.log("Add class api response: ", response);
      return response;
    } catch (error) {
      console.log("Error in ClassroomAPI: ", error);
      return {};
    }
  },
};
