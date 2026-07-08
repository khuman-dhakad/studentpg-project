'use client';

import React, { useState } from 'react';
import { useAdminLoginMutation } from '@/features/auth/api/authApi';

export function AdminLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminLogin, { isLoading }] = useAdminLoginMutation();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await adminLogin({ email, password }).unwrap();
      window.location.href = '/admin';
    } catch {
      alert('Admin login failed. Please check your credentials.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md rounded-3xl border border-line bg-surface p-8 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand">Secure Admin Access</p>
      <h1 className="mt-3 font-display text-2xl font-black text-ink">Admin Approval Desk</h1>
      <p className="mt-2 text-sm text-ink-soft">Sign in to review and approve new PG listings.</p>

      <div className="mt-6 space-y-4">
        <div>
          <label className="mb-2 block text-sm font-semibold text-ink">Email</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-2xl border border-line bg-cream px-4 py-3 text-sm text-ink outline-none transition focus:border-brand"
            placeholder="admin@studentpg.com"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-ink">Password</label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-2xl border border-line bg-cream px-4 py-3 text-sm text-ink outline-none transition focus:border-brand"
            placeholder="Enter password"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="mt-6 w-full rounded-2xl bg-brand px-4 py-3 text-sm font-semibold text-cream transition hover:bg-brand-dark disabled:opacity-60"
      >
        {isLoading ? 'Signing in…' : 'Access Admin Panel'}
      </button>
    </form>
  );
}

export default AdminLoginForm;