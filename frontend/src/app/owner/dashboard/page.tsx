'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ROUTES } from '@/constants/routes';
import { OwnerListingCard } from '@/components/owner/OwnerListingCard';
import type { PG } from '@/types/pg.types';

export default function OwnerDashboardPage() {
  const [listings, setListings] = useState<PG[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const response = await fetch('/api/owner/pgs');
      const data = await response.json();
      setListings(Array.isArray(data) ? data : []);
      setLoading(false);
    }
    load();
  }, []);

  const onDelete = async (id: string) => {
    const response = await fetch(`/api/owner/pgs/${id}`, { method: 'DELETE' });
    if (response.ok) setListings((current) => current.filter((item) => item.id !== id));
  };

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-2xl border border-line bg-surface p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand">Host Control Center</p>
        <h1 className="mt-3 font-display text-3xl font-black text-ink">Welcome back, premium host.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-ink-soft">Manage your properties, keep your listings fresh, and respond quickly to student demand from one clean workspace.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={ROUTES.OWNER.ADD_PG} className="rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-cream">Add New PG</Link>
          <Link href={ROUTES.SEARCH} className="rounded-lg border border-line px-5 py-3 text-sm font-semibold text-ink">Preview Public Listings</Link>
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-surface p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">Your Recent Listings</h2>
            <p className="mt-1 text-sm text-ink-soft">Review active and pending listings from the backend.</p>
          </div>
        </div>
        <div className="mt-6 space-y-3">
          {loading && <p className="text-sm text-ink-soft">Loading your listings…</p>}
          {!loading && listings.map((listing) => <OwnerListingCard key={listing.id} pg={listing} onDelete={onDelete} />)}
          {!loading && !listings.length && <p className="rounded-2xl border border-dashed border-line p-4 text-sm text-ink-soft">No listings found yet. Create your first one.</p>}
        </div>
      </section>
    </main>
  );
}
