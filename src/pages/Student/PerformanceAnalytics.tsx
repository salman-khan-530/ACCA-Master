import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { dbService } from '../../services/dbService';
import { QuestionAttempt, ExamAttempt, AccaPaper, Topic } from '../../types';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  Award,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  BookOpen,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const PerformanceAnalytics: React.FC = () => {
  const { userProfile } = useAuth();
  const [questionAttempts, setQuestionAttempts] = useState<QuestionAttempt[]>([]);
  const [examAttempts, setExamAttempts] = useState<ExamAttempt[]>([]);
  const [papers, setPapers] = useState<AccaPaper[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      if (!userProfile) return;
      try {
        const [qAtts, eAtts, pList, tList] = await Promise.all([
          dbService.getUserQuestionAttempts(userProfile.uid),
          dbService.getUserExamAttempts(userProfile.uid),
          dbService.getPapers(),
          dbService.getTopics('fa1'),
        ]);
        setQuestionAttempts(qAtts);
        setExamAttempts(eAtts);
        setPapers(pList);
        setTopics(tList);
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, [userProfile]);

  if (!userProfile) return null;

  // Real statistics computation
  const totalQuestions = questionAttempts.length;
  const totalCorrect = questionAttempts.filter((q) => q.isCorrect).length;
  const totalIncorrect = totalQuestions - totalCorrect;
  const overallAccuracy =
    totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  // Paper-wise accuracy calculations
  const paperStats: Record<string, { total: number; correct: number }> = {};
  questionAttempts.forEach((a) => {
    if (!paperStats[a.paperId]) paperStats[a.paperId] = { total: 0, correct: 0 };
    paperStats[a.paperId].total += 1;
    if (a.isCorrect) paperStats[a.paperId].correct += 1;
  });

  const paperChartData = Object.keys(paperStats).map((pid) => {
    const p = papers.find((item) => item.id === pid);
    const stat = paperStats[pid];
    const acc = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
    return {
      code: p ? p.code : pid.toUpperCase(),
      accuracy: acc,
      attempts: stat.total,
    };
  });

  // Topic-wise accuracy & identification of strong vs weak
  const topicStats: Record<string, { total: number; correct: number }> = {};
  questionAttempts.forEach((a) => {
    if (!topicStats[a.topicId]) topicStats[a.topicId] = { total: 0, correct: 0 };
    topicStats[a.topicId].total += 1;
    if (a.isCorrect) topicStats[a.topicId].correct += 1;
  });

  const strongTopics: { topic: Topic; accuracy: number; total: number }[] = [];
  const weakTopics: { topic: Topic; accuracy: number; total: number }[] = [];

  topics.forEach((t) => {
    const stat = topicStats[t.id];
    if (stat && stat.total > 0) {
      const acc = Math.round((stat.correct / stat.total) * 100);
      if (acc >= 75) {
        strongTopics.push({ topic: t, accuracy: acc, total: stat.total });
      } else if (acc < 60) {
        weakTopics.push({ topic: t, accuracy: acc, total: stat.total });
      }
    }
  });

  // Timeline / Exam progress chart
  const timelineData = examAttempts
    .slice(0, 10)
    .reverse()
    .map((e, idx) => ({
      index: `#${idx + 1}`,
      percentage: e.percentage,
      title: e.examTitle,
      date: new Date(e.startedAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      }),
    }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
          Diagnostic Insights
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Performance & Learning Analytics
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          Detailed metrics and visual diagnostic breakdowns derived exclusively from your actual database
          records.
        </p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <p className="text-xs text-slate-500 font-bold uppercase">Overall Accuracy</p>
          <p className="text-3xl font-black text-slate-900">{overallAccuracy}%</p>
          <p className="text-xs text-slate-400">{totalQuestions} Total Attempts</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <p className="text-xs text-slate-500 font-bold uppercase">Correct Answers</p>
          <p className="text-3xl font-black text-emerald-600">{totalCorrect}</p>
          <p className="text-xs text-slate-400">Validated solutions</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <p className="text-xs text-slate-500 font-bold uppercase">Missed Questions</p>
          <p className="text-3xl font-black text-red-500">{totalIncorrect}</p>
          <p className="text-xs text-slate-400">Available for re-drill</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <p className="text-xs text-slate-500 font-bold uppercase">Mock Exams Taken</p>
          <p className="text-3xl font-black text-blue-600">{examAttempts.length}</p>
          <p className="text-xs text-slate-400">Timed CBE simulations</p>
        </div>
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mock Exam Score Improvement Trend */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Exam Score Progression Over Time
            </h3>
            <span className="text-xs font-semibold text-blue-600">Pass Baseline: 50%</span>
          </div>

          <div className="h-64 w-full pt-4">
            {timelineData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="index" tick={{ fontSize: 12, fill: '#64748B' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#64748B' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      color: '#fff',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="percentage"
                    stroke="#2563EB"
                    strokeWidth={3}
                    dot={{ fill: '#2563EB', r: 5 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                Complete mock exams to chart score trends.
              </div>
            )}
          </div>
        </div>

        {/* Paper-Wise Accuracy Bar Chart */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Accuracy % by ACCA Paper</h3>
            <span className="text-xs font-semibold text-slate-500">Practice & Mocks</span>
          </div>

          <div className="h-64 w-full pt-4">
            {paperChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={paperChartData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="code" tick={{ fontSize: 12, fill: '#64748B' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#64748B' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      color: '#fff',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="accuracy" fill="#3B82F6" radius={[6, 6, 0, 0]}>
                    {paperChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.accuracy >= 50 ? '#10B981' : '#F59E0B'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                Attempt questions to generate paper metrics.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* STRONG VS WEAK TOPICS BREAKDOWN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Strong Topics */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Strong Topics (Accuracy &gt; 75%)</span>
          </div>

          <div className="space-y-3">
            {strongTopics.length > 0 ? (
              strongTopics.map(({ topic, accuracy, total }) => (
                <div
                  key={topic.id}
                  className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900">{topic.name}</p>
                    <p className="text-[11px] text-emerald-700 font-medium">{total} Questions Attempted</p>
                  </div>
                  <span className="text-sm font-extrabold text-emerald-700">{accuracy}%</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 py-4">
                No topics above 75% accuracy yet. Keep answering questions!
              </p>
            )}
          </div>
        </div>

        {/* Weak Topics */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span>Weak Topics Requiring Attention (&lt; 60%)</span>
          </div>

          <div className="space-y-3">
            {weakTopics.length > 0 ? (
              weakTopics.map(({ topic, accuracy, total }) => (
                <div
                  key={topic.id}
                  className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between gap-3"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900 line-clamp-1">{topic.name}</p>
                    <p className="text-[11px] text-amber-700 font-medium">{total} Attempts Recorded</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-extrabold text-amber-700">{accuracy}%</span>
                    <Link
                      to={`/practice?paper=fa1&topic=${topic.id}`}
                      className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg"
                    >
                      Practice
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 py-4">
                No critically weak topics detected. Great progress!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
