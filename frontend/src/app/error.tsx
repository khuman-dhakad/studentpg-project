'use client';

import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Unhandled App Router Runtime Exception:', error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="rounded-full bg-danger-soft p-3 text-danger">
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="mt-4 text-2xl font-semibold text-ink">Something went wrong!</h2>
      <p className="mt-2 max-w-md text-ink-soft">
        An unexpected structural error occurred. Please verify your connection status and reload.
      </p>
      <button
        onClick={() => reset()}
        className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-brand px-6 font-medium text-cream transition-colors hover:bg-brand-dark"
      >
        Try Again
      </button>
    </div>
  );
}