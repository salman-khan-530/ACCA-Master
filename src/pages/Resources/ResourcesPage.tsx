import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { dbService } from '../../services/dbService';
import { LearningResource, AccaPaper, ResourceCategory } from '../../types';
import {
  BookOpen,
  Search,
  Filter,
  ExternalLink,
  FileText,
  Video,
  Award,
  Globe,
  HelpCircle,
  FileCheck,
} from 'lucide-react';

export const ResourcesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [resources, setResources] = useState<LearningResource[]>([]);
  const [papers, setPapers] = useState<AccaPaper[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedPaper, setSelectedPaper] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    const loadResources = async () => {
      setLoading(true);
      try {
        const [rList, pList] = await Promise.all([
          dbService.getResources(),
          dbService.getPapers(),
        ]);
        setResources(rList);
        setPapers(pList);
      } finally {
        setLoading(false);
      }
    };
    loadResources();
  }, []);

  const categories: { id: string; label: string; icon: any }[] = [
    { id: 'all', label: 'All Materials', icon: BookOpen },
    { id: 'study_notes', label: 'Study Notes', icon: FileText },
    { id: 'revision_notes', label: 'Revision Notes', icon: FileCheck },
    { id: 'books', label: 'Books & Syllabus Guides', icon: BookOpen },
    { id: 'past_papers', label: 'Past Exam Practice', icon: Award },
    { id: 'examiner_reports', label: 'Examiner Reports', icon: Award },
    { id: 'video_resources', label: 'Video Lectures', icon: Video },
    { id: 'external_links', label: 'External Hubs', icon: Globe },
  ];

  const filteredResources = resources.filter((res) => {
    const matchesCategory =
      selectedCategory === 'all' || res.category === selectedCategory;
    const matchesPaper = selectedPaper === 'all' || res.paperId === selectedPaper;
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.authorOrPublisher.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesPaper && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl space-y-4">
        <span className="text-blue-400 font-bold text-xs uppercase tracking-widest">
          Curated Academic Repository
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          ACCA Study Resources & Examiner Reports
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
          Access verified study guides, syllabus documents, examiner insights, video lectures, and
          interactive worksheets to supplement your computer-based exam practice.
        </p>
      </div>

      {/* Copyright Compliance Notice */}
      <div className="p-4 bg-blue-50/80 rounded-2xl border border-blue-200/80 text-blue-900 text-xs flex items-start gap-3">
        <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Academic Distribution Policy:</strong> ACCA Master strictly provides authorized study
          materials, links to official syllabus outlines, public examiner reports, and open educational
          resources. We do not distribute pirated or unauthorized proprietary commercial textbooks.
        </p>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resources by title, topic, or keyword..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Paper Filter */}
        <div className="w-full md:w-auto">
          <select
            value={selectedPaper}
            onChange={(e) => setSelectedPaper(e.target.value)}
            className="w-full md:w-auto px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
          >
            <option value="all">All ACCA Papers</option>
            {papers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} – {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setSearchParams({ category: cat.id });
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Resources Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-500 font-semibold animate-pulse">
          Loading learning materials...
        </div>
      ) : filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((res) => (
            <div
              key={res.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden"
            >
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md uppercase text-[10px]">
                    {res.paperId.toUpperCase()} • {res.category.replace('_', ' ')}
                  </span>
                  <span className="text-slate-400 text-[11px] font-medium">
                    {res.fileType || 'Material'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">{res.title}</h3>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {res.description}
                </p>

                <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-100 flex items-center justify-between">
                  <span>Source: {res.authorOrPublisher}</span>
                  {res.fileSize && <span>{res.fileSize}</span>}
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                {res.externalUrl ? (
                  <a
                    href={res.externalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition shadow-xs"
                  >
                    Open Resource <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <button
                    disabled
                    className="w-full py-2 bg-slate-200 text-slate-500 font-semibold text-xs rounded-xl"
                  >
                    Available in Full Syllabus Pack
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No Resources Found</h3>
          <p className="text-xs text-slate-500">
            No materials matched your filter combination. Try selecting "All Materials".
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedPaper('all');
              setSearchQuery('');
            }}
            className="px-5 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};
