import type { AxiosResponse } from "axios";
import type { De } from "../../share/interfaces/exam.interface";
import axiosInstance from "../axiosInstance";

interface taoDe {
  tieuDe: string;
  noiDungDe: object;
}

const accessToken = localStorage.getItem("accessToken");
const CREATE_EXAM_API_URL = `create_exam`;

const CreateExamAPI = {
  create: async ({
    tieuDe,
    noiDungDe,
  }: taoDe): Promise<AxiosResponse | null> => {
    try {
      if (!accessToken) {
        throw new Error("Access Token not found in localStorage.");
      }

      const requestBody = {
        tieuDe: tieuDe,
        noiDungDe: noiDungDe,
      };

      const response = await axiosInstance.post(
        `${CREATE_EXAM_API_URL}`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
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
  getPreviewsExamList: async (): Promise<AxiosResponse | null> => {
    try {
      if (!accessToken) {
        throw new Error("Access token not found in local storage");
      }

      const response = await axiosInstance.get(
        `${CREATE_EXAM_API_URL}/previewsExamList`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  getConfig: async (id: string): Promise<AxiosResponse | null> => {
    try {
      const response = await axiosInstance.get(
        `${CREATE_EXAM_API_URL}/${id}/config`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  getContent: async (id: string): Promise<AxiosResponse | null> => {
    try {
      if (!accessToken) {
        throw new Error("Access token not found");
      }

      const response = await axiosInstance.get(
        `${CREATE_EXAM_API_URL}/${id}/content`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      return response;
    } catch (error) {
      console.log(error);

      console.log("Fetch exam content failed");
      return null;
    }
  },

  getTatCaLop: async (): Promise<AxiosResponse | null> => {
    try {
      const response = await axiosInstance.get(
        `${CREATE_EXAM_API_URL}/my-classes`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  publish: async (
    deId: number | string,
    deConfig: De,
  ): Promise<AxiosResponse | null> => {
    try {
      const response = await axiosInstance.post(
        `${CREATE_EXAM_API_URL}/${deId}/publish`,
        { ...deConfig },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  remove: async (id: string): Promise<AxiosResponse | null> => {
    try {
      const token = localStorage.getItem("accessToken"); 
      const response = await axiosInstance.delete(
        `${CREATE_EXAM_API_URL}/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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

export default CreateExamAPI;
