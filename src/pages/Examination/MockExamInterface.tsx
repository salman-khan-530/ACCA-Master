import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dbService } from '../../services/dbService';
import { useAuth } from '../../contexts/AuthContext';
import { MockExam, Question, ExamAttempt } from '../../types';
import {
  Clock,
  Flag,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldAlert,
  Send,
  Loader2,
} from 'lucide-react';

export const MockExamInterface: React.FC = () => {
  const { mockId } = useParams<{ mockId: string }>();
  const navigate = useNavigate();
  const { userProfile } = useAuth();

  const [mockExam, setMockExam] = useState<MockExam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Student exam answers: map questionId -> selectedOptionId
  const [answers, setAnswers] = useState<Record<string, string>>({});
  // Questions flagged for review
  const [markedForReview, setMarkedForReview] = useState<string[]>([]);

  // Timer state
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  const [examAttemptId, setExamAttemptId] = useState<string>(
    `exam-att-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
  );
  const [startTime] = useState<number>(Date.now());

  // Modal and submission state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const timerRef = useRef<any>(null);

  useEffect(() => {
    const initExam = async () => {
      if (!mockId) return;
      try {
        const exam = await dbService.getMockExamById(mockId);
        if (!exam) {
          navigate('/exams');
          return;
        }
        setMockExam(exam);

        // Fetch questions for this mock exam
        const allQuestions = await dbService.getQuestions(exam.paperId);
        let examQuestions: Question[] = [];

        if (exam.questionIds && exam.questionIds.length > 0) {
          const qMap = new Map(allQuestions.map((q) => [q.id, q]));
          examQuestions = exam.questionIds
            .map((id) => qMap.get(id))
            .filter((q): q is Question => Boolean(q));
        }

        // If not enough mapped, fill with paper questions
        if (examQuestions.length === 0) {
          examQuestions = allQuestions.slice(0, exam.totalQuestions);
        }

        setQuestions(examQuestions);
        setSecondsRemaining(exam.durationMinutes * 60);
      } finally {
        setLoading(false);
      }
    };
    initExam();
  }, [mockId, navigate]);

  // Live Timer Countdown
  useEffect(() => {
    if (loading || secondsRemaining <= 0 || isSubmitting) return;

    timerRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleFinalSubmit(true); // Auto-submit on timer expiry!
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loading, isSubmitting]);

  const formatTimer = (totalSecs: number) => {
    const hours = Math.floor(totalSecs / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const seconds = totalSecs % 60;
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optionId: string) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  };

  const handleToggleReview = () => {
    if (!currentQuestion) return;
    setMarkedForReview((prev) =>
      prev.includes(currentQuestion.id)
        ? prev.filter((id) => id !== currentQuestion.id)
        : [...prev, currentQuestion.id]
    );
  };

  const handleFinalSubmit = async (isAutoSubmit = false) => {
    if (isSubmitting || !mockExam) return;
    setIsSubmitting(true);

    try {
      if (timerRef.current) clearInterval(timerRef.current);

      const timeSpentSeconds = Math.max(1, Math.round((Date.now() - startTime) / 1000));

      // Calculate score securely
      let obtainedMarks = 0;
      let totalExamMarks = 0;

      questions.forEach((q) => {
        const studentAns = answers[q.id];
        totalExamMarks += q.marks;
        if (studentAns && studentAns === q.correctOptionId) {
          obtainedMarks += q.marks;
        }
      });

      const percentage =
        totalExamMarks > 0 ? Math.round((obtainedMarks / totalExamMarks) * 100) : 0;
      const isPassed = percentage >= mockExam.passPercentage;

      const attemptRecord: ExamAttempt = {
        id: examAttemptId,
        userId: userProfile?.uid || 'guest-student',
        mockExamId: mockExam.id,
        paperId: mockExam.paperId,
        examTitle: mockExam.title,
        startedAt: new Date(startTime).toISOString(),
        submittedAt: new Date().toISOString(),
        durationMinutes: mockExam.durationMinutes,
        timeSpentSeconds,
        totalQuestions: questions.length,
        totalMarks: totalExamMarks,
        obtainedMarks,
        percentage,
        isPassed,
        answers,
        markedForReview,
        status: isAutoSubmit ? 'timed_out' : 'submitted',
      };

      await dbService.recordExamAttempt(attemptRecord);
      navigate(`/exams/results/${examAttemptId}`, { replace: true });
    } catch (err) {
      console.error('Error submitting exam attempt:', err);
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-2" />
        <p className="ml-3 font-semibold">Configuring Computer Based Examination environment...</p>
      </div>
    );
  }

  if (!mockExam || questions.length === 0) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Exam Data Unavailable</h2>
        <p className="text-xs text-slate-600">
          The selected mock examination does not contain question allocations.
        </p>
        <button
          onClick={() => navigate('/exams')}
          className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-xs"
        >
          Return to Exam Directory
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = questions.length - answeredCount;
  const isCurrentFlagged = markedForReview.includes(currentQuestion?.id);
  const isTimeCritical = secondsRemaining <= 300; // < 5 mins

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* EXAM SYSTEM TOP BAR */}
      <header className="sticky top-0 z-30 bg-slate-900 text-white px-4 sm:px-8 py-3.5 shadow-md flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 bg-blue-600 text-white font-black text-xs rounded-lg uppercase tracking-wider">
            {mockExam.paperId} CBE
          </span>
          <div>
            <h1 className="text-xs sm:text-sm font-bold text-slate-100 truncate max-w-xs sm:max-w-md">
              {mockExam.title}
            </h1>
            <p className="text-[10px] text-slate-400">
              Pass Mark: {mockExam.passPercentage}% • {questions.length} Total Questions
            </p>
          </div>
        </div>

        {/* Live Countdown Timer Badge */}
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-sm sm:text-base border transition ${
              isTimeCritical
                ? 'bg-red-950 text-red-400 border-red-600 animate-pulse'
                : 'bg-slate-800 text-blue-300 border-slate-700'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{formatTimer(secondsRemaining)}</span>
          </div>

          <button
            onClick={() => setShowConfirmModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" /> Submit Exam
          </button>
        </div>
      </header>

      {/* EXAM MAIN BODY */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Current Question Area (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
            {/* Question Top Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-blue-600 text-sm">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span className="text-slate-400 font-semibold">• {currentQuestion.marks} Marks</span>
              </div>

              <button
                type="button"
                onClick={handleToggleReview}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  isCurrentFlagged
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Flag className={`w-3.5 h-3.5 ${isCurrentFlagged ? 'fill-current' : ''}`} />
                {isCurrentFlagged ? 'Marked for Review' : 'Mark for Review'}
              </button>
            </div>

            {/* Question Text */}
            <div className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed min-h-[60px]">
              {currentQuestion.text}
            </div>

            {/* Configurable 4 Answer Options */}
            <div className="space-y-3 pt-2">
              {currentQuestion.options.map((option) => {
                const isSelected = answers[currentQuestion.id] === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleSelectOption(option.id)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all duration-150 flex items-start gap-3.5 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/90 text-blue-950 ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:border-blue-300 bg-white text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 transition ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {option.id}
                    </div>
                    <div className="text-sm font-medium leading-relaxed flex-1 mt-0.5">
                      {option.text}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Question Step Navigation */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl disabled:opacity-30 transition flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <button
                type="button"
                onClick={() =>
                  setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))
                }
                disabled={currentIndex === questions.length - 1}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl disabled:opacity-30 transition flex items-center gap-1.5 shadow-xs"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Question Navigation Matrix (1 col) */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Examination Matrix
              </h3>
              <span className="text-[11px] font-bold text-slate-500">
                {answeredCount} / {questions.length} Answered
              </span>
            </div>

            {/* Matrix Status Legend */}
            <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 pb-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                <span>Unanswered ({unansweredCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>Flagged ({markedForReview.length})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <span>Current</span>
              </div>
            </div>

            {/* Matrix of Buttons */}
            <div className="grid grid-cols-5 gap-2 max-h-[360px] overflow-y-auto pr-1">
              {questions.map((q, idx) => {
                const isAnswered = Boolean(answers[q.id]);
                const isFlagged = markedForReview.includes(q.id);
                const isCurrent = idx === currentIndex;

                let btnStyle = 'bg-slate-100 text-slate-700 hover:bg-slate-200';
                if (isAnswered) {
                  btnStyle = 'bg-emerald-600 text-white font-bold';
                }
                if (isFlagged) {
                  btnStyle = 'bg-amber-400 text-amber-950 font-bold';
                }
                if (isCurrent) {
                  btnStyle += ' ring-2 ring-blue-600 ring-offset-2';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-9 rounded-xl text-xs font-bold transition flex items-center justify-center relative ${btnStyle}`}
                  >
                    {idx + 1}
                    {isFlagged && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-950 absolute top-1 right-1" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowConfirmModal(true)}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Submit Examination
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CONFIRMATION MODAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5 border border-slate-100">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Confirm Exam Submission?</h3>
              <p className="text-xs text-slate-500">
                Are you ready to submit your test for scoring? Once submitted, you cannot change your
                answers.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Total Questions:</span>
                <strong className="text-slate-900">{questions.length}</strong>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Answered:</span>
                <strong>{answeredCount}</strong>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Unanswered:</span>
                <strong>{unansweredCount}</strong>
              </div>
              <div className="flex justify-between text-amber-700">
                <span>Flagged for Review:</span>
                <strong>{markedForReview.length}</strong>
              </div>
              <div className="flex justify-between text-blue-700 pt-1 border-t border-slate-200">
                <span>Time Remaining:</span>
                <strong>{formatTimer(secondsRemaining)}</strong>
              </div>
            </div>

            {unansweredCount > 0 && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>You still have {unansweredCount} unanswered questions!</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
              >
                Return to Exam
              </button>
              <button
                type="button"
                onClick={() => handleFinalSubmit(false)}
                disabled={isSubmitting}
                className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50"
              >
                {isSubmitting ? 'Grading...' : 'Yes, Submit Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
