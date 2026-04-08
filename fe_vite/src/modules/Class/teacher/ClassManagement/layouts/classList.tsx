import { useEffect, useState } from "react";
import { ChevronsDownUp, Search, Loader2, BookOpen } from "lucide-react";
// 🚀 SỬA ĐƯỜNG DẪN: Đi ra 5 cấp để tìm thấy thư mục services
import { classAPI } from "../../../../../services/apis/classAPI"; 

const ClassList = () => {
  const [classes, setClasses] = useState<any[]>([]); // Danh sách gốc từ Backend
  const [filteredClasses, setFilteredClasses] = useState<any[]>([]); // Danh sách sau khi lọc tìm kiếm
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Hàm lấy dữ liệu từ Backend
  const fetchClasses = async () => {
    try {
      setLoading(true);
      // 🚀 ĐỔI TÊN BIẾN: Dùng classAPI cho khớp với file services của bạn
      const res = await classAPI.getAllByTeacher(); 
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

  // 2. Tự động gọi khi load trang
  useEffect(() => {
    fetchClasses();
  }, []);

  // 3. Logic tìm kiếm khi gõ vào ô input
  useEffect(() => {
    const filtered = classes.filter((item) =>
      item.tenLop?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClasses(filtered);
  }, [searchTerm, classes]);

  return (
    <div className="flex flex-col gap-4">
      {/* Thanh tìm kiếm */}
      <div className="dark:bg-darkmode-600 rounded bg-white p-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="dark:bg-darkmode-800 w-full rounded-md border border-solid border-slate-200 px-2 py-2 pl-3 pr-10 text-sm shadow-sm focus:border-blue-400 focus:outline-none dark:border-none"
              placeholder="Tìm kiếm theo tên lớp..."
            />
            <Search className="absolute right-3 top-2.5 size-4 text-slate-600 dark:text-slate-300" />
          </div>
          <button 
            onClick={fetchClasses}
            className="p-2 hover:bg-slate-100 rounded-md transition-colors"
          >
            <ChevronsDownUp className="size-5 text-slate-600 dark:text-slate-300" />
          </button>
        </div>
      </div>

      {/* Danh sách lớp học */}
      <div className="grid grid-cols-1 gap-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 text-slate-500">
            <Loader2 className="animate-spin mb-2" />
            <p>Đang tải danh sách lớp...</p>
          </div>
        ) : filteredClasses.length > 0 ? (
          filteredClasses.map((item) => (
            <div 
              key={item.id}
              className="dark:bg-darkmode-600 flex items-center justify-between rounded bg-white p-4 shadow-sm hover:border-blue-400 border border-transparent transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                  <BookOpen className="text-blue-600 size-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-200">
                    {item.tenLop}
                  </h3>
                  <p className="text-xs text-slate-500">Năm học: {item.namHoc}</p>
                </div>
              </div>
              <div className="text-right text-xs text-slate-400">
                ID: {item.id}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 bg-white rounded dark:bg-darkmode-600 border border-dashed border-slate-300">
            <p className="text-slate-500 text-sm">Không tìm thấy lớp học nào.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassList;