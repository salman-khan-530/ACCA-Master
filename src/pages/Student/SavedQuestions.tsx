import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { dbService } from '../../services/dbService';
import { SavedQuestion, Question, AccaPaper, Topic } from '../../types';
import {
  Bookmark,
  Trash2,
  PlayCircle,
  Filter,
  Layers,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';

export const SavedQuestions: React.FC = () => {
  const { userProfile } = useAuth();
  const [savedItems, setSavedItems] = useState<SavedQuestion[]>([]);
  const [questionsMap, setQuestionsMap] = useState<Record<string, Question>>({});
  const [papers, setPapers] = useState<AccaPaper[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<string>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedData = async () => {
      if (!userProfile) return;
      try {
        const [savedList, qList, pList, tList] = await Promise.all([
          dbService.getSavedQuestions(userProfile.uid),
          dbService.getQuestions(),
          dbService.getPapers(),
          dbService.getTopics('fa1'),
        ]);

        const map: Record<string, Question> = {};
        qList.forEach((q) => {
          map[q.id] = q;
        });

        setSavedItems(savedList);
        setQuestionsMap(map);
        setPapers(pList);
        setTopics(tList);
      } finally {
        setLoading(false);
      }
    };
    fetchSavedData();
  }, [userProfile]);

  const handleRemove = async (questionId: string) => {
    if (!userProfile) return;
    await dbService.removeSavedQuestion(userProfile.uid, questionId);
    setSavedItems((prev) => prev.filter((s) => s.questionId !== questionId));
  };

  const filteredSaved = savedItems.filter((item) => {
    const matchesPaper = selectedPaper === 'all' || item.paperId === selectedPaper;
    const matchesTopic = selectedTopic === 'all' || item.topicId === selectedTopic;
    return matchesPaper && matchesTopic;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
            Study Bookmarks
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Saved Practice Questions
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Questions you bookmarked for further study, error revision, and conceptual review.
          </p>
        </div>

        {filteredSaved.length > 0 && (
          <Link
            to={`/practice?paper=${selectedPaper !== 'all' ? selectedPaper : 'fa1'}&mode=saved`}
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
          >
            <PlayCircle className="w-4 h-4" /> Practice Bookmarked Questions
          </Link>
        )}
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Filter className="w-4 h-4 text-purple-600" /> Filter:
        </div>

        <select
          value={selectedPaper}
          onChange={(e) => {
            setSelectedPaper(e.target.value);
            setSelectedTopic('all');
          }}
          className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
        >
          <option value="all">All Papers</option>
          {papers.map((p) => (
            <option key={p.id} value={p.id}>
              {p.code} – {p.name}
            </option>
          ))}
        </select>

        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 max-w-[200px] truncate"
        >
          <option value="all">All Topics</option>
          {topics.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <span className="text-xs text-slate-400 ml-auto font-medium">
          Showing {filteredSaved.length} of {savedItems.length} Saved
        </span>
      </div>

      {/* Saved Questions List */}
      {loading ? (
        <div className="py-12 text-center text-slate-500 font-semibold animate-pulse">
          Loading bookmarked questions...
        </div>
      ) : filteredSaved.length > 0 ? (
        <div className="space-y-6">
          {filteredSaved.map((item) => {
            const question = questionsMap[item.questionId];
            if (!question) return null;

            const targetTopic = topics.find((t) => t.id === question.topicId);

            return (
              <div
                key={item.id}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4 hover:border-purple-300 transition"
              >
                <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md font-bold uppercase bg-purple-50 text-purple-700">
                      {question.paperId.toUpperCase()}
                    </span>
                    {targetTopic && (
                      <span className="text-slate-500 font-medium">Topic: {targetTopic.name}</span>
                    )}
                    <span className="text-slate-400">• {question.marks} Marks</span>
                  </div>

                  <button
                    onClick={() => handleRemove(question.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-700 px-3 py-1 rounded-lg hover:bg-red-50 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove Bookmark
                  </button>
                </div>

                <div className="text-base font-bold text-slate-900 leading-relaxed">
                  {question.text}
                </div>

                {/* Options Preview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {question.options.map((opt) => (
                    <div
                      key={opt.id}
                      className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                        opt.id === question.correctOptionId
                          ? 'border-emerald-300 bg-emerald-50/70 text-emerald-950 font-semibold'
                          : 'border-slate-200 bg-slate-50/50 text-slate-600'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-md bg-white font-bold flex items-center justify-center shrink-0 border border-slate-200">
                        {opt.id}
                      </span>
                      <span className="mt-0.5">{opt.text}</span>
                    </div>
                  ))}
                </div>

                {/* Explanation */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 space-y-1">
                  <p className="font-bold text-slate-900">
                    Correct Option: {question.correctOptionId}
                  </p>
                  <p className="leading-relaxed">{question.explanation}</p>
                </div>

                {item.notes && (
                  <div className="text-xs text-purple-800 bg-purple-50/60 p-3 rounded-xl border border-purple-100">
                    <strong>Your Note:</strong> {item.notes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <Bookmark className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No Saved Questions</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            While practicing MCQs or reviewing your mock exams, tap the bookmark icon to save difficult
            questions for quick reference.
          </p>
          <Link
            to="/practice"
            className="inline-block mt-2 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-xs"
          >
            Go to MCQ Practice
          </Link>
        </div>
      )}
    </div>
  );
};
