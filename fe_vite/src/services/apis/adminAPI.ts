import axiosInstance from "../../services/axiosInstance";

export interface TaiKhoanNguoiDung {
  id: number;
  ten: string;
  tenDangNhap: string;
  email: string;
  vaiTro: "GV" | "HS";
  soDienThoai?: string;
  createdAt?: string;
}

const AdminAPI = {
  danhSachTaiKhoan: async (): Promise<TaiKhoanNguoiDung[]> => {
    try {
      const res = await axiosInstance.get("/api/admin/tai-khoan");
      return res.data;
    } catch (error) {
      console.error("AdminAPI.danhSachTaiKhoan:", error);
      return [];
    }
  },

  xoaTaiKhoan: async (id: number): Promise<boolean> => {
    try {
      await axiosInstance.delete(`/api/admin/tai-khoan/${id}`);
      return true;
    } catch (error) {
      console.error("AdminAPI.xoaTaiKhoan:", error);
      return false;
    }
  },

  doiVaiTro: async (id: number, vaiTro: "GV" | "HS"): Promise<boolean> => {
    try {
      await axiosInstance.put(`/api/admin/tai-khoan/${id}/vai-tro`, { vaiTro });
      return true;
    } catch (error) {
      console.error("AdminAPI.doiVaiTro:", error);
      return false;
    }
  },
};

export default AdminAPI;
