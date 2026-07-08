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
  } catch (error: any) {
    return NextResponse.json(
      { status: error.status || 500, message: error.message || 'Failed to fetch owner profile.' },
      { status: error.status || 500 }
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
  } catch (error: any) {
    return NextResponse.json(
      { status: error.status || 400, message: error.message || 'Profile modification rejected.', errors: error.errors },
      { status: error.status || 400 }
    );
  }
}