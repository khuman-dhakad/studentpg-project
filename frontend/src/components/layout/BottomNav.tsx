'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home as HomeIcon, Search, PhoneCall, HelpCircle, User } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useSessionQuery } from '@/features/auth/api/authApi';

export function BottomNav() {
  const pathname = usePathname();
  const { data: session } = useSessionQuery();

  const isOwnerLoggedIn =
    session?.isAuthenticated === true && session?.user?.role === 'OWNER';

  const navItems = [
    { label: 'Home', icon: HomeIcon, href: ROUTES.HOME, isExternal: false },
    { label: 'Search', icon: Search, href: ROUTES.SEARCH, isExternal: false },
    { label: 'Helpline', icon: PhoneCall, href: 'tel:+918604325848', isExternal: true },
    { label: 'Support', icon: HelpCircle, href: ROUTES.SUPPORT, isExternal: false },
    {
      label: isOwnerLoggedIn ? 'Dashboard' : 'Account',
      icon: User,
      href: isOwnerLoggedIn ? ROUTES.OWNER.DASHBOARD : ROUTES.OWNER.LOGIN,
      isExternal: false,
    },
  ];

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed bottom-0 left-0 right-0 z-50 flex w-full justify-around border-t border-slate-200/80 bg-white/95 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-xl shadow-lg md:hidden"
    >
      {navItems.map(({ label, icon: Icon, href, isExternal }) => {
        const isActive = !isExternal && pathname === href;

        if (isExternal) {
          return (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="flex flex-col items-center gap-0.5 px-3 py-1 text-slate-500 hover:text-emerald-600 transition-all active:scale-95"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Icon className="w-4 h-4 stroke-[2.2px]" aria-hidden="true" />
              </div>
              <span className="text-[9px] font-bold tracking-tight text-emerald-700">{label}</span>
            </a>
          );
        }

        return (
          <Link
            key={label}
            href={href}
            aria-label={label}
            aria-current={isActive ? 'page' : undefined}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all active:scale-95 ${
              isActive
                ? 'text-emerald-600 font-extrabold'
                : 'text-slate-500 hover:text-slate-900 font-medium'
            }`}
          >
            <Icon
              className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`}
              aria-hidden="true"
            />
            <span className="text-[9px] tracking-tight">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
