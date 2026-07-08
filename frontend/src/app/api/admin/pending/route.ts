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
  } catch (error: any) {
    return NextResponse.json(
      { status: error.status || 500, message: error.message || 'Failed to sync unapproved accommodations.' },
      { status: error.status || 500 }
    );
  }
}