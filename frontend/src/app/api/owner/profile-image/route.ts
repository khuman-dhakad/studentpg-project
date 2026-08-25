import { NextRequest, NextResponse } from 'next/server';
import { backendClient } from '@/api/backendClient';
import { BACKEND_ENDPOINTS } from '@/api/endpoints';

/**
 * Syncs the uploaded Cloudinary asset links directly to the owner's profile database.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json(); // { publicId: string, url: string }
    const result = await backendClient.post<string>(BACKEND_ENDPOINTS.OWNERS.PROFILE_IMAGE, body);
    return NextResponse.json({ message: result });
  } catch (error: unknown) {
    const err = error as { status?: number; message?: string };
    return NextResponse.json(
      { status: err.status || 400, message: err.message || 'Profile avatar association failed.' },
      { status: err.status || 400 }
    );
  }
}