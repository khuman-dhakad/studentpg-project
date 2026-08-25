import { NextRequest, NextResponse } from 'next/server';
import { backendClient } from '@/api/backendClient';
import { BACKEND_ENDPOINTS } from '@/api/endpoints';

/**
 * Updates account access credentials within an active authenticated session context.
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await backendClient.put<string>(BACKEND_ENDPOINTS.OWNERS.CHANGE_PASSWORD, body);
    return NextResponse.json({ message: result });
  } catch (error: unknown) {
    const err = error as { status?: number; message?: string };
    return NextResponse.json(
      { status: err.status || 400, message: err.message || 'Credential alteration rejected.' },
      { status: err.status || 400 }
    );
  }
}