'use client';

import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-6xl font-bold text-brand md:text-8xl">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-ink">Page Not Found</h2>
      <p className="mt-2 max-w-md text-ink-soft">
        The listing or dashboard page you are trying to access does not exist or has been removed.
      </p>
      <Link
        href={ROUTES.HOME}
        className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-brand px-6 font-medium text-cream transition-colors hover:bg-brand-dark"
      >
        Return Home
      </Link>
    </div>
  );
}