'use client';

import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import {
  MapPin,
  Check,
  Heart,
  Star,
  Wifi,
  Utensils,
  Snowflake,
  Car,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import type { PG } from '@/types/pg.types';

interface PGCardProps {
  pg: PG;
}

const fallbackImage =
  'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80';

export function PGCard({ pg }: PGCardProps) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [imageLoadFailed, setImageLoadFailed] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const isVerified = pg.approvalStatus === 'APPROVED';

  const images =
    pg.images && pg.images.length > 0
      ? pg.images
      : [
          {
            publicId: 'fallback-image',
            url: fallbackImage,
          },
        ];

  const image = imageLoadFailed ? fallbackImage : images[0].url;

  const openGallery = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setActiveImageIndex(0);
    setIsGalleryOpen(true);
  };

  const closeGallery = (event?: React.MouseEvent) => {
    event?.preventDefault();
    event?.stopPropagation();
    setIsGalleryOpen(false);
  };

  const nextImage = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const previousImage = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <Link
        href={ROUTES.PG_DETAILS(pg.id)}
        className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-2.5 sm:p-3 shadow-2xs transition-all duration-300 hover:border-slate-300 hover:shadow-md cursor-pointer"
      >
        {/* ================= IMAGE CONTAINER ================= */}
        <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <Image
            src={image}
            alt={pg.pgName}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageLoadFailed(true)}
          />

          {/* TOP-LEFT: Verified Badge */}
          {isVerified && (
            <div className="absolute left-2.5 top-2.5 z-10 flex items-center gap-1 rounded-full bg-[#059669] px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
              <Check className="h-3 w-3 stroke-[3px]" />
              <span>Verified</span>
            </div>
          )}

          {/* TOP-RIGHT: Wishlist / Heart Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className="absolute right-2.5 top-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/35 backdrop-blur-xs text-white hover:bg-black/50 transition-colors"
            aria-label="Save to Wishlist"
          >
            <Heart
              className={`h-3.5 w-3.5 transition-colors ${
                isLiked ? 'fill-rose-500 text-rose-500' : 'text-white'
              }`}
            />
          </button>

          {/* BOTTOM-RIGHT: Image Count Button (also opens gallery) */}
          <button
            type="button"
            onClick={openGallery}
            className="absolute bottom-2 right-2 z-10 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs hover:bg-black/80 transition-colors"
            aria-label={`View ${images.length} photos of ${pg.pgName}`}
          >
            1/{images.length}
          </button>
        </div>

        {/* ================= CARD BODY ================= */}
        <div className="flex flex-1 flex-col justify-between pt-2.5 sm:pt-3">
          <div>
            {/* PG Name */}
            <h3 className="line-clamp-1 text-sm sm:text-base font-extrabold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
              {pg.pgName}
            </h3>

            {/* Location & Rating Row */}
            <div className="mt-1 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1 min-w-0 text-slate-500 font-medium">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                <span className="truncate">
                  {pg.city ? `${pg.city}, Bhopal` : 'Bhopal'}
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 shrink-0 font-bold text-slate-700 text-xs">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>4.5</span>
                <span className="text-slate-400 font-normal">(120)</span>
              </div>
            </div>

            {/* Price Row */}
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-sm sm:text-base font-black text-[#059669] tracking-tight">
                â‚¹{pg.rent.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                / month
              </span>
            </div>
          </div>

          {/* Amenities Pills Row matching reference */}
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-1.5 overflow-hidden">
            {pg.wifiAvailable && (
              <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 border border-slate-200/70 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                <Wifi className="h-3 w-3 text-slate-500" />
                <span>Wi-Fi</span>
              </span>
            )}
            {pg.foodAvailable && (
              <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 border border-slate-200/70 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                <Utensils className="h-3 w-3 text-slate-500" />
                <span>Meals</span>
              </span>
            )}
            {pg.acAvailable ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 border border-slate-200/70 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                <Snowflake className="h-3 w-3 text-slate-500" />
                <span>AC</span>
              </span>
            ) : pg.parkingAvailable ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 border border-slate-200/70 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                <Car className="h-3 w-3 text-slate-500" />
                <span>Parking</span>
              </span>
            ) : null}
          </div>
        </div>
      </Link>

      {/* ================= IMAGE GALLERY MODAL ================= */}
      {isGalleryOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={closeGallery}
        >
          <div
            className="relative flex h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-slate-950 shadow-2xl"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            {/* Header */}
            <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent px-5 py-4">
              <div>
                <h4 className="text-sm font-black text-white">{pg.pgName}</h4>
                <p className="mt-0.5 text-xs font-medium text-white/70">
                  Image {activeImageIndex + 1} of {images.length}
                </p>
              </div>
              <button
                type="button"
                onClick={closeGallery}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 transition-colors"
                aria-label="Close image gallery"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Main Image */}
            <div className="relative flex flex-1 items-center justify-center bg-black">
              <Image
                src={images[activeImageIndex]?.url || fallbackImage}
                alt={`${pg.pgName} - Photo ${activeImageIndex + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={previousImage}
                    className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/80 transition-all"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/80 transition-all"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
