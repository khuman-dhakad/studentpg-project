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

    const notifications = await backendClient.get(
      BACKEND_ENDPOINTS.NOTIFICATIONS.ALL,
      { token }
    );

    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Failed to fetch notifications:', error);

    return NextResponse.json(
      { message: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}