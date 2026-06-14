import { useEffect, useState } from "react";
import AdminAPI, {
  type TaiKhoanNguoiDung,
} from "../../../services/apis/adminAPI";
import UserMetrics from "./components/UserMetrics";
import UserTable from "./components/UserTable";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";

const AdminDashboard = () => {
  const [danhSach, setDanhSach] = useState<TaiKhoanNguoiDung[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    const data = await AdminAPI.danhSachTaiKhoan();
    setDanhSach(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleXoa = async (id: number) => {
    const ok = await AdminAPI.xoaTaiKhoan(id);
    if (ok) {
      setDanhSach((prev) => prev.filter((u) => u.id !== id));
      setConfirmId(null);
    }
  };

  const handleDoiVaiTro = async (u: TaiKhoanNguoiDung) => {
    const vaiTroMoi = u.vaiTro === "GV" ? "HS" : "GV";
    const ok = await AdminAPI.doiVaiTro(u.id, vaiTroMoi);
    if (ok) {
      setDanhSach((prev) =>
        prev.map((item) =>
          item.id === u.id ? { ...item, vaiTro: vaiTroMoi } : item,
        ),
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px] text-gray-400 text-sm">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500 mr-3" />
        Đang tải...
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-800">
          Quản lý tài khoản
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Danh sách tài khoản giáo viên và học sinh
        </p>
      </div>

      <UserMetrics
        total={danhSach.length}
        countGV={danhSach.filter((u) => u.vaiTro === "GV").length}
        countHS={danhSach.filter((u) => u.vaiTro === "HS").length}
      />

      <UserTable
        danhSach={danhSach}
        onXoa={(id) => setConfirmId(id)}
        onDoiVaiTro={handleDoiVaiTro}
      />

      <ConfirmDeleteModal
        open={confirmId !== null}
        onClose={() => setConfirmId(null)}
        onConfirm={() => confirmId !== null && handleXoa(confirmId)}
      />
    </div>
  );
};

export default AdminDashboard;
