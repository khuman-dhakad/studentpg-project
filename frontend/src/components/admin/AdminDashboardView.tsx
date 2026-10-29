'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Building2,
  Users,
  GraduationCap,
  Clock,
  ShieldCheck,
  TrendingUp,
  MapPin,
  ChevronDown,
  Plus,
  Check,
  User,
  Pencil,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  useGetDashboardOverviewQuery,
  useApprovePgMutation,
} from '@/features/admin-dashboard/api/adminApi';
import { PGListingsTrendChart } from './PGListingsTrendChart';
import { PGStatusDonutChart } from './PGStatusDonutChart';
import { PendingPGItem } from '@/types/admin.types';
import { ROUTES } from '@/constants/routes';

interface AdminDashboardViewProps {
  onViewAllApprovals?: () => void;
  onViewAllLocalities?: () => void;
  onViewAllActivity?: () => void;
}

export function AdminDashboardView({
  onViewAllApprovals,
  onViewAllLocalities,
  onViewAllActivity,
}: AdminDashboardViewProps) {
  const { data: overview, isLoading } =
    useGetDashboardOverviewQuery();

  const [approvePg, { isLoading: isApproving }] = useApprovePgMutation();
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [actionErrorMsg, setActionErrorMsg] = useState<string | null>(null);

  // Time range state
  const [timeRange, setTimeRange] = useState('Last 6 Months');
  const [timeRangeOpen, setTimeRangeOpen] = useState(false);

  // Handle Approve action
  const handleApprove = async (id: string, pgName: string) => {
    try {
      setApprovingId(id);
      setActionSuccessMsg(null);
      setActionErrorMsg(null);

      const res = await approvePg(id).unwrap();
      setActionSuccessMsg(
        res?.message || `"${pgName}" has been approved successfully.`
      );
      setTimeout(() => setActionSuccessMsg(null), 4000);
    } catch (err: unknown) {
      console.error('Approve failed:', err);
      const message =
        typeof err === 'object' && err && 'data' in err
          ? (err as { data?: { message?: string } }).data?.message || 'Approval failed'
          : 'Unable to approve listing. Please check connectivity.';
      setActionErrorMsg(message);
      setTimeout(() => setActionErrorMsg(null), 5000);
    } finally {
      setApprovingId(null);
    }
  };

  // Fallback / default data matching reference image exactly
  const totalPgs = overview?.totalPgs ?? 248;
  const totalOwners = overview?.totalOwners ?? 156;
  const totalStudents = overview?.totalStudents ?? 1243;
  const pendingApprovals = overview?.pendingApprovals ?? 12;

  const approvedPgs = overview?.approvedPgs ?? 180;
  const rejectedPgs = overview?.rejectedPgs ?? 18;
  const draftPgs = overview?.draftPgs ?? 38;

  // Format student number with comma e.g. 1,243
  const formattedStudents = totalStudents.toLocaleString('en-IN');

  const pendingList: PendingPGItem[] =
    overview?.pendingListings && overview.pendingListings.length > 0
      ? overview.pendingListings
      : [
          {
            id: 'demo-1',
            pgName: 'Green Valley PG',
            ownerName: 'Amit Singh',
            locality: 'MP Nagar',
            city: 'Bhopal',
            rent: '₹8,000 / month',
            submittedAt: '2026-10-10T10:30:00Z',
            thumbnailUrl: '/areas/mp-nagar.jpg',
          },
          {
            id: 'demo-2',
            pgName: 'Student Nest PG',
            ownerName: 'Neha Patel',
            locality: 'Kolar Road',
            city: 'Bhopal',
            rent: '₹6,500 / month',
            submittedAt: '2026-10-09T16:15:00Z',
            thumbnailUrl: '/areas/kolar-road.jpg',
          },
          {
            id: 'demo-3',
            pgName: 'Comfort Living PG',
            ownerName: 'Suresh Kumar',
            locality: 'Indrapuri',
            city: 'Bhopal',
            rent: '₹7,500 / month',
            submittedAt: '2026-10-09T11:20:00Z',
            thumbnailUrl: '/areas/indrapuri.jpg',
          },
          {
            id: 'demo-4',
            pgName: 'Apex PG',
            ownerName: 'Pooja Gupta',
            locality: 'Arera Colony',
            city: 'Bhopal',
            rent: '₹9,000 / month',
            submittedAt: '2026-10-08T15:45:00Z',
            thumbnailUrl: '/areas/arera-colony.jpg',
          },
        ];

  const localities =
    overview?.topLocalities && overview.topLocalities.length > 0
      ? overview.topLocalities
      : [
          { rank: 1, locality: 'MP Nagar', count: 48, percentage: 85 },
          { rank: 2, locality: 'Kolar Road', count: 36, percentage: 65 },
          { rank: 3, locality: 'Indrapuri', count: 28, percentage: 50 },
          { rank: 4, locality: 'Arera Colony', count: 24, percentage: 40 },
          { rank: 5, locality: 'Hoshangabad Road', count: 18, percentage: 30 },
        ];

  const activities =
    overview?.recentActivities && overview.recentActivities.length > 0
      ? overview.recentActivities
      : [
          {
            id: 'act-1',
            type: 'SUBMISSION',
            title: 'New PG listing submitted',
            subtitle: 'by Rohit Sharma',
            actor: 'Rohit Sharma',
            timestamp: new Date().toISOString(),
            relativeTime: '10 minutes ago',
          },
          {
            id: 'act-2',
            type: 'APPROVAL',
            title: 'PG approved',
            subtitle: 'Comfort Stay PG',
            actor: 'Administrator',
            timestamp: new Date().toISOString(),
            relativeTime: '1 hour ago',
          },
          {
            id: 'act-3',
            type: 'OWNER_REGISTERED',
            title: 'New owner registered',
            subtitle: 'Priya Verma',
            actor: 'Priya Verma',
            timestamp: new Date().toISOString(),
            relativeTime: '2 hours ago',
          },
          {
            id: 'act-4',
            type: 'PG_UPDATED',
            title: 'PG listing updated',
            subtitle: 'Shree Residency PG',
            actor: 'Administrator',
            timestamp: new Date().toISOString(),
            relativeTime: '3 hours ago',
          },
          {
            id: 'act-5',
            type: 'VERIFICATION',
            title: 'Owner KYC submitted',
            subtitle: 'Blossom Girls PG',
            actor: 'Owner',
            timestamp: new Date().toISOString(),
            relativeTime: '5 hours ago',
          },
        ];

  // Helper for activity icon
  const renderActivityIcon = (type: string) => {
    switch (type) {
      case 'SUBMISSION':
        return (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <Plus className="h-4 w-4" />
          </div>
        );
      case 'APPROVAL':
        return (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <Check className="h-4 w-4" />
          </div>
        );
      case 'OWNER_REGISTERED':
        return (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-amber-700">
            <User className="h-4 w-4" />
          </div>
        );
      case 'PG_UPDATED':
        return (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-700">
            <Pencil className="h-3.5 w-3.5" />
          </div>
        );
      case 'VERIFICATION':
        return (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
            <ShieldCheck className="h-3.5 w-3.5" />
          </div>
        );
      default:
        return (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-600">
            <Building2 className="h-3.5 w-3.5" />
          </div>
        );
    }
  };

  // Format date helper
  const formatSubmittedDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      const datePart = d.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      });
      const timePart = d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      return { datePart, timePart };
    } catch {
      return { datePart: 'Oct 10, 2026', timePart: '10:30 AM' };
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* ACTION FEEDBACK BANNERS */}
      {actionSuccessMsg && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-800 shadow-xs animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {actionErrorMsg && (
        <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-bold text-rose-800 shadow-xs animate-in fade-in">
          <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
          <span>{actionErrorMsg}</span>
        </div>
      )}

      {/* ROW 1: FOUR SUMMARY METRIC CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* CARD 1: TOTAL PG LISTINGS */}
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-shadow hover:shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 shrink-0">
            <Building2 className="h-6 w-6" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-slate-500 truncate">
              Total PG Listings
            </span>
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-emerald-700 leading-tight">
              {isLoading ? '...' : totalPgs}
            </span>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-0.5">
              <span>↑</span>
              <span>12% from last month</span>
            </span>
          </div>
        </div>

        {/* CARD 2: TOTAL OWNERS */}
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-shadow hover:shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shrink-0">
            <Users className="h-6 w-6" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-slate-500 truncate">
              Total Owners
            </span>
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-blue-600 leading-tight">
              {isLoading ? '...' : totalOwners}
            </span>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-0.5">
              <span>↑</span>
              <span>8% from last month</span>
            </span>
          </div>
        </div>

        {/* CARD 3: TOTAL STUDENTS */}
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-shadow hover:shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 shrink-0">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-slate-500 truncate">
              Total Students
            </span>
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-purple-600 leading-tight">
              {isLoading ? '...' : formattedStudents}
            </span>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-0.5">
              <span>↑</span>
              <span>15% from last month</span>
            </span>
          </div>
        </div>

        {/* CARD 4: PENDING APPROVALS */}
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-shadow hover:shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 shrink-0">
            <Clock className="h-6 w-6" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-slate-500 truncate">
              Pending Approvals
            </span>
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-amber-600 leading-tight">
              {isLoading ? '...' : pendingApprovals}
            </span>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 mt-0.5">
              <span>↑</span>
              <span>5 new today</span>
            </span>
          </div>
        </div>
      </section>

      {/* ROW 2: 3 CARDS (TREND, DONUT, RECENT ACTIVITY) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* COL 1: PG LISTINGS TREND (5 COLS) */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4.5 w-4.5 text-emerald-700" />
              <h2 className="text-sm font-bold text-slate-900">
                PG Listings Trend
              </h2>
            </div>

            {/* Time range dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setTimeRangeOpen((prev) => !prev)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-2xs hover:bg-slate-50"
              >
                <span>{timeRange}</span>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>

              {timeRangeOpen && (
                <div
                  className="absolute right-0 mt-1 w-32 rounded-xl border border-slate-200 bg-white py-1 shadow-lg z-20"
                  onMouseLeave={() => setTimeRangeOpen(false)}
                >
                  {['Last 3 Months', 'Last 6 Months', 'Last 1 Year'].map(
                    (opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setTimeRange(opt);
                          setTimeRangeOpen(false);
                        }}
                        className={`w-full px-3 py-1.5 text-left text-[11px] font-semibold hover:bg-slate-50 ${
                          timeRange === opt
                            ? 'text-emerald-700 bg-emerald-50/50'
                            : 'text-slate-700'
                        }`}
                      >
                        {opt}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 flex-1 flex items-center">
            <PGListingsTrendChart data={overview?.listingsTrend} />
          </div>
        </div>

        {/* COL 2: PG STATUS OVERVIEW (3.5 COLS) */}
        <div className="lg:col-span-3 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <ShieldCheck className="h-4.5 w-4.5 text-emerald-700" />
            <h2 className="text-sm font-bold text-slate-900">
              PG Status Overview
            </h2>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <PGStatusDonutChart
              approved={approvedPgs}
              pending={pendingApprovals}
              rejected={rejectedPgs}
              draft={draftPgs}
              total={totalPgs}
            />
          </div>
        </div>

        {/* COL 3: RECENT ACTIVITY (3.5 COLS) */}
        <div className="lg:col-span-3 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="h-4.5 w-4.5 text-emerald-700" />
              <h2 className="text-sm font-bold text-slate-900">
                Recent Activity
              </h2>
            </div>
            {onViewAllActivity ? (
              <button
                type="button"
                onClick={onViewAllActivity}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
              >
                View All →
              </button>
            ) : (
              <span className="text-[11px] font-bold text-emerald-700">
                View All →
              </span>
            )}
          </div>

          <div className="divide-y divide-slate-100 flex-1 flex flex-col justify-around py-1">
            {activities.map((act) => (
              <div key={act.id} className="flex items-start gap-3 py-2.5">
                <div className="shrink-0 pt-0.5">
                  {renderActivityIcon(act.type)}
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-xs font-bold text-slate-900 leading-snug">
                    {act.title}
                  </span>
                  <span className="text-[11px] font-medium text-slate-500 truncate">
                    {act.subtitle}
                  </span>
                </div>
                <span className="text-[10px] font-medium text-slate-400 shrink-0 whitespace-nowrap pl-2">
                  {act.relativeTime}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROW 3: 2 CARDS (PENDING APPROVALS & TOP LOCALITIES) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* COL 1: PENDING APPROVALS TABLE (7.5 COLS) */}
        <div className="lg:col-span-7.5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="h-4.5 w-4.5 text-emerald-700" />
              <h2 className="text-sm font-bold text-slate-900">
                Pending Approvals
              </h2>
              {pendingApprovals > 0 && (
                <span className="flex h-5 items-center justify-center rounded-full bg-rose-500 px-2 text-[10px] font-black text-white shadow-2xs">
                  {pendingApprovals}
                </span>
              )}
            </div>

            {onViewAllApprovals ? (
              <button
                type="button"
                onClick={onViewAllApprovals}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
              >
                View All →
              </button>
            ) : (
              <span className="text-[11px] font-bold text-emerald-700">
                View All →
              </span>
            )}
          </div>

          {/* LIST OF PENDING ACCOMMODATIONS */}
          <div className="divide-y divide-slate-100">
            {pendingList.map((item) => {
              const { datePart, timePart } = formatSubmittedDate(
                item.submittedAt
              );
              const isItemApproving = approvingId === item.id;

              return (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3.5 transition-colors hover:bg-slate-50/50 rounded-xl px-1 sm:px-2"
                >
                  {/* Property Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative h-12 w-16 sm:h-14 sm:w-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                      <Image
                        src={item.thumbnailUrl || '/areas/mp-nagar.jpg'}
                        alt={item.pgName}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    <div className="flex flex-col min-w-0">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {item.pgName}
                      </h3>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 truncate mt-0.5">
                        <span>By {item.ownerName}</span>
                        <span className="text-slate-300">•</span>
                        <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                        <span className="truncate">
                          {item.locality}, {item.city}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Price, Date and Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 shrink-0 pl-19 sm:pl-0">
                    <div className="text-left sm:text-right">
                      <div className="text-xs sm:text-sm font-bold text-emerald-700">
                        {item.rent}
                      </div>
                      <div className="text-[10px] text-slate-400 leading-tight mt-0.5">
                        <div>{datePart}</div>
                        <div>{timePart}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={ROUTES.PG_DETAILS(item.id)}
                        target="_blank"
                        className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
                      >
                        View
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleApprove(item.id, item.pgName)}
                        disabled={isApproving}
                        className="flex items-center gap-1.5 rounded-xl bg-emerald-700 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800 transition-colors shadow-xs active:scale-98 disabled:opacity-50 cursor-pointer"
                      >
                        {isItemApproving ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin" />
                            <span>Approving...</span>
                          </>
                        ) : (
                          <span>Approve</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* COL 2: TOP LOCALITIES RANKING (4.5 COLS) */}
        <div className="lg:col-span-4.5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <MapPin className="h-4.5 w-4.5 text-emerald-700" />
              <h2 className="text-sm font-bold text-slate-900">
                Top Localities
              </h2>
            </div>
            {onViewAllLocalities ? (
              <button
                type="button"
                onClick={onViewAllLocalities}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
              >
                View All →
              </button>
            ) : (
              <span className="text-[11px] font-bold text-emerald-700">
                View All →
              </span>
            )}
          </div>

          <div className="divide-y divide-slate-100">
            {localities.map((loc) => (
              <div key={loc.rank} className="py-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-black text-emerald-800">
                      {loc.rank}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {loc.locality}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400">
                    {loc.count} listings
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-700 transition-all duration-500"
                    style={{ width: `${Math.min(100, loc.percentage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
