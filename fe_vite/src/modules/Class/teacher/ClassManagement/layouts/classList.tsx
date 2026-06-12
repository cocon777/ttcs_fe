import { useEffect, useRef, useState } from "react";
import { ChevronsDownUp, Search, Trash2 } from "lucide-react";
import { classAPI } from "../../../../../services/apis/classAPI";
import { CategoryForm } from "../../../../../share/components/CategoryForm/categoryForm";
import ClassBox from "../components/classBox";
import toast from "react-hot-toast";

const ClassList = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // dropdown
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // modal sửa
  const [editTarget, setEditTarget] = useState<any | null>(null);
  const [editValues, setEditValues] = useState({
    tenLop: "",
    maLop: "",
    namHoc: "",
    khoiLopId: -1,
    monHocId: -1,
  });
  const [saving, setSaving] = useState(false);

  // modal xoá
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const res = await classAPI.getAllByTeacher();
      if (res.status === 200) {
        setClasses(res.data);
        setFilteredClasses(res.data);
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách lớp:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    const filtered = classes.filter((item) =>
      item.tenLop?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredClasses(filtered);
  }, [searchTerm, classes]);

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Sửa
  const openEdit = (item: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuId(null);
    setEditTarget(item);
    setEditValues({
      tenLop: item.tenLop ?? "",
      maLop: item.maLop ?? "",
      namHoc: item.namHoc ?? "",
      khoiLopId: item.khoiLop?.id ?? -1,
      monHocId: item.monHoc?.id ?? -1,
    });
  };

  const handleSaveEdit = async () => {
    if (!editTarget) return;
    setSaving(true);
    try {
      await classAPI.updateClass(editTarget.id, {
        tenLop: editValues.tenLop,
        maLop: editValues.maLop,
        namHoc: editValues.namHoc,
        khoiLopId: editValues.khoiLopId === -1 ? null : editValues.khoiLopId,
        monHocId: editValues.monHocId === -1 ? null : editValues.monHocId,
      });
      setEditTarget(null);
      toast.success("Sửa lớp thành công");
      fetchClasses();
    } catch (err) {
      alert("Lỗi khi cập nhật lớp!");
    } finally {
      setSaving(false);
    }
  };

  // --- Xoá ---
  const openDelete = (item: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuId(null);
    setDeleteTarget(item);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await classAPI.deleteClass(deleteTarget.id);
      setDeleteTarget(null);
      toast.success("Xóa lớp thành công");
      fetchClasses();
    } catch (err) {
      alert("Lỗi khi xóa lớp!");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Thanh tìm kiếm */}
      <div className="rounded bg-white p-3 shadow-sm dark:bg-darkmode-600">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-slate-200 py-2 pl-3 pr-10 text-sm shadow-sm focus:border-blue-400 focus:outline-none dark:border-none dark:bg-darkmode-800"
              placeholder="Tìm kiếm theo tên lớp..."
            />
            <Search className="absolute right-3 top-2.5 size-4 text-slate-400" />
          </div>
          <button
            onClick={fetchClasses}
            className="rounded-md p-2 transition-colors hover:bg-slate-100 dark:hover:bg-darkmode-400"
          >
            <ChevronsDownUp className="size-5 text-slate-500 dark:text-slate-300" />
          </button>
        </div>
      </div>
      <ClassBox
        loading={loading}
        classes={filteredClasses}
        openMenuId={openMenuId}
        setOpenMenuId={setOpenMenuId}
        openEdit={openEdit}
        openDelete={openDelete}
        menuRef={menuRef}
      />
      {editTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setEditTarget(null)}
        >
          <div
            className="w-[520px] rounded-md bg-white shadow dark:bg-darkmode-600 dark:text-slate-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-gray-200 p-3 text-sm font-semibold dark:border-darkmode-400">
              Sửa lớp học
            </div>

            <div className="space-y-3 px-5 py-4">
              <div className="space-y-1">
                <label className="text-sm">Tên lớp</label>
                <input
                  type="text"
                  value={editValues.tenLop}
                  onChange={(e) =>
                    setEditValues((v) => ({ ...v, tenLop: e.target.value }))
                  }
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-none dark:bg-darkmode-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm">Năm học</label>
                <input
                  type="text"
                  value={editValues.namHoc}
                  onChange={(e) =>
                    setEditValues((v) => ({ ...v, namHoc: e.target.value }))
                  }
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-none dark:bg-darkmode-800"
                />
              </div>

              <CategoryForm
                khoiLopId={editValues.khoiLopId}
                monHocId={editValues.monHocId}
                handleChangeConfig={(name, value) =>
                  setEditValues((v) => ({ ...v, [name]: value }))
                }
              />
            </div>

            <div className="flex justify-end gap-2 p-3">
              <button
                onClick={() => setEditTarget(null)}
                className="rounded-md bg-gray-100 px-6 py-2 text-sm text-gray-600 hover:bg-gray-200"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={saving || !editValues.tenLop}
                className="rounded-md bg-blue-700 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-50"
              >
                {saving ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Xác nhận xóa*/}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="w-[420px] rounded-md bg-white p-6 shadow dark:bg-darkmode-600 dark:text-slate-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <Trash2 className="size-5 text-red-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  Xóa lớp học
                </p>
                <p className="text-sm text-slate-500">
                  Hành động này không thể hoàn tác
                </p>
              </div>
            </div>

            <p className="mb-5 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
              Bạn chắc chắn muốn xóa lớp <strong>{deleteTarget.tenLop}</strong>?
              Toàn bộ học sinh, kết quả, bài giảng liên quan sẽ bị xóa theo.
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-md border border-slate-300 px-5 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="rounded-md bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Đang xóa..." : "Xóa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassList;
