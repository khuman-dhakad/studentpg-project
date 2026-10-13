import { NextRequest, NextResponse } from 'next/server';

import { backendClient } from '@/api/backendClient';
import { BACKEND_ENDPOINTS } from '@/api/endpoints';

interface AdminActionResponse {
  message?: string;
}

interface BackendError {
  status?: number;
  message?: string;
}

async function handleApprove(
  _request: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id: rawId } = await context.params;
    const id = rawId?.trim();

    if (!id) {
      return NextResponse.json(
        {
          message: 'PG ID is required.',
        },
        {
          status: 400,
        }
      );
    }

    const response = await backendClient.put<AdminActionResponse>(
      BACKEND_ENDPOINTS.ADMIN.APPROVE_PG(id),
      {}
    );

    return NextResponse.json(
      {
        message: response?.message ?? 'PG approved successfully.',
      },
      {
        status: 200,
      }
    );
  } catch (error: unknown) {
    console.error('Admin approve PG error:', error);

    const status =
      typeof error === 'object' &&
      error !== null &&
      'status' in error &&
      typeof (error as BackendError).status === 'number'
        ? (error as BackendError).status!
        : 500;

    const message =
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof (error as BackendError).message === 'string'
        ? (error as BackendError).message!
        : 'Failed to approve PG.';

    return NextResponse.json(
      {
        message,
      },
      {
        status,
      }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  return handleApprove(request, context);
}

export async function PATCH(
  request: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  return handleApprove(request, context);
}