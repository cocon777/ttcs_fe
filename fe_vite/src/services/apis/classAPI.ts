import axiosInstance from "../axiosInstance"; 

// 1. Khai báo cấu trúc
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
  // 🚀 Lấy danh sách lớp của giáo viên
  getAllByTeacher: async () => {
    // Sửa lỗi 403: Bắt dự phòng cả 2 tên token để không bao giờ bị null
    const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    const teacherId = user?.id;

    // Thêm dấu / ở đầu để chuẩn đường dẫn
    return await axiosInstance.get(`/api/lop-hoc/giao-vien/${teacherId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // 🚀 Lấy 1 lớp theo ID
  getClassById: async (id: string | number): Promise<StudentClass | null> => {
    const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
    try {
      const res = await axiosInstance.get(`/api/lop-hoc/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error) {
      console.error("Lỗi lấy thông tin lớp:", error);
      return null;
    }
  },

  // 🚀 Lấy danh sách lớp của Học Sinh
  getAllByStudent: async () => {
    const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    const studentId = user?.id;

    return await axiosInstance.get(`/api/lop-hoc/hoc-sinh/${studentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // ==========================================
  // 🚀 PHẦN CODE BỊ MẤT CỦA CÔNG (TÔI KHÔI PHỤC LẠI ĐÂY)
  // ==========================================

  // Lấy danh sách Khối Lớp để đổ vào Dropdown
  getAllKhoiLop: async () => {
    const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
    return await axiosInstance.get('/api/khoi-lop', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Lấy danh sách Môn Học để đổ vào Dropdown
  getAllMonHoc: async () => {
    const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
    return await axiosInstance.get('/api/mon-hoc', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Gửi thông tin Lớp học mới lên Backend để lưu
  createClass: async (classData: any) => {
    const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
    return await axiosInstance.post('/api/lop-hoc', classData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
};