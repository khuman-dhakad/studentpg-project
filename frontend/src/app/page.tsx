import type { Metadata } from 'next';
import { backendClient } from '@/api/backendClient';
import { BACKEND_ENDPOINTS } from '@/api/endpoints';
import type { PagedResponse } from '@/types/api.types';
import type { PG } from '@/types/pg.types';
import { MarketplaceHero } from '@/components/home/MarketplaceHero';
import { MarketplacePromoStrip } from '@/components/home/MarketplacePromoStrip';
import { LocalityIconGrid } from '@/components/home/LocalityIconGrid';
import { LiveFeaturedPGs } from '@/components/home/LiveFeaturedPGs';
import { OwnerPromoBanner } from '@/components/home/OwnerPromoBanner';
import { TrustAndHowItWorks } from '@/components/home/TrustAndHowItWorks';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'StudentPG — Find Verified PGs, Hostels & Student Rooms in Bhopal',
  description:
    'Search 50,000+ verified student accommodations in Bhopal. Zero brokerage, instant WhatsApp direct host connect, authentic photos, and transparent deposits in MP Nagar, Indrapuri, Kolar Road & MANIT.',
  openGraph: {
    title: 'StudentPG — Verified Student Accommodations in Bhopal',
    description:
      'Search verified student PGs and co-living stays in MP Nagar, Indrapuri, Kolar Road, and near MANIT. Zero brokerage and direct owner contact.',
    url: 'https://studentpg.in',
    siteName: 'StudentPG',
    type: 'website',
  },
  alternates: {
    canonical: 'https://studentpg.in',
  },
};

async function getFeaturedPgs(): Promise<PG[]> {
  try {
    const response = await backendClient.get<PagedResponse<PG>>(
      `${BACKEND_ENDPOINTS.STUDENT.PGS}?page=0&size=6&sortBy=rent&direction=asc`
    );
    return response.content ?? [];
  } catch (error) {
    console.error('Error fetching featured PGs from backend:', error);
    return [];
  }
}

export default async function HomePage() {
  const featuredPgs = await getFeaturedPgs();

  // Structured Data (JSON-LD) for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'StudentPG',
    url: 'https://studentpg.in',
    description: 'Find verified student accommodations and PGs in Bhopal.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://studentpg.in/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <main className="min-h-screen bg-white font-sans antialiased text-slate-900 pb-16 md:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Two-Part Search Hero */}
      <MarketplaceHero />

      {/* 2. Horizontal Feature & Promo Strip */}
      <MarketplacePromoStrip />

      {/* 3. High-Density Locality & Category Squircle Icon Grid */}
      <LocalityIconGrid />

      {/* 4. Live Featured PG Accommodations from Backend */}
      <LiveFeaturedPGs listings={featuredPgs} />

      {/* 5. High-Converting Property Owner Banner */}
      <OwnerPromoBanner />

      {/* 6. Trust Pillars & 4-Step Student Move-in Stepper */}
      <TrustAndHowItWorks />
    </main>
  );
}