'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterInput } from '../schemas/authSchemas';
import { useOwnerRegisterMutation } from '../api/authApi';
import { ROUTES } from '@/constants/routes';
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Building,
  ShieldCheck,
  FileText,
  X,
} from 'lucide-react';

export function OwnerRegisterForm() {
  const router = useRouter();
  const [ownerRegister, { isLoading }] = useOwnerRegisterMutation();

  const [globalError, setGlobalError] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [modalType, setModalType] = useState<'privacy' | 'terms' | null>(null);
  const [checkboxError, setCheckboxError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      whatsappNumber: '',
      password: '',
      confirmPassword: '',
    },
  });

  const extractErrorMessage = (error: unknown): string => {
    if (!error || typeof error !== 'object') {
      return 'Registration failed. Please try again.';
    }

    const apiError = error as {
      status?: number;
      data?: unknown;
      error?: string;
    };

    if (apiError.data && typeof apiError.data === 'object') {
      const data = apiError.data as {
        message?: unknown;
        error?: unknown;
        detail?: unknown;
        errors?: unknown;
      };

      if (typeof data.message === 'string' && data.message.trim()) {
        return data.message;
      }
      if (typeof data.error === 'string' && data.error.trim()) {
        return data.error;
      }
      if (typeof data.detail === 'string' && data.detail.trim()) {
        return data.detail;
      }
      if (Array.isArray(data.errors)) {
        return data.errors.filter((item) => typeof item === 'string').join(', ');
      }
    }

    if (typeof apiError.data === 'string' && apiError.data.trim()) {
      return apiError.data;
    }

    if (typeof apiError.error === 'string' && apiError.error.trim()) {
      return apiError.error;
    }

    if (apiError.status === 400) return 'Invalid registration details.';
    if (apiError.status === 409) return 'An account with this email or phone already exists.';
    if (apiError.status === 500) return 'Server error. Please try again later.';

    return 'Registration failed. Please try again.';
  };

  const onSubmit = async (data: RegisterInput) => {
    setGlobalError(null);

    if (!agreed) {
      setCheckboxError(true);
      return;
    }

    setCheckboxError(false);

    try {
      // normalize phone numbers to 10-digit Indian format expected by backend
      const normalizeNumber = (s?: string) => {
        if (!s) return '';
        const digits = s.replace(/\D/g, '');
        if (digits.length > 10 && digits.endsWith('91')) {
          // unlikely, but fallback
          return digits.slice(digits.length - 10);
        }
        if (digits.length > 10 && digits.startsWith('91')) {
          return digits.slice(digits.length - 10);
        }
        if (digits.length >= 10) return digits.slice(digits.length - 10);
        return digits;
      };

      if (data.password !== data.confirmPassword) {
        setGlobalError('Passwords do not match.');
        return;
      }

      const payload = {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
        phone: normalizeNumber(data.phone),
        whatsappNumber: normalizeNumber(data.whatsappNumber),
      } as Record<string, unknown>;

      const response = await ownerRegister(payload).unwrap();
      if (response?.success === false) {
        setGlobalError(response.message || 'Registration failed. Please try again.');
        return;
      }
      router.replace(ROUTES.OWNER.LOGIN);
    } catch (error: unknown) {
      console.error('OWNER REGISTRATION ERROR:', error);
      const message = extractErrorMessage(error);
      setGlobalError(message);
    }
  };

  return (
    <div className="w-full max-w-2xl rounded-2xl border border-line bg-surface p-6 shadow-xl shadow-slate-100/50 backdrop-blur-sm md:p-8">
      {/* HEADER */}
      <div className="text-center">
        <h2 className="text-2xl font-extrabold tracking-tight text-ink md:text-3xl">
          Create Host Account
        </h2>
        <p className="mt-2 text-xs text-ink-soft md:text-sm">
          Onboard your premium Paying Guest properties
        </p>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        {/* GLOBAL ERROR */}
        {globalError && (
          <div className="rounded-xl border border-danger/20 bg-danger-soft/10 p-3.5 text-xs font-medium text-danger md:text-sm">
            {globalError}
          </div>
        )}

        {/* NAME + EMAIL */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* NAME */}
          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-ink-soft">
              Full Name
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-ink-soft">
                <User className="h-4 w-4" />
              </span>
              <input
                type="text"
                autoComplete="name"
                {...register('name')}
                placeholder="John Doe"
                className="w-full rounded-xl border border-line bg-cream px-4 py-2.5 pl-10 text-sm text-ink outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/10 placeholder:text-ink-soft/50"
              />
            </div>
            {errors.name && (
              <p className="mt-1.5 text-xs font-semibold text-danger">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-ink-soft">
              Email Address
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-ink-soft">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                autoComplete="email"
                {...register('email')}
                placeholder="johndoe@example.com"
                className="w-full rounded-xl border border-line bg-cream px-4 py-2.5 pl-10 text-sm text-ink outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/10 placeholder:text-ink-soft/50"
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-xs font-semibold text-danger">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        {/* PHONE + WHATSAPP */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* PHONE */}
          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-ink-soft">
              Primary Phone
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-ink-soft">
                <Phone className="h-4 w-4" />
              </span>
              <input
                type="text"
                autoComplete="tel"
                {...register('phone')}
                placeholder="9876543210"
                className="w-full rounded-xl border border-line bg-cream px-4 py-2.5 pl-10 text-sm text-ink outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/10 placeholder:text-ink-soft/50"
              />
            </div>
            {errors.phone && (
              <p className="mt-1.5 text-xs font-semibold text-danger">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* WHATSAPP */}
          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-ink-soft">
              WhatsApp Number
              <span className="ml-1 text-[10px] font-normal lowercase text-ink-soft/60">
                (optional)
              </span>
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-ink-soft">
                <Building className="h-4 w-4" />
              </span>
              <input
                type="text"
                autoComplete="tel"
                {...register('whatsappNumber')}
                placeholder="9876543210"
                className="w-full rounded-xl border border-line bg-cream px-4 py-2.5 pl-10 text-sm text-ink outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/10 placeholder:text-ink-soft/50"
              />
            </div>
          </div>
        </div>

        {/* PASSWORDS */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* PASSWORD */}
          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-ink-soft">
              Password
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-ink-soft">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type={showPass ? 'text' : 'password'}
                autoComplete="new-password"
                {...register('password')}
                placeholder="••••••••"
                className="w-full rounded-xl border border-line bg-cream px-4 py-2.5 pl-10 pr-10 text-sm text-ink outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/10 placeholder:text-ink-soft/50"
              />
              <button
                type="button"
                onClick={() => setShowPass((value) => !value)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-ink-soft hover:text-ink"
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs font-semibold text-danger">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-ink-soft">
              Confirm Password
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-ink-soft">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type={showPass ? 'text' : 'password'}
                autoComplete="new-password"
                {...register('confirmPassword')}
                placeholder="••••••••"
                className="w-full rounded-xl border border-line bg-cream px-4 py-2.5 pl-10 text-sm text-ink outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/10 placeholder:text-ink-soft/50"
              />
            </div>
            {errors.confirmPassword && (
              <p className="mt-1.5 text-xs font-semibold text-danger">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        {/* AGREEMENT */}
        <div className="pt-2">
          <div className="flex items-start gap-2.5">
            <input
              type="checkbox"
              id="privacy-check"
              checked={agreed}
              onChange={(e) => {
                const checked = e.target.checked;
                setAgreed(checked);
                if (checked) setCheckboxError(false);
              }}
              className="mt-0.5 h-4 w-4 cursor-pointer rounded border-line accent-brand"
            />
            <label
              htmlFor="privacy-check"
              className="cursor-pointer select-none text-xs font-semibold leading-snug text-ink-soft"
            >
              I agree to the{' '}
              <button
                type="button"
                onClick={() => setModalType('privacy')}
                className="font-bold text-brand hover:underline"
              >
                Privacy Policy
              </button>{' '}
              and{' '}
              <button
                type="button"
                onClick={() => setModalType('terms')}
                className="font-bold text-brand hover:underline"
              >
                Terms of Owner
              </button>
              .
            </label>
          </div>

          {checkboxError && (
            <p className="mt-1.5 animate-pulse text-xs font-semibold text-danger">
              ⚠️ Please accept the Terms & Privacy Policy before submitting.
            </p>
          )}
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={isLoading || !agreed}
          className={`mt-2 w-full rounded-xl py-3.5 text-sm font-bold shadow-md transition-all duration-200 ${
            agreed && !isLoading
              ? 'cursor-pointer bg-brand text-cream hover:bg-brand-dark active:scale-[0.98]'
              : 'cursor-not-allowed bg-slate-200 text-slate-400 shadow-none'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="h-4 w-4 animate-spin text-cream"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Creating Account...
            </span>
          ) : (
            'Register Property Host'
          )}
        </button>

        {/* FOOTER LINK */}
        <div className="mt-4 text-center text-xs text-ink-soft">
          Already have a host account?{' '}
          <Link href={ROUTES.OWNER.LOGIN} className="font-bold text-brand hover:underline">
            Sign In
          </Link>
        </div>
      </form>

      {/* MODALS */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl bg-surface p-6 shadow-2xl">
            <button
              onClick={() => setModalType(null)}
              className="absolute right-4 top-4 rounded-lg p-1 text-ink-soft hover:bg-cream hover:text-ink"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2 text-brand">
              {modalType === 'privacy' ? (
                <ShieldCheck className="h-6 w-6" />
              ) : (
                <FileText className="h-6 w-6" />
              )}
              <h3 className="text-lg font-bold text-ink">
                {modalType === 'privacy' ? 'Privacy Policy' : 'Terms of Owner'}
              </h3>
            </div>
            <div className="mt-4 max-h-60 overflow-y-auto text-xs text-ink-soft space-y-2 leading-relaxed">
              {modalType === 'privacy' ? (
                <>
                  <p>We respect your privacy and protect all personal and property data.</p>
                  <p>Your contact details will only be used for property management communication and user verification.</p>
                </>
              ) : (
                <>
                  <p>By joining as a host, you agree to maintain accuracy in property details and honor tenant bookings.</p>
                  <p>Host accounts must comply with regional hospitality and rental standards.</p>
                </>
              )}
            </div>
            <button
              onClick={() => {
                setAgreed(true);
                setCheckboxError(false);
                setModalType(null);
              }}
              className="mt-6 w-full rounded-xl bg-brand py-2.5 text-xs font-bold text-cream hover:bg-brand-dark"
            >
              I Accept & Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}