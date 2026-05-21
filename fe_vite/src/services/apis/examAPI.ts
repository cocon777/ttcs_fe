import axiosInstance from "../axiosInstance";

export interface ExamOption {
  id: string;
  label: string;
  text: string;
  laDapAn?: boolean;
}

export interface ExamQuestion {
  id: string;
  questionNumber?: number;
  text: string;
  correctLabel?: string;
  options: ExamOption[];
}

export interface ExamData {
  id: string;
  title: string;
  nguoiTaoId: string;
  nguoiTaoTen: string;
  maHash?: string;
  batDau?: string;
  ketThuc?: string;
  durationSeconds: number;
  questions: ExamQuestion[];
  maLopGiao?: string[];
  createdAt?: string;
}

export interface ExamListItem {
  id: string;
  title: string;
  maHash?: string;
  batDau? : string;
  ketThuc?: string;
  durationSeconds: number;
  questions: ExamQuestion[];
  maLopGiao?: string[];
}

export interface SubmitExamPayload {
  examId: string;
  answers: Record<string, string>;
  flaggedQuestionIds: string[];
  questions?: ExamQuestion[];
  durationSecondsUsed?: number;
  startedAtMs?: number;
  selectedAnswerDetails?: Array<{
    questionId: string;
    optionId: string;
    optionLabel: string;
    optionText: string;
  }>;
  submittedAt?: string;
  lopId?: number | null; // Thêm trường này để truyền lên backend
}

export interface KetQua {
  id: number;
  ketQuaId: number;
  lanThu: number;
  soCauDung: number;
  tongSoCau: number;
  thoiGianLamGiay: number;
  nhanXetHeThong: string;
  diemSo: number;
}

export interface ChiTietLuaChon {
  kyHieu: string;
  noiDung: string;
  laDapAn: boolean;
}

export interface ChiTietCauHoi {
  cauHoiId: number;
  noiDung: string;
  thuTu: number;
  diem: number;
  dapAnDaChon: string;
  dapAnDung: string;
  luaChons: ChiTietLuaChon[];
}

export interface ChiTietKetQua {
  id: number;
  ketQuaId: number;
  tongDiem: number;
  cauHoiList: ChiTietCauHoi[];
}

interface BackendExamItem {
  id: number;
  maHash?: string;
  tieuDe: string;
  thoiGian: number | null;
  batDau?: string;
  ketThuc?: string;
  createdAt?: string;
}

interface BackendExamDetail {
  deId: number;
  nguoiTaoId: string;
  nguoiTaoTen: string;
  tieuDe: string;
  thoiGian: number | null;
  batDau?: string;
  ketThuc?: string;
  createdAt?: string;
  cauHois: Array<{
    cauHoiId: number;
    thuTu: number;
    noiDung: string;
    luaChons: Array<{
      kyHieu: string;
      noiDung: string;
    }>;
  }>;
}

interface BackendKetQuaResponse {
  ketQuaId: number;
  lanThu: number;
  soCauDung: number;
  tongSoCau: number;
  thoiGianLamGiay: number;
  nhanXetHeThong: string;
  diemSo: number;
}

interface BackendChiTietKetQua {
  ketQuaId: number;
  tongDiem: number;
  cauHoiList: ChiTietCauHoi[];
}

interface CurrentUserInfo {
  id?: number;
  hocSinh?: {
    id?: number;
  };
}

interface SubmitBackendPayload {
  hocSinhId: number;
  deId: number;
  thoiGianBatDau: string;
  cauTraLoi: Array<{
    cauHoiId: number;
    luaChon: string;
  }>;
  lopId?: number;
}

const localKetQuaCacheKey = "student.ketQua.cache";

const readKetQuaCache = (): Record<string, KetQua> => {
  try {
    const raw = localStorage.getItem(localKetQuaCacheKey);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, KetQua>;
  } catch (error) {
    console.error("Error reading ket qua cache:", error);
    return {};
  }
};

const writeKetQuaCache = (cache: Record<string, KetQua>) => {
  try {
    localStorage.setItem(localKetQuaCacheKey, JSON.stringify(cache));
  } catch (error) {
    console.error("Error writing ket qua cache:", error);
  }
};

