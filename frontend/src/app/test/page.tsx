'use client';

import { useEffect, useState } from 'react';

interface TestResultItem {
  status: string;
  data?: string;
  error?: string;
}

export default function TestPage() {
  const [results, setResults] = useState<Record<string, TestResultItem>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function test() {
      try {
        const res = await fetch('/api-test');
        const data = await res.json();
        setResults(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    test();
  }, []);

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 antialiased">
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
        <span className="text-[11px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 inline-block mb-2">
          DEVELOPER VERIFICATION
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">API Endpoint Verification</h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">Live test of all backend endpoints through the frontend proxy</p>

        <div className="mt-6 space-y-3">
          {loading ? (
            <p className="text-xs text-slate-400 font-medium">Testing endpoints...</p>
          ) : (
            Object.entries(results).map(([name, result]) => (
              <div
                key={name}
                className={`rounded-xl border p-4 ${
                  result.status === 'OK'
                    ? 'border-emerald-200 bg-emerald-50/60'
                    : 'border-rose-200 bg-rose-50/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">{name}</p>
                    <p className="text-xs text-slate-500 font-medium">
                      {result.status === 'OK' ? `✓ Working - ${result.data}` : `✗ Error: ${result.error}`}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                      result.status === 'OK'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {result.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-5">
          <h2 className="text-xs font-bold text-slate-900">✅ Public Endpoints Status</h2>
          <p className="mt-1 text-xs text-slate-500 leading-relaxed font-medium">
            The frontend is proxying all backend API calls. Students can browse, search, and filter PGs without authentication.
          </p>
          <ul className="mt-3 space-y-1 text-xs font-medium text-slate-600">
            <li>✓ GET /api/student/pgs - List all approved PGs</li>
            <li>✓ GET /api/student/pgs/search - Search by city</li>
            <li>✓ GET /api/student/pgs/filter - Advanced filters</li>
            <li>✓ GET /api/search - Full-text search</li>
            <li>✓ GET /api/student/pgs/search-suggestions - Suggestions</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
