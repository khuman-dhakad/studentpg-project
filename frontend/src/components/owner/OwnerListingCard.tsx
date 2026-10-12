'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import {
  MapPin,
  Check,
  Clock,
  X,
  Wifi,
  Utensils,
  Snowflake,
  Car,
  Pencil,
  Settings,
  MoreVertical,
  ExternalLink,
  Trash2,
  Building2,
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import type { PG } from '@/types/pg.types';

interface OwnerListingCardProps {
  pg: PG;
  onDelete: (id: string) => void;
}

export function OwnerListingCard({ pg, onDelete }: OwnerListingCardProps) {
  const thumbnail = pg.images?.[0]?.url;
  const [imageLoadFailed, setImageLoadFailed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const locationLabel = pg.landmark
    ? `${pg.landmark}, ${pg.city || 'Bhopal'}`
    : pg.city
      ? `${pg.city}, Bhopal`
      : 'Bhopal';

  // Primary amenities to show as icons
  const primaryAmenities = [
    { key: 'wifi', label: 'Wi-Fi', icon: Wifi, available: pg.wifiAvailable },
    { key: 'food', label: 'Meals', icon: Utensils, available: pg.foodAvailable },
    { key: 'ac', label: 'AC', icon: Snowflake, available: pg.acAvailable },
    { key: 'parking', label: 'Parking', icon: Car, available: pg.parkingAvailable },
  ].filter((a) => a.available);

  // Extra amenities count (e.g. laundry, power backup, etc.)
  const extraAmenitiesCount = [
    pg.laundryAvailable,
    pg.powerBackup,
  ].filter(Boolean).length;

  return (
    <div className="group relative overflow-hidden rounded-[20px] sm:rounded-[24px] border border-slate-200/90 bg-white p-2.5 sm:p-3 shadow-[0_4px_16px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
      <div className="flex items-stretch gap-2.5 sm:gap-3.5">
        {/* IMAGE CONTAINER */}
        <div className="relative w-[130px] min-w-[130px] shrink-0 overflow-hidden rounded-[14px] bg-slate-100 sm:w-[190px] sm:min-w-[190px] sm:rounded-[18px]">
          <Link
            href={ROUTES.OWNER.EDIT_PG ? ROUTES.OWNER.EDIT_PG(pg.id) : `/owner/edit-pg/${pg.id}`}
            className="block h-full w-full min-h-[150px] sm:min-h-[170px]"
          >
            {thumbnail && !imageLoadFailed ? (
              <Image
                src={thumbnail}
                alt={pg.pgName}
                fill
                sizes="(max-width: 640px) 140px, 320px"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                onError={() => setImageLoadFailed(true)}
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-slate-300">
                <Building2 className="h-8 w-8" />
                <span className="text-[10px] font-bold uppercase tracking-wider">No Image</span>
              </div>
            )}
          </Link>

          {/* STATUS BADGE */}
          <div className="absolute left-2 top-2 z-10">
            {pg.approvalStatus === 'APPROVED' ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#059669] px-2 py-0.5 text-[10px] font-semibold text-white shadow-2xs">
                <Check className="h-3 w-3 stroke-[2.5]" />
                Published
              </span>
            ) : pg.approvalStatus === 'PENDING' ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-semibold text-white shadow-2xs">
                <Clock className="h-3 w-3 stroke-[2.5]" />
                Pending Review
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-semibold text-white shadow-2xs">
                <X className="h-3 w-3 stroke-[2.5]" />
                Rejected
              </span>
            )}
          </div>

          {/* QUICK DELETE / DISMISS BUTTON ON IMAGE */}
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              if (window.confirm(`Are you sure you want to delete "${pg.pgName}"?`)) {
                onDelete(pg.id);
              }
            }}
            aria-label={`Delete listing ${pg.pgName}`}
            className="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black/40 text-white shadow-2xs backdrop-blur-xs transition-colors hover:bg-rose-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>

          {/* PHOTO COUNTER */}
          <div className="absolute bottom-2 right-2 z-10 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-xs">
            1/{pg.images && pg.images.length > 0 ? pg.images.length : 1}
          </div>
        </div>

        {/* DETAILS CONTAINER */}
        <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5 gap-1.5">
          <div className="space-y-1">
            {/* TITLE & THREE-DOT MENU */}
            <div className="flex items-start justify-between gap-1">
              <Link
                href={ROUTES.OWNER.EDIT_PG ? ROUTES.OWNER.EDIT_PG(pg.id) : `/owner/edit-pg/${pg.id}`}
                className="block min-w-0 flex-1"
              >
                <h3 className="line-clamp-1 text-sm sm:text-base font-black tracking-tight text-slate-900 hover:text-emerald-700">
                  {pg.pgName}
                </h3>
              </Link>

              {/* THREE-DOT MENU */}
              <div ref={menuRef} className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setIsMenuOpen((prev) => !prev)}
                  aria-label="More options"
                  aria-expanded={isMenuOpen}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 top-8 z-30 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg text-xs font-semibold text-slate-700">
                    <Link
                      href={ROUTES.PG_DETAILS(pg.id)}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                      <span>View Public Page</span>
                    </Link>
                    <Link
                      href={ROUTES.OWNER.EDIT_PG ? ROUTES.OWNER.EDIT_PG(pg.id) : `/owner/edit-pg/${pg.id}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 transition-colors"
                    >
                      <Pencil className="h-3.5 w-3.5 text-slate-400" />
                      <span>Edit Details</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        if (window.confirm(`Are you sure you want to delete "${pg.pgName}"?`)) {
                          onDelete(pg.id);
                        }
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete Listing</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* LOCALITY */}
            <div className="flex items-center gap-1 text-[11px] sm:text-xs text-slate-500">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span className="truncate">{locationLabel}</span>
            </div>

            {/* RENT */}
            <div className="flex items-baseline gap-1">
              <span className="text-sm sm:text-base font-black text-[#059669]">
                ₹{pg.rent ? pg.rent.toLocaleString('en-IN') : 0}
              </span>
              <span className="text-[10px] sm:text-xs font-medium text-slate-400">/ month</span>
            </div>

            {/* AMENITIES */}
            <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 pt-0.5">
              {primaryAmenities.map((amenity) => {
                const Icon = amenity.icon;
                return (
                  <span
                    key={amenity.key}
                    className="inline-flex items-center gap-1 rounded-md bg-[#eff6ff] border border-blue-100/70 px-1.5 py-0.5 text-[10px] font-semibold text-[#2563eb]"
                  >
                    <Icon className="h-3 w-3" />
                    {amenity.label}
                  </span>
                );
              })}

              {extraAmenitiesCount > 0 && (
                <span className="inline-flex items-center rounded-md bg-blue-50 border border-blue-100/80 px-1.5 py-0.5 text-[10px] font-bold text-blue-700">
                  +{extraAmenitiesCount}
                </span>
              )}
            </div>
          </div>

          {/* ACTION BUTTONS (Edit & Manage) */}
          <div className="flex items-center gap-2 pt-2">
            <Link
              href={ROUTES.OWNER.EDIT_PG ? ROUTES.OWNER.EDIT_PG(pg.id) : `/owner/edit-pg/${pg.id}`}
              className="inline-flex items-center justify-center gap-1 rounded-xl bg-[#e8f8f2] hover:bg-[#d5f3e7] px-3 py-1.5 text-xs font-bold text-[#059669] transition-colors shrink-0"
            >
              <Pencil className="h-3 w-3" />
              <span>Edit</span>
            </Link>

            <Link
              href={ROUTES.OWNER.EDIT_PG ? ROUTES.OWNER.EDIT_PG(pg.id) : `/owner/edit-pg/${pg.id}`}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#059669] hover:bg-[#047857] px-3.5 py-1.5 text-xs font-bold text-white transition-colors shadow-2xs"
            >
              <Settings className="h-3 w-3" />
              <span>Manage →</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}