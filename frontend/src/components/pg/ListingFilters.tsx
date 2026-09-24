'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import {
  SlidersHorizontal,
  MapPin,
  IndianRupee,
  Users,
  Wifi,
  Utensils,
  Car,
  Shirt,
  RotateCcw,
  X,
  Snowflake,
  BatteryCharging,
  ChevronDown,
} from 'lucide-react';

interface ListingFiltersProps {
  compact?: boolean;
}

function FilterContent({ compact = false }: ListingFiltersProps) {
  const router = useRouter();
  const params = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [city, setCity] = useState('');
  const [maxRent, setMaxRent] = useState('');
  const [category, setCategory] = useState('');
  const [food, setFood] = useState(false);
  const [wifi, setWifi] = useState(false);
  const [parking, setParking] = useState(false);
  const [laundry, setLaundry] = useState(false);
  const [ac, setAc] = useState(false);
  const [powerBackup, setPowerBackup] = useState(false);

  useEffect(() => {
    setCity(params.get('city') || '');
    setMaxRent(params.get('maxRent') || '');
    setCategory(params.get('category') || '');
    setFood(params.get('food') === 'true');
    setWifi(params.get('wifi') === 'true');
    setParking(params.get('parking') === 'true');
    setLaundry(params.get('laundry') === 'true');
    setAc(params.get('ac') === 'true');
    setPowerBackup(params.get('powerBackup') === 'true');
  }, [params]);

  const apply = () => {
    const next = new URLSearchParams(params.toString());
    next.delete('city');
    next.delete('maxRent');
    next.delete('category');
    next.delete('food');
    next.delete('wifi');
    next.delete('parking');
    next.delete('laundry');
    next.delete('ac');
    next.delete('powerBackup');

    if (city.trim()) next.set('city', city.trim());
    if (maxRent) next.set('maxRent', maxRent);
    if (category) next.set('category', category);
    if (food) next.set('food', 'true');
    if (wifi) next.set('wifi', 'true');
    if (parking) next.set('parking', 'true');
    if (laundry) next.set('laundry', 'true');
    if (ac) next.set('ac', 'true');
    if (powerBackup) next.set('powerBackup', 'true');

    const queryString = next.toString();
    router.push(queryString ? `/search?${queryString}` : '/search');
    setIsOpen(false);
  };

  const clearAll = () => {
    setCity('');
    setMaxRent('');
    setCategory('');
    setFood(false);
    setWifi(false);
    setParking(false);
    setLaundry(false);
    setAc(false);
    setPowerBackup(false);
    router.push('/search');
    setIsOpen(false);
  };

  const amenityToggles = [
    { checked: wifi, onChange: setWifi, icon: <Wifi className="h-4 w-4" />, label: 'High-speed Wi-Fi' },
    { checked: food, onChange: setFood, icon: <Utensils className="h-4 w-4" />, label: 'Meals / Food Included' },
    { checked: parking, onChange: setParking, icon: <Car className="h-4 w-4" />, label: 'Reserved Parking' },
    { checked: laundry, onChange: setLaundry, icon: <Shirt className="h-4 w-4" />, label: 'Laundry Service' },
    { checked: ac, onChange: setAc, icon: <Snowflake className="h-4 w-4" />, label: 'Air Conditioner (AC)' },
    { checked: powerBackup, onChange: setPowerBackup, icon: <BatteryCharging className="h-4 w-4" />, label: '24x7 Power Backup' },
  ];

  const FilterForm = () => (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <label className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-slate-900">
          <MapPin className="h-3.5 w-3.5 text-emerald-600" />
          City Location
        </label>
        <input
          value={city}
          onChange={(event) => setCity(event.target.value)}
          placeholder="e.g. Bhopal"
          className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10"
        />
      </div>

      <div className="space-y-1.5">
        <label className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-slate-900">
          <IndianRupee className="h-3.5 w-3.5 text-emerald-600" />
          Maximum Budget
        </label>
        <input
          type="number"
          min="0"
          value={maxRent}
          onChange={(event) => setMaxRent(event.target.value)}
          placeholder="Max monthly rent (₹)"
          className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10"
        />
      </div>

      <div className="space-y-1.5">
        <label className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-slate-900">
          <Users className="h-3.5 w-3.5 text-emerald-600" />
          Accommodation Category
        </label>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none transition-all focus:border-emerald-600 focus:bg-white"
        >
          <option value="">Any Gender / All Categories</option>
          <option value="MALE">Boys PG Only</option>
          <option value="FEMALE">Girls PG Only</option>
          <option value="UNISEX">Co-Living / Unisex</option>
        </select>
      </div>

      <div className="space-y-2.5 pt-2">
        <label className="mb-1 block text-[11px] font-black uppercase tracking-[0.12em] text-slate-900">Essential Amenities</label>
        {amenityToggles.map(({ checked, onChange, icon, label }) => (
          <label key={label} className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition-all ${checked ? 'border-emerald-600 bg-emerald-50/80 font-bold text-emerald-800' : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'}`}>
            <div className="flex items-center gap-2.5 text-xs font-bold">
              <span className={checked ? 'text-emerald-600' : 'text-slate-400'}>{icon}</span>
              <span>{label}</span>
            </div>
            <input
              type="checkbox"
              checked={checked}
              onChange={(event) => onChange(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600"
            />
          </label>
        ))}
      </div>

      <div className="border-t border-slate-100 pt-4">
        <button type="button" onClick={apply} className="w-full rounded-xl bg-emerald-600 py-3 text-[11px] font-black uppercase tracking-[0.12em] text-white transition-all hover:bg-emerald-700 active:scale-[0.99]">
          Apply Filters
        </button>
      </div>
    </div>
  );

  if (compact) {
    const chips = [
      { label: city || 'Bhopal', icon: <MapPin className="h-3.5 w-3.5" /> },
      { label: category ? category === 'MALE' ? 'Boys' : category === 'FEMALE' ? 'Girls' : 'Unisex' : 'Stay Type', icon: <Users className="h-3.5 w-3.5" /> },
      { label: maxRent ? `₹${Number(maxRent).toLocaleString('en-IN')}` : 'Budget', icon: <IndianRupee className="h-3.5 w-3.5" /> },
    ];

    return (
      <>
        {chips.map((chip) => (
          <button
            key={chip.label}
            type="button"
            onClick={() => setIsOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:border-slate-300 hover:text-slate-900"
          >
            <span className="text-emerald-600">{chip.icon}</span>
            <span>{chip.label}</span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>
        ))}

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:border-slate-300 hover:text-slate-900"
        >
          <SlidersHorizontal className="h-3.5 w-3.5 text-emerald-600" />
          More Filters
        </button>

        {isOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
            <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl pb-[max(1.5rem,env(safe-area-inset-bottom))]" onClick={(event) => event.stopPropagation()}>
              <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-slate-200" />
              <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
                <span className="text-base font-black tracking-tight text-slate-900">Filter Stays</span>
                <div className="flex items-center gap-4">
                  <button type="button" onClick={clearAll} className="text-xs font-bold text-rose-600">Reset</button>
                  <button type="button" onClick={() => setIsOpen(false)} aria-label="Close filters" className="rounded-full bg-slate-100 p-1.5 text-slate-500 hover:text-slate-900">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <FilterForm />
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <div className="hidden w-full bg-white antialiased lg:block">
        <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-black tracking-tight text-slate-900">Refine Options</span>
          </div>
          <button type="button" onClick={clearAll} className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 transition-colors hover:text-rose-600">
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        </div>
        <FilterForm />
      </div>

      <div className="fixed bottom-20 left-1/2 z-40 -translate-x-1/2 lg:hidden">
        <button type="button" onClick={() => setIsOpen(true)} className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-6 py-3 text-[11px] font-black uppercase tracking-[0.12em] text-white shadow-xl transition-transform active:scale-95">
          <SlidersHorizontal className="h-3.5 w-3.5 text-emerald-400" />
          Filter Stays
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl pb-[max(1.5rem,env(safe-area-inset-bottom))]" onClick={(event) => event.stopPropagation()}>
            <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-slate-200" />
            <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-base font-black tracking-tight text-slate-900">Filter Stays</span>
              <div className="flex items-center gap-4">
                <button type="button" onClick={clearAll} className="text-xs font-bold text-rose-600">Reset</button>
                <button type="button" onClick={() => setIsOpen(false)} aria-label="Close filters" className="rounded-full bg-slate-100 p-1.5 text-slate-500 hover:text-slate-900">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <FilterForm />
          </div>
        </div>
      )}
    </>
  );
}

export function ListingFilters({ compact = false }: ListingFiltersProps) {
  return (
    <Suspense fallback={<div className="h-12 w-28 animate-pulse rounded-xl bg-slate-200" />}>
      <FilterContent compact={compact} />
    </Suspense>
  );
}