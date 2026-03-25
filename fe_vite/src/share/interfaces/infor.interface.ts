import { GioiTinh } from "../constant/constant";
import type { HocSinh, GiaoVien } from "./user.interface";

export interface LopHoc {
  id: number;
  tenLop: string;
  namHoc: string;
  giaoVienId: string;
  soLuongHS: number;
  hocSinhLop: HocSinhLop[];
  createdAt: string;
  updatedAt: string;
}

export interface HocSinhLop {
  id: number;
  ten: string;
  email: string;
  soDienThoai: string;
  gioiTinh: GioiTinh;
  ngaySinh: Date;
  lopHocId: number;
  hocSinh: HocSinh;
  lopHoc: LopHoc;
  createdAt: string;
}
