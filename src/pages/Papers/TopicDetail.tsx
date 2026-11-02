import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dbService } from '../../services/dbService';
import { useAuth } from '../../contexts/AuthContext';
import { AccaPaper, Topic, QuestionAttempt, Question } from '../../types';
import {
  BookOpen,
  PlayCircle,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Sparkles,
} from 'lucide-react';

export const TopicDetail: React.FC = () => {
  const { paperId, topicId } = useParams<{ paperId: string; topicId: string }>();
  const { userProfile } = useAuth();

  const [paper, setPaper] = useState<AccaPaper | null>(null);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [attempts, setAttempts] = useState<QuestionAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopicData = async () => {
      if (!paperId || !topicId) return;
      try {
        const [p, t, qList] = await Promise.all([
          dbService.getPaperById(paperId),
          dbService.getTopicById(topicId),
          dbService.getQuestions(paperId, topicId),
        ]);
        setPaper(p || null);
        setTopic(t || null);
        setQuestions(qList);

        if (userProfile) {
          const userAtts = await dbService.getUserQuestionAttempts(userProfile.uid, paperId);
          setAttempts(userAtts.filter((a) => a.topicId === topicId));
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTopicData();
  }, [paperId, topicId, userProfile]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-slate-500 font-semibold animate-pulse">Loading topic syllabus module...</p>
      </div>
    );
  }

  if (!paper || !topic) {
    return (
      <div className="max-w-2xl mx-auto my-16 p-8 bg-white rounded-2xl border border-slate-200 text-center">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Topic Not Found</h2>
        <p className="text-slate-600 mb-6">
          The requested syllabus topic could not be found.
        </p>
        <Link
          to={`/papers/${paperId || 'fa1'}`}
          className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-sm"
        >
          Return to Paper Dashboard
        </Link>
      </div>
    );
  }

  const correctAttempts = attempts.filter((a) => a.isCorrect).length;
  const accuracy =
    attempts.length > 0 ? Math.round((correctAttempts / attempts.length) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link to="/papers" className="hover:text-blue-600">
          Papers
        </Link>
        <span>/</span>
        <Link to={`/papers/${paper.id}`} className="hover:text-blue-600">
          {paper.code}
        </Link>
        <span>/</span>
        <span className="text-slate-900">{topic.name}</span>
      </div>

      {/* Main Topic Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 font-extrabold text-xs rounded-lg">
              {topic.code || 'TOPIC'}
            </span>
            <span
              className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${
                topic.difficultyLevel === 'introductory'
                  ? 'bg-emerald-100 text-emerald-800'
                  : topic.difficultyLevel === 'intermediate'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {topic.difficultyLevel} Level
            </span>
          </div>

          <Link
            to={`/practice?paper=${paper.id}&topic=${topic.id}`}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
          >
            <PlayCircle className="w-4 h-4" /> Start Topic Practice
          </Link>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{topic.name}</h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
            {topic.description}
          </p>
        </div>

        {/* Disclaimer as required by Section 7 */}
        <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
          <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p>
            <strong>Curriculum Note:</strong> This modular topic breakdown provides structured study
            drills and diagnostic questions. Sample topics do not claim to represent the exhaustive
            official examining syllabus. Always consult the official ACCA syllabus guide for definitive
            examination learning outcomes.
          </p>
        </div>

        {/* Progress Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-xs text-slate-500 font-bold uppercase">Questions in Bank</p>
            <p className="text-xl font-bold text-slate-900 mt-1">{questions.length}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-xs text-slate-500 font-bold uppercase">Your Attempts</p>
            <p className="text-xl font-bold text-slate-900 mt-1">{attempts.length}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-xs text-slate-500 font-bold uppercase">Topic Accuracy</p>
            <p className="text-xl font-bold text-emerald-600 mt-1">{accuracy}%</p>
          </div>
        </div>
      </div>

      {/* Available Questions Preview */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Questions in this Topic</h2>
        <div className="space-y-3">
          {questions.map((q, idx) => (
            <div
              key={q.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-blue-600">Question {idx + 1}</span>
                  <span className="text-[10px] font-semibold text-slate-400">
                    • {q.marks} Marks • {q.difficulty.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-800 line-clamp-2">{q.text}</p>
              </div>

              <Link
                to={`/practice?paper=${paper.id}&topic=${topic.id}`}
                className="px-4 py-2 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 font-bold text-xs rounded-xl transition shrink-0"
              >
                Practice Question
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
