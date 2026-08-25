"use client";

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';

export default function Gallery({ images, initialIndex = 0 }: { images: Array<{ url: string }>; initialIndex?: number }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(initialIndex);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);

  const next = React.useCallback(() => {
    setIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  const prev = React.useCallback(() => {
    setIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, next, prev]);

  const openAt = (i: number) => {
    setIndex(i);
    setOpen(true);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 50) {
      if (diff < 0) next(); else prev();
    }
    touchStartX.current = null;
  };

  if (!images || images.length === 0) return null;

  return (
    <div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {images.map((img, i) => (
          <button key={i} onClick={() => openAt(i)} className="overflow-hidden rounded-md">
            <Image src={img.url} alt={`img-${i}`} width={400} height={300} className="h-24 w-full object-cover" loading="lazy" />
          </button>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" ref={containerRef} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <button onClick={() => setOpen(false)} className="absolute right-4 top-4 rounded-full bg-black/40 p-2 text-white">
            <X />
          </button>

          <button onClick={prev} className="absolute left-4 rounded-full bg-black/40 p-2 text-white">
            <ArrowLeft />
          </button>

          <div className="mx-auto max-w-4xl px-4">
            <div className="relative h-[70vh] w-[90vw] sm:h-[80vh] sm:w-[80vw]">
              <Image src={images[index].url} alt={`img-full-${index}`} fill className="object-contain" />
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 overflow-x-auto">
              {images.map((img, i) => (
                <button key={i} onClick={() => setIndex(i)} className={`rounded-md overflow-hidden border ${i===index? 'ring-2 ring-white':''}`}>
                  <Image src={img.url} alt={`thumb-${i}`} width={80} height={60} className="h-12 w-16 object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          </div>

          <button onClick={next} className="absolute right-4 rounded-full bg-black/40 p-2 text-white">
            <ArrowRight />
          </button>
        </div>
      )}
    </div>
  );
}
