import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MessageSquare,
  Video,
  Send,
  CheckCircle2,
  AlertCircle,
  Share2,
  ExternalLink,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  // Configurable community contact details with legitimate placeholders as required
  const contactConfig = {
    officialEmail: 'support@example-accamaster.org',
    contactNumber: '+00 000 0000 000 (Owner Support Hotline)',
    whatsAppGroupUrl: 'https://chat.whatsapp.com/invite/placeholder-acca-master',
    whatsAppChannelUrl: 'https://whatsapp.com/channel/placeholder-acca-master-updates',
    youTubeChannelUrl: 'https://youtube.com/@accamaster-placeholder',
    facebookPageUrl: 'https://facebook.com/accamaster.placeholder',
    telegramGroupUrl: 'https://t.me/accamaster_placeholder',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSent(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-blue-600 font-bold text-xs uppercase tracking-widest">
          Get in Touch & Study Together
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Contact & Learning Community
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
          Have an academic inquiry, technical question, or want to join candidate study groups? Reach out
          through any of our community channels.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Contact Form */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Send an Academic Inquiry</h2>

          {sent ? (
            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-base">Message Dispatched!</h3>
              <p className="text-xs leading-relaxed text-emerald-800">
                Thank you for contacting ACCA Master. An educational advisor will review your note and
                reply to <strong>{email}</strong> shortly.
              </p>
              <button
                onClick={() => setSent(false)}
                className="mt-2 text-xs font-bold text-emerald-700 underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Your Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="student@example.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  placeholder="e.g. Inquiry regarding FA1 Mock Exam 2"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Your Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  required
                  placeholder="Describe your question or feedback..."
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm shadow-blue-500/20"
              >
                <Send className="w-4 h-4" /> Send Message
              </button>
            </form>
          )}
        </div>

        {/* Community & Social Channels */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Official Communication Channels</h2>
            <p className="text-xs text-slate-500">
              Configured communication endpoints. (Replace placeholder configuration values in platform
              settings with your official organizational addresses).
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase">Official Support Email</p>
                  <p className="font-bold text-slate-800 text-xs sm:text-sm">{contactConfig.officialEmail}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase">Support Contact Number</p>
                  <p className="font-bold text-slate-800 text-xs sm:text-sm">{contactConfig.contactNumber}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Communities */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Student Study Communities</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={contactConfig.whatsAppGroupUrl}
                target="_blank"
                rel="noreferrer"
                className="p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-950 flex items-center justify-between transition group"
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold">WhatsApp Group</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-600 group-hover:translate-x-0.5 transition" />
              </a>

              <a
                href={contactConfig.whatsAppChannelUrl}
                target="_blank"
                rel="noreferrer"
                className="p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-950 flex items-center justify-between transition group"
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold">WhatsApp Channel</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-600 group-hover:translate-x-0.5 transition" />
              </a>

              <a
                href={contactConfig.youTubeChannelUrl}
                target="_blank"
                rel="noreferrer"
                className="p-3.5 rounded-2xl bg-red-50 hover:bg-red-100/80 border border-red-200 text-red-950 flex items-center justify-between transition group"
              >
                <div className="flex items-center gap-2.5">
                  <Video className="w-4 h-4 text-red-600" />
                  <span className="text-xs font-bold">YouTube Lectures</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-red-600 group-hover:translate-x-0.5 transition" />
              </a>

              <a
                href={contactConfig.facebookPageUrl}
                target="_blank"
                rel="noreferrer"
                className="p-3.5 rounded-2xl bg-blue-50 hover:bg-blue-100/80 border border-blue-200 text-blue-950 flex items-center justify-between transition group"
              >
                <div className="flex items-center gap-2.5">
                  <Share2 className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold">Facebook Page</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-blue-600 group-hover:translate-x-0.5 transition" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
