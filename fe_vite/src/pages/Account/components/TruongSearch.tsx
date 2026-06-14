import { Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import UserAPI from "../../../services/apis/userAPI";
import { inputCls } from "./FormHelpers";

interface TruongInfo {
  id?: number;
  ten: string;
  tinh?: string;
  xa?: string;
}

interface TruongSearchProps {
  truongTen: string;
  truongTinh: string;
  truongXa: string;
  setTruongTen: (v: string) => void;
  setTruongTinh: (v: string) => void;
  setTruongXa: (v: string) => void;
}

const TruongSearch = ({
  truongTen,
  truongTinh,
  truongXa,
  setTruongTen,
  setTruongTinh,
  setTruongXa,
}: TruongSearchProps) => {
  const [keyword, setKeyword] = useState(truongTen);
  const [results, setResults] = useState<TruongInfo[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [tuNhap, setTuNhap] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Sync keyword khi truongTen thay đổi từ bên ngoài (lần đầu load)
  useEffect(() => {
    if (truongTen && !keyword) setKeyword(truongTen);
  }, [truongTen]);

  useEffect(() => {
    if (!keyword.trim() || tuNhap) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearching(true);
      const res = await UserAPI.searchTruong(keyword);
      if (res?.status === 200) setResults(res.data);
      setSearching(false);
    }, 350);
    return () => clearTimeout(timer);
  }, [keyword, tuNhap]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node))
        setShowResults(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleChon = (t: TruongInfo) => {
    setKeyword(t.ten);
    setTruongTen(t.ten);
    setTruongTinh(t.tinh ?? "");
    setTruongXa(t.xa ?? "");
    setShowResults(false);
    setTuNhap(false);
  };

  const handleClear = () => {
    setKeyword("");
    setTruongTen("");
    setTruongTinh("");
    setTruongXa("");
  };

  const handleBatDauTuNhap = () => {
    setTuNhap(true);
    setShowResults(false);
    setKeyword("");
    handleClear();
  };

  if (tuNhap) {
    return (
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
          value={truongTen}
          onChange={(e) => setTruongTen(e.target.value)}
          className={inputCls}
          placeholder="Tên trường..."
          autoFocus
        />
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-2">
            <input
              value={truongTinh}
              onChange={(e) => setTruongTinh(e.target.value)}
              className={inputCls}
              placeholder="Tỉnh / Thành phố..."
            />
          </div>
          <input
            value={truongXa}
            onChange={(e) => setTruongXa(e.target.value)}
            className={inputCls}
            placeholder="Quận / Huyện..."
          />
        </div>
      </div>
    );
  }

  return (
    <div ref={wrapRef} className="relative">
      <div className="relative">
        <input
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => keyword && setShowResults(true)}
          className={inputCls}
          placeholder="Tìm tên trường..."
        />
        {searching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          </div>
        )}
      </div>

      {showResults && (results.length > 0 || keyword.length > 1) && (
        <div className="absolute z-30 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
          {results.length === 0 && !searching && (
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
          {results.map((t, i) => (
            <button
              key={t.id ?? i}
              onClick={() => handleChon(t)}
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
          {results.length > 0 && (
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

      {truongTen && (
        <div className="mt-2 flex items-center justify-between rounded-lg bg-blue-50 px-3 py-2 dark:bg-blue-900/20">
          <div>
            <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
              {truongTen}
            </p>
            {(truongTinh || truongXa) && (
              <p className="text-xs text-blue-500">
                {[truongXa, truongTinh].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>
          <button
            onClick={handleClear}
            className="text-blue-400 hover:text-blue-600"
          >
            <X className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default TruongSearch;
