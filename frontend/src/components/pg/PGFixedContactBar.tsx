'use client';

import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';

interface PGFixedContactBarProps {
  contactNumber: string;
  whatsappLink: string;
  hasPhone: boolean;
  hasWhatsApp: boolean;
}

export function PGFixedContactBar({
  contactNumber,
  whatsappLink,
  hasPhone,
  hasWhatsApp,
}: PGFixedContactBarProps) {
  return (
    <aside
      aria-label="Contact property host"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-xl"
    >
      <div className="mx-auto max-w-4xl flex items-center gap-3">
        {/* Call Now Button */}
        {hasPhone ? (
          <a
            href={`tel:${contactNumber}`}
            className="flex-1 py-2.5 sm:py-3 px-2.5 sm:px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 text-[#047857] font-bold text-[11px] min-[360px]:text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 transition-all active:scale-[0.98] cursor-pointer"
          >
            <Phone className="h-4 w-4 text-[#047857]" />
            <span>Call Now</span>
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="flex-1 py-3 px-4 rounded-xl bg-slate-100 border border-slate-200 text-slate-400 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-not-allowed"
          >
            <Phone className="h-4 w-4" />
            <span>Call Unavailable</span>
          </button>
        )}

        {/* Chat on WhatsApp Button */}
        {hasWhatsApp ? (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 sm:py-3 px-2.5 sm:px-4 rounded-xl bg-[#047857] hover:bg-[#065f46] text-white font-bold text-[11px] min-[360px]:text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 shadow-xs transition-all active:scale-[0.98] cursor-pointer"
          >
            <MessageCircle className="h-4 w-4" />
            <span><span className="hidden min-[380px]:inline">Chat on </span>WhatsApp</span>
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="flex-1 py-3 px-4 rounded-xl bg-slate-200 text-slate-400 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-not-allowed"
          >
            <MessageCircle className="h-4 w-4" />
            <span>WhatsApp Unavailable</span>
          </button>
        )}
      </div>
    </aside>
  );
}
