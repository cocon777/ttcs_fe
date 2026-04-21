import axiosInstance from "../axiosInstance"; // Đổi đường dẫn này nếu thư mục của ông khác

export const baiGiangAPI = {
  // 1. Tạo mới bài giảng (Khớp với @PostMapping("/tao-moi"))
  create: async (data: any) => {
    return await axiosInstance.post('/api/baigiang/tao-moi', data);
  },

  // 2. Lấy danh sách bài giảng THEO LỚP (Khớp với @GetMapping("/lop-hoc/{idLopHoc}"))
  getByClassId: async (idLopHoc: string | number) => {
    return await axiosInstance.get(`/api/baigiang/lop-hoc/${idLopHoc}`);
  },

  // 3. Xem chi tiết (Khớp với @GetMapping("/{idBaiGiang}/chi-tiet"))
  getDetail: async (idBaiGiang: string | number) => {
    return await axiosInstance.get(`/api/baigiang/${idBaiGiang}/chi-tiet`);
  },

  // ==========================================
  // 🚀 2 HÀM NÀY CHUẨN BỊ CHO BƯỚC 2 BÊN DƯỚI
  // ==========================================
  update: async (id: number, data: any) => {
    return await axiosInstance.put(`/api/baigiang/sua/${id}`, data);
  },

  delete: async (id: number) => {
    return await axiosInstance.delete(`/api/baigiang/xoa/${id}`);
  }
};