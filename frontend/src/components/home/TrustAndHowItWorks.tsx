'use client';

import {
  ShieldCheck,
  Wallet,
  Zap,
  Search,
  SlidersHorizontal,
  CheckCircle2,
  PhoneCall,
} from 'lucide-react';

const TRUST_METRICS = [
  {
    title: '100% Verified Properties',
    description: 'Physical address & host credibility verification.',
    icon: ShieldCheck,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
  },
  {
    title: 'Zero Brokerage / Direct',
    description: 'Direct owner contact with ₹0 middleman fees.',
    icon: Wallet,
    color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
  },
  {
    title: 'Instant WhatsApp Connect',
    description: 'Real-time room availability & same-day visit booking.',
    icon: Zap,
    color: 'text-amber-600 bg-amber-50 border-amber-100',
  },
] as const;

const HOW_IT_WORKS_STEPS = [
  {
    step: '1',
    title: 'Select Locality',
    description: 'Choose your preferred coaching hub, college, or area in Bhopal.',
    icon: Search,
  },
  {
    step: '2',
    title: 'Filter & Compare',
    description: 'Filter by rent budget, room type (Single/Sharing), and amenities.',
    icon: SlidersHorizontal,
  },
  {
    step: '3',
    title: 'Inspect Real Photos',
    description: 'View authentic room pictures, security details, and mess facilities.',
    icon: CheckCircle2,
  },
  {
    step: '4',
    title: 'Connect with Host',
    description: 'Call or WhatsApp the verified owner directly for immediate move-in.',
    icon: PhoneCall,
  },
] as const;

export function TrustAndHowItWorks() {
  return (
    <section className="w-full py-10 sm:py-14 bg-slate-50/70 border-t border-slate-200/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* 1. Three Trust Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {TRUST_METRICS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:shadow-sm"
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${item.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 font-medium leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 2. 4-Step Student Journey */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-xs">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="inline-flex rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-800">
              Simple 4-Step Process
            </span>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              How StudentPG Works
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
              Discover and move into your perfect student stay in Bhopal with zero brokerage.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS_STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="flex flex-col items-center text-center p-4 rounded-2xl bg-slate-50/50 border border-slate-100 transition-all hover:bg-slate-50"
                >
                  <div className="relative mb-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[10px] font-black text-white shadow-xs">
                      {step.step}
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-slate-900">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-500 leading-relaxed font-medium">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
