import { Suspense } from 'react';
import { SearchBar } from '@/components/pg/SearchBar';
import { ListingFilters } from '@/components/pg/ListingFilters';
import { PGCard } from '@/components/pg/PGCard';
import { backendClient } from '@/api/backendClient'; // 👈 अपना कोर क्लाइंट इम्पोर्ट करें
import { BACKEND_ENDPOINTS } from '@/api/endpoints'; // 👈 एंडपॉइंट्स इम्पोर्ट करें
import type { PagedResponse } from '@/types/api.types';
import type { PG } from '@/types/pg.types';

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

  const hasStructuredFilters = Boolean(city || maxRent || category || food || wifi || parking || laundry);

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

  try {
    const endpoint = query
      ? `${BACKEND_ENDPOINTS.SEARCH.TEXT}?${queryParams.toString()}`
      : hasStructuredFilters
        ? `${BACKEND_ENDPOINTS.STUDENT.FILTER}?${queryParams.toString()}`
        : `${BACKEND_ENDPOINTS.STUDENT.PGS}?${queryParams.toString()}`;

    const data = await backendClient.get<PagedResponse<PG> | PG[]>(endpoint);

    const items = Array.isArray(data) ? data : data.content || [];

    return (
      <section className="mt-4 grid gap-4 sm:mt-8 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((listing) => (
          <PGCard key={listing.id} pg={listing} />
        ))}
        {!items.length && (
          <div className="rounded-[24px] border border-dashed border-border bg-card p-6 text-sm text-muted-foreground sm:col-span-2 xl:col-span-3">
            No listings matched your search yet. Try different filters or broaden your radius.
          </div>
        )}
      </section>
    );
  } catch (error) {
    console.error("Search fetch crashed:", error);
    // यह एरर सीधे आपके error.tsx बाउंड्री के पास जाएगा
    throw error;
  }
}

export default function SearchPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return (
    <main className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
      <section className="rounded-[28px] border border-border bg-card p-4 shadow-sm sm:p-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-primary">Premium Student Living</p>
        <h1 className="mt-3 font-display text-2xl font-black text-foreground sm:text-4xl">Find a stay that feels like home.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
          Curated spaces near campuses, tech parks, and transit hubs with verified amenities and transparent pricing.
        </p>
        <div className="mt-5">
          <SearchBar />
        </div>
      </section>
      <div className="mt-4">
        <ListingFilters />
      </div>
      <Suspense fallback={<div className="mt-8 rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">Loading listings…</div>}>
        <SearchResults searchParams={searchParams} />
      </Suspense>
    </main>
  );
}