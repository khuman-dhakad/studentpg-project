'use client';

import React from 'react';
import Link from 'next/link';
import {
  Home,
  Building2,
  Users,
  GraduationCap,
  ShieldCheck,
  BarChart3,
  MessageSquare,
  UserCheck,
  Settings,
  Crown,
  X,
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export type AdminActiveView =
  | 'dashboard'
  | 'pg-listings'
  | 'owners'
  | 'students'
  | 'approvals'
  | 'reports'
  | 'enquiries'
  | 'users'
  | 'settings';

interface AdminSidebarProps {
  activeView: AdminActiveView;
  onViewChange: (view: AdminActiveView) => void;
  pendingApprovalsCount?: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export function AdminSidebar({
  activeView,
  onViewChange,
  pendingApprovalsCount = 12,
  isOpenMobile = false,
  onCloseMobile,
}: AdminSidebarProps) {
  const navItems = [
    { id: 'dashboard' as AdminActiveView, label: 'Dashboard', icon: Home, badge: null },
    { id: 'pg-listings' as AdminActiveView, label: 'PG Listings', icon: Building2, badge: null },
    { id: 'owners' as AdminActiveView, label: 'Owners', icon: Users, badge: null },
    { id: 'students' as AdminActiveView, label: 'Students', icon: GraduationCap, badge: null },
    {
      id: 'approvals' as AdminActiveView,
      label: 'Approvals',
      icon: ShieldCheck,
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : null,
      badgeColor: 'bg-rose-500 text-white',
    },
    { id: 'reports' as AdminActiveView, label: 'Reports', icon: BarChart3, badge: null },
    { id: 'enquiries' as AdminActiveView, label: 'Enquiries', icon: MessageSquare, badge: null },
    { id: 'users' as AdminActiveView, label: 'Users', icon: UserCheck, badge: null },
    { id: 'settings' as AdminActiveView, label: 'Settings', icon: Settings, badge: null },
  ];

  return (
    <>
      {/* MOBILE BACKDROP */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* SIDEBAR ASIDE */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col justify-between border-r border-slate-200/80 bg-white px-4 py-5 transition-transform duration-200 lg:static lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-6">
          {/* BRAND HEADER */}
          <div className="flex items-center justify-between px-2">
            <Link
              href={ROUTES.ADMIN.DASHBOARD}
              className="flex items-center gap-3 transition-opacity hover:opacity-90"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-xs">
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight text-slate-900 leading-tight">
                  Student<span className="text-emerald-700">PG</span>
                </span>
                <span className="text-[11px] font-medium text-slate-400 leading-tight">
                  Find Your Next Home
                </span>
              </div>
            </Link>

            {/* Mobile close button */}
            {onCloseMobile && (
              <button
                type="button"
                onClick={onCloseMobile}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:hidden"
                aria-label="Close sidebar"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* NAVIGATION LIST */}
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = activeView === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onViewChange(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-bold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-4.5 w-4.5 transition-colors ${
                        isActive
                          ? 'text-emerald-700'
                          : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== null && item.badge !== undefined && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-black leading-none ${
                        item.badgeColor || 'bg-rose-500 text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* BOTTOM ADMIN PANEL CARD */}
        <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/70 via-emerald-50/40 to-amber-50/30 p-3.5">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-700 shadow-xs shrink-0">
              <Crown className="h-4.5 w-4.5 fill-amber-500 text-amber-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-900">Admin Panel</span>
              <span className="text-[11px] font-medium text-slate-500 leading-relaxed">
                Manage platform content and users
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
