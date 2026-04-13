import { useEffect, useState } from "react";
import { Search, Loader2, BookOpen, User } from "lucide-react";
import { useNavigate } from "react-router";
import { classAPI } from "../../../../services/apis/classAPI";

const StudentClassList = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const res = await classAPI.getAllByStudent();
      if (res.status === 200) {
        setClasses(res.data);
        setFilteredClasses(res.data);
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách lớp:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    const filtered = classes.filter((item) =>
      item.tenLop?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredClasses(filtered);
  }, [searchTerm, classes]);

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded bg-white p-3 shadow-sm dark:bg-darkmode-600">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-slate-200 py-2 pl-3 pr-10 text-sm shadow-sm focus:border-blue-400 focus:outline-none dark:border-none dark:bg-darkmode-800"
            placeholder="Tìm kiếm theo tên lớp..."
          />
          <Search className="absolute right-3 top-2.5 size-4 text-slate-400" />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <Loader2 className="mb-2 animate-spin" />
          <p className="text-sm">Đang tải danh sách lớp...</p>
        </div>
      ) : filteredClasses.length > 0 ? (
        <div className="grid grid-cols-4 gap-4">
          {filteredClasses.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/student/classroom/${item.id}`)}
              className="group flex cursor-pointer flex-col gap-2 rounded-xl border border-transparent bg-white p-3 shadow-sm transition-all hover:border-blue-400 hover:shadow-md dark:bg-darkmode-600"
            >
              <div className="flex items-start justify-between">
                <div className="rounded-lg bg-blue-50 p-2.5 dark:bg-blue-900/30">
                  <BookOpen className="size-5 text-blue-600 dark:text-blue-400" />
                </div>

                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-400 dark:bg-darkmode-400">
                  #{item.maLop}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="rounded-full bg-amber-50 p-1 dark:bg-amber-900/30">
                  <User className="size-3.5 text-amber-600 dark:text-amber-400" />
                </div>
                <span className=" text-slate-500 ">
                  Giáo viên : {item.giaoVien?.hoTen ?? "—"}
                </span>
              </div>
              <div className="border-t border-slate-100 dark:border-darkmode-400" />

              <div>
                <h3 className="font-bold text-slate-800 group-hover:text-blue-600 dark:text-slate-200 dark:group-hover:text-blue-400">
                  {item.tenLop}
                </h3>
                <p className="mt-0.5 text-xs text-slate-400">{item.namHoc}</p>
              </div>

              <div className="border-t border-slate-100 dark:border-darkmode-400" />

              <div className="flex items-center gap-2">
                <span className="rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                  {item.khoiLop?.ten ?? "—"}
                </span>
                <span className="rounded-md bg-cyan-50 px-2 py-1 text-xs font-medium text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400">
                  {item.monHoc?.ten ?? "—"}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center dark:border-darkmode-400 dark:bg-darkmode-600">
          <BookOpen className="mx-auto mb-2 size-8 text-slate-300" />
          <p className="text-sm text-slate-400">Không tìm thấy lớp học nào.</p>
        </div>
      )}
    </div>
  );
};

export default StudentClassList;
