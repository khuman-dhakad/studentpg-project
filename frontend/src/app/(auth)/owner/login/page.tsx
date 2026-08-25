'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { OwnerLoginForm } from '@/features/auth/components/OwnerLoginForm';
import { ShieldCheck, MapPin, Heart, Users, Home, Globe, Headphones } from 'lucide-react';

export default function OwnerLoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* HEADER NAV */}
      {/* <header className="w-full max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-brand/10 rounded-xl text-brand">
            <Home className="w-6 h-6 fill-brand/10" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-ink">
            Student<span className="text-brand">PG</span>
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-ink-soft">
          <Link href="/" className="hover:text-brand transition-colors">Home</Link>
          <Link href={ROUTES.SEARCH} className="hover:text-brand transition-colors">Find PG</Link>
          <Link href="/owner/register" className="hover:text-brand transition-colors">List Your PG</Link>
          <Link href="#" className="hover:text-brand transition-colors">About Us</Link>
          <Link href="#" className="hover:text-brand transition-colors">Contact</Link>
        </nav>
        <Link 
          href={ROUTES.OWNER.LOGIN} 
          className="border border-brand text-brand hover:bg-brand/5 font-bold px-5 py-2 text-sm rounded-xl transition-all"
        >
          Login
        </Link>
      </header> */}

      {/* MAIN LAYOUT */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center py-6 md:py-12">
        
        {/* LEFT BRANDING SIDE (Hidden on Mobile) */}
        <div className="hidden lg:flex lg:col-span-6 flex-col justify-center pr-8 border-r border-line/60">
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
            Find Your <span className="text-brand">Perfect PG</span><br />Stay with Comfort
          </h1>
          <p className="mt-3 text-base text-ink-soft max-w-md">
            Trusted by thousands of students. Safe • Affordable • Verified PGs across major institutional hubs.
          </p>

          {/* Feature Micro-Badges */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            {[
              { label: 'Verified PGs', icon: ShieldCheck },
              { label: 'Prime Locations', icon: MapPin },
              { label: 'Trusted Stays', icon: Heart }
            ].map((badge, idx) => (
              <div key={idx} className="bg-surface border border-line p-3.5 rounded-2xl flex flex-col items-center text-center">
                <badge.icon className="w-5 h-5 text-brand mb-1.5" />
                <span className="text-xs font-bold text-ink">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT FORM CONTAINER */}
        <div className="col-span-1 lg:col-span-6 flex flex-col items-center justify-center">
          <div className="w-full max-w-[460px] bg-white border border-line p-6 md:p-8 rounded-3xl shadow-xl shadow-slate-100/40">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-extrabold text-ink tracking-tight">Welcome Back!</h2>
              <p className="text-xs md:text-sm text-ink-soft mt-1">Login to your StudentPG account</p>
            </div>
            
            <OwnerLoginForm />

            <div className="mt-6 flex flex-col items-center gap-3">
              <span className="text-xs text-ink-soft/70 font-medium">Don&apos;t have an account?</span>
              <Link 
                href="/owner/register" 
                className="w-full text-center py-3 border border-brand text-brand hover:bg-brand/5 font-bold text-sm rounded-xl transition-all"
              >
                Create Account
              </Link>
            </div>
          </div>
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