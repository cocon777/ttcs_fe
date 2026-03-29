// import axios from "axios";
// import type {
//   AxiosError,
//   AxiosResponse,
//   InternalAxiosRequestConfig,
// } from "axios";
// import type { APIErrorResponse } from "../share/interfaces/interface";

// interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
//   _retry?: boolean;
// }

// type FailedRequest = {
//   resolve: (token: string) => void;
//   reject: (error: AxiosError) => void;
// };

// let isRefreshing = false;
// let failedRequestsQueue: FailedRequest[] = [];

// export const axiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
//   const token = localStorage.getItem("accessToken");
//   if (token && config.headers) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// axiosInstance.interceptors.response.use(
//   (response: AxiosResponse) => response,
//   async (error: AxiosError) => {
//     const originalRequest = error.config as CustomAxiosRequestConfig;

//     if (error.response?.status === 401) {
//       console.log("error.response", error.response);
//       const errorData = error.response.data as APIErrorResponse | undefined;
//       const errorType = errorData?.error;

//       if (errorType === "TOKEN_MISSING") {
//         window.location.href = "/auth/login";
//         return Promise.reject(error);
//       }

//       if (errorType === "TOKEN_EXPIRED" && !originalRequest._retry) {
//         if (isRefreshing) {
//           return new Promise((resolve, reject) => {
//             failedRequestsQueue.push({ resolve, reject });
//           })
//             .then((token) => {
//               originalRequest.headers["Authorization"] = `Bearer ${token}`;
//               return axiosInstance(originalRequest);
//             })
//             .catch((err) => Promise.reject(err));
//         }

//         originalRequest._retry = true;
//         isRefreshing = true;

//         try {
//           const { data } = await axios.post(
//             `auth/refresh-token`,
//             {},
//             { withCredentials: true },
//           );

//           localStorage.setItem("accessToken", data.accessToken);
//           axiosInstance.defaults.headers.common["Authorization"] =
//             `Bearer ${data.accessToken}`;
//           originalRequest.headers["Authorization"] =
//             `Bearer ${data.accessToken}`;

//           failedRequestsQueue.forEach((request) =>
//             request.resolve(data.accessToken),
//           );
//           failedRequestsQueue = [];

//           return axiosInstance(originalRequest);
//         } catch (err) {
//           const axiosError = err as AxiosError;

//           failedRequestsQueue.forEach((request) => request.reject(axiosError));

//           failedRequestsQueue = [];
//           localStorage.removeItem("accessToken");
//           window.location.href = "/auth/login";

//           console.error("Error refreshing token:", axiosError);

//           return Promise.reject(axiosError);
//         } finally {
//           isRefreshing = false;
//         }
//       }
//     }

//     return Promise.reject(error);
//   },
// );
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