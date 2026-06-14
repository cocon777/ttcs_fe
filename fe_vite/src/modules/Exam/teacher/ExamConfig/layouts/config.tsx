import { CircleAlert, History, Info } from "lucide-react";
import type {
  De,
  LopHocRef,
} from "../../../../../share/interfaces/exam.interface";
import AssignTab from "../components/assignTab";
import { CategoryForm } from "../../../../../share/components/CategoryForm/categoryForm";

interface ConfigProp {
  deConfig: De;
  tatCaLop: LopHocRef[];
  onToggleLop: (lopId: number) => void;
  handleChangeConfig: (name: string, newValue: any) => void;
}

const Config: React.FC<ConfigProp> = ({
  deConfig,
  tatCaLop,
  onToggleLop,
  handleChangeConfig,
}) => {
  const { tieuDe, thoiGian, gioiHanNop, khoiLopId, monHocId } = deConfig;

  return (
    <div className="rounded-md bg-white px-5 py-6 text-gray-800 shadow dark:bg-darkmode-600 dark:text-slate-300">
      <form action="">
        <div className="border-b border-gray-200 pb-4 text-base font-medium dark:border-darkmode-400">
          Cấu hình đề
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <div className="mb-2 font-medium">Tên đề thi</div>
            <input
              type="text"
              placeholder="Nhập tên đề thi ..."
              value={tieuDe}
              onChange={(e) => handleChangeConfig("tieuDe", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-none dark:bg-darkmode-800"
            />
          </div>

          <CategoryForm
            khoiLopId={khoiLopId}
            monHocId={monHocId}
            handleChangeConfig={handleChangeConfig}
          />

          <div className="grid grid-cols-12">
            <div className="col-span-12">
              <label
                htmlFor="exam-duration"
                className="mb-2 flex items-center gap-1 text-sm font-medium"
              >
                Thời gian làm bài (phút)
                <CircleAlert
                  strokeWidth={1.5}
                  className="size-4 text-gray-900 dark:text-slate-300"
                />
              </label>
            </div>

            <div className="col-span-12">
              <input
                type="text"
                id="exam-duration"
                value={thoiGian ?? ""}
                onChange={(e) => handleChangeConfig("thoiGian", e.target.value)}
                placeholder="Nhập thời gian ..."
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm dark:border-none dark:bg-darkmode-800"
              />
            </div>
            <div className="col-span-12 mt-1 text-xs text-slate-500">
              Đơn vị thời gian : phút
            </div>
          </div>

          <div className="grid grid-cols-12">
            <div className="col-span-12">
              <label
                htmlFor="exam-duration"
                className="mb-2 flex items-center gap-1 text-sm font-medium"
              >
                Giới hạn nộp (số lần)
                <CircleAlert
                  strokeWidth={1.5}
                  className="size-4 text-gray-900 dark:text-slate-300"
                />
              </label>
            </div>

            <div className="col-span-12">
              <input
                type="text"
                id="exam-submit-limit"
                value={gioiHanNop ?? ""}
                onChange={(e) =>
                  handleChangeConfig("gioiHanNop", e.target.value)
                }
                placeholder="Nhập giới hạn nộp ..."
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm dark:border-none dark:bg-darkmode-800"
              />
            </div>
            <div className="col-span-12 mt-1 text-xs text-slate-500">
              Nhập số lần học sinh có thể làm bài/nộp bài
            </div>
          </div>

          <div className="grid grid-cols-12 gap-x-3">
            <div className="col-span-12">
              <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                Thời gian giao đề
                <Info className="size-4 text-gray-800" strokeWidth={1.5} />
              </label>
            </div>

            <div className="relative col-span-5">
              <input
                type="datetime-local"
                value={deConfig.batDau?.slice(0, 16) ?? ""}
                onChange={(e) => handleChangeConfig("batDau", e.target.value)}
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm font-medium shadow-sm dark:border-none dark:bg-darkmode-800"
              />
            </div>

            <div className="relative col-span-5">
              <input
                type="datetime-local"
                value={deConfig.ketThuc?.slice(0, 16) ?? ""}
                onChange={(e) => handleChangeConfig("ketThuc", e.target.value)}
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm font-medium shadow-sm dark:border-none dark:bg-darkmode-800"
              />
            </div>

            <div className="col-span-2">
              <div
                onClick={() => {
                  handleChangeConfig("batDau", null);
                  handleChangeConfig("ketThuc", null);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-200 px-1 py-2 shadow-sm hover:cursor-pointer hover:bg-gray-100 dark:border-darkmode-400"
              >
                <History className="size-4 text-gray-500" strokeWidth={1.5} />
                <div className="text-sm font-semibold text-gray-500 dark:text-slate-300">
                  Đặt lại
                </div>
              </div>
            </div>
          </div>

          <AssignTab
            de={deConfig}
            tatCaLop={tatCaLop}
            onToggleLop={onToggleLop}
          />
        </div>
      </form>
    </div>
  );
};

export default Config;
