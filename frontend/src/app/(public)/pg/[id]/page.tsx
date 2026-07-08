import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { backendClient } from '@/api/backendClient';
import { BACKEND_ENDPOINTS } from '@/api/endpoints';
import type { PG } from '@/types/pg.types';

async function getListing(id: string) {
  try {
    return await backendClient.get<PG>(BACKEND_ENDPOINTS.PGS.BY_ID(id));
  } catch {
    return null;
  }
}

export default async function PgDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = await getListing(id);

  if (!listing) notFound();

  const image = listing.images?.[0]?.url || 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80';

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="overflow-hidden rounded-3xl border border-line bg-surface shadow-sm">
          <img src={image} alt={listing.pgName} className="h-[360px] w-full object-cover" />
        </div>
        <div className="rounded-3xl border border-line bg-surface p-8 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand">Verified Premium Listing</p>
          <h1 className="mt-3 font-display text-3xl font-black text-ink">{listing.pgName}</h1>
          <p className="mt-3 text-sm leading-7 text-ink-soft">{listing.description}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-line bg-cream p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft">Location</p>
              <p className="mt-2 font-semibold text-ink">{listing.city}, {listing.state}</p>
            </div>
            <div className="rounded-2xl border border-line bg-cream p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft">Rent</p>
              <p className="mt-2 font-semibold text-ink">₹{listing.rent} / month</p>
            </div>
          </div>
          <div className="mt-6 rounded-2xl border border-line bg-cream p-5">
            <h2 className="font-display text-xl font-bold text-ink">Included amenities</h2>
            <ul className="mt-3 space-y-2 text-sm text-ink-soft">
              {listing.wifiAvailable && <li>• High-speed Wi-Fi</li>}
              {listing.foodAvailable && <li>• Meals included</li>}
              {listing.parkingAvailable && <li>• Parking available</li>}
              {listing.laundryAvailable && <li>• Laundry support</li>}
            </ul>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={`https://wa.me/${listing.owner?.phone || ''}`} className="rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-cream">Contact owner</a>
            <Link href={ROUTES.SEARCH} className="rounded-lg border border-line px-5 py-3 text-sm font-semibold text-ink">Back to listings</Link>
          </div>
        </div>
      </div>
    </main>
  );
}