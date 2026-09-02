'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Wifi, Utensils, Edit3, Trash2, MapPin, Building2 } from 'lucide-react';
import { useState } from 'react';
import { ROUTES } from '@/constants/routes';
import type { PG } from '@/types/pg.types';

interface OwnerListingCardProps {
  pg: PG;
  onDelete: (id: string) => void;
}

export function OwnerListingCard({ pg, onDelete }: OwnerListingCardProps) {
  // डमी इमेज हटा दी गई है। अगर इमेज है तो दिखेगी, नहीं तो साफ़ UI बॉक्स दिखेगा।
  const thumbnail = pg.images?.[0]?.url;
  const [imageLoadFailed, setImageLoadFailed] = useState(false);

  return (
    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group">
      
      {/* IMAGE CONTAINER */}
      <div className="relative h-40 w-full bg-slate-50 overflow-hidden shrink-0 flex items-center justify-center">
        {thumbnail && !imageLoadFailed ? (
          <Image 
            src={thumbnail}
            alt={pg.pgName}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImageLoadFailed(true)}
          />
        ) : (
          <div className="flex flex-col items-center gap-1 text-slate-300">
            <Building2 className="w-8 h-8" />
            <span className="text-[10px] font-bold uppercase tracking-wider">No Image</span>
          </div>
        )}
        
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm ${
            pg.approvalStatus === 'APPROVED' 
              ? 'bg-emerald-500 text-white' 
              : pg.approvalStatus === 'PENDING'
              ? 'bg-amber-500 text-white'
              : 'bg-rose-500 text-white'
          }`}>
            {pg.approvalStatus}
          </span>
        </div>
      </div>

      {/* BODY CONTENT */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3.5">
        <div className="space-y-1">
          <h4 className="font-black text-xs text-slate-900 tracking-tight line-clamp-1">{pg.pgName}</h4>
          <p className="text-[10px] font-semibold text-slate-400 flex items-center gap-0.5">
            <MapPin className="w-3 h-3 text-slate-300" /> {pg.city}
          </p>

          <div className="pt-1 flex items-baseline gap-0.5">
            <span className="text-sm font-black text-slate-950">₹{pg.rent ? pg.rent.toLocaleString('en-IN') : 0}</span>
            <span className="text-[9px] font-bold text-slate-400">/ month</span>
          </div>
        </div>

        {/* UTILITIES FOOTER */}
        <div className="flex items-center justify-between border-t border-slate-50 pt-2.5">
          <div className="flex items-center gap-2 text-[9px] font-bold text-slate-500">
            <span>{pg.gender || 'Any Sharing'}</span>
            {(pg.wifiAvailable || pg.foodAvailable) && <span className="w-1 h-1 bg-slate-200 rounded-full" />}
            <div className="flex gap-1 items-center">
              {pg.wifiAvailable && <Wifi className="w-3 h-3 text-emerald-600" aria-label="Wifi Available" />}
              {pg.foodAvailable && <Utensils className="w-3 h-3 text-emerald-600" aria-label="Food Available" />}
            </div>
          </div>

          {/* CONTROLS */}
          <div className="flex items-center gap-1">
            <Link 
              href={ROUTES.OWNER.EDIT_PG ? ROUTES.OWNER.EDIT_PG(pg.id) : `/owner/edit-pg/${pg.id}`} 
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </Link>
            <button 
              onClick={() => onDelete(pg.id)}
              className="p-1.5 rounded-lg border border-slate-100 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}