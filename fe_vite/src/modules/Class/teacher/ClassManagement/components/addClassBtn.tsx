import { PlusIcon } from "lucide-react";
import { useState, Fragment } from "react";
import { ClassroomAPI } from "../../../../../services/apis/classroomAPI";

const AddClassBtn = () => {
  const [isOpenAdd, setOpenAdd] = useState<boolean>(false);

  const [values, setValues] = useState({
    className: "",
    classYear: "",
    classGroupId: -2,
  });

  const handleToggleAdd = () => {
    setOpenAdd(() => !isOpenAdd);
  };

  const handleChangeValue = (name: string, newValue: string | number) => {
    setValues((preValue) => ({ ...preValue, [name]: newValue }));
  };

  const handleSubmit = async () => {
    const { className, classYear } = values;
    const response: any = await ClassroomAPI.create(className, classYear);
    const data = response.data;
    handleChangeValue("className", "");
  };

  const handleSubmitAndClose = async () => {
    await handleSubmit();

    setOpenAdd(false);
  };

  return (
    <Fragment>
      <div
        onClick={() => setOpenAdd(true)}
        className="flex h-10 items-center gap-2 rounded-md bg-blue-800 px-4 shadow-md hover:cursor-pointer hover:bg-blue-700"
      >
        <PlusIcon className="size-4 text-white" />
        <span className="text-sm font-bold text-white">Tạo lớp học</span>
      </div>
      {isOpenAdd && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setOpenAdd(false)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmitAndClose}
            className="w-[550px] rounded-md bg-white shadow dark:bg-darkmode-600 dark:text-slate-300"
          >
            <div className="border-b border-gray-200 p-3 text-sm font-semibold dark:border-darkmode-400">
              Thêm lớp học
            </div>

            <div className="space-y-2 px-5 py-2">
              <div className="space-y-1.5">
                <label htmlFor="className" className="text-sm">
                  Tên lớp
                </label>
                <input
                  id="className"
                  value={values["className"]}
                  name="className"
                  onChange={(e) =>
                    handleChangeValue(e.target.name, e.target.value)
                  }
                  type="text"
                  className="w-full rounded-md border border-slate-300 px-4 py-2.5 text-sm shadow-sm dark:border-none dark:bg-darkmode-800"
                  placeholder="Nhập tên lớp"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="className" className="text-sm">
                  Năm học
                </label>
                <input
                  id="classYear"
                  value={values["classYear"]}
                  name="classYear"
                  onChange={(e) =>
                    handleChangeValue(e.target.name, e.target.value)
                  }
                  type="text"
                  className="w-full rounded-md border border-slate-300 px-4 py-2.5 text-sm shadow-sm dark:border-none dark:bg-darkmode-800"
                  placeholder="Nhập năm học"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 p-3">
              <div
                className="rounded-md bg-gray-200 px-8 py-2.5 hover:cursor-pointer hover:bg-gray-100 dark:bg-darkmode-400 dark:hover:bg-darkmode-300"
                onClick={handleToggleAdd}
              >
                <div className="text-sm font-semibold text-gray-500 dark:text-slate-200">
                  Hủy
                </div>
              </div>

              <button
                type="button"
                className="rounded-md bg-blue-800 px-8 py-2.5 hover:cursor-pointer hover:bg-blue-700 disabled:cursor-default disabled:opacity-25 disabled:hover:bg-blue-800"
                onClick={handleSubmit}
                disabled={!(values["className"] && values["classYear"])}
              >
                <div className="text-sm font-semibold text-white">Lưu</div>
              </button>

              <button
                type="submit"
                className="rounded-md bg-cyan-600 px-4 py-2.5 hover:cursor-pointer hover:bg-cyan-500 disabled:cursor-default disabled:opacity-25 disabled:hover:bg-cyan-600"
                disabled={!(values["className"] && values["classYear"])}
                onClick={handleSubmitAndClose}
              >
                <div className="text-sm font-semibold text-white">
                  Lưu và đóng
                </div>
              </button>
            </div>
          </form>
        </div>
      )}
    </Fragment>
  );
};

export default AddClassBtn;
