import { Link } from "react-router-dom";
import type { ExamListItem } from "../../../../services/apis/examAPI";

type ClassExamCardProps = {
  exam: ExamListItem;
};

const ClassExamCard = ({ exam }: ClassExamCardProps) => {
  return (
    <div className="rounded-md bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">{exam.title}</h2>
      <p className="mt-2 text-sm text-slate-600">
        So cau: {exam.questions.length}
      </p>
      <p className="mt-1 text-sm text-slate-600">
        Thoi gian: {Math.floor(exam.durationSeconds / 60)} phut
      </p>

      <div className="mt-4">
        <Link
          to={`/student/take-exam/${exam.id}`}
          className="inline-flex rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
        >
          Vao lam bai
        </Link>
      </div>
    </div>
  );
};

export default ClassExamCard;
