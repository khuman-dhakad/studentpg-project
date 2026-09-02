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

        const isProcessing = isApproving || isRejecting;

        return (
          <div
            key={item.id}
            className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5"
          >
            {/* HEADER */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-base font-black text-slate-900">
                    {item.pgName}
                  </h3>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                      item.approvalStatus === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.approvalStatus === 'REJECTED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.approvalStatus}
                  </span>
                </div>

                <div className="grid gap-2 text-xs text-slate-600 sm:grid-cols-2 lg:grid-cols-4">
                  <p><strong className="text-slate-900 font-bold">City:</strong> {item.city}</p>
                  <p><strong className="text-slate-900 font-bold">Rent:</strong> ₹{item.rent}/mo</p>
                  <p><strong className="text-slate-900 font-bold">Gender:</strong> {item.gender}</p>
                  <p><strong className="text-slate-900 font-bold">PG ID:</strong> <span className="font-mono text-[11px]">{item.id}</span></p>
                </div>

                {item.approvalStatus === 'REJECTED' && item.rejectionReason && (
                  <div className="mt-2 rounded-xl border border-rose-200 bg-rose-50 p-3">
                    <p className="text-xs font-bold text-rose-800">Rejection Reason</p>
                    <p className="mt-0.5 text-xs text-rose-700 font-medium">{item.rejectionReason}</p>
                  </div>
                )}
              </div>

              {/* ACTIONS */}
              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedPG(item)}
                  className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 shadow-xs transition hover:bg-slate-50 cursor-pointer"
                >
                  View Full Details
                </button>

                {status === 'PENDING' && (
                  <>
                    <button
                      type="button"
                      onClick={() => approve(item.id)}
                      disabled={isProcessing}
                      className="rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                    >
                      {isApproving ? 'Approving...' : 'Approve PG'}
                    </button>

                    <button
                      type="button"
                      onClick={() => openRejectDialog(item.id)}
                      disabled={isProcessing}
                      className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* REJECTION PANEL */}
            {status === 'PENDING' && rejectingId === item.id && (
              <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50/70 p-4">
                <label className="mb-1.5 block text-xs font-black text-rose-900 tracking-wide">
                  Official Rejection Reason <span className="text-rose-600">*</span>
                </label>

                <textarea
                  value={rejectReason}
                  onChange={event => setRejectReason(event.target.value)}
                  placeholder="Explain why this PG listing is being rejected (e.g. missing license, blurred photos)..."
                  rows={3}
                  maxLength={1000}
                  className="w-full rounded-xl border border-rose-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-rose-500 placeholder:text-slate-400"
                />

                <p className="mt-1 text-right text-[10px] font-bold text-rose-600">
                  {rejectReason.length}/1000 characters
                </p>

                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={reject}
                    disabled={isRejecting || !rejectReason.trim()}
                    className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                  >
                    {isRejecting ? 'Rejecting...' : 'Confirm Rejection'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRejectingId(null);
                      setRejectReason('');
                      setError(null);
                    }}
                    disabled={isRejecting}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
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
        <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center">
          <p className="text-sm font-black text-slate-900">
            No Listings Found
          </p>
          <p className="mt-1 text-xs font-medium text-slate-500">
            There are currently no listings in this category.
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