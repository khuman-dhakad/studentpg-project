'use client';

import { ChevronDown } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

const normalizeSort = (sortValue: string | undefined) => {
  switch (sortValue) {
    case 'price_high':
      return { sortBy: 'rent', direction: 'desc' };
    case 'price_low':
      return { sortBy: 'rent', direction: 'asc' };
    default:
      return { sortBy: 'rent', direction: 'asc' };
  }
};

export function SearchSortControl() {
  const router = useRouter();
  const params = useSearchParams();
  const currentValue = params.get('sortBy') === 'rent' && params.get('direction') === 'desc' ? 'price_high' : 'price_low';

  const handleChange = (value: string) => {
    const next = new URLSearchParams(params.toString());
    const normalized = normalizeSort(value);

    next.set('sortBy', normalized.sortBy);
    next.set('direction', normalized.direction);

    router.push(`/search?${next.toString()}`);
  };

  return (
    <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm">
      <span className="text-xs font-semibold text-slate-500">Sort by:</span>
      <div className="relative">
        <select
          aria-label="Sort listings"
          value={currentValue}
          onChange={(event) => handleChange(event.target.value)}
          className="appearance-none bg-transparent pr-6 text-sm font-semibold text-slate-800 outline-none"
        >
          <option value="price_low">Recommended</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
        </select>
        <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
      </div>
    </label>
  );
}
