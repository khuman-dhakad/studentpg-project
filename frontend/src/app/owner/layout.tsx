'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { LayoutDashboard, PlusCircle, User, Settings, HelpCircle, LogOut,  Menu, X } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useSessionQuery, useLogoutMutation } from '@/features/auth/api/authApi';
import { baseApi } from '@/api/baseApi';
import NotificationBell from '@/components/notifications/NotificationBell';
import { OwnerVerificationBadge } from '@/components/owner/OwnerVerificationBadge';

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // RTK Query Hooks
  const { data: session, isLoading } = useSessionQuery();
  const [logout] = useLogoutMutation();

  useEffect(() => {
    if (!isLoading && !session?.isAuthenticated) {
      router.replace(ROUTES.OWNER.LOGIN);
    }
  }, [isLoading, router, session?.isAuthenticated]);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(baseApi.util.resetApiState());
      router.replace(ROUTES.OWNER.LOGIN);
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
      dispatch(baseApi.util.resetApiState());
      router.replace(ROUTES.OWNER.LOGIN);
      router.refresh();
    }
  };

  const menuItems = [
    { label: 'Dashboard', href: ROUTES.OWNER.DASHBOARD || '/owner/dashboard', icon: LayoutDashboard },
    { label: 'Add New PG', href: ROUTES.OWNER.ADD_PG || '/owner/add-pg', icon: PlusCircle },
    { label: 'Profile', href: ROUTES.OWNER.PROFILE || '/owner/profile', icon: User },
    { label: 'Settings', href: '/owner/settings', icon: Settings },
    { label: 'Help & Support', href: '/contact', icon: HelpCircle },
  ];

  const user = session?.user;
  const profile = session?.profile;
  const userName = profile?.name || user?.email || 'Owner';
  const userInitials = userName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex antialiased">
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      <aside className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-100 p-6 flex flex-col justify-between z-50 transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 shrink-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <Link href={ROUTES.OWNER.DASHBOARD || '/owner/dashboard'} className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-indigo-600/20">↑</div>
              <span className="font-black text-xl tracking-tight text-slate-900">Student<span className="text-indigo-600">PG</span></span>
            </Link>
            <button className="lg:hidden p-1 text-slate-400" onClick={() => setIsMobileMenuOpen(false)}><X className="w-5 h-5" /></button>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black tracking-wide uppercase transition-all ${isActive ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>
                  <Icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black tracking-wide uppercase text-rose-500 hover:bg-rose-50 transition-all w-full text-left">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-100 h-16 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-40">
          <button className="p-2 -ml-2 text-slate-500 lg:hidden" onClick={() => setIsMobileMenuOpen(true)}><Menu className="w-5 h-5" /></button>
          
          <div className="flex items-center gap-4 ml-auto">
            <NotificationBell />
            <Link href={ROUTES.OWNER.PROFILE || '/owner/profile'} className="flex items-center gap-2.5 pl-2 border-l border-slate-100">
              <div className="w-8 h-8 rounded-full font-black flex items-center justify-center bg-gradient-to-tr from-indigo-500 to-purple-500 text-white text-xs">
                {isLoading ? '..' : userInitials}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-black text-slate-900 leading-none">{isLoading ? 'Loading...' : userName}</div>
                <div className="mt-0.5 flex items-center gap-2 text-[10px] font-semibold text-slate-400"><span>Owner</span>{session?.profile?.verificationStatus === 'VERIFIED' ? <OwnerVerificationBadge compact /> : session?.profile?.verificationStatus === 'PENDING' ? <span className="text-amber-600">Pending Verification</span> : session?.profile?.verificationStatus === 'REJECTED' ? <span className="text-rose-600">Rejected</span> : <span>Not Verified</span>}</div>
              </div>
            </Link>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}