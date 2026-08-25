import { NextResponse } from 'next/server';
import { clearAuthCookie, getAuthToken } from '@/auth/cookies';
import { backendClient, getLastSetCookieHeader } from '@/api/backendClient';
import { BACKEND_ENDPOINTS } from '@/api/endpoints';

/**
 * Fully evicts the local session and notifies the backend when a token is available.
 */
export async function POST() {
  const token = await getAuthToken();

  try {
    if (token) {
      await backendClient.post<{ message: string }>(BACKEND_ENDPOINTS.AUTH.LOGOUT, {}, {
        token,
        headers: {
          'Refresh-Token': token,
        },
      });
    }
  } catch (error) {
    console.warn('Backend logout notification failed; clearing client session anyway.', error);
  }

  const clearCookieHeader = getLastSetCookieHeader();

  await clearAuthCookie();
  return NextResponse.json(
    { message: 'Session successfully invalidated' },
    {
      status: 200,
      headers: clearCookieHeader
        ? { 'set-cookie': clearCookieHeader }
        : undefined,
    }
  );
}