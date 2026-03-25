import { VaiTro } from "../constant/constant";
export interface NguoiDungRef {
  id: number;
  vaiTro: VaiTro;
}

export interface De {
  id: number;
  maHash: string;
  tieuDe: string;
  nguoiTao: NguoiDungRef;
  phamViGiao: "LOP" | "TU" | null;
  thoiGian: number | null;
  batDau: string | null;
  ketThuc: string | null;
  gioiHanNop: number | null;
  daXuatBan: boolean;
  createdAt: string;
  updatedAt: string;

  giaoChoLop?: GiaoChoLop[];
}

export interface LopHocRef {
  id: number;
  tenLop: string;
  maLop: string;
  namHoc: string | null;
}

export interface GiaoChoLop {
  id: number;
  de: number;
  lopHoc: number;
  lop?: LopHocRef; //API trả kèm thông tin lớp
  createdAt: string;
}
// export interface DeQuanHe extends De {
//   giaoChoLop?: { id: number; lopHocId: number }[];
//   cauHoi?: { id: number; noiDung: string; diem: number }[];
//   ketQua?: { id: number; hocSinhId: number; diemSo: number | null }[];
// }
