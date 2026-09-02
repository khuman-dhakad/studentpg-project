import React from 'react';

export default function SearchLoadingSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-pulse antialiased">
      <div className="h-7 w-64 rounded-xl bg-slate-200" />
      <div className="mt-2 h-4 w-40 rounded-lg bg-slate-200" />

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="rounded-2xl border border-slate-200/80 bg-white p-4 space-y-4 shadow-xs">
            <div className="aspect-video w-full rounded-xl bg-slate-100" />
            <div className="h-5 w-3/4 rounded-lg bg-slate-100" />
            <div className="h-4 w-1/2 rounded-lg bg-slate-100" />
            <div className="h-8 w-full rounded-lg bg-slate-100 pt-4" />
          </div>
        ))}
      </div>
    </div>
  );
}