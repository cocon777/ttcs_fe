import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import classAPI from "../../../../services/apis/classAPI";
import type { StudentClass } from "../../../../services/apis/classAPI";

const ClassLectureListPage = () => {
  const { classId } = useParams<{ classId: string }>();
  const [classItem, setClassItem] = useState<StudentClass | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClassDetail = async () => {
      if (!classId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const data = await classAPI.getClassById(classId);
      setClassItem(data);
      setLoading(false);
    };

    fetchClassDetail();
  }, [classId]);

  if (loading) {
    return (
      <div className="w-full text-gray-800">
        <div className="mx-auto w-11/12 max-w-4xl py-8">
          <div className="rounded-md bg-white p-5 text-sm text-slate-600 shadow-sm">
            Dang tai thong tin lop hoc...
          </div>
        </div>
      </div>
    );
  }

  if (!classItem) {
    return (
      <div className="w-full text-gray-800">
        <div className="mx-auto w-11/12 max-w-4xl py-8">
          <div className="rounded-md bg-white p-5 text-sm text-slate-600 shadow-sm">
            Khong tim thay lop hoc.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full text-gray-800">
      <div className="mx-auto w-11/12 max-w-4xl py-8">
        <h1 className="mb-4 text-2xl font-semibold">
          Danh sach bai giang - {classItem.name}
        </h1>
        <div className="rounded-md bg-white p-5 text-sm text-slate-600 shadow-sm">
          Phan bai giang chua can lam, se bo sung sau theo yeu cau cua ban.
        </div>
        <div className="mt-4">
          <Link
            to={`/student/classroom/${classItem.id}`}
            className="inline-flex rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Quay lai trang lop
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ClassLectureListPage;
