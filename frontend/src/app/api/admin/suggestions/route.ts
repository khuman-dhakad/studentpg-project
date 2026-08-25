import { NextResponse } from 'next/server';
import { backendClient } from '@/api/backendClient';
import { BACKEND_ENDPOINTS } from '@/api/endpoints';
import { AdminSuggestion } from '@/types/admin.types';

/**
 * Syncs the global text recommendation index arrays for administrative auto-completions.
 */
export async function GET() {
  try {
    const recommendations = await backendClient.get<AdminSuggestion[]>(BACKEND_ENDPOINTS.ADMIN.SUGGESTIONS);
    return NextResponse.json(recommendations);
  } catch (error: unknown) {
    const err = error as { status?: number; message?: string };
    return NextResponse.json(
      { status: err.status || 500, message: err.message || 'Failed to compile index lookups.' },
      { status: err.status || 500 }
    );
  }
}