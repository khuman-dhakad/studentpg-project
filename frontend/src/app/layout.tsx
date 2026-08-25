import React from 'react';
import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { StoreProvider } from '@/store/StoreProvider';
import { ThemeProvider } from '@/context/ThemeProvider';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',  
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'Premium Paying Guest Network | StudentPG',
  description: 'Discover premium, verified student and working professional accommodations across top educational hubs instantly.',
  metadataBase: new URL('https://studentpg.example.com'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakartaSans.variable}`} suppressHydrationWarning>
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