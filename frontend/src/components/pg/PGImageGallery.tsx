'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface PGImageGalleryProps {
  images: Array<{ url: string }>;
  pgName: string;
  isVerified?: boolean;
  onOpenModal: () => void;
  activeIndex: number;
  onSelectIndex: (idx: number) => void;
}

const fallbackImages = [
  'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
];

export function PGImageGallery({
  images,
  pgName,
  isVerified,
  onOpenModal,
  activeIndex,
  onSelectIndex,
}: PGImageGalleryProps) {
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  const displayImages = images && images.length > 0
    ? images
    : fallbackImages.map((url) => ({ url }));

  const getImageUrl = (index: number) => {
    if (failedImages[index]) return fallbackImages[index % fallbackImages.length];
    return displayImages[index]?.url || fallbackImages[0];
  };

  return (
    <section aria-label="Property Photographs">
      {/* Main Large Image */}
      <div
        className="group relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-100 cursor-pointer shadow-xs border border-slate-200/60"
        onClick={onOpenModal}
      >
        <Image
          src={getImageUrl(activeIndex)}
          alt={`${pgName} photo ${activeIndex + 1}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 896px"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
          onError={() => setFailedImages((prev) => ({ ...prev, [activeIndex]: true }))}
        />

        {/* Top-Left: Verified PG Badge */}
        {isVerified && (
          <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-[#059669] px-3 py-1 text-xs font-bold text-white shadow-md">
            <span className="font-bold">✓</span>
            <span>Verified PG</span>
          </div>
        )}

        {/* Bottom-Right: Photo Counter */}
        <div className="absolute bottom-3 right-3 z-10 rounded-lg bg-black/65 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-xs shadow-xs">
          {activeIndex + 1}/{displayImages.length}
        </div>
      </div>

      {/* Horizontal Thumbnail Strip */}
      <div className="mt-3 flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-1 scrollbar-none">
        {displayImages.slice(0, 5).map((_, idx) => {
          const isSelected = idx === activeIndex;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectIndex(idx)}
              className={`relative h-14 w-20 sm:h-16 sm:w-24 shrink-0 overflow-hidden rounded-xl border-2 transition-all cursor-pointer ${
                isSelected
                  ? 'border-[#059669] ring-2 ring-emerald-500/20 scale-[0.98]'
                  : 'border-transparent opacity-75 hover:opacity-100'
              }`}
              aria-label={`Show photo ${idx + 1}`}
            >
              <Image
                src={getImageUrl(idx)}
                alt={`${pgName} thumb ${idx + 1}`}
                fill
                sizes="96px"
                className="object-cover"
                onError={() => setFailedImages((prev) => ({ ...prev, [idx]: true }))}
              />
            </button>
          );
        })}

        {/* +N Remaining Indicator */}
        {displayImages.length > 5 && (
          <button
            type="button"
            onClick={onOpenModal}
            className="relative h-14 w-20 sm:h-16 sm:w-24 shrink-0 overflow-hidden rounded-xl border-2 border-transparent cursor-pointer group"
            aria-label={`View all ${displayImages.length} photos`}
          >
            <Image
              src={getImageUrl(5)}
              alt="Additional photos"
              fill
              sizes="96px"
              className="object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-extrabold text-sm backdrop-blur-[1px]">
              +{displayImages.length - 5}
            </div>
          </button>
        )}
      </div>
    </section>
  );
}
