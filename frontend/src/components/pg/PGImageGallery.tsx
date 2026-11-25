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

export function PGImageGallery({
  images,
  pgName,
  isVerified,
  onOpenModal,
  activeIndex,
  onSelectIndex,
}: PGImageGalleryProps) {
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  const displayImages = images.filter((image) => image.url);

  const getImageUrl = (index: number) => {
    if (failedImages[index]) return null;
    return displayImages[index]?.url || null;
  };

  return (
    <section aria-label="Property Photographs">
      {/* Main Large Image */}
      <div
        className="group relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-100 cursor-pointer shadow-xs border border-slate-200/60"
        onClick={onOpenModal}
      >
        {getImageUrl(activeIndex) ? (
          <Image
            src={getImageUrl(activeIndex)!}
            alt={`${pgName} photo ${activeIndex + 1}`}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 896px"
            className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
            onError={() => setFailedImages((prev) => ({ ...prev, [activeIndex]: true }))}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm font-semibold text-slate-500">
            No photos available
          </div>
        )}

        {/* Top-Left: Verified PG Badge */}
        {isVerified && (
          <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-[#059669] px-3 py-1 text-xs font-bold text-white shadow-md">
            <span className="font-bold">✓</span>
            <span>Verified PG</span>
          </div>
        )}

        {/* Bottom-Right: Photo Counter */}
        <div className="absolute bottom-3 right-3 z-10 rounded-lg bg-black/65 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-xs shadow-xs">
          {displayImages.length > 0 ? `${activeIndex + 1}/${displayImages.length}` : '0/0'}
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
              {getImageUrl(idx) ? (
                <Image
                  src={getImageUrl(idx)!}
                  alt={`${pgName} thumb ${idx + 1}`}
                  fill
                  sizes="96px"
                  className="object-cover"
                  onError={() => setFailedImages((prev) => ({ ...prev, [idx]: true }))}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-[10px] font-semibold text-slate-500">
                  No photo
                </div>
              )}
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
            {getImageUrl(5) ? (
              <Image
                src={getImageUrl(5)!}
                alt="Additional photos"
                fill
                sizes="96px"
                className="object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-slate-100 text-[10px] font-semibold text-slate-500">
                No photo
              </div>
            )}
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-extrabold text-sm backdrop-blur-[1px]">
              +{displayImages.length - 5}
            </div>
          </button>
        )}
      </div>
    </section>
  );
}
