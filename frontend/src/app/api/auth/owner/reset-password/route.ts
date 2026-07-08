import { NextRequest, NextResponse } from 'next/server';
import { backendClient } from '@/api/backendClient';
import { BACKEND_ENDPOINTS } from '@/api/endpoints';

/**
 * Submits the final verification parameters to update account access credentials.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const responseMessage = await backendClient.post<string>(
      BACKEND_ENDPOINTS.OWNERS.RESET_PASSWORD,
      body
    );

    return NextResponse.json({ message: responseMessage });
  } catch (error: any) {
    return NextResponse.json(
      { status: error.status || 400, message: error.message || 'Password reset configuration rejected.' },
      { status: error.status || 400 }
    );
  }
}