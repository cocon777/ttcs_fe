import {
  Loader2,
  BookOpen,
  GraduationCap,
  Users,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router";

interface ClassBoxProps {
  loading: boolean;
  classes: any[];

  openMenuId: number | null;

  setOpenMenuId: React.Dispatch<React.SetStateAction<number | null>>;

  openEdit: (item: any, e: React.MouseEvent) => void;

  openDelete: (item: any, e: React.MouseEvent) => void;

  menuRef: React.RefObject<HTMLDivElement | null>;
}

const ClassBox = ({
  loading,
  classes,
  openMenuId,
  setOpenMenuId,
  openEdit,
  openDelete,
  menuRef,
}: ClassBoxProps) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-400">
        <Loader2 className="mb-2 animate-spin" />
        <p className="text-sm">Đang tải danh sách lớp...</p>
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center dark:border-darkmode-400 dark:bg-darkmode-600">
        <BookOpen className="mx-auto mb-2 size-8 text-slate-300" />
        <p className="text-sm text-slate-400">Không tìm thấy lớp học nào.</p>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
      ref={menuRef}
    >
      {classes.map((item) => (
        <div
          key={item.id}
          onClick={() => navigate(`/teacher/class/classroom-detail/${item.id}`)}
          className="group relative flex cursor-pointer flex-col gap-3 rounded-xl border border-transparent bg-white p-4 shadow-sm transition-all hover:border-blue-400 hover:shadow-md dark:bg-darkmode-600"
        >
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="rounded-lg bg-blue-50 p-2 dark:bg-blue-900/30">
                <BookOpen className="size-5 text-blue-600 dark:text-blue-400" />
              </div>

              <div className="min-w-0">
                <h3 className="truncate font-bold text-slate-800 group-hover:text-blue-600">
                  {item.tenLop}
                </h3>

                <p className="text-xs text-slate-400">{item.namHoc}</p>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenuId(openMenuId === item.id ? null : item.id);
              }}
              className="rounded-md p-1 text-black-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
            >
              <MoreVertical className="size-4" />
            </button>

            {openMenuId === item.id && (
              <div className="absolute right-3 top-12 z-20 w-36 rounded-md border border-slate-200 bg-white shadow-lg">
                <button
                  onClick={(e) => openEdit(item, e)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                >
                  <Pencil className="size-4" />
                  Sửa lớp
                </button>

                <button
                  onClick={(e) => openDelete(item, e)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="size-4" />
                  Xóa lớp
                </button>
              </div>
            )}
          </div>

          <div className="border-t border-slate-100" />

          {/* Thông tin */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1 rounded-md bg-indigo-50 px-3 py-2 text-xs font-medium text-indigo-600">
              <GraduationCap className="size-3" />
              {item.khoiLop?.ten ?? "—"}
            </span>

            <span className="flex items-center gap-1 rounded-md bg-cyan-50 px-3 py-2 text-xs font-medium text-cyan-600">
              <BookOpen className="size-3" />
              {item.monHoc?.ten ?? "—"}
            </span>

            <span className="flex items-center gap-1 rounded-md bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-600">
              <Users className="size-3" />
              Sĩ số: {item.soLuongHS ?? 0}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClassBox;
