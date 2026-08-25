'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  loginSchema,
  LoginInput,
} from '../schemas/authSchemas';

import {
  useLoginMutation,
} from '../api/authApi';

import { ROUTES } from '@/constants/routes';

import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
} from 'lucide-react';

export function OwnerLoginForm() {
  const router = useRouter();

  const [
    login,
    {
      isLoading,
    },
  ] = useLoginMutation();

  const [
    globalError,
    setGlobalError,
  ] = useState<string | null>(null);

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const {
    register,
    handleSubmit,
    formState: {
      errors,
    },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (
    data: LoginInput
  ) => {

    setGlobalError(null);

    try {

      const normalizedEmail =
        data.email
          .trim()
          .toLowerCase();

      const result =
  await login({
    email: normalizedEmail,
    password: data.password,
  }).unwrap();



if (
  !result ||
  !result.role
) {

  setGlobalError(
    'Invalid login response from server.'
  );

  return;
}

const role =
  result.role
    .trim()
    .toUpperCase();
      /*
       * Redirect according to role
       */

      if (role === 'ADMIN') {

        router.replace(ROUTES.ADMIN.DASHBOARD);

      } else if (role === 'OWNER') {

        router.replace(
          ROUTES.OWNER.DASHBOARD
        );

      } else {

        setGlobalError(
          'Invalid user role received from server.'
        );

        return;
      }

      router.refresh();

    } catch (error: any) {
    setGlobalError(
        error?.data?.message ??
        'Invalid email or password.'
    );
}
  };

  return (

    <div
      className="
        w-full
        max-w-md
        rounded-2xl
        border
        border-line
        bg-surface
        p-6
        shadow-xl
        shadow-slate-100/50
        backdrop-blur-sm
        md:p-8
      "
    >

      {/* HEADER */}

      <div
        className="
          text-center
        "
      >

        <h2
          className="
            text-2xl
            font-extrabold
            tracking-tight
            text-ink
            md:text-3xl
          "
        >

          Owner Gateway

        </h2>

        <p
          className="
            mt-2
            text-xs
            text-ink-soft
            md:text-sm
          "
        >

          Sign in to manage listed accommodations

        </p>

      </div>


      {/* FORM */}

      <form
        onSubmit={
          handleSubmit(
            onSubmit
          )
        }

        className="
          mt-8
          space-y-5
        "
      >

        {/* GLOBAL ERROR */}

        {globalError && (

          <div
            className="
              animate-shake
              rounded-xl
              border
              border-danger/20
              bg-danger-soft/10
              p-3.5
              text-xs
              font-medium
              text-danger
              md:text-sm
            "
          >

            {globalError}

          </div>

        )}


        {/* EMAIL */}

        <div>

          <label
            className="
              mb-1.5
              block
              text-[11px]
              font-bold
              uppercase
              tracking-wider
              text-ink-soft
            "
          >

            Email Address

          </label>


          <div
            className="
              relative
            "
          >

            <span
              className="
                pointer-events-none
                absolute
                inset-y-0
                left-0
                flex
                items-center
                pl-3.5
                text-ink-soft
              "
            >

              <Mail
                className="
                  h-4
                  w-4
                "
              />

            </span>


            <input
              type="email"

              autoComplete="email"

              {...register(
                'email'
              )}

              placeholder="owner@example.com"

              className="
                w-full
                rounded-xl
                border
                border-line
                bg-cream
                px-4
                py-3
                pl-10
                text-sm
                text-ink
                outline-none
                transition-all
                duration-200
                placeholder:text-ink-soft/50
                focus:border-brand
                focus:ring-2
                focus:ring-brand/10
              "
            />

          </div>


          {errors.email && (

            <p
              className="
                mt-1.5
                text-xs
                font-semibold
                text-danger
              "
            >

              {errors.email.message}

            </p>

          )}

        </div>


        {/* PASSWORD */}

        <div>

          <div
            className="
              mb-1.5
              flex
              items-center
              justify-between
            "
          >

            <label
              className="
                block
                text-[11px]
                font-bold
                uppercase
                tracking-wider
                text-ink-soft
              "
            >

              Security Password

            </label>


            <Link
                href={ROUTES.OWNER.FORGOT_PASSWORD}
                className="
                  text-[11px]
                  font-bold
                  text-brand
                  transition-colors
                  hover:text-brand-dark
                "
              >
                Forgot?
              </Link>

          </div>


          <div
            className="
              relative
            "
          >

            <span
              className="
                pointer-events-none
                absolute
                inset-y-0
                left-0
                flex
                items-center
                pl-3.5
                text-ink-soft
              "
            >

              <Lock
                className="
                  h-4
                  w-4
                "
              />

            </span>


            <input
              type={
                showPassword
                  ? 'text'
                  : 'password'
              }

              autoComplete="current-password"

              {...register(
                'password'
              )}

              placeholder="••••••••"

              className="
                w-full
                rounded-xl
                border
                border-line
                bg-cream
                px-4
                py-3
                pl-10
                pr-10
                text-sm
                text-ink
                outline-none
                transition-all
                duration-200
                placeholder:text-ink-soft/50
                focus:border-brand
                focus:ring-2
                focus:ring-brand/10
              "
            />


            <button
              type="button"

              onClick={() =>
                setShowPassword(
                  (
                    value
                  ) =>
                    !value
                )
              }

              className="
                absolute
                inset-y-0
                right-0
                flex
                items-center
                pr-3.5
                text-ink-soft
                transition-colors
                hover:text-ink
              "

              aria-label={
                showPassword
                  ? 'Hide password'
                  : 'Show password'
              }
            >

              {showPassword ? (

                <EyeOff
                  className="
                    h-4
                    w-4
                  "
                />

              ) : (

                <Eye
                  className="
                    h-4
                    w-4
                  "
                />

              )}

            </button>

          </div>


          {errors.password && (

            <p
              className="
                mt-1.5
                text-xs
                font-semibold
                text-danger
              "
            >

              {errors.password.message}

            </p>

          )}

        </div>


        {/* SUBMIT */}

        <button
          type="submit"

          disabled={
            isLoading
          }

          className="
            group
            relative
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-brand
            py-3.5
            text-sm
            font-bold
            text-cream
            shadow-md
            shadow-brand/10
            transition-all
            duration-200
            hover:bg-brand-dark
            active:scale-[0.98]
            disabled:pointer-events-none
            disabled:opacity-50
          "
        >

          {isLoading ? (

            <span
              className="
                flex
                items-center
                gap-2
              "
            >

              <svg
                className="
                  h-4
                  w-4
                  animate-spin
                  text-cream
                "

                fill="none"

                viewBox="0 0 24 24"
              >

                <circle
                  className="
                    opacity-25
                  "

                  cx="12"
                  cy="12"
                  r="10"

                  stroke="currentColor"

                  strokeWidth="4"
                />

                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l-2.647-2.647z"
                  />

              </svg>

              Verifying Credentials...

            </span>

          ) : (

            <>

              Authenticate Account

              <ArrowRight
                className="
                  h-4
                  w-4
                  transition-transform
                  group-hover:translate-x-0.5
                "
              />

            </>

          )}

        </button>

      </form>


      {/* REGISTER LINK */}

      <div
        className="
          mt-6
          text-center
          text-xs
          text-ink-soft
          md:text-sm
        "
      >

        Don&apos;t have a host account?{' '}
<Link href={ROUTES.OWNER.REGISTER}  className="
            font-bold
            text-brand
            transition-colors
            hover:text-brand-dark
          ">
  Create an account
</Link>

      </div>

    </div>

  );
}