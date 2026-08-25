'use client';

import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useLogoutMutation } from '../api/authApi';
import { ROUTES } from '@/constants/routes';

export default function AdminLogoutButton() {
  const router = useRouter();

  const [
    logout,
    {
      isLoading,
    },
  ] = useLogoutMutation();

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  const handleLogout = async () => {
    setError(null);

    try {
      await logout().unwrap();

      /*
       * After successful logout,
       * go to login page
       */
      router.replace(ROUTES.OWNER.LOGIN);

      /*
       * Refresh server-side auth state
       */
      router.refresh();

    } catch (error) {
      console.error(
        'Admin logout failed:',
        error
      );

      setError(
        'Logout failed. Please try again.'
      );
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">

      <button
        type="button"
        onClick={handleLogout}
        disabled={isLoading}
        className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
      >

        <LogOut className="h-4 w-4" />

        {isLoading
          ? 'Logging out...'
          : 'Logout'}

      </button>

      {error && (
        <p className="text-xs font-semibold text-rose-600">
          {error}
        </p>
      )}

    </div>
  );
}