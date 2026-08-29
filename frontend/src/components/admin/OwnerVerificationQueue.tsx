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
    <section className="rounded-3xl border border-line bg-surface p-6 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">Trust & Safety</p>
          <h2 className="mt-2 text-2xl font-black text-ink">Owner verification queue</h2>
          <p className="mt-2 text-sm text-ink-soft">Review identity documents submitted by property owners.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs font-black">
          <button type="button" onClick={() => void load('ALL')} className={`rounded-full px-3 py-1 transition ${selectedStatus === 'ALL' ? 'bg-brand text-cream' : 'bg-slate-100 text-ink hover:bg-slate-200'}`}>{counts.pending + counts.verified + counts.rejected} total listings</button>
          <button type="button" onClick={() => void load('PENDING')} className={`rounded-full px-3 py-1 transition ${selectedStatus === 'PENDING' ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'}`}>{counts.pending} pending</button>
          <button type="button" onClick={() => void load('VERIFIED')} className={`rounded-full px-3 py-1 transition ${selectedStatus === 'VERIFIED' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}>{counts.verified} approved</button>
          <button type="button" onClick={() => void load('REJECTED')} className={`rounded-full px-3 py-1 transition ${selectedStatus === 'REJECTED' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'}`}>{counts.rejected} rejected</button>
          <button type="button" onClick={() => selectedStatus && void load(selectedStatus, true)} disabled={refreshing || !selectedStatus} className="ml-1 rounded-xl border border-line px-4 py-2 text-sm font-bold text-ink transition hover:bg-cream disabled:opacity-50">
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>
      {error && <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-700">{error}</p>}
      {!selectedStatus ? <p className="mt-6 text-sm text-ink-soft">Select a status to load owner verification records.</p> : loading ? <p className="mt-6 text-sm text-ink-soft">Loading verification requests...</p> : items.length === 0 ? <p className="mt-6 text-sm text-ink-soft">No owner verification records.</p> : <div className="mt-6 space-y-3">{items.map((item) => { const isPending = item.verificationStatus === 'PENDING'; return <article key={item.ownerId} className="rounded-2xl border border-line bg-cream p-5"><div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between"><div className="min-w-0 flex-1 space-y-3"><div className="flex flex-wrap items-center gap-3"><h3 className="text-lg font-bold text-ink">{item.legalName || item.name}</h3><span className={`rounded-full px-3 py-1 text-xs font-bold ${item.verificationStatus === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' : item.verificationStatus === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{item.verificationStatus}</span></div><div className="grid gap-2 text-sm text-ink-soft sm:grid-cols-2 lg:grid-cols-4"><p><strong>Account:</strong> {item.name}</p><p><strong>Email:</strong> {item.email}</p><p><strong>Phone:</strong> {item.phone || 'Not available'}</p><p><strong>Owner ID:</strong> {item.ownerId}</p></div><div className="grid gap-2 text-sm text-ink-soft sm:grid-cols-2"><p><strong>Document:</strong> {item.documentType}</p><p><strong>Document number:</strong> {item.documentNumber || 'Not available'}</p><p><strong>Submitted:</strong> {item.submittedAt ? new Date(item.submittedAt).toLocaleString() : 'Not available'}</p></div>{item.verificationStatus === 'REJECTED' && item.rejectionReason && <div className="rounded-xl border border-red-200 bg-red-50 p-3"><p className="text-xs font-bold text-red-700">Rejection Reason</p><p className="mt-1 text-sm text-red-600">{item.rejectionReason}</p></div>}</div><div className="flex shrink-0 flex-wrap gap-3 lg:max-w-xs lg:justify-end"><button type="button" onClick={() => void openDocument(item.ownerId)} className="inline-flex h-10 items-center gap-2 rounded-xl border border-line bg-surface px-4 text-sm font-bold text-ink transition hover:bg-white"><Download className="h-4 w-4" />View Full Details</button>{isPending && <><button disabled={busyId === item.ownerId} type="button" onClick={() => void review(item.ownerId, 'reject')} className="inline-flex h-10 items-center gap-2 rounded-xl border border-danger/30 bg-rose-50 px-4 text-sm font-bold text-danger transition hover:bg-rose-100 disabled:opacity-50"><X className="h-4 w-4" />Reject</button><button disabled={busyId === item.ownerId} type="button" onClick={() => void review(item.ownerId, 'approve')} className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-bold text-cream transition hover:bg-brand-dark disabled:opacity-50"><Check className="h-4 w-4" />Approve</button></>}</div></div></article>; })}</div>}
      <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-ink-soft"><ShieldCheck className="h-4 w-4 text-brand" />Documents are only available to authorized admins.</div>
    </section>
  );
}