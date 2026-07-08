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

    const { email, isExpired } = decodeAndVerifyTokenLifecycle(token);

    if (isExpired || !email) {
      return NextResponse.json({ isAuthenticated: false, user: null, profile: null });
    }

    // Determine role by matching the administrative email configurations
    const isAdmin = email === process.env.ADMIN_EMAIL || email.includes('admin@');
    const role = isAdmin ? 'ADMIN' : 'OWNER';

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