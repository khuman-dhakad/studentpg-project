/**
 * Paying Guest (PG) accommodation data entity models matching MongoDB collection definitions.
 */

import type { OwnerProfile } from './owner.types';

export interface PGImage {
  publicId: string;
  url: string;
}

export interface PG {
  id: string;
  ownerId: string;
  owner: OwnerProfile | null; // Resolved purely on individual detail GET endpoints
  pgName: string;
  description: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  rent: number;
  gender: 'Boys' | 'Girls' | 'Unisex';
  roomType: string;
  foodAvailable: boolean;
  wifiAvailable: boolean;
  parkingAvailable: boolean;
  laundryAvailable: boolean;
  approvalStatus: 'PENDING' | 'APPROVED';
  images: PGImage[];
}

export interface PGFilterParams {
  city?: string;
  maxRent?: number;
  category?: 'Boys' | 'Girls' | 'Unisex';
  wifi?: boolean;
  food?: boolean;
  parking?: boolean;
  laundry?: boolean;
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: 'asc' | 'desc';
}