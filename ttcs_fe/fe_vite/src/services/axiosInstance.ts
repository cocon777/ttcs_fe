import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080", // Đã bỏ dấu / ở cuối để an toàn
  timeout: 10000, 
  headers: {
    "Content-Type": "application/json",
  },
});

// Bộ lọc để tự động đính kèm Token vào mọi yêu cầu
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance; // Dùng export default cho tiện import