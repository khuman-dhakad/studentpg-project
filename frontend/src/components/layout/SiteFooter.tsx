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
} from 'lucide-react';

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200/80 bg-white text-slate-600 antialiased">
      <div className="mx-auto max-w-7xl px-4 pt-8 pb-20 sm:px-6 md:py-8 lg:px-8">

        {/* Main Grid: Compact Responsive Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8 items-start">

          {/* Column 1: Brand & Compact Helpdesk */}
          <div className="lg:col-span-4 space-y-3">
            <div>
              <Link href="/" className="inline-block">
                <span className="text-base font-black tracking-tight text-slate-950 uppercase">
                  Student<span className="text-emerald-600">PG</span>
                </span>
              </Link>
              <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500 max-w-sm">
                Curated student accommodations across Bhopal with verified hosts and absolute zero brokerage.
              </p>
            </div>

            {/* Compact Helpdesk */}
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 space-y-1.5">
              <p className="text-[9px] font-extrabold uppercase tracking-widest text-emerald-700">
                Official Helpdesk
              </p>
              <div className="flex flex-col gap-1 text-[11px] font-medium text-slate-600">
                <a
                  href="mailto:studentpg.support@gmail.com"
                  className="inline-flex items-center gap-2 hover:text-emerald-700 transition-colors w-fit"
                >
                  <Mail size={12} className="text-emerald-600 shrink-0" />
                  <span className="truncate">studentpg.support@gmail.com</span>
                </a>
                <div className="inline-flex items-center gap-2 text-slate-600">
                  <Phone size={12} className="text-emerald-600 shrink-0" />
                  <div className="flex flex-wrap items-center gap-x-1.5">
                    <a href="tel:+918604325848" className="hover:text-emerald-700 transition-colors">
                      +91 86043 25848
                    </a>
                    <span className="text-slate-300">/</span>
                    <a href="tel:+917970134063" className="hover:text-emerald-700 transition-colors">
                      +91 79701 34063
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links: 2-Column Grid on Mobile, 2 distinct columns on Desktop */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:col-span-6 lg:gap-8">

            {/* Column 2: Explore Ecosystem */}
            <div>
              <p className="mb-2.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-900">
                Explore Ecosystem
              </p>
              <ul className="space-y-1.5 text-xs font-semibold text-slate-600">
                <li>
                  <Link
                    href={ROUTES.SEARCH}
                    className="group inline-flex items-center transition-colors hover:text-emerald-700 py-0.5"
                  >
                    <span className="mr-1.5 h-1 w-1 rounded-full bg-slate-300 transition-colors group-hover:bg-emerald-600 shrink-0" />
                    Find Your Stay
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="group inline-flex items-center transition-colors hover:text-emerald-700 py-0.5"
                  >
                    <span className="mr-1.5 h-1 w-1 rounded-full bg-slate-300 transition-colors group-hover:bg-emerald-600 shrink-0" />
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/how-it-works"
                    className="group inline-flex items-center transition-colors hover:text-emerald-700 py-0.5"
                  >
                    <span className="mr-1.5 h-1 w-1 rounded-full bg-slate-300 transition-colors group-hover:bg-emerald-600 shrink-0" />
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-owner"
                    className="group inline-flex items-center transition-colors hover:text-emerald-700 py-0.5"
                  >
                    <span className="mr-1.5 h-1 w-1 rounded-full bg-slate-300 transition-colors group-hover:bg-emerald-600 shrink-0" />
                    Terms of Owner
                  </Link>
                </li>
                <li>
                  <Link
                    href="/report-issue"
                    className="group inline-flex items-center gap-1.5 text-rose-600 transition-colors hover:text-rose-700 py-0.5 cursor-pointer"
                  >
                    <AlertTriangle size={12} className="shrink-0" />
                    Report an Issue
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Important & Support Links */}
            <div>
              <p className="mb-2.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-900">
                Important Links
              </p>
              <ul className="space-y-1.5 text-xs font-semibold text-slate-600">
                <li>
                  <Link
                    href="/privacy-policy"
                    className="group inline-flex items-center transition-colors hover:text-emerald-700 py-0.5"
                  >
                    <span className="mr-1.5 h-1 w-1 rounded-full bg-slate-300 transition-colors group-hover:bg-emerald-600 shrink-0" />
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="group inline-flex items-center transition-colors hover:text-emerald-700 py-0.5"
                  >
                    <span className="mr-1.5 h-1 w-1 rounded-full bg-slate-300 transition-colors group-hover:bg-emerald-600 shrink-0" />
                    Contact &amp; Help
                  </Link>
                </li>
                <li>
                  <Link
                    href={ROUTES.SUPPORT}
                    className="group inline-flex items-center transition-colors hover:text-emerald-700 py-0.5"
                  >
                    <span className="mr-1.5 h-1 w-1 rounded-full bg-slate-300 transition-colors group-hover:bg-emerald-600 shrink-0" />
                    Support Center
                  </Link>
                </li>
                <li>
                  <Link
                    href={ROUTES.OWNER.LOGIN}
                    className="group inline-flex items-center transition-colors hover:text-emerald-700 py-0.5"
                  >
                    <span className="mr-1.5 h-1 w-1 rounded-full bg-slate-300 transition-colors group-hover:bg-emerald-600 shrink-0" />
                    Owner Admin Portal
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 4: Social Channels */}
          <div className="lg:col-span-2 lg:text-right space-y-2">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-900">
              Connect Channels
            </p>
            <div className="flex items-center gap-2 lg:justify-end">
              {/* YouTube */}
              <a
                href="https://www.youtube.com/@studentpgdotin"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="StudentPG on YouTube"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 shadow-2xs transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                <Youtube size={15} />
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/studentpg.in/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="StudentPG on Instagram"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 shadow-2xs transition-all hover:border-pink-200 hover:bg-pink-50 hover:text-pink-600"
              >
                <Instagram size={15} />
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/profile.php?id=61591929654056"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="StudentPG on Facebook"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 shadow-2xs transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
              >
                <Facebook size={15} />
              </a>

              {/* Twitter / X */}
              <a
                href="https://x.com/studentpgdotin"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="StudentPG on Twitter"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 shadow-2xs transition-all hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900"
              >
                <Twitter size={14} />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Tagline */}
        <div className="mt-6 border-t border-slate-100 pt-4 md:mt-8 md:pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-medium text-slate-400">
          <p>© {currentYear} StudentPG. All rights reserved.</p>
          <p className="text-slate-400">Verified Student Living • Zero Brokerage</p>
        </div>

      </div>
    </footer>
  );
}