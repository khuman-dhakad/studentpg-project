import type {
  OwnerProfile,
} from './owner.types';

export interface AuthUser {

  email: string;

  role: 'OWNER' | 'ADMIN';

}

export interface AuthSessionState {

  isAuthenticated: boolean;

  user: AuthUser | null;

  profile: OwnerProfile | null;

}