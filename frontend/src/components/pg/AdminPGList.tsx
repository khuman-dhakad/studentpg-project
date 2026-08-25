'use client';

import { useEffect, useState } from 'react';
import type { PG } from '@/types/pg.types';
import { BACKEND_ENDPOINTS } from '@/api/endpoints';
import { PGDetailsModal } from './PGDetailsModal';

interface AdminPGListProps {
  initialItems?: PG[];

  onActionCompleted?: () =>
    | void
    | Promise<void>;

  status?: 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED';
}

type ActionState = {
  id: string | null;
  type: 'approve' | 'reject' | null;
};

export function AdminPGList({
  initialItems = [],
  onActionCompleted,
  status = 'PENDING',
}: AdminPGListProps) {

  const [items, setItems] =
    useState<PG[]>(initialItems);

  const [selectedPG, setSelectedPG] =
    useState<PG | null>(null);

  const [actionState, setActionState] =
    useState<ActionState>({
      id: null,
      type: null,
    });

  const [error, setError] =
    useState<string | null>(null);

  const [rejectingId, setRejectingId] =
    useState<string | null>(null);

  const [rejectReason, setRejectReason] =
    useState('');

  /*
   * =====================================================
   * SYNC ITEMS
   * =====================================================
   */

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  /*
   * =====================================================
   * APPROVE
   * =====================================================
   */

  const approve = async (
    id: string
  ) => {

    setError(null);

    setActionState({
      id,
      type: 'approve',
    });

    try {

      const response = await fetch(
        BACKEND_ENDPOINTS.ADMIN.APPROVE_PG(id),
        {
          method: 'PUT',
          credentials: 'include',
        }
      );

      const data =
        await response.text();

      if (!response.ok) {
        throw new Error(
          data ||
          'Failed to approve PG listing.'
        );
      }

      setItems(
        currentItems =>
          currentItems.filter(
            item => item.id !== id
          )
      );

      setSelectedPG(null);

      await onActionCompleted?.();

    } catch (error) {

      console.error(
        'Admin approval failed:',
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : 'Failed to approve PG listing.'
      );

    } finally {

      setActionState({
        id: null,
        type: null,
      });

    }

  };

  /*
   * =====================================================
   * OPEN REJECT DIALOG
   * =====================================================
   */

  const openRejectDialog = (
    id: string
  ) => {

    setRejectingId(id);
    setRejectReason('');
    setError(null);

  };

  /*
   * =====================================================
   * REJECT
   * =====================================================
   */

  const reject = async () => {

    if (!rejectingId) {
      return;
    }

    const trimmedReason =
      rejectReason.trim();

    if (!trimmedReason) {

      setError(
        'Please provide a rejection reason.'
      );

      return;

    }

    setError(null);

    setActionState({
      id: rejectingId,
      type: 'reject',
    });

    try {

      const response = await fetch(
        BACKEND_ENDPOINTS.ADMIN.REJECT_PG(rejectingId),
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            reason: trimmedReason,
          }),
        }
      );

      const data =
        await response.text();

      if (!response.ok) {
        throw new Error(
          data ||
          'Failed to reject PG listing.'
        );
      }

      setItems(
        currentItems =>
          currentItems.filter(
            item =>
              item.id !== rejectingId
          )
      );

      setRejectingId(null);
      setRejectReason('');
      setSelectedPG(null);

      await onActionCompleted?.();

    } catch (error) {

      console.error(
        'Admin rejection failed:',
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : 'Failed to reject PG listing.'
      );

    } finally {

      setActionState({
        id: null,
        type: null,
      });

    }

  };

  /*
   * =====================================================
   * RENDER
   * =====================================================
   */

  return (

    <div className="space-y-5">

      {error && (
        <div className="rounded-xl border border-danger/20 bg-danger-soft/10 p-4 text-sm font-medium text-danger">
          {error}
        </div>
      )}

      {items.map(item => {

        const isApproving =
          actionState.id === item.id &&
          actionState.type === 'approve';

        const isRejecting =
          actionState.id === item.id &&
          actionState.type === 'reject';

        const isProcessing =
          isApproving ||
          isRejecting;

        return (

          <div
            key={item.id}
            className="rounded-2xl border border-line bg-cream p-5"
          >

            {/* HEADER */}

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div className="space-y-2">

                <div className="flex flex-wrap items-center gap-3">

                  <h3 className="text-lg font-bold text-ink">
                    {item.pgName}
                  </h3>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      item.approvalStatus === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.approvalStatus === 'REJECTED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {item.approvalStatus}
                  </span>

                </div>

                <div className="grid gap-1 text-sm text-ink-soft sm:grid-cols-2 lg:grid-cols-4">

                  <p>
                    <strong>City:</strong>{' '}
                    {item.city}
                  </p>

                  <p>
                    <strong>Rent:</strong>{' '}
                    ₹{item.rent}
                  </p>

                  <p>
                    <strong>Gender:</strong>{' '}
                    {item.gender}
                  </p>

                  <p>
                    <strong>ID:</strong>{' '}
                    {item.id}
                  </p>

                </div>

                {item.approvalStatus === 'REJECTED' &&
                  item.rejectionReason && (

                    <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3">

                      <p className="text-xs font-bold text-red-700">
                        Rejection Reason
                      </p>

                      <p className="mt-1 text-sm text-red-600">
                        {item.rejectionReason}
                      </p>

                    </div>

                  )}

              </div>

              {/* ACTIONS */}

              <div className="flex flex-wrap gap-3">

                <button
                  type="button"
                  onClick={() =>
                    setSelectedPG(item)
                  }
                  className="rounded-xl border border-line px-4 py-2.5 text-sm font-bold text-ink transition hover:bg-surface"
                >
                  View Full Details
                </button>

                {status === 'PENDING' && (

                  <>

                    <button
                      type="button"
                      onClick={() =>
                        approve(item.id)
                      }
                      disabled={isProcessing}
                      className="rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-cream transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isApproving
                        ? 'Approving...'
                        : 'Approve'}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        openRejectDialog(
                          item.id
                        )
                      }
                      disabled={isProcessing}
                      className="rounded-xl border border-danger/30 px-4 py-2.5 text-sm font-bold text-danger transition hover:bg-danger-soft/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Reject
                    </button>

                  </>

                )}

              </div>

            </div>

            {/* REJECTION PANEL */}

            {status === 'PENDING' &&
              rejectingId === item.id && (

                <div className="mt-5 rounded-xl border border-danger/20 bg-danger-soft/10 p-4">

                  <label className="mb-2 block text-sm font-bold text-ink">
                    Rejection Reason
                  </label>

                  <textarea
                    value={rejectReason}
                    onChange={event =>
                      setRejectReason(
                        event.target.value
                      )
                    }
                    placeholder="Explain why this PG listing is being rejected..."
                    rows={4}
                    maxLength={1000}
                    className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink outline-none focus:border-danger"
                  />

                  <p className="mt-1 text-right text-xs text-ink-soft">
                    {rejectReason.length}/1000
                  </p>

                  <div className="mt-3 flex gap-3">

                    <button
                      type="button"
                      onClick={reject}
                      disabled={
                        isRejecting ||
                        !rejectReason.trim()
                      }
                      className="rounded-xl bg-danger px-4 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isRejecting
                        ? 'Rejecting...'
                        : 'Confirm Rejection'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setRejectingId(null);
                        setRejectReason('');
                        setError(null);
                      }}
                      disabled={isRejecting}
                      className="rounded-xl border border-line px-4 py-2.5 text-sm font-bold text-ink"
                    >
                      Cancel
                    </button>

                  </div>

                </div>

              )}

          </div>

        );

      })}

      {!items.length && (

        <div className="rounded-2xl border border-dashed border-line p-8 text-center">

          <p className="text-lg font-bold text-ink">
            No Listings Found
          </p>

          <p className="mt-2 text-sm text-ink-soft">
            There are no listings in this category.
          </p>

        </div>

      )}

      {selectedPG && (

        <PGDetailsModal
          pg={selectedPG}
          onClose={() =>
            setSelectedPG(null)
          }
          onApprove={
            status === 'PENDING'
              ? approve
              : undefined
          }
          onReject={
            status === 'PENDING'
              ? openRejectDialog
              : undefined
          }
        />

      )}

    </div>

  );
}