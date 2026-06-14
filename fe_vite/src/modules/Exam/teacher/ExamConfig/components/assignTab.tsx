import { useState } from "react";
import { Search, Filter } from "lucide-react";
import type {
  De,
  LopHocRef,
} from "../../../../../share/interfaces/exam.interface";

interface AssignTabProps {
  de: De;
  tatCaLop: LopHocRef[]; // danh sách tất cả lớp GV có
  onToggleLop: (lopId: number) => void; // bật/tắt 1 lớp
}

const AssignTab: React.FC<AssignTabProps> = ({ de, tatCaLop, onToggleLop }) => {
  const [searchLeft, setSearchLeft] = useState("");
  const [searchRight, setSearchRight] = useState("");

  const assignedIds = de.cacLopDaGiao ?? [];

  const assignedLops = tatCaLop.filter((l) => assignedIds.includes(l.id));
  const filteredLeft = assignedLops.filter((l) =>
    l.tenLop.toLowerCase().includes(searchLeft.toLowerCase()),
  );
  const filteredRight = tatCaLop.filter((l) =>
    l.tenLop.toLowerCase().includes(searchRight.toLowerCase()),
  );

  return (
    <div>
      <div className="mb-3 text-sm font-medium">Giao cho lớp</div>

      <div className="flex gap-4" style={{ height: "380px" }}>
        {/* Panel trái – lớp đã giao */}
        <div className="w-52 flex-shrink-0 overflow-hidden rounded-md shadow dark:border dark:border-darkmode-400">
          {/* Search */}
          <div className="relative border-b border-gray-200 p-2 dark:border-darkmode-400">
            <input
              type="text"
              value={searchLeft}
              onChange={(e) => setSearchLeft(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm dark:border-none dark:bg-darkmode-800"
              placeholder="Tìm theo tên lớp"
            />
            <Search className="absolute right-4 top-3.5 size-4 text-slate-400" />
          </div>

          {/* Badge tổng */}
          <div className="m-2 rounded-md bg-blue-800 px-3 py-2 text-sm font-semibold text-white">
            Đã giao ({assignedIds.length}/{tatCaLop.length})
          </div>

          {/* Danh sách lớp đã chọn */}
          <div className="overflow-y-auto" style={{ maxHeight: "280px" }}>
            {filteredLeft.map((lop) => (
              <div
                key={lop.id}
                className="flex items-center gap-2 border-b border-gray-100 px-3 py-2 text-sm dark:border-darkmode-400"
              >
                <input
                  type="checkbox"
                  checked
                  onChange={() => onToggleLop(lop.id)}
                  className="size-4 accent-blue-700"
                />
                <div>
                  <div className="font-medium">{lop.tenLop}</div>
                  <div className="text-xs text-slate-400">{lop.maLop}</div>
                </div>
              </div>
            ))}

            {filteredLeft.length === 0 && (
              <div className="p-3 text-xs text-slate-400">
                Chưa giao lớp nào
              </div>
            )}
          </div>
        </div>

        {/* Panel phải – tất cả lớp */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-md border border-gray-300 shadow-sm dark:border-darkmode-400">
          {/* Toolbar */}
          <div className="flex items-center gap-2 border-b border-gray-200 bg-white p-2 dark:border-darkmode-400 dark:bg-darkmode-600">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchRight}
                onChange={(e) => setSearchRight(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm dark:border-none dark:bg-darkmode-800"
                placeholder="Tìm kiếm lớp"
              />
              <Search className="absolute right-2 top-2 size-4 text-slate-400" />
            </div>

            <button className="flex items-center gap-1.5 rounded-md border border-gray-300 px-2 py-1.5 text-xs font-medium text-gray-500 hover:bg-slate-100 dark:border-darkmode-400 dark:text-slate-400">
              <Filter className="size-3.5" />
              Bộ lọc
            </button>
          </div>

          {/* Danh sách tất cả lớp */}
          <div className="flex-1 overflow-y-auto">
            {filteredRight.map((lop) => {
              const checked = assignedIds.includes(lop.id);
              return (
                <div
                  key={lop.id}
                  className={`flex items-center gap-3 border-b border-gray-100 px-3 py-2.5 text-sm dark:border-darkmode-400 ${
                    checked ? "bg-blue-50 dark:bg-darkmode-500" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleLop(lop.id)}
                    className="size-4 accent-blue-700"
                  />
                  <div>
                    <div className="font-medium">{lop.tenLop}</div>
                    <div className="text-xs text-slate-400">
                      {lop.maLop}
                      {lop.namHoc ? ` · ${lop.namHoc}` : ""}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredRight.length === 0 && (
              <div className="p-4 text-xs text-slate-400">Không có lớp nào</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignTab;
