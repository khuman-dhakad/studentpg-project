import { NextRequest, NextResponse } from 'next/server';
import { backendClient } from '@/api/backendClient';
import { BACKEND_ENDPOINTS } from '@/api/endpoints';
import { PG } from '@/types/pg.types';

/**
 * Pulls all custom accommodations managed by the calling owner account.
 */
export async function GET(_request: NextRequest) {
  try {
    const properties = await backendClient.get<PG[]>(BACKEND_ENDPOINTS.PGS.OWNER_LISTINGS);
    return NextResponse.json(properties);
  } catch (error: unknown) {
    const err = error as { status?: number; message?: string };
    return NextResponse.json(
      { status: err.status || 500, message: err.message || 'Failed to sync owner accommodation records.' },
      { status: err.status || 500 }
    );
  }
}

/**
 * Registers a brand-new PG listing. Placed on PENDING state until admin verification.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const createdProperty = await backendClient.post<{ success: boolean; message: string }>(BACKEND_ENDPOINTS.PGS.OWNER_LISTINGS, body);
    return NextResponse.json(createdProperty);
  } catch (error: unknown) {
    const err = error as { status?: number; message?: string; errors?: unknown };
    return NextResponse.json(
      { success: false, status: err.status || 400, message: err.message || 'Accommodation creation rejected.', errors: err.errors },
      { status: err.status || 400 }
    );
  }
}