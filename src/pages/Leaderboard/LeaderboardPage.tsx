import React, { useState, useEffect } from 'react';
import { dbService } from '../../services/dbService';
import { LeaderboardEntry, AccaPaper } from '../../types';
import {
  Trophy,
  Medal,
  Award,
  Crown,
  Clock,
  CheckCircle2,
  Filter,
  Shield,
  Sparkles,
  User,
} from 'lucide-react';

export const LeaderboardPage: React.FC = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [papers, setPapers] = useState<AccaPaper[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<string>('all');
  const [timeframe, setTimeframe] = useState<'all' | 'monthly' | 'weekly'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const [board, pList] = await Promise.all([
          dbService.getLeaderboard(selectedPaper !== 'all' ? selectedPaper : undefined),
          dbService.getPapers(),
        ]);
        setEntries(board);
        setPapers(pList);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [selectedPaper, timeframe]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>Academic Merit Rankings</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Global Student Leaderboard
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
          Recognizing consistent academic effort and computer-based examination excellence. Rankings are
          verified strictly from completed mock examinations and question practice.
        </p>
      </div>

      {/* Filters and Privacy Badge */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Timeframe Toggle */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl gap-1">
            <button
              onClick={() => setTimeframe('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                timeframe === 'all' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              All-Time
            </button>
            <button
              onClick={() => setTimeframe('monthly')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                timeframe === 'monthly' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setTimeframe('weekly')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                timeframe === 'weekly' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              This Week
            </button>
          </div>

          {/* Paper Filter */}
          <select
            value={selectedPaper}
            onChange={(e) => setSelectedPaper(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
          >
            <option value="all">All ACCA Papers</option>
            {papers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} – {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Student privacy protected. Email addresses are never disclosed.</span>
        </div>
      </div>

      {/* Podium Cards for Top 3 */}
      {entries.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* #2 Silver */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col items-center text-center space-y-3 order-2 md:order-1 mt-0 md:mt-4">
            <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-700 font-extrabold text-lg flex items-center justify-center border-2 border-slate-300 shadow-xs">
              2
            </div>
            <div>
              <p className="font-bold text-slate-900 text-base">{entries[1].displayName}</p>
              <p className="text-xs text-slate-500">
                {entries[1].completedExams} Mocks • {entries[1].averageScore}% Avg
              </p>
            </div>
            <span className="px-3 py-1 bg-slate-100 text-slate-800 font-black text-xs rounded-full">
              {entries[1].totalPoints} Points
            </span>
          </div>

          {/* #1 Gold Champion */}
          <div className="bg-gradient-to-b from-amber-50 to-white p-8 rounded-3xl border-2 border-amber-300 shadow-lg flex flex-col items-center text-center space-y-3 order-1 md:order-2 relative">
            <div className="absolute -top-3 px-3 py-0.5 bg-amber-500 text-white font-extrabold text-[11px] rounded-full uppercase tracking-wider flex items-center gap-1 shadow-xs">
              <Crown className="w-3.5 h-3.5" /> Top Scholar
            </div>
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 font-black text-xl flex items-center justify-center border-2 border-amber-400 shadow-sm">
              1
            </div>
            <div>
              <p className="font-extrabold text-slate-900 text-lg">{entries[0].displayName}</p>
              <p className="text-xs text-slate-500 font-medium">
                {entries[0].completedExams} Mocks • {entries[0].averageScore}% Avg
              </p>
            </div>
            <span className="px-4 py-1.5 bg-amber-500 text-white font-black text-sm rounded-full shadow-xs">
              {entries[0].totalPoints} Points
            </span>
          </div>

          {/* #3 Bronze */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col items-center text-center space-y-3 order-3 mt-0 md:mt-4">
            <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-800 font-extrabold text-lg flex items-center justify-center border-2 border-amber-300 shadow-xs">
              3
            </div>
            <div>
              <p className="font-bold text-slate-900 text-base">{entries[2].displayName}</p>
              <p className="text-xs text-slate-500">
                {entries[2].completedExams} Mocks • {entries[2].averageScore}% Avg
              </p>
            </div>
            <span className="px-3 py-1 bg-amber-100 text-amber-900 font-black text-xs rounded-full">
              {entries[2].totalPoints} Points
            </span>
          </div>
        </div>
      )}

      {/* Main Leaderboard Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
                <th className="py-4 px-6 text-center w-16">Rank</th>
                <th className="py-4 px-6">Candidate</th>
                <th className="py-4 px-6 text-center">Completed Mocks</th>
                <th className="py-4 px-6 text-center">Questions Answered</th>
                <th className="py-4 px-6 text-center">Avg Accuracy</th>
                <th className="py-4 px-6 text-right">Academic Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {entries.map((student, idx) => (
                <tr key={student.userId} className="hover:bg-slate-50/80 transition">
                  <td className="py-4 px-6 text-center font-extrabold">
                    {idx === 0 ? (
                      <span className="w-7 h-7 rounded-full bg-amber-400 text-amber-950 inline-flex items-center justify-center text-xs">
                        1
                      </span>
                    ) : idx === 1 ? (
                      <span className="w-7 h-7 rounded-full bg-slate-300 text-slate-800 inline-flex items-center justify-center text-xs">
                        2
                      </span>
                    ) : idx === 2 ? (
                      <span className="w-7 h-7 rounded-full bg-amber-200 text-amber-900 inline-flex items-center justify-center text-xs">
                        3
                      </span>
                    ) : (
                      <span className="text-slate-500 font-semibold">{idx + 1}</span>
                    )}
                  </td>
                  <td className="py-4 px-6 font-bold text-slate-900 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-700 text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0">
                      {student.displayName.charAt(0)}
                    </div>
                    <span>{student.displayName}</span>
                  </td>
                  <td className="py-4 px-6 text-center font-semibold text-slate-700">
                    {student.completedExams}
                  </td>
                  <td className="py-4 px-6 text-center text-slate-500">
                    {student.totalQuestionsAttempted} ({student.correctAnswers} correct)
                  </td>
                  <td className="py-4 px-6 text-center font-bold text-emerald-600">
                    {student.averageScore}%
                  </td>
                  <td className="py-4 px-6 text-right font-black text-blue-600 text-base">
                    {student.totalPoints}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
