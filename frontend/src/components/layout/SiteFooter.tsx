import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import {
  Mail,
  Phone,
  Youtube,
  Instagram,
  Facebook,
  Twitter,
  AlertTriangle,
  ChevronDown,
} from 'lucide-react';
import { StudentPGLogo } from '@/components/common/StudentPGLogo';

interface FooterSection {
  id: string;
  title: string;
  links: {
    label: string;
    href: string;
    isDestructive?: boolean;
  }[];
}

const footerSections: FooterSection[] = [
  {
    id: 'explore',
    title: 'Explore StudentPG',
    links: [
      { label: 'Find a PG', href: ROUTES.SEARCH },
      { label: 'Popular Areas', href: '/search' },
      { label: 'Browse All PGs', href: '/search' },
      { label: 'Boys PGs & Hostels', href: '/search?category=BOYS' },
      { label: 'Girls PGs & Hostels', href: '/search?category=GIRLS' },
      { label: 'Single Private Rooms', href: '/search?roomType=Single' },
      { label: 'Double / Triple Sharing', href: '/search?roomType=Double' },
    ],
  },
  {
    id: 'important',
    title: 'Important Links',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'How It Works', href: '/how-it-works' },
      { label: 'Contact & Help', href: '/contact' },
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Owner', href: '/terms-of-owner' },
      { label: 'Report an Issue', href: '/report-issue', isDestructive: true },
    ],
  },
  {
    id: 'support',
    title: 'Support',
    links: [
      { label: 'Help Center', href: ROUTES.SUPPORT },
      { label: 'Safety & Trust', href: ROUTES.SUPPORT },
      { label: 'Verification Process', href: '/how-it-works' },
      { label: 'No Brokerage Policy', href: '/about' },
      { label: 'FAQs', href: ROUTES.SUPPORT },
    ],
  },
  {
    id: 'owners',
    title: 'For PG Owners',
    links: [
      { label: 'List Your PG', href: ROUTES.OWNER.REGISTER },
      { label: 'Owner Login', href: ROUTES.OWNER.LOGIN },
      { label: 'Owner Support', href: ROUTES.SUPPORT },
      { label: 'Owner Guidelines', href: '/terms-of-owner' },
    ],
  },
];

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200/80 bg-white text-slate-600 antialiased">
      <div className="mx-auto max-w-7xl px-4 pt-8 pb-24 sm:px-6 md:py-10 lg:px-8">

        {/* Main Grid: Desktop & Tablet Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-8 items-start">

          {/* Left Column: Brand, Tagline & Official Helpdesk */}
          <div className="lg:col-span-4 space-y-4">
            <div>
              <Link href="/" className="inline-block cursor-pointer">
                <StudentPGLogo className="h-9" />
              </Link>
              <p className="mt-2 text-xs font-medium leading-relaxed text-slate-500 max-w-sm">
                Curated student accommodations across Bhopal with verified hosts and absolute zero brokerage.
              </p>
            </div>

            {/* Official Helpdesk Card */}
            <div className="rounded-xl border border-slate-200/90 bg-slate-50/80 p-3.5 space-y-2">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#047857]">
                Official Helpdesk
              </p>
              <div className="flex flex-col gap-1.5 text-xs font-medium text-slate-600">
                <a
                  href="mailto:studentpg.support@gmail.com"
                  className="inline-flex items-center gap-2 hover:text-[#047857] transition-colors w-fit"
                >
                  <Mail size={13} className="text-[#059669] shrink-0" />
                  <span className="truncate">studentpg.support@gmail.com</span>
                </a>
                <div className="inline-flex items-center gap-2 text-slate-600">
                  <Phone size={13} className="text-[#059669] shrink-0" />
                  <div className="flex flex-wrap items-center gap-x-1.5">
                    <a href="tel:+918604325848" className="hover:text-[#047857] transition-colors">
                      +91 86043 25848
                    </a>
                    <span className="text-slate-300">/</span>
                    <a href="tel:+917970134063" className="hover:text-[#047857] transition-colors">
                      +91 79701 34063
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Channels */}
            <div className="space-y-2 pt-1">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-900">
                Connect Channels
              </p>
              <div className="flex items-center gap-2">
                {/* YouTube */}
                <a
                  href="https://www.youtube.com/@studentpgdotin"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="StudentPG on YouTube"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 shadow-2xs transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                >
                  <Youtube size={15} />
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/studentpg.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="StudentPG on Instagram"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 shadow-2xs transition-all hover:border-pink-200 hover:bg-pink-50 hover:text-pink-600 cursor-pointer"
                >
                  <Instagram size={15} />
                </a>

                {/* Facebook */}
                <a
                  href="https://www.facebook.com/profile.php?id=61591929654056"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="StudentPG on Facebook"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 shadow-2xs transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 cursor-pointer"
                >
                  <Facebook size={15} />
                </a>

                {/* Twitter / X */}
                <a
                  href="https://x.com/studentpgdotin"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="StudentPG on Twitter"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 shadow-2xs transition-all hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
                >
                  <Twitter size={14} />
                </a>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links: 4 Categorized Columns (Visible on md and up) */}
          <div className="hidden md:grid md:grid-cols-4 md:col-span-8 gap-6 lg:gap-6">
            {footerSections.map((section) => (
              <div key={section.id}>
                <p className="mb-3 text-[11px] font-extrabold uppercase tracking-widest text-slate-900">
                  {section.title}
                </p>
                <ul className="space-y-2 text-xs font-semibold text-slate-600">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className={`group inline-flex items-center transition-colors py-0.5 cursor-pointer ${
                          link.isDestructive
                            ? 'text-rose-600 hover:text-rose-700'
                            : 'hover:text-[#047857]'
                        }`}
                      >
                        {link.isDestructive ? (
                          <AlertTriangle size={12} className="mr-1.5 shrink-0" />
                        ) : (
                          <span className="mr-1.5 h-1 w-1 rounded-full bg-slate-300 transition-colors group-hover:bg-[#059669] shrink-0" />
                        )}
                        <span>{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Mobile Native Accordion Navigation (Visible on mobile only < md) */}
          <div className="block md:hidden border-t border-slate-100 pt-3 divide-y divide-slate-100">
            {footerSections.map((section) => (
              <details key={section.id} className="group py-2.5">
                <summary className="flex w-full items-center justify-between py-1 text-left text-xs font-extrabold uppercase tracking-wider text-slate-900 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <span>{section.title}</span>
                  <ChevronDown
                    size={16}
                    className="text-slate-400 transition-transform duration-200 group-open:rotate-180 group-open:text-[#047857]"
                  />
                </summary>

                <ul className="mt-2 space-y-2 pl-1 pb-1 text-xs font-semibold text-slate-600">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className={`group inline-flex items-center transition-colors py-0.5 cursor-pointer ${
                          link.isDestructive
                            ? 'text-rose-600 hover:text-rose-700'
                            : 'hover:text-[#047857]'
                        }`}
                      >
                        {link.isDestructive ? (
                          <AlertTriangle size={12} className="mr-1.5 shrink-0" />
                        ) : (
                          <span className="mr-1.5 h-1 w-1 rounded-full bg-slate-300 transition-colors group-hover:bg-[#059669] shrink-0" />
                        )}
                        <span>{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>

        </div>

        {/* Bottom Bar: Copyright & Tagline */}
        <div className="mt-8 border-t border-slate-100 pt-5 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-[11px] font-medium text-slate-400">
          <p>© {currentYear} StudentPG. All rights reserved.</p>
          <p className="text-slate-400">Verified Student Living • Zero Brokerage</p>
        </div>

      </div>
    </footer>
  );
}