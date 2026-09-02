'use client';

import { useEffect } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Unhandled App Router Runtime Exception:', error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center antialiased">
      <div className="rounded-2xl bg-rose-50 p-3.5 text-rose-600 border border-rose-200 shadow-xs mb-4">
        <AlertCircle className="h-7 w-7" />
      </div>
      <span className="rounded-full bg-rose-50 px-3 py-0.5 text-[11px] font-black uppercase tracking-widest text-rose-700 border border-rose-100">
        Application Exception
      </span>
      <h2 className="mt-3 text-2xl font-black text-slate-900 tracking-tight">Something went wrong</h2>
      <p className="mt-2 max-w-md text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
        An unexpected application error occurred while processing this request. Please verify your connection or retry.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 text-xs font-black uppercase tracking-wider text-white shadow-md shadow-emerald-900/10 transition-all hover:bg-emerald-700 active:scale-95 cursor-pointer"
      >
        <RotateCcw className="h-4 w-4" />
        <span>Reload Application</span>
      </button>
    </div>
  );
}