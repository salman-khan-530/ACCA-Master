import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ACCA_PAPERS } from '../../data/papersData';
import {
  User,
  Mail,
  Shield,
  BookOpen,
  Eye,
  CheckCircle2,
  Save,
  AlertCircle,
  Calendar,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { userProfile, updateProfileDetails } = useAuth();

  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
  const [selectedPapers, setSelectedPapers] = useState<string[]>(
    userProfile?.selectedPapers || ['fa1']
  );
  const [leaderboardOptIn, setLeaderboardOptIn] = useState<boolean>(
    userProfile?.leaderboardOptIn ?? true
  );

  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  if (!userProfile) return null;

  const togglePaper = (paperId: string) => {
    setSelectedPapers((prev) =>
      prev.includes(paperId) ? prev.filter((p) => p !== paperId) : [...prev, paperId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);

    if (!displayName.trim()) {
      setError('Name cannot be empty.');
      return;
    }

    try {
      setSaving(true);
      await updateProfileDetails({
        displayName: displayName.trim(),
        selectedPapers,
        leaderboardOptIn,
      });
      setSuccess('Profile and study preferences updated successfully!');
    } catch (err: any) {
      setError(err?.message || 'Failed to update profile settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Student Profile</h1>
        <p className="text-slate-600 text-sm mt-1">
          Manage your personal information, enrolled ACCA papers, and privacy preferences.
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Account Snapshot Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-700 text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-bold text-slate-900">{displayName}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
                {userProfile.role}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                Active Account
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" /> {userProfile.email}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Member since{' '}
                {new Date(userProfile.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* General Details */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Personal Information
          </h3>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Full Display Name
            </label>
            <div className="relative max-w-md">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Account Email Address
            </label>
            <div className="relative max-w-md">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={userProfile.email}
                disabled
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Email address is linked to your primary authentication record.
            </p>
          </div>
        </div>

        {/* Enrolled Papers */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Enrolled ACCA Papers</h3>
              <p className="text-xs text-slate-500">
                Select the papers you are currently studying. These will appear highlighted on your dashboard.
              </p>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
              {selectedPapers.length} Selected
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
            {ACCA_PAPERS.map((paper) => {
              const isSelected = selectedPapers.includes(paper.id);
              return (
                <button
                  type="button"
                  key={paper.id}
                  onClick={() => togglePaper(paper.id)}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/70 text-blue-900 ring-1 ring-blue-500'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm">{paper.code}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                  </div>
                  <span className="text-[11px] text-slate-500 line-clamp-1 mt-1">{paper.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Privacy & Leaderboard Settings */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Privacy & Leaderboard Visibility
          </h3>
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="leaderboardOptIn"
              checked={leaderboardOptIn}
              onChange={(e) => setLeaderboardOptIn(e.target.checked)}
              className="mt-1 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
            />
            <div>
              <label htmlFor="leaderboardOptIn" className="text-sm font-bold text-slate-900 block">
                Participate in Public Student Leaderboard
              </label>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                When enabled, your display name and academic score points from verified examinations will be
                visible on the global rankings. Your email address is never published.
              </p>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition shadow-blue-500/20 text-sm flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving Changes...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};
