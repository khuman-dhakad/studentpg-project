'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { BACKEND_ENDPOINTS } from '@/api/endpoints';
import { Mail, KeyRound, Lock, ArrowRight, Loader2 } from 'lucide-react';

export function OwnerForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [loading, setLoading] = useState(false);

  const requestCode = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const response = await fetch(BACKEND_ENDPOINTS.OWNERS.FORGOT_PASSWORD, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      const data = await response.json();
      const nextMessage = data?.message || 'If an account exists, a reset code has been sent.';
      setMessage(nextMessage);

      if (response.ok && data?.success !== false) {
        setStep('reset');
      }
    } catch (error) {
      setMessage('Unable to send reset code. Please check your network connection and try again.');
      console.error('Forgot password request failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const trimmedOtp = otp.trim();
      const response = await fetch(BACKEND_ENDPOINTS.OWNERS.RESET_PASSWORD, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, otp: trimmedOtp, newPassword }),
      });

      const data = await response.json();
      const nextMessage = data?.message || 'Password updated successfully.';
      setMessage(nextMessage);

      if (response.ok && data?.success !== false) {
        setOtp('');
        setNewPassword('');
        setTimeout(() => {
          router.push('/owner/login');
        }, 1500);
      }
    } catch (error) {
      setMessage('Unable to reset password. Please check your network connection and try again.');
      console.error('Reset password request failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      {message && (
        <div className={`rounded-xl border p-3.5 text-xs font-semibold ${
          message.includes('success') || message.includes('sent') || message.includes('updated')
            ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
            : 'border-rose-200 bg-rose-50 text-rose-700'
        }`}>
          {message}
        </div>
      )}

      {step === 'request' ? (
        <form onSubmit={requestCode} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-black text-slate-700 tracking-wide">
              Registered Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Mail className="h-4 w-4" />
              </span>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                placeholder="owner@example.com"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 pl-10 text-xs font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 px-4 text-xs font-black uppercase tracking-wider text-white shadow-md shadow-emerald-900/10 transition-all hover:bg-emerald-700 active:scale-98 disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                Sending Reset Code...
              </span>
            ) : (
              <>
                <span>Send Reset Code</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={resetPassword} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-black text-slate-700 tracking-wide">
              Registered Email Address
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Mail className="h-4 w-4" />
              </span>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                placeholder="owner@example.com"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 pl-10 text-xs font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-black text-slate-700 tracking-wide">
              6-Digit OTP Code <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <KeyRound className="h-4 w-4" />
              </span>
              <input
                value={otp}
                onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 pl-10 text-xs font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-black text-slate-700 tracking-wide">
              New Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Lock className="h-4 w-4" />
              </span>
              <input
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                type="password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 pl-10 text-xs font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 px-4 text-xs font-black uppercase tracking-wider text-white shadow-md shadow-emerald-900/10 transition-all hover:bg-emerald-700 active:scale-98 disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                Updating Password...
              </span>
            ) : (
              <>
                <span>Reset Password &amp; Login</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
