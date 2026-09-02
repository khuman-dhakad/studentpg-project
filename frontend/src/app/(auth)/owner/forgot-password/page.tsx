import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, KeyRound } from 'lucide-react';
import { OwnerForgotPasswordForm } from '@/features/auth/components/OwnerForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'Recover access to your StudentPG property owner account securely.',
};

export default function OwnerForgotPasswordPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50/60 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center antialiased">
      <div className="w-full max-w-4xl bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden grid lg:grid-cols-12">
        
        {/* LEFT COLUMN: Visual Illustration & Branding */}
        <div className="lg:col-span-6 bg-slate-50/70 p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-200/80">
          
          {/* Top Badge */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow-md shadow-emerald-900/10">
              <KeyRound className="w-5 h-5" />
            </div>
            <span className="text-sm font-black tracking-tight text-slate-900">
              StudentPG <span className="text-emerald-600">Owner Portal</span>
            </span>
          </div>

          {/* Center Image Container */}
          <div className="my-8 sm:my-10 flex flex-col items-center justify-center text-center">
            <div className="relative w-full max-w-xs sm:max-w-sm h-52 sm:h-64">
              <Image
                src="/forgate password.jpeg"
                alt="Forgot Password Illustration"
                fill
                priority
                className="object-contain"
              />
            </div>

            <div className="mt-6 space-y-1.5 max-w-sm">
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                Account Recovery Assistance
              </h3>
              <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                Follow simple steps to reset your password and recover access to your PG Owner Dashboard.
              </p>
            </div>
          </div>

          {/* Bottom Security Note */}
          <div className="flex items-center justify-center lg:justify-start gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5 w-fit mx-auto lg:mx-0">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>100% Secure Account Recovery</span>
          </div>

        </div>

        {/* RIGHT COLUMN: Password Reset Form */}
        <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-center relative bg-white">
          
          {/* Back to Login Link */}
          <div className="mb-6">
            <Link
              href="/owner/login"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-emerald-700 transition-colors group cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Sign In</span>
            </Link>
          </div>

          {/* Header Title */}
          <div className="space-y-1.5 mb-6">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Forgot Password?
            </h1>
            <p className="text-xs font-semibold text-slate-500 leading-relaxed">
              Enter your registered email address below and we&apos;ll send you a 6-digit reset code.
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