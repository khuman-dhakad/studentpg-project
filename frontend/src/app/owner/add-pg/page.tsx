'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ROUTES } from '@/constants/routes';
import { uploadImageToCloudinary } from '@/lib/cloudinary';

export default function AddPgPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    pgName: '',
    description: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    rent: '',
    gender: 'Boys',
    roomType: 'Single',
    foodAvailable: false,
    wifiAvailable: false,
    parkingAvailable: false,
    laundryAvailable: false,
  });
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const uploadedImages = files ? await Promise.all(Array.from(files).slice(0, 3).map((file) => uploadImageToCloudinary(file))) : [];
      const payload = {
        ...form,
        rent: Number(form.rent),
        images: uploadedImages.map((image) => ({ publicId: image.publicId, url: image.url })),
      };
      const response = await fetch('/api/owner/pgs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Create listing failed');
      setMessage('Listing submitted successfully and will appear after admin review.');
      router.push(ROUTES.OWNER.DASHBOARD);
    } catch (error: any) {
      setMessage(error.message || 'Could not create listing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-line bg-surface p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand">Publish New Listing</p>
        <h1 className="mt-3 font-display text-3xl font-black text-ink">Add a new paying guest property</h1>
        <p className="mt-3 text-sm leading-7 text-ink-soft">Create a live listing and let the admin review it before it reaches students.</p>
        <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
          {message && <div className="rounded-2xl border border-line bg-cream p-3 text-sm text-ink-soft">{message}</div>}
          <div className="grid gap-4 md:grid-cols-2">
            <input required value={form.pgName} onChange={(e) => setForm({ ...form, pgName: e.target.value })} placeholder="PG name" className="rounded-2xl border border-line bg-cream px-4 py-3 text-sm text-ink outline-none" />
            <input required value={form.rent} onChange={(e) => setForm({ ...form, rent: e.target.value })} type="number" placeholder="Monthly rent" className="rounded-2xl border border-line bg-cream px-4 py-3 text-sm text-ink outline-none" />
            <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="rounded-2xl border border-line bg-cream px-4 py-3 text-sm text-ink outline-none">
              <option value="Boys">Boys</option>
              <option value="Girls">Girls</option>
              <option value="Unisex">Unisex</option>
            </select>
            <input value={form.roomType} onChange={(e) => setForm({ ...form, roomType: e.target.value })} placeholder="Room type" className="rounded-2xl border border-line bg-cream px-4 py-3 text-sm text-ink outline-none" />
          </div>
          <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={4} className="rounded-2xl border border-line bg-cream px-4 py-3 text-sm text-ink outline-none" />
          <div className="grid gap-4 md:grid-cols-2">
            <input required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Address" className="rounded-2xl border border-line bg-cream px-4 py-3 text-sm text-ink outline-none" />
            <input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="City" className="rounded-2xl border border-line bg-cream px-4 py-3 text-sm text-ink outline-none" />
            <input required value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} placeholder="State" className="rounded-2xl border border-line bg-cream px-4 py-3 text-sm text-ink outline-none" />
            <input required value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} placeholder="Pincode" className="rounded-2xl border border-line bg-cream px-4 py-3 text-sm text-ink outline-none" />
          </div>
          <div className="rounded-2xl border border-line bg-cream p-4 text-sm text-ink-soft">
            <p className="font-semibold text-ink">Amenities</p>
            <div className="mt-3 flex flex-wrap gap-3">
              <label className="flex items-center gap-2"><input type="checkbox" checked={form.foodAvailable} onChange={(e) => setForm({ ...form, foodAvailable: e.target.checked })} /> Meals</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={form.wifiAvailable} onChange={(e) => setForm({ ...form, wifiAvailable: e.target.checked })} /> Wi-Fi</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={form.parkingAvailable} onChange={(e) => setForm({ ...form, parkingAvailable: e.target.checked })} /> Parking</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={form.laundryAvailable} onChange={(e) => setForm({ ...form, laundryAvailable: e.target.checked })} /> Laundry</label>
            </div>
          </div>
          <input type="file" multiple accept="image/*" onChange={(event) => setFiles(event.target.files)} />
          <div className="flex flex-wrap gap-3">
            <button type="submit" disabled={loading} className="rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-cream disabled:opacity-60">{loading ? 'Submitting…' : 'Create listing'}</button>
            <button type="button" onClick={() => router.push(ROUTES.OWNER.DASHBOARD)} className="rounded-lg border border-line px-5 py-3 text-sm font-semibold text-ink">Back</button>
          </div>
        </form>
      </div>
    </main>
  );
}
