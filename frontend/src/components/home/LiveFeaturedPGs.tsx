'use client';

import Link from 'next/link';
import { PGCard } from '@/components/pg/PGCard';
import type { PG } from '@/types/pg.types';
import { Building2, ChevronRight } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

interface LiveFeaturedPGsProps {
  listings: PG[];
}

export function LiveFeaturedPGs({ listings }: LiveFeaturedPGsProps) {
  return (
    <section className="w-full py-10 sm:py-14 bg-white border-t border-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-emerald-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Live Listings
            </div>
            <h2 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Popular Verified Accommodations in Bhopal
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
              Explore authentic room photos, verified amenities, security features, and direct owner WhatsApp contacts.
            </p>
          </div>

          <Link
            href={ROUTES.SEARCH}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black uppercase tracking-wider text-slate-800 shadow-xs hover:bg-slate-50 hover:border-slate-300 transition-all shrink-0"
          >
            <span>View All PGs</span>
            <ChevronRight className="h-4 w-4 text-slate-500" />
          </Link>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.length > 0 ? (
            listings.map((pg) => <PGCard key={pg.id} pg={pg} />)
          ) : (
            <div className="col-span-full rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-12 text-center">
              <Building2 className="mx-auto h-12 w-12 text-slate-300 mb-3" />
              <h3 className="text-base font-bold text-slate-800">
                Live Accommodations are loading...
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Explore our full catalog of student PGs and hostels in Bhopal.
              </p>
              <Link
                href={ROUTES.SEARCH}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-sm transition-all"
              >
                Explore Full Directory
              </Link>
            </div>
          )}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href={ROUTES.SEARCH}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-3 text-xs font-black uppercase tracking-wider text-slate-800 shadow-xs active:scale-98"
          >
            <span>Explore All 100+ Bhopal PGs</span>
            <ChevronRight className="h-4 w-4 text-slate-500" />
          </Link>
        </div>

      </div>
    </section>
  );
}
