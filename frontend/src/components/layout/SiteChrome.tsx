'use client';

import type React from 'react';
import { usePathname } from 'next/navigation';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { BottomNav } from '@/components/layout/BottomNav';

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFilterPage = pathname === '/filter';
  const isPgDetails = pathname?.startsWith('/pg/');

  if (isFilterPage) return <>{children}</>;

  if (isPgDetails) {
    return (
      <>
        {children}
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
      <BottomNav />
    </>
  );
}
