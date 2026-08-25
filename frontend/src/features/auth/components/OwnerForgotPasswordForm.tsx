'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { BACKEND_ENDPOINTS } from '@/api/endpoints';

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
      const nextMessage = data?.message || 'Password updated.';
      setMessage(nextMessage);

      if (response.ok && data?.success !== false) {
        setOtp('');
        setNewPassword('');
        router.push('/owner/login');
      }
    } catch (error) {
      setMessage('Unable to reset password. Please check your network connection and try again.');
      console.error('Reset password request failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-line bg-surface p-8 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand">Reset access</p>
      <h1 className="mt-3 font-display text-2xl font-black text-ink">Recover your owner account</h1>
      <p className="mt-2 text-sm text-ink-soft">Enter your email to receive a one-time password reset code.</p>

      {message && <div className="mt-6 rounded-2xl border border-line bg-cream p-3 text-sm text-ink-soft">{message}</div>}

      {step === 'request' ? (
        <form onSubmit={requestCode} className="mt-6 space-y-4">
          <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="owner@example.com" className="w-full rounded-2xl border border-line bg-cream px-4 py-3 text-sm text-ink outline-none" required />
          <button type="submit" disabled={loading} className="w-full rounded-2xl bg-brand px-4 py-3 text-sm font-semibold text-cream">{loading ? 'Sending…' : 'Send reset code'}</button>
        </form>
      ) : (
        <form onSubmit={resetPassword} className="mt-6 space-y-4">
          <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="owner@example.com" className="w-full rounded-2xl border border-line bg-cream px-4 py-3 text-sm text-ink outline-none" required />
          <input value={otp} onChange={(event) => setOtp(event.target.value)} placeholder="6-digit OTP" className="w-full rounded-2xl border border-line bg-cream px-4 py-3 text-sm text-ink outline-none" required />
          <input value={newPassword} onChange={(event) => setNewPassword(event.target.value)} type="password" placeholder="New password" className="w-full rounded-2xl border border-line bg-cream px-4 py-3 text-sm text-ink outline-none" required />
          <button type="submit" disabled={loading} className="w-full rounded-2xl bg-brand px-4 py-3 text-sm font-semibold text-cream">{loading ? 'Updating…' : 'Reset password'}</button>
        </form>
      )}
    </div>
  );
}
