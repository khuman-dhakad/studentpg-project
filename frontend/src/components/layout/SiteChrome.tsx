'use client';

import { usePathname } from 'next/navigation';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { BottomNav } from '@/components/layout/BottomNav';

export function SiteChrome() {
  const pathname = usePathname();
  const isFilterPage = pathname === '/filter';

  if (isFilterPage) return null;

  return (
    <>
      <SiteHeader />
      <SiteFooter />
      <BottomNav />
    </>
  );
}
