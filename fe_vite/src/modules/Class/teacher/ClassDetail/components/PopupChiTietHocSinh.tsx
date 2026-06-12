import { X } from "lucide-react";

interface PopupChiTietHocSinhProps {
  student: any;
  onClose: () => void;
}

const PopupChiTietHocSinh: React.FC<PopupChiTietHocSinhProps> = ({
  student,
  onClose,
}) => {
  const nd = student.nguoiDung ?? {};
  const truong = student.truong;

  const rows: { label: string; value: string | undefined }[] = [
    {
      label: "Họ và tên",
      value: [nd.ho, nd.tenDem, nd.ten].filter(Boolean).join(" ") || nd.ten,
    },
    { label: "Mã học sinh", value: student.maHS },
    { label: "Email", value: nd.email },
    { label: "Số điện thoại", value: nd.soDienThoai },
    {
      label: "Ngày sinh",
      value: nd.ngaySinh
        ? new Date(nd.ngaySinh).toLocaleDateString("vi-VN")
        : undefined,
    },
    { label: "Giới tính", value: nd.gioiTinh },
    {
      label: "Trường",
      value: truong
        ? [truong.ten, truong.xa, truong.tinh].filter(Boolean).join(", ")
        : undefined,
    },
    {
      label: "Ngày tham gia hệ thống",
      value: nd.createdAt
        ? new Date(nd.createdAt).toLocaleDateString("vi-VN")
        : undefined,
    },
    {
      label: "Ngày vào lớp",
      value: student.createdAt
        ? new Date(student.createdAt).toLocaleDateString("vi-VN")
        : undefined,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h3 className="text-base font-bold text-slate-800">
            Thông tin học sinh
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-slate-200 transition-colors"
          >
            <X className="size-4 text-slate-500" />
          </button>
        </div>

        {/* Avatar + tên */}
        <div className="flex flex-col items-center gap-2 pt-6 pb-4 px-6">
          <div className="size-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-3xl overflow-hidden shrink-0">
            {nd.anhDaiDien ? (
              <img src={nd.anhDaiDien} className="size-20 object-cover" />
            ) : (
              (nd.ten ?? "?").charAt(0).toUpperCase()
            )}
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-slate-800">
              {[nd.ho, nd.tenDem, nd.ten].filter(Boolean).join(" ") ||
                nd.ten ||
                "—"}
            </div>
            <span className="inline-block mt-1 bg-blue-100 text-blue-700 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full">
              {student.maHS}
            </span>
          </div>
        </div>

        {/* Các trường thông tin */}
        <div className="px-6 pb-6 space-y-2 max-h-72 overflow-y-auto">
          {rows.map(({ label, value }) =>
            value ? (
              <div
                key={label}
                className="flex items-start justify-between gap-4 py-2 border-b border-slate-50 last:border-0"
              >
                <span className="text-xs text-slate-400 shrink-0 w-40">
                  {label}
                </span>
                <span className="text-sm text-slate-700 font-medium text-right break-all">
                  {value}
                </span>
              </div>
            ) : null,
          )}
        </div>
      </div>
    </div>
  );
};

export default PopupChiTietHocSinh;
