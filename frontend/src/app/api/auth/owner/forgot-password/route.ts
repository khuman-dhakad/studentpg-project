import { NextRequest, NextResponse } from 'next/server';
import { backendClient } from '@/api/backendClient';
import { BACKEND_ENDPOINTS } from '@/api/endpoints';

/**
 * Triggers a rolling, rate-limited numerical reset token request payload.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const responseMessage = await backendClient.post<string>(
      BACKEND_ENDPOINTS.OWNERS.FORGOT_PASSWORD,
      body
    );

    return NextResponse.json({ message: responseMessage });
  } catch (error: any) {
    return NextResponse.json(
      { status: error.status || 500, message: error.message || 'Failed to dispatch reset request.' },
      { status: error.status || 500 }
    );
  }
}