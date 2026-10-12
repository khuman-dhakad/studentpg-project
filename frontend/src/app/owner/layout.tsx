'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ROUTES } from '@/constants/routes';
import { useSessionQuery } from '@/features/auth/api/authApi';
import { OwnerHeader } from '@/components/owner/OwnerHeader';
import { OwnerBottomNav } from '@/components/owner/OwnerBottomNav';
import { OwnerVerificationModal } from '@/components/owner/OwnerVerificationModal';

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isVerificationPromptOpen, setIsVerificationPromptOpen] = useState(false);

  // Session query
  const { data: session, isLoading } = useSessionQuery();

  useEffect(() => {
    const email = session?.user?.email;
    if (!email || session?.user?.role !== 'OWNER' || session.profile?.verificationStatus !== 'NOT_VERIFIED') {
      return;
    }

    const promptKey = `owner-verification-prompt:${email}`;
    if (localStorage.getItem(promptKey) !== 'dismissed') {
      setIsVerificationPromptOpen(true);
    }
  }, [session?.profile?.verificationStatus, session?.user?.email, session?.user?.role]);

  const dismissVerificationPrompt = () => {
    const email = session?.user?.email;
    if (email) {
      localStorage.setItem(`owner-verification-prompt:${email}`, 'dismissed');
    }
    setIsVerificationPromptOpen(false);
  };

  useEffect(() => {
    if (!isLoading && !session?.isAuthenticated) {
      router.replace(ROUTES.OWNER.LOGIN);
    }
  }, [isLoading, router, session?.isAuthenticated]);

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased flex flex-col">
      {/* Exact Header matching Reference Design (Section 3.A) */}
      <OwnerHeader />

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-4xl px-3.5 py-4 sm:px-6 sm:py-6 pb-24 md:pb-12">
        {children}
      </main>

      {/* Exact Owner Bottom Navigation matching Reference Design (Section 3.H) */}
      <OwnerBottomNav />

      {isVerificationPromptOpen && session?.profile && (
        <OwnerVerificationModal
          status={session.profile.verificationStatus ?? 'NOT_VERIFIED'}
          rejectionReason={session.profile.verificationRejectionReason}
          onClose={dismissVerificationPrompt}
        />
      )}
    </div>
  );
}