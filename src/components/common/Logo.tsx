import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', variant = 'dark', size = 'md' }) => {
  const isLight = variant === 'light';

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <Link to="/" className={`inline-flex items-center gap-2.5 font-bold tracking-tight group ${className}`}>
      {/* Original Geometric Vector Emblem */}
      <div
        className={`${iconSizes[size]} relative flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900 shadow-md ring-1 ring-blue-500/20 group-hover:scale-105 transition-transform duration-200`}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5/6 h-5/6 drop-shadow"
        >
          {/* Stylized Mortarboard Cap Chevron */}
          <path
            d="M16 5L4 12L16 19L28 12L16 5Z"
            fill="url(#cap-grad)"
          />
          {/* Pillar / Shield Base */}
          <path
            d="M8 14.5V21C8 24.5 16 27 16 27C16 27 24 24.5 24 21V14.5L16 19.5L8 14.5Z"
            fill="url(#shield-grad)"
            opacity="0.9"
          />
          {/* Excellence Star Accent */}
          <circle cx="16" cy="14" r="2" fill="#FBBF24" />
          <defs>
            <linearGradient id="cap-grad" x1="4" y1="5" x2="28" y2="19" gradientUnits="userSpaceOnUse">
              <stop stopColor="#60A5FA" />
              <stop stopColor="#3B82F6" />
            </linearGradient>
            <linearGradient id="shield-grad" x1="8" y1="14.5" x2="24" y2="27" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2563EB" />
              <stop stopColor="#1E3A8A" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Wordmark */}
      <div className="flex flex-col leading-tight">
        <div className={`font-extrabold ${textSizes[size]} tracking-tight flex items-center gap-1`}>
          <span className={isLight ? 'text-white' : 'text-slate-900'}>ACCA</span>
          <span className="text-blue-600 font-black">MASTER</span>
        </div>
        <span className={`text-[10px] uppercase font-semibold tracking-widest ${isLight ? 'text-slate-300' : 'text-slate-500'}`}>
          Learning Platform
        </span>
      </div>
    </Link>
  );
};
