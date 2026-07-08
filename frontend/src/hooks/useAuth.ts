'use client';

import { useSessionQuery } from '@/features/auth/api/authApi';
import { AuthSessionState } from '@/types/auth.types';

/**
 * Global reactive client hook verifying runtime permission state contexts.
 */
export function useAuth() {
  const { data, isLoading, error, refetch } = useSessionQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const sessionState: AuthSessionState = {
    isAuthenticated: !!data?.isAuthenticated,
    user: data?.user || null,
    profile: data?.profile || null,
  };

  return {
    ...sessionState,
    isLoading,
    error,
    refreshSession: refetch,
  };
}