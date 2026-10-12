'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Plus, HelpCircle, User } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export function OwnerBottomNav() {
  const pathname = usePathname();

  const isListingsActive = pathname === ROUTES.OWNER.DASHBOARD || pathname === '/owner/dashboard';
  const isProfileActive = pathname === ROUTES.OWNER.PROFILE || pathname === '/owner/profile';
  const isAddPgActive = pathname === ROUTES.OWNER.ADD_PG || pathname === '/owner/add-pg';

  return (
    <nav
      aria-label="Owner mobile navigation"
      className="fixed bottom-0 left-0 right-0 z-50 flex w-full items-center justify-around border-t border-slate-200/90 bg-white/95 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-xl shadow-lg md:hidden"
    >
      {/* Home */}
      <Link
        href={ROUTES.HOME}
        aria-label="Home"
        className="flex flex-col items-center gap-0.5 px-3 py-1 text-slate-500 hover:text-slate-900 transition-colors"
      >
        <Home className="h-5 w-5 stroke-[1.8px]" aria-hidden="true" />
        <span className="text-[10px] font-medium tracking-tight">Home</span>
      </Link>

      {/* Listings */}
      <Link
        href={ROUTES.OWNER.DASHBOARD}
        aria-label="Listings"
        aria-current={isListingsActive ? 'page' : undefined}
        className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
          isListingsActive ? 'text-[#059669] font-bold' : 'text-slate-500 hover:text-slate-900 font-medium'
        }`}
      >
        <LayoutGrid
          className={`h-5 w-5 ${isListingsActive ? 'stroke-[2.5px] text-[#059669]' : 'stroke-[1.8px]'}`}
          aria-hidden="true"
        />
        <span className="text-[10px] tracking-tight">Listings</span>
      </Link>

      {/* Add PG - Floating center action */}
      <Link
        href={ROUTES.OWNER.ADD_PG}
        aria-label="Add New PG"
        className="group relative -mt-5 flex flex-col items-center gap-0.5"
      >
        <div className={`flex h-11 w-11 items-center justify-center rounded-full bg-[#059669] text-white shadow-[0_6px_16px_rgba(5,150,105,0.35)] ring-4 ring-white transition-transform active:scale-95 group-hover:bg-[#047857] ${
          isAddPgActive ? 'ring-emerald-200' : ''
        }`}>
          <Plus className="h-5 w-5 stroke-[2.8px]" />
        </div>
        <span className={`text-[10px] tracking-tight ${isAddPgActive ? 'text-[#059669] font-bold' : 'text-slate-500 font-medium'}`}>
          Add PG
        </span>
      </Link>

      {/* Help */}
      <Link
        href={ROUTES.SUPPORT}
        aria-label="Help"
        className="flex flex-col items-center gap-0.5 px-3 py-1 text-slate-500 hover:text-slate-900 transition-colors"
      >
        <HelpCircle className="h-5 w-5 stroke-[1.8px]" aria-hidden="true" />
        <span className="text-[10px] font-medium tracking-tight">Help</span>
      </Link>

      {/* Profile */}
      <Link
        href={ROUTES.OWNER.PROFILE}
        aria-label="Profile"
        aria-current={isProfileActive ? 'page' : undefined}
        className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
          isProfileActive ? 'text-[#059669] font-bold' : 'text-slate-500 hover:text-slate-900 font-medium'
        }`}
      >
        <User
          className={`h-5 w-5 ${isProfileActive ? 'stroke-[2.5px] text-[#059669]' : 'stroke-[1.8px]'}`}
          aria-hidden="true"
        />
        <span className="text-[10px] tracking-tight">Profile</span>
      </Link>
    </nav>
  );
}
