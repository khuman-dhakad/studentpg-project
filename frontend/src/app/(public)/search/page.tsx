import { Suspense } from 'react';
import type { Metadata } from 'next';
import { SearchBar } from '@/components/pg/SearchBar';
import { ListingFilters } from '@/components/pg/ListingFilters';
import { PGCard } from '@/components/pg/PGCard';
import { SearchSortControl } from '@/components/pg/SearchSortControl';
import { Pagination } from '@/components/pg/Pagination';
import { backendClient } from '@/api/backendClient';
import { BACKEND_ENDPOINTS } from '@/api/endpoints';
import { Info } from 'lucide-react';
import type { PagedResponse } from '@/types/api.types';
import type { PG } from '@/types/pg.types';

export const metadata: Metadata = {
  title: 'Search Verified PGs & Hostels',
  description: 'Explore verified student accommodations, compare amenities, rent prices, and locations across India.',
};

const PAGE_SIZE = 8;

async function SearchResults({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const query = typeof params.q === 'string' ? params.q : '';
  const city = typeof params.city === 'string' ? params.city : 'Bhopal';
  const maxRent = typeof params.maxRent === 'string' ? params.maxRent : '';
  const minRent = typeof params.minRent === 'string' ? params.minRent : '';
  const category = typeof params.category === 'string' ? params.category : '';
  const gender = typeof params.gender === 'string' ? params.gender : '';
  const roomType = typeof params.roomType === 'string' ? params.roomType : '';
  const food = typeof params.food === 'string' ? params.food : '';
  const wifi = typeof params.wifi === 'string' ? params.wifi : '';
  const parking = typeof params.parking === 'string' ? params.parking : '';
  const laundry = typeof params.laundry === 'string' ? params.laundry : '';
  const ac = typeof params.ac === 'string' ? params.ac : '';
  const powerBackup = typeof params.powerBackup === 'string' ? params.powerBackup : '';
  const sortValue = typeof params.sortBy === 'string' ? params.sortBy : 'rent';
  const direction = typeof params.direction === 'string' ? params.direction : 'asc';

  // 1-indexed for the user, 0-indexed for backend API
  const rawPage = typeof params.page === 'string' ? parseInt(params.page, 10) : 1;
  const currentPage = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;
  const backendPage = currentPage - 1;

  const hasStructuredFilters = Boolean(city !== 'Bhopal' || maxRent || minRent || category || gender || roomType || food || wifi || parking || laundry || ac || powerBackup);

  const queryParams = new URLSearchParams({
    page: String(backendPage),
    size: String(PAGE_SIZE),
    sortBy: sortValue === 'rent' ? 'rent' : 'rent',
    direction,
  });

  if (query) queryParams.set('q', query);
  if (city && city !== 'Bhopal') queryParams.set('city', city);
  if (maxRent) queryParams.set('maxRent', maxRent);
  if (minRent) queryParams.set('minRent', minRent);
  if (category) queryParams.set('category', category);
  if (gender) queryParams.set('gender', gender);
  if (roomType) queryParams.set('roomType', roomType);
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
    const totalPages = Array.isArray(data)
      ? Math.ceil(items.length / PAGE_SIZE)
      : data.totalPages ?? Math.ceil(totalItems / PAGE_SIZE);

    return (
      <div className="space-y-4 pt-1 sm:pt-2">
        <div className="flex flex-col gap-2.5 pb-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-black tracking-[-0.03em] sm:text-2xl">
              <span className="text-emerald-600 font-extrabold">{totalItems}</span>{' '}
              <span className="text-slate-900 font-black">PGs in {city}</span>
            </h1>
            <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">Find your perfect stay from verified listings</p>
          </div>

          <div className="self-end sm:self-auto">
            <SearchSortControl />
          </div>
        </div>

        <div className="space-y-3.5">
          {items.map((listing) => (
            <PGCard key={listing.id} pg={listing} />
          ))}
        </div>

        {!items.length && (
          <div className="mx-auto my-10 max-w-md rounded-[24px] border border-dashed border-slate-200 bg-white p-8 text-center shadow-xs">
            <Info className="mx-auto mb-3 h-10 w-10 text-slate-300" />
            <h4 className="text-base font-bold text-slate-800">No listings match your search</h4>
            <p className="mt-2 text-xs text-slate-500">Try adjusting your budget or filtering criteria to find more stays.</p>
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalElements={totalItems}
          pageSize={PAGE_SIZE}
        />
      </div>
    );
  } catch {
    return (
      <div className="mx-auto max-w-xl rounded-[24px] border border-dashed border-slate-200 bg-white p-8 text-center shadow-xs">
        <Info className="mx-auto mb-3 h-10 w-10 text-slate-300" />
        <h4 className="text-base font-bold text-slate-800">PG listings are temporarily unavailable</h4>
        <p className="mt-2 text-xs text-slate-500">Please refresh the page or try again in a moment.</p>
      </div>
    );
  }
}

export default function SearchPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24 text-slate-900 antialiased">
      <main className="mx-auto max-w-[820px] px-3.5 py-3 sm:px-6 sm:py-5">
        <div className="space-y-3 sm:space-y-3.5">
          {/* Search Bar */}
          <SearchBar />

          {/* Filter Pills */}
          <ListingFilters compact />

          {/* Search Results */}
          <Suspense
            fallback={
              <div className="space-y-3.5 pt-3">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="h-44 sm:h-52 animate-pulse rounded-[20px] sm:rounded-[24px] border border-slate-200/80 bg-white" />
                ))}
              </div>
            }
          >
            <SearchResults searchParams={searchParams} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}