'use client';

import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import { Plus, Home, CheckCircle2, Clock, Info } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { BACKEND_ENDPOINTS } from '@/api/endpoints';
import { OwnerListingCard } from '@/components/owner/OwnerListingCard';
import { HouseIllustration } from '@/components/owner/HouseIllustration';
import { useSessionQuery } from '@/features/auth/api/authApi';
import type { PG } from '@/types/pg.types';

export default function OwnerDashboardPage() {
  const [listings, setListings] = useState<PG[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const { data: session } = useSessionQuery();
  const ownerName =
    session?.profile?.name ||
    session?.user?.email?.split('@')[0] ||
    'Owner';

  const loadListings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(BACKEND_ENDPOINTS.PGS.OWNER_LISTINGS);
      if (!response.ok) {
        throw new Error('Failed to fetch listings');
      }
      const data = await response.json();
      const pgArray = Array.isArray(data) ? data : data?.content || [];
      setListings(pgArray);
    } catch (err) {
      console.error('Failed to load owner listings:', err);
      setError('Unable to load listings. Please refresh or try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
  }, []);

  const stats = useMemo(() => {
    const total = listings.length;
    const approved = listings.filter((p) => p.approvalStatus === 'APPROVED').length;
    const pending = listings.filter((p) => p.approvalStatus === 'PENDING').length;
    return { total, approved, pending };
  }, [listings]);

  const displayedListings = useMemo(() => {
    if (showAll) return listings;
    // Show top 3 by default on mobile/desktop, or all if showAll is true
    return listings.slice(0, 3);
  }, [listings, showAll]);

  const handleDeleteListing = async (id: string) => {
    try {
      const response = await fetch(BACKEND_ENDPOINTS.PGS.BY_ID(id), { method: 'DELETE' });
      if (response.ok) {
        setListings((current) => current.filter((item) => item.id !== id));
      } else {
        alert('Failed to delete listing. Please try again.');
      }
    } catch (err) {
      console.error('Delete listing error:', err);
      alert('An error occurred while deleting the listing.');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* PAGE HEADING (Section 3.B) */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-[-0.03em] text-slate-900">
          Owner Dashboard
        </h1>
        <p className="mt-0.5 text-xs sm:text-sm text-slate-500">
          Manage your PG listings easily
        </p>
      </div>

      {/* WELCOME BANNER (Section 3.C) */}
      <div className="relative overflow-hidden rounded-[20px] sm:rounded-[24px] bg-[#e8f8f2] border border-emerald-100/70 p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1 sm:space-y-1.5 max-w-sm">
            <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-1.5">
              <span>Welcome back, {ownerName}</span>
              <span>👋</span>
            </h2>
            <p className="text-xs sm:text-[13px] leading-relaxed text-slate-600">
              Manage your PG properties in Bhopal, keep your listings updated and reach more students.
            </p>
          </div>

          <div className="shrink-0 -mr-2 -my-2 sm:mr-0 sm:my-0">
            <HouseIllustration className="w-28 h-20 sm:w-36 sm:h-24" />
          </div>
        </div>
      </div>

      {/* STATISTICS CARDS — EXACTLY THREE (Section 3.D) */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        {/* Card 1: Total Listings */}
        <div className="rounded-[18px] sm:rounded-[22px] bg-[#e8f8f2] border border-emerald-100/80 p-3 sm:p-4 text-center transition-all hover:border-emerald-200">
          <Home className="mx-auto h-5 w-5 text-[#059669]" />
          <p className="mt-1 text-[10px] sm:text-xs font-bold text-slate-600">
            Total Listings
          </p>
          <div className="mt-0.5 text-xl sm:text-2xl font-black text-[#059669]">
            {loading ? '…' : stats.total}
          </div>
        </div>

        {/* Card 2: Approved */}
        <div className="rounded-[18px] sm:rounded-[22px] bg-[#e8f8f2] border border-emerald-100/80 p-3 sm:p-4 text-center transition-all hover:border-emerald-200">
          <CheckCircle2 className="mx-auto h-5 w-5 text-[#059669]" />
          <p className="mt-1 text-[10px] sm:text-xs font-bold text-slate-600">
            Approved
          </p>
          <div className="mt-0.5 text-xl sm:text-2xl font-black text-[#059669]">
            {loading ? '…' : stats.approved}
          </div>
        </div>

        {/* Card 3: Pending */}
        <div className="rounded-[18px] sm:rounded-[22px] bg-[#fef4ea] border border-orange-100/80 p-3 sm:p-4 text-center transition-all hover:border-orange-200">
          <Clock className="mx-auto h-5 w-5 text-amber-500" />
          <p className="mt-1 text-[10px] sm:text-xs font-bold text-slate-600">
            Pending
          </p>
          <div className="mt-0.5 text-xl sm:text-2xl font-black text-amber-500">
            {loading ? '…' : stats.pending}
          </div>
        </div>
      </div>

      {/* ADD NEW PG BUTTON (Section 3.E) */}
      <div>
        <Link
          href={ROUTES.OWNER.ADD_PG}
          className="flex w-full items-center justify-center gap-1.5 rounded-[18px] sm:rounded-[20px] bg-[#059669] hover:bg-[#047857] py-3.5 sm:py-4 text-sm font-bold text-white shadow-xs transition-all active:scale-[0.99]"
        >
          <Plus className="h-4 w-4 stroke-[2.8]" />
          <span>Add New PG</span>
          <span className="text-sm">→</span>
        </Link>
      </div>

      {/* YOUR LISTINGS SECTION (Section 3.F) */}
      <div className="space-y-3 sm:space-y-3.5 pt-1">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-black tracking-tight text-slate-900">
            Your Listings
          </h2>
          {listings.length > 3 && (
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              className="text-xs font-bold text-[#059669] hover:text-[#047857] transition-colors"
            >
              {showAll ? 'Show Less' : 'View All →'}
            </button>
          )}
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-40 animate-pulse rounded-[20px] sm:rounded-[24px] border border-slate-200/80 bg-white"
              />
            ))}
          </div>
        )}

        {/* ERROR STATE */}
        {!loading && error && (
          <div className="mx-auto my-6 max-w-md rounded-[20px] border border-dashed border-rose-200 bg-rose-50/50 p-6 text-center">
            <Info className="mx-auto mb-2 h-8 w-8 text-rose-400" />
            <h4 className="text-sm font-bold text-slate-800">{error}</h4>
            <button
              type="button"
              onClick={loadListings}
              className="mt-3 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
            >
              Retry
            </button>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && listings.length === 0 && (
          <div className="mx-auto my-6 max-w-md rounded-[24px] border border-dashed border-slate-200 bg-white p-8 text-center shadow-xs">
            <Info className="mx-auto mb-3 h-10 w-10 text-slate-300" />
            <h4 className="text-sm font-bold text-slate-800">No listings yet</h4>
            <p className="mt-1 text-xs text-slate-500">
              Click &quot;+ Add New PG&quot; above to list your first student accommodation in Bhopal.
            </p>
            <Link
              href={ROUTES.OWNER.ADD_PG}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#059669] px-4 py-2 text-xs font-bold text-white hover:bg-[#047857]"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create Listing</span>
            </Link>
          </div>
        )}

        {/* LISTING CARDS */}
        {!loading && !error && listings.length > 0 && (
          <div className="space-y-3 sm:space-y-3.5">
            {displayedListings.map((pg) => (
              <OwnerListingCard
                key={pg.id}
                pg={pg}
                onDelete={handleDeleteListing}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}