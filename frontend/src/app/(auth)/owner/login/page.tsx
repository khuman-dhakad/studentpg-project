'use client';

import Link from 'next/link';
import { OwnerLoginForm } from '@/features/auth/components/OwnerLoginForm';
import { ROUTES } from '@/constants/routes';

export default function OwnerLoginPage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-12">
      <OwnerLoginForm />
      <p className="mt-4 text-center text-sm text-ink-soft">
        Don&apos;t have a host account yet?{' '}
        <Link href={ROUTES.OWNER.REGISTER} className="font-bold text-brand hover:underline">Register here</Link>
      </p>
    </main>
  );
}