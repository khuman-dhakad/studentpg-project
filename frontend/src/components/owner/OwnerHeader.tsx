'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { MapPin, ChevronDown, LayoutDashboard, PlusCircle, User, Settings, LogOut } from 'lucide-react';
import { StudentPGLogo } from '@/components/common/StudentPGLogo';
import NotificationBell from '@/components/notifications/NotificationBell';
import { ROUTES } from '@/constants/routes';
import { useSessionQuery, useLogoutMutation } from '@/features/auth/api/authApi';
import { baseApi } from '@/api/baseApi';
import { OwnerVerificationBadge } from '@/components/owner/OwnerVerificationBadge';

export function OwnerHeader() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: session, isLoading } = useSessionQuery();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const user = session?.user;
  const profile = session?.profile;
  const userName = profile?.name || user?.email || 'Owner';
  const userInitials = userName
    .split(' ')
    .filter(Boolean)
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'OW';

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    try {
      await logout().unwrap();
    } catch {
      // Ignored - cleanup locally
    } finally {
      dispatch(baseApi.util.resetApiState());
      router.replace(ROUTES.OWNER.LOGIN);
      router.refresh();
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-3.5 sm:px-6">
        {/* Brand & Tagline */}
        <Link
          href={ROUTES.HOME}
          className="group flex items-center transition-transform duration-200 active:scale-95"
          aria-label="StudentPG Home"
        >
          <StudentPGLogo className="h-9 sm:h-10" showTagline={true} />
        </Link>

        {/* Right Section: Location Pill + Notification + User Avatar */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Location Selector (📍 Bhopal ▾) */}
          <Link
            href="/search"
            className="flex items-center gap-1 rounded-xl px-2 py-1 text-xs font-bold text-slate-700 hover:text-emerald-700 hover:bg-slate-50 transition-colors"
            aria-label="City: Bhopal"
          >
            <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
            <span className="text-slate-800">Bhopal</span>
            <ChevronDown className="h-3 w-3 text-slate-400 shrink-0" />
          </Link>

          {/* Notifications */}
          <NotificationBell />

          {/* User Profile Avatar with Dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              aria-label="Owner profile menu"
              aria-expanded={isDropdownOpen}
              className="flex items-center gap-1.5 rounded-full p-0.5 transition-colors hover:ring-2 hover:ring-emerald-200 focus:outline-none"
            >
              {profile?.profileImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.profileImageUrl}
                  alt={userName}
                  className="h-8 w-8 rounded-full object-cover border border-slate-200"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#059669] text-xs font-black text-white shadow-2xs">
                  {isLoading ? '..' : userInitials}
                </div>
              )}
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden sm:block" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-11 z-50 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                <div className="border-b border-slate-100 p-3.5">
                  <p className="truncate text-xs font-bold text-slate-900">{userName}</p>
                  <p className="truncate text-[10px] text-slate-400">{user?.email}</p>
                  <div className="mt-1 flex items-center gap-1 text-[10px] font-semibold">
                    <span className="text-slate-400">Status:</span>
                    {profile?.verificationStatus === 'VERIFIED' ? (
                      <OwnerVerificationBadge compact />
                    ) : (
                      <span className="text-amber-600">Pending Verification</span>
                    )}
                  </div>
                </div>

                <div className="p-1 text-xs font-semibold text-slate-700">
                  <Link
                    href={ROUTES.OWNER.DASHBOARD}
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-slate-50 transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4 text-emerald-600" />
                    <span>Dashboard</span>
                  </Link>

                  <Link
                    href={ROUTES.OWNER.ADD_PG}
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-slate-50 transition-colors"
                  >
                    <PlusCircle className="h-4 w-4 text-emerald-600" />
                    <span>Add New PG</span>
                  </Link>

                  <Link
                    href={ROUTES.OWNER.PROFILE}
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-slate-50 transition-colors"
                  >
                    <User className="h-4 w-4 text-slate-500" />
                    <span>Profile</span>
                  </Link>

                  <Link
                    href="/owner/settings"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-slate-50 transition-colors"
                  >
                    <Settings className="h-4 w-4 text-slate-500" />
                    <span>Settings</span>
                  </Link>
                </div>

                <div className="border-t border-slate-100 p-1">
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
