import { NextRequest, NextResponse } from 'next/server';

import { backendClient } from '@/api/backendClient';
import { BACKEND_ENDPOINTS } from '@/api/endpoints';

interface RejectRequestBody {
  reason?: unknown;
}

interface AdminActionResponse {
  message?: string;
}

interface BackendError {
  status?: number;
  message?: string;
}

const MAX_REJECTION_REASON_LENGTH = 1000;

export async function POST(
  request: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    /*
     * =====================================================
     * GET PG ID
     * =====================================================
     */

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

    /*
     * =====================================================
     * PARSE REQUEST BODY
     * =====================================================
     */

    let body: RejectRequestBody;

    try {
      body =
        (await request.json()) as RejectRequestBody;

    } catch {
      return NextResponse.json(
        {
          message: 'Invalid JSON request body.',
        },
        {
          status: 400,
        }
      );
    }

    /*
     * =====================================================
     * VALIDATE REJECTION REASON
     * =====================================================
     */

    const reason =
      typeof body.reason === 'string'
        ? body.reason.trim()
        : '';

    if (!reason) {
      return NextResponse.json(
        {
          message:
            'Rejection reason is required.',
        },
        {
          status: 400,
        }
      );
    }

    if (
      reason.length >
      MAX_REJECTION_REASON_LENGTH
    ) {
      return NextResponse.json(
        {
          message:
            `Rejection reason cannot exceed ${MAX_REJECTION_REASON_LENGTH} characters.`,
        },
        {
          status: 400,
        }
      );
    }

    /*
     * =====================================================
     * CALL SPRING BOOT BACKEND
     *
     * POST /api/admin/pgs/{id}/reject
     *
     * Body:
     * {
     *   "reason": "..."
     * }
     * =====================================================
     */

    const response =
      await backendClient.post<AdminActionResponse>(
        BACKEND_ENDPOINTS.ADMIN.REJECT_PG(id),
        {
          reason,
        }
      );

    /*
     * =====================================================
     * SUCCESS RESPONSE
     * =====================================================
     */

    return NextResponse.json(
      {
        message:
          response?.message ??
          'PG rejected successfully.',
      },
      {
        status: 200,
      }
    );

  } catch (error: unknown) {

    console.error(
      'Admin reject PG error:',
      error
    );

    /*
     * =====================================================
     * EXTRACT BACKEND STATUS
     * =====================================================
     */

    const status =
      typeof error === 'object' &&
      error !== null &&
      'status' in error &&
      typeof (
        error as BackendError
      ).status === 'number'
        ? (
            error as BackendError
          ).status!
        : 500;

    /*
     * =====================================================
     * EXTRACT ERROR MESSAGE
     * =====================================================
     */

    const message =
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof (
        error as BackendError
      ).message === 'string'
        ? (
            error as BackendError
          ).message!
        : 'Failed to reject PG.';

    /*
     * =====================================================
     * ERROR RESPONSE
     * =====================================================
     */

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