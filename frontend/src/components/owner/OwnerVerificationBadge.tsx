import { BadgeCheck } from 'lucide-react';

export function OwnerVerificationBadge({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-emerald-50 font-bold text-emerald-700 ${compact ? 'px-2 py-1 text-[10px]' : 'px-2.5 py-1.5 text-xs'}`}>
      <BadgeCheck className={compact ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
      Verified Owner
    </span>
  );
}