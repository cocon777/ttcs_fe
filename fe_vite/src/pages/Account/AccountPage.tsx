import { useState, useEffect, useRef } from "react";
import { Camera, Plus, X, Save, Eye, EyeOff } from "lucide-react";
import axiosInstance from "../../services/axiosInstance"; // chỉnh path
import UserAPI from "../../services/apis/userAPI";
import GradeAPI from "../../services/apis/gradeAPI";
import SubjectAPI from "../../services/apis/subjectAPI";
import Dropdown from "../../share/components/DropDown/dropDown"; // chỉnh path
import type { NguoiDung } from "../../share/interfaces/user.interface";
import type {
  Truong,
  KhoiLop,
  MonHoc,
} from "../../share/interfaces/infor.interface";
import { VaiTro, GioiTinh } from "../../share/constant/constant";
import {
  uploadToCloudinary,
  CloudinaryUploadError,
} from "../../share/utils/uploadToCloudinary";

interface DropOpt {
  name: string;
  value: number;
}

interface DayHocRow {
  khoiLop: DropOpt | null;
  monHoc: DropOpt | null;
  monHocOptions: DropOpt[];
}

type ActiveTab = "chung" | "matkhau";

const GIOITINH_LIST = [GioiTinh.NAM, GioiTinh.NU, GioiTinh.KHAC];

