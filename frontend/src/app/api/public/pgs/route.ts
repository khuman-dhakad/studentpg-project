import { NextRequest, NextResponse } from 'next/server';
import { backendClient } from '@/api/backendClient';
import { BACKEND_ENDPOINTS } from '@/api/endpoints';
import type { PagedResponse } from '@/types/api.types';
import type { PG } from '@/types/pg.types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const city = searchParams.get('city')?.trim();
    const maxRent = searchParams.get('maxRent');
    const category = searchParams.get('category')?.trim();
    const food = searchParams.get('food');
    const wifi = searchParams.get('wifi');
    const parking = searchParams.get('parking');
    const laundry = searchParams.get('laundry');
    const page = searchParams.get('page') || '0';
    const size = searchParams.get('size') || '10';
    const sortBy = searchParams.get('sortBy') || 'rent';
    const direction = searchParams.get('direction') || 'asc';

    const hasStructuredFilters = Boolean(city || maxRent || category || food || wifi || parking || laundry);

    const query = new URLSearchParams({
      page,
      size,
      sortBy,
      direction,
    });

    if (city) query.set('city', city);
    if (maxRent) query.set('maxRent', maxRent);
    if (category) query.set('category', category);
    if (food) query.set('food', food);
    if (wifi) query.set('wifi', wifi);
    if (parking) query.set('parking', parking);
    if (laundry) query.set('laundry', laundry);

    const endpoint = hasStructuredFilters
      ? `${BACKEND_ENDPOINTS.STUDENT.FILTER}?${query.toString()}`
      : `${BACKEND_ENDPOINTS.STUDENT.PGS}?${query.toString()}`;

    const properties = await backendClient.get<PagedResponse<PG>>(endpoint);
    return NextResponse.json(properties);
  } catch (error: unknown) {
    const err = error as { status?: number; message?: string };
    return NextResponse.json(
      { status: err.status || 500, message: err.message || 'Failed to fetch public PG listings.' },
      { status: err.status || 500 }
    );
  }
}