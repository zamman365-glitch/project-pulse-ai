'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { LayoutDashboard, LogOut, Menu, User, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { notifications, markAsRead } = useNotificationStore();

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Button onClick={() => router.push('/')}>Return to Login</Button>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 flex flex-col">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">ProjectPulse AI</h2>
          <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">
            {user.role.replace('_', ' ')}
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Button variant="ghost" className="w-full justify-start gap-3" onClick={() => router.push(`/dashboard`)}>
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Button>
          {/* Role-specific links will be added here */}
        </nav>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 p-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-zinc-500 truncate">{user.email}</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={logout}>
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Menu className="w-5 h-5 cursor-pointer md:hidden" />
            <h3 className="font-medium">Operational Dashboard</h3>
          </div>
          <div className="flex items-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white dark:border-zinc-950">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0">
                <div className="p-3 border-b font-medium flex justify-between items-center">
                  Notifications
                  <Button variant="ghost" size="sm" className="text-xs" onClick={() => {}}>Clear All</Button>
                </div>
                <div className="max-h-96 overflow-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-sm text-zinc-500">No notifications</div>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        className={`p-3 border-b last:border-0 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors ${!n.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                        onClick={() => markAsRead(n.id)}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className={`text-[10px] font-bold uppercase ${
                            n.priority === 'URGENT' ? 'text-red-500' :
                            n.priority === 'WARNING' ? 'text-amber-500' : 'text-blue-500'
                          }`}>
                            {n.priority}
                          </span>
                          <span className="text-[10px] text-zinc-400">{n.timestamp.toLocaleTimeString()}</span>
                        </div>
                        <p className="text-xs font-medium">{n.title}</p>
                        <p className="text-xs text-zinc-500 line-clamp-2">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>
            <div className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
              System Status: <span className="text-green-500 font-medium">Online</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
