import { NextResponse } from 'next/server';
import { getAuthToken } from '@/auth/cookies';
import { backendClient } from '@/api/backendClient';
import { BACKEND_ENDPOINTS } from '@/api/endpoints';

export async function GET() {
  try {
    const token = await getAuthToken();

    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const unreadCount = await backendClient.get(
      BACKEND_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT,
      { token }
    );

    return NextResponse.json(unreadCount);
  } catch (error) {
    console.error('Failed to fetch unread notification count:', error);

    return NextResponse.json(
      { message: 'Failed to fetch unread notification count' },
      { status: 500 }
    );
  }
}