const cacheKetQua = (ketQua: KetQua) => {
  const cache = readKetQuaCache();
  cache[String(ketQua.ketQuaId)] = ketQua;
  writeKetQuaCache(cache);
};

const getCachedKetQua = (ketQuaId: string): KetQua | null => {
  const cache = readKetQuaCache();
  return cache[ketQuaId] ?? null;
};

import moment from "moment";
const toLocalDateTimeIso = (date: Date) =>
  moment(date).format("YYYY-MM-DDTHH:mm:ss");

const mapBackendKetQua = (raw: BackendKetQuaResponse): KetQua => ({
  id: raw.ketQuaId,
  ketQuaId: raw.ketQuaId,
  lanThu: raw.lanThu,
  soCauDung: raw.soCauDung,
  tongSoCau: raw.tongSoCau,
  thoiGianLamGiay: raw.thoiGianLamGiay,
  nhanXetHeThong: raw.nhanXetHeThong,
  diemSo: raw.diemSo,
});

const examAPI = {
  /**
   * Lấy thống kê kết quả bài làm theo đề và lớp hoặc theo hocSinhLopId
   * @param payload { deId: number; lopId: number; hocSinhLopId?: number }
   */
  getThongKeKetQua: async (payload: {
    deId: number;
    lopId: number;
    hocSinhLopId?: number;
  }) => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const res = await axiosInstance.post("/api/ket-qua/thong-ke", payload, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return res.data;
    } catch (error) {
      console.error("Error in getThongKeKetQua:", error);
      return [];
    }
  },
  /**
   * Lấy danh sách kết quả làm bài của học sinh theo đề và lớp
   * @param deId Mã đề thi
   * @param lopId Mã lớp học
   */
  getExamList: async (): Promise<ExamListItem[]> => {
    try {
      const response = await axiosInstance.get("/exams");
      return response.data as ExamListItem[];
    } catch (error) {
      console.error("Error in getExamList:", error);
      return [];
    }
  },

  // getExamListByClass: async (classId: string): Promise<ExamListItem[]> => {
  //   try {
  //     const classesResponse = await axiosInstance.get("/api/lop-hoc");
  //     const classes = classesResponse.data as BackendClassItem[];
  //     const classRow = classes.find((item) => item.maLop === classId);
  //     if (!classRow) {
  //       return [];
  //     }

  //     const deResponse = await axiosInstance.get(
  //       `/api/de-thi/lop/${classRow.id}`,
  //     );
  //     const deList = deResponse.data as BackendExamItem[];

  //     const exams = await Promise.all(
  //       deList.map(async (deItem) => {
  //         const detail = await examAPI.getExamById(String(deItem.id));
  //         return {
  //           id: String(deItem.id),
  //           title: deItem.tieuDe,
  //           durationSeconds: (deItem.thoiGian ?? 0) * 60,
  //           questions: detail?.questions ?? [],
  //           maLopGiao: [classId],
  //         };
  //       }),
  //     );

  //     return exams;
  //   } catch (error) {
  //     console.error("Error in getExamListByClass:", error);
  //     return [];
  //   }
  // },

  getExamListByClass: async (classId: string): Promise<ExamListItem[]> => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      // classId ở đây là lopHocId (số), gọi thẳng không cần tìm qua maLop
      const res = await axiosInstance.get(`api/de-thi/lop/${classId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      return (res.data as BackendExamItem[]).map((de) => ({
        id: String(de.id),
        title: de.tieuDe,
        maHash: de.maHash,
        batDau: de.batDau,
        ketThuc: de.ketThuc,
        durationSeconds: (de.thoiGian ?? 0) * 60,
        questions: [],
        maLopGiao: [classId],
      }));
    } catch (error) {
      console.error("Error in getExamListByClass:", error);
      return [];
    }
  },

  getExamById: async (examId: string): Promise<ExamData | null> => {
    try {
      const response = await axiosInstance.get(
        `/api/de-thi/${examId}/chi-tiet`,
      );
      const data = response.data as BackendExamDetail;

      return {
        id: String(data.deId),
        maHash: (data as any).maHash,
        nguoiTaoId: String(data.nguoiTaoId),
        nguoiTaoTen: data.nguoiTaoTen,
        title: data.tieuDe,
        batDau: data.batDau,
        ketThuc: data.ketThuc,
        durationSeconds: (data.thoiGian ?? 0) * 60,
        questions: (data.cauHois ?? []).map((question) => ({
          id: String(question.cauHoiId),
          questionNumber: question.thuTu,
          text: question.noiDung,
          options: (question.luaChons ?? []).map((option) => ({
            id: option.kyHieu,
            label: option.kyHieu,
            text: option.noiDung,
          })),
        })),
        createdAt: data.createdAt,
      };
    } catch (error) {
      console.error("Error in getExamById:", error);
      return null;
    }
  },

  getKetQuaById: async (ketQuaId: string): Promise<KetQua | null> => {
    try {
      const cached = getCachedKetQua(ketQuaId);
      if (cached) {
        return cached;
      }

      const detail = await examAPI.getChiTietKetQuaByKetQuaId(ketQuaId);
      if (!detail) {
        return null;
      }

      return {
        id: Number(ketQuaId),
        ketQuaId: Number(ketQuaId),
        lanThu: 1,
        soCauDung: detail.cauHoiList.filter(
          (item) => item.dapAnDaChon && item.dapAnDaChon === item.dapAnDung,
        ).length,
        tongSoCau: detail.cauHoiList.length,
        thoiGianLamGiay: 0,
        nhanXetHeThong: "",
        diemSo: Number(detail.tongDiem ?? 0),
      };
    } catch (error) {
      console.error("Error in getKetQuaById:", error);
      return null;
    }
  },

  getChiTietKetQuaByKetQuaId: async (
    ketQuaId: string,
  ): Promise<ChiTietKetQua | null> => {
    try {
      const response = await axiosInstance.get(
        `/api/ket-qua/${ketQuaId}/chi-tiet`,
      );
      const raw = response.data as BackendChiTietKetQua;
      return {
        id: raw.ketQuaId,
        ketQuaId: raw.ketQuaId,
        tongDiem: Number(raw.tongDiem ?? 0),
        cauHoiList: raw.cauHoiList ?? [],
      };
    } catch (error) {
      console.error("Error in getChiTietKetQuaByKetQuaId:", error);
      return null;
    }
  },

  submitExam: async (payload: SubmitExamPayload) => {
    const userInfoResponse = await axiosInstance.get("/users/me");
    const userInfo = userInfoResponse.data as CurrentUserInfo;
    const hocSinhId = userInfo.hocSinh?.id ?? userInfo.id;

    if (!hocSinhId) {
      throw new Error("Không xác định được học sinh hiện tại để nộp bài.");
    }

    const deId = Number(payload.examId);
    if (!Number.isFinite(deId)) {
      throw new Error("Mã đề thi không hợp lệ.");
    }

    const cauTraLoi = Object.entries(payload.answers)
      .map(([questionId, optionId]) => ({
        cauHoiId: Number(questionId),
        luaChon: optionId,
      }))
      .filter((item) => Number.isFinite(item.cauHoiId));

    const requestBody: SubmitBackendPayload = {
      hocSinhId,
      deId,
      thoiGianBatDau: toLocalDateTimeIso(
        new Date(
          payload.startedAtMs ??
            Date.now() - (payload.durationSecondsUsed ?? 0) * 1000,
        ),
      ),
      cauTraLoi,
    };

    if (payload.lopId !== null) {
      requestBody.lopId = payload.lopId;
    }

    try {
      const response = await axiosInstance.post(
        "/api/ket-qua/submit",
        requestBody,
      );
      const ketQua = mapBackendKetQua(response.data as BackendKetQuaResponse);
      cacheKetQua(ketQua);
      return ketQua;
    } catch (error) {
      console.error("Error submitting exam:", error);
      throw error;
    }
  },
};

export default examAPI;
