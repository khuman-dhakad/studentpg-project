'use client';

import React from 'react';
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

export default function HowItWorksPage() {

  const studentSteps = [
    {
      num: '1',
      title: 'Search PGs',
      desc: 'Search by city, location, gender, amenities and more to find PGs that match your needs.',
      icon: Search,
      iconColor: 'bg-purple-100 text-purple-600'
    },
    {
      num: '2',
      title: 'Filter & Compare',
      desc: 'Use filters to compare PGs based on rent, amenities, room type and other details.',
      icon: SlidersHorizontal,
      iconColor: 'bg-pink-100 text-pink-600'
    },
    {
      num: '3',
      title: 'View Details',
      desc: 'Explore PG details, photos, facilities, rules and the exact location to make the right choice.',
      icon: Building2,
      iconColor: 'bg-indigo-100 text-indigo-600'
    },
    {
      num: '4',
      title: 'Contact Owner',
      desc: 'Use the call or WhatsApp button to connect directly with the PG owner.',
      icon: PhoneCall,
      iconColor: 'bg-rose-100 text-rose-600'
    },
    {
      num: '5',
      title: 'Visit & Decide',
      desc: 'Visit the PG, ask your questions and finalize what\'s best for you.',
      icon: ShieldCheck,
      iconColor: 'bg-emerald-100 text-emerald-600'
    },
  ];

  const ownerSteps = [
    {
      num: '1',
      title: 'Create Account',
      desc: 'Sign up as an owner and complete your profile with basic details.',
      icon: UserPlus,
      iconColor: 'bg-purple-100 text-purple-600'
    },
    {
      num: '2',
      title: 'Add Your PG',
      desc: 'Add PG details, amenities, rules, rent, location and upload photos.',
      icon: Home,
      iconColor: 'bg-pink-100 text-pink-600'
    },
    {
      num: '3',
      title: 'Submit for Approval',
      desc: 'Our team will review your listing to ensure quality and genuineness.',
      icon: FileCheck,
      iconColor: 'bg-indigo-100 text-indigo-600'
    },
    {
      num: '4',
      title: 'Get Approved',
      desc: 'Once approved, your PG will be live and visible to thousands of students.',
      icon: CheckCircle2,
      iconColor: 'bg-emerald-100 text-emerald-600'
    },
    {
      num: '5',
      title: 'Receive Inquiries',
      desc: 'Students will contact you directly via call or WhatsApp.',
      icon: Users,
      iconColor: 'bg-rose-100 text-rose-600'
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50/50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">

        {/* HERO SECTION */}
        <div className="bg-white rounded-3xl p-6 sm:p-12 border border-slate-100 shadow-xs grid lg:grid-cols-12 gap-8 items-center text-center lg:text-left">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-[11px] font-black tracking-widest text-indigo-600 uppercase bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              HOW IT WORKS
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Finding the Right PG <br />
              has <span className="text-pink-600">Never Been Easier</span>
            </h1>
            <p className="text-xs sm:text-base font-semibold text-slate-500 leading-relaxed max-w-xl mx-auto lg:mx-0">
              StudentPG connects students with verified PG owners in just a few simple steps.
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
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">For Students</h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-500">Find and connect with the perfect PG in minutes.</p>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {studentSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col items-center text-center relative group hover:border-indigo-200 transition-all">
                  
                  {/* Step Badge */}
                  <span className="w-6 h-6 bg-indigo-600 text-white rounded-full text-[11px] font-black flex items-center justify-center mb-4 shadow-sm">
                    {step.num}
                  </span>

                  {/* Icon Circle */}
                  <div className={`p-3.5 rounded-2xl mb-3 ${step.iconColor}`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-sm font-black text-slate-900 mb-1.5">{step.title}</h3>
                  <p className="text-[11px] font-medium text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* FOR PG OWNERS SECTION */}
        <section className="space-y-6 sm:space-y-8">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">For PG Owners</h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-500">List your PG and connect with students looking for accommodation.</p>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {ownerSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col items-center text-center relative group hover:border-indigo-200 transition-all">
                  
                  {/* Step Badge */}
                  <span className="w-6 h-6 bg-indigo-600 text-white rounded-full text-[11px] font-black flex items-center justify-center mb-4 shadow-sm">
                    {step.num}
                  </span>

                  {/* Icon Circle */}
                  <div className={`p-3.5 rounded-2xl mb-3 ${step.iconColor}`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-sm font-black text-slate-900 mb-1.5">{step.title}</h3>
                  <p className="text-[11px] font-medium text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* NEED HELP BANNER SECTION */}
        <div className="bg-purple-50/70 border border-purple-100/80 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs relative overflow-hidden">
          
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
              <h3 className="text-base sm:text-lg font-black text-purple-950">Need Help?</h3>
              <p className="text-xs font-semibold text-purple-700/80 max-w-md">
                We're here for you! Visit our Help Center or contact our support team.
              </p>
            </div>
          </div>

          <Link
            href={ROUTES.SUPPORT || '/contact'}
            className="px-6 py-3 bg-white hover:bg-slate-50 text-indigo-600 border border-indigo-200 rounded-2xl text-xs font-extrabold transition-all shadow-xs flex items-center gap-2 shrink-0 group z-10"
          >
            <span>Go to Help Center</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </main>
  );
}