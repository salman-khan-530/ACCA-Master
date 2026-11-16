import React, { useState, useEffect, useRef } from 'react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { useAuth } from '../../contexts/AuthContext';
import { CvProfile, CvExperience, CvEducation, CvCertification, CvLanguage, CvReference } from '../../types';
import {
  EMPTY_CV_PROFILE,
  SAMPLE_CV_PROFILE,
  ACCA_PAPERS_LIST,
  COMMON_ACCOUNTING_SKILLS,
  SUMMARY_PRESETS,
} from './defaultCvData';
import { CvPreview } from './CvPreview';
import {
  User,
  Award,
  BookOpen,
  Briefcase,
  GraduationCap,
  Sparkles,
  Palette,
  Download,
  RotateCcw,
  Plus,
  Trash2,
  Upload,
  Eye,
  Check,
  CheckCircle2,
  FileText,
  Save,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from 'lucide-react';

const STORAGE_KEY = 'acca_master_cv_draft';

const ACCENT_COLORS = [
  { name: 'ACCA Navy', hex: '#1E3A8A' },
  { name: 'Corporate Slate', hex: '#334155' },
  { name: 'Audit Emerald', hex: '#047857' },
  { name: 'Finance Burgundy', hex: '#881337' },
  { name: 'Royal Indigo', hex: '#4338CA' },
  { name: 'Steel Blue', hex: '#0284C7' },
];

export const CvBuilderPage: React.FC = () => {
  const { userProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active form section
  const [activeTab, setActiveTab] = useState<
    'personal' | 'acca' | 'summary' | 'experience' | 'education' | 'skills' | 'design'
  >('personal');

  // Mobile mode toggle: 'editor' | 'preview'
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');

  // Zoom scale for preview pane (desktop)
  const [zoomScale, setZoomScale] = useState<number>(100);

  // Custom skill input field
  const [customSkillInput, setCustomSkillInput] = useState('');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Load initial CV data (saved draft -> sample / user profile -> empty)
  const [cvProfile, setCvProfile] = useState<CvProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not read saved CV from localStorage:', e);
    }
    return SAMPLE_CV_PROFILE;
  });

  // Auto-save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cvProfile));
    } catch (e) {
      console.warn('Could not save CV draft:', e);
    }
  }, [cvProfile]);

  // Sync basic profile data if empty and user is logged in
  useEffect(() => {
    if (userProfile && !cvProfile.fullName) {
      setCvProfile((prev) => ({
        ...prev,
        fullName: userProfile.displayName || '',
        email: userProfile.email || '',
      }));
    }
  }, [userProfile]);

  // Handle Photo Upload via FileReader
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert('Photo size exceeds 3MB limit. Please choose a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setCvProfile((prev) => ({
        ...prev,
        photoUrl: result,
        showPhoto: true,
      }));
      showToast('Profile photo uploaded successfully!');
    };
    reader.readAsDataURL(file);
  };

  // Remove photo
  const handleRemovePhoto = () => {
    setCvProfile((prev) => ({ ...prev, photoUrl: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
    showToast('Profile photo removed.');
  };

  // Print / PDF Export
  const handlePrint = () => {
    window.print();
  };

  // Load Sample Profile
  const handleLoadSample = () => {
    if (window.confirm('Load sample ACCA Trainee CV profile? This will populate the fields with authentic accountant experience and credentials.')) {
      setCvProfile(SAMPLE_CV_PROFILE);
      showToast('Sample ACCA Profile loaded!');
    }
  };

  // Reset to empty
  const handleReset = () => {
    if (window.confirm('Reset CV to a clean template? Any unsaved edits will be cleared.')) {
      setCvProfile(EMPTY_CV_PROFILE);
      showToast('CV cleared to blank template.');
    }
  };

  // Experience Handlers
  const handleAddExperience = () => {
    const newExp: CvExperience = {
      id: `exp-${Date.now()}`,
      role: 'Trainee Accountant',
      company: 'Chartered Accounting Firm',
      location: 'City, Country',
      startDate: 'Jan 2024',
      endDate: 'Present',
      isCurrent: true,
      bulletPoints: ['Assisted in preparation of balance sheet reconciliations and VAT returns.'],
    };
    setCvProfile((prev) => ({ ...prev, experiences: [newExp, ...prev.experiences] }));
  };

  const handleUpdateExperience = (id: string, updated: Partial<CvExperience>) => {
    setCvProfile((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) => (exp.id === id ? { ...exp, ...updated } : exp)),
    }));
  };

  const handleDeleteExperience = (id: string) => {
    setCvProfile((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((exp) => exp.id !== id),
    }));
  };

  // Education Handlers
  const handleAddEducation = () => {
    const newEdu: CvEducation = {
      id: `edu-${Date.now()}`,
      degree: 'BSc in Accounting & Finance',
      institution: 'University Name',
      location: 'City, Country',
      startYear: '2020',
      endYear: '2023',
      grade: 'Upper Second Class (2:1)',
    };
    setCvProfile((prev) => ({ ...prev, education: [...prev.education, newEdu] }));
  };

  const handleUpdateEducation = (id: string, updated: Partial<CvEducation>) => {
    setCvProfile((prev) => ({
      ...prev,
      education: prev.education.map((edu) => (edu.id === id ? { ...edu, ...updated } : edu)),
    }));
  };

  const handleDeleteEducation = (id: string) => {
    setCvProfile((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  };

  // Skill Handlers
  const handleToggleSkill = (skill: string) => {
    setCvProfile((prev) => {
      const exists = prev.skills.includes(skill);
      return {
        ...prev,
        skills: exists ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill],
      };
    });
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customSkillInput.trim();
    if (!trimmed) return;
    if (!cvProfile.skills.includes(trimmed)) {
      setCvProfile((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
    }
    setCustomSkillInput('');
  };

  // ACCA Paper Toggle
  const handleTogglePaper = (paperCode: string) => {
    setCvProfile((prev) => {
      const exists = prev.accaPassedPapers.includes(paperCode);
      return {
        ...prev,
        accaPassedPapers: exists
          ? prev.accaPassedPapers.filter((p) => p !== paperCode)
          : [...prev.accaPassedPapers, paperCode],
      };
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumbs Navigation */}
      <Breadcrumbs items={[{ label: 'Career Tools', to: '/resources' }, { label: 'ACCA Professional CV Maker' }]} />

      {/* Top Banner & Action Controls */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 print:hidden">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Interactive ACCA Resume Builder</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Professional Accountancy CV Maker
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
            Build, tailor, and export an authentic accountancy CV in real-time. Features ACCA paper tracking,
            IFRS competency banks, photo uploads, and print-ready PDF formatting.
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleLoadSample}
            type="button"
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition flex items-center gap-1.5 shadow-xs"
            title="Load authentic sample trainee accountant data"
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" /> Load Sample
          </button>
          <button
            onClick={handleReset}
            type="button"
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 transition flex items-center gap-1.5 shadow-xs"
            title="Clear all fields"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
          <button
            onClick={handlePrint}
            type="button"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Download / Print PDF
          </button>
        </div>
      </div>

      {/* Mobile Mode Switcher (Hidden on Desktop) */}
      <div className="flex lg:hidden bg-slate-100 p-1.5 rounded-2xl border border-slate-200 print:hidden">
        <button
          onClick={() => setMobileView('editor')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            mobileView === 'editor' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
          }`}
        >
          <FileText className="w-4 h-4" /> Form Editor
        </button>
        <button
          onClick={() => setMobileView('preview')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            mobileView === 'preview' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
          }`}
        >
          <Eye className="w-4 h-4" /> Live CV Preview
        </button>
      </div>

      {/* MAIN DUAL-PANE WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT PANE: INTERACTIVE FORM EDITOR */}
        <div
          className={`lg:col-span-6 space-y-6 ${
            mobileView === 'preview' ? 'hidden lg:block' : 'block'
          } print:hidden`}
        >
          {/* Section Navigation Tabs */}
          <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap gap-1">
            <button
              onClick={() => setActiveTab('personal')}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                activeTab === 'personal'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <User className="w-3.5 h-3.5" /> Personal & Photo
            </button>
            <button
              onClick={() => setActiveTab('acca')}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                activeTab === 'acca'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Award className="w-3.5 h-3.5" /> ACCA Papers
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                activeTab === 'summary'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" /> Summary
            </button>
            <button
              onClick={() => setActiveTab('experience')}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                activeTab === 'experience'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" /> Experience
            </button>
            <button
              onClick={() => setActiveTab('education')}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                activeTab === 'education'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" /> Education
            </button>
            <button
              onClick={() => setActiveTab('skills')}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                activeTab === 'skills'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> Skills & Certs
            </button>
            <button
              onClick={() => setActiveTab('design')}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                activeTab === 'design'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Palette className="w-3.5 h-3.5" /> Template Style
            </button>
          </div>

          {/* TAB 1: PERSONAL DETAILS & PHOTO UPLOAD */}
          {activeTab === 'personal' && (
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" /> Personal Information & Photo
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Your core contact identity details shown in the CV header.
                </p>
              </div>

              {/* Photo Upload Widget */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative">
                    {cvProfile.photoUrl ? (
                      <img
                        src={cvProfile.photoUrl}
                        alt="Profile Preview"
                        className={`w-20 h-20 object-cover border-2 border-blue-500 shadow-xs ${
                          cvProfile.photoShape === 'circle'
                            ? 'rounded-full'
                            : cvProfile.photoShape === 'rounded'
                            ? 'rounded-2xl'
                            : 'rounded-none'
                        }`}
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-slate-200 text-slate-400 flex flex-col items-center justify-center border-2 border-dashed border-slate-300">
                        <User className="w-8 h-8" />
                        <span className="text-[10px] font-bold mt-1">No Photo</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 text-center sm:text-left flex-1">
                    <p className="text-xs font-bold text-slate-800">Profile Picture / Headshot</p>
                    <p className="text-[11px] text-slate-500">
                      Upload a clean, professional headshot (JPG or PNG up to 3MB).
                    </p>
                    <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                      <label className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl cursor-pointer transition inline-flex items-center gap-1.5 shadow-xs">
                        <Upload className="w-3 h-3" /> Upload Picture
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                      {cvProfile.photoUrl && (
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="px-3 py-1.5 bg-slate-200 hover:bg-red-50 hover:text-red-600 text-slate-700 font-bold text-xs rounded-xl transition"
                        >
                          Remove Photo
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Photo Display Toggles */}
                <div className="pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 select-none">
                    <input
                      type="checkbox"
                      checked={cvProfile.showPhoto}
                      onChange={(e) => setCvProfile({ ...cvProfile, showPhoto: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    />
                    <span>Show photo on CV</span>
                  </label>

                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className="text-slate-500 font-medium">Shape:</span>
                    {(['rounded', 'circle', 'square'] as const).map((shape) => (
                      <button
                        key={shape}
                        type="button"
                        onClick={() => setCvProfile({ ...cvProfile, photoShape: shape })}
                        className={`px-2 py-0.5 rounded-lg font-bold capitalize transition ${
                          cvProfile.photoShape === shape
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-slate-600 border border-slate-200'
                        }`}
                      >
                        {shape}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form Input Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    value={cvProfile.fullName}
                    onChange={(e) => setCvProfile({ ...cvProfile, fullName: e.target.value })}
                    placeholder="e.g. Alexander Wright"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Professional Job Title *</label>
                  <input
                    type="text"
                    value={cvProfile.jobTitle}
                    onChange={(e) => setCvProfile({ ...cvProfile, jobTitle: e.target.value })}
                    placeholder="e.g. ACCA Part-Qualified | Trainee Accountant"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={cvProfile.email}
                    onChange={(e) => setCvProfile({ ...cvProfile, email: e.target.value })}
                    placeholder="e.g. alexander@example.com"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Hotline *</label>
                  <input
                    type="text"
                    value={cvProfile.phone}
                    onChange={(e) => setCvProfile({ ...cvProfile, phone: e.target.value })}
                    placeholder="e.g. +44 7700 900123"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Location / Country *</label>
                  <input
                    type="text"
                    value={cvProfile.location}
                    onChange={(e) => setCvProfile({ ...cvProfile, location: e.target.value })}
                    placeholder="e.g. London, United Kingdom"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">LinkedIn Profile</label>
                  <input
                    type="text"
                    value={cvProfile.linkedinUrl || ''}
                    onChange={(e) => setCvProfile({ ...cvProfile, linkedinUrl: e.target.value })}
                    placeholder="e.g. linkedin.com/in/alexanderwright"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ACCA STATUS & EXAM PAPERS TRACKER */}
          {activeTab === 'acca' && (
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-600" /> ACCA Credentials & Examination Progress
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Highlight your exact qualification tier and all passed exam papers for recruiters.
                </p>
              </div>

              {/* Status & Registration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ACCA Qualification Status</label>
                  <select
                    value={cvProfile.accaStatus}
                    onChange={(e) => setCvProfile({ ...cvProfile, accaStatus: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    <option value="ACCA Student">ACCA Student (Early Exams)</option>
                    <option value="Part-Qualified (Applied Knowledge Passed)">Part-Qualified (Applied Knowledge Passed)</option>
                    <option value="Part-Qualified (Applied Skills Completed)">Part-Qualified (Applied Skills Completed)</option>
                    <option value="ACCA Finalist (Strategic Professional in Progress)">ACCA Finalist (Strategic Professional in Progress)</option>
                    <option value="ACCA Affiliate (All 13 Exams Passed)">ACCA Affiliate (All 13 Exams Passed)</option>
                    <option value="ACCA Member">ACCA Member (Exams + PER Complete)</option>
                    <option value="Foundations in Accountancy (FIA)">Foundations in Accountancy (FIA)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">ACCA Registration ID</label>
                  <input
                    type="text"
                    value={cvProfile.accaRegistrationNumber || ''}
                    onChange={(e) => setCvProfile({ ...cvProfile, accaRegistrationNumber: e.target.value })}
                    placeholder="e.g. 3489215"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              {/* PER & Ethics Modules */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-800">Practical Experience Requirement (PER)</p>
                    <p className="text-[11px] text-slate-500">Document your 36-month work experience progress.</p>
                  </div>
                  <input
                    type="text"
                    value={cvProfile.perProgress || ''}
                    onChange={(e) => setCvProfile({ ...cvProfile, perProgress: e.target.value })}
                    placeholder="e.g. 18 / 36 Months Completed"
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs w-48 text-right font-medium"
                  />
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-800">Ethics and Professional Skills Module (EPSM)</p>
                    <p className="text-[11px] text-slate-500">Mandatory online module for ACCA qualification.</p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-blue-600">
                    <input
                      type="checkbox"
                      checked={cvProfile.epsmCompleted}
                      onChange={(e) => setCvProfile({ ...cvProfile, epsmCompleted: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    />
                    <span>Completed</span>
                  </label>
                </div>
              </div>

              {/* Papers Checklist */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Select Completed Papers ({cvProfile.accaPassedPapers.length} Selected)
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      setCvProfile({
                        ...cvProfile,
                        accaPassedPapers:
                          cvProfile.accaPassedPapers.length === ACCA_PAPERS_LIST.length
                            ? []
                            : ACCA_PAPERS_LIST.map((p) => p.code),
                      })
                    }
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-700 underline"
                  >
                    {cvProfile.accaPassedPapers.length === ACCA_PAPERS_LIST.length ? 'Clear All' : 'Select All'}
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ACCA_PAPERS_LIST.map((paper) => {
                    const isChecked = cvProfile.accaPassedPapers.includes(paper.code);
                    return (
                      <button
                        key={paper.code}
                        type="button"
                        onClick={() => handleTogglePaper(paper.code)}
                        className={`p-2.5 rounded-xl border text-left transition flex items-start gap-2 ${
                          isChecked
                            ? 'bg-blue-50/80 border-blue-500 text-blue-900 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                            isChecked ? 'bg-blue-600 text-white' : 'border border-slate-300'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-extrabold text-xs">{paper.code}</p>
                          <p className="text-[10px] text-slate-500 truncate">{paper.name}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PROFESSIONAL SUMMARY & PRESETS */}
          {activeTab === 'summary' && (
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" /> Professional Summary
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  A compelling 3-4 sentence elevator pitch articulating your financial knowledge and career goals.
                </p>
              </div>

              {/* 1-Click Smart Presets */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" /> 1-Click Pre-written Templates:
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {SUMMARY_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCvProfile({ ...cvProfile, summary: preset.text })}
                      className="p-3 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 rounded-2xl border border-slate-200 text-left transition space-y-1"
                    >
                      <p className="font-bold text-xs text-slate-800 flex items-center justify-between">
                        <span>{preset.title}</span>
                        <span className="text-[10px] text-blue-600 font-semibold">Click to Apply &rarr;</span>
                      </p>
                      <p className="text-[11px] text-slate-600 line-clamp-2">{preset.text}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Area */}
              <div>
                <label className="block font-bold text-slate-700 text-xs mb-1">Your Summary Text</label>
                <textarea
                  rows={5}
                  value={cvProfile.summary}
                  onChange={(e) => setCvProfile({ ...cvProfile, summary: e.target.value })}
                  placeholder="Detail your accounting background, IFRS familiarity, audit experience, and target roles..."
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs leading-relaxed focus:bg-white focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          )}

          {/* TAB 4: WORK EXPERIENCE & INTERNSHIPS */}
          {activeTab === 'experience' && (
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-blue-600" /> Accounting & Work Experience
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Highlight audit engagements, reconciliations, invoice processing, and financial reporting.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddExperience}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-xs transition"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Role
                </button>
              </div>

              <div className="space-y-4">
                {cvProfile.experiences.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 text-xs">
                    No work experience entries added yet. Click &quot;Add Role&quot; or &quot;Load Sample&quot; to begin.
                  </div>
                ) : (
                  cvProfile.experiences.map((exp, expIdx) => (
                    <div
                      key={exp.id}
                      className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-3"
                    >
                      <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                        <span className="font-extrabold text-xs text-blue-600">Position #{expIdx + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteExperience(exp.id)}
                          className="text-red-500 hover:text-red-700 text-xs font-semibold flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Job Role / Title *</label>
                          <input
                            type="text"
                            value={exp.role}
                            onChange={(e) => handleUpdateExperience(exp.id, { role: e.target.value })}
                            placeholder="e.g. Audit Trainee / Accounts Assistant"
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Company / Firm *</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => handleUpdateExperience(exp.id, { company: e.target.value })}
                            placeholder="e.g. KPMG LLP / Local Audit Practice"
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Start Date</label>
                          <input
                            type="text"
                            value={exp.startDate}
                            onChange={(e) => handleUpdateExperience(exp.id, { startDate: e.target.value })}
                            placeholder="e.g. Jan 2024"
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">End Date</label>
                          <input
                            type="text"
                            value={exp.isCurrent ? 'Present' : exp.endDate}
                            disabled={exp.isCurrent}
                            onChange={(e) => handleUpdateExperience(exp.id, { endDate: e.target.value })}
                            placeholder="e.g. Dec 2024 or Present"
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl disabled:bg-slate-100"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 text-xs mb-1">
                          Key Achievements & Responsibilities (one per line)
                        </label>
                        <textarea
                          rows={3}
                          value={exp.bulletPoints.join('\n')}
                          onChange={(e) =>
                            handleUpdateExperience(exp.id, {
                              bulletPoints: e.target.value.split('\n').filter((l) => l.trim().length > 0),
                            })
                          }
                          placeholder="Conducted monthly bank reconciliations for 15+ accounts...&#10;Tested sales invoice samples against delivery notes...&#10;Drafted trial balances and variance schedules..."
                          className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs"
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 5: EDUCATION & ACADEMICS */}
          {activeTab === 'education' && (
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-blue-600" /> Education & Academic Background
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Degrees, diplomas, university qualifications, and academic awards.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddEducation}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-xs transition"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Degree
                </button>
              </div>

              <div className="space-y-4">
                {cvProfile.education.map((edu, idx) => (
                  <div key={edu.id} className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                      <span className="font-extrabold text-xs text-blue-600">Qualification #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteEducation(edu.id)}
                        className="text-red-500 hover:text-red-700 text-xs font-semibold flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Degree / Course Name *</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => handleUpdateEducation(edu.id, { degree: e.target.value })}
                          placeholder="e.g. BSc (Hons) in Accounting"
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">University / College *</label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => handleUpdateEducation(edu.id, { institution: e.target.value })}
                          placeholder="e.g. University of Manchester"
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Years (Start - End)</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={edu.startYear}
                            onChange={(e) => handleUpdateEducation(edu.id, { startYear: e.target.value })}
                            placeholder="2021"
                            className="w-1/2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl"
                          />
                          <input
                            type="text"
                            value={edu.endYear}
                            onChange={(e) => handleUpdateEducation(edu.id, { endYear: e.target.value })}
                            placeholder="2024"
                            className="w-1/2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Grade / Honors</label>
                        <input
                          type="text"
                          value={edu.grade || ''}
                          onChange={(e) => handleUpdateEducation(edu.id, { grade: e.target.value })}
                          placeholder="e.g. First Class Honours / 3.8 GPA"
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SKILLS, CERTIFICATIONS & LANGUAGES */}
          {activeTab === 'skills' && (
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" /> Accounting Competencies & Certifications
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select key skills that finance and audit employers search for on resumes.
                </p>
              </div>

              {/* Quick-add Common Accounting Skills */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Popular Accounting Skills Bank (Click to Toggle)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_ACCOUNTING_SKILLS.map((skill) => {
                    const isSelected = cvProfile.skills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleToggleSkill(skill)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {skill} {isSelected ? '✓' : '+'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Add Custom Skill Form */}
              <form onSubmit={handleAddCustomSkill} className="flex gap-2">
                <input
                  type="text"
                  value={customSkillInput}
                  onChange={(e) => setCustomSkillInput(e.target.value)}
                  placeholder="Add custom skill (e.g. SAGE 50, Forensic Audit)..."
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Add Skill
                </button>
              </form>
            </div>
          )}

          {/* TAB 7: DESIGN, TEMPLATE & ACCENT COLOR */}
          {activeTab === 'design' && (
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-blue-600" /> Template Theme & Styling
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Customize the look, header layout, and color accents of your curriculum vitae.
                </p>
              </div>

              {/* Template Styles */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Select CV Template Layout
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'executive', name: 'Executive Modern', desc: 'Two-column layout with bold colored sidebar' },
                    { id: 'classic', name: 'Corporate Standard', desc: 'Classic horizontal dividers favored by Big 4 firms' },
                    { id: 'modern', name: 'Clean Minimalist', desc: 'Top accent strip with badge pills and modern spacing' },
                  ].map((tpl) => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => setCvProfile({ ...cvProfile, theme: tpl.id as any })}
                      className={`p-4 rounded-2xl border text-left transition space-y-1 ${
                        cvProfile.theme === tpl.id
                          ? 'border-blue-600 bg-blue-50/70 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <p className="font-extrabold text-xs text-slate-900">{tpl.name}</p>
                      <p className="text-[11px] text-slate-500">{tpl.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent Color Palette */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Select Accent Color
                </label>
                <div className="flex flex-wrap gap-3">
                  {ACCENT_COLORS.map((color) => (
                    <button
                      key={color.hex}
                      type="button"
                      onClick={() => setCvProfile({ ...cvProfile, accentColor: color.hex })}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                        cvProfile.accentColor === color.hex
                          ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-600/30'
                          : 'border-slate-200 text-slate-700'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full shadow-inner shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span>{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANE: REAL-TIME LIVE CV CANVAS */}
        <div
          className={`lg:col-span-6 space-y-4 ${
            mobileView === 'editor' ? 'hidden lg:block' : 'block'
          }`}
        >
          {/* Preview Toolbar */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 print:hidden">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-800">Live Real-time Preview</span>
              <span className="text-slate-400 text-xs">|</span>
              <span className="text-xs text-slate-500 capitalize">{cvProfile.theme} Template</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setZoomScale((prev) => Math.max(70, prev - 10))}
                className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold text-slate-700 w-10 text-center">{zoomScale}%</span>
              <button
                type="button"
                onClick={() => setZoomScale((prev) => Math.min(130, prev + 10))}
                className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 ml-2"
              >
                <Download className="w-3.5 h-3.5" /> PDF
              </button>
            </div>
          </div>

          {/* Canvas Wrapper with Zoom Scaling */}
          <div className="overflow-x-auto bg-slate-200/60 p-4 sm:p-6 rounded-3xl border border-slate-300 shadow-inner">
            <div
              style={{
                transform: `scale(${zoomScale / 100})`,
                transformOrigin: 'top center',
                transition: 'transform 0.15s ease-out',
              }}
            >
              <CvPreview profile={cvProfile} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CvBuilderPage;
