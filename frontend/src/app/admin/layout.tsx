'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { useSessionQuery } from '@/features/auth/api/authApi';

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
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 antialiased">
      {children}
    </div>
  );
}