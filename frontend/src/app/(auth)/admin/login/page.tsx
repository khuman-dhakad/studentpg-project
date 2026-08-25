import React from 'react';
import type { Metadata } from 'next';
import { AdminLoginForm } from '@/features/auth/components/AdminLoginForm';

export const metadata: Metadata = {
  title: 'Admin Portal Login',
  description: 'Authorized personnel access terminal for StudentPG administration.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-12">
      <AdminLoginForm />
      
      <p className="mt-6 text-center text-xs font-semibold text-ink-soft tracking-wide">
        SECURE TERMINAL — UNAUTHORIZED ACCESS ATTEMPTS ARE LOGGED SYSTEMICALLY
      </p>
    </main>
  );
}