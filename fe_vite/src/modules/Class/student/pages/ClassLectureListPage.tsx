import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { classAPI } from "../../../../services/apis/classAPI";
import type { StudentClass } from "../../../../services/apis/classAPI";

const ClassLectureListPage = () => {
  const { classId } = useParams<{ classId: string }>();
  const [classItem, setClassItem] = useState<StudentClass | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClassDetail = async () => {
      if (!classId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await classAPI.getClassById(classId);
        
        // 🚀 ĐÃ SỬA: res chính là dữ liệu lớp học, không có .status hay .data
        if (res) {
          setClassItem(res);
        }
      } catch (error) {
        console.error("Lỗi lấy thông tin lớp:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClassDetail();
  }, [classId]);

  if (loading) {
    return (
      <div className="w-full text-gray-800">
        <div className="mx-auto w-11/12 max-w-4xl py-8">
          <div className="rounded-md bg-white p-5 text-sm text-slate-600 shadow-sm flex gap-2">
            <span className="animate-pulse">Đang tải thông tin lớp học...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!classItem) {
    return (
      <div className="w-full text-gray-800">
        <div className="mx-auto w-11/12 max-w-4xl py-8">
          <div className="rounded-md bg-white p-5 text-sm text-slate-600 shadow-sm text-red-500">
            Không tìm thấy lớp học.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full text-gray-800">
      <div className="mx-auto w-11/12 max-w-4xl py-8">
        <h1 className="mb-4 text-2xl font-semibold">
          Danh sách bài giảng - {classItem.tenLop}
        </h1>
        <div className="rounded-md bg-white p-5 text-sm text-slate-600 shadow-sm border border-slate-200">
          Phần bài giảng chưa cần làm, sẽ bổ sung sau theo yêu cầu của bạn.
        </div>
        <div className="mt-4">
          <Link
            to={`/student/classroom/${classItem.id}`}
            className="inline-flex rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            Quay lại trang lớp
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ClassLectureListPage;