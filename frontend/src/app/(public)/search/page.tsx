import { Suspense } from 'react';
import type { Metadata } from 'next';
import { SearchBar } from '@/components/pg/SearchBar';
import { ListingFilters } from '@/components/pg/ListingFilters';
import { PGCard } from '@/components/pg/PGCard';
import { SearchSortControl } from '@/components/pg/SearchSortControl';
import { backendClient } from '@/api/backendClient';
import { BACKEND_ENDPOINTS } from '@/api/endpoints';
import { Info } from 'lucide-react';
import type { PagedResponse } from '@/types/api.types';
import type { PG } from '@/types/pg.types';

export const metadata: Metadata = {
  title: 'Search Verified PGs & Hostels',
  description: 'Explore verified student accommodations, compare amenities, rent prices, and locations across India.',
};

async function SearchResults({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const query = typeof params.q === 'string' ? params.q : '';
  const city = typeof params.city === 'string' ? params.city : 'Bhopal';
  const maxRent = typeof params.maxRent === 'string' ? params.maxRent : '';
  const category = typeof params.category === 'string' ? params.category : '';
  const food = typeof params.food === 'string' ? params.food : '';
  const wifi = typeof params.wifi === 'string' ? params.wifi : '';
  const parking = typeof params.parking === 'string' ? params.parking : '';
  const laundry = typeof params.laundry === 'string' ? params.laundry : '';
  const ac = typeof params.ac === 'string' ? params.ac : '';
  const powerBackup = typeof params.powerBackup === 'string' ? params.powerBackup : '';
  const sortValue = typeof params.sortBy === 'string' ? params.sortBy : 'rent';
  const direction = typeof params.direction === 'string' ? params.direction : 'asc';

  const hasStructuredFilters = Boolean(city !== 'Bhopal' || maxRent || category || food || wifi || parking || laundry || ac || powerBackup);

  const queryParams = new URLSearchParams({
    page: '0',
    size: '12',
    sortBy: sortValue === 'rent' ? 'rent' : 'rent',
    direction,
  });

  if (query) queryParams.set('q', query);
  if (city && city !== 'Bhopal') queryParams.set('city', city);
  if (maxRent) queryParams.set('maxRent', maxRent);
  if (category) queryParams.set('category', category);
  if (food) queryParams.set('food', food);
  if (wifi) queryParams.set('wifi', wifi);
  if (parking) queryParams.set('parking', parking);
  if (laundry) queryParams.set('laundry', laundry);
  if (ac) queryParams.set('ac', ac);
  if (powerBackup) queryParams.set('powerBackup', powerBackup);

  try {
    const endpoint = query
      ? `${BACKEND_ENDPOINTS.SEARCH.TEXT}?${queryParams.toString()}`
      : hasStructuredFilters
        ? `${BACKEND_ENDPOINTS.STUDENT.FILTER}?${queryParams.toString()}`
        : `${BACKEND_ENDPOINTS.STUDENT.PGS}?${queryParams.toString()}`;

    const data = await backendClient.get<PagedResponse<PG> | PG[]>(endpoint, {
      next: { revalidate: 30, tags: ['public-pgs'] },
    });

    const items = Array.isArray(data) ? data : data.content || [];
    const totalItems = Array.isArray(data) ? data.length : data.totalElements ?? items.length;

    return (
      <div className="space-y-5">
        <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-[-0.03em] text-slate-900 sm:text-3xl">
              {totalItems} PGs in {city}
            </h1>
            <p className="mt-1 text-sm text-slate-500">Find your perfect stay from verified listings</p>
          </div>

          <SearchSortControl />
        </div>

        <div className="space-y-4">
          {items.map((listing) => (
            <PGCard key={listing.id} pg={listing} />
          ))}
        </div>

        {!items.length && (
          <div className="mx-auto my-10 max-w-md rounded-[28px] border border-dashed border-slate-200 bg-white p-10 text-center shadow-sm">
            <Info className="mx-auto mb-3 h-10 w-10 text-slate-300" />
            <h4 className="text-base font-bold text-slate-800">No listings match your search</h4>
            <p className="mt-2 text-sm text-slate-500">Try adjusting your budget or filtering criteria to find more stays.</p>
          </div>
        )}
      </div>
    );
  } catch {
    return (
      <div className="mx-auto max-w-xl rounded-[28px] border border-dashed border-slate-200 bg-white p-10 text-center shadow-sm">
        <Info className="mx-auto mb-3 h-10 w-10 text-slate-300" />
        <h4 className="text-base font-bold text-slate-800">PG listings are temporarily unavailable</h4>
        <p className="mt-2 text-sm text-slate-500">Please refresh the page or try again in a moment.</p>
      </div>
    );
  }
}

export default function SearchPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return (
    <div className="min-h-screen bg-[#f2f5f3] pb-20 text-slate-900 antialiased">
      <main className="mx-auto max-w-[1200px] px-3 py-4 sm:px-6 lg:px-8 lg:py-8">
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-[#f9faf9] shadow-[0_18px_40px_rgba(15,23,42,0.08)] ring-1 ring-slate-100">
          <div className="border-b border-slate-200 bg-white px-3 pb-4 pt-4 sm:px-5 lg:px-6">
            <div className="mx-auto max-w-[980px] rounded-[22px] border border-slate-200 bg-white p-2 shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
              <SearchBar />
            </div>

            <div className="mx-auto mt-4 max-w-[980px] flex flex-wrap items-center gap-2">
              <ListingFilters compact />
            </div>
          </div>

          <div className="bg-[#f9faf9] px-3 pb-6 pt-5 sm:px-5 lg:px-6">
            <div className="mx-auto max-w-[980px]">
              <Suspense
                fallback={
                  <div className="space-y-4">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="h-52 animate-pulse rounded-[24px] border border-slate-200 bg-white" />
                    ))}
                  </div>
                }
              >
                <SearchResults searchParams={searchParams} />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}