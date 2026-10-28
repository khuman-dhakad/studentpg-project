'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ROUTES } from '@/constants/routes';
import { MapPin, Check, Heart, Star, Wifi, Utensils, Snowflake, Car, ChevronLeft, ChevronRight, X, MessageCircle } from 'lucide-react';
import type { PG } from '@/types/pg.types';

interface PGCardProps {
  pg: PG;
}

const fallbackImage = 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80';

export function PGCard({ pg }: PGCardProps) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [imageLoadFailed, setImageLoadFailed] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const isVerified = pg.approvalStatus === 'APPROVED';
  const images = pg.images && pg.images.length > 0 ? pg.images : [{ publicId: 'fallback-image', url: fallbackImage }];
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

  const propertyDescription = pg.description?.trim() || 'Comfortable, well-maintained stay with essential amenities and a convenient location.';
  const locationLabel = pg.landmark ? `${pg.landmark}, ${pg.city || 'Bhopal'}` : pg.city ? `${pg.city}, Bhopal` : 'Bhopal';
  const whatsappContact = pg.owner?.whatsappNumber || pg.owner?.phone || '';
  const whatsappUrl = whatsappContact ? `https://wa.me/${whatsappContact.replace(/\D/g, '')}` : '#';

  return (
    <>
      <div className="group relative overflow-hidden rounded-[20px] sm:rounded-[24px] border border-slate-200/90 bg-white shadow-[0_4px_16px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
        <div className="flex items-stretch gap-2.5 p-2.5 sm:gap-3.5 sm:p-3">
          <div className="relative w-[105px] min-w-[105px] min-[380px]:w-[125px] min-[380px]:min-w-[125px] shrink-0 overflow-hidden rounded-[14px] bg-slate-100 sm:w-[210px] sm:min-w-[210px] sm:rounded-[18px]">
            <Link href={ROUTES.PG_DETAILS(pg.id)} className="block h-full w-full min-h-[160px] sm:min-h-[190px]">
              <Image
                src={image}
                alt={pg.pgName}
                fill
                sizes="(max-width: 640px) 130px, 210px"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                onError={() => setImageLoadFailed(true)}
              />
            </Link>

            {isVerified && (
              <div className="absolute left-2 top-2 z-10 inline-flex items-center gap-1 rounded-full bg-[#059669] px-2 py-0.5 text-[10px] font-semibold text-white shadow-2xs">
                <Check className="h-3 w-3 stroke-[2.5]" />
                Verified
              </div>
            )}

            <button
              type="button"
              aria-label="Save property"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setIsLiked(!isLiked);
              }}
              className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-white shadow-2xs backdrop-blur-xs transition-colors hover:bg-black/60"
            >
              <Heart className={`h-3.5 w-3.5 transition-colors ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
            </button>

            <button
              type="button"
              onClick={openGallery}
              aria-label={`View ${images.length} photos of ${pg.pgName}`}
              className="absolute bottom-2 right-2 z-10 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-xs"
            >
              1/{images.length}
            </button>
          </div>

          <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5 gap-1.5 sm:gap-2">
            <div className="space-y-1 sm:space-y-1.5">
              <Link href={ROUTES.PG_DETAILS(pg.id)} className="block">
                <h3 className="line-clamp-1 text-sm sm:text-base font-black tracking-tight text-slate-900 hover:text-emerald-700">
                  {pg.pgName}
                </h3>
              </Link>

              <div className="flex items-center justify-between gap-1 text-[11px] sm:text-xs">
                <div className="flex min-w-0 items-center gap-1 text-slate-500">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                  <span className="truncate">{locationLabel}</span>
                </div>

                <div className="flex items-center gap-1 shrink-0 font-bold text-slate-700">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span>4.5</span>
                  <span className="text-slate-400 font-normal">(120)</span>
                </div>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-sm sm:text-base font-black text-[#059669]">
                  ₹{pg.rent.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] sm:text-xs font-medium text-slate-400">/ month</span>
              </div>

              <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 pt-0.5">
                {pg.wifiAvailable && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-[#eff6ff] border border-blue-100/70 px-1.5 py-0.5 text-[10px] font-semibold text-[#2563eb]">
                    <Wifi className="h-3 w-3" />
                    Wi-Fi
                  </span>
                )}
                {pg.foodAvailable && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-[#eff6ff] border border-blue-100/70 px-1.5 py-0.5 text-[10px] font-semibold text-[#2563eb]">
                    <Utensils className="h-3 w-3" />
                    Meals
                  </span>
                )}
                {pg.acAvailable && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-[#eff6ff] border border-blue-100/70 px-1.5 py-0.5 text-[10px] font-semibold text-[#2563eb]">
                    <Snowflake className="h-3 w-3" />
                    AC
                  </span>
                )}
                {!pg.acAvailable && pg.parkingAvailable && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-[#eff6ff] border border-blue-100/70 px-1.5 py-0.5 text-[10px] font-semibold text-[#2563eb]">
                    <Car className="h-3 w-3" />
                    Parking
                  </span>
                )}
              </div>
            </div>

            <div>
              <p className="line-clamp-2 text-[11px] sm:text-xs text-slate-500 leading-snug">
                {propertyDescription}
              </p>

              <div className="flex flex-col min-[440px]:flex-row items-stretch min-[440px]:items-center gap-1.5 sm:gap-2 pt-2">
                <Link
                  href={ROUTES.PG_DETAILS(pg.id)}
                  className="inline-flex items-center justify-center rounded-lg bg-[#e8f8f2] hover:bg-[#d5f3e7] px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-[#059669] transition-colors w-full min-[440px]:w-auto shrink-0"
                >
                  View Details →
                </Link>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full min-[440px]:flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#059669] hover:bg-[#047857] px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-white transition-colors shadow-2xs"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  Get Contact
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isGalleryOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" onClick={closeGallery}>
          <div className="relative flex h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-slate-950 shadow-2xl" onClick={(event) => { event.preventDefault(); event.stopPropagation(); }}>
            <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent px-5 py-4">
              <div>
                <h4 className="text-sm font-black text-white">{pg.pgName}</h4>
                <p className="mt-0.5 text-xs font-medium text-white/70">Image {activeImageIndex + 1} of {images.length}</p>
              </div>
              <button type="button" onClick={closeGallery} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25" aria-label="Close image gallery">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative flex flex-1 items-center justify-center bg-black">
              <Image src={images[activeImageIndex]?.url || fallbackImage} alt={`${pg.pgName} - Photo ${activeImageIndex + 1}`} fill sizes="100vw" className="object-contain" priority />
              {images.length > 1 && (
                <>
                  <button type="button" onClick={previousImage} className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white hover:bg-black/80" aria-label="Previous photo">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button type="button" onClick={nextImage} className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white hover:bg-black/80" aria-label="Next photo">
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
