'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginInput } from '../schemas/authSchemas';
import { useOwnerLoginMutation } from '../api/authApi';
import { ROUTES } from '@/constants/routes';

export function OwnerLoginForm() {
  const router = useRouter();
  const [ownerLogin, { isLoading }] = useOwnerLoginMutation();
  const [globalError, setGlobalError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setGlobalError(null);
    try {
      const result = await ownerLogin(data).unwrap();
      if (result.status === 400) {
        setGlobalError(result.message);
      } else {
        router.push(ROUTES.OWNER.DASHBOARD);
        router.refresh();
      }
    } catch (err: any) {
      setGlobalError(err?.data?.message || 'Authentication encountered an unexpected breakdown.');
    }
  };

  return (
    <div className="w-full max-w-md rounded-xl border border-line bg-surface p-8 shadow-sm">
      <div className="text-center">
        <h2 className="font-display text-3xl font-bold text-ink">Owner Gateway</h2>
        <p className="mt-2 text-sm text-ink-soft">Sign in to manage listed accommodations</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        {globalError && (
          <div className="rounded-md bg-danger-soft p-3 text-sm font-medium text-danger">
            {globalError}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">Email Address</label>
          <input
            type="email"
            {...register('email')}
            placeholder="owner@example.com"
            className="mt-1 w-full rounded-md border border-line bg-cream px-4 py-2.5 text-ink outline-none transition-all focus:border-brand"
          />
          {errors.email && <p className="mt-1 text-xs text-danger">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">Security Password</label>
          <input
            type="password"
            {...register('password')}
            placeholder="••••••••"
            className="mt-1 w-full rounded-md border border-line bg-cream px-4 py-2.5 text-ink outline-none transition-all focus:border-brand"
          />
          {errors.password && <p className="mt-1 text-xs text-danger">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-brand py-3 text-sm font-semibold text-cream transition-all hover:bg-brand-dark disabled:opacity-50"
        >
          {isLoading ? 'Verifying Credentials...' : 'Authenticate Account'}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-ink-soft">
        <a href={ROUTES.OWNER.FORGOT_PASSWORD} className="font-semibold text-brand">Forgot password?</a>
      </p>
    </div>
  );
}