'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginInput } from '../schemas/authSchemas';
import { useLoginMutation } from '../api/authApi';
import { ROUTES } from '@/constants/routes';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';

export function OwnerLoginForm() {
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setGlobalError(null);
    try {
      const normalizedEmail = data.email.trim().toLowerCase();
      const result = await login({
        email: normalizedEmail,
        password: data.password,
      }).unwrap();

      if (!result || !result.role) {
        setGlobalError('Invalid login response from server.');
        return;
      }

      const role = result.role.trim().toUpperCase();
      if (role === 'ADMIN') {
        router.replace('/admin');
      } else if (role === 'OWNER') {
        router.replace(ROUTES.OWNER.PROFILE);
      } else {
        router.replace('/');
      }
    } catch (error: unknown) {
      console.error('Login error:', error);
      if (error && typeof error === 'object' && 'data' in error) {
        const errorData = (error as { data?: { message?: string; error?: string } }).data;
        setGlobalError(errorData?.message || errorData?.error || 'Invalid credentials or login failed.');
      } else {
        setGlobalError('Unable to log in. Please check your credentials and try again.');
      }
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* GLOBAL ERROR */}
      {globalError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-semibold text-rose-700">
          {globalError}
        </div>
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* EMAIL */}
        <div>
          <label className="mb-1.5 block text-xs font-black text-slate-700 tracking-wide">
            Email Address <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <Mail className="h-4 w-4" />
            </span>
            <input
              type="email"
              autoComplete="email"
              {...register('email')}
              placeholder="owner@example.com"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 pl-10 text-xs font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10"
            />
          </div>
          {errors.email && (
            <p className="mt-1.5 text-xs font-semibold text-rose-600">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* PASSWORD */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="block text-xs font-black text-slate-700 tracking-wide">
              Password <span className="text-rose-500">*</span>
            </label>
            <Link
              href={ROUTES.OWNER.FORGOT_PASSWORD}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <Lock className="h-4 w-4" />
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              {...register('password')}
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 pl-10 pr-10 text-xs font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 text-xs font-semibold text-rose-600">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 px-4 text-xs font-black uppercase tracking-wider text-white shadow-md shadow-emerald-900/10 transition-all hover:bg-emerald-700 active:scale-98 disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-white" />
              Verifying Credentials...
            </span>
          ) : (
            <>
              <span>Sign In to Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* REGISTER LINK */}
      <div className="text-center text-xs font-medium text-slate-500 pt-2 border-t border-slate-100">
        Don&apos;t have a host account?{' '}
        <Link
          href={ROUTES.OWNER.REGISTER}
          className="font-bold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
        >
          Create an account
        </Link>
      </div>
    </div>
  );
}