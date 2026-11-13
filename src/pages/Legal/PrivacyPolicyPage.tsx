import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Eye, Database, Bell, ArrowLeft } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
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
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Privacy Policy</h1>
            <p className="text-sm text-slate-500">Effective Date: November 2026 | Platform Version: ACCA Master 2.0</p>
          </div>
        </div>
        <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
          ACCA Master (&quot;we&quot;, &quot;our&quot;, or &quot;the platform&quot;) values your personal privacy and is committed
          to safeguarding the data you share while preparing for your professional accountancy examinations. This Privacy
          Policy outlines how we collect, store, protect, and use your information.
        </p>
      </div>

      {/* Policy Sections */}
      <div className="space-y-8 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xs">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-600" />
            1. Information We Collect
          </h2>
          <div className="text-sm text-slate-600 space-y-2 leading-relaxed">
            <p>We collect only the minimum required information to provide an authentic, high-quality learning experience:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
              <li>
                <strong>Account Credentials:</strong> Email address, user display name, and password hash (handled securely via Google Firebase Authentication; we never store plain-text passwords).
              </li>
              <li>
                <strong>Study Preferences & Syllabus Targets:</strong> The specific ACCA or FIA papers you are actively studying (e.g., FA1, PM, SBL).
              </li>
              <li>
                <strong>Exam Performance Data:</strong> Practice attempt scores, topic-wise accuracy, time spent per question, bookmark selections, and mock exam results.
              </li>
              <li>
                <strong>Local Diagnostic Data:</strong> Browser session information to autosave in-progress exam states so that you do not lose answers if your browser is accidentally refreshed.
              </li>
            </ul>
          </div>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-600" />
            2. How We Use Your Data
          </h2>
          <div className="text-sm text-slate-600 space-y-2 leading-relaxed">
            <p>Your data is processed strictly for educational functionality:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
              <li>Generating your personal Student Dashboard analytics and topic mastery breakdown.</li>
              <li>Maintaining your saved and bookmarked questions for revision drills.</li>
              <li>Optionally displaying your performance on the community Leaderboard (you can customize your display name at any time in Profile Settings).</li>
              <li>Preventing unauthorized exam tampering and ensuring strict Computer-Based Exam (CBE) simulation integrity.</li>
            </ul>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            3. Data Security and Cloud Storage
          </h2>
          <div className="text-sm text-slate-600 space-y-2 leading-relaxed">
            <p>
              We enforce strict Role-Based Access Control (RBAC) and database-level security rules:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
              <li>
                <strong>Client-Isolated Queries:</strong> Your private profile and past exam attempts are locked to your individual authenticated user ID and cannot be viewed or queried by other students.
              </li>
              <li>
                <strong>Anti-Tamper Protections:</strong> Submitted mock exam attempts are permanently frozen against retroactive modification.
              </li>
              <li>
                <strong>Encrypted Cloud Storage:</strong> Cloud records are managed in Google Cloud Firestore with end-to-end transport encryption (HTTPS/TLS) and resting storage encryption.
              </li>
            </ul>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-600" />
            4. Third-Party Sharing & Marketing
          </h2>
          <div className="text-sm text-slate-600 space-y-2 leading-relaxed">
            <p>
              We do <strong>not</strong> sell, rent, or trade your personal information with external advertising agencies or brokers. 
              Our platform does not embed third-party tracking pixels or intrusive marketing ad networks. 
              External community links (such as WhatsApp study groups and YouTube channels) are optional third-party platforms governed by their respective privacy terms.
            </p>
          </div>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-600" />
            5. Your Rights and Data Deletion
          </h2>
          <div className="text-sm text-slate-600 space-y-2 leading-relaxed">
            <p>
              You maintain full control over your educational footprint. You can update your display name and target papers directly in your{' '}
              <Link to="/profile" className="text-blue-600 underline font-medium">Profile</Link>. 
              If you wish to completely delete your account and associated attempt history, you can submit a request through our{' '}
              <Link to="/contact" className="text-blue-600 underline font-medium">Contact Page</Link>{' '}
              or reach our administrative team directly.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
