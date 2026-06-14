import { Plus, X } from "lucide-react";
import Dropdown from "../../../share/components/DropDown/dropDown";


interface DropOpt {
  name: string;
  value: number;
}

export interface DayHocRow {
  khoiLop: DropOpt | null;
  monHoc: DropOpt | null;
  monHocOptions: DropOpt[];
}

interface DayHocRowsProps {
  rows: DayHocRow[];
  khoiLopOptions: DropOpt[];
  onAddRow: () => void;
  onRemoveRow: (i: number) => void;
  onSelectKhoi: (i: number, opt: DropOpt | null) => void;
  onSelectMon: (i: number, opt: DropOpt | null) => void;
}

const DayHocRows = ({
  rows,
  khoiLopOptions,
  onAddRow,
  onRemoveRow,
  onSelectKhoi,
  onSelectMon,
}: DayHocRowsProps) => (
  <div>
    <div className="mb-2 flex items-center justify-between">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
        Khối dạy và môn dạy
      </label>
      <button
        onClick={onAddRow}
        className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
      >
        <Plus className="size-3.5" />
        Thêm
      </button>
    </div>

    <div className="space-y-2">
      {rows.length === 0 && (
        <p className="text-sm italic text-slate-400">
          Chưa có thông tin. Nhấn "+ Thêm" để thêm khối và môn dạy.
        </p>
      )}
      {rows.map((row, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="flex-1">
            <Dropdown
              title="Chọn khối"
              options={khoiLopOptions}
              selectedValue={row.khoiLop}
              setSelectedValue={(opt) => onSelectKhoi(i, opt)}
            />
          </div>
          <div className="flex-1">
            <Dropdown
              title={row.khoiLop ? "Chọn môn" : "Chọn khối trước"}
              options={row.monHocOptions}
              selectedValue={row.monHoc}
              setSelectedValue={(opt) => onSelectMon(i, opt)}
            />
          </div>
          <button
            onClick={() => onRemoveRow(i)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
          >
            <X className="size-4" />
          </button>
        </div>
      ))}
    </div>
  </div>
);

export default DayHocRows;
