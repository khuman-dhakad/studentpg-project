import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
// Icons ke liye (agar lucide-react nahi hai toh install kar lena: npm i lucide-react)
import { Mail, Phone, X, Youtube, Instagram, Facebook  } from 'lucide-react';

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-surface/80">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Main Grid Content */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          
          {/* Section 1: Brand & Contact Info */}
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-lg font-bold text-ink tracking-tight">StudentPG</p>
              <p className="mt-1 text-sm text-ink-soft">
                © {currentYear} Curated student living with zero brokerage.
              </p>
            </div>

            {/* Support Details */}
            <div className="flex flex-col gap-2.5 text-sm text-ink-soft">
              <p className="font-semibold text-ink text-xs uppercase tracking-wider">Official Support</p>
              
              <a href="mailto:studentpg.support@gmail.com" className="flex items-center gap-2 hover:text-brand transition-colors w-fit">
                <Mail size={16} />
                <span>studentpg.support@gmail.com</span>
              </a>

              <div className="flex flex-col gap-1.5 border-l border-line pl-3 mt-1">
                {/* Number 1 */}
                <div className="flex items-center gap-3">
                  <a href="tel:+918604325848" className="flex items-center gap-1.5 hover:text-brand transition-colors" title="Call Us">
                    <Phone size={14} />
                    <span>+91 86043 25848</span>
                  </a>
                  
                </div>

                {/* Number 2 */}
                <div className="flex items-center gap-3">
                  <a href="tel:+917970134063" className="flex items-center gap-1.5 hover:text-brand transition-colors" title="Call Us">
                    <Phone size={14} />
                    <span>+91 79701 34063</span>
                  </a>
                  
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Quick Links */}
          <div className="flex flex-col md:items-center">
            <div className="flex flex-col gap-3">
              <p className="font-semibold text-ink text-xs uppercase tracking-wider">Explore</p>
              <div className="flex flex-col gap-2 text-sm text-ink-soft">
                <Link href={ROUTES.SEARCH} className="hover:text-brand transition-colors">Find PG</Link>
                <Link href={ROUTES.SUPPORT} className="hover:text-brand transition-colors">Support Center</Link>
                <Link href={ROUTES.OWNER.LOGIN} className="hover:text-brand transition-colors">Owner Portal</Link>
              </div>
            </div>
          </div>

          {/* Section 3: Social Media Links */}
          <div className="flex flex-col md:items-end">
            <div className="flex flex-col gap-3">
              <p className="font-semibold text-ink text-xs uppercase tracking-wider md:text-right">Connect With Us</p>
              <div className="flex items-center gap-4">
                {/* YouTube */}
                <a href="https://www.youtube.com/@studentpgdotin" target="_blank" rel="noreferrer" className="p-2 bg-line/40 rounded-full text-ink-soft hover:text-red-500 hover:bg-red-50 transition-all" title="YouTube">
                  <Youtube size={20} />
                </a>
                
                {/* Instagram */}
                <a href="https://www.instagram.com/studentpg.in/" target="_blank" rel="noreferrer" className="p-2 bg-line/40 rounded-full text-ink-soft hover:text-pink-600 hover:bg-pink-50 transition-all" title="Instagram">
                  <Instagram size={20} />
                </a>

                {/* Facebook */}
                <a href="https://www.facebook.com/profile.php?id=61591929654056" target="_blank" rel="noreferrer" className="p-2 bg-line/40 rounded-full text-ink-soft hover:text-blue-600 hover:bg-blue-50 transition-all" title="Facebook">
                  <Facebook size={20} />
                </a>

                {/* WhatsApp Quick Link */}
                <a href="https://x.com/studentpgdotin" target="_blank" rel="noreferrer" className="p-2 bg-line/40 rounded-full text-ink-soft hover:text-emerald-600 hover:bg-emerald-50 transition-all" title="X">
                  <X size={20} />
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}