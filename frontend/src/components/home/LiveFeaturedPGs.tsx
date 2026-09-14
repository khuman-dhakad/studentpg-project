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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            {/* Real placeholder cards based on actual Bhopal student hostels */}
            {[
              {
                id: 'shree-residency',
                pgName: 'Shree Residency PG',
                city: 'MP Nagar',
                state: 'Bhopal',
                rent: 8000,
                approvalStatus: 'APPROVED',
                roomType: 'Double Sharing',
                wifiAvailable: true,
                foodAvailable: true,
                acAvailable: true,
                parkingAvailable: true,
                images: [
                  {
                    publicId: 'shree-img',
                    url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
                  },
                ],
              },
              {
                id: 'comfort-stay',
                pgName: 'Comfort Stay PG',
                city: 'Kolar Road',
                state: 'Bhopal',
                rent: 6500,
                approvalStatus: 'APPROVED',
                roomType: 'Triple Sharing',
                wifiAvailable: true,
                foodAvailable: true,
                acAvailable: false,
                parkingAvailable: true,
                images: [
                  {
                    publicId: 'comfort-img',
                    url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
                  },
                ],
              },
            ].map((mock) => (
              <PGCard key={mock.id} pg={mock as unknown as PG} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
