import { Link } from "react-router-dom";
import type { ExamListItem } from "../../../../services/apis/examAPI";

type ClassExamCardProps = {
  exam: ExamListItem;
  classId?: string;
};

const ClassExamCard = ({ exam, classId }: ClassExamCardProps) => {
  const previewPath = classId
    ? `/student/exams/${exam.id}?classId=${encodeURIComponent(classId)}`
    : `/student/exams/${exam.id}`;

  return (
    <div className="rounded-md bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">{exam.title}</h2>
      {/* <p className="mt-2 text-sm text-slate-600">
        Số câu: {exam.questions.length}
      </p> */}
      <p className="mt-1 text-sm text-slate-600">
        Thời gian: {Math.floor(exam.durationSeconds / 60)} phút
      </p>

      <div className="mt-4">
        <Link
          to={previewPath}
          className="inline-flex rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
        >
          Vào Làm
        </Link>
      </div>
    </div>
  );
};

export default ClassExamCard;
