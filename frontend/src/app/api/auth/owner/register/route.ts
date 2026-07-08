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

    // The backend returns a plain JSON string ("Owner registered successfully") with Content-Type: application/json
    const rawStringResult = await backendClient.post<string>(
      BACKEND_ENDPOINTS.OWNERS.REGISTER,
      body
    );

    // Business rule guard: checking for successful responses that indicate email duplication alerts
    if (rawStringResult === 'Email already exists') {
      return NextResponse.json(
        {
          status: 400,
          message: 'The requested email address is already associated with another account.'
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: rawStringResult });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: error.status || 400,
        message: error.message || 'Registration processing failure.',
        errors: error.errors
      },
      { status: error.status || 400 }
    );
  }
}