import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../../components/common/Logo';
import {
  ShieldCheck,
  Target,
  Award,
  BookOpen,
  Users,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Hero */}
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-4">
          <Logo size="lg" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Democratizing ACCA Examination Excellence
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          ACCA Master is an open, independent educational technology initiative designed to provide
          finance and accountancy candidates worldwide with high-fidelity computer-based exam practice.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center font-bold">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Our Core Mission</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Many aspiring accountants study textbook theory thoroughly, but stumble when confronted by
            timed computer-based examination formats and complex double-entry twists. Our mission is to
            provide structured, accessible, topic-wise practice and authentic timed mock simulations that
            build genuine CBE test resilience.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Open Educational Values</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            We believe that geographic or economic barriers should not prevent passionate learners from
            qualifying as professional accountants. All core question drills, mock tests, and analytics
            are available without subscriptions or hidden paywalls.
          </p>
        </div>
      </div>

      {/* Principles & Disclaimers */}
      <div className="bg-slate-900 text-slate-300 p-8 sm:p-10 rounded-3xl space-y-4">
        <div className="flex items-center gap-2 text-white font-bold text-lg">
          <BookOpen className="w-5 h-5 text-blue-400" />
          <span>Independent Educational Platform Statement</span>
        </div>
        <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
          ACCA Master operates as an independent revision tool. ACCA, FIA, Foundations in Accountancy,
          and specific examination titles (FA1, PM, SBL, etc.) are registered trademarks of the
          Association of Chartered Certified Accountants. ACCA Master does not publish confidential
          exam materials or claim any official partnership. All questions are crafted independently by
          accounting educators to mirror typical examination difficulty.
        </p>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <Link
          to="/practice"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition"
        >
          Start Practicing Now <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
