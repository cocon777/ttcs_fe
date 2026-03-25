import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import classAPI from "../../../../services/apis/classAPI";
import type { StudentClass } from "../../../../services/apis/classAPI";

const ClassDetailPage = () => {
  // Lấy mã lớp từ URL: /student/classroom/:classId
  const { classId } = useParams<{ classId: string }>();
  // classItem lưu dữ liệu lớp trả về từ API; loading điều khiển trạng thái đang tải.
  const [classItem, setClassItem] = useState<StudentClass | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch lại mỗi khi classId thay đổi (user chuyển sang lớp khác).
    const fetchClassDetail = async () => {
      if (!classId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const data = await classAPI.getClassById(classId);
      setClassItem(data);
      setLoading(false);
    };

    fetchClassDetail();
  }, [classId]);

  if (loading) {
    // Màn hình chờ trong lúc gọi API.
    return (
      <div className="w-full text-gray-800">
        <div className="mx-auto w-11/12 max-w-4xl py-8">
          <div className="rounded-md bg-white p-5 text-sm text-slate-600 shadow-sm">
            Dang tai thong tin lop hoc...
          </div>
        </div>
      </div>
    );
  }

  if (!classItem) {
    // API không trả về lớp theo classId => hiện thông báo không tìm thấy.
    return (
      <div className="w-full text-gray-800">
        <div className="mx-auto w-11/12 max-w-4xl py-8">
          <div className="rounded-md bg-white p-5 text-sm text-slate-600 shadow-sm">
            Khong tim thay lop hoc.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full text-gray-800">
      <div className="mx-auto w-11/12 max-w-4xl py-8">
        <div className="rounded-md bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h1 className="text-2xl font-semibold text-slate-900">
              {classItem.name}
            </h1>
            {/* Nút quay về danh sách lớp. */}
            <Link
              to="/student/classroom"
              className="inline-flex rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Quay lại danh sách lớp
            </Link>
          </div>
          <p className="mt-2 text-sm text-slate-600">
            Mã lớp: {classItem.maLop}
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Năm học: {classItem.namHoc ?? "Chua cap nhat"}
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Giáo viên ID: {classItem.giaoVienId}
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Nhánh sang danh sách đề của lớp hiện tại. */}
          <Link
            to={`/student/classroom/${classItem.id}/exams`}
            className="rounded-md bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
          >
            <h2 className="text-lg font-semibold text-slate-900">
              Danh sách đề
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Xem các đề mà giáo viên giao cho lớp.
            </p>
          </Link>

          {/* Nhánh sang danh sách bài giảng của lớp hiện tại. */}
          <Link
            to={`/student/classroom/${classItem.id}/lectures`}
            className="rounded-md bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
          >
            <h2 className="text-lg font-semibold text-slate-900">
              Danh sách bài giảng
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Trang bài giảng sẽ bổ sung sau.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ClassDetailPage;
