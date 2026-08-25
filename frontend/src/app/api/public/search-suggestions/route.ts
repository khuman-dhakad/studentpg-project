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


  } catch (error: any) {

    console.error(
      'Search suggestions error:',
      error
    );


    return NextResponse.json(
      {
        status:
          error.status || 500,

        message:
          error.message ||
          'Failed to load search suggestions.',
      },
      {
        status:
          error.status || 500,
      }
    );

  }

}