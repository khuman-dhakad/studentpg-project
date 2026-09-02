'use client';

import React, { useState } from 'react';
import { useLoginMutation } from '@/features/auth/api/authApi';
import { ShieldCheck, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

export function AdminLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [adminLogin, { isLoading }] = useLoginMutation();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      await adminLogin({ email: email.trim().toLowerCase(), password }).unwrap();
      window.location.href = '/admin';
    } catch {
      setError('Admin authorization failed. Invalid credentials or insufficient clearance.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm antialiased">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
          <ShieldCheck className="h-4 w-4" />
        </div>
        <span className="text-[11px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
          Secure Administration
        </span>
      </div>

      <h1 className="text-2xl font-black tracking-tight text-slate-900">Admin Approval Desk</h1>
      <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500">Sign in to moderate PG listings and verify property owners.</p>

      {error && (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
          {error}
        </div>
      )}

      <div className="mt-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-black text-slate-700 tracking-wide">Admin Email</label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <Mail className="h-4 w-4" />
            </span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 pl-10 text-xs font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10"
              placeholder="admin@studentpg.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-black text-slate-700 tracking-wide">Access Password</label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <Lock className="h-4 w-4" />
            </span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 pl-10 text-xs font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10"
              placeholder="••••••••"
              required
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 px-4 text-xs font-black uppercase tracking-wider text-white shadow-md shadow-emerald-900/10 transition-all hover:bg-emerald-700 active:scale-98 disabled:opacity-60 cursor-pointer"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-white" />
            Verifying Admin Clearance...
          </span>
        ) : (
          <>
            <span>Authenticate Admin Session</span>
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}

export default AdminLoginForm;