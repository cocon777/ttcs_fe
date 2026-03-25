import QuestionBox from "../components/QuestionBox";
import SetPointsButton from "../components/SetPointsButton";
import ExamInformation from "../components/ExamInformation";
import GoToQuestionButton from "../components/GoToQuestion";
import { type NoiDungDe } from "../utils/formatExam";

interface PreviewLeftProps {
  de: NoiDungDe;
  setDe: React.Dispatch<React.SetStateAction<NoiDungDe>>;
  handleGoToLine: (line: number) => void;
}

const PreviewLeft: React.FC<PreviewLeftProps> = (props) => {
  const { de, setDe, handleGoToLine } = props;

  return (
    <div className="relative col-span-6">
      <div className="sticky top-0 z-10 flex items-center justify-end gap-2 bg-white px-2 dark:bg-darkmode-600 dark:text-slate-300">
        <SetPointsButton de={de} setDe={setDe} />
        <ExamInformation de={de} />
        <GoToQuestionButton de={de} />
      </div>

      <div
        className="overflow-y-scroll px-3 py-5"
        style={{ height: "calc(100vh - 80px)" }}
      >
        <div className="space-y-3">
          {de &&
            Object.keys(de.cauHois).map((cauHoiKey) => {
              const { dong } = de.cauHois[cauHoiKey];
              return (
                <QuestionBox
                  key={cauHoiKey}
                  cauHoiKey={cauHoiKey}
                  de={de}
                  setDe={setDe}
                  handleGoToLine={() => handleGoToLine(dong)}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default PreviewLeft;
