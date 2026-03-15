import { type AxiosResponse } from "axios";
import { axiosInstance } from "../../services/axiosInstance";

const UserAPI = {
  getInfo: async (): Promise<AxiosResponse | null> => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      console.warn("No access token, skipping user info fetch");
      return null;
    }

    try {
      const response = await axiosInstance.get("users");

      return response;
    } catch (error) {
      console.error("Error in getInfo of UserAPI: ", error);
      return null;
    }
  },
};

export default UserAPI;
