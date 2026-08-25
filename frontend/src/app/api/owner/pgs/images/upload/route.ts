import { NextRequest, NextResponse } from 'next/server';
import { backendClient } from '@/api/backendClient';
import { BACKEND_ENDPOINTS } from '@/api/endpoints';
import { PGImage } from '@/types/pg.types';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const result = await backendClient.post<PGImage>(
      BACKEND_ENDPOINTS.PGS.UPLOAD_IMAGE,
      formData
    );
    return NextResponse.json(result);
  } catch (error: unknown) {
    const err = error as { status?: number; message?: string };
    return NextResponse.json(
      { success: false, status: err.status || 400, message: err.message || 'Image upload failed.' },
      { status: err.status || 400 }
    );
  }
}
