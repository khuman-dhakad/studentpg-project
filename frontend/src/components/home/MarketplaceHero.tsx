'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  MapPin,
  Search,
  Building2,
  SlidersHorizontal,
  Loader2,
  X,
  Users,
} from 'lucide-react';
import { useGetSearchSuggestionsQuery } from '@/features/pg-listing/api/pgApi';
import type { PGSuggestion } from '@/types/pg.types';

export function MarketplaceHero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Click outside listener for suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const { data: suggestions = [], isFetching } = useGetSearchSuggestionsQuery(
    debouncedQuery,
    {
      skip: debouncedQuery.length < 2,
    }
  );

  const handleSearchSubmit = (term?: string) => {
    const q = (term ?? searchQuery).trim();
    const params = new URLSearchParams();

    if (q) {
      params.set('q', q);
    }

    setShowSuggestions(false);
    const queryString = params.toString();
    router.push(queryString ? `/search?${queryString}` : '/search');
  };

  const handleSuggestionClick = (suggestion: PGSuggestion) => {
    setSearchQuery(suggestion.pgName);
    setShowSuggestions(false);
    handleSearchSubmit(suggestion.pgName);
  };

  return (
    <section className="relative w-full bg-gradient-to-b from-[#F0FDF4]/70 via-[#F8FAFC]/50 to-white pt-4 sm:pt-6 pb-6 sm:pb-8 border-b border-slate-100/80 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">

        {/* Mobile Upper-Right Student Visual (integrated seamlessly into background) */}
        <div className="absolute top-0 right-0 w-[46%] max-w-[210px] aspect-[1024/682] pointer-events-none lg:hidden z-0 overflow-hidden">
          <Image
            src="/hero-student.png"
            alt="StudentPG Accommodation in Bhopal"
            width={1024}
            height={682}
            priority
            className="w-full h-auto object-contain object-right-top"
          />
        </div>

        {/* Main Hero Layout */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-8 relative z-10">

          {/* Left Column: Trust Badge, Headline, Subtitle, Search, Quick Filters */}
          <div className="w-full lg:max-w-xl xl:max-w-2xl">

            {/* 1. Trust Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50/90 border border-indigo-100/80 px-3 py-1 text-xs font-semibold text-indigo-900 shadow-2xs mb-3">
              <Users className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
              <span>Trusted by 50,000+ Students</span>
            </div>

            {/* 2. Headline */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-black text-slate-900 tracking-tight leading-[1.18] max-w-[65%] min-[480px]:max-w-[75%] lg:max-w-none">
              Find Your Perfect <br />
              <span className="text-[#059669]">Student Accommodation</span>
            </h1>

            {/* 3. Subtitle */}
            <p className="mt-2 text-xs sm:text-sm font-medium text-slate-600 leading-relaxed max-w-[70%] min-[480px]:max-w-[80%] lg:max-w-lg">
              Verified PGs. Real Photos. No Brokerage. <br />
              A Safe, Comfortable &amp; Hassle-Free Stay.
            </p>

            {/* 4. Search Bar (Full Width across bottom of hero) */}
            <div
              ref={searchContainerRef}
              className="relative mt-5 w-full rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm transition-all focus-within:border-emerald-600 focus-within:ring-4 focus-within:ring-emerald-500/10"
            >
              <div className="flex items-center gap-2 px-2">
                <Search className="h-5 w-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(e.target.value.trim().length >= 2);
                  }}
                  onFocus={() => {
                    if (searchQuery.trim().length >= 2) setShowSuggestions(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSearchSubmit();
                    }
                    if (e.key === 'Escape') {
                      setShowSuggestions(false);
                    }
                  }}
                  placeholder="Search locality, area or landmark..."
                  className="w-full bg-transparent py-2.5 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none"
                  aria-label="Search locality, area or landmark in Bhopal"
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setShowSuggestions(false);
                    }}
                    className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 mr-1 cursor-pointer"
                    aria-label="Clear search query"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}

                {isFetching && (
                  <Loader2 className="h-4 w-4 animate-spin text-emerald-600 shrink-0 mr-1" />
                )}

                <button
                  type="button"
                  onClick={() => handleSearchSubmit()}
                  className="rounded-xl bg-[#047857] hover:bg-emerald-800 active:scale-98 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs transition-all shrink-0 cursor-pointer"
                >
                  Search
                </button>
              </div>

              {/* Autocomplete Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl overflow-hidden">
                  <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Matching PGs &amp; Localities
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                    {suggestions.map((item) => (
                      <button
                        key={item._id}
                        type="button"
                        onClick={() => handleSuggestionClick(item)}
                        className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 group-hover:scale-105 transition-transform">
                          {item.pgName.toLowerCase().includes(searchQuery.toLowerCase()) ? (
                            <Building2 className="h-4 w-4" />
                          ) : (
                            <MapPin className="h-4 w-4" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                            {item.pgName}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {[item.address, item.city, item.state].filter(Boolean).join(', ')}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 5. Quick Action Filter Pills */}
            <div className="mt-3 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              <button
                type="button"
                onClick={() => router.push('/search')}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-800 transition-all shrink-0 cursor-pointer"
              >
                <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                <span>Near Me</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('popular-areas');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else router.push('/search');
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-800 transition-all shrink-0 cursor-pointer"
              >
                <Building2 className="h-3.5 w-3.5 text-slate-500" />
                <span>Popular Areas</span>
              </button>

              <button
                type="button"
                onClick={() => router.push('/search')}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-800 transition-all shrink-0 cursor-pointer"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" />
                <span>Filters</span>
              </button>
            </div>

          </div>

          {/* Right Column (Desktop): Student Visual */}
          <div className="hidden lg:flex lg:w-[46%] xl:w-[48%] items-center justify-end shrink-0 relative">
            <div className="relative w-full max-w-[540px] aspect-[1024/682]">
              <Image
                src="/hero-student.png"
                alt="StudentPG Accommodation in Bhopal - Better Stay Brighter Tomorrow"
                fill
                sizes="(max-width: 1280px) 480px, 540px"
                priority
                className="object-contain object-right"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
