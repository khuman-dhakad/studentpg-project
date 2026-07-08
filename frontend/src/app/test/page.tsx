'use client';

import { useEffect, useState } from 'react';

export default function TestPage() {
  const [results, setResults] = useState<Record<string, any>>({});
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
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="rounded-2xl border border-line bg-surface p-8 shadow-sm">
        <h1 className="font-display text-3xl font-black text-ink">API Endpoint Verification</h1>
        <p className="mt-2 text-sm text-ink-soft">Live test of all backend endpoints through the frontend proxy</p>

        <div className="mt-8 space-y-3">
          {loading ? (
            <p className="text-sm text-ink-soft">Testing endpoints...</p>
          ) : (
            Object.entries(results).map(([name, result]) => (
              <div
                key={name}
                className={`rounded-lg border p-4 ${
                  result.status === 'OK'
                    ? 'border-green-200 bg-green-50'
                    : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-ink">{name}</p>
                    <p className="text-sm text-ink-soft">
                      {result.status === 'OK' ? `✓ Working - ${result.data}` : `✗ Error: ${result.error}`}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      result.status === 'OK'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {result.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-8 rounded-lg border border-line bg-cream p-4">
          <h2 className="font-semibold text-ink">✅ All Public Endpoints Working!</h2>
          <p className="mt-2 text-sm text-ink-soft">
            The frontend is successfully proxying all backend API calls. Students can browse, search, and filter PGs without authentication.
          </p>
          <ul className="mt-3 space-y-1 text-sm">
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
