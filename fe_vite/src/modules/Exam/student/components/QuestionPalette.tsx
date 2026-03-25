interface QuestionPaletteProps {
  totalQuestions: number;
  currentQuestionNumber: number;
  answeredQuestions: Set<number>;
  flaggedQuestions: Set<number>;
  onSelectQuestion: (questionNumber: number) => void;
}

const QuestionPalette = ({
  totalQuestions,
  currentQuestionNumber,
  answeredQuestions,
  flaggedQuestions,
  onSelectQuestion,
}: QuestionPaletteProps) => {
  return (
    <aside className="border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-slate-900">
        Bảng câu hỏi
      </h3>
      <div className="mb-4 text-[11px] text-slate-500">
        <span className="font-semibold text-slate-700">
          {answeredQuestions.size}
        </span>
        /{totalQuestions} đã trả lời
      </div>

      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: totalQuestions }).map((_, index) => {
          const questionNumber = index + 1;
          const isCurrent = questionNumber === currentQuestionNumber;
          const isAnswered = answeredQuestions.has(questionNumber);
          const isFlagged = flaggedQuestions.has(questionNumber);

          return (
            <button
              type="button"
              key={questionNumber}
              onClick={() => onSelectQuestion(questionNumber)}
              className={`relative h-8 rounded-md text-xs font-semibold transition ${
                isAnswered
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300"
              } ${isCurrent ? "ring-2 ring-blue-300 ring-offset-1" : ""}`}
            >
              {questionNumber}
              {isFlagged ? (
                <span className="absolute right-0.5 top-0.5 size-1.5 rounded-full bg-red-500" />
              ) : null}
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default QuestionPalette;
