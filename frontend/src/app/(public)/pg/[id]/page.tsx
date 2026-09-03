import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ROUTES } from '@/constants/routes';
import { backendClient } from '@/api/backendClient';
import { BACKEND_ENDPOINTS } from '@/api/endpoints';
import type { PG } from '@/types/pg.types';
import {
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  Wifi,
  Utensils,
  Car,
  WashingMachine,
  UserRound,
  ShieldCheck,
  ArrowLeft,
  Snowflake,
  BatteryCharging,
  BedDouble,
  Clock,
  Banknote,
  Users,
} from 'lucide-react';

import Gallery from '@/components/Gallery';
import { OwnerVerificationBadge } from '@/components/owner/OwnerVerificationBadge';

async function getListing(id: string) {
  try {
    return await backendClient.get<PG>(
      BACKEND_ENDPOINTS.STUDENT.BY_ID(id),
      { next: { revalidate: 60, tags: [`public-pg-${id}`] } }
    );
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const listing = await getListing(id);
  if (!listing) {
    return {
      title: 'Accommodation Not Found',
    };
  }

  const title = `${listing.pgName} in ${listing.city || 'Bhopal'}`;
  const description = listing.description || `Verified student accommodation in ${listing.city} starting from ₹${listing.rent || 0}/month.`;
  const image = listing.images?.[0]?.url;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [{ url: image }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : [],
    },
  };
}

