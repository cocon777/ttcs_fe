import { VaiTro, GioiTinh } from "../constant/constant";

export interface NguoiDung {
  id: number;
  ten: string;
  email: string;
  ngaySinh: string;
  soDienThoai: string;
  anhDaiDien: string;
  vaiTro: VaiTro;
  gioiTinh: GioiTinh;
}

export interface GiaoVien {
  id: number;
  maGV: string;
  createdAt: string;
  nguoiDung: NguoiDung;
}

export interface HocSinh {
  id: number;
  maHS: string;
  createdAt: string;
  nguoiDung: NguoiDung;
}
