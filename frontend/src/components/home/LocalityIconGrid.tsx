'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronRight,
  Bed,
  ShieldCheck,
  BedDouble,
  Users2,
} from 'lucide-react';

/* ==========================================================================
   POPULAR AREAS IN BHOPAL (Section 4 in Approved Reference)
   ========================================================================== */

const POPULAR_AREAS = [
  {
    name: 'MP Nagar Zone 1 & 2',
    href: '/search?q=MP+Nagar',
    image:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Kolar Road',
    href: '/search?q=Kolar+Road',
    image:
      'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Indrapuri',
    href: '/search?q=Indrapuri',
    image:
      'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Arera Colony',
    href: '/search?q=Arera+Colony',
    image:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
  },
] as const;

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
              href="/search"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#059669] hover:text-emerald-800 transition-colors"
            >
              <span>View All Areas</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Locality Cards Carousel / Grid: 4 items */}
          <div className="flex sm:grid sm:grid-cols-4 gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            {POPULAR_AREAS.map((area) => (
              <Link
                key={area.name}
                href={area.href}
                className="group relative h-28 sm:h-36 w-36 sm:w-auto shrink-0 rounded-2xl overflow-hidden shadow-xs border border-slate-100 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"
              >
                {/* Locality Photo */}
                <Image
                  src={area.image}
                  alt={area.name}
                  fill
                  sizes="(max-width: 640px) 144px, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Dark Gradient Overlay for Strong Legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

                {/* Bottom Content: Name & Right Chevron Pill */}
                <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-3 flex items-end justify-between gap-1.5">
                  <span className="text-xs sm:text-sm font-black text-white leading-tight tracking-tight line-clamp-2">
                    {area.name}
                  </span>
                  <div className="flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-full bg-white/25 backdrop-blur-xs text-white group-hover:bg-white group-hover:text-slate-900 transition-colors">
                    <ChevronRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  </div>
                </div>
              </Link>
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
