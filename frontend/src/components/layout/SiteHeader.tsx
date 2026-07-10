'use client'; 
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // <--- YE IMPORT MISSING THA
import { ROUTES } from '@/constants/routes';

const navLinks = [
  { href: ROUTES.SEARCH, label: 'Find PG' },
  { href: ROUTES.SUPPORT, label: 'Support' },
  { href: ROUTES.OWNER.LOGIN, label: 'Owner Login' },
];

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-cream/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-3 sm:px-6 lg:px-8">
        {/* Logo Section */}
        {/* Logo Section */}
<Link href="/" className="flex items-center gap-1.5"> {/* gap kam kiya */}
  <div className="relative w-8 h-8 overflow-hidden rounded-full border border-gray-200">
    <Image 
      src="/Pglogo.jpeg" 
      alt="Logo" 
      fill 
      className="object-cover"
      priority
    />
  </div>
  {/* Yahan changes kiye: hidden hataya aur size chhota kiya */}
  <span className="text-xs font-bold text-ink whitespace-nowrap">
    StudentPG
  </span>
</Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-semibold text-ink-soft hover:text-brand transition">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Buttons and Mobile Toggle */}
        <div className="flex items-center gap-3">
          <Link href={ROUTES.OWNER.REGISTER} className="hidden sm:inline-flex h-10 items-center rounded-full bg-brand px-4 text-sm font-semibold text-white shadow-sm hover:bg-brand-dark transition">
            List PG
          </Link>
          
          {/* Mobile Hamburger Button */}
          <button className="md:hidden p-2 text-ink-soft" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-line p-4 flex flex-col gap-4 animate-in slide-in-from-top">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-base font-semibold text-ink-soft" onClick={() => setIsOpen(false)}>
              {link.label}
            </Link>
          ))}
          <Link href={ROUTES.OWNER.REGISTER} className="bg-brand text-white text-center py-2 rounded-full font-semibold">
            List PG
          </Link>
        </div>
      )}
    </header>
  );
}