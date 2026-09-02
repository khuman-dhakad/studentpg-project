'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

export function SupportContactCard() {
  const [submitted, setSubmitted] = useState(false);

  const handleSupportTicketSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="w-full max-w-xl rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs sm:p-8 antialiased">
      {submitted ? (
        <div className="py-8 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-black text-slate-900">Support Request Registered</h3>
          <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
            Thank you! Your ticket has been logged with high priority. Our Bhopal support desk will connect with you shortly.
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="mt-2 text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
          >
            Submit another ticket
          </button>
        </div>
      ) : (
        <>
          <span className="text-[11px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 inline-block mb-2">
            DIRECT HELPDESK
          </span>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Direct Assistance Desk</h3>
          <p className="mt-1 text-xs text-slate-500 font-medium leading-relaxed">
            Facing issues with property onboarding, room photo updates, or account verification? Submit an assistance ticket below.
          </p>

          <form onSubmit={handleSupportTicketSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-700 tracking-wide mb-1.5">Full Name <span className="text-rose-500">*</span></label>
              <input
                type="text"
                required
                placeholder="John Doe"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 tracking-wide mb-1.5">Email Address <span className="text-rose-500">*</span></label>
              <input
                type="email"
                required
                placeholder="johndoe@example.com"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 tracking-wide mb-1.5">Issue Category <span className="text-rose-500">*</span></label>
              <select className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none transition-all focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10 cursor-pointer">
                <option>Onboarding &amp; Verification Assistance</option>
                <option>Photo Upload &amp; Media Management</option>
                <option>Account Credentials &amp; Login</option>
                <option>Tenant Inquiry &amp; Direct Connect</option>
                <option>Other Operational Inquiry</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 tracking-wide mb-1.5">Detailed Explanation <span className="text-rose-500">*</span></label>
              <textarea
                rows={4}
                required
                placeholder="Describe your issue or question in detail..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-xs font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 px-4 text-xs font-black uppercase tracking-wider text-white shadow-md shadow-emerald-900/10 transition-all hover:bg-emerald-700 active:scale-98 cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Submit Support Ticket</span>
            </button>
          </form>
        </>
      )}
    </div>
  );
}