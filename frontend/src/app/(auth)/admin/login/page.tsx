'use client';

import React from 'react';
import { AdminLoginForm } from '@/features/auth/components/AdminLoginForm';

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