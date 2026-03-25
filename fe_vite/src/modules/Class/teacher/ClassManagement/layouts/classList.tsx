import { ChevronsDownUp, Search } from "lucide-react";

const ClassList = () => {
  return (
    <div className="dark:bg-darkmode-600 rounded bg-white p-3">
      <div className="flex items-center">
        <div className="relative flex-1">
          <input
            type="text"
            className="dark:bg-darkmode-800 w-full rounded-md border border-solid border-slate-200 px-2 py-2 text-sm shadow-sm dark:border-none"
            placeholder="Tìm kiếm theo tên lớp"
          />
          <Search className="absolute right-3 top-2.5 size-4 text-slate-600 dark:text-slate-300" />
        </div>
        <ChevronsDownUp className="text-slate-600 dark:text-slate-300" />
      </div>
    </div>
  );
};

export default ClassList;
