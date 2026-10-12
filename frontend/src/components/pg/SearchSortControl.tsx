'use client';

import { ArrowUpDown, ChevronDown } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export function SearchSortControl() {
  const router = useRouter();
  const params = useSearchParams();
  const currentDirection = params.get('direction');
  const currentSortBy = params.get('sortBy');

  const currentValue =
    currentSortBy === 'rent' && currentDirection === 'desc'
      ? 'price_high'
      : currentSortBy === 'rent' && currentDirection === 'asc'
        ? 'price_low'
        : 'recommended';

  const handleChange = (value: string) => {
    const next = new URLSearchParams(params.toString());
    next.delete('page');

    if (value === 'price_high') {
      next.set('sortBy', 'rent');
      next.set('direction', 'desc');
    } else if (value === 'price_low') {
      next.set('sortBy', 'rent');
      next.set('direction', 'asc');
    } else {
      next.set('sortBy', 'rent');
      next.set('direction', 'asc');
    }

    router.push(`/search?${next.toString()}`);
  };

  return (
    <label className="relative inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs cursor-pointer transition-all hover:border-slate-300">
      <ArrowUpDown className="h-3.5 w-3.5 text-slate-500 shrink-0" />
      <span className="text-slate-500 font-medium">Sort by:</span>
      <select
        aria-label="Sort listings"
        value={currentValue}
        onChange={(event) => handleChange(event.target.value)}
        className="appearance-none bg-transparent pr-4 text-xs font-bold text-slate-800 outline-none cursor-pointer"
      >
        <option value="recommended">Recommended</option>
        <option value="price_low">Price: Low to High</option>
        <option value="price_high">Price: High to Low</option>
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
    </label>
  );
}
