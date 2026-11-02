import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dbService } from '../../services/dbService';
import { useAuth } from '../../contexts/AuthContext';
import {
  AccaPaper,
  Topic,
  MockExam,
  LearningResource,
  SavedQuestion,
  QuestionAttempt,
} from '../../types';
import {
  BookOpen,
  Clock,
  PlayCircle,
  FileText,
  Award,
  Bookmark,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Layers,
  ChevronRight,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

export const PaperDashboard: React.FC = () => {
  const { paperId } = useParams<{ paperId: string }>();
  const { userProfile } = useAuth();

  const [paper, setPaper] = useState<AccaPaper | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [mockExams, setMockExams] = useState<MockExam[]>([]);
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [savedQuestions, setSavedQuestions] = useState<SavedQuestion[]>([]);
  const [attempts, setAttempts] = useState<QuestionAttempt[]>([]);
  const [activeTab, setActiveTab] = useState<
    'topics' | 'practice' | 'mocks' | 'resources' | 'examiner_reports' | 'saved'
  >('topics');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPaperData = async () => {
      if (!paperId) return;
      setLoading(true);
      try {
        const p = await dbService.getPaperById(paperId);
        setPaper(p || null);

        const [tList, mList, rList] = await Promise.all([
          dbService.getTopics(paperId),
          dbService.getMockExams(paperId),
          dbService.getResources(paperId),
        ]);
        setTopics(tList);
        setMockExams(mList);
        setResources(rList);

        if (userProfile) {
          const [saved, atts] = await Promise.all([
            dbService.getSavedQuestions(userProfile.uid, paperId),
            dbService.getUserQuestionAttempts(userProfile.uid, paperId),
          ]);
          setSavedQuestions(saved);
          setAttempts(atts);
        }
      } finally {
        setLoading(false);
      }
    };
    loadPaperData();
  }, [paperId, userProfile]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-slate-500 font-semibold animate-pulse">Loading paper syllabus & resources...</p>
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="max-w-2xl mx-auto my-16 p-8 bg-white rounded-2xl border border-slate-200 text-center">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Paper Not Found</h2>
        <p className="text-slate-600 mb-6">
          The requested ACCA qualification paper identifier could not be located.
        </p>
        <Link
          to="/papers"
          className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-sm"
        >
          View All Papers
        </Link>
      </div>
    );
  }

  const paperAttempts = attempts.filter((a) => a.paperId === paper.id);
  const correctCount = paperAttempts.filter((a) => a.isCorrect).length;
  const paperAccuracy =
    paperAttempts.length > 0 ? Math.round((correctCount / paperAttempts.length) * 100) : 0;

  const examinerReports = resources.filter((r) => r.category === 'examiner_reports');
  const studyMaterials = resources.filter((r) => r.category !== 'examiner_reports');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Paper Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 bg-blue-500 text-white font-black text-sm rounded-xl shadow-xs">
              {paper.code}
            </span>
            <span className="text-xs uppercase font-bold tracking-wider text-blue-300">
              {paper.level}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" /> Exam Time: {paper.examDurationMinutes}m
            </span>
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-400" /> Pass Mark: {paper.passPercentage}%
            </span>
          </div>
        </div>

        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">{paper.name}</h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
            {paper.fullDescription}
          </p>
        </div>

        {/* Paper Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-blue-900/60">
          <div>
            <p className="text-xs text-slate-400">Total Topics</p>
            <p className="text-xl font-bold text-white">{topics.length}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Questions Attempted</p>
            <p className="text-xl font-bold text-white">{paperAttempts.length}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Your Accuracy</p>
            <p className="text-xl font-bold text-emerald-400">{paperAccuracy}%</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Mock Exams Available</p>
            <p className="text-xl font-bold text-white">{mockExams.length}</p>
          </div>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="border-b border-slate-200">
        <div className="flex space-x-2 sm:space-x-4 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('topics')}
            className={`px-4 py-2 text-sm font-bold rounded-xl transition shrink-0 ${
              activeTab === 'topics'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Syllabus Topics ({topics.length})
          </button>
          <button
            onClick={() => setActiveTab('practice')}
            className={`px-4 py-2 text-sm font-bold rounded-xl transition shrink-0 ${
              activeTab === 'practice'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            MCQ Practice
          </button>
          <button
            onClick={() => setActiveTab('mocks')}
            className={`px-4 py-2 text-sm font-bold rounded-xl transition shrink-0 ${
              activeTab === 'mocks'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Mock Exams ({mockExams.length})
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-4 py-2 text-sm font-bold rounded-xl transition shrink-0 ${
              activeTab === 'resources'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Study Resources ({studyMaterials.length})
          </button>
          <button
            onClick={() => setActiveTab('examiner_reports')}
            className={`px-4 py-2 text-sm font-bold rounded-xl transition shrink-0 ${
              activeTab === 'examiner_reports'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Examiner Reports ({examinerReports.length})
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-2 text-sm font-bold rounded-xl transition shrink-0 ${
              activeTab === 'saved'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Saved Questions ({savedQuestions.length})
          </button>
        </div>
      </div>

      {/* TAB CONTENT: TOPICS & SYLLABUS */}
      {activeTab === 'topics' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Syllabus Topics & Practice Modules</h2>
              <p className="text-xs text-slate-500">
                Click on any topic to drill questions or view detailed syllabus references
              </p>
            </div>
            <Link
              to={`/practice?paper=${paper.id}`}
              className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition"
            >
              Practice All Topics
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topics.map((topic, index) => {
              // Calculate topic attempts
              const topicAttempts = paperAttempts.filter((a) => a.topicId === topic.id);
              const topicCorrect = topicAttempts.filter((a) => a.isCorrect).length;
              const topicPct =
                topicAttempts.length > 0
                  ? Math.round((topicCorrect / topicAttempts.length) * 100)
                  : 0;

              return (
                <div
                  key={topic.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 transition flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                        Topic {index + 1}
                      </span>
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                          topic.difficultyLevel === 'introductory'
                            ? 'bg-emerald-50 text-emerald-700'
                            : topic.difficultyLevel === 'intermediate'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {topic.difficultyLevel}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base leading-snug">{topic.name}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {topic.description}
                    </p>

                    <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                      <span>{topic.questionCount} Questions in Bank</span>
                      <span>
                        Attempts: <strong>{topicAttempts.length}</strong> (
                        <span className={topicPct >= 50 ? 'text-emerald-600' : 'text-amber-600'}>
                          {topicPct}% Acc
                        </span>
                        )
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 mt-3">
                    <Link
                      to={`/papers/${paper.id}/topics/${topic.id}`}
                      className="text-xs font-bold text-slate-600 hover:text-blue-600 flex items-center gap-1"
                    >
                      Topic Details <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      to={`/practice?paper=${paper.id}&topic=${topic.id}`}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition"
                    >
                      <PlayCircle className="w-3.5 h-3.5" /> Start Practice
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT: MCQ PRACTICE MODES */}
      {activeTab === 'practice' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                <PlayCircle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Comprehensive Question Bank</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Practice through all active questions with immediate feedback, detailed step-by-step
                explanations, and reference citations.
              </p>
            </div>
            <Link
              to={`/practice?paper=${paper.id}`}
              className="w-full py-2.5 text-center bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition"
            >
              Start Full Practice
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Drill Past Mistakes</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Focus strictly on questions you answered incorrectly in prior sessions to turn weak points
                into strengths.
              </p>
            </div>
            <Link
              to={`/practice?paper=${paper.id}&mode=incorrect`}
              className="w-full py-2.5 text-center bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition"
            >
              Practice Missed MCQs
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                <Bookmark className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Saved Bookmarks</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Revisit questions you bookmarked for review during previous practice or mock exam
                diagnostics.
              </p>
            </div>
            <Link
              to={`/practice?paper=${paper.id}&mode=saved`}
              className="w-full py-2.5 text-center bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl transition"
            >
              Practice Bookmarked ({savedQuestions.length})
            </Link>
          </div>
        </div>
      )}

      {/* TAB CONTENT: MOCK EXAMINATIONS */}
      {activeTab === 'mocks' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Timed Computer-Based Mock Simulations</h2>
              <p className="text-xs text-slate-500">
                Official CBE format with strict timer, question status grid, and post-exam breakdown
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockExams.map((exam) => (
              <div
                key={exam.id}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between hover:border-blue-400 transition"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
                      {paper.code} Simulation
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-md uppercase ${
                        exam.difficulty === 'standard'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {exam.difficulty}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">{exam.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{exam.description}</p>

                  <div className="pt-2 grid grid-cols-3 gap-2 text-center text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div>
                      <p className="text-slate-400 text-[10px]">Questions</p>
                      <p className="font-bold text-slate-800">{exam.totalQuestions}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-[10px]">Duration</p>
                      <p className="font-bold text-slate-800">{exam.durationMinutes} mins</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-[10px]">Pass Mark</p>
                      <p className="font-bold text-slate-800">{exam.passPercentage}%</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <Link
                    to={`/exams/take/${exam.id}`}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Clock className="w-4 h-4" /> Begin Timed Examination
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: STUDY RESOURCES & BOOKS */}
      {activeTab === 'resources' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Study Notes & Books</h2>
            <Link to="/resources" className="text-xs font-bold text-blue-600 hover:text-blue-700">
              View Global Library
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studyMaterials.map((res) => (
              <div
                key={res.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="font-bold text-blue-600 uppercase text-[10px] bg-blue-50 px-2 py-0.5 rounded-md">
                      {res.category.replace('_', ' ')}
                    </span>
                    <span>{res.fileType || 'Document'}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{res.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">{res.description}</p>
                  <p className="text-[11px] text-slate-400 mt-2">Source: {res.authorOrPublisher}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                  {res.externalUrl && (
                    <a
                      href={res.externalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 rounded-lg transition"
                    >
                      Open Resource <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: EXAMINER REPORTS */}
      {activeTab === 'examiner_reports' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">ACCA Examiner Insights & Technical Reports</h2>
              <p className="text-xs text-slate-500">
                Official feedback from the examination team highlighting where candidates score and lose marks
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {examinerReports.map((report) => (
              <div
                key={report.id}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                    Technical Commentary
                  </span>
                  <h3 className="font-bold text-slate-900 text-base">{report.title}</h3>
                  <p className="text-xs text-slate-600 max-w-2xl">{report.description}</p>
                  <span className="text-[11px] text-slate-400 block pt-1">
                    Published by: {report.authorOrPublisher}
                  </span>
                </div>

                {report.externalUrl && (
                  <a
                    href={report.externalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shrink-0 transition"
                  >
                    Read Report <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: SAVED QUESTIONS */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Bookmarked Questions for {paper.code}</h2>
            {savedQuestions.length > 0 && (
              <Link
                to={`/practice?paper=${paper.id}&mode=saved`}
                className="px-4 py-2 bg-purple-600 text-white font-bold text-xs rounded-xl"
              >
                Practice All Saved
              </Link>
            )}
          </div>

          {savedQuestions.length > 0 ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <p className="text-sm text-slate-600">
                You have <strong>{savedQuestions.length}</strong> saved questions bookmarked in this paper.
              </p>
              <Link
                to={`/practice?paper=${paper.id}&mode=saved`}
                className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-bold text-xs"
              >
                Launch bookmarked practice module <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 space-y-2">
              <Bookmark className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">No questions saved yet in {paper.code}</p>
              <p className="text-xs text-slate-400">
                While practicing MCQs, click the bookmark icon to save difficult questions for targeted revision.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
