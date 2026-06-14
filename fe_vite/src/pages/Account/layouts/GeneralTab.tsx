import type { NguoiDung } from "../../../share/interfaces/user.interface";
import { VaiTro, GioiTinh } from "../../../share/constant/constant";
import AvatarUpload from "../components/AvatarUpload";
import StudentCodeCard from "../components/StudentCodeCard";
import TruongSearch from "../components/TruongSearch";
import DayHocRows, { type DayHocRow } from "../components/DayHocRows";
import {
  Field,
  SaveBtn,
  inputCls,
  readonlyCls,
} from "../components/FormHelpers";

const GIOITINH_LIST = [GioiTinh.NAM, GioiTinh.NU, GioiTinh.KHAC];

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

interface GeneralTabProps {
  user: NguoiDung | null;
  form: FormState;
  setF: (key: keyof FormState, val: any) => void;
  saving: boolean;
  avatarUrl: string | null;
  uploading: boolean;
  uploadProgress: number;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  rows: DayHocRow[];
  khoiLopOptions: DropOpt[];
  onAddRow: () => void;
  onRemoveRow: (i: number) => void;
  onSelectKhoi: (i: number, opt: DropOpt | null) => void;
  onSelectMon: (i: number, opt: DropOpt | null) => void;
  onSave: () => void;
}

const GeneralTab = ({
  user,
  form,
  setF,
  saving,
  avatarUrl,
  uploading,
  uploadProgress,
  onAvatarChange,
  rows,
  khoiLopOptions,
  onAddRow,
  onRemoveRow,
  onSelectKhoi,
  onSelectMon,
  onSave,
}: GeneralTabProps) => {
  const initial = user?.ten
    ? user.ten.trim().split(" ").pop()![0].toUpperCase()
    : "?";

  return (
    <div className="space-y-6">
      {/* Avatar */}
      <AvatarUpload
        avatarUrl={avatarUrl}
        existingAvatar={user?.anhDaiDien}
        initial={initial}
        uploading={uploading}
        uploadProgress={uploadProgress}
        onFileChange={onAvatarChange}
      />

      {/* Mã học sinh */}
      {user?.vaiTro === VaiTro.HS && (
        <StudentCodeCard maHS={(user as any).hocSinh?.maHS} />
      )}

      {/* Grid thông tin */}
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

        <Field label="Ngày sinh">
          <input
            type="date"
            value={form.ngaySinh}
            onChange={(e) => setF("ngaySinh", e.target.value)}
            className={inputCls}
          />
        </Field>

        <Field label="Email">
          <input value={user?.email || ""} readOnly className={readonlyCls} />
        </Field>

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

      {/* Trường */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Thông tin trường
        </label>
        <TruongSearch
          truongTen={form.truongTen}
          truongTinh={form.truongTinh}
          truongXa={form.truongXa}
          setTruongTen={(v) => setF("truongTen", v)}
          setTruongTinh={(v) => setF("truongTinh", v)}
          setTruongXa={(v) => setF("truongXa", v)}
        />
      </div>

      {user?.vaiTro === VaiTro.GV && (
        <DayHocRows
          rows={rows}
          khoiLopOptions={khoiLopOptions}
          onAddRow={onAddRow}
          onRemoveRow={onRemoveRow}
          onSelectKhoi={onSelectKhoi}
          onSelectMon={onSelectMon}
        />
      )}

      <div className="flex justify-end pt-2">
        <SaveBtn saving={saving} onClick={onSave} />
      </div>
    </div>
  );
};

export default GeneralTab;
