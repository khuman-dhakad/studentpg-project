import { NextResponse } from 'next/server';
import { backendClient } from '@/api/backendClient';
import { BACKEND_ENDPOINTS } from '@/api/endpoints';
import { AdminDashboardOverview } from '@/types/admin.types';

/**
 * Computes live operational dashboard metrics for aggregate display cards,
 * charts, recent activities, pending listings, and localities.
 */
export async function GET() {
  try {
    const overview = await backendClient.get<AdminDashboardOverview>(
      BACKEND_ENDPOINTS.ADMIN.DASHBOARD_OVERVIEW
    );
    return NextResponse.json(overview);
  } catch (error: unknown) {
    const err = error as { status?: number; message?: string };
    return NextResponse.json(
      {
        status: err.status || 500,
        message: err.message || 'Failed to compute dashboard metrics.',
      },
      { status: err.status || 500 }
    );
  }
}
