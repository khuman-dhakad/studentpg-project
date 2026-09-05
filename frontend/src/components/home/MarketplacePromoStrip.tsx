'use client';

import {
  ShieldCheck,
  Ban,
  Home,
  GraduationCap,
} from 'lucide-react';

const TRUST_BENEFITS = [
  {
    title: 'Verified Listings',
    icon: ShieldCheck,
    iconColor: 'text-[#059669]',
    bgColor: 'bg-emerald-50 border-emerald-100',
  },
  {
    title: 'No Brokerage',
    icon: Ban,
    iconColor: 'text-rose-600',
    bgColor: 'bg-rose-50 border-rose-100',
  },
  {
    title: 'Safe & Secure Stay',
    icon: Home,
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-50 border-blue-100',
  },
  {
    title: 'Trusted by Students',
    icon: GraduationCap,
    iconColor: 'text-amber-600',
    bgColor: 'bg-amber-50 border-amber-100',
  },
] as const;

export function MarketplacePromoStrip() {
  return (
    <section className="w-full py-5 sm:py-7 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* 4 Trust Benefits Row matching the approved reference design */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4">
          {TRUST_BENEFITS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex flex-col items-center text-center p-1 sm:p-2 group"
              >
                {/* Squircle Icon Container */}
                <div
                  className={`flex h-11 w-11 sm:h-13 sm:w-13 items-center justify-center rounded-2xl border ${item.bgColor} shadow-2xs transition-transform duration-200 group-hover:scale-105`}
                >
                  <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${item.iconColor} stroke-[2.2px] shrink-0`} />
                </div>

                {/* Benefit Label */}
                <span className="mt-2 text-[11px] sm:text-xs font-bold text-slate-800 leading-tight">
                  {item.title}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
