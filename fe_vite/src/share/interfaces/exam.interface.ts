import { VaiTro } from "../constant/constant";
export interface NguoiDungRef {
  id: number;
  vaiTro: VaiTro;
}

export interface De {
  id: number;
  maHash: string;
  tieuDe: string;
  khoiLopId: number;
  monHocId: number;
  khoiLopTen?: string | null;
  monHocTen?: string | null;
  nguoiTao: NguoiDungRef;
  phamViGiao: "LOP" | "TU" | null;
  thoiGian: number;
  batDau: string | null;
  ketThuc: string | null;
  gioiHanNop: number | null;
  daXuatBan: boolean;
  createdAt: string;
  updatedAt: string;
  giaoChoLop?: GiaoChoLop[];
  cauHois: CauHoi[];
  cacLopDaGiao: number[];
}

export interface LopHocRef {
  id: number;
  tenLop: string;
  maLop: string;
  namHoc: string | null;
}

export interface GiaoChoLop {
  id: number;
  deId: number;
  lopHocId: number;
  lop?: LopHocRef; //API trả kèm thông tin lớp
  createdAt: string;
}

export interface LuaChon {
  id: number;
  kyHieu: string;
  noiDung: string;
  laDapAn: boolean;
  cauHoiId: number;
}

export interface CauHoi {
  id: number;
  noiDung: string;
  diem: number;
  thuTu: number;
  mucDo: string;
  deId: number;
  luaChons: LuaChon[];
}
// export interface DeQuanHe extends De {
//   giaoChoLop?: { id: number; lopHocId: number }[];
//   cauHoi?: { id: number; noiDung: string; diem: number }[];
//   ketQua?: { id: number; hocSinhId: number; diemSo: number | null }[];
// }
