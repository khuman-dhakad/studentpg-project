'use client';

import React from 'react';
import Link from 'next/link';
import { OwnerRegisterForm } from '@/features/auth/components/OwnerRegisterForm';
import { ROUTES } from '@/constants/routes';

export default function OwnerRegisterPage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-12">
      <OwnerRegisterForm />
      
      <p className="mt-4 text-center text-sm text-ink-soft">
        Already registered as a property host?{' '}
        <Link href={ROUTES.OWNER.LOGIN} className="font-bold text-brand hover:underline">
          Sign In instead
        </Link>
      </p>
    </main>
  );
}