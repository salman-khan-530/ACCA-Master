import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dbService } from '../../services/dbService';
import { ExamAttempt, Question, AccaPaper } from '../../types';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  RotateCcw,
  BookOpen,
  HelpCircle,
  Bookmark,
  Share2,
  Sparkles,
} from 'lucide-react';

export const ExamResults: React.FC = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [paper, setPaper] = useState<AccaPaper | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'correct' | 'incorrect' | 'unanswered'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResults = async () => {
      if (!attemptId) return;
      try {
        const att = await dbService.getExamAttemptById(attemptId);
        if (!att) return;
        setAttempt(att);

        const [p, qList] = await Promise.all([
          dbService.getPaperById(att.paperId),
          dbService.getQuestions(att.paperId),
        ]);
        setPaper(p || null);
        setQuestions(qList);

        // If passed, trigger celebratory confetti!
        if (att.isPassed) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      } finally {
        setLoading(false);
      }
    };
    loadResults();
  }, [attemptId]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-slate-500 font-semibold animate-pulse">Computing diagnostic score breakdown...</p>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4">
        <HelpCircle className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Attempt Record Not Found</h2>
        <p className="text-xs text-slate-500">
          We could not locate this examination attempt record.
        </p>
        <Link
          to="/exams"
          className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-xs"
        >
          Return to Mock Exams
        </Link>
      </div>
    );
  }

  // Calculate detailed counts
  const totalQ = attempt.totalQuestions;
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;

  // Match exam questions
  const examQuestions = questions.filter((q) =>
    attempt.answers[q.id] !== undefined || true
  ).slice(0, totalQ);

  examQuestions.forEach((q) => {
    const studentChoice = attempt.answers[q.id];
    if (!studentChoice) {
      unansweredCount++;
    } else if (studentChoice === q.correctOptionId) {
      correctCount++;
    } else {
      incorrectCount++;
    }
  });

  const minutesTaken = Math.floor(attempt.timeSpentSeconds / 60);
  const secondsTaken = attempt.timeSpentSeconds % 60;

  const filteredReviewQuestions = examQuestions.filter((q) => {
    const studentChoice = attempt.answers[q.id];
    if (activeFilter === 'correct') return studentChoice === q.correctOptionId;
    if (activeFilter === 'incorrect') return studentChoice && studentChoice !== q.correctOptionId;
    if (activeFilter === 'unanswered') return !studentChoice;
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Result Hero Header */}
      <div
        className={`rounded-3xl p-8 sm:p-12 text-white shadow-xl space-y-6 text-center ${
          attempt.isPassed
            ? 'bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-950'
            : 'bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950'
        }`}
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 backdrop-blur-xs">
          {attempt.paperId.toUpperCase()} CBE Simulation
        </div>

        <div className="space-y-2">
          <div className="flex justify-center">
            {attempt.isPassed ? (
              <span className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-500 text-white font-black text-sm rounded-2xl shadow-lg">
                <CheckCircle2 className="w-5 h-5" /> PASSED EXAMINATION
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 px-5 py-2 bg-red-600 text-white font-black text-sm rounded-2xl shadow-lg">
                <XCircle className="w-5 h-5" /> FAILED (Pass Mark: 50%)
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mt-2">
            {attempt.obtainedMarks} / {attempt.totalMarks} Marks
          </h1>
          <p className="text-xl font-bold text-slate-200">{attempt.percentage}% Overall Score</p>
          <p className="text-xs text-slate-300 max-w-md mx-auto pt-1">
            {attempt.examTitle} • Completed on {new Date(attempt.submittedAt || '').toLocaleString()}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to={`/exams/take/${attempt.mockExamId}`}
            className="px-6 py-2.5 bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Retake Examination
          </Link>
          <Link
            to="/dashboard"
            className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl backdrop-blur-xs transition flex items-center gap-2"
          >
            Return to Dashboard <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* METRIC BREAKDOWN CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Correct</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{correctCount}</div>
          <div className="text-xs text-slate-500">
            Earned {attempt.obtainedMarks} marks
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Incorrect</span>
            <XCircle className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-black text-red-500">{incorrectCount}</div>
          <div className="text-xs text-slate-500">Lost marks</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Unanswered</span>
            <HelpCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-500">{unansweredCount}</div>
          <div className="text-xs text-slate-500">Skipped or timed out</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Time Taken</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {minutesTaken}m {secondsTaken}s
          </div>
          <div className="text-xs text-slate-500">of {attempt.durationMinutes}m allotted</div>
        </div>
      </div>

      {/* QUESTION BY QUESTION DIAGNOSTIC REVIEW */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Question-by-Question Review</h2>
            <p className="text-xs text-slate-500">
              Analyze your responses against authentic accounting solutions and syllabus guides
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                activeFilter === 'all' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              All ({examQuestions.length})
            </button>
            <button
              onClick={() => setActiveFilter('correct')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                activeFilter === 'correct' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              Correct ({correctCount})
            </button>
            <button
              onClick={() => setActiveFilter('incorrect')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                activeFilter === 'incorrect' ? 'bg-white text-red-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              Incorrect ({incorrectCount})
            </button>
            <button
              onClick={() => setActiveFilter('unanswered')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                activeFilter === 'unanswered' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              Unanswered ({unansweredCount})
            </button>
          </div>
        </div>

        {/* Questions Review List */}
        <div className="space-y-6">
          {filteredReviewQuestions.map((q, idx) => {
            const studentChoice = attempt.answers[q.id];
            const isCorrect = studentChoice === q.correctOptionId;
            const isUnanswered = !studentChoice;

            return (
              <div
                key={q.id}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">Question #{idx + 1}</span>
                    <span className="text-slate-400">• {q.marks} Marks</span>
                  </div>

                  <div>
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Correct
                      </span>
                    ) : isUnanswered ? (
                      <span className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                        <HelpCircle className="w-3.5 h-3.5 text-amber-600" /> Unanswered
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                        <XCircle className="w-3.5 h-3.5 text-red-600" /> Incorrect
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-base font-bold text-slate-900 leading-relaxed">
                  {q.text}
                </div>

                {/* Options Review */}
                <div className="space-y-2 pt-1">
                  {q.options.map((opt) => {
                    const isChosen = studentChoice === opt.id;
                    const isTheCorrectKey = opt.id === q.correctOptionId;

                    let optBg = 'bg-slate-50 border-slate-200 text-slate-600';
                    if (isTheCorrectKey) {
                      optBg = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold ring-1 ring-emerald-500';
                    } else if (isChosen && !isTheCorrectKey) {
                      optBg = 'bg-red-50 border-red-400 text-red-950 font-semibold ring-1 ring-red-400';
                    }

                    return (
                      <div
                        key={opt.id}
                        className={`p-3.5 rounded-xl border text-xs sm:text-sm flex items-start gap-3 ${optBg}`}
                      >
                        <span className="w-6 h-6 rounded-lg bg-white/80 font-bold flex items-center justify-center shrink-0 text-xs border border-slate-200">
                          {opt.id}
                        </span>
                        <div className="flex-1 mt-0.5">{opt.text}</div>

                        {isTheCorrectKey && (
                          <span className="text-[11px] font-bold text-emerald-700 bg-white/90 px-2 py-0.5 rounded-md border border-emerald-300">
                            Correct Key
                          </span>
                        )}
                        {isChosen && !isTheCorrectKey && (
                          <span className="text-[11px] font-bold text-red-700 bg-white/90 px-2 py-0.5 rounded-md border border-red-300">
                            Your Choice
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanatory Teaching Notes */}
                <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-100 text-xs sm:text-sm text-blue-950 space-y-1.5">
                  <p className="font-bold text-blue-900">Teaching Explanation:</p>
                  <p className="leading-relaxed">{q.explanation}</p>
                  {q.syllabusReference && (
                    <p className="text-[11px] text-blue-700/80 font-medium pt-1">
                      {q.syllabusReference}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
