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

    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, status: 400, message: 'Invalid payload.' }, { status: 400 });
    }

    const { name, email, password, phone, whatsappNumber } = body as Record<string, unknown>;
    if (
      typeof name !== 'string' || name.length > 50 ||
      typeof email !== 'string' || email.length > 254 ||
      typeof password !== 'string' || password.length > 64 ||
      typeof phone !== 'string' || phone.length > 15 ||
      (whatsappNumber !== undefined && whatsappNumber !== null && typeof whatsappNumber === 'string' && whatsappNumber.length > 15)
    ) {
      return NextResponse.json(
        { success: false, status: 400, message: 'Registration fields exceed allowed length limits.' },
        { status: 400 }
      );
    }

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