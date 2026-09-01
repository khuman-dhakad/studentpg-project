'use client';

import Link from 'next/link';
import { PlusCircle, UserCheck, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export function OwnerPromoBanner() {
  return (
    <section className="w-full py-6 sm:py-8 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-950 p-6 sm:p-8 md:p-10 text-white shadow-xl">
          {/* Subtle Glow Circle */}
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Left Content */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-400/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-300 backdrop-blur-md">
                <UserCheck className="h-3.5 w-3.5" /> For Property Owners & PG Hosts
              </div>

              <h2 className="mt-3 text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white leading-tight">
                Connect with <span className="text-emerald-400">50,000+</span> Students searching on StudentPG
              </h2>

              <p className="mt-2 text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
                List your PG or hostel for free. Receive direct WhatsApp student inquiries, zero broker commission, and get a verified property host badge.
              </p>

              {/* Feature Points */}
              <div className="mt-4 flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-semibold text-slate-200">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>100% Free Listing</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-emerald-400" />
                  <span>Zero Commission</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <UserCheck className="h-4 w-4 text-emerald-400" />
                  <span>Direct WhatsApp Inquiries</span>
                </div>
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                href={ROUTES.OWNER.REGISTER}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 px-6 py-3.5 text-xs sm:text-sm font-black uppercase tracking-wider text-slate-950 shadow-lg transition-all cursor-pointer"
              >
                <PlusCircle className="h-4 w-4" />
                <span>List Your Property FREE</span>
              </Link>

              <Link
                href={ROUTES.OWNER.LOGIN}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 hover:bg-white/20 active:scale-95 px-5 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white backdrop-blur-md transition-all cursor-pointer"
              >
                <span>Owner Login</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
