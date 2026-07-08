'use client';

import { useEffect, useState } from 'react';
import type { PG } from '@/types/pg.types';

interface AdminPGListProps {
  initialItems?: PG[];
}

export function AdminPGList({ initialItems = [] }: AdminPGListProps) {
  const [items, setItems] = useState<PG[]>(initialItems);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const approve = async (id: string) => {
    const response = await fetch(`/api/admin/${id}/approve`, { method: 'PUT' });
    if (response.ok) {
      setItems((current) => current.filter((item) => item.id !== id));
    }
  };

  const reject = async (id: string) => {
    const response = await fetch(`/api/admin/${id}`, { method: 'DELETE' });
    if (response.ok) {
      setItems((current) => current.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="flex flex-col gap-3 rounded-2xl border border-line bg-cream p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-ink">{item.pgName}</p>
            <p className="text-sm text-ink-soft">{item.city} • ₹{item.rent} • {item.gender}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => approve(item.id)} className="rounded-lg bg-brand px-3 py-2 text-sm font-semibold text-cream">Approve</button>
            <button onClick={() => reject(item.id)} className="rounded-lg border border-line px-3 py-2 text-sm font-semibold text-ink">Reject</button>
          </div>
        </div>
      ))}
      {!items.length && <p className="rounded-2xl border border-dashed border-line p-4 text-sm text-ink-soft">No pending items right now.</p>}
    </div>
  );
}
