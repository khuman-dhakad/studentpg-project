import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

export default function SupportPage() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-4 px-3 py-4 sm:gap-8 sm:px-6 sm:py-8 lg:px-8">
      <section className="rounded-[28px] border border-line bg-surface p-4 shadow-sm sm:p-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand">StudentPG Support</p>
        <h1 className="mt-3 font-display text-2xl font-black text-ink sm:text-4xl">Need assistance with your stay or listing?</h1>
        <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-ink-soft sm:text-base">
          Our concierge team helps students find premium rooms and hosts manage verified listings without middlemen.
        </p>
      </section>

      <section className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        <div className="rounded-[24px] border border-line bg-surface p-5 shadow-sm">
          <h2 className="font-display text-lg font-bold text-ink sm:text-xl">For Students</h2>
          <p className="mt-2 text-sm leading-7 text-ink-soft">Explore verified homes, compare amenities, and contact hosts directly.</p>
          <Link href={ROUTES.SEARCH} className="mt-4 inline-flex text-sm font-bold text-brand">Browse listings →</Link>
        </div>
        <div className="rounded-[24px] border border-line bg-surface p-5 shadow-sm">
          <h2 className="font-display text-lg font-bold text-ink sm:text-xl">For Owners</h2>
          <p className="mt-2 text-sm leading-7 text-ink-soft">List your space, update pricing, and track approvals from a single control center.</p>
          <Link href={ROUTES.OWNER.LOGIN} className="mt-4 inline-flex text-sm font-bold text-brand">Open host portal →</Link>
        </div>
        <div className="rounded-[24px] border border-line bg-surface p-5 shadow-sm">
          <h2 className="font-display text-lg font-bold text-ink sm:text-xl">For Admins</h2>
          <p className="mt-2 text-sm leading-7 text-ink-soft">Review pending listings and keep the network premium, safe, and trustworthy.</p>
          <Link href={ROUTES.ADMIN.LOGIN} className="mt-4 inline-flex text-sm font-bold text-brand">Admin access →</Link>
        </div>
      </section>

      <section className="rounded-[24px] border border-line bg-brand/10 p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-brand">Fast response</p>
            <h2 className="mt-2 font-display text-xl font-bold text-ink sm:text-2xl">Need help choosing the right stay?</h2>
          </div>
          <Link href={ROUTES.SUPPORT} className="inline-flex h-12 items-center justify-center rounded-full bg-brand px-5 text-sm font-semibold text-cream transition-all hover:bg-brand-dark">
            Contact concierge
          </Link>
        </div>
      </section>
    </main>
  );
}
