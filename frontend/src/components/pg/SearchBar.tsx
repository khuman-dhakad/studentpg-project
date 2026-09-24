'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Search, MapPin, Building2, Loader2, X } from 'lucide-react';
import { useGetSearchSuggestionsQuery } from '@/features/pg-listing/api/pgApi';
import type { PGSuggestion } from '@/types/pg.types';

interface SearchBarProps {
  initialQuery?: string;
}

export function SearchBar({ initialQuery = '' }: SearchBarProps) {
  const router = useRouter();
  const params = useSearchParams();
  const [value, setValue] = useState(params.get('q') || initialQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [debounceQuery, setDebounceQuery] = useState('');

  useEffect(() => {
    const urlQuery = params.get('q') || '';
    setValue(urlQuery || initialQuery);
  }, [params, initialQuery]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebounceQuery(value.trim());
    }, 300);

    return () => window.clearTimeout(timer);
  }, [value]);

  const { data: suggestions = [], isFetching } = useGetSearchSuggestionsQuery(debounceQuery, {
    skip: debounceQuery.length < 2,
  });

  const submit = (term: string) => {
    const normalized = term.trim();
    const next = new URLSearchParams(params.toString());

    if (normalized) {
      next.set('q', normalized);
    } else {
      next.delete('q');
    }

    setShowSuggestions(false);
    const queryString = next.toString();
    router.push(queryString ? `/search?${queryString}` : '/search');
  };

  const clearSearch = () => {
    setValue('');
    setDebounceQuery('');
    setShowSuggestions(false);

    const next = new URLSearchParams(params.toString());
    next.delete('q');
    const queryString = next.toString();
    router.push(queryString ? `/search?${queryString}` : '/search');
  };

  const handleSuggestionClick = (suggestion: PGSuggestion) => {
    const searchText = suggestion.pgName;
    setValue(searchText);
    setShowSuggestions(false);
    submit(searchText);
  };

  return (
    <div className="relative w-full">
      <div className="flex w-full items-center gap-2 rounded-[18px] border border-slate-200 bg-white p-1.5 shadow-[0_10px_24px_rgba(15,23,42,0.04)] transition-all duration-200 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100">
        <div className="flex shrink-0 items-center justify-center pl-3 pr-2">
          <Search className="h-5 w-5 text-slate-400" />
        </div>

        <input
          id="search-input"
          name="search"
          type="search"
          aria-label="Search by PG name, city or location"
          value={value}
          onChange={(event) => {
            const nextValue = event.target.value;
            setValue(nextValue);
            setShowSuggestions(nextValue.trim().length >= 2);
          }}
          onFocus={() => {
            if (value.trim().length >= 2) {
              setShowSuggestions(true);
            }
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              submit(value);
            }
            if (event.key === 'Escape') {
              clearSearch();
            }
          }}
          placeholder="Search locality, area or landmark..."
          className="min-w-0 flex-1 border-0 bg-transparent px-1 py-3 text-sm font-medium text-slate-800 outline-none placeholder:text-sm placeholder:text-slate-400"
        />

        {value.trim().length > 0 && (
          <button
            type="button"
            onClick={clearSearch}
            aria-label="Clear search"
            className="mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {isFetching && <Loader2 className="mr-2 h-4 w-4 shrink-0 animate-spin text-emerald-600" />}

        <button
          type="button"
          onClick={() => submit(value)}
          aria-label="Search properties"
          className="shrink-0 rounded-xl bg-emerald-600 px-5 py-3 text-xs font-black uppercase tracking-[0.08em] text-white shadow-sm transition-all hover:bg-emerald-700 active:scale-[0.99]"
        >
          Search
        </button>
      </div>

      {showSuggestions && value.trim().length >= 2 && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion._id}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className="flex w-full items-center gap-3 border-b border-slate-100 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-slate-50"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                {suggestion.pgName.toLowerCase().includes(value.toLowerCase()) ? (
                  <Building2 className="h-4 w-4 text-emerald-600" />
                ) : (
                  <MapPin className="h-4 w-4 text-emerald-600" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-800">{suggestion.pgName}</p>
                <p className="truncate text-xs text-slate-500">
                  {[suggestion.address, suggestion.city, suggestion.state].filter(Boolean).join(', ')}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}