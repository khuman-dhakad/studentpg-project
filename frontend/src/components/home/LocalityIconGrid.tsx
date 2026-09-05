'use client';

import Link from 'next/link';
import {
  ChevronRight,
  Bed,
  ShieldCheck,
  BedDouble,
  Users2,
} from 'lucide-react';
import { AreaCard } from '@/components/home/AreaCard';
import { HOMEPAGE_POPULAR_AREAS } from '@/data/popularAreas';

/* ==========================================================================
   FIND BY STAY TYPE (Section 5 in Approved Reference)
   ========================================================================== */

const STAY_CATEGORIES = [
  {
    name: 'Boys PGs & Hostels',
    href: '/search?category=BOYS',
    icon: Bed,
    color: 'bg-blue-50 text-blue-600 border-blue-100',
  },
  {
    name: 'Girls PGs & Hostels',
    href: '/search?category=GIRLS',
    icon: ShieldCheck,
    color: 'bg-rose-50 text-rose-600 border-rose-100',
  },
  {
    name: 'Single Private Rooms',
    href: '/search?roomType=Single',
    icon: BedDouble,
    color: 'bg-amber-50 text-amber-600 border-amber-100',
  },
  {
    name: 'Double / Triple Sharing',
    href: '/search?roomType=Double',
    icon: Users2,
    color: 'bg-purple-50 text-purple-600 border-purple-100',
  },
] as const;

export function LocalityIconGrid() {
  return (
    <div className="w-full bg-white space-y-6 sm:space-y-8 py-2 sm:py-4">

      {/* =================================================================
          SECTION 4: POPULAR AREAS IN BHOPAL
          ================================================================= */}
      <section id="popular-areas" className="w-full">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Section Header */}
          <div className="flex items-center justify-between gap-4 mb-3 sm:mb-4">
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Popular Areas in Bhopal
            </h2>

            <Link
              href="/areas"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#059669] hover:text-emerald-800 transition-colors"
            >
              <span>View All Areas</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Locality Cards Carousel / Grid: 4 items matching reference */}
          <div className="flex sm:grid sm:grid-cols-4 gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            {HOMEPAGE_POPULAR_AREAS.map((area, index) => (
              <div key={area.id} className="w-36 sm:w-auto shrink-0">
                <AreaCard area={area} priority={index === 0} />
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =================================================================
          SECTION 5: FIND BY STAY TYPE
          ================================================================= */}
      <section className="w-full">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Section Header */}
          <div className="flex items-center justify-between gap-4 mb-3 sm:mb-4">
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Find by Stay Type
            </h2>

            <Link
              href="/search"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#059669] hover:text-emerald-800 transition-colors"
            >
              <span>View All</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Stay Category Cards Grid: 4 items */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {STAY_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  href={cat.href}
                  className="group flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white p-2 sm:p-3 text-center shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-xs active:scale-[0.98] min-h-[96px] sm:min-h-[108px] cursor-pointer"
                >
                  {/* Category Squircle Icon */}
                  <div
                    className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl border ${cat.color} transition-transform duration-200 group-hover:scale-105`}
                  >
                    <Icon className="h-5 w-5 shrink-0 stroke-[2.2px]" />
                  </div>

                  {/* Category Label */}
                  <span className="mt-2 text-[10px] sm:text-xs font-bold text-slate-800 leading-tight group-hover:text-emerald-700 transition-colors line-clamp-2">
                    {cat.name}
                  </span>
                </Link>
              );
            })}
          </div>

        </div>
      </section>

    </div>
  );
}
