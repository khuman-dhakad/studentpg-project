import { NextResponse } from 'next/server';
import { backendClient } from '@/api/backendClient';
import { BACKEND_ENDPOINTS } from '@/api/endpoints';
import { PG } from '@/types/pg.types';

/**
 * Retrieves all properties currently awaiting administrative validation.
 */
export async function GET() {
  try {
    const pendingProperties = await backendClient.get<PG[]>(BACKEND_ENDPOINTS.ADMIN.PENDING_PGS);
    return NextResponse.json(pendingProperties);
  } catch (error: unknown) {
    const err = error as { status?: number; message?: string };
    return NextResponse.json(
      { status: err.status || 500, message: err.message || 'Failed to sync unapproved accommodations.' },
      { status: err.status || 500 }
    );
  }
}