const AccountPage = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("chung");
  const [user, setUser] = useState<NguoiDung | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ ok: boolean; msg: string } | null>(null);

  const [truongSearch, setTruongSearch] = useState("");
  const [truongResults, setTruongResults] = useState<Truong[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [tuNhap, setTuNhap] = useState(false); // chế độ nhập tay
  const searchRef = useRef<HTMLDivElement>(null);

  // ── General form ──
  const [form, setForm] = useState({
    ten: "",
    soDienThoai: "",
    ngaySinh: "",
    gioiTinh: GioiTinh.NAM as GioiTinh,
    truongTen: "",
    truongTinh: "",
    truongXa: "",
  });

  // ── Teacher: danh sách cặp Khối + Môn ──
  const [rows, setRows] = useState<DayHocRow[]>([]);
  const [khoiLopOptions, setKhoiLopOptions] = useState<DropOpt[]>([]);

  // ── Password form ──
  const [pw, setPw] = useState({ cu: "", moi: "", xacNhan: "" });
  const [showPw, setShowPw] = useState({
    cu: false,
    moi: false,
    xacNhan: false,
  });

  // ── Avatar ──
  const fileRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploading, setUploading] = useState(false);

  // ─── Load data
  useEffect(() => {
    (async () => {
      const res = await UserAPI.getInfo();
      if (res?.status === 200) {
        const u: NguoiDung = res.data;
        setUser(u);
        const tenTruong =
          u.vaiTro === VaiTro.GV
            ? ((u as any).giaoVien?.truong?.ten ?? "")
            : ((u as any).hocSinh?.truong?.ten ?? "");
        const tinhTruong =
          u.vaiTro === VaiTro.GV
            ? ((u as any).giaoVien?.truong?.tinh ?? "")
            : ((u as any).hocSinh?.truong?.tinh ?? "");
        const xaTruong =
          u.vaiTro === VaiTro.GV
            ? ((u as any).giaoVien?.truong?.xa ?? "")
            : ((u as any).hocSinh?.truong?.xa ?? "");
        setForm({
          ten: u.ten || "",
          soDienThoai: u.soDienThoai || "",
          // ngaySinh có thể là "2004-11-28" hoặc array từ Jackson
          ngaySinh: u.ngaySinh ? String(u.ngaySinh).substring(0, 10) : "",
          gioiTinh: u.gioiTinh || GioiTinh.NAM,
          truongTen: tenTruong,
          truongTinh: tinhTruong,
          truongXa: xaTruong,
        });

        if (tenTruong) setTruongSearch(tenTruong);

        if (u.vaiTro === VaiTro.GV) {
          const [gradesRes, monHocRes] = await Promise.all([
            GradeAPI.getAll(),
            axiosInstance.get("users/giao-vien/mon-hoc"), // load môn đang dạy
          ]);

          let khoiOpts: DropOpt[] = [];
          if (gradesRes?.status === 200) {
            khoiOpts = gradesRes.data.map((kl: KhoiLop) => ({
              name: kl.ten,
              value: kl.id,
            }));
            setKhoiLopOptions(khoiOpts);
          }

          // Dựng lại rows từ dữ liệu đã lưu
          if (monHocRes?.data?.length > 0) {
            const loadedRows: DayHocRow[] = await Promise.all(
              monHocRes.data.map(async (item: any) => {
                // Lấy danh sách môn của khối đó
                const subRes = await SubjectAPI.getByGradeId(item.khoiLopId);
                const monHocOptions: DropOpt[] =
                  subRes?.data?.map((mh: MonHoc) => ({
                    name: mh.ten,
                    value: mh.id,
                  })) ?? [];

                return {
                  khoiLop: { name: item.khoiLopTen, value: item.khoiLopId },
                  monHoc: { name: item.monHocTen, value: item.monHocId },
                  monHocOptions,
                };
              }),
            );
            setRows(loadedRows);
          }
        }
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!truongSearch.trim() || tuNhap) {
      setTruongResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearching(true);
      const res = await UserAPI.searchTruong(truongSearch);
      if (res?.status === 200) setTruongResults(res.data);
      setSearching(false);
    }, 350); // debounce 350ms
    return () => clearTimeout(timer);
  }, [truongSearch, tuNhap]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node))
        setShowResults(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleChonTruong = (t: Truong) => {
    setTruongSearch(t.ten);
    setF("truongTen", t.ten);
    setF("truongTinh", t.tinh ?? "");
    setF("truongXa", t.xa ?? "");
    setShowResults(false);
    setTuNhap(false);
  };

  const handleBatDauTuNhap = () => {
    setTuNhap(true);
    setShowResults(false);
    setTruongSearch("");
    setF("truongTen", "");
    setF("truongTinh", "");
    setF("truongXa", "");
  };

  const showToast = (ok: boolean, msg: string) => {
    setToast({ ok, msg });
    setTimeout(() => setToast(null), 3000);
  };

  //  Avatar
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);
    try {
      const result = await uploadToCloudinary(file, (percent) => {
        setUploadProgress(percent);
      });
      setAvatarUrl(result.secure_url);
      showToast(true, "Tải ảnh lên thành công!");
    } catch (err) {
      if (err instanceof CloudinaryUploadError) {
        showToast(false, err.message);
      } else {
        showToast(false, "Lỗi khi tải ảnh lên!");
      }
    }
    setUploading(false);
  };

  // ─── Save general
  const handleSaveGeneral = async () => {
    setSaving(true);
    try {
      const res = await axiosInstance.put("users/me", {
        ten: form.ten,
        soDienThoai: form.soDienThoai || null,
        ngaySinh: form.ngaySinh || null,
        gioiTinh: form.gioiTinh,
        truongTen: form.truongTen || null,
        truongTinh: form.truongTinh || null,
        truongXa: form.truongXa || null,
        anhDaiDien: avatarUrl || user?.anhDaiDien || null,
      });

      if (res.status === 200) {
        // Lưu day-hoc cho GV
        if (user?.vaiTro === VaiTro.GV) {
          const monHocIds = rows
            .filter((r) => r.monHoc !== null)
            .map((r) => r.monHoc!.value);

          await axiosInstance.put("users/giao-vien/mon-hoc", monHocIds);
        }
        showToast(true, "Cập nhật thành công!");
      }
    } catch {
      showToast(false, "Có lỗi xảy ra, vui lòng thử lại!");
    }
    setSaving(false);
  };

  // ─── Save password
  const handleSavePassword = async () => {
    if (!pw.cu || !pw.moi) return showToast(false, "Vui lòng điền đầy đủ!");
    if (pw.moi !== pw.xacNhan)
      return showToast(false, "Mật khẩu xác nhận không khớp!");
    setSaving(true);
    try {
      await axiosInstance.put("users/me/password", {
        matKhauCu: pw.cu,
        matKhauMoi: pw.moi,
      });
      showToast(true, "Đổi mật khẩu thành công!");
      setPw({ cu: "", moi: "", xacNhan: "" });
    } catch {
      showToast(false, "Mật khẩu hiện tại không đúng!");
    }
    setSaving(false);
  };

  // ─── Teaching rows (GV)
  const addRow = () =>
    setRows((prev) => [
      ...prev,
      { khoiLop: null, monHoc: null, monHocOptions: [] },
    ]);

  const removeRow = (i: number) =>
    setRows((prev) => prev.filter((_, idx) => idx !== i));

  const handleSelectKhoi = async (i: number, opt: DropOpt | null) => {
    const next = [...rows];
    next[i].khoiLop = opt;
    next[i].monHoc = null;
    next[i].monHocOptions = [];
    if (opt) {
      const res = await SubjectAPI.getByGradeId(opt.value);
      if (res?.status === 200)
        next[i].monHocOptions = res.data.map((mh: MonHoc) => ({
          name: mh.ten,
          value: mh.id,
        }));
    }
    setRows(next);
  };

  const handleSelectMon = (i: number, opt: DropOpt | null) => {
    const next = [...rows];
    next[i].monHoc = opt;
    setRows(next);
  };

  // ─── Helpers ─────────────────────────────────────────
  const setF = (key: keyof typeof form, val: any) =>
    setForm((f) => ({ ...f, [key]: val }));

  const initial = user?.ten
    ? user.ten.trim().split(" ").pop()![0].toUpperCase()
    : "?";

  if (loading)
    return (
      <div className="flex h-full items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 p-6 dark:bg-slate-950">
      <h1 className="mb-6 text-xl font-bold text-slate-800 dark:text-slate-100">
        Cài đặt tài khoản
      </h1>

      {/* Toast */}
      {toast && (
        <div
          className={`mb-4 rounded-xl border px-4 py-3 text-sm font-medium ${
            toast.ok
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {toast.msg}
        </div>
      )}

      <div className="flex gap-5">
        {/* ── LEFT: Tab sidebar ── */}
        <aside className="w-52 shrink-0">
          <div className="rounded-2xl border border-slate-200 bg-white p-1.5 dark:border-slate-700 dark:bg-slate-900">
            {(
              [
                { id: "chung", label: "Chung" },
                { id: "matkhau", label: "Đổi mật khẩu" },
              ] as { id: ActiveTab; label: string }[]
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </aside>

        {/* ── RIGHT: Content ── */}
        <section className="flex-1 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
          {/* ════════ TAB: CHUNG ════════ */}
          {activeTab === "chung" && (
            <div className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-5">
                <div className="relative">
                  {avatarUrl || user?.anhDaiDien ? (
                    <img
                      src={avatarUrl || user?.anhDaiDien}
                      className="h-20 w-20 rounded-full object-cover ring-4 ring-slate-100 dark:ring-slate-800"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white ring-4 ring-slate-100 dark:ring-slate-800">
                      {initial}
                    </div>
                  )}

                  {/* Progress ring khi đang upload */}
                  {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
                      <span className="text-xs font-bold text-white">
                        {uploadProgress}%
                      </span>
                    </div>
                  )}

                  <button
                    onClick={() => !uploading && fileRef.current?.click()}
                    disabled={uploading}
                    className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white shadow hover:bg-slate-50 disabled:opacity-50"
                  >
                    <Camera className="size-3.5 text-slate-500" />
                  </button>

                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Tải lên ảnh đại diện
                  </p>
                  <p className="text-xs text-slate-400">
                    Tối đa 10MB · JPG, PNG, WEBP
                  </p>
                  {uploading && (
                    <div className="mt-1.5 h-1.5 w-36 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-blue-500 transition-all duration-200"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Grid: Họ tên + Username */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Họ và tên">
                  <input
                    value={form.ten}
                    onChange={(e) => setF("ten", e.target.value)}
                    className={inputCls}
                    placeholder="Nhập họ và tên..."
                  />
                </Field>

                <Field label="Username">
                  <input
                    value={user?.tenDangNhap || ""}
                    readOnly
                    className={readonlyCls}
                  />
                </Field>

                {/* Ngày sinh + Email */}
                <Field label="Ngày sinh">
                  <input
                    type="date"
                    value={form.ngaySinh}
                    onChange={(e) => setF("ngaySinh", e.target.value)}
                    className={inputCls}
                  />
                </Field>

                <Field label="Email">
                  <input
                    value={user?.email || ""}
                    readOnly
                    className={readonlyCls}
                  />
                  <button className="mt-1 text-xs text-blue-500 hover:underline">
                    Click vào đây để đổi email
                  </button>
                </Field>

                {/* Số điện thoại + Giới tính */}
                <Field label="Số điện thoại">
                  <input
                    value={form.soDienThoai}
                    onChange={(e) => setF("soDienThoai", e.target.value)}
                    className={inputCls}
                    placeholder="Nhập số điện thoại..."
                  />
                </Field>

                <Field label="Giới tính">
                  <div className="flex gap-5 py-2.5">
                    {GIOITINH_LIST.map((gt) => (
                      <label
                        key={gt}
                        className="flex cursor-pointer items-center gap-1.5"
                      >
                        <input
                          type="radio"
                          name="gioiTinh"
                          checked={form.gioiTinh === gt}
                          onChange={() => setF("gioiTinh", gt)}
                          className="accent-blue-600"
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {gt}
                        </span>
                      </label>
                    ))}
                  </div>
                </Field>
              </div>

              {/* Thông tin trường */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Thông tin trường
                </label>

                {!tuNhap ? (
                  /* ── CHẾ ĐỘ TÌM KIẾM ── */
                  <div ref={searchRef} className="relative">
                    <div className="relative">
                      <input
                        value={truongSearch}
                        onChange={(e) => {
                          setTruongSearch(e.target.value);
                          setShowResults(true);
                        }}
                        onFocus={() => truongSearch && setShowResults(true)}
                        className={inputCls}
                        placeholder="Tìm tên trường..."
                      />
                      {searching && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                        </div>
                      )}
                    </div>

                    {/* Dropdown kết quả */}
                    {showResults &&
                      (truongResults.length > 0 || truongSearch.length > 1) && (
                        <div className="absolute z-30 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
                          {truongResults.length === 0 && !searching && (
                            <div className="px-4 py-3 text-sm text-slate-400">
                              Không tìm thấy —
                              <button
                                onClick={handleBatDauTuNhap}
                                className="ml-1 font-semibold text-blue-600 hover:underline"
                              >
                                Nhập trường mới
                              </button>
                            </div>
                          )}

                          {truongResults.map((t) => (
                            <button
                              key={t.id}
                              onClick={() => handleChonTruong(t)}
                              className="flex w-full flex-col px-4 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-800"
                            >
                              <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
                                {t.ten}
                              </span>
                              {(t.tinh || t.xa) && (
                                <span className="text-xs text-slate-400">
                                  {[t.xa, t.tinh].filter(Boolean).join(" · ")}
                                </span>
                              )}
                            </button>
                          ))}

                          {/* Luôn có option nhập mới ở cuối */}
                          {truongResults.length > 0 && (
                            <>
                              <div className="mx-3 border-t border-slate-100 dark:border-slate-700" />
                              <button
                                onClick={handleBatDauTuNhap}
                                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800"
                              >
                                <Plus className="size-4" />
                                Nhập trường chưa có trong danh sách
                              </button>
                            </>
                          )}
                        </div>
                      )}

                    {/* Hiện trường đang chọn */}
                    {form.truongTen && (
                      <div className="mt-2 flex items-center justify-between rounded-lg bg-blue-50 px-3 py-2 dark:bg-blue-900/20">
                        <div>
                          <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                            {form.truongTen}
                          </p>
                          {(form.truongTinh || form.truongXa) && (
                            <p className="text-xs text-blue-500">
                              {[form.truongXa, form.truongTinh]
                                .filter(Boolean)
                                .join(" · ")}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            setTruongSearch("");
                            setF("truongTen", "");
                            setF("truongTinh", "");
                            setF("truongXa", "");
                          }}
                          className="text-blue-400 hover:text-blue-600"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* ── CHẾ ĐỘ NHẬP TAY ── */
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        Nhập thông tin trường mới
                      </span>
                      <button
                        onClick={() => setTuNhap(false)}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        ← Quay lại tìm kiếm
                      </button>
                    </div>
                    <input
                      value={form.truongTen}
                      onChange={(e) => setF("truongTen", e.target.value)}
                      className={inputCls}
                      placeholder="Tên trường..."
                      autoFocus
                    />
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2">
                        <input
                          value={form.truongTinh}
                          onChange={(e) => setF("truongTinh", e.target.value)}
                          className={inputCls}
                          placeholder="Tỉnh / Thành phố..."
                        />
                      </div>
                      <input
                        value={form.truongXa}
                        onChange={(e) => setF("truongXa", e.target.value)}
                        className={inputCls}
                        placeholder="Quận / Huyện..."
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* ── Giáo viên: Khối dạy & Môn dạy ── */}
              {user?.vaiTro === VaiTro.GV && (
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Khối dạy và môn dạy
                    </label>
                    <button
                      onClick={addRow}
                      className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                    >
                      <Plus className="size-3.5" />
                      Thêm
                    </button>
                  </div>

                  <div className="space-y-2">
                    {rows.length === 0 && (
                      <p className="text-sm italic text-slate-400">
                        Chưa có thông tin. Nhấn "+ Thêm" để thêm khối và môn
                        dạy.
                      </p>
                    )}

                    {rows.map((row, i) => (
                      <div key={i} className="flex items-center gap-2">
                        {/* Chọn khối */}
                        <div className="flex-1">
                          <Dropdown
                            title="Chọn khối"
                            options={khoiLopOptions}
                            selectedValue={row.khoiLop}
                            setSelectedValue={(opt) => handleSelectKhoi(i, opt)}
                          />
                        </div>

                        {/* Chọn môn (phụ thuộc khối) */}
                        <div className="flex-1">
                          <Dropdown
                            title={row.khoiLop ? "Chọn môn" : "Chọn khối trước"}
                            options={row.monHocOptions}
                            selectedValue={row.monHoc}
                            setSelectedValue={(opt) => handleSelectMon(i, opt)}
                          />
                        </div>

                        {/* Xóa row */}
                        <button
                          onClick={() => removeRow(i)}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Save button */}
              <div className="flex justify-end pt-2">
                <SaveBtn saving={saving} onClick={handleSaveGeneral} />
              </div>
            </div>
          )}

          {/* ════════ TAB: ĐỔI MẬT KHẨU ════════ */}
          {activeTab === "matkhau" && (
            <div className="max-w-md space-y-4">
              <h2 className="mb-5 text-base font-semibold text-slate-800 dark:text-slate-100">
                Đổi mật khẩu
              </h2>

              {(
                [
                  { label: "Mật khẩu hiện tại", key: "cu" },
                  { label: "Mật khẩu mới", key: "moi" },
                  { label: "Xác nhận mật khẩu mới", key: "xacNhan" },
                ] as { label: string; key: keyof typeof pw }[]
              ).map(({ label, key }) => (
                <Field key={key} label={label}>
                  <div className="relative">
                    <input
                      type={showPw[key] ? "text" : "password"}
                      value={pw[key]}
                      onChange={(e) =>
                        setPw((p) => ({ ...p, [key]: e.target.value }))
                      }
                      className={inputCls + " pr-10"}
                      placeholder={`Nhập ${label.toLowerCase()}...`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPw((s) => ({ ...s, [key]: !s[key] }))
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPw[key] ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                </Field>
              ))}

              <div className="flex justify-end pt-2">
                <SaveBtn saving={saving} onClick={handleSavePassword} />
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

// ─── Small helpers ────────────────────────────────────────
const inputCls =
  "w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100";

const readonlyCls =
  "w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-400 outline-none dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-500";

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div>
    <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
      {label}
    </label>
    {children}
  </div>
);

const SaveBtn = ({
  saving,
  onClick,
}: {
  saving: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    disabled={saving}
    className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
  >
    {saving ? (
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
    ) : (
      <Save className="size-4" />
    )}
    Cập nhật
  </button>
);

export default AccountPage;
