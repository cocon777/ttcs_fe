export const inputCls =
  "w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100";

export const readonlyCls =
  "w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-400 outline-none dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-500";

export const Field = ({
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

export const SaveBtn = ({
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
      // Save icon inline để tránh thêm import
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="size-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
        <polyline points="17 21 17 13 7 13 7 21" />
        <polyline points="7 3 7 8 15 8" />
      </svg>
    )}
    Cập nhật
  </button>
);
