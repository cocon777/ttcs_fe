import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { classAPI } from "../../../../services/apis/classAPI";
import type { StudentClass } from "../../../../services/apis/classAPI";

const ClassDetailPage = () => {
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
        
        // 🚀 SỬA LỖI 2: Chỉ lấy phần res.data đưa vào State
        if (res.status === 200) {
          setClassItem(res.data); 
        }
      } catch (error) {
        console.error("Lỗi tải thông tin lớp:", error);
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
            Không tìm thấy thông tin lớp học.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full text-gray-800">
      <div className="mx-auto w-11/12 max-w-4xl py-8">
        <h1 className="mb-6 text-2xl font-semibold">
          {/* 🚀 SỬA LỖI 3: Đổi .name thành .tenLop */}
          Chi tiết lớp học - {classItem.tenLop}
        </h1>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Cột 1: Thông tin lớp */}
          <div className="rounded-md bg-white p-6 shadow-sm border border-slate-100">
            <h2 className="mb-4 text-lg font-medium text-slate-800 border-b pb-2">Thông tin chung</h2>
            <div className="space-y-3">
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-slate-800">Mã lớp:</span> {classItem.maLop || "Chưa cập nhật"}
              </p>
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-slate-800">Tên lớp:</span> {classItem.tenLop}
              </p>
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-slate-800">Năm học:</span> {classItem.namHoc || "Chưa cập nhật"}
              </p>
              <p className="text-sm text-slate-600">
                {/* 🚀 SỬA LỖI 4: Đổi .giaoVienId thành .giaoVien?.id */}
                <span className="font-semibold text-slate-800">Giáo viên ID:</span> {classItem.giaoVien?.id || "Chưa có"}
              </p>
            </div>
          </div>

          {/* Cột 2: Các nút chức năng */}
          <div className="rounded-md bg-white p-6 shadow-sm border border-slate-100 flex flex-col gap-3">
            <h2 className="mb-2 text-lg font-medium text-slate-800 border-b pb-2">Chức năng</h2>
            <Link
              to={`/student/classroom/${classItem.id}/lectures`}
              className="rounded-md bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors text-center"
            >
              Xem bài giảng
            </Link>
            <Link
              to={`/student/classroom/${classItem.id}/exams`}
              className="rounded-md bg-green-50 px-4 py-3 text-sm font-medium text-green-700 hover:bg-green-100 transition-colors text-center"
            >
              Xem bài tập / Kiểm tra
            </Link>
            <Link
              to="/student/classroom"
              className="mt-4 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors text-center"
            >
              Quay lại danh sách
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassDetailPage;