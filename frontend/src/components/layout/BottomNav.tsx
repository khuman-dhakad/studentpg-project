'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Search,
  LayoutGrid,
  Heart,
  User,
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useSessionQuery } from '@/features/auth/api/authApi';

export function BottomNav() {
  const pathname = usePathname();
  const { data: session } = useSessionQuery();

  const isOwnerLoggedIn =
    session?.isAuthenticated === true && session?.user?.role === 'OWNER';

  const navItems = [
    {
      label: 'Home',
      icon: Home,
      href: ROUTES.HOME,
    },
    {
      label: 'Search',
      icon: Search,
      href: ROUTES.SEARCH,
    },
    {
      label: 'Explore',
      icon: LayoutGrid,
      href: '/search',
    },
    {
      label: 'Saved',
      icon: Heart,
      href: '/search?saved=true',
    },
    {
      label: 'Account',
      icon: User,
      href: isOwnerLoggedIn ? ROUTES.OWNER.DASHBOARD : ROUTES.OWNER.LOGIN,
    },
  ];

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed bottom-0 left-0 right-0 z-50 flex w-full items-center justify-around border-t border-slate-200/80 bg-white/95 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-xl shadow-lg md:hidden"
    >
      {navItems.map(({ label, icon: Icon, href }) => {
        const isActive = pathname === href || (href === ROUTES.HOME && pathname === '/');

        return (
          <Link
            key={label}
            href={href}
            aria-label={label}
            aria-current={isActive ? 'page' : undefined}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-all active:scale-95 ${
              isActive
                ? 'text-[#059669] font-bold'
                : 'text-slate-500 hover:text-slate-900 font-medium'
            }`}
          >
            <Icon
              className={`h-5 w-5 ${
                isActive ? 'stroke-[2.5px] text-[#059669]' : 'stroke-[1.8px]'
              }`}
              aria-hidden="true"
            />
            <span className="text-[10px] tracking-tight">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
