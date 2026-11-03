import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { useAuth } from '../../contexts/AuthContext';
import {
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Shield,
  Bookmark,
  Database,
  Cloud,
  ChevronDown,
} from 'lucide-react';

export const Header: React.FC = () => {
  const { userProfile, isAdmin, logout, isFirebaseActive } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
      isActive
        ? 'text-blue-600 bg-blue-50/80'
        : 'text-slate-700 hover:text-blue-600 hover:bg-slate-100/70'
    }`;

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-3 py-2.5 text-base font-semibold rounded-lg transition-colors ${
      isActive
        ? 'text-blue-600 bg-blue-50 font-bold'
        : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top micro-banner for platform status */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-slate-200">ACCA Master</span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="hidden sm:inline text-slate-400">Computer Based Examination (CBE) Learning Platform</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Admin Console shortcut - ONLY visible to verified administrators */}
            {isAdmin && (
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-300 bg-amber-950/80 border border-amber-600 hover:bg-amber-900 px-2.5 py-0.5 rounded-full transition"
              >
                <Shield className="w-3 h-3 text-amber-400" />
                <span>Admin Console</span>
              </Link>
            )}

            {isFirebaseActive ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
                <Cloud className="w-3 h-3" /> Firebase Live
              </span>
            ) : (
              <span
                className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700"
                title="Running on local client engine."
              >
                <Database className="w-3 h-3" /> Local Engine
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            <NavLink to="/" className={navLinkClass} end>
              Home
            </NavLink>
            <NavLink to="/papers" className={navLinkClass}>
              ACCA Papers
            </NavLink>
            <NavLink to="/practice" className={navLinkClass}>
              MCQ Practice
            </NavLink>
            <NavLink to="/exams" className={navLinkClass}>
              Mock Exams
            </NavLink>
            <NavLink to="/resources" className={navLinkClass}>
              Study Resources
            </NavLink>
            <NavLink to="/resources?category=examiner_reports" className={navLinkClass}>
              Examiner Reports
            </NavLink>
            <NavLink to="/leaderboard" className={navLinkClass}>
              Leaderboard
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              About Us
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>
          </nav>

          {/* Desktop Right Side CTA / Auth */}
          <div className="hidden lg:flex items-center space-x-3">
            {userProfile ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition"
                  aria-expanded={userDropdownOpen}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-700 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    {userProfile.displayName ? userProfile.displayName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-800 leading-tight">
                      {userProfile.displayName.split(' ')[0]}
                    </p>
                    <span
                      className={`text-[10px] uppercase font-bold ${
                        isAdmin ? 'text-amber-600' : 'text-blue-600'
                      }`}
                    >
                      {userProfile.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-500">Signed in as</p>
                      <p className="text-sm font-bold text-slate-900 truncate">{userProfile.email}</p>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 font-medium"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-400" />
                      Student Dashboard
                    </Link>

                    <Link
                      to="/saved-questions"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 font-medium"
                    >
                      <Bookmark className="w-4 h-4 text-slate-400" />
                      Saved Questions
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 font-medium"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      My Profile
                    </Link>

                    {/* Admin Console link - ONLY rendered if the authenticated user is an administrator */}
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-amber-700 bg-amber-50 hover:bg-amber-100 font-bold transition"
                      >
                        <Shield className="w-4 h-4 text-amber-600" />
                        Admin Console
                      </Link>
                    )}

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium text-left transition"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition shadow-blue-500/20"
                >
                  Register Free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-hidden"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-1 shadow-lg">
          <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass} end>
            Home
          </NavLink>
          <NavLink to="/papers" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
            ACCA Papers
          </NavLink>
          <NavLink to="/practice" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
            MCQ Practice
          </NavLink>
          <NavLink to="/exams" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
            Mock Exams
          </NavLink>
          <NavLink to="/resources" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
            Study Resources
          </NavLink>
          <NavLink to="/resources?category=examiner_reports" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
            Examiner Reports
          </NavLink>
          <NavLink to="/leaderboard" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
            Leaderboard
          </NavLink>
          <NavLink to="/about" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
            About Us
          </NavLink>
          <NavLink to="/contact" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
            Contact
          </NavLink>

          <div className="pt-4 border-t border-slate-100 space-y-2">
            {userProfile ? (
              <div className="space-y-2">
                <div className="px-3 py-2 bg-slate-50 rounded-lg mb-2">
                  <p className="text-xs text-slate-500 font-medium">Logged in as</p>
                  <p className="text-sm font-bold text-slate-900">{userProfile.displayName}</p>
                  <p className="text-xs text-slate-600">{userProfile.email}</p>
                </div>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-semibold text-blue-600 bg-blue-50 rounded-lg"
                >
                  Student Dashboard
                </Link>
                <Link
                  to="/saved-questions"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
                >
                  Saved Questions
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-sm font-bold text-amber-700 bg-amber-50 rounded-lg"
                  >
                    Admin Console
                  </Link>
                )}

                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 text-sm font-bold text-white bg-blue-600 rounded-lg"
                >
                  Register Free
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
