'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, KeyRound } from 'lucide-react';
import { OwnerForgotPasswordForm } from '@/features/auth/components/OwnerForgotPasswordForm';

export default function OwnerForgotPasswordPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50/60 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-5xl bg-white rounded-3xl border border-slate-100 shadow-xl shadow-indigo-100/20 overflow-hidden grid lg:grid-cols-12">
        
        {/* LEFT COLUMN: Visual Illustration & Branding */}
        <div className="lg:col-span-6 bg-gradient-to-br from-indigo-50/80 via-purple-50/50 to-pink-50/30 p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-100">
          
          {/* Top Badge / Logo Concept */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-md shadow-indigo-200">
              <KeyRound className="w-5 h-5" />
            </div>
            <span className="text-sm font-black tracking-tight text-slate-800">
              StudentPG <span className="text-indigo-600">Owner Portal</span>
            </span>
          </div>

          {/* Center Image Container */}
          <div className="my-8 sm:my-10 flex flex-col items-center justify-center text-center">
            <div className="relative w-full max-w-xs sm:max-w-sm h-56 sm:h-72 transition-transform hover:scale-105 duration-300">
              <Image
                src="/forgate password.jpeg" // आपकी पब्लिक फोल्डर की इमेज
                alt="Forgot Password Illustration"
                fill
                priority
                className="object-contain drop-shadow-md"
              />
            </div>

            <div className="mt-6 space-y-2 max-w-sm">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Don't worry, we've got you covered!
              </h3>
              <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                Follow simple steps to reset your password and recover access to your PG Owner Dashboard.
              </p>
            </div>
          </div>

          {/* Bottom Security Note */}
          <div className="flex items-center justify-center lg:justify-start gap-2 text-xs font-bold text-emerald-600 bg-emerald-50/80 border border-emerald-100 rounded-2xl px-4 py-2.5 w-fit mx-auto lg:mx-0">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>100% Secure Account Recovery</span>
          </div>

        </div>

        {/* RIGHT COLUMN: Password Reset Form */}
        <div className="lg:col-span-6 p-6 sm:p-12 flex flex-col justify-center relative bg-white">
          
          {/* Back to Login Link */}
          <div className="mb-6">
            <Link
              href="/owner/login" // अपने सही लॉगिन पाथ से बदलें
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Sign In</span>
            </Link>
          </div>

          {/* Header Title */}
          <div className="space-y-2 mb-8">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Forgot Password?
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 leading-relaxed">
              Enter your registered phone number or email below and we'll send you reset instructions.
            </p>
          </div>

          {/* The Form Component */}
          <div className="w-full">
            <OwnerForgotPasswordForm />
          </div>

        </div>

      </div>
    </main>
  );
}