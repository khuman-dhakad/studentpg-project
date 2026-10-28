import { NextRequest, NextResponse } from 'next/server';
import { backendClient } from '@/api/backendClient';

export async function DELETE(request: NextRequest) {
  try {
    const publicId = request.nextUrl.searchParams.get('publicId');

    if (!publicId) {
      return NextResponse.json(
        { success: false, message: 'publicId is required.' },
        { status: 400 }
      );
    }

    const response = await backendClient.delete<{ success?: boolean; message?: string }>(
      `/api/owner/pgs/images/unassigned?publicId=${encodeURIComponent(publicId)}`
    );

    return NextResponse.json(response);
  } catch (error: unknown) {
    const err = error as { status?: number; message?: string };
    return NextResponse.json(
      { success: false, message: err.message || 'Image cleanup failed.' },
      { status: err.status || 400 }
    );
  }
}
