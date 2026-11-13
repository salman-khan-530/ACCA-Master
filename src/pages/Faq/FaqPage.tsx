import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Award,
  Shield,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface FaqItem {
  id: string;
  category: 'exams' | 'account' | 'syllabus' | 'general';
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'free-platform',
    category: 'general',
    question: 'Is ACCA Master completely free to use?',
    answer:
      'Yes! ACCA Master is built as an open, accessible learning platform. Students can practice topic-wise MCQs, attempt full timed mock examinations, bookmark challenging questions, and track their analytics completely free of charge without paywalls.',
  },
  {
    id: 'cbe-simulation',
    category: 'exams',
    question: 'How does the Mock Exam Simulator replicate real CBE conditions?',
    answer:
      'Our exam simulator mirrors official ACCA Computer Based Exam (CBE) functionality: accurate timed countdowns, automatic autosaving, a multi-question navigator palette with status flags (Answered, Unanswered, Marked for Review), and instant post-exam diagnostic review with complete question-by-question explanations.',
  },
  {
    id: 'pause-exam',
    category: 'exams',
    question: 'Can I pause a timed mock exam once started?',
    answer:
      'In genuine exam mode, timers run continuously to accurately reflect the real examination pressure. Your progress autosaves continuously in your browser and cloud storage, so if your connection drops, you can resume without losing your existing answers.',
  },
  {
    id: 'leaderboard-points',
    category: 'account',
    question: 'How are leaderboard points calculated?',
    answer:
      'Points are earned through verified academic activity: you earn 10 points for each practice question answered correctly on your first attempt, plus test marks and a 50-point bonus for successfully passing full-length mock examinations.',
  },
  {
    id: 'offline-local-engine',
    category: 'general',
    question: 'What is the "Local Engine" vs "Firebase Live" badge in the header?',
    answer:
      'ACCA Master includes a built-in high performance local engine fallback. When offline or before Firebase credentials are configured, the platform runs seamlessly on local browser persistence. Once connected to Firebase Cloud Firestore, your data syncs securely across all your devices.',
  },
  {
    id: 'papers-covered',
    category: 'syllabus',
    question: 'Which ACCA papers are currently available on ACCA Master?',
    answer:
      'We support Foundation in Accountancy (FA1, FA2, MA1, MA2, FBT, FFA) as well as Applied Skills and Strategic Professional level papers (PM, TX, FR, AA, FM, SBL). Our syllabus library is updated regularly.',
  },
  {
    id: 'bookmark-questions',
    category: 'exams',
    question: 'How do saved/bookmarked questions work?',
    answer:
      'While practicing MCQs or reviewing exam results, you can click the Bookmark icon on any question. All saved questions are aggregated into your "Saved Questions" workspace where you can filter them by paper, re-attempt them, or clear them once mastered.',
  },
  {
    id: 'admin-uploads',
    category: 'account',
    question: 'Can tutors or administrators upload custom practice questions?',
    answer:
      'Yes! Verified administrators have access to an Admin Console with a CSV bulk question import wizard, duplicate question detection, question editor, and mock exam creator.',
  },
  {
    id: 'community-groups',
    category: 'general',
    question: 'How do I join the WhatsApp student community or study groups?',
    answer:
      'You can join our verified WhatsApp study group directly via the banner in the footer or through our Contact & Community page to discuss tricky double-entry problems, revision tips, and exam preparation strategies.',
  },
];

export const FaqPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>('free-platform');

  const filteredFaqs = useMemo(() => {
    return FAQ_ITEMS.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        query === '' ||
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-100">
          <HelpCircle className="w-3.5 h-3.5" /> Help & Support
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Find instant answers to common questions about our computer-based exam simulator, 
          practice drills, syllabus coverage, and student account features.
        </p>

        {/* Live Search */}
        <div className="max-w-xl mx-auto pt-2">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, paper, or question (e.g., CBE, bookmark, scoring)..."
              className="w-full pl-12 pr-4 py-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
            selectedCategory === 'all'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Questions ({FAQ_ITEMS.length})
        </button>
        <button
          onClick={() => setSelectedCategory('exams')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition ${
            selectedCategory === 'exams'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Award className="w-3.5 h-3.5" /> CBE Exams & Practice
        </button>
        <button
          onClick={() => setSelectedCategory('syllabus')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition ${
            selectedCategory === 'syllabus'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" /> Papers & Syllabus
        </button>
        <button
          onClick={() => setSelectedCategory('account')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition ${
            selectedCategory === 'account'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Shield className="w-3.5 h-3.5" /> Accounts & Scoring
        </button>
        <button
          onClick={() => setSelectedCategory('general')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition ${
            selectedCategory === 'general'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" /> Platform & Community
        </button>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No matching questions found</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              We couldn&apos;t find an answer matching &quot;{searchQuery}&quot;. Try different keywords or reach out to our team.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 underline"
            >
              Reset Search & Filters
            </button>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = expandedId === faq.id;
            return (
              <div
                key={faq.id}
                className={`bg-white rounded-2xl border transition overflow-hidden ${
                  isOpen ? 'border-blue-300 shadow-sm' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => setExpandedId(isOpen ? null : faq.id)}
                  className="w-full p-5 text-left font-bold text-slate-900 text-sm sm:text-base flex items-center justify-between gap-4 hover:text-blue-600 transition"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        isOpen ? 'bg-blue-600' : 'bg-slate-300'
                      }`}
                    />
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-blue-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Still Have Questions CTA */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-10 text-white text-center space-y-4 shadow-xl">
        <h3 className="text-2xl font-bold">Still have questions?</h3>
        <p className="text-blue-200 text-sm max-w-xl mx-auto">
          Can&apos;t find what you&apos;re looking for? Reach out through our contact form or join the WhatsApp community to connect directly with tutors and peers.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl transition text-sm shadow-md"
          >
            Contact Support <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/practice"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl transition text-sm border border-white/20"
          >
            Start Practice
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FaqPage;
