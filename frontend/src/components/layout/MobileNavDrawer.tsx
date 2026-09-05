'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  X,
  Home,
  Search,
  LayoutGrid,
  MapPin,
  Bed,
  BedDouble,
  Users2,
  Heart,
  Clock,
  Settings,
  HelpCircle,
  ChevronRight,
  Check,
  UserRound,
} from 'lucide-react';
import { StudentPGLogo } from '@/components/common/StudentPGLogo';
import { ROUTES } from '@/constants/routes';
import { useSessionQuery } from '@/features/auth/api/authApi';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNavDrawer({ isOpen, onClose }: MobileNavDrawerProps) {
  const pathname = usePathname();
  const { data: session, isLoading } = useSessionQuery();

  const isOwnerLoggedIn =
    !isLoading &&
    session?.isAuthenticated === true &&
    session?.user?.role === 'OWNER';

  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Primary Navigation Rows matching Approved Reference (media_1788554375832.png)
  const navItems = [
    {
      label: 'Home',
      href: ROUTES.HOME,
      icon: Home,
      isHome: true,
    },
    {
      label: 'Search PGs',
      href: ROUTES.SEARCH,
      icon: Search,
      iconColor: 'text-slate-700',
    },
    {
      label: 'Explore',
      href: '/search',
      icon: LayoutGrid,
      iconColor: 'text-slate-700',
    },
    {
      label: 'Popular Areas',
      href: ROUTES.AREAS,
      icon: MapPin,
      iconColor: 'text-slate-700',
    },
    {
      label: 'Boys PGs & Hostels',
      href: '/search?category=BOYS',
      icon: Bed,
      iconColor: 'text-blue-500',
    },
    {
      label: 'Girls PGs & Hostels',
      href: '/search?category=GIRLS',
      icon: Bed,
      iconColor: 'text-rose-500',
    },
    {
      label: 'Single Private Rooms',
      href: '/search?roomType=Single',
      icon: BedDouble,
      iconColor: 'text-amber-500',
    },
    {
      label: 'Double / Triple Sharing',
      href: '/search?roomType=Double',
      icon: Users2,
      iconColor: 'text-purple-500',
    },
    {
      label: 'Saved',
      href: '/search?saved=true',
      icon: Heart,
      iconColor: 'text-slate-700',
    },
    {
      label: 'Recent Searches',
      href: '/search',
      icon: Clock,
      iconColor: 'text-slate-700',
    },
  ];

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] md:hidden">
      
      {/* 1. Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 2. Slide-out Drawer Panel */}
      <div className="fixed inset-y-0 left-0 w-[84%] max-w-[340px] bg-white z-10 shadow-2xl overflow-y-auto flex flex-col justify-between p-4 transition-transform duration-300 ease-in-out">
        
        <div>
          {/* Top Header: Logo + Close Button */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <Link href="/" onClick={onClose} className="cursor-pointer">
              <StudentPGLogo className="h-9" />
            </Link>

            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 active:scale-95 transition-all cursor-pointer"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Account Card (matching reference) */}
          <Link
            href={isOwnerLoggedIn ? ROUTES.OWNER.DASHBOARD : ROUTES.OWNER.LOGIN}
            onClick={onClose}
            className="mt-3 rounded-2xl border border-emerald-100 bg-[#F0FDF4] p-3 flex items-center justify-between group hover:border-emerald-200 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#DCFCE7] text-[#059669]">
                <UserRound className="h-5 w-5" />
              </div>
              <div className="text-left leading-tight">
                <p className="text-sm font-black text-slate-900">
                  {isOwnerLoggedIn ? 'Owner Dashboard' : 'Hello!'}
                </p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {isOwnerLoggedIn ? 'Manage your PG listings' : 'Sign in to your account'}
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-emerald-700 transition-colors shrink-0" />
          </Link>

          {/* Primary Navigation Rows */}
          <nav className="mt-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isCurrent =
                pathname === item.href ||
                (item.href === ROUTES.HOME && pathname === '/');

              if (item.isHome && isCurrent) {
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center justify-between rounded-xl bg-[#F0FDF4] px-3 py-2.5 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#059669] text-white">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-bold text-slate-900">
                        {item.label}
                      </span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-[#059669]" />
                  </Link>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center justify-between rounded-xl px-3 py-2 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 shrink-0 ${item.iconColor || 'text-slate-600'}`} />
                    <span className="text-sm font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors">
                      {item.label}
                    </span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                </Link>
              );
            })}
          </nav>

          {/* Are you a PG Owner? Promotional Card */}
          <div className="mt-3.5 rounded-2xl border border-emerald-100 bg-gradient-to-br from-[#F0FDF4] to-[#E6F7ED] p-3.5 relative overflow-hidden">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800">
              Are you a PG Owner?
            </p>
            <h4 className="text-sm sm:text-base font-black text-slate-900 leading-tight mt-1">
              List Your PG <br />
              <span className="text-[#059669]">on StudentPG</span>
            </h4>

            {/* Feature Bullets */}
            <div className="mt-2 space-y-1 text-[11px] font-semibold text-slate-600">
              <div className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-[#059669] shrink-0" />
                <span>Reach thousands of students</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-[#059669] shrink-0" />
                <span>Get genuine inquiries</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-[#059669] shrink-0" />
                <span>No brokerage, direct contacts</span>
              </div>
            </div>

            {/* List Your PG CTA Button */}
            <Link
              href={ROUTES.OWNER.REGISTER}
              onClick={onClose}
              className="mt-3 inline-flex items-center gap-1 rounded-xl bg-[#047857] hover:bg-emerald-800 active:scale-98 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition-all cursor-pointer"
            >
              <span>List Your PG</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>

            {/* House Vector Art in corner */}
            <div className="absolute right-1 bottom-1 w-20 h-18 pointer-events-none opacity-90">
              <svg viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <ellipse cx="50" cy="74" rx="46" ry="6" fill="#A7F3D0" />
                <circle cx="16" cy="56" r="10" fill="#34D399" />
                <rect x="28" y="34" width="44" height="38" rx="2" fill="#FFFFFF" stroke="#059669" strokeWidth="2" />
                <path d="M24 36L50 16L76 36H24Z" fill="#065F46" />
                <rect x="34" y="40" width="8" height="8" rx="1" fill="#A7F3D0" />
                <rect x="58" y="40" width="8" height="8" rx="1" fill="#A7F3D0" />
                <rect x="46" y="54" width="10" height="18" rx="1" fill="#059669" />
              </svg>
            </div>
          </div>

          {/* Bottom Settings & Support Section */}
          <div className="mt-3 pt-2 border-t border-slate-100 space-y-1">
            <Link
              href="/owner/settings"
              onClick={onClose}
              className="flex items-center justify-between rounded-xl px-3 py-2 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <Settings className="h-4 w-4 text-slate-600" />
                <span className="text-sm font-semibold text-slate-800 group-hover:text-emerald-700">
                  Settings
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500" />
            </Link>

            <Link
              href={ROUTES.SUPPORT}
              onClick={onClose}
              className="flex items-center justify-between rounded-xl px-3 py-2 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="h-4 w-4 text-slate-600" />
                <span className="text-sm font-semibold text-slate-800 group-hover:text-emerald-700">
                  Help &amp; Support
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500" />
            </Link>
          </div>
        </div>

        {/* Drawer Bottom Version Area */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-400 px-1">
          <span>v1.0.0</span>
          <span>
            Made with <span className="text-rose-500">❤️</span> in India
          </span>
        </div>

      </div>
    </div>,
    document.body
  );
}
