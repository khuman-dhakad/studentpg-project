import { NextRequest, NextResponse } from 'next/server';
import { backendClient } from '@/api/backendClient';
import { BACKEND_ENDPOINTS } from '@/api/endpoints';
import type { PagedResponse } from '@/types/api.types';
import type { PG } from '@/types/pg.types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';

    if (!query.trim()) {
      return NextResponse.json({ content: [], page: 0, size: 10, totalElements: 0, totalPages: 0 });
    }

    const page = searchParams.get('page') || '0';
    const size = searchParams.get('size') || '10';
    const sortBy = searchParams.get('sortBy') || 'rent';
    const direction = searchParams.get('direction') || 'asc';

    const searchUrl = `${BACKEND_ENDPOINTS.SEARCH.TEXT}?q=${encodeURIComponent(query)}&page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`;
    const searchResults = await backendClient.get<PagedResponse<PG>>(searchUrl);

    return NextResponse.json(searchResults);
  } catch (error: any) {
    return NextResponse.json(
      { status: error.status || 500, message: error.message || 'Text search operation failed.' },
      { status: error.status || 500 }
    );
  }
}