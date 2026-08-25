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
  } catch (error: any) {
    return NextResponse.json(
      { status: error.status || 500, message: error.message || 'Profile update failed.' },
      { status: error.status || 500 }
    );
  }
}
