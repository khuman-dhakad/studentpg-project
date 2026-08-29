'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home as HomeIcon, Search, User } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

const NAV_ITEMS = [
  { label: 'Home',    icon: HomeIcon, href: ROUTES.HOME },
  { label: 'Search',  icon: Search,   href: ROUTES.SEARCH },
  { label: 'Account', icon: User,     href: ROUTES.OWNER.LOGIN },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed bottom-0 left-0 right-0 z-50 flex w-full justify-around border-t border-line bg-white/95 py-2 backdrop-blur-lg shadow-lg rounded-t-2xl md:hidden"
    >
      {NAV_ITEMS.map(({ label, icon: Icon, href }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={label}
            href={href}
            aria-label={label}
            aria-current={isActive ? 'page' : undefined}
            className={`flex flex-col items-center gap-1 px-5 py-1.5 rounded-xl transition-colors ${
              isActive ? 'text-brand' : 'text-ink-soft hover:text-ink'
            }`}
          >
            <Icon
              className="w-5 h-5"
              strokeWidth={isActive ? 2.5 : 2}
              aria-hidden="true"
            />
            <span className="text-[10px] font-semibold">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
