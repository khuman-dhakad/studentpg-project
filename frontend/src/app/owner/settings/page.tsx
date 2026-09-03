'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, 
  KeyRound, 
  ShieldCheck, 
  Mail, 
  Phone, 
  Lock, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  Eye, 
  EyeOff, 
  Loader2
} from 'lucide-react';

// RTK Query Hooks
import { useSessionQuery } from '@/features/auth/api/authApi';
import { BACKEND_ENDPOINTS } from '@/api/endpoints';
import { OwnerVerificationModal } from '@/components/owner/OwnerVerificationModal';

type TabType = 'Profile Settings' | 'Change Password' | 'Verification' | 'Account & Security';

export default function OwnerSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('Profile Settings');

  // Redux/RTK Query Session Hook
  const { data: session, isLoading: isSessionLoading } = useSessionQuery(undefined, {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  // Local Form States
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // Status & Password States
  const [isUpdating, setIsUpdating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password Reset Flow States
  const [passwordStep, setPasswordStep] = useState<'request' | 'verify'>('request');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  // Sync Session Data to Form Input States
  useEffect(() => {
    if (session?.profile) {
      setName(session.profile.name || '');
      setPhone(session.profile.phone || '');
    }
  }, [session]);

  const userEmail = session?.user?.email || session?.profile?.email || '';
  const verificationStatus = session?.profile?.verificationStatus ?? 'NOT_VERIFIED';
  const isVerificationPending = verificationStatus === 'PENDING';
  const isVerificationVerified = verificationStatus === 'VERIFIED';
  const canSubmitVerification = verificationStatus === 'NOT_VERIFIED' || verificationStatus === 'REJECTED';

  // 1. Profile Details Update Handler
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setStatusMessage(null);

    try {
      const res = await fetch(BACKEND_ENDPOINTS.OWNERS.PROFILE, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone }),
      });

      if (res.ok) {
        setStatusMessage({ type: 'success', text: 'Profile details updated successfully!' });
      } else {
        setStatusMessage({ type: 'error', text: 'Failed to update profile.' });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Network connection failed.' });
    } finally {
      setIsUpdating(false);
    }
  };

  // 2. Send OTP Handler
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPasswordSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await fetch(BACKEND_ENDPOINTS.OWNERS.FORGOT_PASSWORD, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail }),
      });

      if (res.ok) {
        setPasswordStep('verify');
        setStatusMessage({ type: 'success', text: 'Verification OTP sent to your registered email.' });
      } else {
        setStatusMessage({ type: 'error', text: 'Failed to send OTP.' });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Server error requesting OTP.' });
    } finally {
      setIsPasswordSubmitting(false);
    }
  };

  // 3. Reset Password Handler
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setStatusMessage({ type: 'error', text: 'Passwords do not match!' });
      return;
    }

    setIsPasswordSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await fetch(BACKEND_ENDPOINTS.OWNERS.RESET_PASSWORD, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, otp: otp.trim(), newPassword }),
      });

      const data = await res.json();

      if (res.ok && data?.success !== false) {
        setStatusMessage({ type: 'success', text: data?.message || 'Password reset successful!' });
        setPasswordStep('request');
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setStatusMessage({ type: 'error', text: data?.message || 'Invalid OTP or password update failed.' });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Server connection failed.' });
    } finally {
      setIsPasswordSubmitting(false);
    }
  };

  if (isSessionLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-2" />
        <p className="text-xs font-bold text-slate-500">Loading owner session...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 antialiased">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Account Settings</h1>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
          Manage your owner profile details and account security settings.
        </p>
      </div>

      {/* Notifications */}
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-3 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Navigation Tabs */}
        <nav className="md:col-span-4 lg:col-span-3 bg-white p-3 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
          {[
            { name: 'Profile Settings', icon: User },
            { name: 'Change Password', icon: KeyRound },
            { name: 'Verification', icon: ShieldCheck },
            { name: 'Account & Security', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.name;
            return (
              <button
                key={tab.name}
                onClick={() => {
                  setActiveTab(tab.name as TabType);
                  setStatusMessage(null);
                }}
                className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-black transition-all flex items-center gap-3 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Content Area */}
        <section className="md:col-span-8 lg:col-span-9 bg-white p-6 sm:p-10 rounded-3xl border border-slate-100 shadow-xs">
          
          {/* TAB 1: Profile Settings */}
          {activeTab === 'Profile Settings' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-black text-slate-900">Profile Details</h2>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">
                  Update your name and contact details.
                </p>
              </div>

              {/* Profile Details Form */}
              <form className="space-y-4 pt-2" onSubmit={handleProfileSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1.5">Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1.5">Phone Number</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      value={userEmail}
                      readOnly
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Save Details</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: Change Password */}
          {activeTab === 'Change Password' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-black text-slate-900">Change Password</h2>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">
                  Verification OTP code will be sent to <strong>{userEmail}</strong>
                </p>
              </div>

              {passwordStep === 'request' ? (
                <form onSubmit={handleSendOtp} className="space-y-4 pt-2">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-800">Email Verification OTP</p>
                        <p className="text-[11px] text-slate-400 font-medium">{userEmail}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isPasswordSubmitting}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    {isPasswordSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    <span>Send Verification Code</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1.5">6-Digit Verification Code</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="123456"
                      required
                      className="w-full sm:w-48 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center text-sm font-black tracking-widest text-slate-800 outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-slate-700 mb-1.5">New Password</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type={showPass ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          minLength={8}
                          className="w-full pl-10 pr-10 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass(!showPass)}
                          className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-700 mb-1.5">Confirm Password</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type={showPass ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          minLength={8}
                          className="w-full pl-10 pr-10 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={isPasswordSubmitting}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                    >
                      {isPasswordSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                      <span>Update Password</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPasswordStep('request')}
                      className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                    >
                      Resend OTP
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: Verification */}
          {activeTab === 'Verification' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-black text-slate-900">Owner Verification</h2>
                <p className="mt-1 text-xs font-semibold text-slate-400">
                  Complete verification whenever you are ready to unlock the verified owner badge.
                </p>
              </div>

              <div className="rounded-3xl border border-emerald-100 bg-emerald-50/70 p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100">
                    <ShieldCheck className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-black text-slate-900">Verification status</h3>
                      <span className="rounded-full bg-white px-2.5 py-1 text-[9px] font-black uppercase tracking-wide text-emerald-700">
                        {verificationStatus === 'PENDING'
                          ? 'Pending Verification'
                          : verificationStatus === 'VERIFIED'
                            ? 'Verified'
                            : verificationStatus === 'REJECTED'
                              ? 'Rejected'
                              : 'Not Verified'}
                      </span>
                    </div>
                    <p className="mt-2 text-xs font-semibold leading-5 text-slate-600">
                      {verificationStatus === 'PENDING'
                        ? 'Your documents are being reviewed by our team.'
                        : verificationStatus === 'REJECTED'
                          ? 'Your previous submission needs attention. Review the note and submit again.'
                          : verificationStatus === 'VERIFIED'
                            ? 'Your identity is verified and your owner profile can show the verified badge.'
                            : 'You can submit your identity documents now or come back to this page later.'}
                    </p>
                    {verificationStatus === 'REJECTED' && session?.profile?.verificationRejectionReason && (
                      <p className="mt-3 rounded-xl bg-white/80 p-3 text-xs font-semibold text-rose-700">
                        Review note: {session.profile.verificationRejectionReason}
                      </p>
                    )}
                  </div>
                </div>

                {isVerificationVerified ? (
                  <div className="mt-5 rounded-xl border border-emerald-200 bg-white px-4 py-3 text-xs font-black uppercase tracking-wide text-emerald-700">
                    Verified
                  </div>
                ) : isVerificationPending ? (
                  <button
                    type="button"
                    disabled
                    className="mt-5 cursor-not-allowed rounded-xl bg-emerald-200 px-5 py-2.5 text-xs font-black text-emerald-800 shadow-sm opacity-90"
                  >
                    Pending
                  </button>
                ) : canSubmitVerification ? (
                  <button
                    type="button"
                    onClick={() => setIsVerificationModalOpen(true)}
                    className="mt-5 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-black text-white shadow-md shadow-emerald-100 transition-all hover:bg-emerald-700"
                  >
                    {verificationStatus === 'REJECTED' ? 'Reverification' : 'Start Verification'}
                  </button>
                ) : null}
              </div>
            </div>
          )}

          {/* TAB 3: Account & Security */}
          {/* TAB 3: Account & Security */}
{activeTab === 'Account & Security' && (
  <div className="space-y-6">

    {/* Header */}
    <div>
      <h2 className="text-lg font-black text-slate-900">
        Account & Security
      </h2>

      <p className="mt-1 text-xs font-semibold text-slate-400">
        Manage your account protection and authentication status.
      </p>
    </div>

    {/* Security Status */}
    <div className="rounded-3xl border border-emerald-100 bg-emerald-50/70 p-5">

      <div className="flex items-start gap-4">

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100">
          <ShieldCheck className="h-6 w-6 text-emerald-600" />
        </div>

        <div className="min-w-0 flex-1">

          <div className="flex flex-wrap items-center gap-2">

            <h3 className="text-sm font-black text-slate-900">
              Your account is secure
            </h3>

            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[9px] font-black uppercase tracking-wide text-emerald-700">
              Protected
            </span>

          </div>

          <p className="mt-2 text-xs font-semibold leading-5 text-slate-600">
            Your authentication session is active and protected by
            server-side security controls.
          </p>

        </div>

      </div>

      {/* Account */}
      <div className="mt-5 rounded-2xl border border-white/80 bg-white/80 p-4">

        <div className="flex items-center justify-between gap-4">

          <div className="min-w-0">

            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Signed in account
            </p>

            <p className="mt-1 truncate text-sm font-bold text-slate-800">
              {userEmail}
            </p>

          </div>

          <div className="flex shrink-0 items-center gap-2">

            <span className="h-2 w-2 rounded-full bg-emerald-500" />

            <span className="text-[10px] font-black uppercase text-emerald-600">
              Active
            </span>

          </div>

        </div>

      </div>

    </div>

    {/* Security Controls */}
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">

      <div className="border-b border-slate-100 px-5 py-4">

        <h3 className="text-sm font-black text-slate-900">
          Security controls
        </h3>

        <p className="mt-1 text-xs font-semibold text-slate-400">
          Protections currently applied to your account.
        </p>

      </div>

      <div className="divide-y divide-slate-100">

        {/* Authentication */}
        <div className="flex items-center justify-between gap-4 px-5 py-4">

          <div className="min-w-0">

            <p className="text-xs font-black text-slate-800">
              Secure authentication
            </p>

            <p className="mt-1 text-[11px] font-semibold text-slate-400">
              Session protected by server HttpOnly cookies
            </p>

          </div>

          <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-black uppercase text-emerald-600">
            Enabled
          </span>

        </div>

        {/* Current Session */}
        <div className="flex items-center justify-between gap-4 px-5 py-4">

          <div className="min-w-0">

            <p className="text-xs font-black text-slate-800">
              Current session
            </p>

            <p className="mt-1 text-[11px] font-semibold text-slate-400">
              This device is currently authenticated
            </p>

          </div>

          <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-black uppercase text-emerald-600">
            Active
          </span>

        </div>

        {/* Password */}
        <div className="flex items-center justify-between gap-4 px-5 py-4">

          <div className="min-w-0">

            <p className="text-xs font-black text-slate-800">
              Account password
            </p>

            <p className="mt-1 text-[11px] font-semibold text-slate-400">
              Password is securely hashed before storage
            </p>

          </div>

          <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-black uppercase text-emerald-600">
            Protected
          </span>

        </div>

      </div>

    </div>

    {/* Security Notice */}
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 text-white">

      <div>

        <h3 className="text-xs font-black text-white">
          Keep your account protected
        </h3>

        <p className="mt-2 text-xs font-medium leading-5 text-slate-300">
          Never share your password or verification codes with anyone.
          StudentPG support will never ask for your password.
        </p>

      </div>

    </div>

  </div>
)}

        </section>
      </div>

      {isVerificationModalOpen && (
        <OwnerVerificationModal
          status={session?.profile?.verificationStatus ?? 'NOT_VERIFIED'}
          rejectionReason={session?.profile?.verificationRejectionReason}
          onClose={() => setIsVerificationModalOpen(false)}
        />
      )}
    </div>
  );
}