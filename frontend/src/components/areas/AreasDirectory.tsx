'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  MapPin,
  GraduationCap,
  Building2,
  Search,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { AreaCard } from '@/components/home/AreaCard';
import {
  POPULAR_AREAS,
  MAJOR_LOCALITIES,
  COLLEGE_HUBS,
} from '@/data/popularAreas';

type FilterTab = 'all' | 'localities' | 'colleges';

export function AreasDirectory() {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [searchFilter, setSearchFilter] = useState('');

  const filteredLocalities = useMemo(() => {
    if (!searchFilter.trim()) return MAJOR_LOCALITIES;
    const q = searchFilter.toLowerCase();
    return MAJOR_LOCALITIES.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.categoryLabel.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q)
    );
  }, [searchFilter]);

  const filteredColleges = useMemo(() => {
    if (!searchFilter.trim()) return COLLEGE_HUBS;
    const q = searchFilter.toLowerCase();
    return COLLEGE_HUBS.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.categoryLabel.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q)
    );
  }, [searchFilter]);

  const totalResults =
    activeTab === 'all'
      ? filteredLocalities.length + filteredColleges.length
      : activeTab === 'localities'
      ? filteredLocalities.length
      : filteredColleges.length;

  return (
    <div className="w-full bg-white text-slate-800 antialiased pb-16 sm:pb-20">
      {/* =========================================================================
          HERO HEADER & BREADCRUMBS
          ========================================================================= */}
      <div className="border-b border-slate-100 bg-gradient-to-b from-slate-50/70 to-white py-6 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-emerald-700 transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-slate-900 font-bold">Popular Areas</span>
          </nav>

          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#047857] mb-3">
            <MapPin className="h-3 w-3 text-emerald-600" />
            <span>Bhopal Student Discovery Hubs</span>
          </div>

          {/* Page Heading & Description */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight max-w-3xl">
            Popular Areas & Student Hubs in Bhopal
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-2xl">
            Explore 21 verified student accommodation hubs across major residential localities, coaching zones, and university campuses. Verified properties, authentic photos, and 100% zero brokerage.
          </p>

          {/* Control Bar: Filter Tabs + Instant Search */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-2xl w-fit overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Locations ({POPULAR_AREAS.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('localities')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'localities'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Major Areas ({MAJOR_LOCALITIES.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('colleges')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'colleges'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                College Hubs ({COLLEGE_HUBS.length})
              </button>
            </div>

            {/* Instant Filter Input */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter area or college..."
                className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                aria-label="Filter areas or college hubs"
              />
            </div>
          </div>

        </div>
      </div>

      {/* =========================================================================
          LOCATIONS DIRECTORY SECTIONS
          ========================================================================= */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 space-y-10 sm:space-y-12">

        {/* Empty Search State */}
        {totalResults === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center max-w-md mx-auto my-8">
            <Search className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-900">No matching areas found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try searching with another keyword or explore all Bhopal areas.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveTab('all');
                setSearchFilter('');
              }}
              className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#059669] hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* SECTION A: MAJOR BHOPAL LOCALITIES */}
        {(activeTab === 'all' || activeTab === 'localities') && filteredLocalities.length > 0 && (
          <section id="major-localities" aria-labelledby="heading-major-localities">
            <div className="flex items-center justify-between gap-4 mb-4 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-[#059669]" />
                <h2
                  id="heading-major-localities"
                  className="text-base sm:text-lg font-black text-slate-900 tracking-tight"
                >
                  Major Bhopal Localities
                </h2>
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-extrabold text-slate-600">
                  {filteredLocalities.length}
                </span>
              </div>

              <Link
                href="/search"
                className="text-xs font-bold text-[#059669] hover:text-emerald-800 transition-colors inline-flex items-center gap-1"
              >
                <span>Browse All</span>
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Grid: 2 cols on mobile, 3 cols tablet, 4 cols desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
              {filteredLocalities.map((area, index) => (
                <AreaCard key={area.id} area={area} priority={index < 4} />
              ))}
            </div>
          </section>
        )}

        {/* SECTION B: STUDENT & COLLEGE LOCATION HUBS */}
        {(activeTab === 'all' || activeTab === 'colleges') && filteredColleges.length > 0 && (
          <section id="college-hubs" aria-labelledby="heading-college-hubs">
            <div className="flex items-center justify-between gap-4 mb-4 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-[#059669]" />
                <h2
                  id="heading-college-hubs"
                  className="text-base sm:text-lg font-black text-slate-900 tracking-tight"
                >
                  Student & College Location Hubs
                </h2>
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-extrabold text-slate-600">
                  {filteredColleges.length}
                </span>
              </div>

              <Link
                href="/search"
                className="text-xs font-bold text-[#059669] hover:text-emerald-800 transition-colors inline-flex items-center gap-1"
              >
                <span>Browse All</span>
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Grid: 2 cols on mobile, 3 cols tablet, 4 cols desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
              {filteredColleges.map((area) => (
                <AreaCard key={area.id} area={area} priority={false} />
              ))}
            </div>
          </section>
        )}

        {/* =========================================================================
            BOTTOM CALL-TO-ACTION CARD
            ========================================================================= */}
        <section className="rounded-2xl border border-slate-200/90 bg-gradient-to-r from-slate-900 to-slate-800 p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1 max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Looking for a specific campus or landmark?</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
              Search by Exact Location or Rent Budget
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Filter student accommodations by food, Wi-Fi, AC, room sharing type, and direct WhatsApp contact with property owners.
            </p>
          </div>

          <Link
            href="/search"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#059669] hover:bg-emerald-600 active:scale-95 px-5 py-3 text-xs font-bold text-white transition-all shadow-md shrink-0 cursor-pointer"
          >
            <span>Search All Bhopal PGs</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </section>

      </main>
    </div>
  );
}
