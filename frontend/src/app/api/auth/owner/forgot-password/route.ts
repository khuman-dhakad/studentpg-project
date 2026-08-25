import { NextRequest, NextResponse } from 'next/server';
import { backendClient } from '@/api/backendClient';
import { BACKEND_ENDPOINTS } from '@/api/endpoints';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const email = body?.email?.trim()?.toLowerCase();

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email is required',
        },
        { status: 400 }
      );
    }

    const response = await backendClient.post<{ success?: boolean; message?: string }>(
      BACKEND_ENDPOINTS.OWNERS.FORGOT_PASSWORD,
      { email }
    );

    return NextResponse.json({ success: true, message: response?.message || 'If an account exists with this email, a reset code has been sent.' });

  } catch (error: unknown) {
    console.error('Forgot password error:', error);
    const err = error as { message?: string; status?: number };

    return NextResponse.json(
      {
        success: false,
        message: err?.message || 'Failed to send OTP',
      },
      {
        status: err?.status || 500,
      }
    );
  }
}