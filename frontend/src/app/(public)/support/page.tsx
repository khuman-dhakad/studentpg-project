import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

const supportTopics = [
  {
    icon: '🏠',
    title: 'Finding a PG',
    description: 'Browse verified rooms, compare amenities, and find a stay that fits your needs.',
    href: ROUTES.SEARCH,
    action: 'Explore PGs',
  },
  {
    icon: '🔐',
    title: 'Account & Login',
    description: 'Need help with login, password reset, or your StudentPG account?',
    href: ROUTES.OWNER.LOGIN,
    action: 'Manage account',
  },
  {
    icon: '🏢',
    title: 'Owner Support',
    description: 'Manage your listings, update property details, and track approval status.',
    href: ROUTES.OWNER.LOGIN,
    action: 'Open owner portal',
  },
];

export default function SupportPage() {
  return (
    <main className="mx-auto max-w-6xl px-3 py-5 sm:px-6 sm:py-10 lg:px-8">

      {/* HERO */}
      <section className="relative overflow-hidden rounded-[32px] bg-brand px-6 py-12 text-cream shadow-xl sm:px-12 sm:py-16">
        <div className="relative z-10 max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-cream/70">
            StudentPG Support
          </p>

          <h1 className="mt-4 font-display text-3xl font-black leading-tight sm:text-5xl">
            How can we help you today?
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-cream/80 sm:text-base">
            Whether you are looking for a room, managing a property, or having
            trouble with your account, we are here to help.
          </p>

          <Link
            href="/contact"
            className="mt-8 inline-flex h-12 items-center rounded-full bg-cream px-6 text-sm font-bold text-brand transition-transform hover:scale-[1.03]"
          >
            Contact Support
            <span className="ml-2">→</span>
          </Link>
        </div>

        {/* Decorative background */}
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-cream/10 blur-3xl" />
        <div className="absolute -bottom-32 right-20 h-80 w-80 rounded-full bg-brand-dark/30 blur-3xl" />
      </section>

      {/* QUICK HELP */}
      <section className="mt-8 sm:mt-12">
        <div className="mb-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand">
            Quick help
          </p>

          <h2 className="mt-2 font-display text-2xl font-black text-ink sm:text-3xl">
            What do you need help with?
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {supportTopics.map((topic) => (
            <div
              key={topic.title}
              className="group rounded-[24px] border border-line bg-surface p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-2xl">
                {topic.icon}
              </div>

              <h3 className="mt-5 font-display text-xl font-bold text-ink">
                {topic.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-ink-soft">
                {topic.description}
              </p>

              <Link
                href={topic.href}
                className="mt-5 inline-flex text-sm font-bold text-brand transition-colors hover:text-brand-dark"
              >
                {topic.action}
                <span className="ml-2 transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="mt-8 overflow-hidden rounded-[28px] border border-line bg-surface p-6 shadow-sm sm:mt-12 sm:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10 text-green-600">
                ✓
              </span>

              <p className="text-sm font-bold text-green-600">
                Support is available
              </p>
            </div>

            <h2 className="mt-4 font-display text-2xl font-black text-ink sm:text-3xl">
              Still need a hand?
            </h2>

            <p className="mt-3 text-sm leading-7 text-ink-soft">
              Send us your question and our team will get back to you as soon
              as possible.
            </p>
          </div>

          <Link
            href="/contact"
            className="inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-brand px-6 text-sm font-bold text-cream transition-all hover:bg-brand-dark"
          >
            Send us a message
            <span className="ml-2">→</span>
          </Link>
        </div>
      </section>

      {/* TRUST FOOTER */}
      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-line bg-surface p-5 text-center">
          <p className="text-2xl">🔒</p>
          <h3 className="mt-3 text-sm font-bold text-ink">
            Secure platform
          </h3>
          <p className="mt-1 text-xs text-ink-soft">
            Your account and data stay protected.
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-5 text-center">
          <p className="text-2xl">✓</p>
          <h3 className="mt-3 text-sm font-bold text-ink">
            Verified listings
          </h3>
          <p className="mt-1 text-xs text-ink-soft">
            Discover quality stays with confidence.
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-5 text-center">
          <p className="text-2xl">⚡</p>
          <h3 className="mt-3 text-sm font-bold text-ink">
            Quick assistance
          </h3>
          <p className="mt-1 text-xs text-ink-soft">
            We are here when you need us.
          </p>
        </div>
      </section>

    </main>
  );
}