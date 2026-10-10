'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight, ChevronRight } from 'lucide-react';

interface RoomTypeItem {
  type: string;
  rent: number;
  image: string;
}

interface PGRoomPricingProps {
  rooms: RoomTypeItem[];
  onInquire: () => void;
  onViewAll: () => void;
  contactHref: string;
}

export function PGRoomPricing({
  rooms,
  onViewAll,
  contactHref,
}: PGRoomPricingProps) {
  return (
    <section className="space-y-3.5" aria-label="Room Types & Pricing">
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
          Room Types &amp; Pricing
        </h2>
        <button
          type="button"
          onClick={onViewAll}
          className="inline-flex items-center gap-1 text-xs font-bold text-[#059669] hover:text-emerald-800 transition-colors cursor-pointer"
        >
          <span>View All Rooms</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {rooms.map((room, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between gap-3"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-slate-100">
              <Image
                src={room.image}
                alt={room.type}
                fill
                sizes="(max-width: 640px) 100vw, 280px"
                className="object-cover"
              />
            </div>

            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                  {room.type}
                </h3>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xs sm:text-sm font-black text-[#059669]">
                    ₹{room.rent.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    / month
                  </span>
                </div>
              </div>

              <a
                href={contactHref}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 border border-slate-200 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer shrink-0"
                aria-label={`Inquire about ${room.type}`}
              >
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
