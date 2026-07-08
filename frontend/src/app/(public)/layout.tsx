'use client';

import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { useTheme } from '@/hooks/useTheme';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <header className="sticky top-0 z-50 w-full border-b border-line/80 bg-surface/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3 sm:gap-8">
            <Link href={ROUTES.HOME} className="truncate font-display text-lg font-black tracking-tight text-brand sm:text-xl">
              STUDENT<span className="text-ink">PG</span>
            </Link>
            <nav className="hidden items-center gap-6 md:flex">
              <Link href={ROUTES.SEARCH} className="text-sm font-semibold text-ink-soft transition-colors hover:text-brand">
                Browse Stays
              </Link>
              <Link href={ROUTES.SUPPORT} className="text-sm font-semibold text-ink-soft transition-colors hover:text-brand">
                Help Desk
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleTheme}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white/80 text-ink-soft transition-colors hover:bg-cream hover:text-ink"
              aria-label="Toggle interface theme"
            >
              {theme === 'light' ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.243 17.657l.707.707M6.343 6.343l.707-.707m2.828 9.9a5 5 0 117.072-7.072 5 5 0 01-7.072 7.072z" />
                </svg>
              )}
            </button>

            <Link
              href={ROUTES.OWNER.LOGIN}
              className="inline-flex h-11 items-center justify-center rounded-full border border-line bg-surface px-4 text-sm font-semibold text-ink transition-all hover:bg-cream"
            >
              Host
            </Link>
          </div>
        </div>
      </header>

      <div className="flex-1 bg-cream">{children}</div>
    </div>
  );
}