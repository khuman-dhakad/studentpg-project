'use client';

import { useState } from 'react';

export function OwnerForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [loading, setLoading] = useState(false);

  const requestCode = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const response = await fetch('/api/auth/owner/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    setMessage(data.message || 'If an account exists, a reset code has been sent.');
    setStep('reset');
    setLoading(false);
  };

  const resetPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const response = await fetch('/api/auth/owner/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, newPassword }),
    });
    const data = await response.json();
    setMessage(data.message || 'Password updated.');
    setLoading(false);
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
