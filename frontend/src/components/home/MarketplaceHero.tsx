'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Search,
  ChevronDown,
  Building2,
  Loader2,
  X,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useGetSearchSuggestionsQuery } from '@/features/pg-listing/api/pgApi';
import type { PGSuggestion } from '@/types/pg.types';

const BHOPAL_LOCALITIES = [
  'All Bhopal Areas',
  'MP Nagar Zone 1 & 2',
  'Indrapuri (LNCT Belt)',
  'Kolar Road (Univ Belt)',
  'Near MANIT Campus',
  'Anand Nagar',
  'Piplani (BHEL)',
  'Ayodhya Bypass (SIRT)',
  'Arera Colony',
  'Hoshangabad Road',
];

export function MarketplaceHero() {
  const router = useRouter();
  const [selectedLocality, setSelectedLocality] = useState('Bhopal');
  const [isLocalityDropdownOpen, setIsLocalityDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const localityDropdownRef = useRef<HTMLDivElement>(null);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Click outside listener for suggestions & locality dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
      if (
        localityDropdownRef.current &&
        !localityDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLocalityDropdownOpen(false);
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
    if (selectedLocality && selectedLocality !== 'Bhopal' && selectedLocality !== 'All Bhopal Areas') {
      const cleanLocality = selectedLocality.split('(')[0].trim();
      if (!q) {
        params.set('q', cleanLocality);
      }
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

  const handleLocalitySelect = (loc: string) => {
    setSelectedLocality(loc);
    setIsLocalityDropdownOpen(false);
    if (loc !== 'All Bhopal Areas' && loc !== 'Bhopal') {
      const cleanLoc = loc.split('(')[0].trim();
      router.push(`/search?q=${encodeURIComponent(cleanLoc)}`);
    }
  };

  return (
    <section className="w-full bg-white pt-6 pb-6 sm:pb-8 border-b border-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Top Headline & Trust Badge Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5 sm:mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Search across <span className="text-emerald-600">50,000+</span> Verified Student PGs & Hostels
            </h1>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
              Zero Brokerage Stays near Coaching Hubs, Universities & Tech Campuses in Bhopal
            </p>
          </div>

          {/* Quick Platform Quality Badges */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50/70 px-3.5 py-2 text-xs font-bold text-emerald-800">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>100% Verified Hosts</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50/70 px-3.5 py-2 text-xs font-bold text-indigo-800">
              <Zap className="h-4 w-4 text-indigo-600 shrink-0" />
              <span>Direct WhatsApp Move-in</span>
            </div>
          </div>
        </div>

        {/* Two-Part Marketplace Search Bar */}
        <div
          ref={searchContainerRef}
          className="relative w-full rounded-2xl border-2 border-slate-200 bg-white p-1.5 shadow-sm transition-all focus-within:border-emerald-600 focus-within:ring-4 focus-within:ring-emerald-500/10"
        >
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
            
            {/* 1. Location / Locality Selector */}
            <div ref={localityDropdownRef} className="relative shrink-0 sm:w-56 md:w-64">
              <button
                type="button"
                onClick={() => setIsLocalityDropdownOpen(!isLocalityDropdownOpen)}
                className="flex w-full items-center justify-between gap-2 px-3.5 py-2.5 sm:py-3 text-left hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                aria-haspopup="listbox"
                aria-expanded={isLocalityDropdownOpen}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="truncate text-xs sm:text-sm font-bold text-slate-800">
                    {selectedLocality}
                  </span>
                </div>
                <ChevronDown className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${isLocalityDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Locality Dropdown Menu */}
              {isLocalityDropdownOpen && (
                <div className="absolute left-0 top-full mt-2 z-50 w-64 sm:w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl">
                  <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Select Bhopal Student Area
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-0.5">
                    {BHOPAL_LOCALITIES.map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => handleLocalitySelect(loc)}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-colors text-left cursor-pointer ${
                          selectedLocality === loc
                            ? 'bg-emerald-50 text-emerald-700 font-bold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="truncate">{loc}</span>
                        {selectedLocality === loc && (
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Main Search Input */}
            <div className="relative flex-1 flex items-center px-3.5 py-1">
              <Search className="h-4 w-4 text-slate-400 shrink-0 mr-2" />
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
                placeholder="Search for PG name, locality (MP Nagar, Indrapuri), or college (MANIT, LNCT)..."
                className="w-full bg-transparent py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 outline-none"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setShowSuggestions(false);
                  }}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 mr-2 cursor-pointer"
                  aria-label="Clear search query"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              {isFetching && (
                <Loader2 className="h-4 w-4 animate-spin text-emerald-600 shrink-0 mr-2" />
              )}
            </div>

            {/* 3. High-Contrast Search Action Button */}
            <div className="p-1 sm:p-0 shrink-0">
              <button
                type="button"
                onClick={() => handleSearchSubmit()}
                className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 px-6 sm:px-8 py-3 text-xs sm:text-sm font-black uppercase tracking-wider text-white shadow-md shadow-emerald-900/10 transition-all cursor-pointer"
              >
                <Search className="h-4 w-4" />
                <span>Search</span>
              </button>
            </div>

          </div>

          {/* Autocomplete Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl overflow-hidden">
              <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                Matching PGs & Localities
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                {suggestions.map((item) => (
                  <button
                    key={item._id}
                    type="button"
                    onClick={() => handleSuggestionClick(item)}
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group"
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

        {/* Quick Locality Shortcut Chips */}
        <div className="mt-3.5 flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs">
          <span className="font-bold text-slate-500 mr-1">Popular in Bhopal:</span>
          {['MP Nagar', 'Indrapuri', 'Kolar Road', 'Near MANIT', 'Anand Nagar', 'Ayodhya Bypass'].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => {
                setSearchQuery(tag);
                handleSearchSubmit(tag);
              }}
              className="rounded-lg border border-slate-200 bg-slate-50/80 hover:bg-slate-100 hover:border-slate-300 px-2.5 py-1 font-semibold text-slate-700 transition-all cursor-pointer active:scale-95"
            >
              {tag}
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}
