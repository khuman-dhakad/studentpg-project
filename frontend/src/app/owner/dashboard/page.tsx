'use client';

import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import { Plus, Building2, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { BACKEND_ENDPOINTS } from '@/api/endpoints';
import { OwnerListingCard } from '@/components/owner/OwnerListingCard';
import type { PG } from '@/types/pg.types';
import DashboardChartClient from '@/components/owner/DashboardChartClient';

export default function OwnerDashboardPage() {
  const [listings, setListings] = useState<PG[]>([]);
  const [loading, setLoading] = useState(true);
  
  // States for Filtering and Pagination
  const [filter, setFilter] = useState<'ALL' | 'APPROVED' | 'PENDING' | 'REJECTED'>('ALL');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch(BACKEND_ENDPOINTS.PGS.OWNER_LISTINGS);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        const pgArray = Array.isArray(data) ? data : (data?.content || []);
        setListings(pgArray);
      } catch (error) {
        console.error("Failed to load dashboard statistics listings:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const stats = useMemo(() => {
    const total = listings.length;
    const approved = listings.filter(p => p.approvalStatus === 'APPROVED').length;
    const pending = listings.filter(p => p.approvalStatus === 'PENDING').length;
    const rejected = total - (approved + pending);
    return { total, approved, pending, rejected };
  }, [listings]);

  // Logic to Filter and Limit Display
  const filteredListings = useMemo(() => {
    let data = listings;
    if (filter !== 'ALL') {
      data = listings.filter(p => p.approvalStatus === filter);
    }
    // Agar showAll false hai to sirf 2 dikhao, varna poora data
    return showAll ? data : data.slice(0, 2);
  }, [listings, filter, showAll]);

  const onDelete = async (id: string) => {
    const response = await fetch(BACKEND_ENDPOINTS.PGS.BY_ID(id), { method: 'DELETE' });
    if (response.ok) setListings((current) => current.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-6">
      
      {/* BANNER HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">Welcome back! 👋</h1>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">Here's what's happening with your PG listings.</p>
        </div>
        <Link href={ROUTES.OWNER.ADD_PG} className="inline-flex items-center justify-center gap-1.5 bg-indigo-600 text-white text-xs font-black tracking-wider uppercase px-5 py-3 rounded-xl hover:bg-indigo-700 shadow-md transition-all shrink-0">
          <Plus className="w-4 h-4" /> Add New PG
        </Link>
      </div>

      {/* METRIC INFRASTRUCTURE GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 cursor-pointer">
        <div onClick={() => {setFilter('ALL'); setShowAll(false);}} className="bg-white rounded-2xl p-4 border border-slate-100 flex items-center gap-3.5 shadow-sm hover:border-indigo-200 transition-all">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600"><Building2 className="w-5 h-5" /></div>
          <div><div className="text-xl font-black text-slate-900 leading-none">{stats.total}</div><p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Total</p></div>
        </div>
        <div onClick={() => {setFilter('APPROVED'); setShowAll(false);}} className="bg-white rounded-2xl p-4 border border-slate-100 flex items-center gap-3.5 shadow-sm hover:border-emerald-200 transition-all">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600"><CheckCircle2 className="w-5 h-5" /></div>
          <div><div className="text-xl font-black text-slate-900 leading-none">{stats.approved}</div><p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Approved</p></div>
        </div>
        <div onClick={() => {setFilter('PENDING'); setShowAll(false);}} className="bg-white rounded-2xl p-4 border border-slate-100 flex items-center gap-3.5 shadow-sm hover:border-amber-200 transition-all">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500"><Clock className="w-5 h-5" /></div>
          <div><div className="text-xl font-black text-slate-900 leading-none">{stats.pending}</div><p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Pending</p></div>
        </div>
        <div onClick={() => {setFilter('REJECTED'); setShowAll(false);}} className="bg-white rounded-2xl p-4 border border-slate-100 flex items-center gap-3.5 shadow-sm hover:border-rose-200 transition-all">
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500"><XCircle className="w-5 h-5" /></div>
          <div><div className="text-xl font-black text-slate-900 leading-none">{stats.rejected}</div><p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Rejected</p></div>
        </div>
      </div>

      {/* CHART & QUICK ACTIONS LAYER */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 items-start">
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 tracking-tight">PG Listing Overview</h3>
            <select className="text-[11px] font-bold border border-slate-200 bg-slate-50 rounded-lg px-2.5 py-1 outline-none cursor-pointer"><option>This Month</option></select>
          </div>
          <div className="h-56 w-full"><DashboardChartClient data={listings} /></div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-slate-900 tracking-tight">Quick Actions</h3>
          <div className="space-y-2.5">
            <Link href={ROUTES.OWNER.ADD_PG} className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-all">
              <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-black text-xs">+</div>
              <div><h5 className="text-xs font-black text-slate-800 leading-none">Add New PG</h5><p className="text-[10px] font-medium text-slate-400 mt-0.5">List a new property</p></div>
            </Link>
            <Link href={ROUTES.OWNER.PROFILE} className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-all">
              <div className="w-8 h-8 bg-teal-50 text-teal-600 rounded-lg flex items-center justify-center font-black text-xs">⚙</div>
              <div><h5 className="text-xs font-black text-slate-800 leading-none">Profile Settings</h5><p className="text-[10px] font-medium text-slate-400 mt-0.5">Update your profile</p></div>
            </Link>
          </div>
        </div>
      </div>

      {/* RECENT PROPERTIES DISPLAY */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-50 pb-3">
          <h3 className="text-sm font-black text-slate-900 tracking-tight uppercase">{filter} PGs</h3>
          <button onClick={() => setShowAll(!showAll)} className="text-xs font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-wide">
            {showAll ? 'Show Less' : 'View All'}
          </button>
        </div>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {loading && <p className="text-xs font-semibold text-slate-400 p-4">Loading…</p>}
          {!loading && filteredListings.map((listing) => (
            <OwnerListingCard key={listing.id} pg={listing} onDelete={onDelete} />
          ))}
          {!loading && filteredListings.length === 0 && (
            <div className="col-span-full py-8 text-center border-2 border-dashed border-slate-100 rounded-xl text-xs font-semibold text-slate-400">
              No PGs found in this category.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}