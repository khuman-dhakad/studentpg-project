'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface SearchBarProps {
  initialQuery?: string;
}

export function SearchBar({ initialQuery = '' }: SearchBarProps) {
  const router = useRouter();
  const params = useSearchParams();
  const [value, setValue] = useState(initialQuery);

  useEffect(() => {
    setValue(params.get('q') || initialQuery);
  }, [initialQuery, params]);

  const submit = (term: string) => {
    const normalized = term.trim();
    const next = new URLSearchParams(window.location.search);
    if (normalized) {
      next.set('q', normalized);
    } else {
      next.delete('q');
    }
    router.replace(`/search?${next.toString()}`);
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            submit(value);
          }
        }}
        placeholder="Search by PG name, city or amenity"
        className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-brand"
      />
      <button
        type="button"
        onClick={() => submit(value)}
        className="rounded-2xl bg-brand px-5 py-3 text-sm font-semibold text-cream"
      >
        Find stays
      </button>
    </div>
  );
}
