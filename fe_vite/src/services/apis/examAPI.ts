import axiosInstance from "../../services/axiosInstance";

export interface ExamOption {
  id: string;
  label: string;
  text: string;
}

export interface ExamQuestion {
  id: string;
  questionNumber?: number;
  text: string;
  options: ExamOption[];
}

export interface ExamData {
  id: string;
  title: string;
  durationSeconds: number;
  studentName: string;
  questions: ExamQuestion[];
  ma_lop_giao?: string[];
}

export interface ExamListItem {
  id: string;
  title: string;
  durationSeconds: number;
  studentName: string;
  questions: ExamQuestion[];
  ma_lop_giao?: string[];
}

export interface SubmitExamPayload {
  examId: string;
  answers: Record<string, string>;
  flaggedQuestionIds: string[];
  selectedAnswerDetails?: Array<{
    questionId: string;
    optionId: string;
    optionLabel: string;
    optionText: string;
  }>;
  submittedAt?: string;
}

interface ClassRow {
  id: number;
  ma_lop: string;
}

interface DeRow {
  id: number;
  ma_hash: string;
  tieu_de: string;
  thoi_gian: number | null;
  da_xuat_ban: number;
}

interface GiaoChoLopRow {
  de_id: number;
  lop_hoc_id: number;
}

const extractQuestionNumericId = (questionId: string) => {
  const numericPart = questionId.replace(/\D/g, "");
  return Number(numericPart || 0);
};

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

  getExamListByClass: async (classId: string): Promise<ExamListItem[]> => {
    try {
      const [classesResponse, deResponse, giaoChoLopResponse] =
        await Promise.all([
          axiosInstance.get("/classes"),
          axiosInstance.get("/de"),
          axiosInstance.get("/giao_cho_lop"),
        ]);

      const classes = classesResponse.data as ClassRow[];
      const deList = deResponse.data as DeRow[];
      const giaoChoLopList = giaoChoLopResponse.data as GiaoChoLopRow[];

      const classRow = classes.find((item) => item.ma_lop === classId);
      if (!classRow) {
        return [];
      }

      const assignedDeIds = new Set(
        giaoChoLopList
          .filter((item) => item.lop_hoc_id === classRow.id)
          .map((item) => item.de_id),
      );

      const publishedDe = deList.filter(
        (item) => item.da_xuat_ban === 1 && assignedDeIds.has(item.id),
      );
      const legacyExamList = await examAPI.getExamList();

      return publishedDe.map((deItem) => {
        const legacyExam = legacyExamList.find(
          (item) => Number(item.id) === deItem.id,
        );
        return {
          id: String(deItem.id),
          title: deItem.tieu_de,
          durationSeconds: (deItem.thoi_gian ?? 0) * 60,
          studentName: legacyExam?.studentName ?? "Hoc sinh",
          questions: legacyExam?.questions ?? [],
          ma_lop_giao: [classId],
        };
      });
    } catch (error) {
      console.error(
        "Error in getExamListByClass, fallback to legacy field:",
        error,
      );
      const legacyExamList = await examAPI.getExamList();
      return legacyExamList.filter((exam) =>
        exam.ma_lop_giao?.includes(classId),
      );
    }
  },

  getExamById: async (examId: string): Promise<ExamData | null> => {
    try {
      const response = await axiosInstance.get(`/exams/${examId}`);
      return response.data as ExamData;
    } catch (error) {
      console.error("Error in getExamById:", error);
      return null;
    }
  },

  submitExam: async (payload: SubmitExamPayload) => {
    const submittedAt = payload.submittedAt ?? new Date().toISOString();

    try {
      const ketQuaResponse = await axiosInstance.post("/ket_qua", {
        thoi_gian_bat_dau: submittedAt,
        thoi_gian_nop: submittedAt,
        diem_so: null,
        nhan_xet_giao_vien: null,
        nhan_xet_he_thong: null,
        hoc_sinh_id: 3,
        hoc_sinh_lop_id: null,
        lan_thu: 1,
        de_id: Number(payload.examId),
      });

      const ketQuaId = ketQuaResponse.data.id as number;
      const details =
        payload.selectedAnswerDetails ??
        Object.entries(payload.answers).map(([questionId, optionId]) => ({
          questionId,
          optionId,
          optionLabel: optionId,
          optionText: optionId,
        }));

      await Promise.all(
        details.map((detail) =>
          axiosInstance.post("/chi_tiet_ket_qua", {
            lua_chon_da_chon: detail.optionLabel,
            diem_cau: 0,
            ket_qua_id: ketQuaId,
            cau_hoi_id: extractQuestionNumericId(detail.questionId),
          }),
        ),
      );

      return ketQuaResponse.data;
    } catch (error) {
      console.error(
        "Error writing ket_qua/chi_tiet_ket_qua, fallback exam-submissions:",
        error,
      );
      const response = await axiosInstance.post("/exam-submissions", payload);
      return response.data;
    }
  },
};

export default examAPI;
