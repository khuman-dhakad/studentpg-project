import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: ReactNode;
  className?: string;
}

export function StatCard({ title, value, subtitle, icon, className }: StatCardProps) {
  return (
    <div className={cn('rounded-2xl border border-line bg-surface p-5 shadow-sm', className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-ink-soft">{title}</p>
          <p className="mt-2 text-2xl font-black text-ink">{value}</p>
          {subtitle ? <p className="mt-1 text-sm text-ink-soft">{subtitle}</p> : null}
        </div>
        {icon ? <div className="rounded-xl bg-brand-soft p-2 text-brand">{icon}</div> : null}
      </div>
    </div>
  );
}
