import { NextRequest, NextResponse } from 'next/server';
import { backendClient } from '@/api/backendClient';
import { BACKEND_ENDPOINTS } from '@/api/endpoints';
import { PG } from '@/types/pg.types';

/**
 * Pulls all custom accommodations managed by the calling owner account.
 */
export async function GET() {
  try {
    const properties = await backendClient.get<PG[]>(BACKEND_ENDPOINTS.PGS.OWNER_LISTINGS);
    return NextResponse.json(properties);
  } catch (error: any) {
    return NextResponse.json(
      { status: error.status || 500, message: error.message || 'Failed to sync owner accommodation records.' },
      { status: error.status || 500 }
    );
  }
}

/**
 * Registers a brand-new PG listing. Placed on PENDING state until admin verification.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const createdProperty = await backendClient.post<PG>(BACKEND_ENDPOINTS.PGS.BASE, body);
    return NextResponse.json(createdProperty);
  } catch (error: any) {
    return NextResponse.json(
      { status: error.status || 400, message: error.message || 'Accommodation creation rejected.', errors: error.errors },
      { status: error.status || 400 }
    );
  }
}