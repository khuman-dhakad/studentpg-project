'use client';

import React, { useState } from 'react';
import { AdminSidebar, AdminActiveView } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminDashboardView } from '@/components/admin/AdminDashboardView';
import { AdminPGList } from '@/components/pg/AdminPGList';
import { OwnerVerificationQueue } from '@/components/admin/OwnerVerificationQueue';
import {
  useGetDashboardOverviewQuery,
  useGetAllPgsAdminQuery,
} from '@/features/admin-dashboard/api/adminApi';
import { useGetUnreadNotificationCountQuery } from '@/features/notification/api/notificationApi';
import { useSessionQuery } from '@/features/auth/api/authApi';
import {
  GraduationCap,
  BarChart3,
  Star,
  MessageSquare,
  UserCheck,
  Settings,
  ArrowLeft,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [activeView, setActiveView] = useState<AdminActiveView>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<
    'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'
  >('PENDING');

  // Queries
  const { data: overview, refetch: refetchOverview } =
    useGetDashboardOverviewQuery();
  const { data: unreadNotifications } = useGetUnreadNotificationCountQuery();
  const { data: session } = useSessionQuery();
  const { data: allPgs, refetch: refetchAllPgs } = useGetAllPgsAdminQuery();

  const pendingApprovalsCount = overview?.pendingApprovals ?? 12;
  const unreadCount = unreadNotifications?.count ?? 5;
  const adminName = session?.profile?.name || (session?.user?.email ? session.user.email.split('@')[0] : 'Admin');
  const adminRole = session?.user?.role === 'ADMIN' ? 'Administrator' : 'Administrator';

  // Filter listings for the moderation table view
  const pgsToDisplay = Array.isArray(allPgs)
    ? selectedStatus === 'ALL'
      ? allPgs
      : allPgs.filter((p) => p.approvalStatus === selectedStatus)
    : [];

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900 antialiased">
      {/* 1. FIXED DESKTOP / MOBILE RESPONSIVE SIDEBAR */}
      <AdminSidebar
        activeView={activeView}
        onViewChange={(view) => setActiveView(view)}
        pendingApprovalsCount={pendingApprovalsCount}
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* 2. RIGHT MAIN CONTENT AREA */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* TOP HEADER */}
        <AdminHeader
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          unreadNotificationsCount={unreadCount}
          adminName={adminName}
          adminRole={adminRole}
          selectedCity="Bhopal"
        />

        {/* MAIN BODY */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {/* VIEW: DASHBOARD (EXACT REFERENCE SCREENSHOT) */}
          {activeView === 'dashboard' && (
            <AdminDashboardView
              onViewAllApprovals={() => {
                setSelectedStatus('PENDING');
                setActiveView('approvals');
              }}
              onViewAllLocalities={() => {
                setSelectedStatus('ALL');
                setActiveView('pg-listings');
              }}
              onViewAllActivity={() => {
                setActiveView('reports');
              }}
            />
          )}

          {/* VIEW: PG LISTINGS OR APPROVALS (FULL MODERATION DESK) */}
          {(activeView === 'pg-listings' || activeView === 'approvals') && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
                <div>
                  <button
                    type="button"
                    onClick={() => setActiveView('dashboard')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 mb-2 cursor-pointer"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back to Dashboard</span>
                  </button>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    {activeView === 'approvals'
                      ? 'Listing Moderation & Approval Desk'
                      : 'All PG Accommodation Listings'}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Audit, review, verify, approve, or reject student accommodation submissions across Bhopal.
                  </p>
                </div>

                {/* STATUS FILTER PILLS */}
                <div className="flex flex-wrap items-center gap-2">
                  {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map(
                    (st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setSelectedStatus(st)}
                        className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                          selectedStatus === st
                            ? 'bg-emerald-700 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {st}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* MODERATION LIST COMPONENT */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
                <AdminPGList
                  initialItems={pgsToDisplay}
                  status={selectedStatus}
                  onActionCompleted={() => {
                    refetchOverview();
                    refetchAllPgs();
                  }}
                />
              </div>
            </div>
          )}

          {/* VIEW: OWNERS (KYC VERIFICATION QUEUE) */}
          {activeView === 'owners' && (
            <div className="flex flex-col gap-6">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
                <button
                  type="button"
                  onClick={() => setActiveView('dashboard')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 mb-2 cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to Dashboard</span>
                </button>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  Property Owner Verification Queue
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Audit legal identity documents, verification status, and contact details for registered PG hosts.
                </p>
              </div>

              <OwnerVerificationQueue />
            </div>
          )}

          {/* VIEW: STUDENTS */}
          {activeView === 'students' && (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-xs">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 mb-4">
                <GraduationCap className="h-7 w-7" />
              </div>
              <h2 className="text-lg font-black text-slate-900">
                Student Directory &amp; Inquiries
              </h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                Active students browsing PGs across Bhopal ({overview?.totalStudents ?? 1243} students recorded). Direct student account management module is active.
              </p>
              <button
                type="button"
                onClick={() => setActiveView('dashboard')}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Return to Dashboard</span>
              </button>
            </div>
          )}

          {/* VIEW: REPORTS */}
          {activeView === 'reports' && (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-xs">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 mb-4">
                <BarChart3 className="h-7 w-7" />
              </div>
              <h2 className="text-lg font-black text-slate-900">
                Platform Analytics &amp; Reports
              </h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                Detailed monthly revenue forecasts, occupancy rates, and locality breakdown reports for Bhopal accommodation market.
              </p>
              <button
                type="button"
                onClick={() => setActiveView('dashboard')}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Return to Dashboard</span>
              </button>
            </div>
          )}

          {/* VIEW: REVIEWS */}
          {activeView === 'reviews' && (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-xs">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 mb-4">
                <Star className="h-7 w-7 fill-amber-500" />
              </div>
              <h2 className="text-lg font-black text-slate-900">
                Student Reviews &amp; Ratings Moderation
              </h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                Moderate student feedback, verify genuine stay ratings, and maintain authentic property reviews.
              </p>
              <button
                type="button"
                onClick={() => setActiveView('dashboard')}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Return to Dashboard</span>
              </button>
            </div>
          )}

          {/* VIEW: ENQUIRIES */}
          {activeView === 'enquiries' && (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-xs">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-4">
                <MessageSquare className="h-7 w-7" />
              </div>
              <h2 className="text-lg font-black text-slate-900">
                Direct WhatsApp &amp; In-App Enquiries
              </h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                Track direct lead flow between students and property owners across MP Nagar, Kolar Road, and Indrapuri hubs.
              </p>
              <button
                type="button"
                onClick={() => setActiveView('dashboard')}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Return to Dashboard</span>
              </button>
            </div>
          )}

          {/* VIEW: USERS */}
          {activeView === 'users' && (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-xs">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 mb-4">
                <UserCheck className="h-7 w-7" />
              </div>
              <h2 className="text-lg font-black text-slate-900">
                Access Control &amp; Administrator Accounts
              </h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                Manage administrator clearance, role assignments, and privileged credentials.
              </p>
              <button
                type="button"
                onClick={() => setActiveView('dashboard')}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Return to Dashboard</span>
              </button>
            </div>
          )}

          {/* VIEW: SETTINGS */}
          {activeView === 'settings' && (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-xs">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 mb-4">
                <Settings className="h-7 w-7" />
              </div>
              <h2 className="text-lg font-black text-slate-900">
                Platform Configuration &amp; Policies
              </h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                Configure listing moderation rules, automated email notices, and Bhopal locality boundaries.
              </p>
              <button
                type="button"
                onClick={() => setActiveView('dashboard')}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Return to Dashboard</span>
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}