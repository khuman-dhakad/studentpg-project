'use client';

import React, { useState } from 'react';
import { MapPin, Bell, ChevronDown, Menu, ExternalLink } from 'lucide-react';
import AdminLogoutButton from '@/features/auth/components/AdminLogoutButton';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

interface AdminHeaderProps {
  onOpenMobileMenu?: () => void;
  unreadNotificationsCount?: number;
  adminName?: string;
  adminRole?: string;
  selectedCity?: string;
}

export function AdminHeader({
  onOpenMobileMenu,
  unreadNotificationsCount = 5,
  adminName = 'Admin',
  adminRole = 'Administrator',
  selectedCity = 'Bhopal',
}: AdminHeaderProps) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex flex-col gap-4 border-b border-slate-200/80 bg-white/95 px-4 py-4 sm:px-6 lg:px-8 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* LEFT: TITLE & SUBTITLE */}
        <div className="flex items-center gap-3">
          {onOpenMobileMenu && (
            <button
              type="button"
              onClick={onOpenMobileMenu}
              className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              Admin Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              Manage PG listings, owners, students and platform content
            </p>
          </div>
        </div>

        {/* RIGHT CONTROLS */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* LOCATION SELECTOR */}
          <div className="relative">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-xl border border-slate-200/90 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors"
            >
              <MapPin className="h-3.5 w-3.5 text-slate-500" />
              <span>{selectedCity}</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>
          </div>

          {/* NOTIFICATION BELL */}
          <div className="relative">
            <button
              type="button"
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/90 bg-white text-slate-600 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="h-4.5 w-4.5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white shadow-xs">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
          </div>

          {/* ADMIN PROFILE */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2.5 rounded-xl p-1 text-left transition-colors hover:bg-slate-50 cursor-pointer"
              aria-expanded={profileDropdownOpen}
            >
              {/* Avatar circle */}
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 font-bold text-white shadow-xs text-sm">
                A
              </div>

              {/* Identity details */}
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  {adminName}
                </span>
                <span className="text-[11px] font-medium text-slate-400 leading-tight">
                  {adminRole}
                </span>
              </div>

              <ChevronDown className="hidden sm:block h-3.5 w-3.5 text-slate-400" />
            </button>

            {/* PROFILE DROPDOWN MENU */}
            {profileDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg z-50 animate-in fade-in-50 zoom-in-95"
                onMouseLeave={() => setProfileDropdownOpen(false)}
              >
                <div className="px-3 py-2 border-b border-slate-100">
                  <div className="text-xs font-bold text-slate-900">{adminName}</div>
                  <div className="text-[11px] text-slate-500">{adminRole}</div>
                </div>

                <div className="pt-1 flex flex-col gap-0.5">
                  <Link
                    href={ROUTES.HOME}
                    target="_blank"
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                    <span>View Public Website</span>
                  </Link>

                  <div className="px-1 pt-1">
                    <AdminLogoutButton />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
