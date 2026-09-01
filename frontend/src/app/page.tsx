import Link from 'next/link';
import Image from 'next/image';
import { SearchBar } from '@/components/pg/SearchBar';
import { PGCard } from '@/components/pg/PGCard';
import { backendClient } from '@/api/backendClient';
import { BACKEND_ENDPOINTS } from '@/api/endpoints';
import type { PagedResponse } from '@/types/api.types';
import type { PG } from '@/types/pg.types';
import {
  MapPin,
  ShieldCheck,
  Wallet,
  Zap,
  ChevronRight,
  Sparkles,
  Users,
  Utensils,
  Wifi,
  Snowflake,
  Search,
  SlidersHorizontal,
  CheckCircle2,
  PhoneCall,
  PlusCircle,
  Building2,
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export const dynamic = 'force-dynamic';

const POPULAR_AREAS = [
  {
    name: 'MP Nagar Zone 1 & 2',
    tag: 'Coaching Hub',
    landmark: 'Chetak Bridge & Sargam',
    query: 'MP Nagar',
    accent: 'from-emerald-600 to-teal-800',
  },
  {
    name: 'Indrapuri Sector A/B/C',
    tag: 'LNCT & BHEL Belt',
    landmark: 'Raisen Road Campus',
    query: 'Indrapuri',
    accent: 'from-blue-600 to-indigo-800',
  },
  {
    name: 'Kolar Road',
    tag: 'University Zone',
    landmark: 'Sarvepalli & Mandakini',
    query: 'Kolar Road',
    accent: 'from-purple-600 to-indigo-900',
  },
  {
    name: 'Near MANIT / Mata Mandir',
    tag: 'Premier Tech Hub',
    landmark: 'MANIT Square & TT Nagar',
    query: 'MANIT',
    accent: 'from-amber-600 to-orange-800',
  },
  {
    name: 'Anand Nagar & Piplani',
    tag: 'East Academic Corridor',
    landmark: 'Patel Group & Oriental',
    query: 'Anand Nagar',
    accent: 'from-rose-600 to-red-800',
  },
  {
    name: 'Ayodhya Bypass',
    tag: 'Engineering Belt',
    landmark: 'SIRT & Peoples University',
    query: 'Ayodhya Bypass',
    accent: 'from-cyan-600 to-blue-800',
  },
  {
    name: 'Arera Colony & Shahpura',
    tag: 'Prime Residential',
    landmark: '10 No. Market & Manisha',
    query: 'Arera Colony',
    accent: 'from-emerald-700 to-green-900',
  },
  {
    name: 'Hoshangabad Road',
    tag: 'Corporate & Colleges',
    landmark: 'Misrod & RGPV Tech Hub',
    query: 'Hoshangabad Road',
    accent: 'from-violet-600 to-purple-900',
  },
] as const;

const CURATED_COLLECTIONS = [
  {
    title: 'Boys PGs',
    subtitle: 'Verified bachelor rooms',
    href: '/search?category=BOYS',
    icon: Users,
    color: 'text-blue-600 bg-blue-50 border-blue-100 hover:border-blue-300',
  },
  {
    title: 'Girls PGs',
    subtitle: 'Safe & gated student stays',
    href: '/search?category=GIRLS',
    icon: ShieldCheck,
    color: 'text-pink-600 bg-pink-50 border-pink-100 hover:border-pink-300',
  },
  {
    title: 'Under ₹5,000 / mo',
    subtitle: 'Budget-friendly accommodations',
    href: '/search?maxRent=5000',
    icon: Wallet,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-100 hover:border-emerald-300',
  },
  {
    title: 'Meals Included',
    subtitle: '3-time hygienic mess food',
    href: '/search?food=true',
    icon: Utensils,
    color: 'text-amber-600 bg-amber-50 border-amber-100 hover:border-amber-300',
  },
  {
    title: 'High-Speed Wi-Fi',
    subtitle: 'Fiber broadband active',
    href: '/search?wifi=true',
    icon: Wifi,
    color: 'text-indigo-600 bg-indigo-50 border-indigo-100 hover:border-indigo-300',
  },
  {
    title: 'Air Conditioned',
    subtitle: 'Summer-ready premium AC rooms',
    href: '/search?ac=true',
    icon: Snowflake,
    color: 'text-cyan-600 bg-cyan-50 border-cyan-100 hover:border-cyan-300',
  },
] as const;

async function getFeaturedPgs() {
  try {
    const response = await backendClient.get<PagedResponse<PG>>(
      `${BACKEND_ENDPOINTS.STUDENT.PGS}?page=0&size=6&sortBy=rent&direction=asc`
    );
    return response.content ?? [];
  } catch (error) {
    console.error('Error fetching featured PGs:', error);
    return [];
  }
}

export default async function HomePage() {
  const featuredPgs = await getFeaturedPgs();

  return (
    <div className="min-h-screen bg-cream font-sans antialiased text-ink">
      {/* =========================================================
          1. SEARCH-FIRST HERO
      ========================================================== */}
      <section className="relative flex min-h-[60vh] md:min-h-[75vh] w-full items-center justify-center overflow-hidden px-4 py-12 md:py-20">
        {/* Background Image with High-Clarity Optimization */}
        <Image
          src="/hero-bg.jpg.png"
          alt="Comfortable student accommodations in Bhopal"
          fill
          priority
          sizes="100vw"
          quality={85}
          className="object-cover"
        />

        {/* Soft Contrast Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950/90" />

        <div className="relative z-10 mx-auto w-full max-w-4xl px-2 text-center">
          {/* Trust Badge Pill */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-950/40 px-4 py-2 text-[11px] font-bold tracking-wide text-emerald-300 backdrop-blur-md md:text-xs">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Trusted by 50,000+ Students & Parents in Bhopal</span>
          </div>

          {/* Main Headline */}
          <h1 className="mb-4 text-3xl font-black leading-tight tracking-tight text-white drop-shadow-md sm:text-4xl md:text-6xl">
            Find Your Next Home,
            <br />
            <span className="text-emerald-400">Not Just a Room.</span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mb-8 max-w-2xl text-xs font-medium leading-relaxed text-slate-200 drop-shadow-sm sm:text-sm md:text-base">
            100% verified student PGs and co-living stays in Bhopal. Zero brokerage, transparent deposits, and direct WhatsApp connect with property hosts.
          </p>

          {/* Search Bar Container */}
          <div className="mx-auto max-w-2xl rounded-2xl border border-white/20 bg-white/10 p-2 shadow-2xl backdrop-blur-md transition-all focus-within:border-emerald-400 focus-within:bg-white/15">
            <SearchBar />
          </div>

          {/* Popular Search Shortcuts */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-slate-300">
            <span className="flex items-center gap-1 font-bold text-white">
              <MapPin className="h-3.5 w-3.5 text-emerald-400" />
              Popular Areas:
            </span>

            {['MP Nagar', 'Indrapuri', 'Kolar Road', 'Near MANIT', 'Anand Nagar'].map((area) => (
              <Link
                key={area}
                href={`/search?q=${encodeURIComponent(area)}`}
                className="rounded-full border border-white/20 bg-black/30 px-3 py-1 text-slate-200 backdrop-blur-sm transition-all hover:border-emerald-400 hover:bg-black/50 hover:text-white"
              >
                {area}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          2. TRUST PILLARS
      ========================================================== */}
      <section className="relative z-20 mx-auto -mt-8 max-w-6xl px-4 sm:-mt-10">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:gap-6">
          <div className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-transform group-hover:scale-110">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-sm font-black tracking-tight text-ink">100% Verified Stays</h2>
              <p className="text-xs text-ink-soft">Physical security & host checks</p>
            </div>
          </div>

          <div className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-transform group-hover:scale-110">
              <Wallet className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-sm font-black tracking-tight text-ink">Zero Brokerage</h2>
              <p className="text-xs text-ink-soft">Pay direct to owner, ₹0 agent fee</p>
            </div>
          </div>

          <div className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition-transform group-hover:scale-110">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-sm font-black tracking-tight text-ink">Direct WhatsApp Connect</h2>
              <p className="text-xs text-ink-soft">Fast inquiry & same-day move-in</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          3. EXPLORE POPULAR BHOPAL LOCALITIES & AREAS
      ========================================================== */}
      <section className="mx-auto max-w-6xl px-4 pt-16 pb-12 md:pt-20">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-brand">
              <MapPin className="h-3.5 w-3.5" /> Bhopal Student Hubs
            </div>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-ink sm:text-3xl">
              Explore PGs by Locality & Area
            </h2>
            <p className="mt-1 text-xs text-ink-soft sm:text-sm">
              Discover verified student accommodations near your college, coaching institute, or university.
            </p>
          </div>

          <Link
            href={ROUTES.SEARCH}
            className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-brand hover:underline"
          >
            <span>View All Areas</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 md:gap-4">
          {POPULAR_AREAS.map((area) => (
            <Link
              key={area.name}
              href={`/search?q=${encodeURIComponent(area.query)}`}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-surface p-4 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-brand/40 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="inline-flex rounded-md bg-cream px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-brand">
                  {area.tag}
                </span>
                <ChevronRight className="h-4 w-4 text-ink-soft transition-transform group-hover:translate-x-0.5 group-hover:text-brand" />
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-black text-ink transition-colors group-hover:text-brand">
                  {area.name}
                </h3>
                <p className="mt-0.5 text-[11px] font-medium text-ink-soft">
                  {area.landmark}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* =========================================================
          4. QUICK DISCOVERY / CURATED COLLECTIONS
      ========================================================== */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-brand">
            <Sparkles className="h-3.5 w-3.5" /> Quick Discovery
          </div>
          <h2 className="mt-1 text-xl font-black tracking-tight text-ink sm:text-2xl">
            Browse by Stay Category
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 md:gap-4">
          {CURATED_COLLECTIONS.map((col) => {
            const Icon = col.icon;
            return (
              <Link
                key={col.title}
                href={col.href}
                className={`group flex flex-col items-center rounded-2xl border p-4 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-sm ${col.color}`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-xs transition-transform group-hover:scale-110">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-3 text-xs font-black text-slate-900">{col.title}</h3>
                <p className="mt-0.5 text-[10px] font-semibold text-slate-500">{col.subtitle}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          5. HANDPICKED FEATURED PROPERTIES
      ========================================================== */}
      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-emerald-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Verified Listings
            </div>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-ink sm:text-3xl">
              Featured Accommodations in Bhopal
            </h2>
            <p className="mt-1 text-xs text-ink-soft sm:text-sm">
              Handpicked PGs and student spaces with verified photos, amenities, and rent details.
            </p>
          </div>

          <Link
            href={ROUTES.SEARCH}
            className="hidden sm:inline-flex items-center gap-1 rounded-xl border border-border bg-surface px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-ink shadow-xs transition-all hover:bg-cream hover:text-brand"
          >
            <span>View All</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredPgs.length > 0 ? (
            featuredPgs.map((pg) => <PGCard key={pg.id} pg={pg} />)
          ) : (
            <div className="col-span-full rounded-2xl border-2 border-dashed border-border bg-surface p-12 text-center">
              <Building2 className="mx-auto h-10 w-10 text-ink-soft opacity-50 mb-3" />
              <h3 className="text-base font-bold text-ink">Properties are loading...</h3>
              <p className="mt-1 text-xs text-ink-soft">
                Explore our full catalog of student accommodations via the search directory.
              </p>
              <Link
                href={ROUTES.SEARCH}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-xs hover:bg-brand-dark transition-all"
              >
                Browse All PGs
              </Link>
            </div>
          )}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href={ROUTES.SEARCH}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface py-3 text-xs font-extrabold uppercase tracking-wider text-ink shadow-xs"
          >
            <span>Explore All 100+ Bhopal PGs</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* =========================================================
          6. HOW STUDENTPG WORKS (4-STEP JOURNEY)
      ========================================================== */}
      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="rounded-3xl border border-border bg-surface p-6 sm:p-10 lg:p-12 shadow-xs">
          <div className="text-center">
            <span className="inline-flex rounded-full bg-cream px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest text-brand">
              Simple 4-Step Process
            </span>
            <h2 className="mt-3 text-2xl font-black tracking-tight text-ink sm:text-3xl">
              How StudentPG Works
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-xs text-ink-soft sm:text-sm">
              Finding your ideal student stay in Bhopal takes less than 2 minutes with zero middlemen.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                <Search className="h-6 w-6" />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[10px] font-black text-white">1</span>
                <h3 className="text-sm font-black text-ink">Search Locality</h3>
              </div>
              <p className="mt-2 text-xs text-ink-soft">
                Enter your coaching hub, college name, or preferred Bhopal area.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                <SlidersHorizontal className="h-6 w-6" />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[10px] font-black text-white">2</span>
                <h3 className="text-sm font-black text-ink">Filter & Compare</h3>
              </div>
              <p className="mt-2 text-xs text-ink-soft">
                Narrow down by budget, sharing type (Single/Double/Triple), and meals.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[10px] font-black text-white">3</span>
                <h3 className="text-sm font-black text-ink">Inspect Photos</h3>
              </div>
              <p className="mt-2 text-xs text-ink-soft">
                Check real room photos, amenities matrix, and verified host credentials.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                <PhoneCall className="h-6 w-6" />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[10px] font-black text-white">4</span>
                <h3 className="text-sm font-black text-ink">Connect Direct</h3>
              </div>
              <p className="mt-2 text-xs text-ink-soft">
                Call or WhatsApp the property host directly with ₹0 broker commission.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          7. PROPERTY OWNER CONVERSION BANNER
      ========================================================== */}
      <section className="mx-auto max-w-6xl px-4 pb-16 md:pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 px-6 py-10 sm:px-12 sm:py-14 text-white shadow-xl">
          <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-xl">
              <span className="inline-flex rounded-full bg-emerald-400/20 px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest text-emerald-300">
                For Property Owners & Hosts
              </span>
              <h2 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">
                Own a PG or Hostel in Bhopal? List it for Free.
              </h2>
              <p className="mt-2 text-xs text-slate-300 sm:text-sm leading-relaxed">
                Connect directly with thousands of verified students looking for accommodation. 100% transparent, direct student WhatsApp inquiries, zero commission.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                href={ROUTES.OWNER.REGISTER}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-6 py-3.5 text-xs font-black uppercase tracking-wider text-slate-950 shadow-md transition-all active:scale-95"
              >
                <PlusCircle className="h-4 w-4" />
                <span>List Your Property</span>
              </Link>

              <Link
                href={ROUTES.OWNER.LOGIN}
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm transition-all"
              >
                <span>Owner Login</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}