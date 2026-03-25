import type { AxiosResponse } from "axios";
import type { NewStudentClass } from "../../modules/Class/teacher/ClassDetail/interface/interface";
import { axiosInstance } from "../../services/axiosInstance";

const accessToken = localStorage.getItem("accessToken");
const STUDENT_CLASS_API_URL = `student-classes`;

export const StudentClassroomAPI = {
  addToClassByStudentCode: async (
    studentCode: string,
    classroomId: number,
  ): Promise<AxiosResponse | null> => {
    try {
      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }

      const response = await axiosInstance.post(
        `${STUDENT_CLASS_API_URL}/add-by-code`,
        { studentCode, classroomId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      return response;
    } catch (error) {
      console.error(
        "Error in StudentClassroomAPI.addToClassByStudentCode: ",
        error,
      );
      return null;
    }
  },

  getByClassroomId: async (
    classroomId: string | number,
  ): Promise<AxiosResponse | null> => {
    try {
      const response = await axiosInstance.get(
        `${STUDENT_CLASS_API_URL}/classroom/${classroomId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      return response;
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  create: async (
    studentClass: NewStudentClass,
  ): Promise<AxiosResponse | null> => {
    try {
      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }

      const response = await axiosInstance.post(
        `student-classes`,
        studentClass,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      return response;
    } catch (error) {
      console.error("Error in StudentClassroomAPI.create: ", error);
      return null;
    }
  },

  delete: async (id: string | number): Promise<AxiosResponse | null> => {
    try {
      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }

      const response = await axiosInstance.delete(
        `${STUDENT_CLASS_API_URL}/${id}`,
        {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      return response;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
};
