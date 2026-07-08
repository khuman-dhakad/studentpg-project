'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import type { OwnerProfile } from '@/types/owner.types';

export default function OwnerProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<OwnerProfile | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', whatsappNumber: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function load() {
      const response = await fetch('/api/owner/profile');
      const data = await response.json();
      setProfile(data);
      setForm({ name: data.name || '', email: data.email || '', phone: data.phone || '', whatsappNumber: data.whatsappNumber || '' });
    }
    load();
  }, []);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await fetch('/api/owner/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const data = await response.json();
    setMessage(data.message || 'Profile updated');
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-line bg-surface p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand">Owner Profile</p>
        <h1 className="mt-3 font-display text-3xl font-black text-ink">Manage your identity and contact settings</h1>
        <form onSubmit={save} className="mt-8 grid gap-4">
          {message && <div className="rounded-2xl border border-line bg-cream p-3 text-sm text-ink-soft">{message}</div>}
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" className="rounded-2xl border border-line bg-cream px-4 py-3 text-sm text-ink outline-none" />
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="rounded-2xl border border-line bg-cream px-4 py-3 text-sm text-ink outline-none" />
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className="rounded-2xl border border-line bg-cream px-4 py-3 text-sm text-ink outline-none" />
          <input value={form.whatsappNumber} onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })} placeholder="WhatsApp number" className="rounded-2xl border border-line bg-cream px-4 py-3 text-sm text-ink outline-none" />
          <div className="flex flex-wrap gap-3">
            <button type="submit" className="rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-cream">Save profile</button>
            <button type="button" onClick={() => router.push(ROUTES.OWNER.DASHBOARD)} className="rounded-lg border border-line px-5 py-3 text-sm font-semibold text-ink">Back</button>
          </div>
        </form>
        <div className="mt-6 rounded-2xl border border-line bg-cream p-4 text-sm text-ink-soft">
          <p className="font-semibold text-ink">Connected account</p>
          <p className="mt-2">{profile?.email || 'Loading profile…'}</p>
        </div>
      </div>
    </main>
  );
}
