import QuestionCard from "./QuestionCard";
import type { ExamQuestion } from "../../../../services/apis/examAPI";

interface QuestionListProps {
  questions: ExamQuestion[];
  answers: Record<string, string>;
  flaggedQuestionIds: Set<string>;
  onSelectOption: (questionId: string, optionId: string) => void;
  onToggleFlag: (questionId: string) => void;
}

const QuestionList = ({
  questions,
  answers,
  flaggedQuestionIds,
  onSelectOption,
  onToggleFlag,
}: QuestionListProps) => {
  return (
    <div className="space-y-6">
      {questions.map((question, index) => (
        <div
          key={question.id}
          id={`question-${question.id}`}
          className="scroll-mt-6"
        >
          <QuestionCard
            question={question}
            questionNumber={index + 1}
            totalQuestions={questions.length}
            selectedOptionId={answers[question.id]}
            flagged={flaggedQuestionIds.has(question.id)}
            onSelectOption={onSelectOption}
            onToggleFlag={onToggleFlag}
          />
        </div>
      ))}
    </div>
  );
};

export default QuestionList;
