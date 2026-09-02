import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Search, 
  SlidersHorizontal, 
  Building2, 
  PhoneCall, 
  ShieldCheck, 
  UserPlus, 
  Home, 
  FileCheck, 
  CheckCircle2, 
  Users, 
  ArrowRight
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export const metadata: Metadata = {
  title: 'How It Works',
  description: 'Learn how students find verified PGs and how property owners list rooms on StudentPG.',
};

export default function HowItWorksPage() {

  const studentSteps = [
    {
      num: '1',
      title: 'Search Stays',
      desc: 'Filter by city, student zones, gender sharing, and amenities to find verified rooms.',
      icon: Search,
    },
    {
      num: '2',
      title: 'Compare Pricing',
      desc: 'Examine transparent monthly rent, security deposits, and included meals.',
      icon: SlidersHorizontal,
    },
    {
      num: '3',
      title: 'Inspect Details',
      desc: 'Review high-resolution photographs, verified landmarks, and house policies.',
      icon: Building2,
    },
    {
      num: '4',
      title: 'Connect with Host',
      desc: 'Chat via direct WhatsApp or phone call directly with the authenticated owner.',
      icon: PhoneCall,
    },
    {
      num: '5',
      title: 'Visit & Move In',
      desc: 'Schedule a physical visit, confirm room conditions, and finalize your stay.',
      icon: ShieldCheck,
    },
  ];

  const ownerSteps = [
    {
      num: '1',
      title: 'Host Registration',
      desc: 'Sign up as an accommodation owner and submit basic contact information.',
      icon: UserPlus,
    },
    {
      num: '2',
      title: 'List Property',
      desc: 'Add room configurations, pricing breakdown, amenities, and authentic photos.',
      icon: Home,
    },
    {
      num: '3',
      title: 'Audit & Approval',
      desc: 'Our compliance desk conducts security checks to ensure genuine student safety.',
      icon: FileCheck,
    },
    {
      num: '4',
      title: 'Go Live in Bhopal',
      desc: 'Your property goes live and becomes discoverable to thousands of students.',
      icon: CheckCircle2,
    },
    {
      num: '5',
      title: 'Receive Tenants',
      desc: 'Students connect directly with you through verified phone and WhatsApp channels.',
      icon: Users,
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 antialiased">
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">

        {/* HERO SECTION */}
        <div className="bg-white rounded-3xl p-6 sm:p-12 border border-slate-200/80 shadow-xs grid lg:grid-cols-12 gap-8 items-center text-center lg:text-left">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-[11px] font-black tracking-widest text-emerald-700 uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 inline-block">
              TRANSPARENT PROCESS
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Finding the Right PG <br />
              has <span className="text-emerald-600">Never Been Easier</span>
            </h1>
            <p className="text-xs sm:text-sm font-medium text-slate-500 leading-relaxed max-w-xl mx-auto lg:mx-0">
              StudentPG connects university scholars and working professionals with verified accommodation hosts across Bhopal. Zero brokerage, zero hassle.
            </p>
          </div>

          {/* Hero Illustration */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-64 h-48 sm:w-80 sm:h-60">
              <Image
                src="/how it work.jpeg"
                alt="Finding PG Illustration"
                fill
                priority
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* FOR STUDENTS SECTION */}
        <section className="space-y-6 sm:space-y-8">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">For Students &amp; Professionals</h2>
            <p className="text-xs sm:text-sm font-medium text-slate-500">Find, evaluate, and connect with your next accommodation in minutes.</p>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 relative">
            {studentSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col items-center text-center relative group hover:border-emerald-300 hover:shadow-sm transition-all">
                  
                  {/* Step Badge */}
                  <span className="w-6 h-6 bg-emerald-600 text-white rounded-full text-[11px] font-black flex items-center justify-center mb-4 shadow-xs">
                    {step.num}
                  </span>

                  {/* Icon Circle */}
                  <div className="p-3.5 rounded-2xl mb-3 bg-emerald-50 text-emerald-600 border border-emerald-100">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-xs font-black text-slate-900 mb-1.5">{step.title}</h3>
                  <p className="text-[11px] font-medium text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* FOR PG OWNERS SECTION */}
        <section className="space-y-6 sm:space-y-8">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">For Property Owners</h2>
            <p className="text-xs sm:text-sm font-medium text-slate-500">List your rooms and welcome verified student tenants with zero intermediary fees.</p>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 relative">
            {ownerSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col items-center text-center relative group hover:border-emerald-300 hover:shadow-sm transition-all">
                  
                  {/* Step Badge */}
                  <span className="w-6 h-6 bg-slate-900 text-white rounded-full text-[11px] font-black flex items-center justify-center mb-4 shadow-xs">
                    {step.num}
                  </span>

                  {/* Icon Circle */}
                  <div className="p-3.5 rounded-2xl mb-3 bg-slate-50 text-slate-800 border border-slate-200">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-xs font-black text-slate-900 mb-1.5">{step.title}</h3>
                  <p className="text-[11px] font-medium text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* NEED HELP BANNER SECTION */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs relative overflow-hidden text-white">
          
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left z-10">
            {/* Need Help Illustration */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0">
              <Image
                src="/need help.jpeg"
                alt="Need Help Illustration"
                fill
                priority
                className="object-contain"
              />
            </div>

            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-black text-white">Have questions or need assistance?</h3>
              <p className="text-xs font-medium text-slate-300 max-w-md">
                Our support team is available to assist you with onboarding, student verification, or account inquiries.
              </p>
            </div>
          </div>

          <Link
            href={ROUTES.SUPPORT || '/contact'}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 shrink-0 group z-10 cursor-pointer"
          >
            <span>Visit Help Desk</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </main>
  );
}