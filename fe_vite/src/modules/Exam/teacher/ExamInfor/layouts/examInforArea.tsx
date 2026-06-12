import ExamMenu from "../components/ExamMenu";
import { ExamGeneral } from "../components/ExamGeneral";
import { ExamAssignmentSection } from "../components/ExamAssignment";
import { ExamContent } from "../components/ExamContent";
import type { De } from "../../../../../share/interfaces/exam.interface";
import SectionBox from "../components/SectionBox";
interface ExamInfoAreaProps {
  de: De;
  setDe: React.Dispatch<React.SetStateAction<De>>;
}

const ExamInfoArea: React.FC<ExamInfoAreaProps> = ({ de, setDe }) => {
  return (
    <div className=" rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
      <SectionBox
        title={de.tieuDe}
        titleClassName="text-xl font-bold"
        className="grid grid-cols-[40%_60%] gap-2"
      >
        <div className="space-y-6">
          <ExamGeneral de={de} />
        </div>

        <div className="space-y-6">
          <ExamContent />
          <ExamMenu tieuDe={de?.tieuDe ?? ""} />
          <ExamAssignmentSection de={de} setDe={setDe} />
        </div>
      </SectionBox>
    </div>
  );
};

export default ExamInfoArea;
