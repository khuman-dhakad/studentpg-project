import { NextResponse } from 'next/server';
import { backendClient } from '@/api/backendClient';
import { BACKEND_ENDPOINTS } from '@/api/endpoints';
import { PG } from '@/types/pg.types';

/**
 * Fetches a list of all historical accommodations managed by the system.
 */
export async function GET() {
  try {
    const properties = await backendClient.get<PG[]>(BACKEND_ENDPOINTS.ADMIN.PGS);
    return NextResponse.json(properties);
  } catch (error: any) {
    return NextResponse.json(
      { status: error.status || 500, message: error.message || 'Failed to retrieve administrative listings.' },
      { status: error.status || 500 }
    );
  }
}