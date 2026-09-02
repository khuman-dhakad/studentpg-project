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
    <div className={cn('rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs', className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</p>
          <p className="mt-1.5 text-2xl font-black text-slate-900 tracking-tight">{value}</p>
          {subtitle ? <p className="mt-1 text-xs font-medium text-slate-500">{subtitle}</p> : null}
        </div>
        {icon ? <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-2.5 text-emerald-600 shadow-xs">{icon}</div> : null}
      </div>
    </div>
  );
}
