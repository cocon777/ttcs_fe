import axiosInstance from "../../services/axiosInstance";

export interface StudentClass {
  id: string;
  name: string;
  maLop: string;
  namHoc: string | null;
  giaoVienId: number;
}

interface RawClassItem {
  id?: number | string;
  ten_lop?: string;
  ma_lop?: string;
  nam_hoc?: string | null;
  giao_vien_id?: number;
}

const normalizeClass = (raw: RawClassItem): StudentClass => ({
  id: String(raw.ma_lop ?? raw.id ?? ""),
  name: raw.ten_lop ?? "Lop hoc",
  maLop: String(raw.ma_lop ?? raw.id ?? ""),
  namHoc: raw.nam_hoc ?? null,
  giaoVienId: Number(raw.giao_vien_id ?? 0),
});

const classAPI = {
  getClassList: async (): Promise<StudentClass[]> => {
    try {
      const response = await axiosInstance.get("/classes");
      const data = response.data as RawClassItem[];
      return data.map(normalizeClass);
    } catch (error) {
      console.error("Error in getClassList:", error);
      return [];
    }
  },

  getClassById: async (classId: string): Promise<StudentClass | null> => {
    try {
      const classList = await classAPI.getClassList();
      return classList.find((item) => item.id === classId) ?? null;
    } catch (error) {
      console.error("Error in getClassById:", error);
      return null;
    }
  },
};

export default classAPI;
