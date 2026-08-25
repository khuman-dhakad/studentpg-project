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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* MAIN LAYOUT */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center py-6 md:py-12">
        
        {/* LEFT BRANDING SIDE (Hidden on Mobile) */}
        <div className="hidden lg:flex lg:col-span-6 flex-col justify-center pr-10">
          <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border border-line bg-white shadow-xl mb-8">
            <Image 
              src="/home page .jpeg" 
              alt="Comfortable Living" 
              fill
              className="object-contain bg-slate-50"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-brand/10 via-transparent to-brand-dark/10" />
          </div>

          <h1 className="text-4xl font-extrabold text-ink tracking-tight leading-tight">
            Join the Network of <span className="text-brand">Premium Hosts</span>
          </h1>
          <p className="mt-3 text-sm text-ink-soft max-w-md">
            List your rooms easily, fill vacancy fast, and manage everything seamlessly on our unified portal.
          </p>

          {/* Feature Micro-Badges */}
          <div className="grid grid-cols-3 gap-3 mt-8">
            {[
              { label: 'Verified Badges', icon: ShieldCheck },
              { label: 'Direct Tenants', icon: MapPin },
              { label: 'Max Earnings', icon: Heart }
            ].map((badge, idx) => (
              <div key={idx} className="bg-white border border-line p-3 rounded-2xl shadow-xs flex flex-col items-center text-center">
                <badge.icon className="w-4 h-4 text-brand mb-1" />
                <span className="text-[11px] font-bold text-ink">{badge.label}</span>
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
      <footer className="w-full bg-white border-t border-line mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-12 w-full md:w-auto justify-items-center">
            {[
              { val: '50K+', label: 'Happy Students', icon: Users },
              { val: '10K+', label: 'Verified PGs', icon: Home },
              { val: '100+', label: 'Cities Covered', icon: Globe },
              { val: '24/7', label: 'Support', icon: Headphones }
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-3">
                <stat.icon className="w-5 h-5 text-brand/80 shrink-0" />
                <div>
                  <div className="text-sm font-extrabold text-ink">{stat.val}</div>
                  <div className="text-[11px] font-medium text-ink-soft">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-ink-soft font-medium">
            © 2026 StudentPG. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}