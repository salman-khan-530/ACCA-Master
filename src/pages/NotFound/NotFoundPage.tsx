import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileQuestion,
  Home,
  BookOpen,
  Award,
  ArrowLeft,
  Search,
  LayoutDashboard,
} from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-xl w-full text-center space-y-8">
        {/* Visual Badge */}
        <div className="relative inline-block">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border-2 border-blue-100 shadow-inner">
            <FileQuestion className="w-12 h-12 sm:w-14 sm:h-14 animate-pulse" />
          </div>
          <span className="absolute -bottom-2 -right-2 bg-blue-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-full shadow-md">
            404
          </span>
        </div>

        {/* Heading & Text */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Page Not Found
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
            The page you are looking for might have been moved, renamed, or is temporarily unavailable.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 font-semibold text-sm transition shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition shadow-md"
          >
            <Home className="w-4 h-4" /> Return to Home
          </Link>
        </div>

        {/* Helpful Destinations */}
        <div className="pt-6 border-t border-slate-200">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            Popular Learning Destinations
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Link
              to="/papers"
              className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-500" /> All Papers
            </Link>
            <Link
              to="/practice"
              className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <Search className="w-3.5 h-3.5 text-indigo-500" /> MCQ Practice
            </Link>
            <Link
              to="/exams"
              className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <Award className="w-3.5 h-3.5 text-amber-500" /> Mock Exams
            </Link>
            <Link
              to="/dashboard"
              className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-emerald-500" /> Dashboard
            </Link>
            <Link
              to="/faq"
              className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <FileQuestion className="w-3.5 h-3.5 text-purple-500" /> FAQ
            </Link>
            <Link
              to="/contact"
              className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <Home className="w-3.5 h-3.5 text-rose-500" /> Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
