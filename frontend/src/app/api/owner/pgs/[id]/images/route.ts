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

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const publicId =
      request.nextUrl.searchParams.get('publicId');

    if (!publicId) {
      return NextResponse.json(
        {
          message: 'publicId is required.',
        },
        {
          status: 400,
        }
      );
    }

    const feedback = await backendClient.delete<string>(
      `${BACKEND_ENDPOINTS.PGS.IMAGES(id)}?publicId=${encodeURIComponent(
        publicId
      )}`
    );

    return NextResponse.json({
      message: feedback || 'Image deleted successfully.',
    });

  } catch (error: any) {
    return NextResponse.json(
      {
        status: error.status || 400,
        message:
          error.message || 'Image deletion failed.',
      },
      {
        status: error.status || 400,
      }
    );
  }
}