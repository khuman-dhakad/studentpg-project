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
    <main
      className="
        mx-auto
        flex
        max-w-7xl
        flex-col
        gap-8
        px-4
        py-8
        sm:px-6
        lg:px-8
      "
    >

      <OwnerVerificationQueue />

      {/* =================================================
          HEADER
      ================================================= */}

      <section
        className="
          rounded-3xl
          border
          border-line
          bg-surface
          p-8
          shadow-sm
        "
      >

        <p
          className="
            text-sm
            font-bold
            uppercase
            tracking-[0.25em]
            text-brand
          "
        >
          Admin Oversight
        </p>

        <h1
          className="
            mt-3
            font-display
            text-3xl
            font-black
            text-ink
          "
        >
          Curate the premium network.
        </h1>

        <p
          className="
            mt-3
            max-w-2xl
            text-sm
            leading-7
            text-ink-soft
          "
        >
          Review and manage every PG listing submitted to the
          StudentPG platform.
        </p>

      </section>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <section
          className="
            rounded-2xl
            border
            border-red-200
            bg-red-50
            p-4
            text-sm
            font-semibold
            text-red-700
          "
        >

          <div
            className="
              flex
              flex-col
              gap-3
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            <span>
              {error}
            </span>

            <button
              type="button"
              onClick={() => {
                window.location.reload();
              }}
              className="
                w-fit
                rounded-lg
                underline
              "
            >
              Retry
            </button>

          </div>

        </section>
      )}

      {/* =================================================
          STATS
      ================================================= */}

      <section
        className="
          grid
          gap-4
          md:grid-cols-4
        "
      >

        {/* TOTAL */}

        <button
          type="button"
          onClick={() =>
            handleStatusChange(
              'ALL'
            )
          }
          className={`
            rounded-2xl
            border
            bg-surface
            p-5
            text-left
            shadow-sm
            transition
            hover:-translate-y-1
            hover:shadow-md
            ${
              selectedStatus ===
              'ALL'
                ? 'border-brand ring-2 ring-brand/20'
                : 'border-line'
            }
          `}
        >

          <p
            className="
              text-sm
              font-semibold
              text-ink-soft
            "
          >
            Total Listings
          </p>

          <p
            className="
              mt-2
              font-display
              text-3xl
              font-black
              text-ink
            "
          >
            {isLoading
              ? '—'
              : stats.total}
          </p>

          <p
            className="
              mt-2
              text-xs
              font-bold
              text-brand
            "
          >
            View all listings →
          </p>

        </button>

        {/* PENDING */}

        <button
          type="button"
          onClick={() =>
            handleStatusChange(
              'PENDING'
            )
          }
          className={`
            rounded-2xl
            border
            bg-surface
            p-5
            text-left
            shadow-sm
            transition
            hover:-translate-y-1
            hover:shadow-md
            ${
              selectedStatus ===
              'PENDING'
                ? 'border-yellow-500 ring-2 ring-yellow-500/20'
                : 'border-line'
            }
          `}
        >

          <p
            className="
              text-sm
              font-semibold
              text-ink-soft
            "
          >
            Pending Review
          </p>

          <p
            className="
              mt-2
              font-display
              text-3xl
              font-black
              text-ink
            "
          >
            {isLoading
              ? '—'
              : stats.pending}
          </p>

          <p
            className="
              mt-2
              text-xs
              font-bold
              text-yellow-600
            "
          >
            Review pending PGs →
          </p>

        </button>

        {/* APPROVED */}

        <button
          type="button"
          onClick={() =>
            handleStatusChange(
              'APPROVED'
            )
          }
          className={`
            rounded-2xl
            border
            bg-surface
            p-5
            text-left
            shadow-sm
            transition
            hover:-translate-y-1
            hover:shadow-md
            ${
              selectedStatus ===
              'APPROVED'
                ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                : 'border-line'
            }
          `}
        >

          <p
            className="
              text-sm
              font-semibold
              text-ink-soft
            "
          >
            Approved
          </p>

          <p
            className="
              mt-2
              font-display
              text-3xl
              font-black
              text-ink
            "
          >
            {isLoading
              ? '—'
              : stats.approved}
          </p>

          <p
            className="
              mt-2
              text-xs
              font-bold
              text-emerald-600
            "
          >
            View approved PGs →
          </p>

        </button>

        {/* REJECTED */}

        <button
          type="button"
          onClick={() =>
            handleStatusChange(
              'REJECTED'
            )
          }
          className={`
            rounded-2xl
            border
            bg-surface
            p-5
            text-left
            shadow-sm
            transition
            hover:-translate-y-1
            hover:shadow-md
            ${
              selectedStatus ===
              'REJECTED'
                ? 'border-red-500 ring-2 ring-red-500/20'
                : 'border-line'
            }
          `}
        >

          <p
            className="
              text-sm
              font-semibold
              text-ink-soft
            "
          >
            Rejected
          </p>

          <p
            className="
              mt-2
              font-display
              text-3xl
              font-black
              text-ink
            "
          >
            {isLoading
              ? '—'
              : stats.rejected}
          </p>

          <p
            className="
              mt-2
              text-xs
              font-bold
              text-red-600
            "
          >
            View rejected PGs →
          </p>

        </button>

      </section>

      {/* =================================================
          PG LIST
      ================================================= */}

      <section
        className="
          rounded-2xl
          border
          border-line
          bg-surface
          p-6
          shadow-sm
        "
      >

        <div
          className="
            flex
            flex-col
            gap-3
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          <div>

            <h2
              className="
                font-display
                text-2xl
                font-bold
                text-ink
              "
            >
              {getStatusTitle()}
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-ink-soft
              "
            >
              {pgs.length} listing
              {pgs.length !== 1
                ? 's'
                : ''}{' '}
              found
            </p>

          </div>

          <button
            type="button"
            onClick={() => {
              window.location.reload();
            }}
            disabled={
              isLoading ||
              isLoadingPGs
            }
            className="
              rounded-xl
              border
              border-line
              px-4
              py-2
              text-sm
              font-semibold
              text-ink
              transition
              hover:bg-cream
              disabled:opacity-50
            "
          >
            {isLoadingPGs
              ? 'Loading...'
              : 'Refresh'}
          </button>

        </div>

        <div
          className="
            mt-6
          "
        >

          {isLoadingPGs ? (

            <div
              className="
                rounded-xl
                border
                border-line
                p-8
                text-center
                text-sm
                text-ink-soft
              "
            >
              Loading PG listings...
            </div>

          ) : pgs.length === 0 ? (

            <div
              className="
                rounded-xl
                border
                border-line
                p-8
                text-center
              "
            >

              <p
                className="
                  font-semibold
                  text-ink
                "
              >
                No{' '}
                {selectedStatus.toLowerCase()}{' '}
                listings found.
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  text-ink-soft
                "
              >
                There are currently no PG listings in this category.
              </p>

            </div>

          ) : (

            <AdminPGList
              initialItems={
                pgs
              }
              onActionCompleted={
                handleActionCompleted
              }
              status={
                selectedStatus
              }
            />

          )}

        </div>

      </section>

    </main>
  );
}