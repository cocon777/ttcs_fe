import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import classAPI from "../../../../services/apis/classAPI";
import type { StudentClass } from "../../../../services/apis/classAPI";

const ClassListPage = () => {
  const [classList, setClassList] = useState<StudentClass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClassList = async () => {
      setLoading(true);
      const data = await classAPI.getClassList();
      setClassList(data);
      setLoading(false);
    };

    fetchClassList();
  }, []);

  return (
    <div className="w-full text-gray-800">
      <div className="mx-auto w-11/12 max-w-5xl py-8">
        <h1 className="mb-5 text-2xl font-semibold">Danh sach lop hoc</h1>

        {loading ? (
          <div className="rounded-md bg-white p-4 text-sm text-gray-600 shadow-sm">
            Dang tai danh sach lop...
          </div>
        ) : classList.length === 0 ? (
          <div className="rounded-md bg-white p-4 text-sm text-gray-600 shadow-sm">
            Chua co lop hoc nao.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {classList.map((classItem) => (
              <Link
                key={classItem.id}
                to={`/student/classroom/${classItem.id}`}
                className="rounded-md bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
              >
                <h2 className="text-lg font-semibold text-slate-900">
                  {classItem.name}
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Ma lop: {classItem.maLop}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Nam hoc: {classItem.namHoc ?? "Chua cap nhat"}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Giao vien ID: {classItem.giaoVienId}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassListPage;
