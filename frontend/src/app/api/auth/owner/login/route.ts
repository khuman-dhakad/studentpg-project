import { NextRequest, NextResponse } from 'next/server';
import { backendClient } from '@/api/backendClient';
import { BACKEND_ENDPOINTS } from '@/api/endpoints';
import { setAuthCookie } from '@/auth/cookies';
import { BaseLoginResponse } from '@/types/api.types';

/**
 * Handles security boundary validation for Owner authentications.
 * Intercepts explicit backend HTTP 200 text/JSON responses to prevent token drops.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const responseData = await backendClient.post<BaseLoginResponse>(
      BACKEND_ENDPOINTS.OWNERS.LOGIN,
      body
    );

    // Guard against backend anomaly where bad password/lockouts drop HTTP 200 with null tokens
    if (!responseData.token) {
      return NextResponse.json(
        { 
          status: 400, 
          message: responseData.message || 'Invalid credentials or account locked.' 
        },
        { status: 400 }
      );
    }

    // Set the token inside a secure, HttpOnly, SameSite state container
    await setAuthCookie(responseData.token);

    return NextResponse.json({
      message: 'Authentication successful',
      role: 'OWNER',
      email: responseData.email
    });
  } catch (error: any) {
    return NextResponse.json(
      { 
        status: error.status || 500, 
        message: error.message || 'An unexpected error occurred during authentication.' 
      },
      { status: error.status || 500 }
    );
  }
}