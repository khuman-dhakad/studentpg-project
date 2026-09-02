import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { OwnerLoginForm } from '@/features/auth/components/OwnerLoginForm';
import { ShieldCheck, MapPin, Heart, Users, Home, Globe, Headphones } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Owner Login',
  description: 'Sign in to your StudentPG property management portal to manage listings, bookings, and inquiries.',
};

export default function OwnerLoginPage() {
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
            OWNER &amp; HOST PORTAL
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Manage Your <span className="text-emerald-600">PG Stays</span> &amp; Connect with Verified Students
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-slate-500 font-medium max-w-md leading-relaxed">
            Trusted by hundreds of property owners in Bhopal. Zero brokerage, instant WhatsApp direct leads, and easy room management.
          </p>

          {/* Feature Micro-Badges */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            {[
              { label: 'Verified Listing', icon: ShieldCheck },
              { label: 'Bhopal Prime Hubs', icon: MapPin },
              { label: 'Direct Inquiries', icon: Heart }
            ].map((badge, idx) => (
              <div key={idx} className="bg-white border border-slate-200/80 p-3 rounded-2xl flex flex-col items-center text-center shadow-xs">
                <badge.icon className="w-5 h-5 text-emerald-600 mb-1.5" />
                <span className="text-[11px] font-bold text-slate-800">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT FORM CONTAINER */}
        <div className="col-span-1 lg:col-span-6 flex flex-col items-center justify-center">
          <div className="w-full max-w-[460px] bg-white border border-slate-200/80 p-6 md:p-8 rounded-3xl shadow-sm">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Welcome Back!</h2>
              <p className="text-xs md:text-sm text-slate-500 font-medium mt-1">Login to your StudentPG host account</p>
            </div>
            
            <OwnerLoginForm />
          </div>
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