import type { AxiosResponse } from "axios";
import type { NewStudentClass } from "../../modules/Class/teacher/ClassDetail/interface/interface";
import axiosInstance from "../../services/axiosInstance";

const STUDENT_CLASS_API_URL = `student-classes`;

export const StudentClassroomAPI = {
  // 🚀 0. MỚI THÊM: Lấy danh sách TOÀN BỘ học sinh từ Database để làm Menu Dropdown
  getAllStudents: async (): Promise<AxiosResponse | null> => {
    try {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
      const response = await axiosInstance.get(`/api/hoc-sinh/danh-sach`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response;
    } catch (error) {
      console.error("Lỗi lấy tất cả học sinh: ", error);
      return null;
    }
  },

  // 1. Thêm học sinh vào lớp (Đã fix thêm dấu /)
  addToClassByStudentCode: async (studentCode: string, classroomId: number): Promise<AxiosResponse | null> => {
    try {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token"); 
      const response = await axiosInstance.post(
        `/api/lop-hoc/${classroomId}/them-hoc-sinh-bang-ma`,
        { studentCode: studentCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response;
    } catch (error) {
      console.error("Lỗi khi thêm học sinh bằng mã: ", error);
      return null;
    }
  },

  // 2. Lấy danh sách học sinh của một lớp cụ thể
  getByClassroomId: async (classroomId: string | number): Promise<AxiosResponse | null> => {
    try {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
      const response = await axiosInstance.get(`/api/lop-hoc/${classroomId}/hoc-sinh`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách học sinh theo lớp: ", error);
      return null;
    }
  },

  // 3. Xóa học sinh (POST)
  delete: async (classroomId: number, studentId: number): Promise<AxiosResponse | null> => {
    try {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
      const response = await axiosInstance.post(
        `/api/lop-hoc/${classroomId}/xoa-hoc-sinh/${studentId}`, 
        {}, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response;
    } catch (error) {
      console.error("Lỗi khi xóa học sinh khỏi lớp: ", error);
      return null;
    }
  },
};