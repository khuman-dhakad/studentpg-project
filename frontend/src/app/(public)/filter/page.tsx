'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  BedDouble,
  Building2,
  Check,
  ChevronDown,
  ChevronRight,
  CircleUserRound,
  Home,
  IndianRupee,
  MapPin,
  ParkingSquare,
  RotateCcw,
  Search,
  Snowflake,
  Utensils,
  WashingMachine,
  Wifi,
  Zap,
} from 'lucide-react';
import { StudentPGLogo } from '@/components/common/StudentPGLogo';

type FilterState = {
  city: string;
  roomType: string;
  minRent: string;
  maxRent: string;
  category: string;
  gender: string;
  food: boolean;
  wifi: boolean;
  parking: boolean;
  laundry: boolean;
  ac: boolean;
  powerBackup: boolean;
};

const initialFilters: FilterState = {
  city: 'Bhopal',
  roomType: '',
  minRent: '',
  maxRent: '',
  category: '',
  gender: '',
  food: false,
  wifi: false,
  parking: false,
  laundry: false,
  ac: false,
  powerBackup: false,
};

const locations = ['MP Nagar', 'Kolar Road', 'Indrapuri', 'Arera Colony', 'Hoshangabad Road'];
const stayTypes = [
  { value: 'SINGLE', label: 'Single Room' },
  { value: 'DOUBLE', label: 'Double Sharing' },
  { value: 'TRIPLE', label: 'Triple Sharing' },
  { value: 'FOUR_SHARING', label: '4+ Sharing' },
];
const budgets = [
  { min: '', max: '5000', label: 'Under ₹5,000' },
  { min: '5000', max: '10000', label: '₹5,000 - ₹10,000' },
  { min: '10000', max: '15000', label: '₹10,000 - ₹15,000' },
  { min: '15000', max: '', label: '₹15,000+' },
];
const propertyTypes = [
  { value: 'HOSTEL', label: 'PG / Hostel' },
  { value: 'BOYS', label: 'Boys PG' },
  { value: 'GIRLS', label: 'Girls PG' },
  { value: 'CO_LIVING', label: 'Co-living' },
];
const amenities = [
  { key: 'wifi', label: 'Wi-Fi', icon: Wifi },
  { key: 'food', label: 'Meals', icon: Utensils },
  { key: 'ac', label: 'AC', icon: Snowflake },
  { key: 'parking', label: 'Parking', icon: ParkingSquare },
  { key: 'laundry', label: 'Laundry', icon: WashingMachine },
  { key: 'powerBackup', label: 'Power Backup', icon: Zap },
] as const;

function readFilters(params: URLSearchParams): FilterState {
  return {
    city: params.get('city') || 'Bhopal',
    roomType: params.get('roomType') || '',
    minRent: params.get('minRent') || '',
    maxRent: params.get('maxRent') || '',
    category: params.get('category') || '',
    gender: params.get('gender') || '',
    food: params.get('food') === 'true',
    wifi: params.get('wifi') === 'true',
    parking: params.get('parking') === 'true',
    laundry: params.get('laundry') === 'true',
    ac: params.get('ac') === 'true',
    powerBackup: params.get('powerBackup') === 'true',
  };
}

function toQuery(filters: FilterState) {
  const query = new URLSearchParams();
  if (filters.city && filters.city !== 'Bhopal') query.set('city', filters.city);
  if (filters.roomType) query.set('roomType', filters.roomType);
  if (filters.minRent) query.set('minRent', filters.minRent);
  if (filters.maxRent) query.set('maxRent', filters.maxRent);
  if (filters.category) query.set('category', filters.category);
  if (filters.gender) query.set('gender', filters.gender);
  amenities.forEach(({ key }) => {
    if (filters[key]) query.set(key, 'true');
  });
  return query;
}

