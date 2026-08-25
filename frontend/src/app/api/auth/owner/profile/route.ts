import { NextRequest, NextResponse } from 'next/server';
import { backendClient } from '@/api/backendClient';
import { BACKEND_ENDPOINTS } from '@/api/endpoints';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const responseMessage = await backendClient.put<string>(
      BACKEND_ENDPOINTS.OWNERS.PROFILE,
      body
    );

    return NextResponse.json({ message: responseMessage });
  } catch (error: unknown) {
    const err = error as { status?: number; message?: string };
    return NextResponse.json(
      { status: err.status || 500, message: err.message || 'Profile update failed.' },
      { status: err.status || 500 }
    );
  }
}
