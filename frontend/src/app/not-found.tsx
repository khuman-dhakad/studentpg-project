'use client';

import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center antialiased">
      <span className="rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-black uppercase tracking-widest text-emerald-700 border border-emerald-100">
        404 ERROR
      </span>
      <h1 className="mt-4 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
        Listing or Page Not Found
      </h1>
      <p className="mt-2 max-w-md text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
        The accommodation listing, category filter, or account page you are trying to access does not exist or has been relocated.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Link
          href={ROUTES.HOME}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 text-xs font-black uppercase tracking-wider text-white shadow-md shadow-emerald-900/10 transition-all hover:bg-emerald-700 active:scale-95 cursor-pointer"
        >
          <Home className="h-4 w-4" />
          <span>Return to Homepage</span>
        </Link>
        <Link
          href={ROUTES.SEARCH}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-xs font-bold text-slate-700 shadow-xs transition-all hover:bg-slate-50 active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Browse All PGs</span>
        </Link>
      </div>
    </div>
  );
}