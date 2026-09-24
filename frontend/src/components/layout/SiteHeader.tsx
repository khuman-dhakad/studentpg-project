'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import {
  Menu,
  X,
  PlusCircle,
  UserRound,
  ChevronRight,
  MapPin,
  ChevronDown,
} from 'lucide-react';
import { StudentPGLogo } from '@/components/common/StudentPGLogo';
import { MobileNavDrawer } from '@/components/layout/MobileNavDrawer';
import { useSessionQuery } from '@/features/auth/api/authApi';

const publicNavLinks = [
  { href: ROUTES.SEARCH, label: 'Find PG' },
  { href: ROUTES.SUPPORT, label: 'Support' },
  { href: ROUTES.ABOUT, label: 'About Us' },
];

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);

  const {
    data: session,
    isLoading,
  } = useSessionQuery();

  const isOwnerLoggedIn =
    !isLoading &&
    session?.isAuthenticated === true &&
    session?.user?.role === 'OWNER';

  return (
    <header className="">

      {/* ================= MAIN HEADER ================= */}
      <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* ================= BRAND ================= */}
        <Link
          href="/"
          className="group flex items-center cursor-pointer transition-transform duration-200 active:scale-95"
        >
          <StudentPGLogo />
        </Link>

        {/* ================= DESKTOP NAV ================= */}
        <nav className="hidden items-center gap-1 md:flex">

          {publicNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl px-3.5 py-2 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50 hover:text-emerald-700"
            >
              {link.label}
            </Link>
          ))}

          {/* Not Logged In */}
          {!isOwnerLoggedIn && (
            <Link
              href={ROUTES.OWNER.LOGIN}
              className="rounded-xl px-3.5 py-2 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50 hover:text-emerald-700"
            >
              Owner Login
            </Link>
          )}
        </nav>

        {/* ================= RIGHT ACTION AREA ================= */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Location Selector (matching Reference Design: ðŸ“ Bhopal â–¾) */}
          <Link
            href="/search"
            className="flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:text-emerald-700 hover:bg-slate-50 transition-colors cursor-pointer"
            aria-label="City: Bhopal"
          >
            <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
            <span>Bhopal</span>
            <ChevronDown className="h-3 w-3 text-slate-400 shrink-0" />
          </Link>

          {/* Loading Placeholder */}
          {isLoading && (
            <div className="hidden h-9 w-24 animate-pulse rounded-xl bg-slate-100 sm:block" />
          )}

          {/* Not Logged In: List Your PG */}
          {!isLoading && !isOwnerLoggedIn && (
            <Link
              href={ROUTES.OWNER.REGISTER}
              className="hidden sm:inline-flex h-9 items-center gap-1.5 rounded-xl bg-slate-900 px-4 text-xs font-bold text-white shadow-xs transition-all hover:bg-[#059669] active:scale-95 cursor-pointer"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>List Your PG</span>
            </Link>
          )}

          {/* Logged-In Owner */}
          {!isLoading && isOwnerLoggedIn && (
            <Link
              href={ROUTES.OWNER.DASHBOARD}
              className="hidden sm:flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 shadow-2xs hover:border-emerald-300 transition-all cursor-pointer"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <UserRound className="h-3.5 w-3.5" />
              </div>
              <div className="text-left leading-none">
                <p className="text-[10px] font-bold text-slate-900">Dashboard</p>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            </Link>
          )}

          {/* Mobile Menu Button with suppressHydrationWarning */}
          <button
            type="button"
            suppressHydrationWarning
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-2xs transition-colors hover:bg-slate-50 md:hidden cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* ================= MOBILE NAV DRAWER ================= */}
      <MobileNavDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </header>
  );
}
