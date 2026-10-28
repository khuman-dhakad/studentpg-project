'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterInput } from '../schemas/authSchemas';
import {
  useOwnerRegisterMutation,
  useVerifyOwnerRegistrationMutation,
  useResendRegistrationOtpMutation,
} from '../api/authApi';
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
  RotateCcw,
} from 'lucide-react';

const PENDING_EMAIL_STORAGE_KEY = 'studentpg_pending_reg_email';

export function OwnerRegisterForm() {
  const router = useRouter();
  const [ownerRegister, { isLoading: isRegistering }] = useOwnerRegisterMutation();
  const [verifyOwnerRegistration, { isLoading: isVerifying }] = useVerifyOwnerRegistrationMutation();
  const [resendRegistrationOtp, { isLoading: isResending }] = useResendRegistrationOtpMutation();

  const [globalError, setGlobalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [otp, setOtp] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('');
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

  // Refresh Recovery: restore pending verification step if user reloads during OTP verification
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedEmail = sessionStorage.getItem(PENDING_EMAIL_STORAGE_KEY);
        if (savedEmail && savedEmail.includes('@')) {
          setRegisteredEmail(savedEmail.trim().toLowerCase());
          setShowOtpStep(true);
        }
      } catch {
        // Ignore storage access errors
      }
    }
  }, []);

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

      if (data.errors && typeof data.errors === 'object') {
        if (Array.isArray(data.errors)) {
          return data.errors.filter((item) => typeof item === 'string').join(', ');
        }
        const values = Object.values(data.errors).filter((item) => typeof item === 'string');
        if (values.length > 0) {
          return values.join(', ');
        }
      }

      if (typeof data.message === 'string' && data.message.trim()) {
        return data.message;
      }
      if (typeof data.error === 'string' && data.error.trim()) {
        return data.error;
      }
      if (typeof data.detail === 'string' && data.detail.trim()) {
        return data.detail;
      }
    }

    if (typeof apiError.data === 'string' && apiError.data.trim()) {
      return apiError.data;
    }

    if (typeof apiError.error === 'string' && apiError.error.trim()) {
      return apiError.error;
    }

    if (apiError.status === 400) return 'Invalid registration details. Please verify your information.';
    if (apiError.status === 409) return 'An account with this email or phone already exists.';
    if (apiError.status === 500) return 'Server error. Please try again later.';

    return 'Registration failed. Please try again.';
  };

  const onSubmit = async (data: RegisterInput) => {
    setGlobalError(null);
    setSuccessMessage(null);

    if (!agreed) {
      setCheckboxError(true);
      return;
    }

    setCheckboxError(false);

    try {
      const cleanPhone = data.phone.replace(/\D/g, '').slice(-10);
      const cleanWhatsapp = data.whatsappNumber
        ? data.whatsappNumber.replace(/\D/g, '').slice(-10)
        : '';

      const normalizedEmail = data.email.trim().toLowerCase();

      const payload = {
        name: data.name.trim(),
        email: normalizedEmail,
        password: data.password,
        phone: cleanPhone,
        whatsappNumber: cleanWhatsapp,
      };

      const response = await ownerRegister(payload).unwrap();
      if (response?.success === false) {
        setGlobalError(response.message || 'Registration failed. Please try again.');
        return;
      }

      setRegisteredEmail(normalizedEmail);
      if (typeof window !== 'undefined') {
        try {
          sessionStorage.setItem(PENDING_EMAIL_STORAGE_KEY, normalizedEmail);
        } catch {
          // Ignore storage quota
        }
      }

      setOtp('');
      setShowOtpStep(true);
      setGlobalError(null);
      setSuccessMessage('Verification code sent to your email.');
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

    setGlobalError(null);
    setSuccessMessage(null);

    try {
      const response = await verifyOwnerRegistration({
        email: registeredEmail,
        otp: trimmedOtp,
      }).unwrap();

      if (response?.success === false) {
        setGlobalError(response.message || 'Verification failed. Please try again.');
        return;
      }

      if (typeof window !== 'undefined') {
        try {
          sessionStorage.removeItem(PENDING_EMAIL_STORAGE_KEY);
        } catch {
          // Ignore
        }
      }

      setGlobalError(null);
      router.replace(ROUTES.OWNER.LOGIN);
    } catch (error: unknown) {
      console.error('OWNER REGISTRATION OTP ERROR:', error);
      const message = extractErrorMessage(error);
      setGlobalError(message);
    }
  };

  const handleResendOtp = async () => {
    if (!registeredEmail) {
      setGlobalError('Registration email not found. Please register again.');
      return;
    }

    setGlobalError(null);
    setSuccessMessage(null);

    try {
      const response = await resendRegistrationOtp({ email: registeredEmail }).unwrap();
      if (response?.success === false) {
        setGlobalError(response.message || 'Unable to resend verification code.');
        return;
      }

      setSuccessMessage('A fresh verification code has been sent to your email.');
      setOtp('');
    } catch (error: unknown) {
      console.error('RESEND OTP ERROR:', error);
      setGlobalError(extractErrorMessage(error));
    }
  };

  const handleBackToRegistration = () => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem(PENDING_EMAIL_STORAGE_KEY);
      } catch {
        // Ignore
      }
    }
    setShowOtpStep(false);
    setOtp('');
    setGlobalError(null);
    setSuccessMessage(null);
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

        {/* SUCCESS MESSAGE */}
        {successMessage && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-semibold text-emerald-800">
            {successMessage}
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
                {errors.whatsappNumber && (
                  <p className="mt-1.5 text-xs font-semibold text-rose-600">
                    {errors.whatsappNumber.message}
                  </p>
                )}
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
                'Create Account'
              )}
            </button>
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
                isVerifying
                  ? 'cursor-not-allowed bg-slate-300 text-slate-500 shadow-none'
                  : 'cursor-pointer bg-emerald-600 hover:bg-emerald-700 active:scale-98'
              }`}
            >
              {isVerifying ? 'Verifying Email...' : 'Verify & Complete Registration'}
            </button>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isResending}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline underline-offset-2 cursor-pointer disabled:opacity-50"
              >
                {isResending ? 'Sending new OTP...' : 'Resend OTP'}
              </button>

              <button
                type="button"
                onClick={handleBackToRegistration}
                className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-700 cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Change email / re-register</span>
              </button>
            </div>
          </div>
        )}
      </form>

      {/* FOOTER */}
      <div className="mt-6 border-t border-slate-100 pt-6 text-center">
        <p className="text-xs font-semibold text-slate-500">
          Already have a host account?{' '}
          <Link
            href={ROUTES.OWNER.LOGIN}
            className="font-bold text-emerald-700 hover:underline"
          >
            Sign in here
          </Link>
        </p>
      </div>

      {/* MODAL */}
      {modalType && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs"
        >
          <div className="relative max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <button
              onClick={() => setModalType(null)}
              className="absolute right-4 top-4 rounded-xl p-2 text-slate-400 hover:bg-slate-100 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {modalType === 'privacy' ? (
              <div className="prose prose-sm prose-slate">
                <div className="flex items-center gap-2 text-emerald-600 mb-2">
                  <ShieldCheck className="h-6 w-6" />
                  <h3 className="text-lg font-black text-slate-900 m-0">Privacy Policy</h3>
                </div>
                <p className="text-xs leading-relaxed text-slate-600">
                  StudentPG collects your name, email, phone number, and property details to facilitate verified bookings. Your personal information is securely stored and never sold to third parties.
                </p>
              </div>
            ) : (
              <div className="prose prose-sm prose-slate">
                <div className="flex items-center gap-2 text-emerald-600 mb-2">
                  <FileText className="h-6 w-6" />
                  <h3 className="text-lg font-black text-slate-900 m-0">Terms of Owner</h3>
                </div>
                <p className="text-xs leading-relaxed text-slate-600">
                  By listing on StudentPG, you confirm that you are the lawful owner or authorized operator of the property. All pricing, amenities, and room availability submitted must be accurate.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
