import { classAPI } from "../../../../services/apis/classAPI";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import examAPI from "../../../../services/apis/examAPI";
import { Card, Button } from "antd";
import { FileText } from "lucide-react";
import { useState as useReactState } from "react";
import ExamContentPopup from "./components/ExamContentPopup";
import ExamStudentList from "./components/ExamStudentList";

const ExamDetailPage = () => {
  const { classId, examId } = useParams();
  const [tenLop, setTenLop] = useState<string>("");
  const navigate = useNavigate();
  const [exam, setExam] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  // State cho popup xem đề
  const [isOpenExamContent, setIsOpenExamContent] = useReactState(false);
  const [examContent, setExamContent] = useReactState<any>(null);
  // Hàm lấy nội dung đề (giả sử đã có API examAPI.getExamContent hoặc dùng lại getExamById)
  const handleOpenExamContent = async () => {
    if (!examId) return;
    // Nếu đã có exam.cauHois thì dùng luôn, không thì gọi API khác nếu cần
    if (exam && exam.cauHois) {
      setExamContent(exam);
      setIsOpenExamContent(true);
    } else {
      try {
        const res = await examAPI.getExamById(examId);
        setExamContent(res);
        setIsOpenExamContent(true);
      } catch {}
    }
  };

  useEffect(() => {
    if (classId) {
      classAPI
        .getClassById(classId)
        .then((res) => {
          setTenLop(res?.tenLop || "");
        })
        .catch(() => setTenLop(""));
    }
  }, [classId]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const examRes = await examAPI.getExamById(examId!);
        setExam(examRes);
        if (classId) {
          const thongKeRes = await examAPI.getThongKeKetQua({
            deId: Number(examId),
            lopId: Number(classId),
          });
          setStats(thongKeRes.thongKe ?? thongKeRes);
        }
      } catch (e) {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [examId, classId]);

  if (loading) return <div>Đang tải...</div>;
  if (!exam) return <div>Không tìm thấy đề thi.</div>;

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 items-start justify-center">
      {/* Bên trái: Thông tin đề */}
      <div className="flex-shrink-0 w-full md:w-[320px]">
        <Card title={exam.title} style={{ maxWidth: 340, margin: "0 auto" }}>
          <div className="mb-2 text-slate-600">
            Ngày tạo:{" "}
            {exam.createdAt
              ? moment(exam.createdAt).format("DD/MM/YYYY HH:mm")
              : "-"}
          </div>
          <div className="mb-2 text-slate-600">
            Người tạo: {exam.nguoiTaoTen}
          </div>
          <div className="mb-2 text-slate-600">
            Giao cho lớp: {tenLop || "-"}
          </div>
          <div className="mb-2 text-slate-600">
            Thời gian:{" "}
            {exam.durationSeconds ? `${exam.durationSeconds / 60} phút` : "-"}
          </div>
          {/* Nội dung - Xem đề */}
          <div className="mt-4">
            <div className="text-sm font-semibold mb-1">Nội dung</div>
            <div
              className="flex items-center gap-2 text-blue-800 hover:cursor-pointer hover:opacity-80 dark:text-blue-700"
              onClick={handleOpenExamContent}
            >
              <FileText className="size-4" />
              <div className="text-sm font-medium underline">Xem đề</div>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <Button
              type="primary"
              onClick={() =>
                navigate(`/teacher/class/${classId}/exam/${examId}/statistics`)
              }
            >
              Thống kê
            </Button>
          </div>
        </Card>
        {/* Popup xem đề */}
        <ExamContentPopup
          open={isOpenExamContent}
          onClose={() => setIsOpenExamContent(false)}
          examContent={examContent}
        />
        {/* Back button dưới card */}
        <button
          className="mt-4 w-full px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded shadow"
          onClick={() => navigate(-1)}
        >
          ← Quay lại
        </button>
      </div>
      {/* Bên phải: Danh sách học sinh chi tiết */}
      <div className="flex-1 min-w-0">
        <ExamStudentList students={stats?.students ?? []} />
      </div>
    </div>
  );
};

export default ExamDetailPage;
