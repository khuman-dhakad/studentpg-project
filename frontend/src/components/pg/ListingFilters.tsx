'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export function ListingFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const [city, setCity] = useState(params.get('city') || '');
  const [maxRent, setMaxRent] = useState(params.get('maxRent') || '');
  const [category, setCategory] = useState(params.get('category') || '');
  const [food, setFood] = useState(params.get('food') === 'true');
  const [wifi, setWifi] = useState(params.get('wifi') === 'true');
  const [parking, setParking] = useState(params.get('parking') === 'true');
  const [laundry, setLaundry] = useState(params.get('laundry') === 'true');

  const apply = () => {
    const next = new URLSearchParams();
    if (city) next.set('city', city);
    if (maxRent) next.set('maxRent', maxRent);
    if (category) next.set('category', category);
    if (food) next.set('food', 'true');
    if (wifi) next.set('wifi', 'true');
    if (parking) next.set('parking', 'true');
    if (laundry) next.set('laundry', 'true');
    router.replace(`/search?${next.toString()}`);
  };

  return (
    <div className="rounded-[24px] border border-line bg-surface p-4 shadow-sm sm:p-5">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="rounded-2xl border border-line bg-cream px-3 py-2.5 text-sm text-ink outline-none" />
        <input value={maxRent} onChange={(e) => setMaxRent(e.target.value)} type="number" placeholder="Max rent" className="rounded-2xl border border-line bg-cream px-3 py-2.5 text-sm text-ink outline-none" />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-2xl border border-line bg-cream px-3 py-2.5 text-sm text-ink outline-none">
          <option value="">Any gender</option>
          <option value="Boys">Boys</option>
          <option value="Girls">Girls</option>
          <option value="Unisex">Unisex</option>
        </select>
        <div className="flex items-center gap-2 text-sm text-ink-soft">
          <input id="wifi" type="checkbox" checked={wifi} onChange={(e) => setWifi(e.target.checked)} />
          <label htmlFor="wifi">Wi-Fi</label>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-3">
        <label className="flex items-center gap-2 text-sm text-ink-soft"><input type="checkbox" checked={food} onChange={(e) => setFood(e.target.checked)} /> Meals</label>
        <label className="flex items-center gap-2 text-sm text-ink-soft"><input type="checkbox" checked={parking} onChange={(e) => setParking(e.target.checked)} /> Parking</label>
        <label className="flex items-center gap-2 text-sm text-ink-soft"><input type="checkbox" checked={laundry} onChange={(e) => setLaundry(e.target.checked)} /> Laundry</label>
      </div>
      <div className="mt-4 flex justify-end">
        <button type="button" onClick={apply} className="rounded-2xl bg-brand px-4 py-2.5 text-sm font-semibold text-cream">Apply filters</button>
      </div>
    </div>
  );
}
