'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import AdminLogoutButton from '@/features/auth/components/AdminLogoutButton';
import { useSessionQuery } from '@/features/auth/api/authApi';
import { ShieldCheck, ExternalLink } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, isLoading } = useSessionQuery();

  useEffect(() => {
    if (!isLoading && (!session?.isAuthenticated || session.user?.role !== 'ADMIN')) {
      router.replace(ROUTES.ADMIN.LOGIN);
    }
  }, [isLoading, router, session?.isAuthenticated, session?.user?.role]);

  if (isLoading || !session?.isAuthenticated || session.user?.role !== 'ADMIN') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-xs font-bold text-slate-500 antialiased">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-emerald-600" />
          <span>Verifying administrator clearance...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 antialiased">

      {/* HEADER */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:px-8">

          {/* LOGO */}
          <Link
            href={ROUTES.ADMIN.DASHBOARD}
            className="flex items-center gap-2 text-sm font-black tracking-tight text-slate-900"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <span>STUDENT<span className="text-emerald-600">PG</span> ADMIN</span>
          </Link>

          {/* NAVIGATION */}
          <nav className="flex items-center gap-5 text-xs font-bold text-slate-600">

            <Link
              href={ROUTES.ADMIN.DASHBOARD}
              className="text-emerald-700 hover:text-emerald-800 transition-colors"
            >
              Control Center
            </Link>

            <Link
              href={ROUTES.HOME}
              target="_blank"
              className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <span>Live Marketplace</span>
              <ExternalLink className="h-3 w-3" />
            </Link>

            {/* LOGOUT */}
            <AdminLogoutButton />

          </nav>

        </div>
      </header>

      {/* PAGE CONTENT */}
      {children}

    </div>
  );
}