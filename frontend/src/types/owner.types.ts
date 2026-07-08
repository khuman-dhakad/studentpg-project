/**
 * Detailed definitions for the Property Owner system domains.
 */

export interface OwnerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsappNumber: string;
  role: 'OWNER';
  profileImageUrl?: string | null;
  profileImagePublicId?: string | null;
  emailVerified: boolean;
}

export interface UpdateProfilePayload {
  name: string;
  email: string;
  phone: string;
  whatsappNumber: string;
}