import { NextRequest, NextResponse } from 'next/server';
import { backendClient } from '@/api/backendClient';
import { BACKEND_ENDPOINTS } from '@/api/endpoints';

/**
 * Submits the final verification parameters to update account access credentials.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await backendClient.post<unknown>(
      BACKEND_ENDPOINTS.OWNERS.RESET_PASSWORD,
      body
    );

    return NextResponse.json(response);
  } catch (error: unknown) {
    const err = error as { status?: number; message?: string };
    return NextResponse.json(
      {
        success: false,
        message: err.message || 'Password reset configuration rejected.',
      },
      { status: err.status || 400 }
    );
  }
}