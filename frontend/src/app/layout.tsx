import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { StoreProvider } from '@/store/StoreProvider';
import { ThemeProvider } from '@/context/ThemeProvider';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  preload: true,
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://studentpg.in';

export const viewport: Viewport = {
  themeColor: '#059669',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: 'StudentPG | Premium Student Accommodations & Hostels',
    template: '%s | StudentPG',
  },
  description: 'Discover premium, verified student and working professional accommodations across top educational hubs instantly.',
  metadataBase: new URL(siteUrl),
  icons: {
    icon: '/favicon.svg',
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'StudentPG | Premium Student Accommodations & Hostels',
    description: 'Find verified PGs and hostels near universities with high-speed Wi-Fi, food, laundry, and security.',
    url: siteUrl,
    siteName: 'StudentPG',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StudentPG | Premium Student Accommodations',
    description: 'Find verified PGs and hostels near universities.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'StudentPG',
  url: siteUrl,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${siteUrl}/search?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakartaSans.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-cream text-ink antialiased transition-colors duration-200">
        <StoreProvider>
          <ThemeProvider>
            <div className="flex min-h-screen flex-col overflow-x-hidden">
              <SiteHeader />
              <div className="flex-1">{children}</div>
              <SiteFooter />
            </div>
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}