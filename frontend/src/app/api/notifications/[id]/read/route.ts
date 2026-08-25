import { NextResponse } from 'next/server';
import { getAuthToken } from '@/auth/cookies';
import { backendClient } from '@/api/backendClient';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(
  _request: Request,
  context: RouteContext
) {
  try {
    const token = await getAuthToken();

    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!id || id.trim().length === 0) {
      return NextResponse.json(
        { message: 'Notification ID is required' },
        { status: 400 }
      );
    }

    await backendClient.request(
      `/notifications/${encodeURIComponent(id)}/read`,
      {
        method: 'PATCH',
        token,
      }
    );

    return new NextResponse(null, {
      status: 204,
    });
  } catch (error) {
    console.error('Failed to mark notification as read:', error);

    return NextResponse.json(
      { message: 'Failed to mark notification as read' },
      { status: 500 }
    );
  }
}