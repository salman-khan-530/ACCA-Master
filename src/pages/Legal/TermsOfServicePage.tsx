import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, CheckCircle2, AlertTriangle, Shield, ArrowLeft } from 'lucide-react';

export const TermsOfServicePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Terms of Service</h1>
            <p className="text-sm text-slate-500">Effective Date: November 2026 | Platform Version: ACCA Master 2.0</p>
          </div>
        </div>
        <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
          By accessing or using the ACCA Master platform, you agree to comply with and be bound by these
          Terms of Service. If you disagree with any part of these terms, please refrain from using the platform.
        </p>
      </div>

      {/* Terms Content */}
      <div className="space-y-8 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xs">
        {/* Section 1: Disclaimers */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            1. Independent Educational Platform & Trademark Notice
          </h2>
          <div className="text-sm text-slate-600 space-y-2 leading-relaxed">
            <p className="bg-amber-50/80 p-4 rounded-xl border border-amber-200 text-amber-900">
              ACCA Master is an independent open educational revision system. It is <strong>not</strong> affiliated with,
              endorsed by, authorized, or sponsored by the Association of Chartered Certified Accountants (ACCA). 
              &quot;ACCA&quot;, &quot;FIA&quot;, &quot;CBE&quot;, and individual paper designations (e.g., &quot;FA1&quot;, &quot;PM&quot;, &quot;SBL&quot;)
              are registered trademarks of the Association of Chartered Certified Accountants.
            </p>
            <p>
              Practice questions and mock examinations provided on this platform are developed independently for revision,
              conceptual strengthening, and diagnostic evaluation purposes. They do not constitute official past examination papers
              unless expressly stated and properly cited under fair educational use.
            </p>
          </div>
        </section>

        {/* Section 2: Account Terms */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            2. Student Account Security & Eligibility
          </h2>
          <div className="text-sm text-slate-600 space-y-2 leading-relaxed">
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
              <li>
                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
              </li>
              <li>
                You must provide accurate, current, and complete information during registration.
              </li>
              <li>
                Any attempt to manipulate client code, spoof administrative credentials, or artificially inflate exam scores on the Leaderboard may result in immediate account suspension.
              </li>
            </ul>
          </div>
        </section>

        {/* Section 3: Acceptable Use */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            3. Permitted Platform Use
          </h2>
          <div className="text-sm text-slate-600 space-y-2 leading-relaxed">
            <p>You agree to use ACCA Master exclusively for legitimate, personal educational preparation. You agree not to:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
              <li>Scrape, extract, or bulk-harvest questions, answer explanations, or candidate data using automated bots or scripts.</li>
              <li>Circumvent or attempt to circumvent security rules, access controls, or client-side answer protection systems.</li>
              <li>Use the platform or its community communication channels to post abusive, defamatory, or unlawful content.</li>
            </ul>
          </div>
        </section>

        {/* Section 4: Limitation of Liability */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">4. Examination Warranty Disclaimer</h2>
          <div className="text-sm text-slate-600 space-y-2 leading-relaxed">
            <p>
              While we strive to ensure that all mock questions, explanations, formulas, and syllabus references are accurate and updated
              in line with current accounting standards (IFRS / UK GAAP / ISA), ACCA Master provides content on an &quot;as-is&quot; basis. 
              We do not guarantee that practicing on this platform guarantees a passing score in your official ACCA examination session.
            </p>
          </div>
        </section>

        {/* Section 5: Modifications */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">5. Changes to These Terms</h2>
          <div className="text-sm text-slate-600 space-y-2 leading-relaxed">
            <p>
              We reserve the right to revise or modify these Terms of Service at any time. Any changes will be published directly
              on this page with an updated effective date. Continued usage of the platform following any modifications constitutes
              your acceptance of the updated terms.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
