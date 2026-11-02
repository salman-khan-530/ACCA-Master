import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dbService } from '../../services/dbService';
import { MockExam, AccaPaper } from '../../types';
import {
  Clock,
  Award,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  PlayCircle,
  HelpCircle,
} from 'lucide-react';

export const MockExamList: React.FC = () => {
  const [mockExams, setMockExams] = useState<MockExam[]>([]);
  const [papers, setPapers] = useState<AccaPaper[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<string>('fa1');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExams = async () => {
      setLoading(true);
      try {
        const [pList, mList] = await Promise.all([
          dbService.getPapers(),
          dbService.getMockExams(selectedPaper || undefined),
        ]);
        setPapers(pList);
        setMockExams(mList);
      } finally {
        setLoading(false);
      }
    };
    loadExams();
  }, [selectedPaper]);

  const currentPaper = papers.find((p) => p.id === selectedPaper);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl space-y-4">
        <span className="text-blue-400 font-bold text-xs uppercase tracking-widest">
          Computer Based Examination Simulation
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Timed ACCA Mock Examinations
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
          Experience realistic CBE exam pressure. Work against the countdown clock, flag questions for
          review, and receive a comprehensive diagnostic score report upon submission.
        </p>

        {/* Paper Filter Bar */}
        <div className="pt-4 flex flex-wrap items-center gap-2">
          {papers.slice(0, 8).map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPaper(p.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedPaper === p.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {p.code}
            </button>
          ))}
        </div>
      </div>

      {/* Rules and Guidelines */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Examination Instructions & Integrity</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <strong className="block text-slate-800 mb-1">Strict Timer Enforcement</strong>
            Once initiated, the countdown timer cannot be paused. Tests auto-submit when the clock expires.
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <strong className="block text-slate-800 mb-1">Continuous Autosave</strong>
            Your responses are saved continuously. You can navigate back and forward through the question matrix.
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <strong className="block text-slate-800 mb-1">Question Review Flags</strong>
            Mark challenging questions for review and check unanswered questions before confirming submission.
          </div>
        </div>
      </div>

      {/* Mock Exams List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">
          Available Mocks for {currentPaper?.code || selectedPaper.toUpperCase()}
        </h2>

        {loading ? (
          <div className="py-12 text-center text-slate-500 font-medium animate-pulse">
            Loading examination registry...
          </div>
        ) : mockExams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockExams.map((exam) => (
              <div
                key={exam.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-lg transition flex flex-col justify-between overflow-hidden"
              >
                <div className="p-6 sm:p-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 font-bold text-xs rounded-lg">
                      {currentPaper?.code} Official Format
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                        exam.difficulty === 'standard'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      {exam.difficulty}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{exam.title}</h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{exam.description}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Questions</p>
                      <p className="text-base font-extrabold text-slate-900">{exam.totalQuestions}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Duration</p>
                      <p className="text-base font-extrabold text-slate-900">{exam.durationMinutes}m</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Pass Mark</p>
                      <p className="text-base font-extrabold text-emerald-600">{exam.passPercentage}%</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">
                    Total Marks: <strong>{exam.totalMarks}</strong>
                  </span>
                  <Link
                    to={`/exams/take/${exam.id}`}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 shadow-blue-500/20"
                  >
                    <Clock className="w-3.5 h-3.5" /> Start Examination
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
            <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">
              No Published Mock Exams for {currentPaper?.code || selectedPaper}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Our academic faculty publishes mock exams periodically. Check FA1 for fully configured
              live CBE simulations or create your own in the Admin Console.
            </p>
            <button
              onClick={() => setSelectedPaper('fa1')}
              className="mt-2 px-5 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl"
            >
              Switch to FA1 Exams
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
