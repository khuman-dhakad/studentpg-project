import { NextRequest, NextResponse } from 'next/server';
import { backendClient } from '@/api/backendClient';
import { BACKEND_ENDPOINTS } from '@/api/endpoints';

/**
 * Provides ultra-fast search typeahead suggestions based on active city keywords.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city') || '';

    if (!city.trim()) {
      return NextResponse.json([]);
    }

    const suggestionsUrl = `${BACKEND_ENDPOINTS.STUDENT.SEARCH_CITY}?city=${encodeURIComponent(city)}`;
    const uniqueCities = await backendClient.get<string[]>(suggestionsUrl);

    return NextResponse.json(uniqueCities);
  } catch (error: any) {
    return NextResponse.json(
      { status: error.status || 500, message: error.message || 'Failed to populate lookup suggestions.' },
      { status: error.status || 500 }
    );
  }
}