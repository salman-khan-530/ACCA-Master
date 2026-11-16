import React from 'react';
import { CvProfile } from '../../types';
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Award,
  BookOpen,
  Briefcase,
  GraduationCap,
  CheckCircle2,
  FileCheck,
  Languages,
  User,
} from 'lucide-react';

const LinkedinIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = ({
  className = 'w-3.5 h-3.5',
  style,
}) => (
  <svg className={className} style={style} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
);

interface CvPreviewProps {
  profile: CvProfile;
}

export const CvPreview: React.FC<CvPreviewProps> = ({ profile }) => {
  const {
    fullName,
    jobTitle,
    email,
    phone,
    location,
    linkedinUrl,
    websiteUrl,
    photoUrl,
    showPhoto,
    photoShape,
    summary,
    accaStatus,
    accaRegistrationNumber,
    accaPassedPapers,
    epsmCompleted,
    perProgress,
    skills,
    experiences,
    education,
    certifications,
    languages,
    references,
    theme,
    accentColor,
  } = profile;

  const photoShapeClass =
    photoShape === 'circle'
      ? 'rounded-full'
      : photoShape === 'rounded'
      ? 'rounded-2xl'
      : 'rounded-none';

  // Photo Component
  const renderPhoto = (sizeClass = 'w-24 h-24 sm:w-28 sm:h-28') => {
    if (!showPhoto) return null;
    return (
      <div className={`relative shrink-0 overflow-hidden border-2 border-white shadow-md ${sizeClass} ${photoShapeClass} bg-slate-100 flex items-center justify-center`}>
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={fullName || 'Candidate Photo'}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-slate-200 text-slate-500 flex flex-col items-center justify-center">
            <User className="w-8 h-8 text-slate-400" />
            <span className="text-[9px] uppercase font-bold text-slate-400 mt-1">Photo</span>
          </div>
        )}
      </div>
    );
  };

  // --- THEME 1: EXECUTIVE (Sidebar + Main Column) ---
  if (theme === 'executive') {
    return (
      <div
        id="cv-print-area"
        className="w-full max-w-[210mm] min-h-[297mm] bg-white text-slate-800 shadow-xl mx-auto flex flex-col md:flex-row print:shadow-none print:m-0 print:w-full print:max-w-none text-xs leading-relaxed"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {/* Left Sidebar */}
        <aside
          className="w-full md:w-[34%] p-6 space-y-6 text-white shrink-0 print:w-[34%]"
          style={{ backgroundColor: accentColor }}
        >
          {/* Photo & Name */}
          <div className="text-center space-y-3">
            {showPhoto && <div className="flex justify-center">{renderPhoto()}</div>}
            <div>
              <h1 className="text-xl font-black uppercase tracking-tight text-white leading-tight">
                {fullName || 'Your Full Name'}
              </h1>
              <p className="text-xs font-semibold text-blue-100/90 mt-1">{jobTitle}</p>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-2 pt-2 border-t border-white/20 text-[11px]">
            {email && (
              <div className="flex items-center gap-2 text-white/90">
                <Mail className="w-3.5 h-3.5 shrink-0 text-white/70" />
                <span className="truncate">{email}</span>
              </div>
            )}
            {phone && (
              <div className="flex items-center gap-2 text-white/90">
                <Phone className="w-3.5 h-3.5 shrink-0 text-white/70" />
                <span>{phone}</span>
              </div>
            )}
            {location && (
              <div className="flex items-center gap-2 text-white/90">
                <MapPin className="w-3.5 h-3.5 shrink-0 text-white/70" />
                <span>{location}</span>
              </div>
            )}
            {linkedinUrl && (
              <div className="flex items-center gap-2 text-white/90">
                <LinkedinIcon className="w-3.5 h-3.5 shrink-0 text-white/70" />
                <span className="truncate">{linkedinUrl}</span>
              </div>
            )}
            {websiteUrl && (
              <div className="flex items-center gap-2 text-white/90">
                <Globe className="w-3.5 h-3.5 shrink-0 text-white/70" />
                <span className="truncate">{websiteUrl}</span>
              </div>
            )}
          </div>

          {/* ACCA Status & Papers */}
          <div className="space-y-2.5 pt-2 border-t border-white/20">
            <h2 className="text-[11px] font-black uppercase tracking-wider text-white/80 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" /> ACCA Status
            </h2>
            <div className="bg-white/10 backdrop-blur-xs p-2.5 rounded-xl border border-white/15 space-y-1.5">
              <p className="font-bold text-white text-xs">{accaStatus}</p>
              {accaRegistrationNumber && (
                <p className="text-[10px] text-white/80">ACCA Reg ID: {accaRegistrationNumber}</p>
              )}
              {epsmCompleted && (
                <p className="text-[10px] text-emerald-300 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Ethics Module (EPSM) Completed
                </p>
              )}
              {perProgress && (
                <p className="text-[10px] text-white/80">PER: {perProgress}</p>
              )}
            </div>

            {/* Passed Papers Badges */}
            {accaPassedPapers.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-white/70">
                  Papers Passed ({accaPassedPapers.length}):
                </span>
                <div className="flex flex-wrap gap-1">
                  {accaPassedPapers.map((paper) => (
                    <span
                      key={paper}
                      className="px-1.5 py-0.5 rounded-md bg-white/20 text-white font-extrabold text-[10px]"
                    >
                      {paper}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Key Competencies */}
          {skills.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-white/20">
              <h2 className="text-[11px] font-black uppercase tracking-wider text-white/80">
                Core Competencies
              </h2>
              <div className="flex flex-wrap gap-1">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 rounded-md bg-white/10 text-white/95 text-[10px] font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <div className="space-y-1.5 pt-2 border-t border-white/20 text-[11px]">
              <h2 className="text-[11px] font-black uppercase tracking-wider text-white/80 flex items-center gap-1">
                <Languages className="w-3.5 h-3.5" /> Languages
              </h2>
              <div className="space-y-1">
                {languages.map((lang) => (
                  <div key={lang.id} className="flex justify-between text-white/90">
                    <span className="font-semibold">{lang.name}</span>
                    <span className="text-white/70 text-[10px]">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Right Main Column */}
        <main className="w-full md:w-[66%] p-8 space-y-6 print:w-[66%]">
          {/* Executive Summary */}
          {summary && (
            <section className="space-y-2">
              <h2
                className="text-xs font-black uppercase tracking-wider border-b-2 pb-1 flex items-center gap-1.5"
                style={{ color: accentColor, borderColor: accentColor }}
              >
                <BookOpen className="w-3.5 h-3.5" /> Professional Summary
              </h2>
              <p className="text-slate-600 leading-relaxed text-[11px] text-justify">{summary}</p>
            </section>
          )}

          {/* Work Experience */}
          {experiences.length > 0 && (
            <section className="space-y-3">
              <h2
                className="text-xs font-black uppercase tracking-wider border-b-2 pb-1 flex items-center gap-1.5"
                style={{ color: accentColor, borderColor: accentColor }}
              >
                <Briefcase className="w-3.5 h-3.5" /> Accounting & Professional Experience
              </h2>
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.id} className="space-y-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-1">
                      <h3 className="font-bold text-slate-900 text-xs">{exp.role}</h3>
                      <span className="text-[10px] text-slate-500 font-semibold">
                        {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-600 font-medium">
                      <span>{exp.company}</span>
                      {exp.location && <span>&bull; {exp.location}</span>}
                    </div>
                    {exp.bulletPoints.length > 0 && (
                      <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600 pt-1">
                        {exp.bulletPoints.map((bp, i) => (
                          <li key={i}>{bp}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section className="space-y-3">
              <h2
                className="text-xs font-black uppercase tracking-wider border-b-2 pb-1 flex items-center gap-1.5"
                style={{ color: accentColor, borderColor: accentColor }}
              >
                <GraduationCap className="w-3.5 h-3.5" /> Education & Qualifications
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="space-y-0.5">
                    <div className="flex flex-wrap items-baseline justify-between gap-1">
                      <h3 className="font-bold text-slate-900 text-xs">{edu.degree}</h3>
                      <span className="text-[10px] text-slate-500 font-semibold">
                        {edu.startYear} – {edu.endYear}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-700 font-medium">
                      {edu.institution} {edu.location ? `&bull; ${edu.location}` : ''}
                    </p>
                    {edu.grade && (
                      <p className="text-[10px] text-slate-600 font-semibold">Grade / Score: {edu.grade}</p>
                    )}
                    {edu.details && <p className="text-[10px] text-slate-500">{edu.details}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <section className="space-y-2">
              <h2
                className="text-xs font-black uppercase tracking-wider border-b-2 pb-1 flex items-center gap-1.5"
                style={{ color: accentColor, borderColor: accentColor }}
              >
                <FileCheck className="w-3.5 h-3.5" /> Professional Certifications
              </h2>
              <div className="space-y-1.5">
                {certifications.map((cert) => (
                  <div key={cert.id} className="flex justify-between items-baseline text-[11px]">
                    <span className="font-bold text-slate-800">{cert.title}</span>
                    <span className="text-slate-500 text-[10px]">
                      {cert.issuer} {cert.year ? `(${cert.year})` : ''}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* References */}
          {references.length > 0 && (
            <section className="space-y-2 pt-2 border-t border-slate-100">
              <h2
                className="text-xs font-black uppercase tracking-wider border-b pb-1"
                style={{ color: accentColor, borderColor: accentColor }}
              >
                References
              </h2>
              <div className="space-y-1 text-[11px] text-slate-600">
                {references.map((ref) => (
                  <div key={ref.id} className="flex flex-wrap justify-between">
                    <span className="font-semibold text-slate-800">{ref.name}</span>
                    <span>{ref.role}</span>
                    {ref.emailOrPhone && (
                      <span className="w-full text-slate-500 text-[10px]">{ref.emailOrPhone}</span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    );
  }

  // --- THEME 2: CLASSIC CORPORATE (Top-to-Bottom Header & Dividers) ---
  if (theme === 'classic') {
    return (
      <div
        id="cv-print-area"
        className="w-full max-w-[210mm] min-h-[297mm] bg-white text-slate-800 p-8 sm:p-10 shadow-xl mx-auto space-y-6 print:shadow-none print:m-0 print:p-8 print:w-full print:max-w-none text-xs leading-relaxed"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {/* Header Banner */}
        <header className="border-b-2 pb-5 space-y-3" style={{ borderColor: accentColor }}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900">
                {fullName || 'Your Full Name'}
              </h1>
              <p className="text-sm font-bold uppercase tracking-wider" style={{ color: accentColor }}>
                {jobTitle}
              </p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 font-bold text-[10px] border border-slate-200">
                <Award className="w-3 h-3 text-amber-600" /> {accaStatus}
                {accaRegistrationNumber && ` • Reg: ${accaRegistrationNumber}`}
              </div>
            </div>

            {showPhoto && renderPhoto('w-20 h-20 sm:w-24 sm:h-24')}
          </div>

          {/* Contact Bar */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-[11px] text-slate-600 pt-1">
            {email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3 text-slate-400" /> {email}
              </span>
            )}
            {phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" /> {phone}
              </span>
            )}
            {location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" /> {location}
              </span>
            )}
            {linkedinUrl && (
              <span className="flex items-center gap-1">
                <LinkedinIcon className="w-3 h-3 text-slate-400" /> {linkedinUrl}
              </span>
            )}
          </div>
        </header>

        {/* Summary */}
        {summary && (
          <section className="space-y-1.5">
            <h2
              className="text-xs font-black uppercase tracking-wider pb-1 border-b"
              style={{ color: accentColor, borderColor: '#E2E8F0' }}
            >
              Professional Summary
            </h2>
            <p className="text-slate-600 leading-relaxed text-[11px] text-justify">{summary}</p>
          </section>
        )}

        {/* ACCA Progress Box */}
        {accaPassedPapers.length > 0 && (
          <section className="space-y-1.5">
            <h2
              className="text-xs font-black uppercase tracking-wider pb-1 border-b"
              style={{ color: accentColor, borderColor: '#E2E8F0' }}
            >
              ACCA Qualification & Examination Track
            </h2>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-[11px]">
              <div className="flex flex-wrap justify-between items-center text-slate-700">
                <span className="font-bold">Completed Papers ({accaPassedPapers.length}/13):</span>
                {perProgress && <span className="text-[10px] font-semibold text-slate-500">PER: {perProgress}</span>}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {accaPassedPapers.map((paper) => (
                  <span
                    key={paper}
                    className="px-2 py-0.5 rounded-md font-extrabold text-white text-[10px]"
                    style={{ backgroundColor: accentColor }}
                  >
                    {paper}
                  </span>
                ))}
              </div>
              {epsmCompleted && (
                <p className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 pt-0.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Ethics and Professional Skills Module (EPSM) Completed
                </p>
              )}
            </div>
          </section>
        )}

        {/* Work Experience */}
        {experiences.length > 0 && (
          <section className="space-y-3">
            <h2
              className="text-xs font-black uppercase tracking-wider pb-1 border-b"
              style={{ color: accentColor, borderColor: '#E2E8F0' }}
            >
              Professional Experience
            </h2>
            <div className="space-y-3.5">
              {experiences.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-slate-900 text-xs">
                      {exp.role} &bull; <span className="font-medium text-slate-700">{exp.company}</span>
                    </h3>
                    <span className="text-[10px] text-slate-500 font-semibold">
                      {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  {exp.bulletPoints.length > 0 && (
                    <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600 pt-0.5">
                      {exp.bulletPoints.map((bp, i) => (
                        <li key={i}>{bp}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section className="space-y-2.5">
            <h2
              className="text-xs font-black uppercase tracking-wider pb-1 border-b"
              style={{ color: accentColor, borderColor: '#E2E8F0' }}
            >
              Education & Academic Credentials
            </h2>
            <div className="space-y-2">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900 text-xs">{edu.degree}</h3>
                    <p className="text-[11px] text-slate-600">
                      {edu.institution} {edu.grade ? `(${edu.grade})` : ''}
                    </p>
                    {edu.details && <p className="text-[10px] text-slate-500 mt-0.5">{edu.details}</p>}
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold shrink-0">
                    {edu.startYear} – {edu.endYear}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Technical Skills & Certifications */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
          {skills.length > 0 && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: accentColor }}>
                Key Technical Skills
              </h3>
              <div className="flex flex-wrap gap-1">
                {skills.map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {certifications.length > 0 && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: accentColor }}>
                Certifications & Diplomas
              </h3>
              <div className="space-y-1 text-[11px] text-slate-700">
                {certifications.map((c) => (
                  <p key={c.id}>
                    <span className="font-semibold">{c.title}</span> – <span className="text-slate-500 text-[10px]">{c.issuer} ({c.year})</span>
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* References */}
        {references.length > 0 && (
          <footer className="pt-2 border-t border-slate-100 text-[10px] text-slate-500 flex justify-between">
            <span>References: {references.map((r) => r.name || r.role).join(', ')}</span>
            <span>Available upon request</span>
          </footer>
        )}
      </div>
    );
  }

  // --- THEME 3: MODERN MINIMALIST (Clean Header + Visual Badges) ---
  return (
    <div
      id="cv-print-area"
      className="w-full max-w-[210mm] min-h-[297mm] bg-white text-slate-800 p-8 sm:p-10 shadow-xl mx-auto space-y-6 print:shadow-none print:m-0 print:p-8 print:w-full print:max-w-none text-xs leading-relaxed"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Top Accent Strip */}
      <div className="h-2 w-full rounded-full" style={{ backgroundColor: accentColor }} />

      {/* Header */}
      <header className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-4 border-b border-slate-200">
        <div className="space-y-1.5 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {fullName || 'Your Full Name'}
          </h1>
          <p className="text-sm font-bold text-slate-600">{jobTitle}</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
            <span
              className="px-2.5 py-0.5 rounded-full text-white font-black text-[10px] shadow-xs"
              style={{ backgroundColor: accentColor }}
            >
              {accaStatus}
            </span>
            {accaRegistrationNumber && (
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] border border-slate-200">
                ACCA ID: {accaRegistrationNumber}
              </span>
            )}
          </div>
        </div>

        {showPhoto && renderPhoto('w-24 h-24')}
      </header>

      {/* Contact Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-[10px] text-slate-600">
        {email && (
          <div className="flex items-center gap-1.5 truncate">
            <Mail className="w-3.5 h-3.5 shrink-0" style={{ color: accentColor }} />
            <span className="truncate">{email}</span>
          </div>
        )}
        {phone && (
          <div className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: accentColor }} />
            <span>{phone}</span>
          </div>
        )}
        {location && (
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: accentColor }} />
            <span className="truncate">{location}</span>
          </div>
        )}
        {linkedinUrl && (
          <div className="flex items-center gap-1.5 truncate">
            <LinkedinIcon className="w-3.5 h-3.5 shrink-0" style={{ color: accentColor }} />
            <span className="truncate">{linkedinUrl}</span>
          </div>
        )}
      </div>

      {/* Summary */}
      {summary && (
        <section className="space-y-1.5">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" style={{ color: accentColor }} /> Professional Profile
          </h2>
          <p className="text-slate-600 text-[11px] leading-relaxed text-justify">{summary}</p>
        </section>
      )}

      {/* ACCA Examinations */}
      {accaPassedPapers.length > 0 && (
        <section className="space-y-2">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" style={{ color: accentColor }} /> ACCA Papers Completed ({accaPassedPapers.length})
            </h2>
            {perProgress && <span className="text-[10px] font-bold text-slate-500">PER: {perProgress}</span>}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {accaPassedPapers.map((paper) => (
              <span
                key={paper}
                className="px-2.5 py-1 rounded-lg text-white font-black text-[10px] shadow-xs"
                style={{ backgroundColor: accentColor }}
              >
                {paper}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5" style={{ color: accentColor }} /> Practical Experience
          </h2>
          <div className="space-y-3">
            {experiences.map((exp) => (
              <div key={exp.id} className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 space-y-1">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-slate-900 text-xs">{exp.role}</h3>
                  <span className="text-[10px] font-bold text-slate-400">
                    {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-600">
                  {exp.company} {exp.location ? `&bull; ${exp.location}` : ''}
                </p>
                {exp.bulletPoints.length > 0 && (
                  <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600 pt-1">
                    {exp.bulletPoints.map((bp, i) => (
                      <li key={i}>{bp}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education & Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {education.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5" style={{ color: accentColor }} /> Education
            </h2>
            <div className="space-y-2">
              {education.map((edu) => (
                <div key={edu.id} className="text-[11px]">
                  <h3 className="font-bold text-slate-900">{edu.degree}</h3>
                  <p className="text-slate-600">{edu.institution}</p>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    {edu.startYear} – {edu.endYear} {edu.grade ? `&bull; ${edu.grade}` : ''}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {skills.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">
              Core Competencies
            </h2>
            <div className="flex flex-wrap gap-1">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[10px] font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Certifications & Languages */}
      {(certifications.length > 0 || languages.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100 text-[11px]">
          {certifications.length > 0 && (
            <div className="space-y-1">
              <h3 className="font-bold uppercase tracking-wider text-[10px] text-slate-400">
                Certifications
              </h3>
              {certifications.map((c) => (
                <p key={c.id} className="text-slate-700">
                  <strong>{c.title}</strong> &bull; {c.issuer}
                </p>
              ))}
            </div>
          )}

          {languages.length > 0 && (
            <div className="space-y-1">
              <h3 className="font-bold uppercase tracking-wider text-[10px] text-slate-400">
                Languages
              </h3>
              <p className="text-slate-700">
                {languages.map((l) => `${l.name} (${l.proficiency})`).join(', ')}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
