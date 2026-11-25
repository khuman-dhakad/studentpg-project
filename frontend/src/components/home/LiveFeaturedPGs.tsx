'use client';

import Link from 'next/link';
import { PGCard } from '@/components/pg/PGCard';
import type { PG } from '@/types/pg.types';
import { ChevronRight } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

interface LiveFeaturedPGsProps {
  listings: PG[];
}

export function LiveFeaturedPGs({ listings }: LiveFeaturedPGsProps) {
  // Show first 2 or 4 featured listings
  const displayListings = listings.slice(0, 4);

  return (
    <section className="w-full py-4 sm:py-6 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header matching Section 6 in Reference */}
        <div className="flex items-center justify-between gap-4 mb-3 sm:mb-4">
          <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            Featured PGs in Bhopal
          </h2>

          <Link
            href={ROUTES.SEARCH}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#059669] hover:text-emerald-800 transition-colors"
          >
            <span>View All</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Listings Grid: 2 columns on mobile/tablet/desktop */}
        {displayListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            {displayListings.map((pg) => (
              <PGCard key={pg.id} pg={pg} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-8 sm:p-12 text-center">
            <p className="text-sm font-bold text-slate-800">
              No featured accommodations currently available
            </p>
            <p className="mt-1 text-xs text-slate-500 font-medium max-w-sm mx-auto">
              Check back soon or explore all listings across Bhopal using search and filters.
            </p>
            <div className="mt-4">
              <Link
                href={ROUTES.SEARCH}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-800 transition-colors shadow-xs"
              >
                <span>Browse All Accommodations</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
