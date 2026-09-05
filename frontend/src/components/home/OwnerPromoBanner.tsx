'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export function OwnerPromoBanner() {
  return (
    <section className="w-full py-4 sm:py-6 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Soft Mint Banner Container matching Section 7 of Reference */}
        <div className="relative overflow-hidden rounded-2xl border border-emerald-200/70 bg-[#E8F8F2] p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">

          <div className="flex items-center gap-4 w-full sm:w-auto">
            {/* House Vector Illustration on Left */}
            <div className="hidden min-[400px]:flex h-16 w-20 sm:h-18 sm:w-22 shrink-0 items-center justify-center">
              <svg
                viewBox="0 0 100 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-full w-full drop-shadow-xs"
                aria-hidden="true"
              >
                {/* Lawn / Ground */}
                <ellipse cx="50" cy="74" rx="46" ry="6" fill="#A7F3D0" />

                {/* Left Trees */}
                <circle cx="16" cy="56" r="12" fill="#34D399" />
                <circle cx="12" cy="52" r="9" fill="#059669" />
                <rect x="14" y="62" width="4" height="12" fill="#065F46" rx="1" />

                {/* Right Trees */}
                <circle cx="86" cy="58" r="10" fill="#34D399" />
                <circle cx="88" cy="54" r="8" fill="#059669" />
                <rect x="85" y="64" width="3" height="10" fill="#065F46" rx="1" />

                {/* House Base */}
                <rect x="26" y="34" width="48" height="38" rx="2" fill="#FFFFFF" stroke="#059669" strokeWidth="2.5" />

                {/* Roof */}
                <path d="M22 36L50 14L78 36H22Z" fill="#065F46" stroke="#065F46" strokeWidth="2" strokeLinejoin="round" />

                {/* Chimney */}
                <rect x="62" y="16" width="6" height="10" fill="#047857" rx="1" />

                {/* Windows */}
                <rect x="32" y="40" width="10" height="10" rx="1.5" fill="#A7F3D0" stroke="#059669" strokeWidth="1.5" />
                <path d="M37 40V50M32 45H42" stroke="#059669" strokeWidth="1" />

                <rect x="58" y="40" width="10" height="10" rx="1.5" fill="#A7F3D0" stroke="#059669" strokeWidth="1.5" />
                <path d="M63 40V50M58 45H68" stroke="#059669" strokeWidth="1" />

                {/* Door */}
                <rect x="44" y="54" width="12" height="18" rx="1.5" fill="#059669" />
                <circle cx="53" cy="63" r="1" fill="#FFFFFF" />
              </svg>
            </div>

            {/* Banner Copy */}
            <div className="text-left">
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Are you a PG Owner?
              </h3>
              <p className="mt-0.5 text-xs text-slate-600 font-medium leading-relaxed">
                List your property and reach thousands of students across Bhopal.
              </p>
            </div>
          </div>

          {/* List Your PG CTA Button */}
          <Link
            href={ROUTES.OWNER.REGISTER}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1 rounded-xl bg-[#047857] hover:bg-emerald-800 active:scale-98 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs transition-all shrink-0 cursor-pointer"
          >
            <span>List Your PG</span>
            <ChevronRight className="h-4 w-4 stroke-[2.5px]" />
          </Link>

        </div>

      </div>
    </section>
  );
}
