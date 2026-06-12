import { useState } from "react";
import { TbSearch, TbTrash, TbArrowsExchange } from "react-icons/tb";
import { type TaiKhoanNguoiDung } from "../../../../services/apis/adminAPI";

type TabFilter = "ALL" | "GV" | "HS";

const ROLE_LABEL: Record<string, string> = {
  GV: "Giáo viên",
  HS: "Học sinh",
};

interface Props {
  danhSach: TaiKhoanNguoiDung[];
  onXoa: (id: number) => void;
  onDoiVaiTro: (user: TaiKhoanNguoiDung) => void;
}

const UserTable = ({ danhSach, onXoa, onDoiVaiTro }: Props) => {
  const [tab, setTab] = useState<TabFilter>("ALL");
  const [search, setSearch] = useState("");

  const filtered = danhSach.filter((u) => {
    const matchTab = tab === "ALL" || u.vaiTro === tab;
    const kw = search.toLowerCase();
    const matchSearch =
      !kw ||
      u.ten.toLowerCase().includes(kw) ||
      u.email.toLowerCase().includes(kw) ||
      u.tenDangNhap.toLowerCase().includes(kw);
    return matchTab && matchSearch;
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex gap-1 mb-3">
          {(["ALL", "GV", "HS"] as TabFilter[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                tab === t
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {t === "ALL" ? "Tất cả" : ROLE_LABEL[t]}
            </button>
          ))}
        </div>

        <div className="relative">
          <TbSearch
            className="absolute left-3 top-2.5 text-gray-400"
            size={16}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên, email, tên đăng nhập..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-indigo-400"
          />
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">
          Không tìm thấy tài khoản nào
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-500 font-medium">
              <th className="text-left px-4 py-3 w-8">#</th>
              <th className="text-left px-4 py-3">Họ tên</th>
              <th className="text-left px-4 py-3">Tên đăng nhập</th>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">Vai trò</th>
              <th className="text-left px-4 py-3">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((u, i) => (
              <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                <td className="px-4 py-3 font-medium text-gray-800">{u.ten}</td>
                <td className="px-4 py-3 text-gray-500">{u.tenDangNhap}</td>
                <td className="px-4 py-3 text-gray-500">{u.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      u.vaiTro === "GV"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {ROLE_LABEL[u.vaiTro]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onDoiVaiTro(u)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      <TbArrowsExchange size={14} />
                      Đổi vai trò
                    </button>
                    <button
                      onClick={() => onXoa(u.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs border border-red-200 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <TbTrash size={14} />
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
        Hiển thị {filtered.length} / {danhSach.length} tài khoản
      </div>
    </div>
  );
};

export default UserTable;
