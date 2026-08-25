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
} from 'lucide-react';

import Gallery from '@/components/Gallery';

async function getListing(id: string) {
  try {
    return await backendClient.get<PG>(
      BACKEND_ENDPOINTS.STUDENT.BY_ID(id)
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

  const title = `${listing.pgName} in ${listing.city || 'India'}`;
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

  const title = listing.pgName || 'Student PG Listing';

  const description =
    listing.description ||
    'A comfortable and verified student accommodation option.';

  const location =
    [listing.city, listing.state].filter(Boolean).join(', ') ||
    'Location not provided';

  const rent =
    typeof listing.rent === 'number'
      ? `₹${listing.rent.toLocaleString('en-IN')} / month`
      : 'Rent not provided';

  const ownerName = listing.owner?.name || 'Property Owner';
  const ownerEmail = listing.owner?.email || '';
  const contactNumber = listing.owner?.phone || '';
  const whatsappContact = listing.owner?.whatsappNumber || contactNumber;

  const cleanWhatsAppNumber = (whatsappContact ?? '').replace(/\D/g, '');

  const whatsappNumber = cleanWhatsAppNumber.startsWith('91')
    ? cleanWhatsAppNumber
    : `91${cleanWhatsAppNumber}`;

  const amenities = [
    listing.wifiAvailable && {
      label: 'High-speed Wi-Fi',
      icon: Wifi,
    },
    listing.foodAvailable && {
      label: 'Meals included',
      icon: Utensils,
    },
    listing.parkingAvailable && {
      label: 'Parking available',
      icon: Car,
    },
    listing.laundryAvailable && {
      label: 'Laundry support',
      icon: WashingMachine,
    },
  ].filter(Boolean) as {
    label: string;
    icon: React.ElementType;
  }[];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: title,
    description: description,
    image: image,
    address: {
      '@type': 'PostalAddress',
      addressLocality: listing.city,
      addressRegion: listing.state,
      addressCountry: 'IN',
    },
    priceRange: typeof listing.rent === 'number' ? `₹${listing.rent}` : undefined,
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-6xl">

        {/* Back Button */}
        <Link
          href={ROUTES.SEARCH}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-brand"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to listings
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">

          {/* ================= IMAGE ================= */}
          <div className="overflow-hidden rounded-3xl border border-line bg-surface shadow-sm p-4">
            <Gallery images={(listing.images || []).map(i => ({ url: i.url || image }))} initialIndex={0} />
          </div>

          {/* ================= DETAILS ================= */}
          <div className="rounded-3xl border border-line bg-surface p-6 shadow-sm sm:p-8">

            {/* Badge */}
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-brand">
              <ShieldCheck className="h-5 w-5" />
              Verified Premium Listing
            </div>

            {/* Title */}
            <h1 className="mt-4 font-display text-3xl font-black leading-tight text-ink sm:text-4xl">
              {title}
            </h1>

            {/* Location */}
            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-ink-soft">
              <MapPin className="h-4 w-4 text-brand" />
              {location}
            </div>

            {/* Description */}
            <p className="mt-5 text-sm leading-7 text-ink-soft">
              {description}
            </p>

            {/* Location + Rent */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">

              <div className="rounded-2xl border border-line bg-cream p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft">
                  Location
                </p>

                <p className="mt-2 font-semibold text-ink">
                  {location}
                </p>
              </div>

              <div className="rounded-2xl border border-line bg-cream p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft">
                  Monthly Rent
                </p>

                <p className="mt-2 font-semibold text-ink">
                  {rent}
                </p>
              </div>

            </div>

            {/* ================= AMENITIES ================= */}
            <div className="mt-6 rounded-2xl border border-line bg-cream p-5">

              <h2 className="font-display text-xl font-bold text-ink">
                Included amenities
              </h2>

              {amenities.length > 0 ? (
                <div className="mt-4 grid grid-cols-2 gap-3">

                  {amenities.map((amenity) => {
                    const Icon = amenity.icon;

                    return (
                      <div
                        key={amenity.label}
                        className="flex items-center gap-2 rounded-xl border border-line bg-surface p-3"
                      >
                        <Icon className="h-4 w-4 text-brand" />

                        <span className="text-xs font-semibold text-ink">
                          {amenity.label}
                        </span>
                      </div>
                    );
                  })}

                </div>
              ) : (
                <p className="mt-3 text-sm text-ink-soft">
                  No amenities information available.
                </p>
              )}

            </div>

            {/* ================= OWNER INFO ================= */}
            <div className="mt-6 rounded-2xl border border-line bg-cream p-5">

              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10">
                  <UserRound className="h-6 w-6 text-brand" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft">
                    Listed by
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-ink">
                    {ownerName}
                  </h2>
                </div>

              </div>

              <div className="mt-5 space-y-3">

                {/* Owner Phone */}
                {contactNumber && (
                  <div className="flex items-center gap-3 text-sm text-ink-soft">
                    <Phone className="h-4 w-4 text-brand" />
                    <span>{contactNumber}</span>
                  </div>
                )}

                {/* Owner Email */}
                {ownerEmail && (
                  <div className="flex items-center gap-3 break-all text-sm text-ink-soft">
                    <Mail className="h-4 w-4 shrink-0 text-brand" />
                    <span>{ownerEmail}</span>
                  </div>
                )}

              </div>

            </div>

            {/* ================= CONTACT BUTTONS ================= */}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">

              {/* WhatsApp */}
              {whatsappContact ? (
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi ${ownerName}, I am interested in your PG listing: ${title}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#20bd5a] hover:shadow-lg"
                >
                  <MessageCircle className="h-5 w-5" />
                  WhatsApp
                </a>
              ) : (
                <button disabled className="flex items-center justify-center gap-2 rounded-xl bg-slate-200 px-4 py-3.5 text-sm font-bold text-slate-400 shadow-sm">
                  <MessageCircle className="h-5 w-5" />
                  WhatsApp
                </button>
              )}

              {/* Phone Call */}
              {contactNumber ? (
                <a
                  href={`tel:${contactNumber}`}
                  className="flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3.5 text-sm font-bold text-cream shadow-sm transition-all hover:-translate-y-0.5 hover:opacity-90 hover:shadow-lg"
                >
                  <Phone className="h-5 w-5" />
                  Call Owner
                </a>
              ) : (
                <button disabled className="flex items-center justify-center gap-2 rounded-xl bg-slate-200 px-4 py-3.5 text-sm font-bold text-slate-400 shadow-sm">
                  <Phone className="h-5 w-5" />
                  Call Owner
                </button>
              )}

              {/* Email */}
              {ownerEmail ? (
                <a
                  href={`mailto:${ownerEmail}?subject=${encodeURIComponent(`Inquiry about ${title}`)}`}
                  className="flex items-center justify-center gap-2 rounded-xl border border-line bg-surface px-4 py-3.5 text-sm font-bold text-ink shadow-sm transition-all hover:-translate-y-0.5 hover:bg-cream hover:shadow-lg"
                >
                  <Mail className="h-5 w-5" />
                  Email
                </a>
              ) : (
                <button disabled className="flex items-center justify-center gap-2 rounded-xl border border-line bg-surface px-4 py-3.5 text-sm font-bold text-slate-400 shadow-sm">
                  <Mail className="h-5 w-5" />
                  Email
                </button>
              )}

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}