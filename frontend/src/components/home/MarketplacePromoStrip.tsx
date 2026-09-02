'use client';

import Link from 'next/link';
import {
  ChevronRight,
  ShieldCheck,
  Users,
  GraduationCap,
  Snowflake,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

const FEATURE_CARDS = [
  {
    title: 'BOYS PGS',
    subtitle: 'Coaching & Campuses',
    tag: 'From ₹3,500/mo',
    href: '/search?category=BOYS',
    gradient: 'from-blue-600 to-indigo-900',
    icon: Users,
    badgeBg: 'bg-blue-400/20 text-blue-200 border-blue-400/30',
  },
  {
    title: 'GIRLS PGS',
    subtitle: 'Safe, Gated & Audited',
    tag: '100% Verified',
    href: '/search?category=GIRLS',
    gradient: 'from-rose-600 to-pink-900',
    icon: ShieldCheck,
    badgeBg: 'bg-pink-400/20 text-pink-200 border-pink-400/30',
  },
  {
    title: 'NEAR COLLEGES',
    subtitle: 'MANIT, LNCT, SIRT',
    tag: 'Walking Distance',
    href: '/search?q=MANIT',
    gradient: 'from-amber-600 to-orange-950',
    icon: GraduationCap,
    badgeBg: 'bg-amber-400/20 text-amber-200 border-amber-400/30',
  },
  {
    title: 'PREMIUM AC ROOMS',
    subtitle: 'Furnished Stays',
    tag: 'Single / Sharing',
    href: '/search?ac=true',
    gradient: 'from-teal-600 to-emerald-950',
    icon: Snowflake,
    badgeBg: 'bg-emerald-400/20 text-emerald-200 border-emerald-400/30',
  },
] as const;

export function MarketplacePromoStrip() {
  return (
    <section className="w-full py-6 sm:py-8 bg-slate-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Horizontal Card Row Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Main Hero Spotlight Banner (Span 4 columns on Desktop) */}
          <div className="md:col-span-4 lg:col-span-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 p-5 sm:p-6 text-white flex flex-col justify-between shadow-sm relative overflow-hidden group">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
            
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-300 backdrop-blur-md">
                <Sparkles className="h-3 w-3" /> StudentPG Exclusive
              </div>
              
              <h2 className="mt-3 text-lg sm:text-xl font-black tracking-tight leading-tight">
                Zero Brokerage Move-in Guarantee
              </h2>
              
              <p className="mt-2 text-xs text-slate-300 font-medium leading-relaxed">
                Connect directly with property hosts on WhatsApp. Transparent security deposits and instant room availability checks.
              </p>
            </div>

            <div className="mt-5">
              <Link
                href="/search"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-slate-950 shadow-md transition-all"
              >
                <span>Browse Bhopal PGs</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* 4 Portrait Feature Cards (Span 8 columns on Desktop, 2x2 grid on mobile/tablet) */}
          <div className="md:col-span-8 lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-3.5">
            {FEATURE_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.title}
                  href={card.href}
                  className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-b ${card.gradient} p-4 sm:p-4 text-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-98 min-h-[160px] sm:min-h-[180px]`}
                >
                  {/* Top Badge */}
                  <div className="flex items-start justify-between gap-1">
                    <span className={`inline-flex rounded-md border px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${card.badgeBg}`}>
                      {card.tag}
                    </span>
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
                      <ChevronRight className="h-3.5 w-3.5 text-white" />
                    </div>
                  </div>

                  {/* Icon & Label */}
                  <div className="mt-4">
                    <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm text-white shadow-xs transition-transform group-hover:scale-110">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-xs sm:text-sm font-black tracking-tight leading-tight">
                      {card.title}
                    </h3>
                    <p className="mt-0.5 text-[10px] text-white/80 font-medium truncate">
                      {card.subtitle}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
