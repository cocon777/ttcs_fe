import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { classAPI } from "../../../../services/apis/classAPI";
import type { StudentClass } from "../../../../services/apis/classAPI";
import {
  Loader2,
  BookOpen,
  BookMarked,
  CalendarDays,
  Home,
  User,
} from "lucide-react";

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
      setLoading(true);
      const data = await classAPI.getClassById(classId);
      setClassItem(data);
      setLoading(false);
    };
    fetchClassDetail();
  }, [classId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Loader2 className="mb-2 animate-spin" />
        <p className="text-sm">Đang tải thông tin lớp học...</p>
      </div>
    );
  }

  if (!classItem) {
    return (
      <div className="rounded-xl bg-white p-6 text-sm text-red-500 shadow-sm dark:bg-darkmode-600">
        Không tìm thấy lớp học.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-1">
      {/* Header */}
      <div className="flex items-center justify-between rounded-xl bg-white px-6 py-5 shadow-sm dark:bg-darkmode-600">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/30">
            <BookOpen className="size-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
              {classItem.tenLop}
            </h1>
            <div className="mt-1 flex items-center gap-2">
              <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                #{classItem.maLop}
              </span>
            </div>
          </div>
        </div>
        <Link
          to="/student/class"
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50 dark:border-darkmode-400 dark:text-slate-300 dark:hover:bg-darkmode-400"
        >
          ← Quay lại
        </Link>
      </div>

      {/* Thông tin chung */}
      <div className="rounded-xl bg-white px-6 py-5 shadow-sm dark:bg-darkmode-600">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
          Thông tin chung
        </p>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="rounded-lg bg-slate-50 p-4 dark:bg-darkmode-800">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <CalendarDays className="size-3.5 text-amber-600 dark:text-amber-400" />
              </div>
              <span className="text-xs text-slate-400">Năm học</span>
            </div>
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              {classItem.namHoc ?? "—"}
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-4 dark:bg-darkmode-800">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/30">
                <Home className="size-3.5 text-violet-600 dark:text-violet-400" />
              </div>
              <span className="text-xs text-slate-400">Khối lớp</span>
            </div>
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              {classItem.khoiLop?.ten ?? "—"}
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-4 dark:bg-darkmode-800">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-100 dark:bg-teal-900/30">
                <BookMarked className="size-3.5 text-teal-600 dark:text-teal-400" />
              </div>
              <span className="text-xs text-slate-400">Môn học</span>
            </div>
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              {classItem.monHoc?.ten ?? "—"}
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-4 dark:bg-darkmode-800">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-pink-100 dark:bg-pink-900/30">
                <User className="size-3.5 text-pink-600 dark:text-pink-400" />
              </div>
              <span className="text-xs text-slate-400">Giáo viên</span>
            </div>
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              {classItem.giaoVien?.hoTen ?? "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Chức năng */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Link
          to={`/student/classroom/${classItem.id}/exams`}
          className="group flex items-start gap-4 rounded-xl bg-white px-6 py-5 shadow-sm transition-all hover:border hover:border-blue-300 hover:shadow-md dark:bg-darkmode-600"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/30">
            <BookOpen className="size-5 text-blue-600 group-hover:text-blue-700 dark:text-blue-400" />
          </div>
          <div>
            <p className="font-semibold text-slate-800 group-hover:text-blue-600 dark:text-slate-200 dark:group-hover:text-blue-400">
              Danh sách đề thi
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Xem các đề giáo viên đã giao cho lớp.
            </p>
          </div>
        </Link>

        <Link
          to={`/student/classroom/${classItem.id}/lectures`}
          className="group flex items-start gap-4 rounded-xl bg-white px-6 py-5 shadow-sm transition-all hover:border hover:border-teal-300 hover:shadow-md dark:bg-darkmode-600"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 dark:bg-teal-900/30">
            <BookMarked className="size-5 text-teal-600 group-hover:text-teal-700 dark:text-teal-400" />
          </div>
          <div>
            <p className="font-semibold text-slate-800 group-hover:text-teal-600 dark:text-slate-200 dark:group-hover:text-teal-400">
              Bài giảng
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Xem tài liệu và bài giảng của lớp.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ClassDetailPage;