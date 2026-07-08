import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageShellProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function PageShell({ title, description, children, className }: PageShellProps) {
  return (
    <section className={cn('mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8', className)}>
      <header className="mb-8 flex flex-col gap-2">
        <h1 className="font-display text-3xl font-black tracking-tight text-ink">{title}</h1>
        {description ? <p className="max-w-2xl text-sm text-ink-soft sm:text-base">{description}</p> : null}
      </header>
      {children}
    </section>
  );
}
