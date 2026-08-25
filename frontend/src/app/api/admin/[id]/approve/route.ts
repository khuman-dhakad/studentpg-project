import { NextRequest, NextResponse } from 'next/server';
import { backendClient } from '@/api/backendClient';
import { BACKEND_ENDPOINTS } from '@/api/endpoints';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * Approves a pending PG listing, changing its state to APPROVED and making it visible publicly.
 */
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    
    // Spring Boot endpoint processes updates and responds with plain confirmation text strings
    const confirmationText = await backendClient.put<string>(
      BACKEND_ENDPOINTS.ADMIN.APPROVE_PG(id),
      {}
    );

    return NextResponse.json({ message: confirmationText });
  } catch (error: unknown) {
    const err = error as { status?: number; message?: string };
    return NextResponse.json(
      { status: err.status || 400, message: err.message || 'Approval request failed.' },
      { status: err.status || 400 }
    );
  }
}