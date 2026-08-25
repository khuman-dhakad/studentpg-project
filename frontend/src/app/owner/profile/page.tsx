'use client';

import {
  FormEvent,
  useEffect,
  useState,
} from 'react';

import {
  useRouter,
} from 'next/navigation';

import {
  ROUTES,
} from '@/constants/routes';

import {
  useGetOwnerProfileQuery,
  useUpdateOwnerProfileMutation,
} from '@/api/ownerApi';


/* =========================================================
 * TYPES
 * ========================================================= */

type ProfileForm = {

  name: string;

  email: string;

  phone: string;

  whatsappNumber: string;

};


const EMPTY_FORM: ProfileForm = {

  name: '',

  email: '',

  phone: '',

  whatsappNumber: '',

};


/* =========================================================
 * PAGE
 * ========================================================= */

export default function OwnerProfilePage() {

  const router = useRouter();


  /* =======================================================
   * GET PROFILE
   *
   * RTK Query automatically sends:
   *
   * Cookie: HttpOnly JWT Cookie
   *
   * because baseApi has:
   *
   * credentials: 'include'
   * ======================================================= */

  const {

    data: profile,

    isLoading,

    isError,

    error,

  } = useGetOwnerProfileQuery();


  /* =======================================================
   * UPDATE PROFILE
   * ======================================================= */

  const [

    updateOwnerProfile,

    {

      isLoading: isSaving,

    },

  ] = useUpdateOwnerProfileMutation();


  const [

    form,

    setForm,

  ] = useState<ProfileForm>(EMPTY_FORM);


  const [

    message,

    setMessage,

  ] = useState('');


  const [

    localError,

    setLocalError,

  ] = useState('');


  /* =======================================================
   * LOAD PROFILE INTO FORM
   * ======================================================= */

  useEffect(() => {

    if (!profile) {

      return;

    }


    setForm({

      name: profile.name ?? '',

      email: profile.email ?? '',

      phone: profile.phone ?? '',

      whatsappNumber:
        profile.whatsappNumber ?? '',

    });

  }, [profile]);


  /* =======================================================
   * HANDLE INPUT
   * ======================================================= */

  function handleChange(

    field: keyof ProfileForm,

    value: string,

  ) {

    setForm((previous) => ({

      ...previous,

      [field]: value,

    }));

  }


  /* =======================================================
   * SAVE PROFILE
   * ======================================================= */

  async function saveProfile(

    event: FormEvent<HTMLFormElement>,

  ) {

    event.preventDefault();


    setMessage('');

    setLocalError('');


    if (!form.name.trim()) {

      setLocalError(

        'Name is required.',

      );

      return;

    }


    if (!form.email.trim()) {

      setLocalError(

        'Email is required.',

      );

      return;

    }


    try {

      const response =

        await updateOwnerProfile({

          name: form.name.trim(),

          email: form.email.trim(),

          phone: form.phone.trim(),

          whatsappNumber:

            form.whatsappNumber.trim(),

        }).unwrap();


      setMessage(

        response.message ||

          'Profile updated successfully.',

      );

    }

    catch (error: unknown) {

      setLocalError(

        getErrorMessage(error),

      );

    }

  }


  /* =======================================================
   * LOADING
   * ======================================================= */

  if (isLoading) {

    return (

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">

        <div className="animate-pulse rounded-3xl border border-slate-200 bg-white p-8">

          <div className="h-6 w-40 rounded bg-slate-200" />

          <div className="mt-3 h-10 w-96 max-w-full rounded bg-slate-200" />

          <div className="mt-10 grid gap-5">

            <div className="h-14 rounded-2xl bg-slate-100" />

            <div className="h-14 rounded-2xl bg-slate-100" />

            <div className="h-14 rounded-2xl bg-slate-100" />

            <div className="h-14 rounded-2xl bg-slate-100" />

          </div>

        </div>

      </main>

    );

  }


  /* =======================================================
   * 401 ERROR
   * ======================================================= */

  if (isError) {

    return (

      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">

        <div className="w-full max-w-md rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm">

          <h1 className="text-xl font-black text-slate-900">

            Unable to load profile

          </h1>


          <p className="mt-3 text-sm text-red-600">

            {getErrorMessage(error)}

          </p>


          <button

            type="button"

            onClick={() =>

              router.push(

                ROUTES.OWNER.LOGIN,

              )

            }

            className="mt-6 rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-black text-white"

          >

            Go to login

          </button>

        </div>

      </main>

    );

  }


  /* =======================================================
   * PAGE
   * ======================================================= */

  return (

    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-5xl">


        {/* HEADER */}

        <div className="mb-8">

          <button

            type="button"

            onClick={() =>

              router.push(

                ROUTES.OWNER.DASHBOARD,

              )

            }

            className="mb-5 text-sm font-bold text-indigo-600 transition hover:text-indigo-800"

          >

            ← Back to dashboard

          </button>


          <p className="text-xs font-black uppercase tracking-[0.25em] text-indigo-600">

            Owner account

          </p>


          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">

            Your profile

          </h1>


          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">

            Manage your basic account and contact information.

          </p>

        </div>


        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">


          {/* FORM */}

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

            <div className="mb-8">

              <h2 className="text-xl font-black text-slate-900">

                Personal information

              </h2>

              <p className="mt-2 text-sm text-slate-500">

                Keep your contact details up to date.

              </p>

            </div>


            {message && (

              <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">

                <p className="text-sm font-bold text-emerald-700">

                  ✓ {message}

                </p>

              </div>

            )}


            {(localError || isError) && (

              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4">

                <p className="text-sm font-bold text-red-700">

                  {localError || getErrorMessage(error)}

                </p>

              </div>

            )}


            <form

              onSubmit={saveProfile}

              className="grid gap-6"

            >


              {/* NAME */}

              <div>

                <label

                  htmlFor="name"

                  className="mb-2 block text-sm font-bold text-slate-700"

                >

                  Full name

                </label>


                <input

                  id="name"

                  type="text"

                  value={form.name}

                  onChange={(event) =>

                    handleChange(

                      'name',

                      event.target.value,

                    )

                  }

                  placeholder="Enter your full name"

                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"

                />

              </div>


              {/* EMAIL */}

              <div>

                <label

                  htmlFor="email"

                  className="mb-2 block text-sm font-bold text-slate-700"

                >

                  Email address

                </label>


                <input

                  id="email"

                  type="email"

                  value={form.email}

                  onChange={(event) =>

                    handleChange(

                      'email',

                      event.target.value,

                    )

                  }

                  placeholder="Enter your email"

                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"

                />

              </div>


              {/* PHONE */}

              <div className="grid gap-6 sm:grid-cols-2">

                <div>

                  <label

                    htmlFor="phone"

                    className="mb-2 block text-sm font-bold text-slate-700"

                  >

                    Phone number

                  </label>


                  <input

                    id="phone"

                    type="tel"

                    value={form.phone}

                    onChange={(event) =>

                      handleChange(

                        'phone',

                        event.target.value,

                      )

                    }

                    placeholder="Enter phone number"

                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"

                  />

                </div>


                <div>

                  <label

                    htmlFor="whatsappNumber"

                    className="mb-2 block text-sm font-bold text-slate-700"

                  >

                    WhatsApp number

                  </label>


                  <input

                    id="whatsappNumber"

                    type="tel"

                    value={form.whatsappNumber}

                    onChange={(event) =>

                      handleChange(

                        'whatsappNumber',

                        event.target.value,

                      )

                    }

                    placeholder="Enter WhatsApp number"

                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"

                  />

                </div>

              </div>


              {/* BUTTONS */}

              <div className="flex flex-wrap gap-3 pt-2">

                <button

                  type="submit"

                  disabled={isSaving}

                  className="rounded-2xl bg-indigo-600 px-6 py-3.5 text-sm font-black text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"

                >

                  {isSaving

                    ? 'Saving...'

                    : 'Save changes'}

                </button>


                <button

                  type="button"

                  onClick={() =>

                    router.push(

                      ROUTES.OWNER.DASHBOARD,

                    )

                  }

                  className="rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-black text-slate-700 transition hover:bg-slate-50"

                >

                  Cancel

                </button>

              </div>

            </form>

          </section>


          {/* SUMMARY */}

          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-xl font-black text-indigo-700">

                {(form.name || 'O')

                  .charAt(0)

                  .toUpperCase()}

              </div>


              <div className="min-w-0">

                <h2 className="truncate text-lg font-black text-slate-900">

                  {form.name || 'Owner'}

                </h2>


                <p className="truncate text-sm text-slate-500">

                  {form.email || 'No email'}

                </p>

              </div>

            </div>


            <div className="my-6 h-px bg-slate-100" />


            <div className="space-y-4">

              <div>

                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">

                  Account status

                </p>


                <p className="mt-1 text-sm font-black text-amber-600">

                  Verification pending

                </p>

              </div>


              <div>

                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">

                  Account email

                </p>


                <p className="mt-1 break-all text-sm font-semibold text-slate-700">

                  {profile?.email || 'Not available'}

                </p>

              </div>

            </div>


            <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50 p-4">

              <p className="text-sm font-black text-indigo-900">

                Owner verification

              </p>


              <p className="mt-2 text-xs leading-5 text-indigo-700">

                Your verification documents will be submitted separately and reviewed securely by the platform.

              </p>

            </div>

          </aside>

        </div>

      </div>

    </main>

  );

}


/* =========================================================
 * ERROR HANDLER
 * ========================================================= */

function getErrorMessage(

  error: unknown,

): string {

  if (

    error &&

    typeof error === 'object' &&

    'data' in error

  ) {

    const data = (

      error as {

        data?: unknown;

      }

    ).data;


    if (

      data &&

      typeof data === 'object' &&

      'message' in data

    ) {

      const message = (

        data as {

          message?: unknown;

        }

      ).message;


      if (typeof message === 'string') {

        return message;

      }

    }

  }


  return 'Unable to load owner profile.';

}