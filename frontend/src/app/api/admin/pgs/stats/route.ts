import { NextResponse } from 'next/server';
import { backendClient } from '@/api/backendClient';
import { BACKEND_ENDPOINTS } from '@/api/endpoints';
import { AdminStats } from '@/types/admin.types';

/**
 * Computes live operational dashboard metrics for aggregate display cards.
 */
export async function GET() {
  try {
    const analyticalStats = await backendClient.get<AdminStats>(BACKEND_ENDPOINTS.ADMIN.STATS);
    return NextResponse.json(analyticalStats);
  } catch (error: unknown) {
    const err = error as { status?: number; message?: string };
    return NextResponse.json(
      { status: err.status || 500, message: err.message || 'Failed to compute backend metrics.' },
      { status: err.status || 500 }
    );
  }
}