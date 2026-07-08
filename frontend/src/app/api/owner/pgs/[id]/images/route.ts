import { NextRequest, NextResponse } from 'next/server';
import { backendClient } from '@/api/backendClient';
import { BACKEND_ENDPOINTS } from '@/api/endpoints';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * Directly pushes collection batches of PGImage objects into the backend storage arrays.
 */
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json(); // Array of { publicId, url }
    const feedback = await backendClient.post<string>(BACKEND_ENDPOINTS.PGS.IMAGES(id), body);
    return NextResponse.json({ message: feedback });
  } catch (error: any) {
    return NextResponse.json(
      { status: error.status || 400, message: error.message || 'Image list append operation rejected.' },
      { status: error.status || 400 }
    );
  }
}