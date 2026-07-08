'use client';

import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Minimalist structural top navbar for clean user onboarding redirection */}
      <header className="h-16 border-b border-line bg-surface/60 backdrop-blur-md flex items-center px-6 justify-between">
        <Link href={ROUTES.HOME} className="font-display text-xl font-black tracking-tight text-brand">
          STUDENT<span className="text-ink">PG</span>
        </Link>
        <Link href={ROUTES.HOME} className="text-xs font-bold text-ink-soft hover:text-ink transition-colors uppercase tracking-wider">
          ← Back to Search
        </Link>
      </header>
      
      <div className="flex-1 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}