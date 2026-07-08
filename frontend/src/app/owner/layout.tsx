import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-line bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href={ROUTES.OWNER.DASHBOARD} className="font-display text-xl font-black tracking-tight text-brand">
            STUDENT<span className="text-ink">PG</span> HOST
          </Link>
          <nav className="flex flex-wrap gap-4 text-sm font-semibold text-ink-soft">
            <Link href={ROUTES.OWNER.DASHBOARD} className="hover:text-brand">Dashboard</Link>
            <Link href={ROUTES.OWNER.ADD_PG} className="hover:text-brand">Add PG</Link>
            <Link href={ROUTES.OWNER.PROFILE} className="hover:text-brand">Profile</Link>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
