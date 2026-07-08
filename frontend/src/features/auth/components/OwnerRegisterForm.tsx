'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterInput } from '../schemas/authSchemas';
import { useOwnerRegisterMutation } from '../api/authApi';
import { ROUTES } from '@/constants/routes';

export function OwnerRegisterForm() {
  const router = useRouter();
  const [ownerRegister, { isLoading }] = useOwnerRegisterMutation();
  const [globalError, setGlobalError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setGlobalError(null);
    try {
      const result = await ownerRegister(data).unwrap();
      if (result.status === 400) {
        setGlobalError(result.message);
      } else {
        router.push(ROUTES.OWNER.LOGIN);
      }
    } catch (err: any) {
      setGlobalError(err?.data?.message || 'Registration processing failure.');
    }
  };

  return (
    <div className="w-full max-w-xl rounded-xl border border-line bg-surface p-8 shadow-sm">
      <div className="text-center">
        <h2 className="font-display text-3xl font-bold text-ink">Create Host Account</h2>
        <p className="mt-2 text-sm text-ink-soft">Onboard your premium Paying Guest properties</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        {globalError && (
          <div className="rounded-md bg-danger-soft p-3 text-sm font-medium text-danger">
            {globalError}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">Full Name</label>
            <input
              type="text"
              {...register('name')}
              placeholder="John Doe"
              className="mt-1 w-full rounded-md border border-line bg-cream px-4 py-2 text-ink outline-none transition-all focus:border-brand"
            />
            {errors.name && <p className="mt-1 text-xs text-danger">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">Email Address</label>
            <input
              type="email"
              {...register('email')}
              placeholder="johndoe@example.com"
              className="mt-1 w-full rounded-md border border-line bg-cream px-4 py-2 text-ink outline-none transition-all focus:border-brand"
            />
            {errors.email && <p className="mt-1 text-xs text-danger">{errors.email.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">Primary Phone</label>
            <input
              type="text"
              {...register('phone')}
              placeholder="9876543210"
              className="mt-1 w-full rounded-md border border-line bg-cream px-4 py-2 text-ink outline-none transition-all focus:border-brand"
            />
            {errors.phone && <p className="mt-1 text-xs text-danger">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">WhatsApp Number (Optional)</label>
            <input
              type="text"
              {...register('whatsappNumber')}
              placeholder="9876543210"
              className="mt-1 w-full rounded-md border border-line bg-cream px-4 py-2 text-ink outline-none transition-all focus:border-brand"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">Password</label>
            <input
              type="password"
              {...register('password')}
              placeholder="••••••••"
              className="mt-1 w-full rounded-md border border-line bg-cream px-4 py-2 text-ink outline-none transition-all focus:border-brand"
            />
            {errors.password && <p className="mt-1 text-xs text-danger">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">Confirm Password</label>
            <input
              type="password"
              {...register('confirmPassword')}
              placeholder="••••••••"
              className="mt-1 w-full rounded-md border border-line bg-cream px-4 py-2 text-ink outline-none transition-all focus:border-brand"
            />
            {errors.confirmPassword && <p className="mt-1 text-xs text-danger">{errors.confirmPassword.message}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 w-full rounded-md bg-brand py-3 text-sm font-semibold text-cream transition-all hover:bg-brand-dark disabled:opacity-50"
        >
          {isLoading ? 'Registering Account...' : 'Submit Onboarding Request'}
        </button>
      </form>
    </div>
  );
}