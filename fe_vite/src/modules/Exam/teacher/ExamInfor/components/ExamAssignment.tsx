import type { De } from "../../../../../share/interfaces/exam.interface";

interface ExamAssignmentSectionProps {
  de: De;
  setDe: React.Dispatch<React.SetStateAction<De>>;
}

const ExamAssignmentBox = ({ de }: { de: De }) => {
  return (
    <div className="grid grid-cols-12 gap-2">
      {de.giaoChoLop?.map((giaoChoLop, key) => (
        <div
          className="col-span-6 flex items-center justify-center rounded-md border border-gray-300 py-2"
          key={giaoChoLop.id}
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
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <div className="text-sm font-semibold">Giao cho lớp:</div>

        {isEmpty && (
          <div className="text-xs italic text-gray-400">
            Chưa giao cho lớp nào
          </div>
        )}
      </div>

      {!isEmpty && <ExamAssignmentBox de={de} />}
    </div>
  );
};
