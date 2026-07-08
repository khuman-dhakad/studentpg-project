'use client';

import { useEffect, useState } from 'react';
import type { PG } from '@/types/pg.types';
import { AdminPGList } from '@/components/pg/AdminPGList';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0 });
  const [pending, setPending] = useState<PG[]>([]);

  useEffect(() => {
    async function load() {
      const statsResponse = await fetch('/api/admin/stats');
      const pendingResponse = await fetch('/api/admin/pending');
      const statsData = await statsResponse.json();
      const pendingData = await pendingResponse.json();
      setStats(statsData || { total: 0, approved: 0, pending: 0 });
      setPending(Array.isArray(pendingData) ? pendingData : []);
    }
    load();
  }, []);

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-line bg-surface p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand">Admin Oversight</p>
        <h1 className="mt-3 font-display text-3xl font-black text-ink">Curate the premium network.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-ink-soft">Approve new listings, review quality, and keep the platform premium for students and hosts alike.</p>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm"><p className="text-sm font-semibold text-ink-soft">Total Listings</p><p className="mt-2 font-display text-3xl font-black text-ink">{stats.total}</p></div>
        <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm"><p className="text-sm font-semibold text-ink-soft">Pending Review</p><p className="mt-2 font-display text-3xl font-black text-ink">{stats.pending}</p></div>
        <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm"><p className="text-sm font-semibold text-ink-soft">Approved</p><p className="mt-2 font-display text-3xl font-black text-ink">{stats.approved}</p></div>
      </section>
      <section className="rounded-2xl border border-line bg-surface p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">Pending Approvals</h2>
            <p className="mt-1 text-sm text-ink-soft">The next listings that require your review.</p>
          </div>
        </div>
        <div className="mt-6">
          <AdminPGList initialItems={pending} />
        </div>
      </section>
    </main>
  );
}
