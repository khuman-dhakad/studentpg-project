import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import AdminLogoutButton from '@/features/auth/components/AdminLogoutButton';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cream">

      {/* HEADER */}
      <header className="border-b border-line bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">

          {/* LOGO */}
          <Link
            href={ROUTES.ADMIN.DASHBOARD}
            className="font-display text-xl font-black tracking-tight text-brand"
          >
            STUDENT<span className="text-ink">PG</span> ADMIN
          </Link>

          {/* NAVIGATION */}
          <nav className="flex items-center gap-4 text-sm font-semibold text-ink-soft">

            <Link
              href={ROUTES.ADMIN.DASHBOARD}
              className="transition hover:text-brand"
            >
              Overview
            </Link>

            <Link
              href={ROUTES.HOME}
              className="transition hover:text-brand"
            >
              Public Site
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