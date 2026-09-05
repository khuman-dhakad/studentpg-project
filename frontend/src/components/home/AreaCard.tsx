import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import type { PopularArea } from '@/data/popularAreas';

interface AreaCardProps {
  area: PopularArea;
  priority?: boolean;
  className?: string;
}

export function AreaCard({ area, priority = false, className = '' }: AreaCardProps) {
  return (
    <Link
      href={area.href}
      className={`group relative block h-28 sm:h-36 rounded-2xl overflow-hidden shadow-xs border border-slate-100 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer ${className}`}
      aria-label={`Explore student PGs in ${area.name}`}
    >
      {/* Locality Photo */}
      <Image
        src={area.image}
        alt={area.name}
        fill
        sizes="(max-width: 640px) 160px, (max-width: 1024px) 33vw, 25vw"
        priority={priority}
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Dark Gradient Overlay for Strong Legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

      {/* Bottom Content: Name & Right Chevron Pill */}
      <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-3 flex items-end justify-between gap-1.5">
        <span className="text-xs sm:text-sm font-black text-white leading-tight tracking-tight line-clamp-2 drop-shadow-xs">
          {area.name}
        </span>
        <div className="flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-full bg-white/25 backdrop-blur-xs text-white group-hover:bg-white group-hover:text-slate-900 transition-colors">
          <ChevronRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        </div>
      </div>
    </Link>
  );
}
