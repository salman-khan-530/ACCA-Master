import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dbService } from '../../services/dbService';
import { AccaPaper, Announcement, PaperCategory } from '../../types';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Award,
  Layers,
  GraduationCap,
  TrendingUp,
  ShieldCheck,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  AlertCircle,
  Target,
  BarChart3,
  Users,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [papers, setPapers] = useState<AccaPaper[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [activeCategory, setActiveCategory] = useState<PaperCategory>('foundation');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const [papersList, announcementsList] = await Promise.all([
        dbService.getPapers(),
        dbService.getAnnouncements(),
      ]);
      setPapers(papersList);
      setAnnouncements(announcementsList);
    };
    loadData();
  }, []);

  const filteredPapers = papers.filter((p) => p.category === activeCategory);

  const faqs = [
    {
      q: 'Is ACCA Master completely free to use?',
      a: 'Yes! ACCA Master is built as an open, accessible learning platform. Students can practice topic-wise MCQs, attempt full timed mock examinations, bookmark challenging questions, and track their analytics completely free of charge.',
    },
    {
      q: 'Does ACCA Master represent the official ACCA examining body?',
      a: 'No. ACCA Master is an independent educational platform built by educators and engineers to help students master computer-based exams. ACCA is a registered trademark of the Association of Chartered Certified Accountants, and we do not claim any official endorsement or affiliation.',
    },
    {
      q: 'How realistic is the Mock Examination interface?',
      a: 'Our mock exam simulator models standard Computer Based Examination (CBE) functionality, including strict timed countdowns, automatic autosaving, question status flags (answered, unanswered, marked for review), and a thorough post-exam diagnostic review.',
    },
    {
      q: 'Can tutors or administrators upload their own practice questions?',
      a: 'Yes. The platform includes a dedicated Administrator Console with a CSV question import tool, question editor, topic manager, and mock examination creator.',
    },
    {
      q: 'How are the leaderboard rankings calculated?',
      a: 'Points are accrued through verified academic performance: 10 points for each correctly answered practice question, plus marks and 50 bonus points for successfully passing full-length mock examinations.',
    },
  ];

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      {/* Announcements Bar if any */}
      {announcements.length > 0 && (
        <div className="bg-blue-50 border-b border-blue-100 py-2.5 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="shrink-0 bg-blue-600 text-white font-bold px-2 py-0.5 rounded-md text-[10px] uppercase">
                Notice
              </span>
              <p className="text-blue-900 truncate font-medium">
                <strong>{announcements[0].title}:</strong> {announcements[0].content}
              </p>
            </div>
            <Link
              to="/resources"
              className="shrink-0 text-blue-700 hover:text-blue-800 font-semibold flex items-center gap-1 text-xs"
            >
              Learn More <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-16 pb-20 sm:pt-24 sm:pb-32">
        {/* Subtle decorative grid/glow */}
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs sm:text-sm font-semibold">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Next-Generation CBE Practice for ACCA Qualification</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Master Every Paper with Confidence on{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
              ACCA Master
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            The complete, responsive educational platform featuring topic-wise MCQ training, authentic
            timed CBE simulations, instant answer diagnostics, and personalized study analytics.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/practice"
              className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-base rounded-xl shadow-lg shadow-blue-600/30 hover:scale-102 transition flex items-center justify-center gap-2"
            >
              Start Free Practice Now
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#papers-section"
              className="w-full sm:w-auto px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-base rounded-xl border border-slate-700 transition flex items-center justify-center gap-2"
            >
              Explore 18 ACCA Papers
            </a>
          </div>

          {/* Value Badges */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="bg-slate-800/60 backdrop-blur-sm p-4 rounded-xl border border-slate-700/60 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">18 Papers</p>
                <p className="text-xs text-slate-400">Comprehensive syllabus</p>
              </div>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-sm p-4 rounded-xl border border-slate-700/60 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">Topic Practice</p>
                <p className="text-xs text-slate-400">Instant explanations</p>
              </div>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-sm p-4 rounded-xl border border-slate-700/60 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">CBE Mocks</p>
                <p className="text-xs text-slate-400">Timed exam environment</p>
              </div>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-sm p-4 rounded-xl border border-slate-700/60 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">Analytics</p>
                <p className="text-xs text-slate-400">Weakness detection</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ACCA PAPER CATALOGUE SECTION */}
      <section id="papers-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-20">
        <div className="text-center space-y-3">
          <span className="text-blue-600 font-bold text-xs uppercase tracking-widest">
            Syllabus Navigation
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore ACCA Papers
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
            Select your target paper to access dedicated topic questions, CBE timed mock examinations,
            technical resources, and performance tracking.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center">
          <div className="inline-flex p-1.5 bg-slate-200/80 rounded-2xl gap-1">
            <button
              onClick={() => setActiveCategory('foundation')}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                activeCategory === 'foundation'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className="w-4 h-4" />
              Foundation & Applied Knowledge ({papers.filter((p) => p.category === 'foundation').length})
            </button>
            <button
              onClick={() => setActiveCategory('skills')}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                activeCategory === 'skills'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-4 h-4" />
              Applied Skills ({papers.filter((p) => p.category === 'skills').length})
            </button>
            <button
              onClick={() => setActiveCategory('professional')}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                activeCategory === 'professional'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              Strategic Professional ({papers.filter((p) => p.category === 'professional').length})
            </button>
          </div>
        </div>

        {/* Papers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          {filteredPapers.map((paper) => (
            <div
              key={paper.id}
              className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400 hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 font-extrabold text-sm border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition">
                    {paper.code}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                    Pass: {paper.passPercentage}%
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition leading-snug">
                    {paper.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">{paper.level}</p>
                </div>

                <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                  {paper.shortDescription}
                </p>

                <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    {paper.totalTopics} Topics
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {paper.examDurationMinutes} mins
                  </span>
                </div>
              </div>

              <div className="p-4 bg-slate-50/60 border-t border-slate-100">
                <Link
                  to={`/papers/${paper.id}`}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 bg-white hover:bg-blue-600 hover:text-white text-slate-800 text-xs font-bold rounded-xl border border-slate-200 hover:border-transparent transition shadow-xs"
                >
                  Start Learning
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE ACCA MASTER SECTION */}
      <section className="bg-slate-900 text-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-blue-400 font-bold text-xs uppercase tracking-widest">
              Unrivaled Learning Experience
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Why Prepare with ACCA Master?
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Engineered by financial educators to bridge the gap between textbook theory and real
              computer-based examination performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/80 rounded-2xl p-8 border border-slate-700/70 space-y-4 hover:border-blue-500/50 transition">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Realistic CBE Examination Engine</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Experience the authentic pressure of official computer-based examinations with countdown
                timers, question flags, and automated submission triggers.
              </p>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-8 border border-slate-700/70 space-y-4 hover:border-indigo-500/50 transition">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Topic-Wise Mastery & Explanations</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Break the vast syllabus into digestible topics. After every question attempt, read
                thorough accounting explanations citing relevant reporting rules and principles.
              </p>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-8 border border-slate-700/70 space-y-4 hover:border-emerald-500/50 transition">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Data-Driven Analytics</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Identify your weak topics before exam day. View visual score progressions, historical accuracy,
                and targeted recommendations based on actual attempts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE MCQ PRACTICE HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-950 rounded-3xl p-8 sm:p-12 text-white border border-blue-800/40 shadow-xl flex flex-col lg:flex-row items-center gap-10">
          <div className="lg:w-1/2 space-y-6">
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider border border-blue-400/30">
              Interactive Practice System
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Sharpen Your Exam Skills with Instant Feedback
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Practice questions with configurable filters: filter by difficulty (Easy, Medium, Hard),
              target unattempted questions, or review past mistakes. Bookmark questions for quick revision
              and master tricky journal entries.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/practice"
                className="px-6 py-3 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-xl shadow-md transition text-sm flex items-center gap-2"
              >
                Launch MCQ Practice <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/papers/fa1"
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl border border-slate-700 transition text-sm"
              >
                View FA1 Syllabus
              </Link>
            </div>
          </div>

          <div className="lg:w-1/2 w-full">
            {/* Live Interactive Sample Question Preview Card */}
            <div className="bg-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-100">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 text-xs font-semibold text-slate-500">
                <span className="text-blue-600 font-bold">FA1 Sample Question • 2 Marks</span>
                <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md font-semibold">
                  Intermediate
                </span>
              </div>
              <p className="font-semibold text-slate-800 text-sm sm:text-base mt-4 mb-5 leading-relaxed">
                An item with a list price of $1,000 is sold subject to a 10% trade discount and a 5% prompt
                payment discount if settled within 10 days. At what invoice value is this recorded in the Sales Daybook?
              </p>
              <div className="space-y-2.5">
                <div className="p-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-slate-50 flex items-center justify-between">
                  <span>A. $1,000</span>
                </div>
                <div className="p-3 rounded-xl border-2 border-emerald-500 bg-emerald-50 text-xs font-bold text-emerald-900 flex items-center justify-between">
                  <span>B. $900 (Trade discount deducted on invoice)</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="p-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-slate-50 flex items-center justify-between">
                  <span>C. $855</span>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-slate-50 flex items-center justify-between">
                  <span>D. $950</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-50/80 rounded-xl text-xs text-blue-900 border border-blue-100">
                <span className="font-bold">Explanation:</span> Trade discounts are deducted directly when creating
                the sales invoice ($1,000 - 10% = $900). Prompt payment discounts are only recorded if settled early.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <span className="text-blue-600 font-bold text-xs uppercase tracking-widest">Support & FAQ</span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-sm">
            Everything you need to know about preparing for your ACCA examinations with our platform.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = expandedFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden transition"
              >
                <button
                  onClick={() => setExpandedFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left font-bold text-slate-900 text-sm sm:text-base flex items-center justify-between gap-4 hover:text-blue-600 transition"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-slate-600 text-sm leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-10 sm:p-14 text-center text-white space-y-6 shadow-xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight max-w-2xl mx-auto">
            Ready to Begin Your ACCA Journey?
          </h2>
          <p className="text-blue-100 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Create your student account today to save challenging questions, monitor progress, and
            challenge yourself on realistic mock examinations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/register"
              className="px-8 py-3.5 bg-white text-blue-800 hover:bg-blue-50 font-extrabold text-base rounded-xl shadow-lg transition"
            >
              Get Started for Free
            </Link>
            <Link
              to="/practice"
              className="px-8 py-3.5 bg-blue-900/60 hover:bg-blue-900 text-white font-semibold text-base rounded-xl border border-blue-400/40 transition"
            >
              Try Practice Questions
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
