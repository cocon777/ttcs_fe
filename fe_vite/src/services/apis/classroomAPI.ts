import { type AxiosResponse } from "axios";
import axiosInstance from "../../services/axiosInstance";

export const ClassroomAPI = {
  getStudents: async (classId: string | number): Promise<AxiosResponse> => {
    // Lấy token NGAY TRONG HÀM để đảm bảo luôn là bản mới nhất
    const accessToken = localStorage.getItem("accessToken"); 
    try {
      const response = await axiosInstance.get(
        `classrooms/${classId}/students`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  create: async (className: string, classYear: string) => {
    // 1. Lấy Token
    const accessToken = localStorage.getItem("accessToken"); 
    
    // 2. Lấy ID của giáo viên đang đăng nhập
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    const teacherId = user?.id; 

    try {
      const response = await axiosInstance.post(
        "api/lop-hoc/tao-moi", // Lưu ý: Nếu axiosInstance của bạn đã cài baseURL có chữ '/api' rồi thì chỉ cần ghi "lop-hoc/tao-moi" nhé
        {
          // SỬA TÊN BIẾN CHO KHỚP VỚI JAVA (Kiểm tra lại file LopHocRequest.java của bạn nhé)
          tenLop: className,  
          namHoc: classYear,
          giaoVienId: teacherId // Gửi kèm ID để tạo lớp đúng chủ nhân
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, 
          },
        },
      );
      return response;
    } catch (error) {
      throw error; 
    }
  },
};