'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Phone, Mail, MapPin, Send, ChevronDown, ChevronUp, Lock } from 'lucide-react';
import { BACKEND_ENDPOINTS } from '@/api/endpoints';
import { useEffect } from 'react';

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'How can I list my PG on StudentPG?',
      a: 'Sign up as an Owner, click on "List Your PG" in your dashboard, fill in the property details, upload photos, and submit for verification.',
    },
    {
      q: 'Is StudentPG free to use?',
      a: 'Yes! Searching for PGs and contacting owners is 100% free for students.',
    },
    {
      q: 'How do I contact a PG owner?',
      a: 'Once you find a PG you like, click "View Contact" or "Book Visit" on the property page to directly connect with the owner.',
    },
    {
      q: 'How long does it take to get my PG approved?',
      a: 'Our verification team usually reviews and approves PG listings within 24 to 48 hours.',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    try {
      // localStorage rate limit: max 5 submissions per 24h
      const key = 'contact_submissions';
      const now = Date.now();
      const raw = localStorage.getItem(key);
      const arr = raw ? JSON.parse(raw) as number[] : [];
      const recent = arr.filter((ts) => now - ts < 24 * 60 * 60 * 1000);
      if (recent.length >= 5) {
        setStatusMessage({ type: 'error', text: 'You have reached the maximum submissions for today.' });
        setLoading(false);
        return;
      }

      // include captcha info (send server token + user-provided answer)
      const payload = { ...formData, captchaToken, captchaAnswer: userCaptcha };

      const res = await fetch(BACKEND_ENDPOINTS.APP_API.CONTACT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setStatusMessage({ type: 'success', text: data.message });
        setFormData({ name: '', email: '', subject: '', message: '' });
        // update localStorage
        recent.push(now);
        localStorage.setItem(key, JSON.stringify(recent));
        // reset captcha (fetch a new server challenge)
        await fetchCaptcha();
        setUserCaptcha('');
      } else {
        setStatusMessage({ type: 'error', text: data.message || 'Failed to send message.' });
      }
    } catch{
      setStatusMessage({ type: 'error', text: 'Server connection error. Please try again.' });
    } finally {
      setLoading(false);
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
      // ignore — user can still attempt to submit but server will reject
    }
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 antialiased">
      
      {/* HEADER & FORM CONTAINER */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: CONTACT DETAILS */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <span className="text-[11px] font-black tracking-widest text-emerald-700 uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 inline-block mb-2">
              CONTACT SUPPORT
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
              We&apos;re Here to <span className="text-emerald-600">Help!</span>
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-2 leading-relaxed">
              Have questions, suggestions, or need verified host support? Our local Bhopal helpline team is always ready to assist you.
            </p>
          </div>

          {/* Contact Cards */}
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-start gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900 uppercase">Call &amp; WhatsApp Helpline</h4>
                <p className="text-xs font-bold text-slate-700 mt-0.5">+91 79701 34063 / +91 86043 25848</p>
                <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Mon - Sat, 9:00 AM - 7:00 PM IST</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-start gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900 uppercase">Official Email Desk</h4>
                <p className="text-xs font-bold text-slate-700 mt-0.5">studentpg.support@gmail.com</p>
                <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Responses guaranteed within 24 hours</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-start gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900 uppercase">Operational Hub</h4>
                <p className="text-xs font-bold text-slate-700 mt-0.5 leading-relaxed">
                  StudentPG HQ, 1st Floor, BDA Road, Bhopal, MP - 462042
                </p>
              </div>
            </div>
          </div>

          {/* Trust Banner with Local Image */}
          <div className="bg-slate-900 rounded-2xl p-5 text-white flex items-center justify-between gap-4 overflow-hidden relative shadow-md">
            <div className="space-y-1 z-10">
              <span className="text-[10px] font-black tracking-widest uppercase text-emerald-400">YOUR TRUST, OUR PRIORITY</span>
              <p className="text-xs font-medium text-slate-300 max-w-[220px] leading-relaxed">
                Dedicated verification and support ensuring genuine student accommodations.
              </p>
            </div>
            <div className="shrink-0 w-20 h-20 relative z-10">
              <Image 
                src="/ContactUS.jpeg" 
                alt="Support Illustration" 
                fill 
                className="object-cover rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CONTACT FORM */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
          <div className="mb-6">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Send Us a Direct Message</h3>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Fill out the form below and our team will get back to you promptly.</p>
          </div>

          {statusMessage && (
            <div className={`p-4 mb-6 rounded-xl text-xs font-bold ${
              statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}>
              {statusMessage.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-700 tracking-wide mb-1.5">Your Full Name <span className="text-rose-500">*</span></label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your full name"
                className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10 transition-all placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 tracking-wide mb-1.5">Email Address <span className="text-rose-500">*</span></label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email"
                className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10 transition-all placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 tracking-wide mb-1.5">Subject <span className="text-rose-500">*</span></label>
              <select
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10 transition-all cursor-pointer"
              >
                <option value="">What is your message about?</option>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Listing Issue">Listing Issue / Owner Help</option>
                <option value="Student Booking">Student Booking Query</option>
                <option value="Technical Bug">Report a Bug</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 tracking-wide mb-1.5">Message <span className="text-rose-500">*</span></label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Type your message here..."
                className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10 transition-all resize-none placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 tracking-wide mb-1.5">Human Verification <span className="text-rose-500">*</span></label>
              <div className="flex items-center gap-3">
                <div className="rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-800">{captchaQuestion}</div>
                <input
                  type="text"
                  required
                  value={userCaptcha}
                  onChange={(e) => setUserCaptcha(e.target.value)}
                  placeholder="Answer"
                  className="w-32 px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:border-emerald-600 focus:bg-white"
                  aria-label="captcha-answer"
                />
              </div>
              <p className="mt-1 text-[10px] text-slate-400 font-medium">Solve the simple question to verify you&apos;re human.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-900/10 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Sending Message...' : <><span>Send Message</span> <Send className="w-3.5 h-3.5" /></>}
            </button>
          </form>

          <div className="mt-4 text-center flex items-center justify-center gap-1.5 text-[11px] font-bold text-slate-400">
            <Lock className="w-3 h-3 text-slate-400" /> Your personal information remains strictly confidential.
          </div>
        </div>
      </div>

      {/* FREQUENTLY ASKED QUESTIONS SECTION */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div>
          <span className="text-[11px] font-black tracking-widest text-emerald-700 uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 inline-block mb-2">
            HELP RESOURCES
          </span>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Frequently Asked Questions</h3>
          <p className="text-xs font-medium text-slate-500 mt-0.5">Find quick answers to common marketplace questions.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-slate-200/80 rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-left text-xs font-black text-slate-800 flex justify-between items-center hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? <ChevronUp className="w-4 h-4 text-emerald-600" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 text-xs font-medium text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}