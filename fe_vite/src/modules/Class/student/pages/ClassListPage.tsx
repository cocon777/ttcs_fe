import { useNavigate } from "react-router-dom"; 
import { useEffect, useState } from "react";
// Đã xóa import { Link } đi vì không dùng nữa
import { classAPI } from "../../../../services/apis/classAPI";
import type { StudentClass } from "../../../../services/apis/classAPI";

const ClassListPage = () => {
  const [classList, setClassList] = useState<StudentClass[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 🚀 1. Khai báo navigate ở đây
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchClassList = async () => {
      try {
        setLoading(true);
        const res = await classAPI.getAllByTeacher(); 
        
        if (res.status === 200) {
          setClassList(res.data);
        }
      } catch (error) {
        console.error("Lỗi tải danh sách lớp:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClassList();
  }, []);

  return (
    <div className="w-full text-gray-800">
      <div className="mx-auto w-11/12 max-w-5xl py-8">
        <h1 className="mb-5 text-2xl font-semibold">Danh sách lớp học (Giáo viên)</h1>

        {loading ? (
          <div className="rounded-md bg-white p-4 text-sm text-gray-600 shadow-sm flex items-center gap-2">
            <span className="animate-pulse">Đang tải danh sách lớp...</span>
          </div>
        ) : classList.length === 0 ? (
          <div className="rounded-md bg-white p-4 text-sm text-gray-600 shadow-sm">
            Chưa có lớp học nào.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {classList.map((classItem) => (
              // 🚀 2. Thay <Link> thành <div> và dùng sự kiện onClick
              <div
                key={classItem.id}
                onClick={() => {
                  // 🚀 3. Kiểm tra xem Backend có trả về ID không
                  if (!classItem.id) {
                    alert("Lỗi: Backend không trả về ID của lớp này!");
                    console.log("Dữ liệu lớp bị lỗi:", classItem);
                    return;
                  }
                  // 🚀 4. Ép chuyển trang ngay lập tức
                  navigate(`/teacher/class/classroom-detail/${classItem.id}`);
                }}
                className="cursor-pointer rounded-md bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md border border-gray-100 block"
              >
                <h2 className="text-lg font-semibold text-slate-900">
                  Lớp {classItem.tenLop}
                </h2>
                
                <p className="mt-2 text-sm text-slate-600">
                  Mã lớp: {classItem.maLop || "Chưa cập nhật"}
                </p>
                
                <p className="mt-1 text-sm text-slate-600">
                  Năm học: {classItem.namHoc || "Chưa cập nhật"}
                </p>
                
                <p className="mt-1 text-sm text-slate-600">
                  Giáo viên ID: {classItem.giaoVien?.id || "Chưa có"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassListPage;