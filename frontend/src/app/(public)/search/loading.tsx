import React from 'react';

export default function SearchLoadingSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-pulse">
      <div className="h-8 w-64 rounded-md bg-line" />
      <div className="mt-2 h-4 w-40 rounded-md bg-line" />

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="rounded-xl border border-line bg-surface p-4 space-y-4">
            <div className="aspect-video w-full rounded-lg bg-line" />
            <div className="h-5 w-3/4 rounded bg-line" />
            <div className="h-4 w-1/2 rounded bg-line" />
            <div className="h-8 w-full rounded bg-line pt-4" />
          </div>
        ))}
      </div>
    </div>
  );
}