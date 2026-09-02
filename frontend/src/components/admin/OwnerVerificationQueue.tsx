'use client';

import { useState } from 'react';
import { Check, Download, ShieldCheck, X } from 'lucide-react';
import { BACKEND_API_URL } from '@/constants/config';
import { BACKEND_ENDPOINTS } from '@/api/endpoints';

type VerificationRecord = {
  ownerId: string;
  name: string;
  email: string;
  phone?: string;
  legalName: string;
  documentType: string;
  documentNumber?: string;
  documentUrl?: string;
  verificationStatus: string;
  submittedAt?: string;
  rejectionReason?: string;
};

type QueueStatus = 'ALL' | 'PENDING' | 'VERIFIED' | 'REJECTED';

export function OwnerVerificationQueue() {
  const [items, setItems] = useState<VerificationRecord[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<QueueStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [counts, setCounts] = useState({ pending: 0, verified: 0, rejected: 0 });
  const [refreshing, setRefreshing] = useState(false);

  const load = async (status: QueueStatus, isRefresh = false) => {
    if (status === 'ALL' && !isRefresh) {
      setSelectedStatus(status);
    } else {
      setSelectedStatus(status);
    }
    setLoading(true);
    setRefreshing(true);
    try {
      const requestedStatuses = status === 'ALL' ? ['PENDING', 'VERIFIED', 'REJECTED'] : [status];
      const records = await Promise.all(requestedStatuses.map(async (requestedStatus) => {
        const response = await fetch(`${BACKEND_API_URL}${BACKEND_ENDPOINTS.ADMIN.OWNER_VERIFICATIONS}?status=${requestedStatus}`, { credentials: 'include', cache: 'no-store' });
        if (!response.ok) throw new Error('Unable to load owner verifications.');
        return { status: requestedStatus, records: await response.json() as VerificationRecord[] };
      }));
      setItems(records.flatMap((result) => result.records));
      setCounts((current) => {
        const next = { ...current };
        records.forEach((result) => {
          next[result.status.toLowerCase() as 'pending' | 'verified' | 'rejected'] = result.records.length;
        });
        return next;
      });
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load owner verifications.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const review = async (id: string, action: 'approve' | 'reject') => {
    let reason: string | undefined;
    if (action === 'reject') {
      reason = window.prompt('Reason for rejection')?.trim();
      if (!reason) return;
    }
    setBusyId(id);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_API_URL}${action === 'approve' ? BACKEND_ENDPOINTS.ADMIN.APPROVE_OWNER_VERIFICATION(id) : BACKEND_ENDPOINTS.ADMIN.REJECT_OWNER_VERIFICATION(id)}`, {
        method: 'PATCH', credentials: 'include', headers: { 'Content-Type': 'application/json' },
        body: action === 'reject' ? JSON.stringify({ reason }) : undefined,
      });
      if (!response.ok) throw new Error(await response.text() || 'Review action failed.');
      setItems((current) => current.filter((item) => item.ownerId !== id));
      setCounts((current) => ({
        ...current,
        pending: Math.max(0, current.pending - 1),
        ...(action === 'approve'
          ? { verified: current.verified + 1 }
          : { rejected: current.rejected + 1 }),
      }));
    } catch (reviewError) {
      setError(reviewError instanceof Error ? reviewError.message : 'Review action failed.');
    } finally {
      setBusyId(null);
    }
  };

  const openDocument = async (id: string) => {
    const response = await fetch(`${BACKEND_API_URL}${BACKEND_ENDPOINTS.ADMIN.OWNER_VERIFICATION_DOCUMENT(id)}`, { credentials: 'include' });
    if (!response.ok) { setError('Unable to open the private document.'); return; }
    const url = URL.createObjectURL(await response.blob());
    window.open(url, '_blank', 'noopener,noreferrer');
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  };

  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs antialiased">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 inline-block mb-1.5">
            Host Compliance Desk
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Owner Verification Queue</h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">Review identity documents and verify legitimate property owners.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
          <button type="button" onClick={() => void load('ALL')} className={`rounded-xl px-3 py-1.5 transition cursor-pointer ${selectedStatus === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>{counts.pending + counts.verified + counts.rejected} Total</button>
          <button type="button" onClick={() => void load('PENDING')} className={`rounded-xl px-3 py-1.5 transition cursor-pointer ${selectedStatus === 'PENDING' ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'}`}>{counts.pending} Pending</button>
          <button type="button" onClick={() => void load('VERIFIED')} className={`rounded-xl px-3 py-1.5 transition cursor-pointer ${selectedStatus === 'VERIFIED' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}>{counts.verified} Approved</button>
          <button type="button" onClick={() => void load('REJECTED')} className={`rounded-xl px-3 py-1.5 transition cursor-pointer ${selectedStatus === 'REJECTED' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'}`}>{counts.rejected} Rejected</button>
          <button type="button" onClick={() => selectedStatus && void load(selectedStatus, true)} disabled={refreshing || !selectedStatus} className="rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 cursor-pointer">
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>
      {error && <p role="alert" className="mt-4 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-700">{error}</p>}
      {!selectedStatus ? (
        <p className="mt-6 text-xs font-medium text-slate-500">Select a status pill above to inspect verification requests.</p>
      ) : loading ? (
        <p className="mt-6 text-xs font-medium text-slate-500 animate-pulse">Loading verification records from server...</p>
      ) : items.length === 0 ? (
        <p className="mt-6 text-xs font-medium text-slate-500">No owner verification records found for this status.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {items.map((item) => {
            const isPending = item.verificationStatus === 'PENDING';
            return (
              <article key={item.ownerId} className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1 space-y-2.5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="text-base font-black text-slate-900">{item.legalName || item.name}</h3>
                      <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        item.verificationStatus === 'VERIFIED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.verificationStatus === 'REJECTED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.verificationStatus}
                      </span>
                    </div>
                    <div className="grid gap-2 text-xs text-slate-600 sm:grid-cols-2 lg:grid-cols-4">
                      <p><strong className="text-slate-900 font-bold">Account:</strong> {item.name}</p>
                      <p><strong className="text-slate-900 font-bold">Email:</strong> {item.email}</p>
                      <p><strong className="text-slate-900 font-bold">Phone:</strong> {item.phone || 'Not available'}</p>
                      <p><strong className="text-slate-900 font-bold">Owner ID:</strong> <span className="font-mono text-[11px]">{item.ownerId}</span></p>
                    </div>
                    <div className="grid gap-2 text-xs text-slate-600 sm:grid-cols-3">
                      <p><strong className="text-slate-900 font-bold">Document:</strong> {item.documentType}</p>
                      <p><strong className="text-slate-900 font-bold">Doc Number:</strong> {item.documentNumber || 'N/A'}</p>
                      <p><strong className="text-slate-900 font-bold">Submitted:</strong> {item.submittedAt ? new Date(item.submittedAt).toLocaleString() : 'N/A'}</p>
                    </div>
                    {item.verificationStatus === 'REJECTED' && item.rejectionReason && (
                      <div className="rounded-xl border border-rose-200 bg-rose-50 p-3">
                        <p className="text-xs font-bold text-rose-800">Rejection Reason</p>
                        <p className="mt-0.5 text-xs text-rose-700 font-medium">{item.rejectionReason}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2 lg:max-w-xs lg:justify-end">
                    <button
                      type="button"
                      onClick={() => void openDocument(item.ownerId)}
                      className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-bold text-slate-800 shadow-xs transition hover:bg-slate-50 cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5 text-slate-500" />
                      <span>View Document</span>
                    </button>
                    {isPending && (
                      <>
                        <button
                          disabled={busyId === item.ownerId}
                          type="button"
                          onClick={() => void review(item.ownerId, 'reject')}
                          className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 text-xs font-bold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50 cursor-pointer"
                        >
                          <X className="h-3.5 w-3.5" />
                          <span>Reject</span>
                        </button>
                        <button
                          disabled={busyId === item.ownerId}
                          type="button"
                          onClick={() => void review(item.ownerId, 'approve')}
                          className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-700 disabled:opacity-50 cursor-pointer"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>Approve</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
      <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-slate-400">
        <ShieldCheck className="h-4 w-4 text-emerald-600" />
        <span>Verification documents are encrypted and restricted to authorized admins.</span>
      </div>
    </section>
  );
}