import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dbService } from '../../services/dbService';
import { AccaPaper, PaperCategory } from '../../types';
import {
  Search,
  BookOpen,
  Clock,
  ArrowRight,
  Award,
  Layers,
  GraduationCap,
  Filter,
} from 'lucide-react';

export const PapersList: React.FC = () => {
  const [papers, setPapers] = useState<AccaPaper[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchPapers = async () => {
      const data = await dbService.getPapers();
      setPapers(data);
    };
    fetchPapers();
  }, []);

  const filteredPapers = papers.filter((paper) => {
    const matchesCategory =
      selectedCategory === 'all' || paper.category === selectedCategory;
    const matchesSearch =
      paper.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 space-y-4">
        <span className="text-blue-400 font-bold text-xs uppercase tracking-widest">
          Course Catalogue
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          All 18 ACCA Qualification Papers
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl">
          Browse through the complete curriculum from Foundations in Accountancy through Applied Skills
          and Strategic Professional examinations.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search paper by code or name (e.g., FA1, Taxation, SBL)..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Levels ({papers.length})
          </button>
          <button
            onClick={() => setSelectedCategory('foundation')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              selectedCategory === 'foundation'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Foundation / Knowledge ({papers.filter((p) => p.category === 'foundation').length})
          </button>
          <button
            onClick={() => setSelectedCategory('skills')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              selectedCategory === 'skills'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Applied Skills ({papers.filter((p) => p.category === 'skills').length})
          </button>
          <button
            onClick={() => setSelectedCategory('professional')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              selectedCategory === 'professional'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Strategic Professional ({papers.filter((p) => p.category === 'professional').length})
          </button>
        </div>
      </div>

      {/* Grid of Papers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPapers.map((paper) => (
          <div
            key={paper.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 font-extrabold text-sm rounded-lg border border-blue-100">
                  {paper.code}
                </span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Pass Mark: {paper.passPercentage}%
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">{paper.name}</h3>
                <p className="text-xs text-slate-500 font-medium">{paper.level}</p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                {paper.shortDescription}
              </p>

              <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                  {paper.totalTopics} Topics
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {paper.examDurationMinutes} Minutes
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-50/80 border-t border-slate-100">
              <Link
                to={`/papers/${paper.id}`}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-xs"
              >
                Open Paper Dashboard <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
