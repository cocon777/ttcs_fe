import { type AxiosResponse } from "axios";
import axiosInstance from "../../services/axiosInstance";

const UserAPI = {
  getInfo: async (): Promise<AxiosResponse | null> => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      console.warn("No access token, skipping user info fetch");
      return null;
    }

    try {
      const response = await axiosInstance.get("users/me");

      return response;
    } catch (error) {
      console.error("Error in getInfo of UserAPI: ", error);
      return null;
    }
  },
  searchTruong: async (keyword: string) => {
    try {
      const res = await axiosInstance.get(
        `users/truong/search?keyword=${encodeURIComponent(keyword)}`,
      );
      return res;
    } catch {
      return null;
    }
  },
};

export default UserAPI;
