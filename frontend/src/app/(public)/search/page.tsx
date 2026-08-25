import { Suspense } from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { SearchBar } from '@/components/pg/SearchBar';
import { ListingFilters } from '@/components/pg/ListingFilters';
import { PGCard } from '@/components/pg/PGCard';
import { backendClient } from '@/api/backendClient'; 
import { BACKEND_ENDPOINTS } from '@/api/endpoints'; 
import { ShieldCheck, Info, Sparkles } from 'lucide-react';
import type { PagedResponse } from '@/types/api.types';
import type { PG } from '@/types/pg.types';

export const metadata: Metadata = {
  title: 'Search Verified PGs & Hostels',
  description: 'Explore verified student accommodations, compare amenities, rent prices, and locations across India.',
};

// ==========================================
// SERVER-SIDE DATA FETCHING LAYER (RSC)
// ==========================================
async function SearchResults({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const query = typeof params.q === 'string' ? params.q : '';
  const city = typeof params.city === 'string' ? params.city : '';
  const maxRent = typeof params.maxRent === 'string' ? params.maxRent : '';
  const category = typeof params.category === 'string' ? params.category : '';
  const food = typeof params.food === 'string' ? params.food : '';
  const wifi = typeof params.wifi === 'string' ? params.wifi : '';
  const parking = typeof params.parking === 'string' ? params.parking : '';
  const laundry = typeof params.laundry === 'string' ? params.laundry : '';
  const ac =
  typeof params.ac === 'string'
    ? params.ac
    : '';

const powerBackup =
  typeof params.powerBackup === 'string'
    ? params.powerBackup
    : '';

 const hasStructuredFilters = Boolean(
  city ||
  maxRent ||
  category ||
  food ||
  wifi ||
  parking ||
  laundry ||
  ac ||
  powerBackup
);

  const queryParams = new URLSearchParams({
    page: '0',
    size: '12',
    sortBy: 'rent',
    direction: 'asc',
  });

  if (query) queryParams.set('q', query);
  if (city) queryParams.set('city', city);
  if (maxRent) queryParams.set('maxRent', maxRent);
  if (category) queryParams.set('category', category);
  if (food) queryParams.set('food', food);
  if (wifi) queryParams.set('wifi', wifi);
  if (parking) queryParams.set('parking', parking);
  if (laundry) queryParams.set('laundry', laundry);
  if (ac) {
  queryParams.set('ac', ac);
}

if (powerBackup) {
  queryParams.set('powerBackup', powerBackup);
}

  try {
    const endpoint = query
      ? `${BACKEND_ENDPOINTS.SEARCH.TEXT}?${queryParams.toString()}`
      : hasStructuredFilters
        ? `${BACKEND_ENDPOINTS.STUDENT.FILTER}?${queryParams.toString()}`
        : `${BACKEND_ENDPOINTS.STUDENT.PGS}?${queryParams.toString()}`;

    const data = await backendClient.get<PagedResponse<PG> | PG[]>(endpoint);
    const items = Array.isArray(data) ? data : data.content || [];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {items.length} Properties Available
            </h2>
            <p className="text-xs font-semibold text-slate-400">Verified student spaces matching your query</p>
          </div>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {items.map((listing) => (
            <div key={listing.id} className="transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl rounded-[24px]">
              <PGCard pg={listing} />
            </div>
          ))}
        </div>

        {!items.length && (
          <div className="bg-white rounded-[32px] border border-dashed border-slate-200 p-16 text-center max-w-lg mx-auto my-12 shadow-sm">
            <Info className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h4 className="font-bold text-base text-slate-800">No Listings Match Your Search</h4>
            <p className="text-xs text-slate-400 mt-2 max-w-xs mx-auto">
              Try adjusting your budgets, modifying parameters, or cleaning up query filters.
            </p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Search fetch crashed:", error);
    throw error;
  }
}

// ==========================================
// PRODUCTION-GRADE DISCOVERY LAYOUT
// ==========================================
export default function SearchPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 antialiased pb-20">
      
      {/* HERO SECTION */}
      <section className="relative py-14 md:py-24 text-white overflow-hidden shadow-lg border-b border-slate-100">
        <Image
          src="/findyour pg.jpeg"
          alt="Find student PG and co-living accommodations"
          fill
          priority
          sizes="100vw"
          quality={85}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/80 to-slate-900/40" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 bg-pink-500/20 text-pink-300 border border-pink-500/30 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-md">
              <Sparkles className="w-3 h-3" /> Verified Student Living
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mt-4 leading-none">
              Find PGs that feel like <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Home</span>
            </h1>
            <p className="text-slate-300 text-sm md:text-base mt-4 font-medium max-w-xl leading-relaxed opacity-90">
              Curated premium accommodations near elite campuses, enterprise tech parks, and transit hubs. Zero brokerage, absolute transparency.
            </p>

            <div className="mt-8 bg-white text-slate-950 rounded-[24px] shadow-2xl p-1.5 border border-white/20 max-w-xl group transition-all focus-within:ring-4 focus-within:ring-emerald-500/20">
              <SearchBar />
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* MOBILE FILTERS */}
<div className="block lg:hidden">
  <ListingFilters />
</div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* DESKTOP SIDEBAR PANEL */}
          <aside className="hidden lg:block lg:col-span-3 lg:sticky lg:top-24">
            <div className="bg-white rounded-[28px] border border-slate-200/60 p-6 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-2">
                <div className="text-[11px] font-black uppercase text-slate-400 tracking-widest mb-1">Filters</div>
                <p className="text-[11px] font-medium text-slate-400">Narrow down your custom stay options</p>
              </div>
              
              <ListingFilters />

              <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-[20px] p-5 shadow-inner space-y-3 relative overflow-hidden">
                <div className="flex gap-2.5 items-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <h5 className="text-xs font-black tracking-tight">100% Secure Auditing</h5>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                  Every listed stay undergoes strict biometric infrastructure checks and pricing validation routines.
                </p>
              </div>
            </div>
          </aside>

          {/* MAIN RESULTS DISCOVERY VIEWPORT */}
          <section className="col-span-1 lg:col-span-9">
            <Suspense fallback={
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-64 bg-slate-200/50 border border-slate-100 rounded-[28px] animate-pulse w-full" />
                ))}
              </div>
            }>
              <SearchResults searchParams={searchParams} />
            </Suspense>
          </section>

        </div>
      </main>
    </div>
  );
}