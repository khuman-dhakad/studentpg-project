'use client';

import { FormEvent, useState } from 'react';
import { FileCheck2, ShieldCheck, X } from 'lucide-react';
import { useSubmitOwnerVerificationMutation } from '@/api/ownerApi';
import type { VerificationStatus } from '@/types/owner.types';

interface OwnerVerificationModalProps {
  status: VerificationStatus;
  rejectionReason?: string | null;
  onClose: () => void;
}

const acceptedTypes = ['application/pdf', 'image/jpeg', 'image/png'];

function validateDocumentNumber(documentType: string, value: string) {
  const documentNumber = value.replace(/[\s-]/g, '').toUpperCase();
  const formats: Record<string, { pattern: RegExp; message: string }> = {
    AADHAAR: { pattern: /^\d{12}$/, message: 'Aadhaar number must contain exactly 12 digits.' },
    PAN: { pattern: /^[A-Z]{5}\d{4}[A-Z]$/, message: 'PAN must be 5 letters, 4 digits, then 1 letter (example: ABCDE1234F).' },
    PASSPORT: { pattern: /^[A-Z]\d{7}$/, message: 'Passport number must be 1 letter followed by 7 digits.' },
    DRIVING_LICENSE: { pattern: /^[A-Z]{2}\d{2}\d{4}\d{7}$/, message: 'Driving licence must contain the state code, 2 digits, 4 year digits, and 7 digits.' },
    VOTER_ID: { pattern: /^[A-Z]{3}\d{7}$/, message: 'Voter ID must be 3 letters followed by 7 digits.' },
  };
  const format = formats[documentType];
  return format && !format.pattern.test(documentNumber) ? format.message : null;
}

function getSubmissionError(error: unknown) {
  if (error && typeof error === 'object' && 'data' in error) {
    const data = (error as { data?: unknown }).data;
    if (data && typeof data === 'object') {
      const response = data as { message?: string; errors?: Record<string, string> };
      const fieldErrors = response.errors ? Object.values(response.errors).join(' ') : '';
      if (fieldErrors || response.message) {
        return [response.message, fieldErrors].filter(Boolean).join(' ');
      }
    }
  }
  return error instanceof Error ? error.message : 'Unable to submit verification. Please check your details and try again.';
}

export function OwnerVerificationModal({
  status,
  rejectionReason,
  onClose,
}: OwnerVerificationModalProps) {
  const [legalName, setLegalName] = useState('');
  const [documentType, setDocumentType] = useState('AADHAAR');
  const [documentNumber, setDocumentNumber] = useState('');
  const [document, setDocument] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitVerification, { isLoading }] = useSubmitOwnerVerificationMutation();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (!document) {
      setError('Please upload your identity document.');
      return;
    }
    if (!acceptedTypes.includes(document.type)) {
      setError('Only PDF, JPG, and PNG documents are supported.');
      return;
    }
    const name = legalName.trim();
    if (!/^[\p{L}][\p{L} .'-]{1,99}$/u.test(name)) {
      setError('Enter your full legal name using letters, spaces, dots, apostrophes, or hyphens only.');
      return;
    }
    const numberError = validateDocumentNumber(documentType, documentNumber);
    if (numberError) {
      setError(numberError);
      return;
    }
    if (document.size > 5 * 1024 * 1024) {
      setError('Document must be 5 MB or smaller.');
      return;
    }

    const formData = new FormData();
    formData.append('verification', new Blob([
      JSON.stringify({ legalName: name, documentType, documentNumber: documentNumber.replace(/[\s-]/g, '').toUpperCase() }),
    ], { type: 'application/json' }));
    formData.append('document', document);

    try {
      await submitVerification(formData).unwrap();
      onClose();
    } catch (submissionError) {
      setError(getSubmissionError(submissionError));
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4" onClick={onClose}>
      <section role="dialog" aria-modal="true" aria-labelledby="verification-title" className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:max-w-lg sm:rounded-3xl sm:p-8" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600"><ShieldCheck className="h-6 w-6" /></div>
            <div>
              <h2 id="verification-title" className="text-xl font-black text-slate-950">{status === 'REJECTED' ? 'Review Verification' : 'Verify Yourself'}</h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">Verify your profile to build trust with students and increase confidence in your listings.</p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close verification form" className="rounded-xl p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-700"><X className="h-5 w-5" /></button>
        </div>

        {status === 'REJECTED' && rejectionReason && <div className="mt-5 rounded-2xl border border-rose-100 bg-rose-50 p-3 text-sm text-rose-700">Review note: {rejectionReason}</div>}

        {status === 'PENDING' && (
          <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-800">
            Your verification is already under review. You cannot submit another document until the current review is completed.
          </div>
        )}

        <div className="mt-5 grid grid-cols-2 gap-2 text-xs font-bold text-slate-600">
          {['Verified Owner badge', 'Increased trust', 'Better credibility', 'More confidence'].map((benefit) => <div key={benefit} className="rounded-xl bg-slate-50 px-3 py-2">{benefit}</div>)}
        </div>

        {status !== 'PENDING' && <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-bold text-slate-700">Full legal name<input required maxLength={100} value={legalName} onChange={(event) => setLegalName(event.target.value)} className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-emerald-500" /></label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-bold text-slate-700">Document type<select value={documentType} onChange={(event) => { setDocumentType(event.target.value); setError(null); }} className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 outline-none focus:border-emerald-500"><option value="AADHAAR">Aadhaar</option><option value="PAN">PAN</option><option value="PASSPORT">Passport</option><option value="DRIVING_LICENSE">Driving licence</option><option value="VOTER_ID">Voter ID</option></select></label>
            <label className="block text-sm font-bold text-slate-700">Document number<input required minLength={4} maxLength={40} value={documentNumber} onChange={(event) => setDocumentNumber(event.target.value)} className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-emerald-500" /></label>
          </div>
          <label className="block rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm font-bold text-slate-700"><span className="flex items-center gap-2"><FileCheck2 className="h-4 w-4 text-emerald-600" />Upload identity document</span><input required type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(event) => setDocument(event.target.files?.[0] ?? null)} className="mt-3 block w-full text-xs font-medium text-slate-500" /><span className="mt-2 block text-xs font-medium text-slate-400">PDF, JPG or PNG up to 5 MB. Stored privately for admin review.</span></label>
          {error && <p role="alert" className="text-sm font-semibold text-rose-600">{error}</p>}
          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end"><button type="button" onClick={onClose} className="h-11 rounded-xl px-4 text-sm font-bold text-slate-500 hover:bg-slate-50">Maybe Later</button><button disabled={isLoading} type="submit" className="h-11 rounded-xl bg-emerald-600 px-5 text-sm font-black text-white shadow-sm hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">{isLoading ? 'Submitting...' : 'Verify Now'}</button></div>
        </form>}
      </section>
    </div>
  );
}