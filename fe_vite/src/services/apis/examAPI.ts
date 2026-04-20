// import axiosInstance from "../../services/axiosInstance";

// export interface ExamOption {
//   id: string;
//   label: string;
//   text: string;
// }

// export interface ExamQuestion {
//   id: string;
//   questionNumber?: number;
//   text: string;
//   options: ExamOption[];
// }

// export interface ExamData {
//   id: string;
//   title: string;
//   durationSeconds: number;
//   studentName: string;
//   questions: ExamQuestion[];
//   ma_lop_giao?: string[];
// }

// export interface ExamListItem {
//   id: string;
//   title: string;
//   durationSeconds: number;
//   studentName: string;
//   questions: ExamQuestion[];
//   ma_lop_giao?: string[];
// }

// export interface SubmitExamPayload {
//   examId: string;
//   answers: Record<string, string>;
//   flaggedQuestionIds: string[];
//   selectedAnswerDetails?: Array<{
//     questionId: string;
//     optionId: string;
//     optionLabel: string;
//     optionText: string;
//   }>;
//   submittedAt?: string;
// }

// interface ClassRow {
//   id: number;
//   ma_lop: string;
// }

// interface DeRow {
//   id: number;
//   ma_hash: string;
//   tieu_de: string;
//   thoi_gian: number | null;
//   da_xuat_ban: number;
// }

// interface GiaoChoLopRow {
//   de_id: number;
//   lop_hoc_id: number;
// }

// const extractQuestionNumericId = (questionId: string) => {
//   const numericPart = questionId.replace(/\D/g, "");
//   return Number(numericPart || 0);
// };

// const examAPI = {
//   getExamList: async (): Promise<ExamListItem[]> => {
//     try {
//       const response = await axiosInstance.get("/exams");
//       return response.data as ExamListItem[];
//     } catch (error) {
//       console.error("Error in getExamList:", error);
//       return [];
//     }
//   },

//   getExamListByClass: async (classId: string): Promise<ExamListItem[]> => {
//     try {
//       const [classesResponse, deResponse, giaoChoLopResponse] =
//         await Promise.all([
//           axiosInstance.get("/classes"),
//           axiosInstance.get("/de"),
//           axiosInstance.get("/giao_cho_lop"),
//         ]);

//       const classes = classesResponse.data as ClassRow[];
//       const deList = deResponse.data as DeRow[];
//       const giaoChoLopList = giaoChoLopResponse.data as GiaoChoLopRow[];

//       const classRow = classes.find((item) => item.ma_lop === classId);
//       if (!classRow) {
//         return [];
//       }

//       const assignedDeIds = new Set(
//         giaoChoLopList
//           .filter((item) => item.lop_hoc_id === classRow.id)
//           .map((item) => item.de_id),
//       );

//       const publishedDe = deList.filter(
//         (item) => item.da_xuat_ban === 1 && assignedDeIds.has(item.id),
//       );
//       const legacyExamList = await examAPI.getExamList();

//       return publishedDe.map((deItem) => {
//         const legacyExam = legacyExamList.find(
//           (item) => Number(item.id) === deItem.id,
//         );
//         return {
//           id: String(deItem.id),
//           title: deItem.tieu_de,
//           durationSeconds: (deItem.thoi_gian ?? 0) * 60,
//           studentName: legacyExam?.studentName ?? "Hoc sinh",
//           questions: legacyExam?.questions ?? [],
//           ma_lop_giao: [classId],
//         };
//       });
//     } catch (error) {
//       console.error(
//         "Error in getExamListByClass, fallback to legacy field:",
//         error,
//       );
//       const legacyExamList = await examAPI.getExamList();
//       return legacyExamList.filter((exam) =>
//         exam.ma_lop_giao?.includes(classId),
//       );
//     }
//   },

//   getExamById: async (examId: string): Promise<ExamData | null> => {
//     try {
//       const response = await axiosInstance.get(`/exams/${examId}`);
//       return response.data as ExamData;
//     } catch (error) {
//       console.error("Error in getExamById:", error);
//       return null;
//     }
//   },

//   submitExam: async (payload: SubmitExamPayload) => {
//     const submittedAt = payload.submittedAt ?? new Date().toISOString();

//     try {
//       const ketQuaResponse = await axiosInstance.post("/ket_qua", {
//         thoi_gian_bat_dau: submittedAt,
//         thoi_gian_nop: submittedAt,
//         diem_so: null,
//         nhan_xet_giao_vien: null,
//         nhan_xet_he_thong: null,
//         hoc_sinh_id: 3,
//         hoc_sinh_lop_id: null,
//         lan_thu: 1,
//         de_id: Number(payload.examId),
//       });

//       const ketQuaId = ketQuaResponse.data.id as number;
//       const details =
//         payload.selectedAnswerDetails ??
//         Object.entries(payload.answers).map(([questionId, optionId]) => ({
//           questionId,
//           optionId,
//           optionLabel: optionId,
//           optionText: optionId,
//         }));

//       await Promise.all(
//         details.map((detail) =>
//           axiosInstance.post("/chi_tiet_ket_qua", {
//             lua_chon_da_chon: detail.optionLabel,
//             diem_cau: 0,
//             ket_qua_id: ketQuaId,
//             cau_hoi_id: extractQuestionNumericId(detail.questionId),
//           }),
//         ),
//       );

//       return ketQuaResponse.data;
//     } catch (error) {
//       console.error(
//         "Error writing ket_qua/chi_tiet_ket_qua, fallback exam-submissions:",
//         error,
//       );
//       const response = await axiosInstance.post("/exam-submissions", payload);
//       return response.data;
//     }
//   },
// };

// export default examAPI;

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
  durationSeconds: number;
  questions: ExamQuestion[];
  maLopGiao?: string[];
}

export interface ExamListItem {
  id: string;
  title: string;
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

interface BackendClassItem {
  id: number;
  maLop: string;
}

interface BackendExamItem {
  id: number;
  tieuDe: string;
  thoiGian: number | null;
}

interface BackendExamDetail {
  deId: number;
  tieuDe: string;
  thoiGian: number | null;
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

const toLocalDateTimeIso = (date: Date) => date.toISOString().slice(0, 19);

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

      return (res.data as any[]).map((de) => ({
        id: String(de.id),
        title: de.tieuDe,
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
        title: data.tieuDe,
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
