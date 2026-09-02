import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-10 text-center shadow-xs', className)}>
      <h3 className="text-base font-black text-slate-900">{title}</h3>
      <p className="mx-auto mt-1.5 max-w-md text-xs font-medium text-slate-500 leading-relaxed">{description}</p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}
