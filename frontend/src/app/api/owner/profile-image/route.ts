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
  } catch (error: any) {
    return NextResponse.json(
      { status: error.status || 400, message: error.message || 'Profile avatar association failed.' },
      { status: error.status || 400 }
    );
  }
}