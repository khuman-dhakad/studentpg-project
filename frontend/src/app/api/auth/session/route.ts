import { NextResponse } from 'next/server';
import { getAuthToken } from '@/auth/cookies';
import { decodeAndVerifyTokenLifecycle } from '@/auth/jwt';
import { backendClient } from '@/api/backendClient';
import { BACKEND_ENDPOINTS } from '@/api/endpoints';
import { OwnerProfile } from '@/types/owner.types';

/**
 * Syncs and verifies structural application persistence layouts for client views.
 */
export async function GET() {
  try {
    const token = await getAuthToken();

    if (!token) {
      return NextResponse.json({ isAuthenticated: false, user: null, profile: null });
    }

    const {
  email,
  isExpired,
} = await decodeAndVerifyTokenLifecycle(token);

    if (isExpired || !email) {
      return NextResponse.json({ isAuthenticated: false, user: null, profile: null });
    }

    const backendSession = await backendClient.get<{
      isAuthenticated: boolean;
      user: { email: string; role: 'OWNER' | 'ADMIN' } | null;
    }>(BACKEND_ENDPOINTS.AUTH.SESSION, { token });

    if (!backendSession.isAuthenticated || !backendSession.user) {
      return NextResponse.json({ isAuthenticated: false, user: null, profile: null });
    }

    const role = backendSession.user.role;
    const isAdmin = role === 'ADMIN';

    let profile: OwnerProfile | null = null;

    // Fetch the owner's profile details if they aren't an admin
    if (!isAdmin) {
      try {
        profile = await backendClient.get<OwnerProfile>(BACKEND_ENDPOINTS.OWNERS.PROFILE, { token });
      } catch {
        // Allow the session to continue even if a temporary profile retrieval fails
      }
    }

    return NextResponse.json({
      isAuthenticated: true,
      user: { email, role },
      profile
    });
  } catch {
    return NextResponse.json({ isAuthenticated: false, user: null, profile: null });
  }
}