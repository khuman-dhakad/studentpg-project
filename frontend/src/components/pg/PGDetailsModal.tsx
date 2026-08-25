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
      className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="mx-auto my-6 max-w-5xl rounded-3xl bg-surface p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="flex items-start justify-between gap-4 border-b border-line pb-5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="truncate text-2xl font-bold text-ink">
                {pg.pgName}
              </h2>

              <StatusBadge status={pg.approvalStatus} />
            </div>

            <p className="mt-2 break-all text-sm text-ink-soft">
              PG ID: {pg.id}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="shrink-0 rounded-xl px-3 py-2 text-2xl text-ink-soft transition hover:bg-cream hover:text-ink"
          >
            ×
          </button>
        </div>

        {/* =====================================================
            IMAGES
        ====================================================== */}

        <section className="mt-6">
          <SectionTitle title="PG Images" />

          {pg.images?.length > 0 ? (
            <div className="mt-3 grid grid-cols-2 gap-4 md:grid-cols-4">
              {pg.images.map((image, index) => (
                <div
                  key={image.id ?? image.publicId ?? index}
                  className="overflow-hidden rounded-xl border border-line bg-cream"
                >
                  <Image
                    src={image.url}
                    alt={`${pg.pgName} image ${index + 1}`}
                    width={400}
                    height={240}
                    className="h-40 w-full object-cover transition duration-300 hover:scale-105"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-3 rounded-xl border border-dashed border-line p-6 text-center text-sm text-ink-soft">
              No images provided.
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
          <SectionTitle title="Description" />

          <p className="mt-3 rounded-xl bg-cream p-4 text-sm leading-7 text-ink-soft">
            {pg.description?.trim() || 'No description provided.'}
          </p>
        </section>

        {/* =====================================================
            APPROVAL INFORMATION
        ====================================================== */}

        {pg.approvalStatus === 'APPROVED' && (
          <section className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <h3 className="text-lg font-bold text-emerald-800">
              Approval Information
            </h3>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Detail
                label="Approved By"
                value={pg.approvedBy}
              />

              <Detail
                label="Approved At"
                value={formatDate(pg.approvedAt)}
              />
            </div>
          </section>
        )}

        {/* =====================================================
            REJECTION INFORMATION
        ====================================================== */}

        {pg.approvalStatus === 'REJECTED' && (
          <section className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">
            <h3 className="text-lg font-bold text-red-800">
              Rejection Information
            </h3>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Detail
                label="Rejected By"
                value={pg.rejectedBy}
              />

              <Detail
                label="Rejected At"
                value={formatDate(pg.rejectedAt)}
              />
            </div>

            <div className="mt-4 rounded-xl border border-red-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase text-red-600">
                Rejection Reason
              </p>

              <p className="mt-2 text-sm leading-6 text-red-800">
                {pg.rejectionReason || 'No rejection reason provided.'}
              </p>
            </div>
          </section>
        )}

        {/* =====================================================
            ACTIONS
        ====================================================== */}

        {isPending && (
          <div className="mt-8 flex flex-wrap gap-3 border-t border-line pt-6">
            {onApprove && (
              <button
                type="button"
                onClick={() => {
                  onApprove(pg.id);
                }}
                className="rounded-xl bg-brand px-5 py-3 font-bold text-white transition hover:bg-brand-dark"
              >
                Approve PG
              </button>
            )}

            {onReject && (
              <button
                type="button"
                onClick={() => {
                  onReject(pg.id);
                }}
                className="rounded-xl border border-danger px-5 py-3 font-bold text-danger transition hover:bg-danger-soft/10"
              >
                Reject PG
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
    <h3 className="text-lg font-bold text-ink">
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
    <div className="rounded-xl bg-cream p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
        {label}
      </p>

      <p className="mt-1 break-words font-semibold text-ink">
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
    <div className="rounded-xl bg-cream p-4">
      <span
        className={
          value
            ? 'font-semibold text-emerald-700'
            : 'font-semibold text-ink-soft'
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