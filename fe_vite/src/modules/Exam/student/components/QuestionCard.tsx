import type { ExamQuestion } from "../../../../services/apis/examAPI";
interface QuestionCardProps {
  question: ExamQuestion;
  questionNumber: number;
  totalQuestions: number;
  selectedOptionId?: string;
  flagged: boolean;
  onSelectOption: (questionId: string, optionId: string) => void;
  onToggleFlag: (questionId: string) => void;
}

const QuestionCard = ({
  question,
  questionNumber,
  totalQuestions,
  selectedOptionId,
  flagged,
  onSelectOption,
  onToggleFlag,
}: QuestionCardProps) => {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Câu {questionNumber}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onToggleFlag(question.id)}
          className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
            flagged
              ? "border border-yellow-300 bg-yellow-100 text-yellow-700"
              : "border border-slate-300 text-slate-600 hover:border-slate-400 hover:text-slate-700"
          }`}
        >
          {flagged ? "Flagged" : "Mark"}
        </button>
      </div>

      <p className="mb-5 text-base leading-relaxed text-slate-800">
        {question.text}
      </p>

      <div className="grid grid-cols-2 gap-3">
        {question.options.map((option, optionIndex) => {
          const active = selectedOptionId === option.id;

          return (
            <button
              type="button"
              key={option.id}
              onClick={() => onSelectOption(question.id, option.id)}
              className={`rounded-md border-2 p-4 text-left transition ${
                active
                  ? "border-blue-600 bg-blue-50"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="flex items-start gap-2">
                <span
                  className={`inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold ${
                    active
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-300 bg-white text-slate-700"
                  }`}
                >
                  {String.fromCharCode(65 + optionIndex)}
                </span>
                <span className="flex-1 text-sm text-slate-800">
                  {option.text}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default QuestionCard;
