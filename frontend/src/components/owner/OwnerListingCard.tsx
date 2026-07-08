import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import type { PG } from '@/types/pg.types';

interface OwnerListingCardProps {
  pg: PG;
  onDelete: (id: string) => void;
}

export function OwnerListingCard({ pg, onDelete }: OwnerListingCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-line bg-cream p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-semibold text-ink">{pg.pgName}</p>
        <p className="text-sm text-ink-soft">{pg.city} • ₹{pg.rent} • {pg.approvalStatus}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link href={ROUTES.OWNER.EDIT_PG(pg.id)} className="rounded-lg bg-brand px-3 py-2 text-sm font-semibold text-cream">Edit</Link>
        <button onClick={() => onDelete(pg.id)} className="rounded-lg border border-line px-3 py-2 text-sm font-semibold text-ink">Delete</button>
      </div>
    </div>
  );
}
