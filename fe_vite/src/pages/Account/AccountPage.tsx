import { useState, useEffect } from "react";
import axiosInstance from "../../services/axiosInstance";
import UserAPI from "../../services/apis/userAPI";
import GradeAPI from "../../services/apis/gradeAPI";
import SubjectAPI from "../../services/apis/subjectAPI";
import type { NguoiDung } from "../../share/interfaces/user.interface";
import type { KhoiLop, MonHoc } from "../../share/interfaces/infor.interface";
import { VaiTro, GioiTinh } from "../../share/constant/constant";
import {
  uploadToCloudinary,
  CloudinaryUploadError,
} from "../../share/utils/uploadToCloudinary";
import GeneralTab from "./layouts/GeneralTab";
import PasswordTab from "./layouts/PasswordTab";
import type { DayHocRow } from "./components/DayHocRows";
import toast from "react-hot-toast";

interface DropOpt {
  name: string;
  value: number;
}

interface FormState {
  ten: string;
  soDienThoai: string;
  ngaySinh: string;
  gioiTinh: GioiTinh;
  truongTen: string;
  truongTinh: string;
  truongXa: string;
}

type ActiveTab = "chung" | "matkhau";

const AccountPage = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("chung");
  const [user, setUser] = useState<NguoiDung | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<FormState>({
    ten: "",
    soDienThoai: "",
    ngaySinh: "",
    gioiTinh: GioiTinh.NAM,
    truongTen: "",
    truongTinh: "",
    truongXa: "",
  });

  const [rows, setRows] = useState<DayHocRow[]>([]);
  const [khoiLopOptions, setKhoiLopOptions] = useState<DropOpt[]>([]);

  const [pw, setPw] = useState({ cu: "", moi: "", xacNhan: "" });
  const [showPw, setShowPw] = useState({
    cu: false,
    moi: false,
    xacNhan: false,
  });

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  // Load dữ liêu
  useEffect(() => {
    (async () => {
      const res = await UserAPI.getInfo();
      if (res?.status === 200) {
        const u: NguoiDung = res.data;
        setUser(u);

        const getTruong = (role: "gv" | "hs", field: "ten" | "tinh" | "xa") => {
          const src =
            role === "gv"
              ? (u as any).giaoVien?.truong
              : (u as any).hocSinh?.truong;
          return src?.[field] ?? "";
        };

        const isGV = u.vaiTro === VaiTro.GV;
        setForm({
          ten: u.ten || "",
          soDienThoai: u.soDienThoai || "",
          ngaySinh: u.ngaySinh ? String(u.ngaySinh).substring(0, 10) : "",
          gioiTinh: u.gioiTinh || GioiTinh.NAM,
          truongTen: getTruong(isGV ? "gv" : "hs", "ten"),
          truongTinh: getTruong(isGV ? "gv" : "hs", "tinh"),
          truongXa: getTruong(isGV ? "gv" : "hs", "xa"),
        });

        if (isGV) {
          const [gradesRes, monHocRes] = await Promise.all([
            GradeAPI.getAll(),
            axiosInstance.get("users/giao-vien/mon-hoc"),
          ]);

          let khoiOpts: DropOpt[] = [];
          if (gradesRes?.status === 200) {
            khoiOpts = gradesRes.data.map((kl: KhoiLop) => ({
              name: kl.ten,
              value: kl.id,
            }));
            setKhoiLopOptions(khoiOpts);
          }

          if (monHocRes?.data?.length > 0) {
            const loadedRows: DayHocRow[] = await Promise.all(
              monHocRes.data.map(async (item: any) => {
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

  const setF = (key: keyof FormState, val: any) =>
    setForm((f) => ({ ...f, [key]: val }));

  //  Avatar
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadProgress(0);
    try {
      const result = await uploadToCloudinary(file, (p) =>
        setUploadProgress(p),
      );
      setAvatarUrl(result.secure_url);
      toast.success("Tải ảnh lên thành công!");
    } catch (err) {
      toast.error(
        err instanceof CloudinaryUploadError
          ? err.message
          : "Lỗi khi tải ảnh lên!",
      );
    }
    setUploading(false);
  };

  //  Save general
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
        if (user?.vaiTro === VaiTro.GV) {
          const monHocIds = rows
            .filter((r) => r.monHoc !== null)
            .map((r) => r.monHoc!.value);
          await axiosInstance.put("users/giao-vien/mon-hoc", monHocIds);
        }
        toast.success("Cập nhật thành công!");
      }
    } catch {
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
    setSaving(false);
  };

  //  Save password
  const handleSavePassword = async () => {
    if (!pw.cu || !pw.moi) return toast.error("Vui lòng điền đầy đủ!");
    if (pw.moi !== pw.xacNhan)
      return toast.error("Mật khẩu xác nhận không khớp!");
    setSaving(true);
    try {
      await axiosInstance.put("users/me/password", {
        matKhauCu: pw.cu,
        matKhauMoi: pw.moi,
      });
      toast.success("Đổi mật khẩu thành công!");
      setPw({ cu: "", moi: "", xacNhan: "" });
    } catch {
      toast.error("Mật khẩu hiện tại không đúng!");
    }
    setSaving(false);
  };

  //  Teacher Teaching rows
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

  //  Render
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

      <div className="flex gap-5">
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

        <section className="flex-1 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
          {activeTab === "chung" && (
            <GeneralTab
              user={user}
              form={form}
              setF={setF}
              saving={saving}
              avatarUrl={avatarUrl}
              uploading={uploading}
              uploadProgress={uploadProgress}
              onAvatarChange={handleAvatarChange}
              rows={rows}
              khoiLopOptions={khoiLopOptions}
              onAddRow={addRow}
              onRemoveRow={removeRow}
              onSelectKhoi={handleSelectKhoi}
              onSelectMon={handleSelectMon}
              onSave={handleSaveGeneral}
              onToast={(msg) => showToast(true, msg)}
            />
          )}

          {activeTab === "matkhau" && (
            <PasswordTab
              pw={pw}
              setPw={setPw}
              showPw={showPw}
              setShowPw={setShowPw}
              saving={saving}
              onSave={handleSavePassword}
            />
          )}
        </section>
      </div>
    </div>
  );
};

export default AccountPage;
