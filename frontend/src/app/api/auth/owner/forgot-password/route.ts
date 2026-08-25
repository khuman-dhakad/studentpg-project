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

  } catch (error: any) {
    console.error('Forgot password error:', error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || 'Failed to send OTP',
      },
      {
        status: error?.status || 500,
      }
    );
  }
}