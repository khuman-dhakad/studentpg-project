'use client';

import { OwnerForgotPasswordForm } from '@/features/auth/components/OwnerForgotPasswordForm';

export default function OwnerForgotPasswordPage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <OwnerForgotPasswordForm />
    </main>
  );
}
