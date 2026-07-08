import Link from 'next/link';
import { BrandMark } from '@/components/brand/BrandMark';
import { ROUTES } from '@/constants/routes';

const navLinks = [
  { href: ROUTES.SEARCH, label: 'Find PG' },
  { href: ROUTES.SUPPORT, label: 'Support' },
  { href: ROUTES.OWNER.LOGIN, label: 'Owner Login' },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-cream/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <BrandMark compact className="min-w-0" />
          <div className="hidden sm:block">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-brand">Verified student living</p>
          </div>
        </div>
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-semibold text-ink-soft transition-colors hover:text-brand">
              {link.label}
            </Link>
          ))}
        </nav>
        <Link href={ROUTES.OWNER.REGISTER} className="inline-flex h-11 items-center justify-center rounded-full bg-brand px-4 text-sm font-semibold text-cream shadow-sm transition-all hover:-translate-y-0.5 hover:bg-brand-dark">
          List PG
        </Link>
      </div>
    </header>
  );
}
