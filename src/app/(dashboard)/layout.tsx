'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { useProjectStore } from '@/store/useProjectStore';
import { UserRole } from '@/types';
import {
  LayoutDashboard,
  LogOut,
  Bell,
  Camera,
  FileCheck,
  ListChecks,
  MessageSquare,
  HardHat,
  Construction,
  ShieldCheck,
  Users,
  RotateCcw,
  Building2,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import ThemeToggle from '@/components/theme/ThemeToggle';

const ROLE_CONFIGS: Record<UserRole, {
  departmentTitle: string;
  departmentBadge: string;
  baseRoute: string;
  icon: any;
  colorClass: string;
}> = {
  SITE_ENGINEER: {
    departmentTitle: 'Site Engineering Department',
    departmentBadge: 'Field Ops & Vision Verification',
    baseRoute: '/engineer',
    icon: HardHat,
    colorClass: 'bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300',
  },
  CONTRACTOR: {
    departmentTitle: 'Contractor Work Execution',
    departmentBadge: 'WBS & Float Recovery Ops',
    baseRoute: '/contractor',
    icon: Construction,
    colorClass: 'bg-orange-50 border-orange-200 text-orange-900 dark:bg-orange-950/40 dark:border-orange-800 dark:text-orange-300',
  },
  GOV_OFFICIAL: {
    departmentTitle: 'Governance & Risk Directorate',
    departmentBadge: 'Smart Cities Oversight & Audit',
    baseRoute: '/official',
    icon: ShieldCheck,
    colorClass: 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-300',
  },
  CITIZEN: {
    departmentTitle: 'Public Citizen Portal',
    departmentBadge: 'Infrastructure Transparency & Grievances',
    baseRoute: '/public',
    icon: Users,
    colorClass: 'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300',
  },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { notifications, markAsRead, clearAll } = useNotificationStore();
  const { resetDemoData } = useProjectStore();
  const [resetSuccess, setResetSuccess] = useState(false);

  // Enforce strict department route isolation
  useEffect(() => {
    if (!user) return;

    const currentRoleConfig = ROLE_CONFIGS[user.role];
    if (currentRoleConfig && !pathname.startsWith(currentRoleConfig.baseRoute)) {
      // Redirect immediately to assigned department base route if on unassigned route
      router.replace(currentRoleConfig.baseRoute);
    }
  }, [user, pathname, router]);

  if (!user) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-zinc-950 p-6 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-[#0b457b] text-white flex items-center justify-center font-bold text-xl shadow-md">
          P
        </div>
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Authentication Required</h2>
          <p className="text-xs text-slate-500">Please sign in to access your assigned department workspace.</p>
        </div>
        <Button onClick={() => router.push('/login')} className="bg-[#0b457b] hover:bg-[#07325b] text-white font-bold px-6 rounded-xl">
          Go to Sign In
        </Button>
      </div>
    );
  }

  const roleConfig = ROLE_CONFIGS[user.role];
  const DepartmentIcon = roleConfig.icon;
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleResetDemo = () => {
    resetDemoData();
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 2500);
  };

  const handleSignOut = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50">
      {/* Sidebar - Strictly scoped to user's assigned department */}
      <aside className="w-64 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 flex flex-col shrink-0">
        
        {/* Brand & Department Badge Header */}
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0b457b] flex items-center justify-center text-white font-black text-sm shadow-sm">
              P
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-50">ProjectPulse AI</h2>
              <p className="text-[10px] text-zinc-400 font-medium">Bhopal CBD Zone A</p>
            </div>
          </div>

          {/* Assigned Department Chip */}
          <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${roleConfig.colorClass}`}>
            <DepartmentIcon className="w-4 h-4 shrink-0" />
            <div className="overflow-hidden">
              <p className="text-xs font-bold leading-tight truncate">{roleConfig.departmentTitle}</p>
              <p className="text-[10px] opacity-80 leading-tight truncate">{roleConfig.departmentBadge}</p>
            </div>
          </div>
        </div>

        {/* Sidebar Navigation Options for Assigned Department ONLY */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          
          <div className="px-2 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
            <Lock className="w-3 h-3 text-zinc-400" />
            <span>Assigned Workspace</span>
          </div>

          <Button
            variant={pathname === roleConfig.baseRoute ? 'secondary' : 'ghost'}
            className="w-full justify-start gap-3 text-xs font-bold"
            onClick={() => router.push(roleConfig.baseRoute)}
          >
            <LayoutDashboard className="w-4 h-4 text-[#0b457b]" />
            Department Dashboard
          </Button>

          {/* SITE ENGINEER EXCLUSIVE NAV */}
          {user.role === 'SITE_ENGINEER' && (
            <>
              <Button
                variant={pathname === '/engineer' ? 'secondary' : 'ghost'}
                className="w-full justify-start gap-3 text-xs font-semibold"
                onClick={() => router.push('/engineer')}
              >
                <HardHat className="w-4 h-4 text-amber-500" />
                Active Field Tasks
              </Button>
              <Button
                variant={pathname.startsWith('/engineer/capture') ? 'secondary' : 'ghost'}
                className="w-full justify-start gap-3 text-xs font-semibold"
                onClick={() => router.push('/engineer/capture')}
              >
                <Camera className="w-4 h-4 text-emerald-500" />
                Capture Photo Evidence
              </Button>
            </>
          )}

          {/* CONTRACTOR EXCLUSIVE NAV */}
          {user.role === 'CONTRACTOR' && (
            <>
              <Button
                variant={pathname === '/contractor' ? 'secondary' : 'ghost'}
                className="w-full justify-start gap-3 text-xs font-semibold"
                onClick={() => router.push('/contractor')}
              >
                <Construction className="w-4 h-4 text-orange-500" />
                WBS & Activity List
              </Button>
              <Button
                variant={pathname.startsWith('/contractor/activity') ? 'secondary' : 'ghost'}
                className="w-full justify-start gap-3 text-xs font-semibold"
                onClick={() => router.push('/contractor/activity/act-3')}
              >
                <FileCheck className="w-4 h-4 text-blue-500" />
                Recovery Commitments
              </Button>
            </>
          )}

          {/* GOV OFFICIAL EXCLUSIVE NAV */}
          {user.role === 'GOV_OFFICIAL' && (
            <>
              <Button
                variant={pathname === '/official/approvals' ? 'secondary' : 'ghost'}
                className="w-full justify-start gap-3 text-xs font-semibold"
                onClick={() => router.push('/official/approvals')}
              >
                <ShieldCheck className="w-4 h-4 text-purple-500" />
                Site Approvals
              </Button>
              <Button
                variant={pathname === '/official/audit' ? 'secondary' : 'ghost'}
                className="w-full justify-start gap-3 text-xs font-semibold"
                onClick={() => router.push('/official/audit')}
              >
                <ListChecks className="w-4 h-4 text-emerald-500" />
                System Audit Trail
              </Button>
              <Button
                variant={pathname === '/official/grievances' ? 'secondary' : 'ghost'}
                className="w-full justify-start gap-3 text-xs font-semibold"
                onClick={() => router.push('/official/grievances')}
              >
                <MessageSquare className="w-4 h-4 text-rose-500" />
                Citizen Grievances
              </Button>
            </>
          )}

          {/* CITIZEN EXCLUSIVE NAV */}
          {user.role === 'CITIZEN' && (
            <>
              <Button
                variant={pathname === '/public' ? 'secondary' : 'ghost'}
                className="w-full justify-start gap-3 text-xs font-semibold"
                onClick={() => router.push('/public')}
              >
                <Users className="w-4 h-4 text-blue-500" />
                Public Transparency Portal
              </Button>
              <Button
                variant={pathname === '/public/grievance' ? 'secondary' : 'ghost'}
                className="w-full justify-start gap-3 text-xs font-semibold"
                onClick={() => router.push('/public/grievance')}
              >
                <MessageSquare className="w-4 h-4 text-amber-500" />
                File Public Grievance
              </Button>
            </>
          )}
        </nav>

        {/* User Account Info & Sign Out Footer */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
          <div className="flex items-center gap-3 p-2.5 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200/80 dark:border-zinc-800">
            <div className="w-8 h-8 rounded-lg bg-[#0b457b] text-white flex items-center justify-center font-bold text-xs shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">{user.name}</p>
              <p className="text-[10px] text-zinc-400 truncate">{user.email}</p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full justify-center gap-2 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 dark:hover:bg-red-950/30"
            onClick={handleSignOut}
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out Account
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        
        {/* Top Header Bar */}
        <header className="h-16 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-6 shrink-0 gap-4">
          
          {/* Department Name Indicator (No multi-role switcher exposed!) */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0b457b] border border-blue-100 flex items-center justify-center shadow-2xs">
              <DepartmentIcon className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
                {roleConfig.departmentTitle}
              </h1>
              <p className="text-[10px] font-medium text-slate-400 leading-tight">
                Role Access Restricted &bull; {user.name} ({user.email})
              </p>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3 shrink-0">
            
            {/* Dark Mode Toggle */}
            <ThemeToggle />

            {/* Reset Demo Data Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetDemo}
              className={`gap-1.5 text-xs h-8 font-semibold ${resetSuccess ? 'border-green-500 text-green-600 bg-green-50' : 'text-slate-700'}`}
            >
              <RotateCcw className={`w-3.5 h-3.5 ${resetSuccess ? 'animate-spin text-green-600' : ''}`} />
              {resetSuccess ? 'Data Reset!' : 'Reset Demo'}
            </Button>

            {/* Notification Bell */}
            <Popover>
              <PopoverTrigger>
                <div className="relative p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer border border-slate-200 dark:border-zinc-800">
                  <Bell className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-zinc-950 animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 shadow-xl border-zinc-200 dark:border-zinc-800">
                <div className="p-3 border-b border-zinc-100 dark:border-zinc-800 font-semibold text-sm flex justify-between items-center bg-zinc-50 dark:bg-zinc-900">
                  <div className="flex items-center gap-2">
                    <span>Department Alerts</span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 font-bold px-1.5 py-0.2 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" className="text-[11px] h-7 text-zinc-500" onClick={clearAll}>
                    Clear All
                  </Button>
                </div>
                <div className="max-h-96 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-xs text-zinc-500">No active alerts</div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors ${
                          !n.read ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                        }`}
                        onClick={() => {
                          markAsRead(n.id);
                          if (user.role === 'GOV_OFFICIAL') {
                            if (n.title.includes('GRIEVANCE')) {
                              router.push('/official/grievances');
                            } else {
                              router.push('/official');
                            }
                          } else if (user.role === 'CONTRACTOR') {
                            router.push('/contractor');
                          } else if (user.role === 'SITE_ENGINEER') {
                            router.push('/engineer');
                          } else if (user.role === 'CITIZEN') {
                            router.push('/public');
                          }
                        }}
                      >
                        <div className="flex justify-between items-start mb-1 gap-2">
                          <span
                            className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                              n.priority === 'URGENT'
                                ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                                : n.priority === 'WARNING'
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
                                : 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                            }`}
                          >
                            {n.priority}
                          </span>
                          <span className="text-[10px] text-zinc-400">
                            {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{n.title}</p>
                        <p className="text-xs text-zinc-500 line-clamp-2 mt-0.5">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>

            {/* Department Active Status Badge */}
            <div className="hidden sm:flex items-center gap-2 text-xs bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>{roleConfig.departmentTitle.split(' ')[0]} Active</span>
            </div>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <div className="flex-1 overflow-auto p-6 bg-zinc-50/70 dark:bg-zinc-900/50">
          {children}
        </div>
      </main>
    </div>
  );
}
