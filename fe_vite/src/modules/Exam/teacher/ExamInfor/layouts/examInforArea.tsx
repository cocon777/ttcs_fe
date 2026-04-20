import ExamMenu from "../components/ExamMenu";
import { ExamGeneral } from "../components/ExamGeneral";
import { ExamAssignmentSection } from "../components/ExamAssignment";
import { ExamContent } from "../components/ExamContent";
import type { De } from "../../../../../share/interfaces/exam.interface";

interface ExamInfoAreaProps {
  de: De;
  setDe: React.Dispatch<React.SetStateAction<De>>;
}

const ExamInfoArea: React.FC<ExamInfoAreaProps> = (props) => {
  const { de, setDe } = props;

  return (
    <div className="grid grid-cols-2 gap-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
      <div className="space-y-6">
        <ExamGeneral de={de} />
        <ExamContent />
      </div>

      <div className="space-y-6">
        <ExamMenu />
        <ExamAssignmentSection de={de} setDe={setDe} />
      </div>
    </div>
  );
};

export default ExamInfoArea;
