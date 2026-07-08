'use client';

import React from 'react';

export function SupportContactCard() {
  const handleSupportTicketSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // High-fidelity operational feedback alert matching strict consumer design patterns
    alert('Thank you! Your support ticket has been registered. Our help desk will connect with you within 2 hours.');
  };

  return (
    <div className="w-full max-w-xl rounded-xl border border-line bg-surface p-6 shadow-sm transition-all hover:shadow-md md:p-8">
      <h3 className="font-display text-2xl font-bold text-ink">Direct Assistance Help Desk</h3>
      <p className="mt-2 text-sm text-ink-soft">
        Are you facing issues with onboarding your properties or verifying structural tenancy logs? Submit a high-priority ticket below.
      </p>

      <form onSubmit={handleSupportTicketSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">Full Name</label>
          <input
            type="text"
            required
            placeholder="John Doe"
            className="mt-1 w-full rounded-md border border-line bg-cream px-4 py-2 text-ink outline-none transition-all focus:border-brand"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">Email Address</label>
          <input
            type="email"
            required
            placeholder="johndoe@example.com"
            className="mt-1 w-full rounded-md border border-line bg-cream px-4 py-2 text-ink outline-none transition-all focus:border-brand"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">Issue Category</label>
          <select className="mt-1 w-full rounded-md border border-line bg-cream px-4 py-2 text-ink outline-none transition-all focus:border-brand">
            <option>Onboarding & Verification Delay</option>
            <option>Image Upload Infrastructure Timeout</option>
            <option>Authentication Session Eviction Error</option>
            <option>Other Technical Anomalies</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">Elaborate Statement</label>
          <textarea
            rows={4}
            required
            placeholder="Describe your issue in detail..."
            className="mt-1 w-full rounded-md border border-line bg-cream px-4 py-2 text-ink outline-none transition-all focus:border-brand resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-brand py-3 text-sm font-semibold text-cream transition-all hover:bg-brand-dark active:scale-[0.99]"
        >
          Dispatch Support Ticket
        </button>
      </form>
    </div>
  );
}