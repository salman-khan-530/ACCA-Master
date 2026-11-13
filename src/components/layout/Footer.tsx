import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { dbService, DEFAULT_PLATFORM_SETTINGS } from '../../services/dbService';
import { PlatformSettings } from '../../types';
import {
  Mail,
  MessageSquare,
  Video,
  Shield,
  BookOpen,
  Award,
  Globe,
  ExternalLink,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const [settings, setSettings] = useState<PlatformSettings>(DEFAULT_PLATFORM_SETTINGS);

  useEffect(() => {
    dbService.getPlatformSettings().then((s) => setSettings(s));
  }, []);

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Top Banner / Community Callout */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border-b border-blue-950/50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Join the ACCA Master Community
            </h3>
            <p className="text-blue-200/90 text-sm mt-1 max-w-xl">
              Connect with fellow global students, participate in weekly mock exam discussions, and receive verified study guidance.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={settings.whatsAppGroupUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2.5 rounded-xl shadow-md transition text-sm"
            >
              <MessageSquare className="w-4 h-4" />
              Join WhatsApp Study Group
            </a>
            <Link
              to="/resources"
              className="inline-flex items-center gap-2 bg-slate-800/80 hover:bg-slate-800 text-slate-100 font-semibold px-4 py-2.5 rounded-xl border border-slate-700 transition text-sm"
            >
              <BookOpen className="w-4 h-4" />
              Explore Syllabus Library
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="light" size="lg" />
            <p className="text-slate-400 text-sm leading-relaxed max-w-md mt-4">
              ACCA Master is a dedicated, comprehensive learning management platform empowering accountancy
              candidates worldwide with computer-based exam practice, authentic questions, syllabus guidance,
              and in-depth analytics.
            </p>
            <div className="pt-2 flex items-center space-x-3 text-slate-400">
              <a
                href={settings.youTubeChannelUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-red-600 hover:text-white flex items-center justify-center transition"
                aria-label="YouTube Channel"
              >
                <Video className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${settings.officialEmail}`}
                className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-blue-600 hover:text-white flex items-center justify-center transition"
                aria-label="Email Us"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href={settings.whatsAppGroupUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition"
                aria-label="Join WhatsApp Group"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Foundation Level Papers */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-400" />
              Foundation Papers
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/papers/fa1" className="hover:text-blue-400 transition">
                  FA1 – Financial Transactions
                </Link>
              </li>
              <li>
                <Link to="/papers/fa2" className="hover:text-blue-400 transition">
                  FA2 – Maintaining Financial Records
                </Link>
              </li>
              <li>
                <Link to="/papers/ma1" className="hover:text-blue-400 transition">
                  MA1 – Management Information
                </Link>
              </li>
              <li>
                <Link to="/papers/ma2" className="hover:text-blue-400 transition">
                  MA2 – Costs and Finance
                </Link>
              </li>
              <li>
                <Link to="/papers/fbt" className="hover:text-blue-400 transition">
                  FBT – Business & Technology
                </Link>
              </li>
              <li>
                <Link to="/papers/ffa" className="hover:text-blue-400 transition">
                  FFA – Financial Accounting
                </Link>
              </li>
            </ul>
          </div>

          {/* Applied Skills & Professional */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-400" />
              Skills & Professional
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/papers/pm" className="hover:text-blue-400 transition">
                  PM – Performance Management
                </Link>
              </li>
              <li>
                <Link to="/papers/tx" className="hover:text-blue-400 transition">
                  TX – Taxation
                </Link>
              </li>
              <li>
                <Link to="/papers/fr" className="hover:text-blue-400 transition">
                  FR – Financial Reporting
                </Link>
              </li>
              <li>
                <Link to="/papers/aa" className="hover:text-blue-400 transition">
                  AA – Audit and Assurance
                </Link>
              </li>
              <li>
                <Link to="/papers/fm" className="hover:text-blue-400 transition">
                  FM – Financial Management
                </Link>
              </li>
              <li>
                <Link to="/papers/sbl" className="hover:text-blue-400 transition">
                  SBL – Strategic Business Leader
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Resources */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              Platform Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/practice" className="hover:text-blue-400 transition">
                  MCQ Practice Engine
                </Link>
              </li>
              <li>
                <Link to="/exams" className="hover:text-blue-400 transition">
                  Timed Mock Exams
                </Link>
              </li>
              <li>
                <Link to="/resources" className="hover:text-blue-400 transition">
                  Study Resources & Notes
                </Link>
              </li>
              <li>
                <Link to="/resources?category=examiner_reports" className="hover:text-blue-400 transition">
                  Examiner Insights & Reports
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="hover:text-blue-400 transition">
                  Global Leaderboard
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-400 transition">
                  About ACCA Master
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-blue-400 transition">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-400 transition">
                  Contact & Community
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory & Trademark Disclaimer */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 text-xs text-slate-500 leading-relaxed space-y-3">
          <p className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-slate-400">
            <strong className="text-slate-300 font-semibold block mb-1">Affiliation & Copyright Notice:</strong>
            ACCA Master is an independent online learning platform and is not affiliated with, authorized, maintained, sponsored, or endorsed by the Association of Chartered Certified Accountants (ACCA). ACCA, FIA, CBE, and related paper names are trademarks of the Association of Chartered Certified Accountants. All third-party study material references and external links remain the intellectual property of their respective creators and are cited for legitimate educational purposes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between text-slate-500 text-xs gap-4 pt-2">
            <p>&copy; {new Date().getFullYear()} ACCA Master. All rights reserved.</p>
            <div className="flex items-center space-x-6">
              <Link to="/privacy" className="hover:text-slate-400 transition">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-slate-400 transition">
                Terms of Service
              </Link>
              <Link to="/faq" className="hover:text-slate-400 transition">
                FAQ & Help
              </Link>
              <Link to="/contact" className="hover:text-slate-400 transition">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
