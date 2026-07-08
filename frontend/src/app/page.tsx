import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

const highlights = ['Verified stays', 'Zero brokerage', 'Instant support'];
const stats = [
  { value: '150+', label: 'Verified PGs' },
  { value: '4.9/5', label: 'Average rating' },
  { value: '24/7', label: 'Support concierge' },
];
const benefits = [
  {
    title: 'Trusted by students',
    blurb: 'Every listing is vetted for safety, cleanliness, and comfort before it reaches your shortlist.',
  },
  {
    title: 'Flexible stays',
    blurb: 'From budget rooms to premium shared apartments, find options that fit your routine and budget.',
  },
  {
    title: 'Fast owner onboarding',
    blurb: 'Owners can list, update, and manage spaces in minutes with a simple guided flow.',
  },
];

export default function HomePage() {
  return (
    <div className="relative overflow-hidden bg-cream">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(15,110,86,0.08)_0%,transparent_70%)]" />
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-8rem)] max-w-6xl flex-col items-center justify-center px-3 py-10 text-center sm:px-6 sm:py-16 lg:px-8">
        <span className="inline-flex rounded-full border border-line bg-surface px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-brand shadow-sm sm:px-4">Verified Student Accommodations</span>
        <h1 className="mt-5 max-w-4xl font-display text-4xl font-black tracking-tight text-ink sm:mt-6 sm:text-6xl lg:text-7xl">
          Discover premium <span className="bg-gradient-to-r from-brand to-brand-dark bg-clip-text text-transparent">PG stays</span> with confidence.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-7 text-ink-soft sm:mt-6 sm:text-lg sm:leading-8">
          Stylish, safe, and fully verified paying guest accommodations designed for students and professionals.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:mt-8 sm:gap-3">
          {highlights.map((item) => (
            <span key={item} className="rounded-full border border-line bg-surface px-3 py-2 text-sm font-semibold text-ink-soft sm:px-4">{item}</span>
          ))}
        </div>
        <div className="mt-8 flex w-full flex-col items-stretch justify-center gap-3 sm:mt-10 sm:w-auto sm:flex-row">
          <Link href={ROUTES.SEARCH} className="flex h-12 w-full items-center justify-center rounded-2xl bg-brand px-6 text-sm font-bold text-cream shadow-sm transition-all hover:-translate-y-0.5 hover:bg-brand-dark sm:w-auto">Explore Premium Listings</Link>
          <Link href={ROUTES.OWNER.LOGIN} className="flex h-12 w-full items-center justify-center rounded-2xl border border-line bg-surface px-6 text-sm font-bold text-ink transition-all hover:bg-cream sm:w-auto">List Property</Link>
        </div>

        <section className="mt-10 grid w-full gap-3 rounded-[28px] border border-line/80 bg-surface/80 p-3 shadow-sm backdrop-blur sm:mt-12 sm:grid-cols-3 sm:gap-4 sm:p-6">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-white/70 p-4 text-left sm:text-center">
              <p className="font-display text-2xl font-black text-brand">{stat.value}</p>
              <p className="mt-1 text-sm font-medium text-ink-soft">{stat.label}</p>
            </div>
          ))}
        </section>

        <section className="mt-6 grid w-full gap-4 sm:mt-8 lg:grid-cols-3">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="rounded-[24px] border border-line bg-surface p-5 text-left shadow-sm">
              <h2 className="font-display text-lg font-bold text-ink">{benefit.title}</h2>
              <p className="mt-2 text-sm leading-7 text-ink-soft">{benefit.blurb}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}