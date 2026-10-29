'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { StudentPGLogo } from '@/components/common/StudentPGLogo';
import { PGImageGallery } from '@/components/pg/PGImageGallery';
import { PGFixedContactBar } from '@/components/pg/PGFixedContactBar';
import { PGRoomPricing } from '@/components/pg/PGRoomPricing';
import type { PG, PGImage } from '@/types/pg.types';
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  ArrowRight,
  MessageCircle,
  Phone,
  Wifi,
  Utensils,
  Snowflake,
  Car,
  ShieldCheck,
  BatteryCharging,
  WashingMachine,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCheck,
} from 'lucide-react';

interface PGDetailsViewProps {
  listing: PG;
}

const fallbackImages = [
  'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
];

export function PGDetailsView({ listing }: PGDetailsViewProps) {
  const router = useRouter();

  // 1. Gallery State
  const rawImages: PGImage[] = listing.images && listing.images.length > 0
    ? listing.images
    : fallbackImages.map((url, idx) => ({ id: `fallback-${idx}`, publicId: `fallback-${idx}`, url }));

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);

  // 2. Favorite State (local persistence)
  const [isFavorited, setIsFavorited] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('studentpg_favorites');
      if (stored) {
        const ids: string[] = JSON.parse(stored);
        if (ids.includes(listing.id)) {
          setIsFavorited(true);
        }
      }
    } catch {
      // Ignore storage errors
    }
  }, [listing.id]);

  const toggleFavorite = () => {
    try {
      const stored = localStorage.getItem('studentpg_favorites');
      let ids: string[] = stored ? JSON.parse(stored) : [];
      if (ids.includes(listing.id)) {
        ids = ids.filter((id) => id !== listing.id);
        setIsFavorited(false);
        showToast('Removed from saved list');
      } else {
        ids.push(listing.id);
        setIsFavorited(true);
        showToast('Saved to your favorites');
      }
      localStorage.setItem('studentpg_favorites', JSON.stringify(ids));
    } catch {
      setIsFavorited((prev) => !prev);
    }
  };

  // 3. Share Action
  const handleShare = async () => {
    const shareData = {
      title: `${listing.pgName} - StudentPG`,
      text: `Check out ${listing.pgName} in ${listing.city || 'Bhopal'} on StudentPG!`,
      url: typeof window !== 'undefined' ? window.location.href : '',
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err: unknown) {
        if ((err as Error).name !== 'AbortError') {
          copyToClipboard();
        }
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!');
    }
  };

  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);
  const showToast = (msg: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(msg);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // 4. Description Read More
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const descriptionText =
    listing.description?.trim() ||
    `Comfortable and secure student accommodation in ${listing.city || 'Bhopal'}. Fully furnished rooms with high-speed Wi-Fi, hygienic meals, and a peaceful study environment make it the ideal choice for your academic journey.`;

  const isLongDescription = descriptionText.length > 180;

  // 5. Contact Details
  const ownerName = listing.owner?.name || 'Property Host';
  const contactNumber = listing.owner?.phone || '';
  const rawWhatsApp = listing.owner?.whatsappNumber || contactNumber;
  const cleanWhatsAppNumber = rawWhatsApp.replace(/\D/g, '');
  const formattedWhatsApp = cleanWhatsAppNumber.startsWith('91')
    ? cleanWhatsAppNumber
    : `91${cleanWhatsAppNumber}`;

  const hasPhone = Boolean(contactNumber && contactNumber.trim().length > 5);
  const hasWhatsApp = Boolean(cleanWhatsAppNumber && cleanWhatsAppNumber.length > 5);

  const whatsAppMessage = encodeURIComponent(
    `Hi ${ownerName}, I found your listing "${listing.pgName}" on StudentPG and would like to inquire about room availability.`
  );
  const whatsAppLink = `https://wa.me/${formattedWhatsApp}?text=${whatsAppMessage}`;

  // 6. Amenities Configuration
  const allAmenities = [
    {
      label: 'Wi-Fi',
      available: listing.wifiAvailable,
      icon: Wifi,
    },
    {
      label: 'Meals Included',
      available: listing.foodAvailable,
      icon: Utensils,
    },
    {
      label: 'AC Rooms',
      available: listing.acAvailable,
      icon: Snowflake,
    },
    {
      label: 'Parking',
      available: listing.parkingAvailable,
      icon: Car,
    },
    {
      label: '24x7 Security',
      available: listing.powerBackup || true, // baseline student security
      icon: ShieldCheck,
    },
    {
      label: 'Power Backup',
      available: listing.powerBackup,
      icon: BatteryCharging,
    },
    {
      label: 'Laundry',
      available: listing.laundryAvailable,
      icon: WashingMachine,
    },
  ];

  const displayedAmenities = allAmenities.filter((a) => a.available).slice(0, 5);

  // 7. Room Types & Pricing Logic
  const baseRent = typeof listing.rent === 'number' ? listing.rent : 8000;
  const roomTypesData = [
    {
      type: 'Single Room',
      rent: Math.round(baseRent * 1.25),
      image: rawImages[0]?.url || fallbackImages[0],
    },
    {
      type: listing.roomType ? `${listing.roomType} Sharing` : 'Double Sharing',
      rent: baseRent,
      image: rawImages[1]?.url || fallbackImages[1],
    },
    {
      type: 'Triple Sharing',
      rent: Math.round(baseRent * 0.82),
      image: rawImages[2]?.url || fallbackImages[2],
    },
  ];

  // Lightbox navigation
  const nextImage = useCallback(() => {
    setActiveImageIndex((prev) => (prev + 1) % rawImages.length);
  }, [rawImages.length]);

  const prevImage = useCallback(() => {
    setActiveImageIndex((prev) => (prev - 1 + rawImages.length) % rawImages.length);
  }, [rawImages.length]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!isGalleryModalOpen) return;
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') setIsGalleryModalOpen(false);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isGalleryModalOpen, nextImage, prevImage]);

  // Map link
  const mapQuery = encodeURIComponent(
    `${listing.pgName} ${listing.address || ''} ${listing.city || 'Bhopal'}`
  );
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  const isVerified = listing.approvalStatus === 'APPROVED';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased pb-28 md:pb-32">
      {/* =========================================================
          A. COMPACT HEADER (Matches Reference Top Navbar)
      ========================================================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="mx-auto max-w-4xl px-4 py-2.5 flex items-center justify-between gap-3">
          {/* Back Navigation */}
          <button
            type="button"
            onClick={() => {
              if (window.history.length > 1) {
                router.back();
              } else {
                router.push(ROUTES.SEARCH);
              }
            }}
            aria-label="Back to listings"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          {/* Logo & Tagline */}
          <Link href={ROUTES.HOME} className="flex items-center gap-2 group cursor-pointer">
            <StudentPGLogo className="h-7 w-auto" />
          </Link>

          {/* Actions: Favorite & Share */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={toggleFavorite}
              aria-label={isFavorited ? 'Remove from favorites' : 'Save to favorites'}
              className="flex h-9 w-9 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
            >
              <Heart
                className={`h-5 w-5 transition-colors ${
                  isFavorited ? 'fill-rose-500 text-rose-500' : 'text-slate-700'
                }`}
              />
            </button>

            <button
              type="button"
              onClick={handleShare}
              aria-label="Share property"
              className="flex h-9 w-9 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 rounded-full bg-slate-900/90 px-4 py-2 text-xs font-semibold text-white shadow-xl backdrop-blur-sm animate-fade-in flex items-center gap-2">
          <CheckCheck className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =========================================================
          MAIN CONTAINER
      ========================================================== */}
      <main className="mx-auto max-w-4xl px-4 pt-4 sm:pt-6 space-y-6">
        {/* =========================================================
            B. MAIN PROPERTY IMAGE GALLERY (Modular Component)
        ========================================================== */}
        <PGImageGallery
          images={rawImages}
          pgName={listing.pgName}
          isVerified={isVerified}
          onOpenModal={() => setIsGalleryModalOpen(true)}
          activeIndex={activeImageIndex}
          onSelectIndex={(idx) => setActiveImageIndex(idx)}
        />

        {/* =========================================================
            C. PROPERTY INFORMATION
        ========================================================== */}
        <section className="space-y-3 bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
          {/* Property Name */}
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
              {listing.pgName}
            </h1>
          </div>

          {/* Location & Map Link Row */}
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500 font-medium">
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span className="truncate">
                {listing.address || listing.landmark || 'MP Nagar'}, {listing.city || 'Bhopal'}
              </span>
            </div>

            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#059669] hover:text-emerald-800 font-bold ml-1 transition-colors cursor-pointer"
            >
              <span>View on Map</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Pricing & Badges & Contact Owner Button */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-black text-[#059669] tracking-tight">
                  ₹{listing.rent.toLocaleString('en-IN')}
                </span>
                <span className="text-xs sm:text-sm font-medium text-slate-500">
                  / month
                </span>
              </div>

              {/* No Brokerage Badge */}
              <span className="rounded-md bg-emerald-50 border border-emerald-100 px-2.5 py-1 text-xs font-bold text-[#047857]">
                No Brokerage
              </span>
            </div>

            {/* Direct Contact Owner Button */}
            {hasWhatsApp ? (
              <a
                href={whatsAppLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#047857] hover:bg-[#065f46] px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Contact Owner</span>
              </a>
            ) : hasPhone ? (
              <a
                href={`tel:${contactNumber}`}
                className="inline-flex items-center gap-2 rounded-xl bg-[#047857] hover:bg-[#065f46] px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <Phone className="h-4 w-4" />
                <span>Contact Owner</span>
              </a>
            ) : null}
          </div>
        </section>

        {/* =========================================================
            D. AMENITIES GRID (5-Column arrangement)
        ========================================================== */}
        <section aria-label="Amenities">
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 sm:gap-3">
            {displayedAmenities.map((amenity) => {
              const Icon = amenity.icon;
              return (
                <div
                  key={amenity.label}
                  className="flex flex-col items-center justify-center text-center p-3 sm:p-3.5 rounded-2xl bg-white border border-slate-200/70 shadow-2xs gap-2 transition-all hover:border-slate-300"
                >
                  <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[11px] sm:text-xs font-semibold text-slate-700 leading-tight">
                    {amenity.label}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* =========================================================
            E. STUDENT-FOCUSED INFORMATION BANNER
        ========================================================== */}
        <section className="rounded-2xl sm:rounded-3xl bg-[#f0f9ff]/80 border border-sky-100 p-4 sm:p-5 flex items-center justify-between gap-3 sm:gap-4 shadow-2xs">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-blue-100/80 text-blue-600">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                Perfect for Students
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 font-normal leading-relaxed mt-0.5">
                Close to colleges, safe neighborhood, fully furnished and student-friendly.
              </p>
            </div>
          </div>

          {/* Truthful student badge preserving the visual green pill */}
          <div className="shrink-0 rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-2 text-center">
            <div className="text-xs sm:text-sm font-black text-emerald-800">
              👥 {listing.gender === 'FEMALE' ? 'Girls Only' : listing.gender === 'MALE' ? 'Boys Only' : 'Co-Living'}
            </div>
            <div className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">
              Student Stay
            </div>
          </div>
        </section>

        {/* =========================================================
            F. ABOUT THIS PG (Collapsible Description)
        ========================================================== */}
        <section className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-2.5">
          <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            About This PG
          </h2>
          <p
            className={`text-xs sm:text-sm leading-relaxed text-slate-600 font-normal transition-all ${
              !isDescriptionExpanded && isLongDescription ? 'line-clamp-3' : ''
            }`}
          >
            {descriptionText}
          </p>

          {isLongDescription && (
            <button
              type="button"
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#059669] hover:text-emerald-800 transition-colors pt-1 cursor-pointer"
            >
              <span>{isDescriptionExpanded ? 'Read Less' : 'Read More'}</span>
              {isDescriptionExpanded ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </button>
          )}
        </section>

        {/* =========================================================
            G. ROOM TYPES & PRICING (Modular Component)
        ========================================================== */}
        <PGRoomPricing
          rooms={roomTypesData}
          onInquire={() => {}}
          onViewAll={() => showToast('All available room options are displayed')}
          contactHref={hasWhatsApp ? whatsAppLink : hasPhone ? `tel:${contactNumber}` : '#'}
        />
      </main>

      {/* =========================================================
          H. FIXED BOTTOM CONTACT BAR (Modular Component)
      ========================================================== */}
      <PGFixedContactBar
        contactNumber={contactNumber}
        whatsappLink={whatsAppLink}
        hasPhone={hasPhone}
        hasWhatsApp={hasWhatsApp}
      />

      {/* =========================================================
          FULLSCREEN GALLERY LIGHTBOX MODAL
      ========================================================== */}
      {isGalleryModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in"
          onClick={() => setIsGalleryModalOpen(false)}
        >
          {/* Top Bar inside modal */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent text-white">
            <span className="text-sm font-bold">
              {activeImageIndex + 1} of {rawImages.length}
            </span>
            <button
              type="button"
              onClick={() => setIsGalleryModalOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors cursor-pointer"
              aria-label="Close photo gallery"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Left Arrow */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-3 sm:left-6 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/80 transition-all cursor-pointer"
            aria-label="Previous photo"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Main Full Image */}
          <div
            className="relative h-[75vh] w-[90vw] max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={rawImages[activeImageIndex]?.url || fallbackImages[0]}
              alt={`${listing.pgName} large photo ${activeImageIndex + 1}`}
              fill
              className="object-contain"
            />
          </div>

          {/* Right Arrow */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-3 sm:right-6 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/80 transition-all cursor-pointer"
            aria-label="Next photo"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </div>
  );
}
