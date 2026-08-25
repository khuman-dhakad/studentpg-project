import { NextRequest, NextResponse } from 'next/server';

import { backendClient } from '@/api/backendClient';
import { BACKEND_ENDPOINTS } from '@/api/endpoints';


export async function GET(
  request: NextRequest
) {

  try {

    const {
      searchParams,
    } = new URL(request.url);


    const query =
      searchParams.get('q') || '';


    if (
      query.trim().length < 2
    ) {

      return NextResponse.json([]);

    }


    const suggestionsUrl =
      `${BACKEND_ENDPOINTS.STUDENT.SEARCH_SUGGESTIONS}` +
      `?q=${encodeURIComponent(query)}`;


    const suggestions =
      await backendClient.get(
        suggestionsUrl
      );


    return NextResponse.json(
      suggestions
    );


  } catch (error: unknown) {
    console.error('Search suggestions error:', error);
    const err = error as { status?: number; message?: string };

    return NextResponse.json(
      {
        status: err.status || 500,
        message: err.message || 'Failed to load search suggestions.',
      },
      {
        status: err.status || 500,
      }
    );
  }

}