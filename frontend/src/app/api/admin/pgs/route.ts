import { NextRequest, NextResponse } from 'next/server';
import { backendClient } from '@/api/backendClient';
import { BACKEND_ENDPOINTS } from '@/api/endpoints';
import { PG } from '@/types/pg.types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const queryString = searchParams.toString();

    const endpoint = queryString
      ? `${BACKEND_ENDPOINTS.ADMIN.PGS}?${queryString}`
      : BACKEND_ENDPOINTS.ADMIN.PGS;

    const properties =
      await backendClient.get<PG[]>(endpoint);

    return NextResponse.json(properties);

  } catch (error: unknown) {
    const err = error as { status?: number; message?: string };
    return NextResponse.json(
      {
        status: err.status || 500,
        message:
          err.message ||
          'Failed to retrieve administrative listings.',
      },
      {
        status: err.status || 500,
      }
    );
  }
}