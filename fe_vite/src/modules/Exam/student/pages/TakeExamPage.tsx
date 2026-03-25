import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import QuestionPalette from "../components/QuestionPalette";
import TakeExamHeader from "../components/TakeExamHeader";
import TakeExamLoading from "../components/TakeExamLoading";
import TakeExamError from "../components/TakeExamError";
import QuestionList from "../components/QuestionList";
import examAPI from "../../../../services/apis/examAPI";
import type { ExamData } from "../../../../services/apis/examAPI";

const TakeExamPage = () => {
  const navigate = useNavigate();
  const { examId } = useParams<{ examId: string }>();

  const [examData, setExamData] = useState<ExamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestionIds, setFlaggedQuestionIds] = useState<Set<string>>(
    new Set(),
  );

  const questionNumberById = useMemo(() => {
    if (!examData) return new Map<string, number>();
    return new Map(
      examData.questions.map((question, index) => [question.id, index + 1]),
    );
  }, [examData]);

  const answeredQuestionNumbers = useMemo(
    () =>
      new Set(
        Object.keys(answers)
          .map((id) => questionNumberById.get(id) ?? 0)
          .filter((questionNumber) => questionNumber > 0),
      ),
    [answers, questionNumberById],
  );

  const flaggedQuestionNumbers = useMemo(
    () =>
      new Set(
        Array.from(flaggedQuestionIds)
          .map((id) => questionNumberById.get(id) ?? 0)
          .filter((questionNumber) => questionNumber > 0),
      ),
    [flaggedQuestionIds, questionNumberById],
  );

  useEffect(() => {
    const fetchExam = async () => {
      if (!examId) {
        setError("Missing exam id");
        setLoading(false);
        return;
      }

      setLoading(true);
      const data = await examAPI.getExamById(examId);

      if (!data) {
        setError("Khong tai duoc de thi. Hay kiem tra backend.");
        setLoading(false);
        return;
      }

      setExamData(data);
      setError(null);
      setLoading(false);
    };

    fetchExam();
  }, [examId]);

  const handleSelectOption = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleToggleFlag = (questionId: string) => {
    setFlaggedQuestionIds((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  };

  const handleJumpToQuestion = (questionId: string) => {
    const element = document.getElementById(`question-${questionId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSubmit = async () => {
    if (!examData) {
      return;
    }

    try {
      await examAPI.submitExam({
        examId: examData.id,
        answers,
        flaggedQuestionIds: Array.from(flaggedQuestionIds),
      });
      alert("Nop bai thanh cong");
      navigate("/student");
    } catch (submitError) {
      console.error(submitError);
      alert("Nop bai that bai");
    }
  };

  if (loading) {
    return <TakeExamLoading />;
  }

  if (error || !examData || !examData.questions.length) {
    return (
      <TakeExamError
        error={error}
        onBack={() => navigate("/student")}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="grid h-screen grid-rows-[auto_1fr] bg-slate-50">
      <TakeExamHeader
        title={examData.title}
        studentName={examData.studentName}
        durationSeconds={examData.durationSeconds}
        onTimeUp={handleSubmit}
        onSubmit={handleSubmit}
      />

      {/* Main Content */}
      <div className="grid grid-cols-[200px_1fr] gap-0 overflow-hidden">
        {/* Question Palette */}
        <div className="border-r border-slate-200 overflow-y-auto bg-white">
          <QuestionPalette
            totalQuestions={examData.questions.length}
            currentQuestionNumber={0}
            answeredQuestions={answeredQuestionNumbers}
            flaggedQuestions={flaggedQuestionNumbers}
            onSelectQuestion={(questionNumber) => {
              const questionId = examData.questions[questionNumber - 1]?.id;
              if (questionId) {
                handleJumpToQuestion(questionId);
              }
            }}
          />
        </div>

        {/* Questions Area */}
        <main className="overflow-y-auto p-6 bg-slate-50">
          <QuestionList
            questions={examData.questions}
            answers={answers}
            flaggedQuestionIds={flaggedQuestionIds}
            onSelectOption={handleSelectOption}
            onToggleFlag={handleToggleFlag}
          />
        </main>
      </div>
    </div>
  );
};

export default TakeExamPage;
