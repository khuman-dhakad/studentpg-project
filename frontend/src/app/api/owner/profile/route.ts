import { NextRequest, NextResponse } from 'next/server';
import { backendClient } from '@/api/backendClient';
import { BACKEND_ENDPOINTS } from '@/api/endpoints';
import { OwnerProfile } from '@/types/owner.types';

/**
 * Retrieves the currently logged-in owner's profile info.
 */
export async function GET() {
  try {
    const profile = await backendClient.get<OwnerProfile>(BACKEND_ENDPOINTS.OWNERS.PROFILE);
    return NextResponse.json(profile);
  } catch (error: unknown) {
    const err = error as { status?: number; message?: string };
    return NextResponse.json(
      { status: err.status || 500, message: err.message || 'Failed to fetch owner profile.' },
      { status: err.status || 500 }
    );
  }
}

/**
 * Updates the owner's personal profile information.
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await backendClient.put<string>(BACKEND_ENDPOINTS.OWNERS.PROFILE, body);
    return NextResponse.json({ message: result });
  } catch (error: unknown) {
    const err = error as { status?: number; message?: string; errors?: unknown };
    return NextResponse.json(
      { status: err.status || 400, message: err.message || 'Profile modification rejected.', errors: err.errors },
      { status: err.status || 400 }
    );
  }
}