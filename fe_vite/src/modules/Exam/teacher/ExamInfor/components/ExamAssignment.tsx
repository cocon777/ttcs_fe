import type { De } from "../../../../../share/interfaces/exam.interface";
import { useNavigate } from "react-router-dom";

interface ExamAssignmentSectionProps {
  de: De;
  setDe: React.Dispatch<React.SetStateAction<De>>;
}
import SectionBox from "./SectionBox";

const ExamAssignmentBox = ({ de }: { de: De }) => {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-12 gap-2">
      {de.giaoChoLop?.map((giaoChoLop, key) => (
        <div
          className="col-span-6 flex items-center justify-center cursor-pointer rounded-md border border-gray-300 py-2 hover:bg-blue-100"
          key={giaoChoLop.id}
          onClick={() =>
            navigate(
              `/teacher/class/${giaoChoLop?.lop?.id}/exam/${de.id}/detail`,
            )
          }
        >
          <div className="text-sm font-semibold text-gray-500">
            {giaoChoLop?.lop?.tenLop || ""}
          </div>
        </div>
      ))}
    </div>
  );
};

export const ExamAssignmentSection: React.FC<ExamAssignmentSectionProps> = (
  props,
) => {
  const { de } = props;

  const isEmpty = !de.giaoChoLop || de.giaoChoLop.length === 0;

  return (
    <SectionBox title="Giao cho lớp">
      <div className="flex items-center gap-3">
        {isEmpty && (
          <div className="text-xs italic text-gray-400">
            Chưa giao cho lớp nào
          </div>
        )}
      </div>

      {!isEmpty && <ExamAssignmentBox de={de} />}
    </SectionBox>
  );
};
