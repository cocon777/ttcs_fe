// Chú ý: Hãy sửa lại đường dẫn import axiosInstance cho khớp với thư mục của bạn nếu báo đỏ nhé
import axiosInstance from "../axiosInstance"; 

// 1. Khai báo cấu trúc
export interface StudentClass {
  id: number;
  tenLop: string;
  namHoc: string;
  maLop: string | null;
  giaoVien?: {
    id: number;
    maGV: string;
    ten?: string;
  };
}

// 2. KHAI BÁO classAPI ĐÚNG 1 LẦN DUY NHẤT
export const classAPI = {
  // Lấy danh sách lớp của giáo viên
  getAllByTeacher: async () => {
    const accessToken = localStorage.getItem("accessToken");
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    const teacherId = user?.id;

    return await axiosInstance.get(`api/lop-hoc/giao-vien/${teacherId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },

  // Tạo lớp mới
  create: async (tenLop: string, namHoc: string) => {
    const accessToken = localStorage.getItem("accessToken");
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    const teacherId = user?.id;

    return await axiosInstance.post(
      "api/lop-hoc/tao-moi",
      { tenLop, namHoc, giaoVienId: teacherId },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
  },

  // 🚀 ĐÃ BỔ SUNG: Lấy chi tiết 1 lớp học theo ID
  getClassById: async (id: string | number) => {
    const accessToken = localStorage.getItem("accessToken");
    return await axiosInstance.get(`api/lop-hoc/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
};