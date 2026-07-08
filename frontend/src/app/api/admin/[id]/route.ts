import { NextRequest, NextResponse } from 'next/server';
import { backendClient } from '@/api/backendClient';
import { BACKEND_ENDPOINTS } from '@/api/endpoints';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * Rejects or completely deletes a target accommodation from global data collections.
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    
    const operationalFeedback = await backendClient.delete<string>(
      BACKEND_ENDPOINTS.ADMIN.REJECT_PG(id)
    );

    return NextResponse.json({ message: operationalFeedback });
  } catch (error: any) {
    return NextResponse.json(
      { status: error.status || 400, message: error.message || 'Administrative eviction declined.' },
      { status: error.status || 400 }
    );
  }
}