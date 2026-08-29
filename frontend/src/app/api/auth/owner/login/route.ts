import { NextRequest, NextResponse } from 'next/server';
import { backendClient } from '@/api/backendClient';
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
 * Handles security boundary validation for Owner authentications.
 * Intercepts explicit backend HTTP 200 text/JSON responses to prevent token drops.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { data: responseData, setCookie: setCookieHeader } = await backendClient.postWithSetCookie<BaseLoginResponse>(
      BACKEND_ENDPOINTS.AUTH.LOGIN,
      body
    );

    const accessToken = parseAccessTokenFromCookieHeader(setCookieHeader);

    if (!accessToken) {
      return NextResponse.json(
        {
          status: 400,
          message: responseData.message || 'Invalid credentials or account locked.',
        },
        { status: 400 }
      );
    }

    if (responseData.role !== 'OWNER') {
      return NextResponse.json(
        { status: 403, message: 'This account is not an owner account.' },
        { status: 403 }
      );
    }

    await setAuthCookie(accessToken);

    return NextResponse.json(
      {
        message: 'Authentication successful',
        role: 'OWNER',
        email: responseData.email,
      },
      {
        status: 200,
        headers: setCookieHeader
          ? { 'set-cookie': setCookieHeader }
          : undefined,
      }
    );
  } catch (error: unknown) {
    const err = error as { status?: number; message?: string };
    return NextResponse.json(
      {
        status: err.status || 500,
        message: err.message || 'An unexpected error occurred during authentication.',
      },
      { status: err.status || 500 }
    );
  }
}