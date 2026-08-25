'use client';

import Image from "next/image";
import { useState } from 'react';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import {
  MapPin,
  ShieldCheck,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Images,
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

  const isVerified = pg.approvalStatus === 'APPROVED';

  /*
   * ============================================================
   * ALL PG IMAGES
   * ============================================================
   */

  const images =
    pg.images && pg.images.length > 0
      ? pg.images
      : [
          {
            publicId: 'fallback-image',
            url: fallbackImage,
          },
        ];

  const image = images[0].url;

  /*
   * ============================================================
   * AMENITIES
   * ============================================================
   */

  const amenities = [
    pg.foodAvailable ? 'Meals' : null,
    pg.wifiAvailable ? 'Wi-Fi' : null,
    pg.parkingAvailable ? 'Parking' : null,
    pg.laundryAvailable ? 'Laundry' : null,
    pg.acAvailable ? 'AC' : null,
    pg.powerBackup ? 'Power Backup' : null,
  ].filter(Boolean) as string[];

  /*
   * ============================================================
   * OPEN IMAGE GALLERY
   * ============================================================
   */

  const openGallery = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    setActiveImageIndex(0);
    setIsGalleryOpen(true);
  };

  /*
   * ============================================================
   * CLOSE IMAGE GALLERY
   * ============================================================
   */

  const closeGallery = (
    event?: React.MouseEvent
  ) => {
    event?.preventDefault();
    event?.stopPropagation();

    setIsGalleryOpen(false);
  };

  /*
   * ============================================================
   * PREVIOUS IMAGE
   * ============================================================
   */

  const showPreviousImage = (
    event: React.MouseEvent
  ) => {
    event.preventDefault();
    event.stopPropagation();

    setActiveImageIndex((previousIndex) =>
      previousIndex === 0
        ? images.length - 1
        : previousIndex - 1
    );
  };

  /*
   * ============================================================
   * NEXT IMAGE
   * ============================================================
   */

  const showNextImage = (
    event: React.MouseEvent
  ) => {
    event.preventDefault();
    event.stopPropagation();

    setActiveImageIndex((previousIndex) =>
      previousIndex === images.length - 1
        ? 0
        : previousIndex + 1
    );
  };

  return (
    <>
      {/* ========================================================
          PG CARD
      ========================================================= */}

      <Link
        href={ROUTES.PG_DETAILS(pg.id)}
        className="group flex h-full w-full flex-col overflow-hidden rounded-[24px] border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:border-slate-200/80 hover:shadow-xl"
      >

        {/* ======================================================
            IMAGE CONTAINER
        ====================================================== */}

        <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-slate-50">

          <button
            type="button"
            onClick={openGallery}
            className="absolute inset-0 z-[5] cursor-zoom-in"
            aria-label={`View all images of ${pg.pgName}`}
          />

          <Image
  src={image}
  alt={pg.pgName}
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
/>

          {/* IMAGE COUNT */}

          {images.length > 1 && (
            <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 rounded-full bg-black/65 px-2.5 py-1.5 text-[10px] font-black text-white backdrop-blur-md">
              <Images className="h-3.5 w-3.5" />
              {images.length} Photos
            </div>
          )}

          {/* BADGES */}

          <div className="absolute left-3 top-3 z-10 flex flex-col items-start gap-1.5">

            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-white shadow-sm backdrop-blur-md ${
                isVerified
                  ? 'bg-emerald-600/90'
                  : 'bg-amber-600/90'
              }`}
            >
              {isVerified ? (
                <ShieldCheck className="h-3 w-3" />
              ) : (
                <HelpCircle className="h-3 w-3" />
              )}

              {isVerified ? 'Verified' : 'Pending'}
            </span>

            {pg.gender && (
              <span className="rounded-full bg-slate-900/75 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-white shadow-sm backdrop-blur-sm">
                {pg.gender} Only
              </span>
            )}

          </div>

        </div>

        {/* ======================================================
            DETAILS
        ====================================================== */}

        <div className="flex flex-1 flex-col justify-between bg-white p-5">

          <div className="space-y-3">

            {/* TITLE + PRICE */}

            <div className="flex items-start justify-between gap-3">

              <div className="min-w-0 flex-1">

                <h2 className="line-clamp-1 font-sans text-base font-black tracking-tight text-slate-950 transition-colors group-hover:text-indigo-600">
                  {pg.pgName}
                </h2>

                <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-slate-400">

                  <MapPin className="h-3 w-3 shrink-0 text-slate-400" />

                  <span className="truncate">
                    {pg.city}, {pg.state}
                  </span>

                </div>

              </div>

              {/* PRICE */}

              <div className="min-w-[75px] shrink-0 rounded-xl border border-slate-100 bg-slate-50 px-2.5 py-1.5 text-right">

                <span className="block text-[8px] font-black uppercase leading-none tracking-wider text-slate-400">
                  Starts from
                </span>

                <span className="mt-0.5 block text-sm font-black tracking-tight text-emerald-600">
                  ₹{pg.rent}
                </span>

              </div>

            </div>

            {/* ROOM TYPE */}

            <div className="inline-flex rounded-lg bg-indigo-50/70 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-indigo-600">
              {pg.roomType || 'Premium Stay'}
            </div>

            {/* DESCRIPTION */}

            {pg.description && (
              <p className="line-clamp-2 pt-0.5 text-xs font-medium leading-relaxed text-slate-400">
                {pg.description}
              </p>
            )}

          </div>

          {/* ====================================================
              AMENITIES
          ==================================================== */}

          <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-slate-50 pt-3.5">

            {amenities.length > 0 ? (

              amenities.map((amenity) => (

                <span
                  key={amenity}
                  className="inline-flex items-center rounded-xl border border-slate-100 bg-slate-50 px-2.5 py-1 text-[10px] font-bold text-slate-600 transition-colors group-hover:bg-slate-100/70"
                >
                  {amenity}
                </span>

              ))

            ) : (

              <span className="text-[10px] font-medium italic text-slate-400">
                Standard Utilities Active
              </span>

            )}

          </div>

        </div>

      </Link>

      {/* ========================================================
          IMAGE GALLERY MODAL
      ========================================================= */}

      {isGalleryOpen && (

        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={closeGallery}
        >

          {/* MODAL */}

          <div
            className="relative flex h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-slate-950 shadow-2xl"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
          >

            {/* HEADER */}

            <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent px-5 py-4">

              <div>

                <h2 className="text-sm font-black text-white">
                  {pg.pgName}
                </h2>

                <p className="mt-0.5 text-xs font-medium text-white/70">
                  Image {activeImageIndex + 1} of {images.length}
                </p>

              </div>

              <button
                type="button"
                onClick={closeGallery}
                className="rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
                aria-label="Close image gallery"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            {/* MAIN IMAGE */}

            <div className="relative flex min-h-0 flex-1 items-center justify-center p-4">

              <Image
                src={images[activeImageIndex].url}
                alt={`${pg.pgName} image ${activeImageIndex + 1}`}
                width={1200}
                height={800}
                className="max-h-full max-w-full rounded-xl object-contain"
              />

              {/* PREVIOUS */}

              {images.length > 1 && (

                <button
                  type="button"
                  onClick={showPreviousImage}
                  className="absolute left-4 rounded-full bg-black/60 p-3 text-white transition hover:bg-black/80"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>

              )}

              {/* NEXT */}

              {images.length > 1 && (

                <button
                  type="button"
                  onClick={showNextImage}
                  className="absolute right-4 rounded-full bg-black/60 p-3 text-white transition hover:bg-black/80"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>

              )}

            </div>

            {/* THUMBNAIL SCROLLER */}

            {images.length > 1 && (

              <div className="flex shrink-0 gap-2 overflow-x-auto border-t border-white/10 bg-slate-950 p-3">

                {images.map((galleryImage, index) => (

                  <button
                    key={galleryImage.publicId}
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      setActiveImageIndex(index);
                    }}
                    className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                      activeImageIndex === index
                        ? 'border-white'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >

                    <Image
                        src={galleryImage.url}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />

                  </button>

                ))}

              </div>

            )}

          </div>

        </div>

      )}

    </>
  );
}