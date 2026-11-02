import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { dbService } from '../../services/dbService';
import { useAuth } from '../../contexts/AuthContext';
import { Question, AccaPaper, Topic, QuestionAttempt } from '../../types';
import {
  CheckCircle2,
  XCircle,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Filter,
  ArrowLeft,
  Check,
  AlertCircle,
  Award,
  Layers,
} from 'lucide-react';

export const McqPractice: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { userProfile } = useAuth();

  const paperParam = searchParams.get('paper') || 'fa1';
  const topicParam = searchParams.get('topic') || '';
  const difficultyParam = searchParams.get('difficulty') || 'all';
  const modeParam = searchParams.get('mode') || 'all'; // 'all' | 'random' | 'unattempted' | 'incorrect' | 'saved'

  const [papers, setPapers] = useState<AccaPaper[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Per-question state
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number>(Date.now());

  // Session state: map questionId -> { selectedOptionId, isCorrect, submitted }
  const [sessionAnswers, setSessionAnswers] = useState<
    Record<string, { selectedOptionId: string; isCorrect: boolean }>
  >({});

  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Load papers & topics
  useEffect(() => {
    const init = async () => {
      const [pList, tList] = await Promise.all([
        dbService.getPapers(),
        dbService.getTopics(paperParam),
      ]);
      setPapers(pList);
      setTopics(tList);
    };
    init();
  }, [paperParam]);

  // Load questions based on filters
  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true);
      try {
        const questions = await dbService.getQuestions(paperParam, topicParam || undefined);
        let list = [...questions];

        // Filter by difficulty
        if (difficultyParam !== 'all') {
          list = list.filter((q) => q.difficulty === difficultyParam);
        }

        // Filter by user history if applicable
        if (userProfile) {
          const userAttempts = await dbService.getUserQuestionAttempts(userProfile.uid, paperParam);
          const savedList = await dbService.getSavedQuestions(userProfile.uid, paperParam);

          if (modeParam === 'unattempted') {
            const attemptedIds = new Set(userAttempts.map((a) => a.questionId));
            list = list.filter((q) => !attemptedIds.has(q.id));
          } else if (modeParam === 'incorrect') {
            const incorrectIds = new Set(
              userAttempts.filter((a) => !a.isCorrect).map((a) => a.questionId)
            );
            list = list.filter((q) => incorrectIds.has(q.id));
          } else if (modeParam === 'saved') {
            const savedIds = new Set(savedList.map((s) => s.questionId));
            list = list.filter((q) => savedIds.has(q.id));
          }
        }

        // Random mode shuffle
        if (modeParam === 'random') {
          list.sort(() => Math.random() - 0.5);
        }

        setAllQuestions(questions);
        setFilteredQuestions(list);
        setCurrentIndex(0);
        setSelectedOption(null);
        setIsSubmitted(false);
        setStartTime(Date.now());
      } finally {
        setLoading(false);
      }
    };
    loadQuestions();
  }, [paperParam, topicParam, difficultyParam, modeParam, userProfile]);

  const currentQuestion = filteredQuestions[currentIndex];

  // Sync bookmark status when current question changes
  useEffect(() => {
    if (!currentQuestion || !userProfile) return;
    const checkSaved = async () => {
      const saved = await dbService.isQuestionSaved(userProfile.uid, currentQuestion.id);
      setIsSaved(saved);
    };
    checkSaved();

    // If already answered in this practice session, restore state
    if (sessionAnswers[currentQuestion.id]) {
      setSelectedOption(sessionAnswers[currentQuestion.id].selectedOptionId);
      setIsSubmitted(true);
    } else {
      setSelectedOption(null);
      setIsSubmitted(false);
    }
    setStartTime(Date.now());
  }, [currentIndex, currentQuestion, userProfile, sessionAnswers]);

  const handleSelectOption = (optionId: string) => {
    if (isSubmitted) return; // Prevent changing after submission
    setSelectedOption(optionId);
  };

  const handleSubmitAnswer = async () => {
    if (!selectedOption || !currentQuestion || isSubmitted) return;

    const isCorrect = selectedOption === currentQuestion.correctOptionId;
    const timeSpentSeconds = Math.max(1, Math.round((Date.now() - startTime) / 1000));

    // Record attempt
    if (userProfile) {
      const attempt: QuestionAttempt = {
        id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        userId: userProfile.uid,
        paperId: currentQuestion.paperId,
        topicId: currentQuestion.topicId,
        questionId: currentQuestion.id,
        selectedOptionId: selectedOption,
        isCorrect,
        timeSpentSeconds,
        timestamp: new Date().toISOString(),
        mode: 'practice',
      };
      await dbService.recordQuestionAttempt(attempt);
    }

    setSessionAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: { selectedOptionId: selectedOption, isCorrect },
    }));

    setIsSubmitted(true);
  };

  const handleToggleBookmark = async () => {
    if (!currentQuestion || !userProfile) return;
    if (isSaved) {
      await dbService.removeSavedQuestion(userProfile.uid, currentQuestion.id);
      setIsSaved(false);
    } else {
      await dbService.saveQuestion({
        id: `saved-${Date.now()}`,
        userId: userProfile.uid,
        questionId: currentQuestion.id,
        paperId: currentQuestion.paperId,
        topicId: currentQuestion.topicId,
        savedAt: new Date().toISOString(),
      });
      setIsSaved(true);
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const currentTopic = topics.find((t) => t.id === currentQuestion?.topicId);
  const currentPaper = papers.find((p) => p.id === paperParam);

  // Session score calculations
  const totalAnswered = Object.keys(sessionAnswers).length;
  const correctInSession = Object.values(sessionAnswers).filter((a) => a.isCorrect).length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Filter Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to={`/papers/${paperParam}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> {currentPaper?.code || 'Paper'}
          </Link>

          {/* Paper Selector */}
          <select
            value={paperParam}
            onChange={(e) => {
              setSearchParams({ paper: e.target.value, topic: '', difficulty: 'all', mode: 'all' });
            }}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
          >
            {papers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} – {p.name}
              </option>
            ))}
          </select>

          {/* Topic Selector */}
          <select
            value={topicParam}
            onChange={(e) => {
              const newParams = new URLSearchParams(searchParams);
              if (e.target.value) newParams.set('topic', e.target.value);
              else newParams.delete('topic');
              setSearchParams(newParams);
            }}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 max-w-[200px] truncate"
          >
            <option value="">All Topics</option>
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          {/* Difficulty Filter */}
          <select
            value={difficultyParam}
            onChange={(e) => {
              const newParams = new URLSearchParams(searchParams);
              newParams.set('difficulty', e.target.value);
              setSearchParams(newParams);
            }}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          {/* Practice Mode */}
          <select
            value={modeParam}
            onChange={(e) => {
              const newParams = new URLSearchParams(searchParams);
              newParams.set('mode', e.target.value);
              setSearchParams(newParams);
            }}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
          >
            <option value="all">Standard Mode</option>
            <option value="random">Randomized</option>
            <option value="unattempted">Unattempted Only</option>
            <option value="incorrect">Past Mistakes</option>
            <option value="saved">Bookmarked Only</option>
          </select>
        </div>

        {/* Live Session Counter */}
        <div className="flex items-center gap-4 text-xs font-bold">
          <span className="text-slate-600">
            Session: <strong className="text-slate-900">{totalAnswered}</strong> /{' '}
            {filteredQuestions.length} Answered
          </span>
          <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
            {correctInSession} Correct
          </span>
        </div>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <p className="text-slate-500 font-semibold animate-pulse">Loading question engine...</p>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4 max-w-lg mx-auto">
          <AlertCircle className="w-12 h-12 text-blue-500 mx-auto" />
          <h3 className="text-xl font-bold text-slate-900">No Questions Match Filter</h3>
          <p className="text-xs text-slate-600">
            There are currently no questions matching your selected difficulty or mode criteria.
          </p>
          <button
            onClick={() => setSearchParams({ paper: paperParam, topic: '', difficulty: 'all', mode: 'all' })}
            className="px-6 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Question Interface (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              {/* Question Header & Meta */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-blue-600 text-white font-bold text-xs rounded-lg">
                    Question {currentIndex + 1} of {filteredQuestions.length}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase ${
                      currentQuestion.difficulty === 'easy'
                        ? 'bg-emerald-100 text-emerald-800'
                        : currentQuestion.difficulty === 'medium'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {currentQuestion.difficulty}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    • {currentQuestion.marks} Marks
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleBookmark}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      isSaved
                        ? 'bg-purple-100 text-purple-700 border border-purple-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                    {isSaved ? 'Bookmarked' : 'Bookmark'}
                  </button>
                </div>
              </div>

              {/* Topic Citation */}
              {currentTopic && (
                <div className="text-xs text-blue-600 font-semibold flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-blue-500" />
                  <span>Topic: {currentTopic.name}</span>
                </div>
              )}

              {/* Question Text */}
              <div className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                {currentQuestion.text}
              </div>

              {/* Options */}
              <div className="space-y-3 pt-2">
                {currentQuestion.options.map((option) => {
                  const isSelected = selectedOption === option.id;
                  const isCorrect = option.id === currentQuestion.correctOptionId;

                  let optionStyle =
                    'border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 bg-white text-slate-800';

                  if (isSelected && !isSubmitted) {
                    optionStyle =
                      'border-blue-600 bg-blue-50/80 text-blue-900 ring-2 ring-blue-500/20';
                  }

                  if (isSubmitted) {
                    if (isCorrect) {
                      optionStyle =
                        'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/30';
                    } else if (isSelected && !isCorrect) {
                      optionStyle =
                        'border-red-500 bg-red-50 text-red-950 ring-2 ring-red-500/30';
                    } else {
                      optionStyle = 'border-slate-200 bg-slate-50/50 text-slate-400 opacity-70';
                    }
                  }

                  return (
                    <button
                      key={option.id}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => handleSelectOption(option.id)}
                      className={`w-full p-4 rounded-2xl border text-left transition-all duration-150 flex items-start gap-3.5 ${optionStyle}`}
                    >
                      <div
                        className={`w-7 h-7 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 transition ${
                          isSelected && !isSubmitted
                            ? 'bg-blue-600 text-white'
                            : isSubmitted && isCorrect
                            ? 'bg-emerald-600 text-white'
                            : isSubmitted && isSelected && !isCorrect
                            ? 'bg-red-600 text-white'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {option.id}
                      </div>
                      <div className="text-sm font-medium leading-relaxed flex-1 mt-0.5">
                        {option.text}
                      </div>

                      {isSubmitted && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-1" />
                      )}
                      {isSubmitted && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-1" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanatory Feedback (Revealed after submission) */}
              {isSubmitted && (
                <div
                  className={`p-5 rounded-2xl border transition-all animate-in fade-in space-y-2.5 ${
                    selectedOption === currentQuestion.correctOptionId
                      ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                      : 'bg-red-50/80 border-red-200 text-red-950'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {selectedOption === currentQuestion.correctOptionId ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span>Correct Answer (+{currentQuestion.marks} Marks)</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-red-600" />
                        <span>
                          Incorrect. Correct Option is {currentQuestion.correctOptionId}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="text-xs sm:text-sm leading-relaxed pt-1">
                    <strong className="block font-bold mb-1">Accounting Explanation:</strong>
                    {currentQuestion.explanation}
                  </div>

                  {currentQuestion.syllabusReference && (
                    <div className="text-[11px] font-semibold text-slate-500 pt-2 border-t border-slate-200/60">
                      Syllabus Guide: {currentQuestion.syllabusReference}
                    </div>
                  )}
                </div>
              )}

              {/* Bottom Action Bar */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl disabled:opacity-40 transition flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>

                {!isSubmitted ? (
                  <button
                    type="button"
                    onClick={handleSubmitAnswer}
                    disabled={!selectedOption}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50 flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" /> Submit Answer
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={currentIndex === filteredQuestions.length - 1}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-40 flex items-center gap-1.5"
                  >
                    Next Question <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Question Navigation Drawer Panel (1 col) */}
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Question Navigator
                </h3>
                <span className="text-[11px] font-semibold text-slate-500">
                  {totalAnswered} / {filteredQuestions.length} Done
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.round((totalAnswered / filteredQuestions.length) * 100)}%`,
                  }}
                />
              </div>

              {/* Grid of Question Numbers */}
              <div className="grid grid-cols-5 gap-2 pt-2">
                {filteredQuestions.map((q, idx) => {
                  const ans = sessionAnswers[q.id];
                  const isCurrent = idx === currentIndex;

                  let btnStyle = 'bg-slate-100 text-slate-700 hover:bg-slate-200';
                  if (ans) {
                    btnStyle = ans.isCorrect
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-red-500 text-white font-bold';
                  }
                  if (isCurrent) {
                    btnStyle += ' ring-2 ring-blue-500 ring-offset-2';
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-9 rounded-xl text-xs font-bold transition flex items-center justify-center ${btnStyle}`}
                      title={`Go to Question ${idx + 1}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="pt-3 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-600" />
                  <span>Correct Answer</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  <span>Incorrect Answer</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-slate-200" />
                  <span>Unattempted</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <Link
                to={`/exams`}
                className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition"
              >
                <Award className="w-3.5 h-3.5" /> Full Timed CBE Mock
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
