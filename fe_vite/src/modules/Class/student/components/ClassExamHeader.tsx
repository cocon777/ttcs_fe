import { Link } from "react-router-dom";
import type { StudentClass } from "../../../../services/apis/classAPI";

type ClassExamHeaderProps = {
  classItem: StudentClass;
};

const ClassExamHeader = ({ classItem }: ClassExamHeaderProps) => {
  return (
    <div className="mb-5 flex items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold">
          Danh sách đề - {classItem.tenLop}
        </h1>
        <p className="mt-1 text-sm text-slate-600">Mã lớp: {classItem.maLop}</p>
      </div>
      <Link
        to={`/student/classroom/${classItem.id}`}
        className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        Quay lại lớp
      </Link>
    </div>
  );
};

export default ClassExamHeader;
