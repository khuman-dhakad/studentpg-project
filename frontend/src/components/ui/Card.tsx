import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return <div className={cn('rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs', className)}>{children}</div>;
}
