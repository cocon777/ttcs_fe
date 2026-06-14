import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CreateExamAPI from "../../../../services/apis/createExamAPI";
import type { De } from "../../../../share/interfaces/exam.interface";
import StudentExamCard from "../components/StudentExamCard";

const StudentExamManagement = () => {
  const [dsDe, setDsDe] = useState<De[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    CreateExamAPI.getPreviewsExamList().then((res) => {
      if (res?.data) setDsDe(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-5 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-800">
            Đề thi của tôi
          </h1>
          <p className="text-sm text-gray-500">
            Tự soạn đề để luyện tập cá nhân
          </p>
        </div>
        <Link
          to="/student/exam-editor"
          className="flex h-9 items-center gap-2 rounded-md bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          + Tạo đề mới
        </Link>
      </div>

      {/* Danh sách */}
      {loading ? (
        <div className="py-16 text-center text-sm text-gray-400">
          Đang tải...
        </div>
      ) : dsDe.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 py-16 text-center">
          <p className="text-sm text-gray-400">
            Chưa có đề nào. Hãy tạo đề mới!
          </p>
          <Link
            to="/student/exam-editor"
            className="mt-3 inline-flex items-center rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Tạo ngay
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {dsDe.map((de) => (
            <StudentExamCard
              key={de.id}
              de={de}
              onDeleted={(id) =>
                setDsDe((prev) => prev.filter((x) => x.id !== id))
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentExamManagement;
