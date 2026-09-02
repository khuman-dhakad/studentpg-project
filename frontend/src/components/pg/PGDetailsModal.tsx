'use client';

import Image from 'next/image';
import type { PG } from '@/types/pg.types';

interface PGDetailsModalProps {
  pg: PG;
  onClose: () => void;
  onApprove?: (id: string) => void | Promise<void>;
  onReject?: (id: string) => void | Promise<void>;
}

export function PGDetailsModal({
  pg,
  onClose,
  onApprove,
  onReject,
}: PGDetailsModalProps) {
  const isPending = pg.approvalStatus === 'PENDING';

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs p-4 antialiased"
      onClick={onClose}
    >
      <div
        className="mx-auto my-6 max-w-5xl rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-8 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="truncate text-xl sm:text-2xl font-black text-slate-900">
                {pg.pgName}
              </h2>

              <StatusBadge status={pg.approvalStatus} />
            </div>

            <p className="mt-1 text-xs font-mono text-slate-400">
              PG ID: {pg.id}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="shrink-0 rounded-xl p-2 text-xl font-bold text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* =====================================================
            IMAGES
        ====================================================== */}

        <section className="mt-6">
          <SectionTitle title="Property Photographs" />

          {pg.images?.length > 0 ? (
            <div className="mt-3 grid grid-cols-2 gap-4 md:grid-cols-4">
              {pg.images.map((image, index) => (
                <div
                  key={image.id ?? image.publicId ?? index}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-xs"
                >
                  <Image
                    src={image.url}
                    alt={`${pg.pgName} image ${index + 1}`}
                    width={400}
                    height={240}
                    className="h-36 w-full object-cover transition duration-300 hover:scale-105"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-3 rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs font-medium text-slate-400">
              No images uploaded for this listing.
            </div>
          )}
        </section>

        {/* =====================================================
            BASIC INFORMATION
        ====================================================== */}

        <section className="mt-6">
          <SectionTitle title="PG Information" />

          <div className="mt-3 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <Detail
              label="Category"
              value={pg.category}
            />

            <Detail
              label="Gender"
              value={pg.gender}
            />

            <Detail
              label="Room Type"
              value={pg.roomType}
            />

            <Detail
              label="Monthly Rent"
              value={formatCurrency(pg.rent)}
            />

            <Detail
              label="Security Deposit"
              value={formatCurrency(pg.securityDeposit)}
            />

            <Detail
              label="Notice Period"
              value={pg.noticePeriod}
            />
          </div>
        </section>

        {/* =====================================================
            LOCATION
        ====================================================== */}

        <section className="mt-6">
          <SectionTitle title="Location" />

          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <Detail
              label="Address"
              value={pg.address}
            />

            <Detail
              label="Landmark"
              value={pg.landmark}
            />

            <Detail
              label="City"
              value={pg.city}
            />

            <Detail
              label="State"
              value={pg.state}
            />

            <Detail
              label="Pincode"
              value={pg.pincode}
            />
          </div>
        </section>

        {/* =====================================================
            AMENITIES
        ====================================================== */}

        <section className="mt-6">
          <SectionTitle title="Amenities" />

          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Amenity
              label="Food Available"
              value={pg.foodAvailable}
            />

            <Amenity
              label="WiFi"
              value={pg.wifiAvailable}
            />

            <Amenity
              label="Parking"
              value={pg.parkingAvailable}
            />

            <Amenity
              label="Laundry"
              value={pg.laundryAvailable}
            />

            <Amenity
              label="AC"
              value={pg.acAvailable}
            />

            <Amenity
              label="Power Backup"
              value={pg.powerBackup}
            />
          </div>
        </section>

        {/* =====================================================
            DESCRIPTION
        ====================================================== */}
        <section className="mt-6">
          <SectionTitle title="Property Overview" />

          <p className="mt-2.5 rounded-xl border border-slate-200/80 bg-slate-50 p-4 text-xs font-medium leading-relaxed text-slate-700">
            {pg.description?.trim() || 'No description provided.'}
          </p>
        </section>

        {/* =====================================================
            APPROVAL INFORMATION
        ====================================================== */}

        {pg.approvalStatus === 'APPROVED' && (
          <section className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5">
            <h3 className="text-sm font-black text-emerald-900">
              Approval Verification Details
            </h3>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Detail
                label="Approved By Admin ID"
                value={pg.approvedBy}
              />

              <Detail
                label="Approval Timestamp"
                value={formatDate(pg.approvedAt)}
              />
            </div>
          </section>
        )}

        {/* =====================================================
            REJECTION INFORMATION
        ====================================================== */}

        {pg.approvalStatus === 'REJECTED' && (
          <section className="mt-6 rounded-2xl border border-rose-200 bg-rose-50/60 p-5">
            <h3 className="text-sm font-black text-rose-900">
              Rejection Notice
            </h3>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Detail
                label="Rejected By Admin ID"
                value={pg.rejectedBy}
              />

              <Detail
                label="Rejection Timestamp"
                value={formatDate(pg.rejectedAt)}
              />
            </div>

            <div className="mt-3">
              <Detail
                label="Official Reason"
                value={pg.rejectionReason}
              />
            </div>
          </section>
        )}

        {/* =====================================================
            ACTIONS
        ====================================================== */}

        {isPending && (
          <div className="mt-8 flex flex-wrap gap-2.5 border-t border-slate-100 pt-5">
            {onApprove && (
              <button
                type="button"
                onClick={() => {
                  onApprove(pg.id);
                }}
                className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-xs transition hover:bg-emerald-700 cursor-pointer"
              >
                Approve Listing
              </button>
            )}

            {onReject && (
              <button
                type="button"
                onClick={() => {
                  onReject(pg.id);
                }}
                className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-rose-700 transition hover:bg-rose-100 cursor-pointer"
              >
                Reject Listing
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   SECTION TITLE
============================================================ */

function SectionTitle({
  title,
}: {
  title: string;
}) {
  return (
    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
      {title}
    </h3>
  );
}

/* ============================================================
   DETAIL
============================================================ */

function Detail({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5">
      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-xs font-bold text-slate-900">
        {value ?? 'Not provided'}
      </p>
    </div>
  );
}

/* ============================================================
   AMENITY
============================================================ */

function Amenity({
  label,
  value,
}: {
  label: string;
  value: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3">
      <span
        className={
          value
            ? 'text-xs font-bold text-emerald-700'
            : 'text-xs font-medium text-slate-400'
        }
      >
        {value ? '✓' : '✗'} {label}
      </span>
    </div>
  );
}

/* ============================================================
   STATUS BADGE
============================================================ */

function StatusBadge({
  status,
}: {
  status: PG['approvalStatus'];
}) {
  const styles = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-emerald-100 text-emerald-800',
    REJECTED: 'bg-red-100 text-red-800',
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

/* ============================================================
   HELPERS
============================================================ */

function formatCurrency(
  value?: number | null
) {
  if (value === null || value === undefined) {
    return 'Not provided';
  }

  return `₹${value.toLocaleString('en-IN')}`;
}

function formatDate(
  value?: string | null
) {
  if (!value) {
    return 'Not provided';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString('en-IN');
}