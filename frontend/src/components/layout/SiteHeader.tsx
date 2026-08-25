'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ROUTES } from '@/constants/routes';
import {
  Menu,
  X,
  PlusCircle,
  LayoutDashboard,
  UserRound,
  ChevronRight,
} from 'lucide-react';
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
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/95 backdrop-blur-xl shadow-[0_4px_20px_rgba(15,23,42,0.04)]">

      {/* ================= MAIN HEADER ================= */}
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* ================= BRAND ================= */}
        <Link
          href="/"
          className="group flex items-center gap-3"
        >
          {/* Logo */}
          <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-md">
            <Image
              src="/Pglogo.jpeg"
              alt="StudentPG Logo"
              fill
              sizes="48px"
              className="object-cover"
              priority
            />
          </div>

          {/* Brand Name */}
          <div className="leading-none">
            <div className="text-[17px] font-black tracking-[-0.04em] text-slate-900">
              STUDENT<span className="text-emerald-600">PG</span>
            </div>

            <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.22em] text-slate-400">
              Find Your Next Home
            </div>
          </div>
        </Link>

        {/* ================= DESKTOP NAV ================= */}
        <nav className="hidden items-center gap-2 md:flex">

          {publicNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="
                rounded-xl px-4 py-2.5
                text-[11px] font-extrabold uppercase tracking-[0.12em]
                text-slate-500
                transition-all duration-200
                hover:bg-slate-50
                hover:text-emerald-600
              "
            >
              {link.label}
            </Link>
          ))}

          {/* Not Logged In */}
          {!isOwnerLoggedIn && (
            <Link
              href={ROUTES.OWNER.LOGIN}
              className="
                ml-1 rounded-xl px-4 py-2.5
                text-[11px] font-extrabold uppercase tracking-[0.12em]
                text-slate-500
                transition-all duration-200
                hover:bg-slate-50
                hover:text-emerald-600
              "
            >
              Owner Login
            </Link>
          )}
        </nav>

        {/* ================= RIGHT ACTION AREA ================= */}
        <div className="flex items-center gap-3">

          {/* Loading Placeholder */}
          {isLoading && (
            <div className="hidden h-10 w-28 animate-pulse rounded-xl bg-slate-100 sm:block" />
          )}

          {/* ================= NOT LOGGED IN ================= */}
          {!isLoading && !isOwnerLoggedIn && (
            <Link
              href={ROUTES.OWNER.REGISTER}
              className="
                hidden sm:inline-flex
                h-10 items-center gap-2
                rounded-xl
                bg-slate-900
                px-5
                text-[11px] font-extrabold uppercase tracking-[0.1em]
                text-white
                shadow-sm
                transition-all duration-200
                hover:-translate-y-0.5
                hover:bg-emerald-600
                hover:shadow-lg hover:shadow-emerald-600/20
                active:scale-95
              "
            >
              <PlusCircle className="h-4 w-4" />
              List Your PG
            </Link>
          )}

          {/* ================= LOGGED-IN OWNER ================= */}
          {!isLoading && isOwnerLoggedIn && (
            <Link
              href={ROUTES.OWNER.DASHBOARD}
              className="
                hidden sm:flex
                items-center gap-3
                rounded-2xl
                border border-slate-200
                bg-white
                px-3 py-2
                shadow-sm
                transition-all duration-200
                hover:-translate-y-0.5
                hover:border-emerald-200
                hover:shadow-md
              "
            >
              {/* Avatar */}
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <UserRound className="h-4 w-4" />
              </div>

              <div className="text-left leading-none">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-900">
                  Owner
                </p>

                <p className="mt-1 text-[9px] font-semibold text-emerald-600">
                  Dashboard
                </p>
              </div>

              <ChevronRight className="h-4 w-4 text-slate-400" />
            </Link>
          )}

          {/* ================= MOBILE MENU BUTTON ================= */}
          <button
            type="button"
            className="
              flex h-10 w-10 items-center justify-center
              rounded-xl
              border border-slate-200
              bg-white
              text-slate-700
              shadow-sm
              transition-all
              hover:border-emerald-200
              hover:bg-emerald-50
              hover:text-emerald-600
              md:hidden
            "
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {isOpen && (
        <div className="border-t border-slate-100 bg-white px-4 pb-5 pt-3 shadow-xl md:hidden">

          <div className="flex flex-col gap-1">

            {publicNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="
                  flex items-center justify-between
                  rounded-xl
                  px-4 py-3
                  text-sm font-bold text-slate-700
                  transition-all
                  hover:bg-emerald-50
                  hover:text-emerald-600
                "
              >
                {link.label}

                <ChevronRight className="h-4 w-4 text-slate-300" />
              </Link>
            ))}

            {/* NOT LOGGED IN MOBILE */}
            {!isOwnerLoggedIn && (
              <>
                <Link
                  href={ROUTES.OWNER.LOGIN}
                  onClick={() => setIsOpen(false)}
                  className="
                    flex items-center justify-between
                    rounded-xl
                    px-4 py-3
                    text-sm font-bold text-slate-700
                    transition-all
                    hover:bg-emerald-50
                    hover:text-emerald-600
                  "
                >
                  Owner Login

                  <ChevronRight className="h-4 w-4 text-slate-300" />
                </Link>

                <Link
                  href={ROUTES.OWNER.REGISTER}
                  onClick={() => setIsOpen(false)}
                  className="
                    mt-3 flex items-center justify-center gap-2
                    rounded-xl
                    bg-emerald-600
                    px-4 py-3.5
                    text-sm font-extrabold text-white
                    shadow-lg shadow-emerald-600/20
                    transition-all
                    hover:bg-emerald-500
                    active:scale-[0.98]
                  "
                >
                  <PlusCircle className="h-4 w-4" />
                  List Your PG Free
                </Link>
              </>
            )}

            {/* LOGGED-IN OWNER MOBILE */}
            {isOwnerLoggedIn && (
              <Link
                href={ROUTES.OWNER.DASHBOARD}
                onClick={() => setIsOpen(false)}
                className="
                  mt-3 flex items-center justify-between
                  rounded-xl
                  border border-emerald-100
                  bg-emerald-50
                  px-4 py-3.5
                  text-sm font-extrabold text-emerald-700
                "
              >
                <span className="flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Owner Dashboard
                </span>

                <ChevronRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}