import { NextRequest, NextResponse } from 'next/server';
import { backendClient } from '@/api/backendClient';
import { BACKEND_ENDPOINTS } from '@/api/endpoints';

/**
 * Proxies registration requests.
 * Evaluates duplicate email anomalies where the backend resolves with an HTTP 200 plaintext value.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await backendClient.post<{ success?: boolean; message?: string }>(
      BACKEND_ENDPOINTS.OWNERS.REGISTER,
      body
    );

    if (response?.message === 'Email already exists') {
      return NextResponse.json(
        {
          success: false,
          status: 400,
          message: 'The requested email address is already associated with another account.'
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, message: response?.message || 'Registration successful' });
  } catch (error: unknown) {
    const err = error as { status?: number; message?: string; errors?: unknown };
    return NextResponse.json(
      {
        status: err.status || 400,
        message: err.message || 'Registration processing failure.',
        errors: err.errors
      },
      { status: err.status || 400 }
    );
  }
}