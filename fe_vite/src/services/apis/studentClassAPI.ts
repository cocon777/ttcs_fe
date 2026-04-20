import type { AxiosResponse } from "axios";
import type { NewStudentClass } from "../../modules/Class/teacher/ClassDetail/interface/interface";
import axiosInstance from "../../services/axiosInstance";

// Tạm thời giữ nguyên URL cũ cho các hàm chưa có bên LopHocController
const STUDENT_CLASS_API_URL = `student-classes`;

export const StudentClassroomAPI = {
  // 1. Thêm học sinh vào lớp (Đã fix thêm dấu / và dọn code thừa)
  addToClassByStudentCode: async (
    studentCode: string,
    classroomId: number
  ): Promise<AxiosResponse | null> => {
    try {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token"); 
      const response = await axiosInstance.post(
        `api/lop-hoc/${classroomId}/them-hoc-sinh-bang-ma`,
        { studentCode: studentCode },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      console.error("Lỗi khi thêm học sinh bằng mã: ", error);
      return null;
    }
  },

  // 2. Lấy danh sách toàn bộ học sinh của một lớp cụ thể
  getByClassroomId: async (
    classroomId: string | number
  ): Promise<AxiosResponse | null> => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axiosInstance.get(
        `api/lop-hoc/${classroomId}/hoc-sinh`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách học sinh theo lớp: ", error);
      return null;
    }
  },

  // 3. Tạo mới một bản ghi
  create: async (
    studentClass: NewStudentClass
  ): Promise<AxiosResponse | null> => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axiosInstance.post(
        `${STUDENT_CLASS_API_URL}`,
        studentClass,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      console.error("Lỗi khi tạo mới: ", error);
      return null;
    }
  },

  // 4. Xóa học sinh ra khỏi lớp (POST)
  delete: async (
    classroomId: number,
    studentId: number
  ): Promise<AxiosResponse | null> => {
    try {
      const token = localStorage.getItem("accessToken");

      // 🚀 Dùng axiosInstance.post thay vì delete, và thêm body rỗng {}
      const response = await axiosInstance.post(
        `api/lop-hoc/${classroomId}/xoa-hoc-sinh/${studentId}`,
        {}, // Body rỗng bắt buộc cho lệnh POST
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      console.error("Lỗi khi xóa học sinh khỏi lớp: ", error);
      return null;
    }
  },
};