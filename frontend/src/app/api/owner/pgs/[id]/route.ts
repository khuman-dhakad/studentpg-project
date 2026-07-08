import { NextRequest, NextResponse } from 'next/server';
import { backendClient } from '@/api/backendClient';
import { BACKEND_ENDPOINTS } from '@/api/endpoints';
import { PG } from '@/types/pg.types';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * Fetches an isolated accommodation details structure for editing contexts.
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const property = await backendClient.get<PG>(BACKEND_ENDPOINTS.PGS.BY_ID(id));
    return NextResponse.json(property);
  } catch (error: any) {
    return NextResponse.json(
      { status: error.status || 404, message: error.message || 'Accommodation document not found.' },
      { status: error.status || 404 }
    );
  }
}

/**
 * Updates properties of an existing custom accommodation node.
 */
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const updatedProperty = await backendClient.put<PG>(BACKEND_ENDPOINTS.PGS.BY_ID(id), body);
    return NextResponse.json(updatedProperty);
  } catch (error: any) {
    return NextResponse.json(
      { status: error.status || 400, message: error.message || 'Accommodation modification declined.', errors: error.errors },
      { status: error.status || 400 }
    );
  }
}

/**
 * Permanently drops an accommodation document node from the global registers.
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const feedback = await backendClient.delete<string>(BACKEND_ENDPOINTS.PGS.BY_ID(id));
    return NextResponse.json({ message: feedback });
  } catch (error: any) {
    return NextResponse.json(
      { status: error.status || 400, message: error.message || 'Failed to evict listing document.' },
      { status: error.status || 400 }
    );
  }
}