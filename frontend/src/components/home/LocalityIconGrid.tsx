'use client';

import Link from 'next/link';
import {
  MapPin,
  Users,
  ShieldCheck,
  BedDouble,
  Utensils,
  Wifi,
  Snowflake,
  GraduationCap,
  Sparkles,
  Layers,
  Home,
  ChevronRight,
} from 'lucide-react';

const LOCALITY_AND_CATEGORIES = [
  {
    name: 'MP Nagar Zone 1 & 2',
    subtitle: 'Coaching & Test Prep Hub',
    href: '/search?q=MP+Nagar',
    icon: MapPin,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-100 group-hover:border-emerald-300',
  },
  {
    name: 'Indrapuri (LNCT Belt)',
    subtitle: 'Raisen Road Campus Zone',
    href: '/search?q=Indrapuri',
    icon: GraduationCap,
    color: 'text-blue-600 bg-blue-50 border-blue-100 group-hover:border-blue-300',
  },
  {
    name: 'Kolar Road',
    subtitle: 'University & College Hub',
    href: '/search?q=Kolar+Road',
    icon: MapPin,
    color: 'text-purple-600 bg-purple-50 border-purple-100 group-hover:border-purple-300',
  },
  {
    name: 'Near MANIT Campus',
    subtitle: 'Mata Mandir & TT Nagar',
    href: '/search?q=MANIT',
    icon: Sparkles,
    color: 'text-amber-600 bg-amber-50 border-amber-100 group-hover:border-amber-300',
  },
  {
    name: 'Anand Nagar & Piplani',
    subtitle: 'Patel / Oriental / BHEL Belt',
    href: '/search?q=Anand+Nagar',
    icon: MapPin,
    color: 'text-rose-600 bg-rose-50 border-rose-100 group-hover:border-rose-300',
  },
  {
    name: 'Ayodhya Bypass (SIRT)',
    subtitle: 'Engineering & Medical Belt',
    href: '/search?q=Ayodhya+Bypass',
    icon: MapPin,
    color: 'text-cyan-600 bg-cyan-50 border-cyan-100 group-hover:border-cyan-300',
  },
  {
    name: 'Arera Colony & 10 No.',
    subtitle: 'Prime Residential Stays',
    href: '/search?q=Arera+Colony',
    icon: Home,
    color: 'text-indigo-600 bg-indigo-50 border-indigo-100 group-hover:border-indigo-300',
  },
  {
    name: 'Hoshangabad Road',
    subtitle: 'Misrod & RGPV Tech Belt',
    href: '/search?q=Hoshangabad+Road',
    icon: MapPin,
    color: 'text-teal-600 bg-teal-50 border-teal-100 group-hover:border-teal-300',
  },
  {
    name: 'Boys PGs & Hostels',
    subtitle: 'Verified Bachelor Stays',
    href: '/search?category=BOYS',
    icon: Users,
    color: 'text-blue-600 bg-blue-50 border-blue-100 group-hover:border-blue-300',
  },
  {
    name: 'Girls PGs & Hostels',
    subtitle: 'Safe, Gated & Audited',
    href: '/search?category=GIRLS',
    icon: ShieldCheck,
    color: 'text-pink-600 bg-pink-50 border-pink-100 group-hover:border-pink-300',
  },
  {
    name: 'Single Private Rooms',
    subtitle: 'Peaceful Study Stays',
    href: '/search?roomType=Single',
    icon: BedDouble,
    color: 'text-amber-600 bg-amber-50 border-amber-100 group-hover:border-amber-300',
  },
  {
    name: 'Double / Triple Sharing',
    subtitle: 'Budget-Friendly Stays',
    href: '/search?roomType=Double',
    icon: Layers,
    color: 'text-indigo-600 bg-indigo-50 border-indigo-100 group-hover:border-indigo-300',
  },
  {
    name: 'Meals & Mess Included',
    subtitle: '3-Time Hygienic Food',
    href: '/search?food=true',
    icon: Utensils,
    color: 'text-orange-600 bg-orange-50 border-orange-100 group-hover:border-orange-300',
  },
  {
    name: 'High-Speed Wi-Fi',
    subtitle: 'Active Fiber Broadband',
    href: '/search?wifi=true',
    icon: Wifi,
    color: 'text-violet-600 bg-violet-50 border-violet-100 group-hover:border-violet-300',
  },
  {
    name: 'Air Conditioned Rooms',
    subtitle: 'Summer-Ready AC Stays',
    href: '/search?ac=true',
    icon: Snowflake,
    color: 'text-cyan-600 bg-cyan-50 border-cyan-100 group-hover:border-cyan-300',
  },
  {
    name: 'Show All Bhopal Areas',
    subtitle: 'Explore 100+ Live Listings',
    href: '/search',
    icon: ChevronRight,
    color: 'text-slate-900 bg-slate-100 border-slate-200 group-hover:border-slate-400',
  },
] as const;

export function LocalityIconGrid() {
  return (
    <section className="w-full py-8 sm:py-10 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-emerald-600">
              <MapPin className="h-3.5 w-3.5" /> Locality & Category Hub
            </div>
            <h2 className="mt-1 text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Explore PGs by Locality & Stay Type
            </h2>
          </div>

          <Link
            href="/search"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <span>View All Areas</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Dense Squircle Icon Grid (4 cols on mobile, 8 cols on desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-3">
          {LOCALITY_AND_CATEGORIES.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="group flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white p-3 text-center shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md active:scale-95 min-h-[110px]"
              >
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${item.color} shadow-xs transition-transform duration-200 group-hover:scale-110`}>
                  <Icon className="h-5 w-5 shrink-0" />
                </div>
                <h3 className="mt-2.5 text-[11px] font-extrabold text-slate-800 leading-tight group-hover:text-emerald-600 transition-colors line-clamp-2">
                  {item.name}
                </h3>
              </Link>
            );
          })}
        </div>

        {/* Mobile View All Link */}
        <div className="mt-4 text-center sm:hidden">
          <Link
            href="/search"
            className="inline-flex w-full items-center justify-center gap-1 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-black uppercase tracking-wider text-slate-700 active:scale-98"
          >
            <span>Explore All 100+ Bhopal PGs</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
          </Link>
        </div>

      </div>
    </section>
  );
}
