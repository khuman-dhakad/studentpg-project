import { NextRequest, NextResponse } from 'next/server';
import { backendClient } from '@/api/backendClient';
import { BACKEND_ENDPOINTS } from '@/api/endpoints';
import { setAuthCookie } from '@/auth/cookies';
import { BaseLoginResponse } from '@/types/api.types';

/**
 * Handles the administrative access pipeline.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const responseData = await backendClient.post<BaseLoginResponse>(
      BACKEND_ENDPOINTS.ADMIN.LOGIN,
      body
    );

    if (!responseData.token) {
      return NextResponse.json(
        { status: 400, message: responseData.message || 'Invalid administrative login criteria.' },
        { status: 400 }
      );
    }

    await setAuthCookie(responseData.token);

    return NextResponse.json({
      message: 'Administrative session established.',
      role: 'ADMIN',
      email: responseData.email
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: error.status || 500, message: error.message || 'Administrative gateway unreachable.' },
      { status: error.status || 500 }
    );
  }
}