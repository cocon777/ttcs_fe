import axiosInstance from "../axiosInstance"; 

export interface StudentClass {
  id: number;
  tenLop: string;
  maLop: string;
  namHoc: string;
  khoiLop?: { id: number; ten: string };
  monHoc?: { id: number; ten: string };
  giaoVien?: { id: number; hoTen: string };
}

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

  getClassById: async (id: string | number): Promise<StudentClass | null> => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const res = await axiosInstance.get(`api/lop-hoc/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return res.data;
    } catch (error) {
      console.error("Lỗi lấy thông tin lớp:", error);
      return null;
    }
  },

  getAllByStudent: async () => {
    const accessToken = localStorage.getItem("accessToken");
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    const studentId = user?.id;

    return await axiosInstance.get(`api/lop-hoc/hoc-sinh/${studentId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },

  //cong
};