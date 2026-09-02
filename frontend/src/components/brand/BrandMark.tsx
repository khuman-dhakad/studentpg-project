import Link from 'next/link';
import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';

interface BrandMarkProps extends Omit<ComponentPropsWithoutRef<typeof Link>, 'href'> {
  compact?: boolean;
  href?: string;
}

export function BrandMark({ className, compact = false, href = '/', ...props }: BrandMarkProps) {
  return (
    <Link
      href={href}
      className={cn('inline-flex items-center gap-2.5 text-slate-900 transition-colors hover:text-emerald-700', className)}
      {...props}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-sm font-black text-white shadow-xs">
        PG
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="text-sm font-black tracking-tight text-slate-900">Student<span className="text-emerald-600">PG</span></span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Verified Living</span>
        </span>
      )}
    </Link>
  );
}
