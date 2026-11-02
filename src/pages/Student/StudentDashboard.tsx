import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { dbService } from '../../services/dbService';
import {
  AccaPaper,
  QuestionAttempt,
  ExamAttempt,
  SavedQuestion,
  Topic,
} from '../../types';
import {
  LayoutDashboard,
  CheckCircle2,
  XCircle,
  Clock,
  Target,
  Bookmark,
  Award,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  PlayCircle,
  FileText,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const StudentDashboard: React.FC = () => {
  const { userProfile } = useAuth();
  const [papers, setPapers] = useState<AccaPaper[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [questionAttempts, setQuestionAttempts] = useState<QuestionAttempt[]>([]);
  const [examAttempts, setExamAttempts] = useState<ExamAttempt[]>([]);
  const [savedQuestions, setSavedQuestions] = useState<SavedQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!userProfile) return;
      try {
        const [allPapers, fa1Topics, qAttempts, eAttempts, saved] = await Promise.all([
          dbService.getPapers(),
          dbService.getTopics('fa1'),
          dbService.getUserQuestionAttempts(userProfile.uid),
          dbService.getUserExamAttempts(userProfile.uid),
          dbService.getSavedQuestions(userProfile.uid),
        ]);
        setPapers(allPapers);
        setTopics(fa1Topics);
        setQuestionAttempts(qAttempts);
        setExamAttempts(eAttempts);
        setSavedQuestions(saved);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [userProfile]);

  if (!userProfile) return null;

  // Real database metrics calculation
  const totalAttempted = questionAttempts.length;
  const correctCount = questionAttempts.filter((q) => q.isCorrect).length;
  const incorrectCount = totalAttempted - correctCount;
  const accuracy = totalAttempted > 0 ? Math.round((correctCount / totalAttempted) * 100) : 0;

  const completedExams = examAttempts.filter((e) => e.status === 'submitted');
  const avgExamScore =
    completedExams.length > 0
      ? Math.round(
          completedExams.reduce((acc, curr) => acc + curr.percentage, 0) / completedExams.length
        )
      : 0;

  // Find enrolled papers
  const enrolledPapers = papers.filter((p) =>
    userProfile.selectedPapers?.includes(p.id)
  );

  // Weak topics detection from question attempts
  const topicStats: Record<string, { total: number; correct: number }> = {};
  questionAttempts.forEach((att) => {
    if (!topicStats[att.topicId]) {
      topicStats[att.topicId] = { total: 0, correct: 0 };
    }
    topicStats[att.topicId].total += 1;
    if (att.isCorrect) topicStats[att.topicId].correct += 1;
  });

  const weakTopicIds = Object.keys(topicStats).filter((topicId) => {
    const stat = topicStats[topicId];
    return stat.total >= 2 && stat.correct / stat.total < 0.6;
  });

  const recommendedTopics = topics.filter((t) => weakTopicIds.includes(t.id));

  // Prepare chart data for exam progression
  const chartData = completedExams
    .slice(0, 7)
    .reverse()
    .map((attempt, index) => ({
      name: `Exam #${index + 1}`,
      score: attempt.percentage,
      date: new Date(attempt.startedAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      }),
    }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>ACCA Candidate Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {userProfile.displayName}!
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
            Track your verified CBE mock performance, review weak topic areas, and continue your daily
            exam preparation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/practice"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center gap-2"
          >
            <PlayCircle className="w-4 h-4" /> Start MCQ Practice
          </Link>
          <Link
            to="/exams"
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm rounded-xl border border-slate-700 transition flex items-center gap-2"
          >
            <Clock className="w-4 h-4" /> Launch Timed Mock
          </Link>
        </div>
      </div>

      {/* METRIC STATS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Questions Attempted</span>
            <Target className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalAttempted}</div>
          <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-1">
            <span className="text-emerald-600 font-bold">{correctCount} Correct</span> •{' '}
            <span className="text-red-500 font-bold">{incorrectCount} Incorrect</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Overall Accuracy</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{accuracy}%</div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
            <div
              className={`h-1.5 rounded-full ${accuracy >= 50 ? 'bg-emerald-500' : 'bg-amber-500'}`}
              style={{ width: `${Math.min(accuracy, 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Mocks Completed</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{completedExams.length}</div>
          <div className="text-xs text-slate-500 pt-1">
            Avg Score: <strong className="text-blue-600 font-bold">{avgExamScore}%</strong>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Saved Questions</span>
            <Bookmark className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{savedQuestions.length}</div>
          <div className="pt-1">
            <Link
              to="/saved-questions"
              className="text-xs text-purple-600 hover:text-purple-700 font-bold flex items-center gap-1"
            >
              Review Bookmarks <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* CHARTS & WEAK TOPICS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Score Progression Chart */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Mock Exam Score Progression</h3>
              <p className="text-xs text-slate-500">Historical percentage scores across timed simulations</p>
            </div>
            <Link
              to="/analytics"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Detailed Analytics <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="h-64 w-full pt-4">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                      <stop stopColor="#2563EB" stopOpacity={0.4} />
                      <stop stopColor="#2563EB" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748B' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#64748B' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      color: '#fff',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#2563EB"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#scoreColor)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Clock className="w-8 h-8 text-slate-400 mb-2" />
                <p className="text-sm font-semibold text-slate-700">No mock exams recorded yet</p>
                <p className="text-xs text-slate-500 max-w-xs mt-1">
                  Complete your first timed mock examination to generate score progression analytics.
                </p>
                <Link
                  to="/exams"
                  className="mt-3 px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl"
                >
                  Take FA1 Mock 1
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recommended & Weak Topics */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              <span>Target Revision Areas</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1">Recommended Topics</h3>
            <p className="text-xs text-slate-500">
              Topics where your accuracy is below 60% based on recent question attempts.
            </p>

            <div className="mt-4 space-y-3">
              {recommendedTopics.length > 0 ? (
                recommendedTopics.map((top) => (
                  <div
                    key={top.id}
                    className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between gap-3"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900 line-clamp-1">{top.name}</p>
                      <p className="text-[11px] text-amber-700 font-medium">Needs Attention</p>
                    </div>
                    <Link
                      to={`/practice?paper=fa1&topic=${top.id}`}
                      className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg shrink-0"
                    >
                      Drill Topic
                    </Link>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Strong Topic Mastery!
                  </p>
                  <p className="text-emerald-700">
                    No critical weak spots detected in recent attempts. Keep taking new questions to
                    maintain peak readiness!
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <Link
              to="/practice?mode=incorrect"
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              Practice Previously Missed Questions
            </Link>
          </div>
        </div>
      </div>

      {/* ENROLLED PAPERS SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Enrolled ACCA Papers</h2>
            <p className="text-xs text-slate-500">Fast access to your active examination syllabus tracks</p>
          </div>
          <Link
            to="/profile"
            className="text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            Manage Enrolled Papers
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledPapers.map((paper) => (
            <div
              key={paper.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 hover:border-blue-400 transition"
            >
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 font-extrabold text-sm rounded-lg border border-blue-100">
                  {paper.code}
                </span>
                <span className="text-xs text-slate-400 font-medium">{paper.level}</span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-base">{paper.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">{paper.shortDescription}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link
                  to={`/papers/${paper.id}`}
                  className="flex-1 py-2 text-center bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition"
                >
                  Paper Dashboard
                </Link>
                <Link
                  to={`/practice?paper=${paper.id}`}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition"
                >
                  Practice MCQs
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RECENT ACTIVITY & ATTEMPTS TABLE */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Examination Attempts</h2>
            <p className="text-xs text-slate-500">Real database records of your completed CBE mock tests</p>
          </div>
          <Link
            to="/exams"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            New Mock Exam <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {examAttempts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[11px]">
                  <th className="py-3 px-3">Examination</th>
                  <th className="py-3 px-3">Paper</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Score</th>
                  <th className="py-3 px-3">Result</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {examAttempts.map((attempt) => (
                  <tr key={attempt.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-3 font-bold text-slate-900">{attempt.examTitle}</td>
                    <td className="py-3.5 px-3 uppercase font-semibold text-blue-600">
                      {attempt.paperId}
                    </td>
                    <td className="py-3.5 px-3 text-slate-500">
                      {new Date(attempt.startedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-slate-800">
                      {attempt.obtainedMarks} / {attempt.totalMarks} ({attempt.percentage}%)
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          attempt.isPassed
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {attempt.isPassed ? 'PASSED' : 'FAILED'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <Link
                        to={`/exams/results/${attempt.id}`}
                        className="font-bold text-blue-600 hover:text-blue-700 text-xs"
                      >
                        Review Diagnostic
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-slate-500 text-sm">
            No mock examination attempts found yet. Select a paper and take your first CBE test!
          </div>
        )}
      </div>
    </div>
  );
};
