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
      className={cn('inline-flex items-center gap-3 text-ink transition-colors hover:text-brand', className)}
      {...props}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand text-lg font-black text-cream shadow-sm">
        PG
      </span>
      {!compact && (
        <span className="flex flex-col leading-tight">
          <span className="font-display text-base font-black tracking-tight">StudentPG</span>
          <span className="text-xs font-medium text-ink-soft">Premium stays</span>
        </span>
      )}
    </Link>
  );
}
