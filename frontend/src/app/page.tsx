import Link from 'next/link';
import Image from 'next/image';
import { SearchBar } from '@/components/pg/SearchBar';
import { PGCard } from '@/components/pg/PGCard';
import { backendClient } from '@/api/backendClient';
import { BACKEND_ENDPOINTS } from '@/api/endpoints';
import type { PagedResponse } from '@/types/api.types';
import type { PG } from '@/types/pg.types';
import {
  Search,
  MapPin,
  Bookmark,
  User,
  Home as HomeIcon,
  ShieldCheck,
  Wallet,
  Zap,
  ChevronRight,
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export const dynamic = 'force-dynamic';

const CITY_GRADIENTS = [
  'from-blue-600 to-indigo-900',
  'from-emerald-600 to-teal-900',
  'from-purple-600 to-indigo-950',
  'from-rose-600 to-rose-950',
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
  const citySummaries = featuredPgs.reduce<Record<string, number>>((acc, pg) => {
    acc[pg.city] = (acc[pg.city] ?? 0) + 1;
    return acc;
  }, {});
  const cities = Object.entries(citySummaries)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 4)
    .map(([name, count], index) => ({
      name,
      count: `${count} stay${count === 1 ? '' : 's'}`,
      gradient: CITY_GRADIENTS[index % CITY_GRADIENTS.length],
    }));

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24 md:pb-0 font-sans antialiased">
      {/* ============ 1. HERO SECTION ============ */}
      <section className="relative flex h-[55vh] w-full items-center justify-center overflow-hidden px-4 md:h-[75vh]">
        {/* Hero Background Image */}
        <Image
          src="/hero-bg.jpg.png"
          alt="Comfortable student accommodation in top educational hubs"
          fill
          priority
          sizes="100vw"
          quality={85}
          className="object-cover"
        />

        {/* Very Light Overlay - Only for Text Readability */}
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative z-10 mx-auto w-full max-w-4xl px-2 text-center">
          <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-black/20 px-4 py-2 text-[11px] font-semibold tracking-wide text-white backdrop-blur-md md:text-xs">
            <ShieldCheck className="h-4 w-4 text-emerald-300" />
            Trusted by 50,000+ students & professionals
          </span>

          <h1 className="mb-4 text-3xl font-black leading-tight tracking-tight text-white drop-shadow-lg sm:text-4xl md:text-6xl">
            Find your next home,
            <br />
            <span className="text-emerald-300">
              not just a room.
            </span>
          </h1>

          <p className="mx-auto mb-8 max-w-xl text-xs font-medium leading-relaxed text-white/90 drop-shadow-md sm:text-sm md:text-lg">
            Verified PGs and co-living spaces with premium amenities,
            zero brokerage, and immediate move-in options.
          </p>

          <div className="mx-auto mt-4 max-w-2xl rounded-2xl border border-white/30 bg-white/15 p-1.5 shadow-2xl backdrop-blur-md md:rounded-full">
            <SearchBar />
          </div>

          <div className="mt-6 hidden items-center justify-center gap-2.5 text-xs font-medium text-white/80 md:flex">
            <span className="flex items-center gap-1 text-white">
              <MapPin className="h-3.5 w-3.5" />
              Popular Searches:
            </span>

            {['Bhopal', 'Indore', 'MP Nagar', 'Near MANIT'].map((tag) => (
              <Link
                key={tag}
                href={`/search?q=${encodeURIComponent(tag)}`}
                className="rounded-full border border-white/30 bg-black/20 px-3.5 py-1.5 text-white backdrop-blur-sm transition-all duration-300 hover:border-emerald-300 hover:bg-black/30"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 2. TRUST BADGES ============ */}
      <div className="max-w-6xl mx-auto px-4 -mt-10 sm:-mt-12 relative z-20">
        <div className="grid grid-cols-3 gap-3 md:gap-6">
          {[
            { label: 'Verified Stays', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Zero Brokerage', icon: Wallet, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Fast Move-in', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map((item, i) => (
            <div
              key={i}
              className="group relative bg-white p-3.5 sm:p-6 rounded-2xl shadow-xl shadow-slate-200/80 border border-slate-100 text-center overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 to-indigo-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
              <div className={`w-9 h-9 sm:w-12 sm:h-12 mx-auto mb-2.5 rounded-xl ${item.bg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                <item.icon className={`w-4 h-4 sm:w-6 sm:h-6 ${item.color}`} />
              </div>
              <p className="text-[10px] sm:text-xs md:text-sm font-black text-slate-800 uppercase tracking-wider group-hover:text-slate-950 transition-colors">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ============ 3. FEATURED PROPERTIES ============ */}
      <main className="max-w-6xl mx-auto px-4 pt-12 pb-14 md:py-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Handpicked Collection
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Properties
            </h2>
          </div>
          <Link
            href={ROUTES.SEARCH}
            className="hidden md:flex items-center gap-1 text-slate-900 font-bold text-sm bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 group"
          >
            View all <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
          {featuredPgs.length ? (
            featuredPgs.map((pg) => <PGCard key={pg.id} pg={pg} />)
          ) : (
            <div className="col-span-full rounded-2xl border-2 border-dashed border-slate-200 bg-white p-8 text-center text-sm font-semibold text-slate-500 shadow-inner">
              🏠 No featured properties available right now. Please explore other listings.
            </div>
          )}
        </div>

        <Link
          href={ROUTES.SEARCH}
          className="md:hidden flex items-center justify-center gap-1 text-slate-900 font-bold text-sm mt-6 py-3.5 bg-white border border-slate-200 rounded-xl shadow-sm active:scale-98 transition-all"
        >
          View all properties <ChevronRight className="w-4 h-4 text-slate-400" />
        </Link>
      </main>

      {/* ============ 4. EXPLORE BY CITY ============ */}
      <section className="max-w-6xl mx-auto px-4 pb-14 md:pb-20">
        <div className="mb-6">
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">Top Hubs</p>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Explore by City</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cities.length ? (
            cities.map((city) => (
              <Link
                key={city.name}
                href={`/search?city=${encodeURIComponent(city.name)}`}
                className={`group relative h-28 sm:h-36 rounded-2xl overflow-hidden bg-gradient-to-br ${city.gradient} text-left p-4 sm:p-5 flex flex-col justify-end shadow-md shadow-slate-200 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl active:scale-98`}
              >
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
                <div className="absolute top-3 right-3 w-7 h-7 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                  <ChevronRight className="w-4 h-4 text-white" />
                </div>
                <span className="relative text-white font-black text-base md:text-lg tracking-tight">{city.name}</span>
                <span className="relative text-white/80 text-[11px] md:text-xs font-medium mt-0.5">{city.count}</span>
              </Link>
            ))
          ) : (
            <div className="col-span-full rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-sm font-semibold text-slate-500">
              No city data is currently available from the listings service.
            </div>
          )}
        </div>
      </section>

      {/* ============ 5. CTA BANNER ============ */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 px-6 py-10 md:px-14 md:py-16 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-slate-800">
          <div className="absolute -right-16 -top-16 w-60 h-60 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-60 h-60 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-xl">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-2.5 tracking-tight leading-tight">
              Own a property? List it for free.
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm md:text-base font-medium leading-relaxed">
              Reach thousands of verified students & professionals looking for a premium stay — absolute transparent pipeline with zero commission.
            </p>
          </div>
          <Link
            href="/owner/register"
            className="relative z-10 shrink-0 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-7 py-4 rounded-xl shadow-lg shadow-emerald-950/20 hover:shadow-emerald-400/20 active:scale-95 transition-all duration-200 text-sm tracking-wide"
          >
            List Your Property
          </Link>
        </div>
      </section>

      {/* ============ 6. BOTTOM NAV (Mobile Only) ============ */}
      <nav aria-label="Mobile Navigation" className="fixed bottom-0 left-0 right-0 w-full bg-white/90 backdrop-blur-lg border-t border-slate-200/80 flex justify-around py-2.5 md:hidden z-50 shadow-2xl rounded-t-2xl">
        {[
          { label: 'Home', icon: HomeIcon, href: '/', active: true },
          { label: 'Search', icon: Search, href: ROUTES.SEARCH },
          { label: 'Saved', icon: Bookmark, href: ROUTES.SEARCH },
          { label: 'Profile', icon: User, href: ROUTES.OWNER.LOGIN },
        ].map((nav, idx) => (
          <Link
            key={idx}
            href={nav.href}
            aria-label={nav.label}
            aria-current={nav.active ? 'page' : undefined}
            className={`flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all ${
              nav.active ? 'text-emerald-600 scale-105 font-black' : 'text-slate-400 hover:text-slate-600 font-bold'
            }`}
          >
            <nav.icon className={`w-5 h-5 ${nav.active ? 'stroke-[2.5px]' : 'stroke-[2px]'}`} />
            <span className="text-[10px] tracking-wide">{nav.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}