// import { type AxiosResponse } from "axios";
// import axiosInstance from "../../services/axiosInstance";

// const AuthAPI = {
//   register: async (
//     ten: string,
//     tenDangNhap: string,
//     matKhau: string,
//     email: string,
//     vaiTro: string,
//   ) => {
//     try {
//       const requestData = { tenDangNhap, email, matKhau, ten, vaiTro };
//       // header tự chèn bằng axiosInstance
//       const response = await axiosInstance.post("auth/signup", requestData);
//       return response;
//     } catch (error) {
//       console.log("Error in register of AuthAPI: " + error);
//     }
//   },

//   login: async (
//     tenDangNhap: string,
//     matKhau: string,
//   ): Promise<AxiosResponse | null> => {
//     try {
//       const requestData = { tenDangNhap, matKhau };
//       const response = await axiosInstance.post("auth/login", requestData);
//       return response;
//     } catch (error) {
//       console.log("Error in login of AuthAPI: ", error);
//       return null;
//     }
//   },

//   logout: async (): Promise<void> => {
//     localStorage.removeItem("accessToken");
//   },
// };

// export default AuthAPI;

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

      // 🚀 BẮT ĐẦU LƯU VÀO MÁY TẠI ĐÂY
      if (response && response.data) {
        const data = response.data; // Dữ liệu Java trả về

        // 1. Lưu Chìa khóa (Token)
        const token = data.accessToken || data.token;
        if (token) {
          localStorage.setItem("accessToken", token);
        }

        // 2. Lưu thông tin User (Cực kỳ quan trọng để lấy ID)
        // Lưu ý: Tên biến data.id, data.username... phải khớp với những gì Java trả về
        const userInfo = {
          id: data.id,
          username: data.tenDangNhap || data.username,
          role: data.roles || data.vaiTro,
        };
        localStorage.setItem("user", JSON.stringify(userInfo));
      }

      return response;
    } catch (error) {
      console.log("Error in login of AuthAPI: ", error);
      return null;
    }
  },

  logout: async (): Promise<void> => {
    // 🚀 Dọn sạch sẽ cả Token và User khi Đăng xuất
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  },
};

export default AuthAPI;