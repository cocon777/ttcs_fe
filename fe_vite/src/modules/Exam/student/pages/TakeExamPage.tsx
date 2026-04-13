import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import QuestionPalette from "../components/QuestionPalette";
import TakeExamHeader from "../components/TakeExamHeader";
import TakeExamLoading from "../components/TakeExamLoading";
import TakeExamError from "../components/TakeExamError";
import QuestionList from "../components/QuestionList";
import examAPI from "../../../../services/apis/examAPI";
import UserAPI from "../../../../services/apis/userAPI";
import type { ExamData } from "../../../../services/apis/examAPI";

const getExamStartStorageKey = (examId: string) =>
  `student.exam.startAt.${examId}`;
const resultClassMapStorageKey = "student.result.classMap";

const cacheResultClassId = (ketQuaId: number, classId: string) => {
  try {
    const raw = localStorage.getItem(resultClassMapStorageKey);
    const map = raw ? (JSON.parse(raw) as Record<string, string>) : {};
    map[String(ketQuaId)] = classId;
    localStorage.setItem(resultClassMapStorageKey, JSON.stringify(map));
  } catch (error) {
    console.error("Error caching result class id:", error);
  }
};

const getOrCreateExamStartAt = (examId: string): number => {
  const key = getExamStartStorageKey(examId);
  const raw = localStorage.getItem(key);
  const parsed = Number(raw);
  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }

  const now = Date.now();
  localStorage.setItem(key, String(now));
  return now;
};

const TakeExamPage = () => {
  const navigate = useNavigate();
  const { examId } = useParams<{ examId: string }>();
  const [searchParams] = useSearchParams();
  const classId = searchParams.get("classId");

  const [examData, setExamData] = useState<ExamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [studentName, setStudentName] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [examStartedAt, setExamStartedAt] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
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
    const fetchStudentName = async () => {
      const response = await UserAPI.getInfo();
      const ten = response?.data?.ten;
      if (typeof ten === "string" && ten.trim()) {
        setStudentName(ten);
      }
    };

    fetchStudentName();
  }, []);

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
        setError("Không tải được đề thi. Hãy kiểm tra backend.");
        setLoading(false);
        return;
      }

      setExamData(data);
      setExamStartedAt(getOrCreateExamStartAt(examId));
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
    if (!examData || submitting) {
      return;
    }

    try {
      setSubmitting(true);
      const startedAt = examStartedAt ?? getOrCreateExamStartAt(examData.id);
      const durationSecondsUsed = Math.max(
        0,
        Math.floor((Date.now() - startedAt) / 1000),
      );
      const ketQua = await examAPI.submitExam({
        examId: examData.id,
        answers,
        questions: examData.questions,
        durationSecondsUsed,
        startedAtMs: startedAt,
        flaggedQuestionIds: Array.from(flaggedQuestionIds),
      });

      localStorage.removeItem(getExamStartStorageKey(examData.id));

      if (ketQua?.ketQuaId) {
        if (classId) {
          cacheResultClassId(ketQua.ketQuaId, classId);
        }

        navigate(
          classId
            ? `/student/results/${ketQua.ketQuaId}?classId=${encodeURIComponent(classId)}`
            : `/student/results/${ketQua.ketQuaId}`,
        );
        return;
      }

      alert("Nộp bài thành công");
      navigate("/student");
    } catch (submitError) {
      console.error(submitError);
      alert("Nộp bài thất bại");
    } finally {
      setSubmitting(false);
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

  const elapsedSeconds = examStartedAt
    ? Math.floor((Date.now() - examStartedAt) / 1000)
    : 0;
  const remainingSeconds = Math.max(
    examData.durationSeconds - elapsedSeconds,
    0,
  );

  return (
    <div className="grid h-screen grid-rows-[auto_1fr] bg-slate-50">
      <TakeExamHeader
        title={examData.title}
        studentName={studentName || "Không có dữ liệu"}
        durationSeconds={remainingSeconds}
        onTimeUp={handleSubmit}
        onSubmit={handleSubmit}
        submitting={submitting}
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
