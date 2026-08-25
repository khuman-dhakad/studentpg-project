import { NextRequest, NextResponse } from 'next/server';
import { backendClient, getLastSetCookieHeader } from '@/api/backendClient';
import { BACKEND_ENDPOINTS } from '@/api/endpoints';
import { setAuthCookie } from '@/auth/cookies';
import { BaseLoginResponse } from '@/types/api.types';

function parseAccessTokenFromCookieHeader(setCookieHeader: string | null) {
  if (!setCookieHeader) {
    return null;
  }

  const cookieParts = setCookieHeader
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

  const accessCookie = cookieParts.find((part) => part.startsWith('access_token='));
  if (!accessCookie) {
    return null;
  }

  const [, rawValue = ''] = accessCookie.split('=');
  return rawValue.split(';')[0] ?? null;
}

/**
 * Handles the administrative access pipeline.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const responseData = await backendClient.post<BaseLoginResponse>(
      BACKEND_ENDPOINTS.AUTH.LOGIN,
      body
    );

    const setCookieHeader = getLastSetCookieHeader();
    const accessToken = parseAccessTokenFromCookieHeader(setCookieHeader);

    if (!accessToken) {
      return NextResponse.json(
        { status: 400, message: responseData.message || 'Invalid administrative login criteria.' },
        { status: 400 }
      );
    }

    await setAuthCookie(accessToken);

    return NextResponse.json(
      {
        message: 'Administrative session established.',
        role: 'ADMIN',
        email: responseData.email,
      },
      {
        status: 200,
        headers: setCookieHeader
          ? { 'set-cookie': setCookieHeader }
          : undefined,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { status: error.status || 500, message: error.message || 'Administrative gateway unreachable.' },
      { status: error.status || 500 }
    );
  }
}