export default function FilterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(() => readFilters(searchParams));
  const [search, setSearch] = useState('');
  const [resultCount, setResultCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setFilters(readFilters(searchParams));
  }, [searchParams]);

  useEffect(() => {
    const controller = new AbortController();
    const query = toQuery(filters);
    query.set('size', '1');

    setIsLoading(true);
    setError('');
    fetch(`/api/public/pgs?${query.toString()}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error('Unable to load matching PGs.');
        return response.json() as Promise<{ totalElements?: number; content?: unknown[] }>;
      })
      .then((data) => setResultCount(data.totalElements ?? data.content?.length ?? 0))
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === 'AbortError') return;
        setError('We could not update the result count. You can still apply these filters.');
      })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [filters]);

  const selectedAmenities = useMemo(
    () => amenities.filter(({ key }) => filters[key]).length,
    [filters],
  );

  const update = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const clearAll = () => {
    setFilters(initialFilters);
    setSearch('');
  };

  const applyFilters = () => {
    const query = toQuery(filters);
    router.push(query.toString() ? `/search?${query.toString()}` : '/search');
  };

  return (
    <main className="min-h-screen bg-[#f7faf9] pb-28 text-[#16254d]">
      <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-[1120px] items-center justify-between px-4 sm:px-6">
          <Link href="/search" aria-label="Back to search" className="flex h-10 w-10 items-center justify-center rounded-full text-[#16254d] transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-600">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <Link href="/" aria-label="StudentPG home" className="absolute left-1/2 -translate-x-1/2">
            <StudentPGLogo className="h-10 sm:h-11" />
          </Link>
          <Link href="/search" className="flex items-center gap-1.5 rounded-xl px-2 py-2 text-sm font-bold text-[#16254d] hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-600">
            <MapPin className="h-5 w-5" />
            <span>Bhopal</span>
            <ChevronDown className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-[1120px] px-4 pb-8 pt-6 sm:px-6 sm:pt-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[30px] font-black tracking-[-0.04em] sm:text-[34px]">Filters</h1>
            <p className="mt-1 text-sm text-slate-500 sm:text-base">Find your perfect PG with the right filters</p>
          </div>
          <button type="button" onClick={clearAll} className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-[#e8f8f2] px-4 py-3 text-xs font-extrabold text-[#079669] transition hover:bg-[#d7f4e9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-600">
            <RotateCcw className="h-4 w-4" />
            <span className="hidden sm:inline">Clear All</span>
          </button>
        </div>

        <div className="mt-6 space-y-3">
          <section className="rounded-2xl bg-white p-4 shadow-[0_4px_20px_rgba(15,23,42,0.04)] sm:p-5">
            <SectionTitle icon={<MapPin />} title="Location" action="Select Area" />
            <div className="relative mt-4">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input aria-label="Search locality, area or landmark" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search locality, area or landmark..." className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10" />
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
              {locations.filter((location) => !search || location.toLowerCase().includes(search.toLowerCase())).map((location) => (
                <ChoiceChip key={location} selected={filters.city === location} onClick={() => update('city', location)} label={location} />
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-white p-4 shadow-[0_4px_20px_rgba(15,23,42,0.04)] sm:p-5">
            <SectionTitle icon={<Home />} title="Stay Type" />
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {stayTypes.map(({ value, label }) => (
                <ChoiceCard key={value} selected={filters.roomType === value} onClick={() => update('roomType', filters.roomType === value ? '' : value)} label={label} icon={<BedDouble />} />
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-white p-4 shadow-[0_4px_20px_rgba(15,23,42,0.04)] sm:p-5">
            <SectionTitle icon={<IndianRupee />} title="Budget (Monthly Rent)" action="Custom Range" />
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {budgets.map(({ min, max, label }) => (
                <ChoiceChip key={label} selected={filters.minRent === min && filters.maxRent === max} onClick={() => {
                  const selected = filters.minRent === min && filters.maxRent === max;
                  update('minRent', selected ? '' : min);
                  update('maxRent', selected ? '' : max);
                }} label={label} />
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-white p-4 shadow-[0_4px_20px_rgba(15,23,42,0.04)] sm:p-5">
            <SectionTitle icon={<Zap />} title="Amenities" />
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
              {amenities.map(({ key, label, icon: Icon }) => (
                <ChoiceCard key={key} selected={filters[key]} onClick={() => update(key, !filters[key])} label={label} icon={<Icon />} />
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-white p-4 shadow-[0_4px_20px_rgba(15,23,42,0.04)] sm:p-5">
            <SectionTitle icon={<Building2 />} title="Property Type" />
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {propertyTypes.map(({ value, label }) => (
                <ChoiceCard key={value} selected={filters.category === value} onClick={() => update('category', filters.category === value ? '' : value)} label={label} icon={<Building2 />} />
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-white p-4 shadow-[0_4px_20px_rgba(15,23,42,0.04)] sm:p-5">
            <SectionTitle icon={<CircleUserRound />} title="Gender Preference" />
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                { value: 'MALE', label: 'Boys' },
                { value: 'FEMALE', label: 'Girls' },
                { value: '', label: 'Any' },
              ].map(({ value, label }) => (
                <ChoiceCard key={label} selected={filters.gender === value} onClick={() => update('gender', value)} label={label} icon={<CircleUserRound />} />
              ))}
            </div>
          </section>
        </div>

        {(error || selectedAmenities > 0) && <p role={error ? 'alert' : undefined} className={`mt-4 text-center text-xs ${error ? 'text-amber-700' : 'text-slate-500'}`}>{error || `${selectedAmenities} amenity filter${selectedAmenities === 1 ? '' : 's'} selected`}</p>}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-100 bg-white/95 px-4 py-3 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-[1120px] items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xl font-black text-[#079669] sm:text-2xl">{isLoading ? '...' : resultCount ?? 0} <span className="text-sm font-bold text-[#16254d] sm:text-base">PGs found</span></p>
          </div>
          <button type="button" onClick={applyFilters} className="inline-flex h-12 shrink-0 items-center justify-center gap-3 rounded-xl bg-[#079669] px-6 text-sm font-extrabold text-white shadow-[0_8px_18px_rgba(7,150,105,0.24)] transition hover:bg-[#057f59] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 active:scale-[0.98] sm:min-w-[214px]">
            Apply Filters
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </main>
  );
}

function SectionTitle({ icon, title, action }: { icon: React.ReactNode; title: string; action?: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="flex items-center gap-2 text-base font-extrabold tracking-[-0.02em] sm:text-lg">
        <span className="text-[#16254d] [&>svg]:h-5 [&>svg]:w-5">{icon}</span>
        {title}
      </h2>
      {action && <span className="inline-flex items-center gap-1 text-xs font-bold text-[#079669]">{action}<ChevronRight className="h-4 w-4" /></span>}
    </div>
  );
}

function ChoiceChip({ selected, onClick, label }: { selected: boolean; onClick: () => void; label: string }) {
  return (
    <button type="button" aria-pressed={selected} onClick={onClick} className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border px-3 text-xs font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-600 ${selected ? 'border-[#079669] bg-[#e8f8f2] text-[#087e5c]' : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300'}`}>
      {label}
      {selected && <Check className="h-4 w-4 rounded-full bg-[#087e5c] p-0.5 text-white" />}
    </button>
  );
}

function ChoiceCard({ selected, onClick, label, icon }: { selected: boolean; onClick: () => void; label: string; icon: React.ReactNode }) {
  return (
    <button type="button" aria-pressed={selected} onClick={onClick} className={`relative flex min-h-[72px] items-center justify-center gap-2 rounded-xl border px-2 py-3 text-center text-xs font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-600 sm:flex-col sm:gap-1.5 ${selected ? 'border-[#079669] bg-[#e8f8f2] text-[#087e5c]' : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300'}`}>
      <span className="[&>svg]:h-5 [&>svg]:w-5">{icon}</span>
      <span>{label}</span>
      {selected && <Check className="absolute right-2 top-2 h-4 w-4 rounded-full bg-[#087e5c] p-0.5 text-white" />}
    </button>
  );
}
