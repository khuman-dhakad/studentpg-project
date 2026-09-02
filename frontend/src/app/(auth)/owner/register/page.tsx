import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { OwnerRegisterForm } from '@/features/auth/components/OwnerRegisterForm';
import { ShieldCheck, MapPin, Heart, Users, Home, Globe, Headphones } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Owner Registration',
  description: 'Register as a PG Owner on StudentPG to list your property and connect directly with student tenants.',
};

export default function OwnerRegisterPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between antialiased">
      {/* MAIN LAYOUT */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-8 md:py-14">
        
        {/* LEFT BRANDING SIDE (Hidden on Mobile) */}
        <div className="hidden lg:flex lg:col-span-6 flex-col justify-center pr-8 border-r border-slate-200/80">
          <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border border-slate-200/80 bg-white shadow-md mb-8">
            <Image 
              src="/home page .jpeg" 
              alt="Comfortable Living" 
              fill
              className="object-contain bg-slate-50"
              priority
            />
          </div>

          <span className="text-[11px] font-black tracking-widest text-emerald-700 uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 w-fit mb-3">
            HOST ONBOARDING
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Join Bhopal&apos;s Network of <span className="text-emerald-600">Verified Hosts</span>
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-slate-500 font-medium max-w-md leading-relaxed">
            List your rooms easily, fill vacancy fast with zero brokerage, and receive student inquiries directly on WhatsApp.
          </p>

          {/* Feature Micro-Badges */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            {[
              { label: 'Verified Badges', icon: ShieldCheck },
              { label: 'Direct Tenants', icon: MapPin },
              { label: 'Zero Brokerage', icon: Heart }
            ].map((badge, idx) => (
              <div key={idx} className="bg-white border border-slate-200/80 p-3 rounded-2xl shadow-xs flex flex-col items-center text-center">
                <badge.icon className="w-5 h-5 text-emerald-600 mb-1.5" />
                <span className="text-[11px] font-bold text-slate-800">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT FORM CONTAINER */}
        <div className="col-span-1 lg:col-span-6 flex flex-col items-center justify-center">
          <OwnerRegisterForm />
        </div>
      </main>

      {/* STATS FOOTER BAR */}
      <footer className="w-full bg-white border-t border-slate-200/80 py-6">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-12 w-full md:w-auto justify-items-center">
            {[
              { val: '50K+', label: 'Happy Students', icon: Users },
              { val: '10K+', label: 'Verified PGs', icon: Home },
              { val: '100+', label: 'Areas Covered', icon: Globe },
              { val: '24/7', label: 'Helpline Active', icon: Headphones }
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-3">
                <stat.icon className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <div className="text-sm font-black text-slate-900">{stat.val}</div>
                  <div className="text-[11px] font-medium text-slate-500">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 font-medium">
            © 2026 StudentPG. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}