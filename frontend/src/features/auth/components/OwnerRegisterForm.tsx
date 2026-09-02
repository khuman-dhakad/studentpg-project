'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterInput } from '../schemas/authSchemas';
import { useOwnerRegisterMutation, useVerifyOwnerRegistrationMutation } from '../api/authApi';
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
  const [ownerRegister, { isLoading: isRegistering }] = useOwnerRegisterMutation();
  const [verifyOwnerRegistration, { isLoading: isVerifying }] = useVerifyOwnerRegistrationMutation();

  const [globalError, setGlobalError] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [otp, setOtp] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [registrationPayload, setRegistrationPayload] = useState<{
    name: string;
    email: string;
    password: string;
    phone: string;
    whatsappNumber: string;
  } | null>(null);
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

      setRegistrationPayload({
        name: payload.name as string,
        email: payload.email as string,
        password: payload.password as string,
        phone: payload.phone as string,
        whatsappNumber: payload.whatsappNumber as string,
      });
      setRegisteredEmail(payload.email as string);
      setOtp('');
      setShowOtpStep(true);
      setGlobalError(null);
    } catch (error: unknown) {
      console.error('OWNER REGISTRATION ERROR:', error);
      const message = extractErrorMessage(error);
      setGlobalError(message);
    }
  };

  const handleVerifyOtp = async () => {
    if (!registeredEmail) {
      setGlobalError('Please complete the registration form first.');
      return;
    }

    const trimmedOtp = otp.trim();
    if (trimmedOtp.length !== 6 || !/^\d{6}$/.test(trimmedOtp)) {
      setGlobalError('Enter a valid 6-digit OTP sent to your email.');
      return;
    }

    try {
      const payload = registrationPayload ?? {
        name: '',
        email: registeredEmail,
        password: '',
        phone: '',
        whatsappNumber: '',
      };

      const response = await verifyOwnerRegistration({
        name: payload.name.trim(),
        email: payload.email,
        password: payload.password,
        phone: payload.phone.replace(/\D/g, '').slice(-10),
        whatsappNumber: payload.whatsappNumber.replace(/\D/g, '').slice(-10),
        otp: trimmedOtp,
      }).unwrap();

      if (response?.success === false) {
        setGlobalError(response.message || 'Verification failed. Please try again.');
        return;
      }

      setGlobalError(null);
      router.replace(ROUTES.OWNER.LOGIN);
    } catch (error: unknown) {
      console.error('OWNER REGISTRATION OTP ERROR:', error);
      const message = extractErrorMessage(error);
      setGlobalError(message);
    }
  };

  return (
    <div className="w-full max-w-2xl rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
      {/* HEADER */}
      <div className="text-center">
        <h2 className="text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
          Create Host Account
        </h2>
        <p className="mt-1.5 text-xs font-medium text-slate-500 md:text-sm">
          Onboard your premium Paying Guest properties on StudentPG
        </p>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        {/* GLOBAL ERROR */}
        {globalError && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-semibold text-rose-700">
            {globalError}
          </div>
        )}

        {showOtpStep && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-semibold text-emerald-800">
            Verification code sent to <span className="font-black">{registeredEmail}</span>. Enter the 6-digit OTP to activate your host account.
          </div>
        )}

        {!showOtpStep && (
          <>
          {/* NAME + EMAIL */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* NAME */}
          <div>
            <label className="mb-1.5 block text-xs font-black text-slate-700 tracking-wide">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <User className="h-4 w-4" />
              </span>
              <input
                type="text"
                autoComplete="name"
                {...register('name')}
                placeholder="John Doe"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 pl-10 text-xs font-semibold text-slate-900 outline-none transition-all focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10 placeholder:text-slate-400"
              />
            </div>
            {errors.name && (
              <p className="mt-1.5 text-xs font-semibold text-rose-600">
                {errors.name.message}
              </p>
            )}
          </div>

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
                placeholder="johndoe@example.com"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 pl-10 text-xs font-semibold text-slate-900 outline-none transition-all focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10 placeholder:text-slate-400"
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-xs font-semibold text-rose-600">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        {/* PHONE + WHATSAPP */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* PHONE */}
          <div>
            <label className="mb-1.5 block text-xs font-black text-slate-700 tracking-wide">
              Primary Phone <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Phone className="h-4 w-4" />
              </span>
              <input
                type="text"
                autoComplete="tel"
                {...register('phone')}
                placeholder="9876543210"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 pl-10 text-xs font-semibold text-slate-900 outline-none transition-all focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10 placeholder:text-slate-400"
              />
            </div>
            {errors.phone && (
              <p className="mt-1.5 text-xs font-semibold text-rose-600">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* WHATSAPP */}
          <div>
            <label className="mb-1.5 block text-xs font-black text-slate-700 tracking-wide">
              WhatsApp Number
              <span className="ml-1 text-[10px] font-normal text-slate-400">
                (optional)
              </span>
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Building className="h-4 w-4" />
              </span>
              <input
                type="text"
                autoComplete="tel"
                {...register('whatsappNumber')}
                placeholder="9876543210"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 pl-10 text-xs font-semibold text-slate-900 outline-none transition-all focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10 placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* PASSWORDS */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* PASSWORD */}
          <div>
            <label className="mb-1.5 block text-xs font-black text-slate-700 tracking-wide">
              Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type={showPass ? 'text' : 'password'}
                autoComplete="new-password"
                {...register('password')}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 pl-10 pr-10 text-xs font-semibold text-slate-900 outline-none transition-all focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10 placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowPass((value) => !value)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs font-semibold text-rose-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="mb-1.5 block text-xs font-black text-slate-700 tracking-wide">
              Confirm Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type={showPass ? 'text' : 'password'}
                autoComplete="new-password"
                {...register('confirmPassword')}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 pl-10 text-xs font-semibold text-slate-900 outline-none transition-all focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10 placeholder:text-slate-400"
              />
            </div>
            {errors.confirmPassword && (
              <p className="mt-1.5 text-xs font-semibold text-rose-600">
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
              className="mt-0.5 h-4 w-4 cursor-pointer rounded border-slate-300 text-emerald-600 accent-emerald-600 focus:ring-emerald-500"
            />
            <label
              htmlFor="privacy-check"
              className="cursor-pointer select-none text-xs font-semibold leading-snug text-slate-600"
            >
              I agree to the{' '}
              <button
                type="button"
                onClick={() => setModalType('privacy')}
                className="font-bold text-emerald-700 hover:underline cursor-pointer"
              >
                Privacy Policy
              </button>{' '}
              and{' '}
              <button
                type="button"
                onClick={() => setModalType('terms')}
                className="font-bold text-emerald-700 hover:underline cursor-pointer"
              >
                Terms of Owner
              </button>
              .
            </label>
          </div>

          {checkboxError && (
            <p className="mt-1.5 text-xs font-semibold text-rose-600">
              ⚠️ Please accept the Terms &amp; Privacy Policy before submitting.
            </p>
          )}
        </div>

          </>
        )}

        {showOtpStep && (
          <div className="space-y-4 pt-2">
            <div>
              <label className="mb-1.5 block text-xs font-black text-slate-700 tracking-wide">
                Email Verification OTP (6 digits)
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-xs font-semibold text-slate-900 outline-none transition-all focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10 placeholder:text-slate-400"
              />
            </div>

            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={isVerifying}
              className={`w-full rounded-xl py-3 px-4 text-xs font-black uppercase tracking-wider text-white shadow-md shadow-emerald-900/10 transition-all ${
                isVerifying ? 'cursor-not-allowed bg-slate-300 text-slate-500 shadow-none' : 'cursor-pointer bg-emerald-600 hover:bg-emerald-700 active:scale-98'
              }`}
            >
              {isVerifying ? 'Verifying Email...' : 'Verify & Complete Registration'}
            </button>

            <button
              type="button"
              onClick={async () => {
                try {
                  const formValues = (document.querySelector('form') as HTMLFormElement | null)?.elements;
                  const name = (formValues?.namedItem('name') as HTMLInputElement | null)?.value || '';
                  const email = registeredEmail || (formValues?.namedItem('email') as HTMLInputElement | null)?.value || '';
                  const password = (formValues?.namedItem('password') as HTMLInputElement | null)?.value || '';
                  const phone = (formValues?.namedItem('phone') as HTMLInputElement | null)?.value || '';
                  const whatsappNumber = (formValues?.namedItem('whatsappNumber') as HTMLInputElement | null)?.value || '';

                  const response = await ownerRegister({
                    name: name.trim(),
                    email: email.trim().toLowerCase(),
                    password,
                    phone: phone.replace(/\D/g, '').slice(-10),
                    whatsappNumber: whatsappNumber.replace(/\D/g, '').slice(-10),
                  }).unwrap();

                  if (response?.success === false) {
                    setGlobalError(response.message || 'Unable to resend verification code.');
                    return;
                  }

                  setGlobalError(null);
                  setOtp('');
                  setShowOtpStep(true);
                  setRegisteredEmail(email.trim().toLowerCase());
                } catch (error: unknown) {
                  console.error('RESEND OTP ERROR:', error);
                  setGlobalError(extractErrorMessage(error));
                }
              }}
              className="w-full text-center text-xs font-bold text-emerald-700 hover:text-emerald-800 underline underline-offset-2 cursor-pointer"
            >
              Resend OTP
            </button>
          </div>
        )}

        {!showOtpStep && (
          <>
            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isRegistering || !agreed}
              className={`mt-2 w-full rounded-xl py-3 px-4 text-xs font-black uppercase tracking-wider shadow-md transition-all ${
                agreed && !isRegistering
                  ? 'cursor-pointer bg-emerald-600 text-white shadow-emerald-900/10 hover:bg-emerald-700 active:scale-98'
                  : 'cursor-not-allowed bg-slate-200 text-slate-400 shadow-none'
              }`}
            >
              {isRegistering ? (
                <span className="flex items-center justify-center gap-2 text-white">
                  <svg
                    className="h-4 w-4 animate-spin text-white"
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
          </>
        )}

        {/* FOOTER LINK */}
        <div className="mt-4 text-center text-xs font-medium text-slate-500 pt-3 border-t border-slate-100">
          Already have a host account?{' '}
          <Link href={ROUTES.OWNER.LOGIN} className="font-bold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer">
            Sign In
          </Link>
        </div>
      </form>

      {/* MODALS */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl bg-white border border-slate-200 p-6 shadow-2xl">
            <button
              onClick={() => setModalType(null)}
              className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2 text-emerald-600">
              {modalType === 'privacy' ? (
                <ShieldCheck className="h-5 w-5" />
              ) : (
                <FileText className="h-5 w-5" />
              )}
              <h3 className="text-base font-black text-slate-900">
                {modalType === 'privacy' ? 'Privacy Policy' : 'Terms of Owner'}
              </h3>
            </div>
            <div className="mt-4 max-h-60 overflow-y-auto text-xs text-slate-600 space-y-2 leading-relaxed">
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
              className="mt-6 w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-black uppercase tracking-wider text-white hover:bg-emerald-700 shadow-md shadow-emerald-900/10 cursor-pointer"
            >
              I Accept &amp; Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}