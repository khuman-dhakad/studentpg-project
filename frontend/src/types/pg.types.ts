/**
 * Paying Guest (PG) accommodation data types.
 */

import type { OwnerProfile } from './owner.types';

export interface OwnerSummary {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsappNumber: string;
}


// =======================================================
// PG IMAGE
// =======================================================

export interface PGImage {

  id?: string;

  publicId?: string;

  url: string;

}


// =======================================================
// PG
// =======================================================


export interface PG {

  id: string;
  createdAt?: string;

updatedAt?: string;

  ownerId: string;
  
owner?: OwnerSummary | OwnerProfile | null;
  


  // =====================================================
  // BASIC INFORMATION
  // =====================================================

  pgName: string;

  description: string;


  // =====================================================
  // LOCATION
  // =====================================================

  address: string;

  landmark?: string;

  city: string;

  state: string;

  pincode: string;


  // =====================================================
  // RENTAL INFORMATION
  // =====================================================

  rent: number;

  securityDeposit?: number;

  noticePeriod?: string;


  // =====================================================
  // PG CATEGORY
  // =====================================================

  category?: string;

  gender:
  | 'MALE'
  | 'FEMALE'
  | 'UNISEX';
  roomType: string;


  // =====================================================
  // AMENITIES
  // =====================================================

  foodAvailable: boolean;

  wifiAvailable: boolean;

  parkingAvailable: boolean;

  laundryAvailable: boolean;

  acAvailable: boolean;

  powerBackup: boolean;


  // =====================================================
  // MODERATION
  // =====================================================

  approvalStatus:
    | 'PENDING'
    | 'APPROVED'
    | 'REJECTED';

  approvedBy?: string;

  approvedAt?: string;

  rejectedBy?: string;

  rejectedAt?: string;

  rejectionReason?: string;


  // =====================================================
  // IMAGES
  // =====================================================

  images: PGImage[];

}


// =======================================================
// SEARCH SUGGESTION
// =======================================================

export interface PGSuggestion {

  _id: string;

  pgName: string;

  address: string;

  city: string;

  state: string;

}


// =======================================================
// PG FILTER PARAMS
// =======================================================

export interface PGFilterParams {

  city?: string;

  maxRent?: number;


 category?: string;


  wifi?: boolean;

  food?: boolean;

  parking?: boolean;

  laundry?: boolean;

  ac?: boolean;

  powerBackup?: boolean;


  page?: number;

  size?: number;


  sortBy?: string;

  direction?:
    | 'asc'
    | 'desc';

}