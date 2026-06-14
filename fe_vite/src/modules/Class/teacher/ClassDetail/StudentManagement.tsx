import { useState, useEffect, useCallback, useRef } from "react";
import { Trash2, Loader2, Search, UserCheck, X, Eye } from "lucide-react";
import { StudentClassroomAPI } from "../../../../services/apis/studentClassAPI";
import PopupChiTietHocSinh from "./components/PopupChiTietHocSinh";
import toast from "react-hot-toast";
interface StudentManagementProps {
  classId: number;
}

interface HocSinhSearchResult {
  id: number;
  maHS: string;
  ten: string;
  email: string;
  anhDaiDien?: string;
  truong?: string;
}

const StudentManagement = ({ classId }: StudentManagementProps) => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [detailStudent, setDetailStudent] = useState<any | null>(null);

  // Search state
  const [keyword, setKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<HocSinhSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState<HocSinhSearchResult | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchBoxRef = useRef<HTMLDivElement>(null);

  // Đóng dropdown khi click ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounce search
  useEffect(() => {
    if (selected) return; // đã chọn rồi thì không search nữa
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!keyword.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await StudentClassroomAPI.searchHocSinh(keyword.trim());
        setSearchResults(res?.data ?? []);
        setShowDropdown(true);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 350);
  }, [keyword, selected]);

  const loadStudents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await StudentClassroomAPI.getByClassroomId(classId);
      if (res?.status === 200) setStudents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  const handleSelectStudent = (hs: HocSinhSearchResult) => {
    setSelected(hs);
    setKeyword(hs.ten);
    setShowDropdown(false);
  };

  const handleClearSelected = () => {
    setSelected(null);
    setKeyword("");
    setSearchResults([]);
  };

  const handleAdd = async () => {
    if (!selected) return;
    setActionLoading(true);
    try {
      const res = await StudentClassroomAPI.addToClassByStudentCode(
        selected.maHS,
        classId,
      );
      if (res?.status === 200) {
        toast.success("Thêm học sinh thành công!");
        handleClearSelected();
        loadStudents();
      } else {
        toast.error("Học sinh đã có trong lớp hoặc có lỗi xảy ra!");
      }
    } catch {
      toast.error("Đã xảy ra lỗi khi thêm học sinh!");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemove = async (hocSinhId: number) => {
    if (!window.confirm("Xác nhận xóa học sinh này khỏi lớp?")) return;
    try {
      const res = await StudentClassroomAPI.delete(classId, hocSinhId);
      if (res?.status === 200) loadStudents();
    } catch {
      alert("Lỗi khi xóa học sinh!");
    }
  };

  return (
    <>
      {detailStudent && (
        <PopupChiTietHocSinh
          student={detailStudent}
          onClose={() => setDetailStudent(null)}
        />
      )}
      <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden mt-8">
        {/* Header & Search */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-800">
              Danh sách học sinh
            </h2>
            <p className="text-sm text-slate-500">
              Tìm kiếm theo tên hoặc mã học sinh để thêm vào lớp
            </p>
          </div>

          {/* Search box */}
          <div ref={searchBoxRef} className="relative max-w-lg">
            <div className="flex items-center gap-2 border border-slate-300 rounded-lg bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
              {searching ? (
                <Loader2 className="size-4 text-slate-400 shrink-0 animate-spin" />
              ) : (
                <Search className="size-4 text-slate-400 shrink-0" />
              )}
              <input
                type="text"
                placeholder="Tìm theo tên hoặc mã học sinh..."
                className="flex-1 text-sm outline-none bg-transparent"
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                  if (selected) setSelected(null);
                }}
                onFocus={() =>
                  searchResults.length > 0 && setShowDropdown(true)
                }
              />
              {keyword && (
                <X
                  className="size-4 text-slate-400 cursor-pointer hover:text-slate-600 shrink-0"
                  onClick={handleClearSelected}
                />
              )}
            </div>

            {/* Dropdown kết quả tìm kiếm */}
            {showDropdown && searchResults.length > 0 && (
              <div className="absolute z-30 top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {searchResults.map((hs) => (
                  <div
                    key={hs.id}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-slate-50 last:border-0"
                    onClick={() => handleSelectStudent(hs)}
                  >
                    <div className="size-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm shrink-0">
                      {hs.anhDaiDien ? (
                        <img
                          src={hs.anhDaiDien}
                          className="size-9 rounded-full object-cover"
                        />
                      ) : (
                        hs.ten.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-slate-800 truncate">
                        {hs.ten}
                      </div>
                      <div className="text-xs text-slate-500 flex gap-2">
                        <span className="font-mono font-bold text-blue-600">
                          {hs.maHS}
                        </span>
                        {hs.truong && (
                          <span className="truncate">· {hs.truong}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showDropdown &&
              !searching &&
              searchResults.length === 0 &&
              keyword.trim() && (
                <div className="absolute z-30 top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg px-4 py-3 text-sm text-slate-400 italic">
                  Không tìm thấy học sinh nào
                </div>
              )}
          </div>

          {/* Card thông tin học sinh đã chọn */}
          {selected && (
            <div className="mt-4 max-w-lg flex items-center justify-between gap-4 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-full bg-blue-200 flex items-center justify-center text-blue-800 font-bold text-base shrink-0">
                  {selected.anhDaiDien ? (
                    <img
                      src={selected.anhDaiDien}
                      className="size-11 rounded-full object-cover"
                    />
                  ) : (
                    selected.ten.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <div className="font-bold text-slate-800">{selected.ten}</div>
                  <div className="text-xs text-slate-500 space-y-0.5 mt-0.5">
                    <div>
                      Mã HS:{" "}
                      <span className="font-mono font-bold text-blue-600">
                        {selected.maHS}
                      </span>
                    </div>
                    <div>{selected.email}</div>
                    {selected.truong && <div>Trường: {selected.truong}</div>}
                  </div>
                </div>
              </div>
              <button
                onClick={handleAdd}
                disabled={actionLoading}
                className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors disabled:bg-slate-400"
              >
                {actionLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <UserCheck size={16} />
                )}
                Thêm vào lớp
              </button>
            </div>
          )}
        </div>

        {/* Bảng danh sách */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200">
                <th className="p-4 font-bold text-slate-700 w-16">STT</th>
                <th className="p-4 font-bold text-slate-700">Tên học sinh</th>
                <th className="p-4 font-bold text-slate-700">Mã học sinh</th>
                <th className="p-4 font-bold text-slate-700">Ngày vào lớp</th>
                <th className="p-4 font-bold text-slate-700 text-center">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <Loader2 size={32} className="animate-spin" />
                      <p>Đang tải...</p>
                    </div>
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-10 text-center text-slate-400 italic"
                  >
                    Lớp học chưa có học sinh nào.
                  </td>
                </tr>
              ) : (
                students.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-b border-slate-50 hover:bg-blue-50/30 transition-colors"
                  >
                    <td className="p-4 text-slate-500">{index + 1}</td>
                    <td className="p-4 font-semibold text-slate-800">
                      {item.nguoiDung?.ten ||
                        item.nguoiDung?.tenDangNhap ||
                        "Chưa cập nhật"}
                    </td>
                    <td className="p-4">
                      <span className="bg-slate-100 px-2 py-1 rounded text-xs font-mono font-bold text-slate-600">
                        {item.maHS || "—"}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString("vi-VN")
                        : "—"}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setDetailStudent(item)}
                          className="text-blue-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-all"
                          title="Xem chi tiết"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-all"
                          title="Xóa khỏi lớp"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default StudentManagement;
