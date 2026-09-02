import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { Home, KeyRound, Building2, ArrowRight, ShieldCheck, CheckCircle2, Zap } from 'lucide-react';

const supportTopics = [
  {
    icon: Home,
    title: 'Finding a PG',
    description: 'Browse verified rooms, compare amenities, and find a student stay that matches your budget and requirements in Bhopal.',
    href: ROUTES.SEARCH,
    action: 'Explore PGs',
  },
  {
    icon: KeyRound,
    title: 'Account & Security',
    description: 'Need assistance with host login, password reset, or managing your verified owner profile credentials?',
    href: ROUTES.OWNER.LOGIN,
    action: 'Manage account',
  },
  {
    icon: Building2,
    title: 'Owner Support',
    description: 'Manage your listings, upload room photos, update rental pricing, and track your property verification status.',
    href: ROUTES.OWNER.LOGIN,
    action: 'Open host portal',
  },
];

export default function SupportPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 space-y-10 antialiased">

      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-10 text-white shadow-lg sm:px-12 sm:py-14">
        <div className="relative z-10 max-w-2xl">
          <span className="text-[11px] font-black tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-400/20 inline-block">
            StudentPG Support Center
          </span>

          <h1 className="mt-4 text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            How can we help you today?
          </h1>

          <p className="mt-3 max-w-xl text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            Whether you are looking for student accommodation in Bhopal, managing property listings, or require direct assistance, our team is ready to support you.
          </p>

          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 px-6 py-3 text-xs font-black uppercase tracking-wider text-slate-950 shadow-md transition-all cursor-pointer"
          >
            <span>Contact Support Helpline</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Decorative background */}
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      </section>

      {/* QUICK HELP */}
      <section className="space-y-6">
        <div>
          <span className="text-[11px] font-black tracking-widest text-emerald-700 uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            Quick Help Topics
          </span>

          <h2 className="mt-2 text-2xl font-black text-slate-900 tracking-tight">
            What do you need assistance with?
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {supportTopics.map((topic) => {
            const Icon = topic.icon;
            return (
              <div
                key={topic.title}
                className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs transition-all hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="mt-4 text-base font-black text-slate-900 tracking-tight">
                  {topic.title}
                </h3>

                <p className="mt-2 text-xs text-slate-500 font-medium leading-relaxed">
                  {topic.description}
                </p>

                <Link
                  href={topic.href}
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 transition-colors hover:text-emerald-700 cursor-pointer"
                >
                  <span>{topic.action}</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50/70 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Live Bhopal Helpdesk Active</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Still need personalized assistance?
            </h2>

            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Send us your query or report an issue and our local Bhopal support team will assist you within 24 hours.
            </p>
          </div>

          <Link
            href="/contact"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 px-6 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-sm transition-all cursor-pointer"
          >
            <span>Send Us a Message</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* TRUST FOOTER */}
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 text-center shadow-xs">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 mb-3">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="text-xs font-black text-slate-900 uppercase">
            Secure Platform
          </h3>
          <p className="mt-1 text-[11px] text-slate-500 font-medium">
            Your account and personal data remain protected.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 text-center shadow-xs">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 mb-3">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <h3 className="text-xs font-black text-slate-900 uppercase">
            100% Verified Listings
          </h3>
          <p className="mt-1 text-[11px] text-slate-500 font-medium">
            Discover audited stays with confidence.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 text-center shadow-xs">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 mb-3">
            <Zap className="h-5 w-5" />
          </div>
          <h3 className="text-xs font-black text-slate-900 uppercase">
            Quick Assistance
          </h3>
          <p className="mt-1 text-[11px] text-slate-500 font-medium">
            Same-day owner contacts and direct move-in support.
          </p>
        </div>
      </section>

    </main>
  );
}