import { NextRequest, NextResponse } from 'next/server';
import { backendClient } from '@/api/backendClient';

export async function GET(_request: NextRequest) {
  const results: Record<string, unknown> = {};

  const tests = [
    {
      name: 'Health',
      method: 'GET' as const,
      url: '/actuator/health',
    },
    {
      name: 'Student PGs (public)',
      method: 'GET' as const,
      url: '/student/pgs?page=0&size=3',
    },
    {
      name: 'Student Search (public)',
      method: 'GET' as const,
      url: '/student/pgs/search?city=Bhopal&page=0&size=3',
    },
    {
      name: 'Filter (public)',
      method: 'GET' as const,
      url: '/student/pgs/filter?city=Bhopal&maxRent=10000',
    },
    {
      name: 'Text Search (public)',
      method: 'GET' as const,
      url: '/search?q=boys',
    },
    {
      name: 'Suggestions (public)',
      method: 'GET' as const,
      url: '/student/pgs/search-suggestions?q=bh',
    },
  ];

  for (const test of tests) {
    try {
      const data = await backendClient.get(test.url);
      results[test.name] = {
        status: 'OK',
        data: typeof data === 'object' ? (Array.isArray(data) ? `[${data.length} items]` : 'object') : typeof data,
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      results[test.name] = {
        status: 'FAILED',
        error: message,
      };
    }
  }

  return NextResponse.json(results);
}
