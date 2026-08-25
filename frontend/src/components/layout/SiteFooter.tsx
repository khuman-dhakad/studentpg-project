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
    <footer className="border-t border-slate-200/80 bg-white text-slate-600">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">

        {/* Main Grid Structure */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_2fr_1fr] md:gap-10 lg:gap-16">

          {/* Column 1: Brand Ecosystem & Direct Support */}
          <div className="flex flex-col gap-6">

            <div>
              <p className="text-lg font-black tracking-tight text-slate-950 uppercase">
                Student<span className="text-emerald-600">PG</span>
              </p>

              <p className="mt-2 max-w-sm text-xs font-medium leading-6 text-slate-500">
                © {currentYear} Curated student ecosystems with verified property listings and absolute zero brokerage.
              </p>
            </div>

            {/* Support Core Info */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4">

              <p className="mb-4 text-[10px] font-extrabold uppercase tracking-[0.18em] text-emerald-600">
                Official Helpdesk
              </p>

              <div className="flex flex-col gap-4">

                <a
                  href="mailto:studentpg.support@gmail.com"
                  className="group flex w-fit items-center gap-2.5 text-xs font-semibold text-slate-700 transition-colors hover:text-emerald-600"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-slate-400 shadow-sm transition-colors group-hover:text-emerald-600">
                    <Mail size={14} />
                  </span>

                  <span>studentpg.support@gmail.com</span>
                </a>

                <div className="flex flex-col gap-3 border-l-2 border-emerald-100 pl-4">

                  <a
                    href="tel:+918604325848"
                    className="group flex w-fit items-center gap-2.5 text-xs font-semibold text-slate-700 transition-colors hover:text-emerald-600"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-slate-400 shadow-sm transition-colors group-hover:text-emerald-600">
                      <Phone size={12} />
                    </span>

                    <span>+91 86043 25848</span>
                  </a>

                  <a
                    href="tel:+917970134063"
                    className="group flex w-fit items-center gap-2.5 text-xs font-semibold text-slate-700 transition-colors hover:text-emerald-600"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-slate-400 shadow-sm transition-colors group-hover:text-emerald-600">
                      <Phone size={12} />
                    </span>

                    <span>+91 79701 34063</span>
                  </a>

                </div>
              </div>
            </div>
          </div>


          {/* Column 2: Quick Traversal Links */}
          <div className="flex flex-col">

            <div className="w-full">

              <p className="mb-5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-950">
                Explore Ecosystem
              </p>

              {/* 3 Column Links */}
              <div className="grid grid-cols-1 gap-x-8 gap-y-3 text-xs font-bold text-slate-500 sm:grid-cols-2 lg:grid-cols-3">

                <Link
                  href={ROUTES.SEARCH}
                  className="group flex items-center transition-all hover:translate-x-1 hover:text-emerald-600"
                >
                  <span className="mr-2 h-1 w-1 rounded-full bg-slate-300 transition-colors group-hover:bg-emerald-600" />
                  Find Your Stay
                </Link>

                <Link
                  href="/about"
                  className="group flex items-center transition-all hover:translate-x-1 hover:text-emerald-600"
                >
                  <span className="mr-2 h-1 w-1 rounded-full bg-slate-300 transition-colors group-hover:bg-emerald-600" />
                  About Us
                </Link>

                <Link
                  href="/privacy-policy"
                  className="group flex items-center transition-all hover:translate-x-1 hover:text-emerald-600"
                >
                  <span className="mr-2 h-1 w-1 rounded-full bg-slate-300 transition-colors group-hover:bg-emerald-600" />
                  Privacy Policy
                </Link>

                <Link
                  href="/terms-of-owner"
                  className="group flex items-center transition-all hover:translate-x-1 hover:text-emerald-600"
                >
                  <span className="mr-2 h-1 w-1 rounded-full bg-slate-300 transition-colors group-hover:bg-emerald-600" />
                  Terms of Owner
                </Link>

                {/* Report an Issue Link */}
                <Link
                  href="/report-issue"
                  className="group flex items-center gap-2 text-pink-600 transition-all hover:translate-x-1 hover:text-pink-700"
                >
                  <AlertTriangle
                    size={13}
                    className="transition-transform group-hover:rotate-6"
                  />

                  <span>Report an Issue</span>
                </Link>

                <Link
                  href="/contact"
                  className="group flex items-center transition-all hover:translate-x-1 hover:text-emerald-600"
                >
                  <span className="mr-2 h-1 w-1 rounded-full bg-slate-300 transition-colors group-hover:bg-emerald-600" />
                  Contact Us & Help
                </Link>

                <Link
                  href="/how-it-works"
                  className="group flex items-center transition-all hover:translate-x-1 hover:text-emerald-600"
                >
                  <span className="mr-2 h-1 w-1 rounded-full bg-slate-300 transition-colors group-hover:bg-emerald-600" />
                  how-it-works
                </Link>

                <Link
                  href={ROUTES.SUPPORT}
                  className="group flex items-center transition-all hover:translate-x-1 hover:text-emerald-600"
                >
                  <span className="mr-2 h-1 w-1 rounded-full bg-slate-300 transition-colors group-hover:bg-emerald-600" />
                  Support Center
                </Link>

                <Link
                  href={ROUTES.OWNER.LOGIN}
                  className="group flex items-center transition-all hover:translate-x-1 hover:text-emerald-600"
                >
                  <span className="mr-2 h-1 w-1 rounded-full bg-slate-300 transition-colors group-hover:bg-emerald-600" />
                  Owner Admin Portal
                </Link>

              </div>
            </div>
          </div>


          {/* Column 3: Handles & Social Channels */}
          <div className="flex flex-col md:items-end">

            <div className="flex flex-col gap-5">

              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-950 md:text-right">
                Connect Channels
              </p>

              <div className="flex items-center gap-3">

                {/* YouTube */}
                <a
                  href="https://www.youtube.com/@studentpgdotin"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-red-200 hover:bg-red-50 hover:text-red-600 hover:shadow-md"
                  title="YouTube"
                >
                  <Youtube size={18} />
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/studentpg.in/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-pink-200 hover:bg-pink-50 hover:text-pink-600 hover:shadow-md"
                  title="Instagram"
                >
                  <Instagram size={18} />
                </a>

                {/* Facebook */}
                <a
                  href="https://www.facebook.com/profile.php?id=61591929654056"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md"
                  title="Facebook"
                >
                  <Facebook size={18} />
                </a>

                {/* Twitter / X */}
                <a
                  href="https://x.com/studentpgdotin"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900 hover:shadow-md"
                  title="Twitter / X"
                >
                  <Twitter size={16} />
                </a>

              </div>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}