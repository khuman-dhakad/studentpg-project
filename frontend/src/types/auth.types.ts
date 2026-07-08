import { OwnerProfile } from './owner.types';

/**
 * Global Frontend-facing state metrics for identity contexts.
 */

export interface AuthSessionState {
  isAuthenticated: boolean;
  user: {
    email: string | null;
    role: 'OWNER' | 'ADMIN' | null;
  } | null;
  profile: OwnerProfile | null;
}