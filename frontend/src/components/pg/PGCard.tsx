import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import type { PG } from '@/types/pg.types';

interface PGCardProps {
  pg: PG;
}

const fallbackImage = 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80';

export function PGCard({ pg }: PGCardProps) {
  const image = pg.images?.[0]?.url || fallbackImage;
  const amenities = [
    pg.foodAvailable ? 'Meals' : null,
    pg.wifiAvailable ? 'Wi-Fi' : null,
    pg.parkingAvailable ? 'Parking' : null,
    pg.laundryAvailable ? 'Laundry' : null,
  ].filter(Boolean) as string[];

  const isVerified = pg.approvalStatus === 'APPROVED';

  return (
    <Link href={ROUTES.PG_DETAILS(pg.id)} className="group overflow-hidden rounded-[24px] border border-line bg-surface shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={image} alt={pg.pgName} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute left-4 top-4 flex flex-col gap-2">
          <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] shadow-sm ${isVerified ? 'bg-brand text-cream' : 'bg-ink text-cream'}`}>
            {isVerified ? 'Verified' : 'Pending'}
          </span>
          <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-ink shadow-sm">{pg.gender}</span>
        </div>
      </div>
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-lg font-bold text-ink sm:text-xl">{pg.pgName}</h2>
            <p className="mt-1 text-sm text-ink-soft">{pg.city} • {pg.roomType || 'Premium stay'}</p>
          </div>
          <div className="rounded-3xl bg-cream px-4 py-3 text-right text-sm font-semibold text-ink">
            <span className="block text-[10px] uppercase tracking-[0.18em] text-ink-soft">Starts from</span>
            <span className="mt-1 block text-xl font-black text-brand">₹{pg.rent}</span>
          </div>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 text-sm text-ink-soft">
          <div className="rounded-2xl border border-line bg-cream px-3 py-3">
            <p className="text-xs uppercase tracking-[0.18em] text-ink-soft">Location</p>
            <p className="mt-2 font-semibold text-ink">{pg.city}, {pg.state}</p>
          </div>
          <div className="rounded-2xl border border-line bg-cream px-3 py-3">
            <p className="text-xs uppercase tracking-[0.18em] text-ink-soft">Room type</p>
            <p className="mt-2 font-semibold text-ink">{pg.roomType || 'Premium stay'}</p>
          </div>
        </div>
        <p className="mt-4 line-clamp-2 text-sm font-medium text-ink-soft">{pg.description}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {amenities.slice(0, 4).map((amenity) => (
            <span key={amenity} className="rounded-2xl border border-line bg-cream px-3 py-2 text-[11px] font-semibold text-ink-soft">
              {amenity}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
