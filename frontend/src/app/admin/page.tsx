'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import type { PG } from '@/types/pg.types';

import { AdminPGList } from '@/components/pg/AdminPGList';
import { OwnerVerificationQueue } from '@/components/admin/OwnerVerificationQueue';
import { BACKEND_ENDPOINTS } from '@/api/endpoints';
import { BACKEND_API_URL } from '@/constants/config';

/* =====================================================
   TYPES
===================================================== */

type AdminStats = {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
};

type PGStatus =
  | 'ALL'
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED';

/* =====================================================
   CONFIGURATION
===================================================== */

const BACKEND_URL = BACKEND_API_URL;

/* =====================================================
   ERROR TYPE
===================================================== */

type ApiErrorResponse = {
  message?: string;
  error?: string;
  success?: boolean;
};

/* =====================================================
   ADMIN DASHBOARD
===================================================== */

export default function AdminDashboardPage() {
  /* ===================================================
     STATE
  =================================================== */

  const [
    stats,
    setStats,
  ] = useState<AdminStats>({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });

  const [
    selectedStatus,
    setSelectedStatus,
  ] = useState<PGStatus>(
    'PENDING'
  );

  const [
    pgs,
    setPgs,
  ] = useState<PG[]>([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

 const [isLoadingPGs] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null
  );

  /*
   * Prevent stale requests from
   * updating the UI.
   */

  const requestIdRef =
    useRef(0);

  /* ===================================================
     API ERROR PARSER
  =================================================== */

  const getApiErrorMessage =
    useCallback(
      async (
        response: Response,
        fallbackMessage: string
      ): Promise<string> => {
        try {
          const data =
            (await response.json()) as
              | ApiErrorResponse
              | undefined;

          return (
            data?.message ||
            data?.error ||
            fallbackMessage
          );
        } catch {
          return fallbackMessage;
        }
      },
      []
    );

  /* ===================================================
     LOAD ADMIN STATISTICS
  =================================================== */

  const loadStats =
    useCallback(
      async (
        signal?: AbortSignal
      ) => {
        const response =
          await fetch(
            `${BACKEND_URL}${BACKEND_ENDPOINTS.ADMIN.STATS}`,
            {
              method: 'GET',

              credentials:
                'include',

              cache:
                'no-store',

              headers: {
                Accept:
                  'application/json',
              },

              signal,
            }
          );

        if (!response.ok) {
          const message =
            await getApiErrorMessage(
              response,
              'Failed to load admin statistics.'
            );

          throw new Error(
            message
          );
        }

        const data =
          (await response.json()) as Partial<AdminStats>;

        setStats({
          total:
            data?.total ??
            0,

          approved:
            data?.approved ??
            0,

          pending:
            data?.pending ??
            0,

          rejected:
            data?.rejected ??
            0,
        });
      },
      [
        getApiErrorMessage,
      ]
    );

  /* ===================================================
     LOAD PG LISTINGS
  =================================================== */

  const loadPGs =
    useCallback(
      async (
        status: PGStatus,
        signal?: AbortSignal
      ) => {
        const params =
          new URLSearchParams({
            status,
            page: '0',
            size: '100',
          });

        const response =
          await fetch(
            `${BACKEND_URL}${BACKEND_ENDPOINTS.ADMIN.PGS}?${params.toString()}`,
            {
              method: 'GET',

              credentials:
                'include',

              cache:
                'no-store',

              headers: {
                Accept:
                  'application/json',
              },

              signal,
            }
          );

        if (!response.ok) {
          const message =
            await getApiErrorMessage(
              response,
              `Failed to load ${status.toLowerCase()} PG listings.`
            );

          throw new Error(
            message
          );
        }

        const data =
          await response.json();

        const items =
          Array.isArray(data)
            ? data
            : data?.content ?? [];

        setPgs(
          Array.isArray(items)
            ? items
            : []
        );
      },
      [
        getApiErrorMessage,
      ]
    );

  /* ===================================================
     LOAD DASHBOARD
  =================================================== */

  // const loadDashboard =
  //   useCallback(
  //     async () => {
  //       const requestId =
  //         ++requestIdRef.current;

  //       const controller =
  //         new AbortController();

  //       try {
  //         setIsLoading(
  //           true
  //         );

  //         setError(
  //           null
  //         );

  //         /*
  //          * Load stats and PGs
  //          * concurrently.
  //          */

  //         await Promise.all([
  //           loadStats(
  //             controller.signal
  //           ),

  //           loadPGs(
  //             selectedStatus,
  //             controller.signal
  //           ),
  //         ]);

  //         /*
  //          * Ignore stale request.
  //          */

  //         if (
  //           requestId !==
  //           requestIdRef.current
  //         ) {
  //           return;
  //         }
  //       } catch (error) {
  //         /*
  //          * Abort is expected when
  //          * the component unmounts
  //          * or a newer request starts.
  //          */

  //         if (
  //           error instanceof DOMException &&
  //           error.name === 'AbortError'
  //         ) {
  //           return;
  //         }

  //         console.error(
  //           'Admin dashboard loading failed:',
  //           error
  //         );

  //         if (
  //           requestId !==
  //           requestIdRef.current
  //         ) {
  //           return;
  //         }

  //         setError(
  //           error instanceof Error
  //             ? error.message
  //             : 'Unable to load admin dashboard.'
  //         );
  //       } finally {
  //         if (
  //           requestId ===
  //           requestIdRef.current
  //         ) {
  //           setIsLoading(
  //             false
  //           );
  //         }
  //       }

  //       return () => {
  //         controller.abort();
  //       };
  //     },
  //     [
  //       loadStats,
  //       loadPGs,
  //       selectedStatus,
  //     ]
  //   );

  /* ===================================================
     INITIAL LOAD
  =================================================== */

  useEffect(() => {
    let active =
      true;

    const controller =
      new AbortController();

    const run =
      async () => {
        const requestId =
          ++requestIdRef.current;

        try {
          setIsLoading(
            true
          );

          setError(
            null
          );

          await Promise.all([
            loadStats(
              controller.signal
            ),

            loadPGs(
              selectedStatus,
              controller.signal
            ),
          ]);

          if (
            !active ||
            requestId !==
              requestIdRef.current
          ) {
            return;
          }
        } catch (error) {
          if (
            error instanceof DOMException &&
            error.name === 'AbortError'
          ) {
            return;
          }

          console.error(
            'Admin dashboard loading failed:',
            error
          );

          if (
            !active
          ) {
            return;
          }

          setError(
            error instanceof Error
              ? error.message
              : 'Unable to load admin dashboard.'
          );
        } finally {
          if (
            active
          ) {
            setIsLoading(
              false
            );
          }
        }
      };

    run();

    return () => {
      active =
        false;

      controller.abort();
    };
  }, [
    loadStats,
    loadPGs,
    selectedStatus,
  ]);

  /* ===================================================
     STATUS CHANGE
  =================================================== */

  const handleStatusChange =
    useCallback(
      (
        status: PGStatus
      ) => {
        setSelectedStatus(
          status
        );
      },
      []
    );

  /* ===================================================
     AFTER APPROVE / REJECT
  =================================================== */

  const handleActionCompleted =
    useCallback(
      async () => {
        try {
          setError(
            null
          );

          await loadStats();

          await loadPGs(
            selectedStatus
          );
        } catch (error) {
          console.error(
            'Admin action refresh failed:',
            error
          );

          setError(
            error instanceof Error
              ? error.message
              : 'Unable to refresh dashboard.'
          );
        }
      },
      [
        loadStats,
        loadPGs,
        selectedStatus,
      ]
    );

  /* ===================================================
     STATUS TITLE
  =================================================== */

  const getStatusTitle =
    () => {
      switch (
        selectedStatus
      ) {
        case 'ALL':
          return 'All PG Listings';

        case 'PENDING':
          return 'Pending Approvals';

        case 'APPROVED':
          return 'Approved PG Listings';

        case 'REJECTED':
          return 'Rejected PG Listings';

        default:
          return 'PG Listings';
      }
    };

  /* ===================================================
     UI
  =================================================== */

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8 antialiased">
      <OwnerVerificationQueue />

      {/* HEADER */}
      <section className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-black tracking-widest text-emerald-700 uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 inline-block mb-2">
              ADMIN CONTROL CENTER
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Listing Moderation &amp; Verification Desk
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium max-w-2xl">
              Audit, approve, or reject Paying Guest accommodations submitted by owners in Bhopal.
            </p>
          </div>

          <button
            type="button"
            onClick={() => window.location.reload()}
            disabled={isLoading || isLoadingPGs}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isLoadingPGs ? 'Refreshing...' : 'Refresh All Records'}
          </button>
        </div>
      </section>

      {/* ERROR */}
      {error && (
        <section className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700 flex items-center justify-between gap-4">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="underline font-bold cursor-pointer"
          >
            Retry
          </button>
        </section>
      )}

      {/* STATS TILES */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* TOTAL */}
        <button
          type="button"
          onClick={() => handleStatusChange('ALL')}
          className={`rounded-2xl border p-5 text-left shadow-xs transition-all hover:-translate-y-0.5 cursor-pointer ${
            selectedStatus === 'ALL'
              ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-600/20'
              : 'border-slate-200/80 bg-white hover:border-slate-300'
          }`}
        >
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Listings</p>
          <p className="mt-1.5 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {isLoading ? '—' : stats.total}
          </p>
          <p className="mt-2 text-[11px] font-bold text-emerald-700">View all properties →</p>
        </button>

        {/* PENDING */}
        <button
          type="button"
          onClick={() => handleStatusChange('PENDING')}
          className={`rounded-2xl border p-5 text-left shadow-xs transition-all hover:-translate-y-0.5 cursor-pointer ${
            selectedStatus === 'PENDING'
              ? 'border-amber-500 bg-amber-50/40 ring-2 ring-amber-500/20'
              : 'border-slate-200/80 bg-white hover:border-slate-300'
          }`}
        >
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Review</p>
          <p className="mt-1.5 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {isLoading ? '—' : stats.pending}
          </p>
          <p className="mt-2 text-[11px] font-bold text-amber-700">Audit pending listings →</p>
        </button>

        {/* APPROVED */}
        <button
          type="button"
          onClick={() => handleStatusChange('APPROVED')}
          className={`rounded-2xl border p-5 text-left shadow-xs transition-all hover:-translate-y-0.5 cursor-pointer ${
            selectedStatus === 'APPROVED'
              ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-600/20'
              : 'border-slate-200/80 bg-white hover:border-slate-300'
          }`}
        >
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Approved &amp; Live</p>
          <p className="mt-1.5 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {isLoading ? '—' : stats.approved}
          </p>
          <p className="mt-2 text-[11px] font-bold text-emerald-700">View active listings →</p>
        </button>

        {/* REJECTED */}
        <button
          type="button"
          onClick={() => handleStatusChange('REJECTED')}
          className={`rounded-2xl border p-5 text-left shadow-xs transition-all hover:-translate-y-0.5 cursor-pointer ${
            selectedStatus === 'REJECTED'
              ? 'border-rose-500 bg-rose-50/40 ring-2 ring-rose-500/20'
              : 'border-slate-200/80 bg-white hover:border-slate-300'
          }`}
        >
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Rejected</p>
          <p className="mt-1.5 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {isLoading ? '—' : stats.rejected}
          </p>
          <p className="mt-2 text-[11px] font-bold text-rose-700">View declined submissions →</p>
        </button>
      </section>

      {/* PG LIST */}
      <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">{getStatusTitle()}</h2>
            <p className="text-xs font-medium text-slate-500">
              {pgs.length} listing{pgs.length !== 1 ? 's' : ''} in this view
            </p>
          </div>
        </div>

        <div className="mt-6">
          {isLoadingPGs ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-xs font-semibold text-slate-500">
              Loading PG listings...
            </div>
          ) : pgs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center">
              <p className="text-sm font-black text-slate-900">
                No {selectedStatus.toLowerCase()} listings found.
              </p>
              <p className="mt-1 text-xs font-medium text-slate-500">
                There are currently no PG listings in this filter category.
              </p>
            </div>
          ) : (
            <AdminPGList
              initialItems={pgs}
              onActionCompleted={handleActionCompleted}
              status={selectedStatus}
            />
          )}
        </div>
      </section>
    </main>
  );
}