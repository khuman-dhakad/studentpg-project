'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { BACKEND_ENDPOINTS } from '@/api/endpoints';
// import Link from 'next/link';
import { 
  Pencil, 
  FileText, 
  AlertTriangle, 
  UserCheck, 
  MoreHorizontal, 
  ShieldCheck, 
  UploadCloud, 
  Send, 
  Lock, 
  Search,
  MapPin,
  CheckCircle2,
  Loader2
} from 'lucide-react';

export default function ReportIssuePage() {
  const [issueType, setIssueType] = useState('');
  const [pgListing, setPgListing] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // What can you report Categories
  const reportCategories = [
    {
      icon: Pencil,
      iconBg: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
      title: 'Incorrect Information',
      desc: 'Wrong details in PG listing like price, address, amenities, or sharing type.',
    },
    {
      icon: FileText,
      iconBg: 'bg-rose-50 text-rose-700 border border-rose-100',
      title: 'Fake or Duplicate Listing',
      desc: 'Suspicious, unauthorized, or duplicate PG property entries.',
    },
    {
      icon: AlertTriangle,
      iconBg: 'bg-amber-50 text-amber-700 border border-amber-100',
      title: 'Inappropriate Content',
      desc: 'Misleading photos, offensive text, or false amenity claims.',
    },
    {
      icon: UserCheck,
      iconBg: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
      title: 'Host Misconduct',
      desc: 'Unprofessional behavior, refusal of visit, or fraudulent deposit demands.',
    },
    {
      icon: MoreHorizontal,
      iconBg: 'bg-slate-100 text-slate-700 border border-slate-200',
      title: 'Other Grievances',
      desc: 'Any other safety or listing problem you would like our team to investigate.',
    },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueType || !location || description.length < 10) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('title', issueType);
      formData.append('pgListing', pgListing);
      formData.append('location', location);
      formData.append('detail', description);
      if (file) {
        // client-side validation
        if (!file.type.startsWith('image/')) {
          setErrorMessage('Only image files are allowed.');
          setIsSubmitting(false);
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          setErrorMessage('Image exceeds maximum allowed size of 5MB.');
          setIsSubmitting(false);
          return;
        }
        formData.append('images', file);
      }

      // localStorage rate limit: max 5 per 24h per browser
      const key = 'report_submissions';
      const now = Date.now();
      const raw = localStorage.getItem(key);
      const arr = raw ? JSON.parse(raw) as number[] : [];
      const recent = arr.filter((ts) => now - ts < 24 * 60 * 60 * 1000);
      if (recent.length >= 5) {
        setErrorMessage('You have reached the maximum report submissions for today from this browser.');
        setIsSubmitting(false);
        return;
      }

      // include captcha token and user answer
      formData.append('captchaToken', captchaToken);
      formData.append('captchaAnswer', userCaptcha);

      const res = await fetch(BACKEND_ENDPOINTS.APP_API.REPORT_ISSUE, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsSubmitted(true);
        recent.push(now);
        localStorage.setItem(key, JSON.stringify(recent));
      } else {
        setErrorMessage(data.message || 'Failed to send report. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Something went wrong. Please check your internet connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // CAPTCHA (server-issued token)
  const [captchaQuestion, setCaptchaQuestion] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [userCaptcha, setUserCaptcha] = useState('');

  const fetchCaptcha = async () => {
    try {
      const res = await fetch(BACKEND_ENDPOINTS.APP_API.CAPTCHA);
      if (!res.ok) return;
      const data = await res.json();
      setCaptchaQuestion(data.question_ || data.question || '');
      setCaptchaToken(data.token_ || data.token || '');
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50/50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 antialiased">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HERO BANNER SECTION */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs grid lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <span className="text-[11px] font-black tracking-widest text-emerald-700 uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 inline-block mb-1">
              REPORT AN ISSUE
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Help Us Keep <br className="hidden sm:inline" />
              StudentPG <span className="text-emerald-600">Safe &amp; Verified</span>
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 leading-relaxed max-w-xl">
              Found incorrect information, a suspicious listing, or facing an issue? Let us know. Our safety desk investigates reports promptly.
            </p>
          </div>

          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <div className="relative w-48 h-48 sm:w-60 sm:h-60">
              <Image
                src="/report issue.jpeg"
                alt="Report An Issue Illustration"
                fill
                priority
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* MAIN LAYOUT GRID */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">

          {/* LEFT SIDE: WHAT CAN YOU REPORT */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
              <h3 className="text-base font-black text-slate-900">
                What can you report?
              </h3>

              <div className="space-y-4">
                {reportCategories.map((cat, idx) => {
                  const Icon = cat.icon;
                  return (
                    <div key={idx} className="flex items-start gap-3.5">
                      <div className={`p-2.5 rounded-xl shrink-0 ${cat.iconBg}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-black text-slate-900">{cat.title}</h4>
                        <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
                          {cat.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* IMPORTANT NOTE BADGE */}
              <div className="bg-emerald-50/70 border border-emerald-100 p-4 rounded-2xl flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <h5 className="text-xs font-black text-emerald-950">Your report is confidential</h5>
                  <p className="text-[11px] font-semibold text-emerald-800 leading-snug">
                    We review every submission carefully and protect your personal identity.
                  </p>
                </div>
                <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: REPORT FORM */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
            {isSubmitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-slate-900">Report Submitted Successfully!</h3>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 max-w-md mx-auto">
                  Thank you for bringing this to our attention. An email has been sent to our safety team for quick action.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setIssueType('');
                    setPgListing('');
                    setLocation('');
                    setDescription('');
                    setFile(null);
                    setErrorMessage('');
                  }}
                  className="mt-4 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-emerald-900/10 cursor-pointer"
                >
                  Submit Another Report
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Report an Issue</h3>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">
                    Please provide accurate details so we can investigate and resolve the issue.
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
                    {errorMessage}
                  </div>
                )}

                {/* What do you want to report */}
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1.5 tracking-wide">
                    What do you want to report? <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={issueType}
                    onChange={(e) => setIssueType(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none transition-all focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10 cursor-pointer"
                  >
                    <option value="">Select an option</option>
                    <option value="Incorrect Information">Incorrect Information</option>
                    <option value="Fake or Duplicate Listing">Fake or Duplicate Listing</option>
                    <option value="Inappropriate Content">Inappropriate Content</option>
                    <option value="Owner Misconduct">Host Misconduct</option>
                    <option value="Other Issues">Other Issues</option>
                  </select>
                </div>

                {/* PG Listing (If related) */}
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1.5 tracking-wide">
                    PG Listing <span className="text-slate-400 font-normal">(if related)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                      <Search className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={pgListing}
                      onChange={(e) => setPgListing(e.target.value)}
                      placeholder="Search for PG by name or location (optional)"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 outline-none transition-all focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10 placeholder:text-slate-400"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium mt-1">Start typing to search a PG (optional)</p>
                </div>

                {/* Location of the issue */}
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1.5 tracking-wide">
                    Location of the issue <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                      <MapPin className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                      placeholder="City / Area / Locality in Bhopal"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 outline-none transition-all focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Description of the issue */}
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1.5 tracking-wide">
                    Description of the issue <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    minLength={10}
                    placeholder="Please describe the issue in detail..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-xs font-semibold text-slate-900 outline-none transition-all focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10 placeholder:text-slate-400 resize-none"
                  />
                  <p className="text-[10px] text-slate-400 font-medium mt-1">Minimum 10 characters</p>
                </div>

                {/* Upload Evidence (Optional) */}
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1.5 tracking-wide">
                    Upload Evidence <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  
                  <label htmlFor="file-upload" className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 hover:bg-slate-100/50 transition-colors group">
                    <UploadCloud className="w-8 h-8 text-emerald-600 group-hover:scale-110 transition-transform mb-2" />
                    <span className="text-xs font-extrabold text-slate-700">
                      {file ? file.name : 'Click to upload or drag and drop'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                      Images (JPG, PNG) up to 5MB
                    </span>
                    <input 
                      id="file-upload" 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      className="hidden" 
                    />
                  </label>
                  <p className="text-[10px] text-slate-400 font-medium mt-1">Screenshots or photos help us investigate faster.</p>
                </div>

                {/* CAPTCHA VERIFICATION */}
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1.5 tracking-wide">Verification</label>
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-800">{captchaQuestion}</div>
                    <input type="text" value={userCaptcha} onChange={(e) => setUserCaptcha(e.target.value)} placeholder="Answer" className="w-32 px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:border-emerald-600 focus:bg-white" required />
                  </div>
                  <p className="mt-1 text-[10px] text-slate-400 font-medium">Solve the question to verify you&apos;re human.</p>
                </div>

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl py-3 px-4 text-xs font-black uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-md shadow-emerald-900/10 cursor-pointer active:scale-98"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Submitting Report...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Grievance Report</span>
                    </>
                  )}
                </button>

                {/* CONFIDENTIAL FOOTNOTE */}
                <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-400 pt-1">
                  <Lock className="w-3.5 h-3.5" />
                  <span>All reports are confidential. We do not share your identity.</span>
                </div>
              </form>
            )}
          </div>

        </div>

      </div>
    </main>
  );
}