import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { backendClient } from '@/api/backendClient';
import { BACKEND_ENDPOINTS } from '@/api/endpoints';
import type { PG } from '@/types/pg.types';
import { PGDetailsView } from '@/components/pg/PGDetailsView';

async function getListing(id: string): Promise<PG | null> {
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
      title: 'Accommodation Not Found | StudentPG',
      description: 'The requested student accommodation could not be found.',
    };
  }

  const title = `${listing.pgName} in ${listing.city || 'Bhopal'} | StudentPG`;
  const description =
    listing.description ||
    `Verified student accommodation in ${listing.city || 'Bhopal'} starting from ₹${listing.rent || 0}/month. Zero brokerage, 100% verified.`;
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

  if (!listing) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: listing.pgName,
    description: listing.description || 'Verified student accommodation in Bhopal',
    image: listing.images?.[0]?.url,
    address: {
      '@type': 'PostalAddress',
      streetAddress: listing.address || '',
      addressLocality: listing.city || 'Bhopal',
      addressRegion: listing.state || 'Madhya Pradesh',
      postalCode: listing.pincode || '',
      addressCountry: 'IN',
    },
    priceRange: typeof listing.rent === 'number' ? `₹${listing.rent}` : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PGDetailsView listing={listing} />
    </>
  );
}