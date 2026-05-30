import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import StatisticsCards from "./components/StatisticsCards";
import CompletionRateChart from "./components/CompletionRateChart";
import ScoreDistributionChart from "./components/ScoreDistributionChart";
import HardestQuestionsChart from "./components/HardestQuestionsChart";
import HardestQuestionsTable from "./components/HardestQuestionsTable";
import QuestionDetailModal from "./components/QuestionDetailModal";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  ArcElement,
} from "chart.js";
import { useParams} from "react-router-dom";
import examAPI from "../../../../services/apis/examAPI";
import { classAPI } from "../../../../services/apis/classAPI";

// Đăng ký các thành phần chartjs
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  ArcElement,
);

const ExamStatistics = () => {
  const navigate = useNavigate();
  const { id, classId } = useParams(); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // State quản lý đóng/mở khối AI Tư vấn
  const [showAdvice, setShowAdvice] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        let lopId = classId;
        if (!lopId) {
          try {
            const res = await classAPI.getAllByTeacher();
            const allClasses = res?.data || [];
            if (allClasses && allClasses.length > 0) {
              const firstClassId = allClasses[0]?.id?.toString();
              if (firstClassId) {
                lopId = firstClassId;
                localStorage.setItem("currentClassId", firstClassId);
              }
            }
          } catch (e) {
            // ignore
          }
        }

        let hocSinhLopId = localStorage.getItem("currentHocSinhLopId");
        if (!id || (!lopId && !hocSinhLopId)) {
          setError(
            "Không xác định được mã đề hoặc mã lớp. Vui lòng truy cập từ trang danh sách lớp hoặc thêm ?classId=... trên URL, hoặc đảm bảo đã chọn lớp trước đó.",
          );
          setLoading(false);
          return;
        }

        const thongKeRes = await examAPI.getThongKeKetQua({
          deId: Number(id),
          lopId: Number(lopId),
          hocSinhLopId: hocSinhLopId ? Number(hocSinhLopId) : undefined,
        });

        setStats({ ...thongKeRes.thongKe, tieuDe: thongKeRes.tieuDe });
      } catch (err: any) {
        setError("Lỗi khi lấy dữ liệu thống kê.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, classId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-slate-400">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500 mb-4" />
        Đang tải dữ liệu thống kê...
      </div>
    );
  }
  if (error) {
    return <div className="text-red-500 p-8 text-center">{error}</div>;
  }
  if (!stats) return null;

  const cardData = [
    { label: "Tổng bài nộp", value: stats.totalSubmissions },
    { label: "Điểm TB", value: stats.avgScore?.toFixed(2) },
    {
      label: "Tỷ lệ hoàn thành",
      value: `${Math.round(stats.completionRate * 100)}%`,
    },
    { label: "Điểm cao nhất", value: stats.maxScore },
  ];

  const completionPieData = {
    labels: ["Hoàn thành", "Chưa hoàn thành"],
    datasets: [
      {
        label: "Tỷ lệ hoàn thành",
        data: [stats.completionRate * 100, 100 - stats.completionRate * 100],
        backgroundColor: ["#6366f1", "#e0e7ff"],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: ["0-2", "2-4", "4-6", "6-8", "8-10"],
    datasets: [
      {
        label: "Số lượng",
        data: stats.scoreDistribution,
        backgroundColor: "#6366f1",
      },
    ],
  };

  const hardestBarData = {
    labels: (stats.hardestQuestions ?? []).map((q: any) => q.id),
    datasets: [
      {
        label: "Lượt làm sai",
        data: (stats.hardestQuestions ?? []).map((q: any) => q.wrongCount),
        backgroundColor: "#818cf8",
      },
    ],
  };

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-indigo-50 to-white min-h-screen">
      <div className="mb-6 flex items-center justify-between">
        <span className="text-indigo-700 font-bold text-2xl drop-shadow-sm">
          {stats.examTitle || stats.tieuDe || "Thống kê bài thi"}
        </span>
        <button
          className="ml-4 px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-semibold rounded-lg shadow transition-colors"
          onClick={() => navigate(-1)}
        >
          ← Quay lại
        </button>
      </div>

      {/* ========================================== */}
      {/* KHỐI AI TƯ VẤN CHO GIÁO VIÊN */}
      {/* ========================================== */}
      {/* (Ghi chú: Nếu Quyết trả về biến tên khác, bạn thay chữ 'teacherAdvice' thành tên biến đó nhé) */}
      {(stats.teacherAdvice || stats.nhanXetHeThong) && (
        <div className="mb-8 border border-amber-200 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 shadow-sm overflow-hidden">
          <button
            onClick={() => setShowAdvice(!showAdvice)}
            className="w-full px-5 py-4 flex justify-between items-center font-bold text-amber-900 hover:bg-amber-100/50 transition-colors"
          >
            <span className="flex items-center gap-2 text-lg">💡 <span>Hệ thống phân tích và Tư vấn giảng dạy</span></span>
            <span className="text-xs bg-amber-200 text-amber-800 px-3 py-1 rounded-full">{showAdvice ? 'Thu gọn ▲' : 'Xem chi tiết ▼'}</span>
          </button>
          
          {showAdvice && (
            <div className="p-6 border-t border-amber-200 text-amber-900 whitespace-pre-wrap leading-relaxed text-sm md:text-base font-medium">
              {stats.teacherAdvice || stats.nhanXetHeThong}
            </div>
          )}
        </div>
      )}
      {/* ========================================== */}

      {/* Header Cards */}
      <StatisticsCards data={cardData} />

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 mt-8">
        <CompletionRateChart data={completionPieData} />
        <ScoreDistributionChart data={barData} />
        <HardestQuestionsChart data={hardestBarData} />
      </div>

      {/* Bảng top 5 câu hỏi sai nhiều nhất */}
      <HardestQuestionsTable
        hardestQuestions={stats.hardestQuestions ?? []}
        onShowDetail={(q) => {
          setSelectedQuestion(q);
          setModalOpen(true);
        }}
      />
      
      {/* Popup chi tiết câu hỏi */}
      <QuestionDetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        question={selectedQuestion}
      />
    </div>
  );
};

export default ExamStatistics;