export default async function PgDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await getListing(id);

  if (!listing) notFound();

  const image =
    listing.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80';

  const title = listing.pgName || 'Student PG Accommodation';

  const description =
    listing.description ||
    'Comfortable, fully furnished and verified student accommodation in prime educational hub.';

  const location =
    [listing.address, listing.landmark, listing.city, listing.state]
      .filter(Boolean)
      .join(', ') || 'Bhopal, Madhya Pradesh';

  const rent =
    typeof listing.rent === 'number'
      ? `₹${listing.rent.toLocaleString('en-IN')}`
      : 'Contact for rent';

  const ownerName = listing.owner?.name || 'Property Host';
  const ownerEmail = listing.owner?.email || '';
  const contactNumber = listing.owner?.phone || '';
  const whatsappContact = listing.owner?.whatsappNumber || contactNumber;

  const cleanWhatsAppNumber = (whatsappContact ?? '').replace(/\D/g, '');
  const whatsappNumber = cleanWhatsAppNumber.startsWith('91')
    ? cleanWhatsAppNumber
    : `91${cleanWhatsAppNumber}`;

  const amenities = [
    {
      label: 'High-speed Wi-Fi',
      available: listing.wifiAvailable,
      icon: Wifi,
    },
    {
      label: 'Meals / Food Included',
      available: listing.foodAvailable,
      icon: Utensils,
    },
    {
      label: 'Air Conditioner (AC)',
      available: listing.acAvailable,
      icon: Snowflake,
    },
    {
      label: '24x7 Power Backup',
      available: listing.powerBackup,
      icon: BatteryCharging,
    },
    {
      label: 'Reserved Parking',
      available: listing.parkingAvailable,
      icon: Car,
    },
    {
      label: 'Laundry Service',
      available: listing.laundryAvailable,
      icon: WashingMachine,
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: title,
    description: description,
    image: image,
    address: {
      '@type': 'PostalAddress',
      streetAddress: listing.address,
      addressLocality: listing.city,
      addressRegion: listing.state,
      postalCode: listing.pincode,
      addressCountry: 'IN',
    },
    priceRange: typeof listing.rent === 'number' ? `₹${listing.rent}` : undefined,
  };

  const isOwnerVerified = Boolean(
    listing.owner &&
      ('verified' in listing.owner
        ? listing.owner.verified
        : (listing.owner as { verificationStatus?: string }).verificationStatus === 'VERIFIED')
  );

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8 pb-28 md:pb-16 text-slate-900 antialiased">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-6xl">
        {/* Breadcrumb / Back Button */}
        <Link
          href={ROUTES.SEARCH}
          className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 transition-colors hover:text-emerald-700 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Search Listings</span>
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-start">
          {/* ================= LEFT: MEDIA & DESCRIPTION ================= */}
          <div className="space-y-6">
            {/* Gallery Card */}
            <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xs p-4">
              <Gallery
                images={(listing.images || []).map((i) => ({
                  url: i.url || image,
                }))}
                initialIndex={0}
              />
            </div>

            {/* Description & Overview */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs sm:p-8">
              <h2 className="text-base font-black uppercase tracking-wider text-slate-900">
                About This Property
              </h2>
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-600 font-normal">
                {description}
              </p>

              {/* Full Address details */}
              <div className="mt-6 rounded-2xl bg-slate-50/70 p-4 border border-slate-200/80">
                <div className="flex items-start gap-2.5">
                  <MapPin className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wide text-slate-900">
                      Location &amp; Landmark
                    </h3>
                    <p className="mt-1 text-xs text-slate-600 font-medium">
                      {location}
                    </p>
                    {listing.pincode && (
                      <p className="mt-0.5 text-[11px] font-bold text-emerald-700">
                        PIN: {listing.pincode}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities Matrix */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs sm:p-8">
              <h2 className="text-base font-black uppercase tracking-wider text-slate-900">
                Amenities &amp; Facilities
              </h2>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {amenities.map((amenity) => {
                  const Icon = amenity.icon;
                  const isAvailable = Boolean(amenity.available);

                  return (
                    <div
                      key={amenity.label}
                      className={`flex items-center gap-2.5 rounded-2xl border p-3.5 transition-all ${
                        isAvailable
                          ? 'border-emerald-600/30 bg-emerald-50/60 text-slate-900'
                          : 'border-slate-200 bg-slate-50/60 text-slate-400 opacity-60'
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 shrink-0 ${
                          isAvailable ? 'text-emerald-600' : 'text-slate-400'
                        }`}
                      />
                      <span className="text-[11px] font-bold tracking-tight">
                        {amenity.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ================= RIGHT: PRICING, SPECS & HOST CARD ================= */}
          <div className="space-y-6 lg:sticky lg:top-24">
            {/* Main Header & Pricing Card */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs sm:p-8">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-emerald-700">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  Verified Listing
                </span>
                {isOwnerVerified && (
                  <OwnerVerificationBadge compact />
                )}
              </div>

              <h1 className="mt-4 text-2xl sm:text-3xl font-black leading-tight tracking-tight text-slate-900">
                {title}
              </h1>

              <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                <span>{listing.city || 'Bhopal'}, {listing.state || 'Madhya Pradesh'}</span>
              </div>

              {/* Price Display */}
              <div className="mt-6 flex items-baseline gap-2 border-t border-slate-100 pt-4">
                <span className="text-3xl sm:text-4xl font-black tracking-tight text-emerald-700">
                  {rent}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  / month
                </span>
              </div>

              {/* Key Specs Matrix */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    <Users className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Category</span>
                  </div>
                  <p className="mt-1 text-xs font-black text-slate-900">
                    {listing.category || listing.gender || 'Student Accommodation'}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    <BedDouble className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Room Type</span>
                  </div>
                  <p className="mt-1 text-xs font-black text-slate-900">
                    {listing.roomType || 'Standard Room'}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    <Banknote className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Deposit</span>
                  </div>
                  <p className="mt-1 text-xs font-black text-slate-900">
                    {typeof listing.securityDeposit === 'number'
                      ? `₹${listing.securityDeposit.toLocaleString('en-IN')}`
                      : 'Zero / Refundable'}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    <Clock className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Notice Period</span>
                  </div>
                  <p className="mt-1 text-xs font-black text-slate-900">
                    {listing.noticePeriod ? `${listing.noticePeriod} Days` : '30 Days'}
                  </p>
                </div>
              </div>
            </div>

            {/* Host Profile & Contact Card */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs sm:p-8">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <UserRound className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                    Property Host
                  </div>
                  <h3 className="text-base font-black text-slate-900">
                    {ownerName}
                  </h3>
                  {isOwnerVerified && (
                    <div className="mt-1"><OwnerVerificationBadge compact /></div>
                  )}
                </div>
              </div>

              {/* Verified Contact Details */}
              <div className="mt-5 space-y-2.5 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-600">
                {contactNumber && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-emerald-600" />
                    <span><span className="font-bold text-slate-900">Phone:</span> {contactNumber}</span>
                  </div>
                )}
                {whatsappContact && (
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
                    <span><span className="font-bold text-slate-900">WhatsApp:</span> {whatsappContact}</span>
                  </div>
                )}
                {ownerEmail && (
                  <div className="flex items-center gap-2 break-all">
                    <Mail className="h-3.5 w-3.5 text-emerald-600" />
                    <span><span className="font-bold text-slate-900">Email:</span> {ownerEmail}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col gap-2.5">
                {whatsappContact ? (
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                      `Hi ${ownerName}, I found your listing "${title}" on StudentPG Bhopal and would like to inquire about room availability.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] px-5 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-xs transition-all active:scale-95 cursor-pointer"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Chat on WhatsApp</span>
                  </a>
                ) : (
                  <button
                    disabled
                    className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-5 py-3.5 text-xs font-bold text-slate-400"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>WhatsApp Unavailable</span>
                  </button>
                )}

                {contactNumber && (
                  <a
                    href={`tel:${contactNumber}`}
                    className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-xs transition-all active:scale-95 cursor-pointer"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Call Property Host</span>
                  </a>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ================= STICKY MOBILE CONVERSION BAR ================= */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/80 bg-white/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl shadow-2xl md:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Monthly Rent
            </div>
            <div className="text-base font-black text-emerald-700">
              {rent}
            </div>
          </div>

          <div className="flex gap-2">
            {whatsappContact && (
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                  `Hi ${ownerName}, I am interested in your PG listing "${title}" on StudentPG.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-xl bg-[#25D366] px-4 py-2.5 text-xs font-black text-white shadow-xs cursor-pointer"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp</span>
              </a>
            )}

            {contactNumber && (
              <a
                href={`tel:${contactNumber}`}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-black text-white shadow-xs cursor-pointer"
              >
                <Phone className="h-4 w-4" />
                <span>Call Host</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}