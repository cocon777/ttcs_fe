import { Eye, EyeOff } from "lucide-react";
import { Field, SaveBtn, inputCls } from "../components/FormHelpers";

interface PwState {
  cu: string;
  moi: string;
  xacNhan: string;
}

interface ShowPwState {
  cu: boolean;
  moi: boolean;
  xacNhan: boolean;
}

interface PasswordTabProps {
  pw: PwState;
  setPw: React.Dispatch<React.SetStateAction<PwState>>;
  showPw: ShowPwState;
  setShowPw: React.Dispatch<React.SetStateAction<ShowPwState>>;
  saving: boolean;
  onSave: () => void;
}

const PasswordTab = ({
  pw,
  setPw,
  showPw,
  setShowPw,
  saving,
  onSave,
}: PasswordTabProps) => (
  <div className="max-w-md space-y-4">
    <h2 className="mb-5 text-base font-semibold text-slate-800 dark:text-slate-100">
      Đổi mật khẩu
    </h2>

    {(
      [
        { label: "Mật khẩu hiện tại", key: "cu" },
        { label: "Mật khẩu mới", key: "moi" },
        { label: "Xác nhận mật khẩu mới", key: "xacNhan" },
      ] as { label: string; key: keyof PwState }[]
    ).map(({ label, key }) => (
      <Field key={key} label={label}>
        <div className="relative">
          <input
            type={showPw[key] ? "text" : "password"}
            value={pw[key]}
            onChange={(e) => setPw((p) => ({ ...p, [key]: e.target.value }))}
            className={inputCls + " pr-10"}
            placeholder={`Nhập ${label.toLowerCase()}...`}
          />
          <button
            type="button"
            onClick={() => setShowPw((s) => ({ ...s, [key]: !s[key] }))}
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
      <SaveBtn saving={saving} onClick={onSave} />
    </div>
  </div>
);

export default PasswordTab;
