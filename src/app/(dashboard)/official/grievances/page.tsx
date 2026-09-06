'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, MessageSquare, Filter, Mail, UserCheck } from 'lucide-react';
import { useProjectStore } from '@/store/useProjectStore';
import { useAuthStore } from '@/store/useAuthStore';

export default function OfficialGrievancesPage() {
  const { user } = useAuthStore();
  const { grievances, resolveGrievance } = useProjectStore();
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'OPEN' | 'RESOLVED'>('ALL');

  const filteredGrievances = grievances.filter((g) => {
    if (filterStatus === 'ALL') return true;
    return g.status === filterStatus;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Grievance Management</h1>
          <p className="text-xs text-zinc-500 mt-1">Review public concerns, respond to citizens, and resolve site grievances.</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-xs text-zinc-500 font-semibold">Filter:</span>
          {(['ALL', 'OPEN', 'RESOLVED'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
              }`}
            >
              {status} ({status === 'ALL' ? grievances.length : grievances.filter((g) => g.status === status).length})
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredGrievances.length === 0 ? (
          <Card className="py-12 text-center border-dashed">
            <p className="text-xs text-zinc-500">No grievances found matching status '{filterStatus}'.</p>
          </Card>
        ) : (
          filteredGrievances.map((g) => (
            <Card key={g.id} className="shadow-sm border-zinc-200 dark:border-zinc-800">
              <CardHeader className="flex flex-row items-center justify-between py-3.5 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-lg text-zinc-700 dark:text-zinc-300">
                    {g.trackingId || g.id}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      g.priority === 'HIGH'
                        ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                        : g.priority === 'MEDIUM'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                    }`}
                  >
                    {g.priority || 'NORMAL'} Priority
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      g.status === 'OPEN'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 ring-1 ring-amber-500/30'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 ring-1 ring-emerald-500/30'
                    }`}
                  >
                    {g.status}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    {new Date(g.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <p className="text-[10px] text-zinc-400 uppercase font-bold mb-0.5">Project Scope</p>
                    <p className="font-semibold text-zinc-800 dark:text-zinc-200">Urban Road & Drainage Improvement</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-400 uppercase font-bold mb-0.5">Category</p>
                    <p className="font-semibold text-zinc-800 dark:text-zinc-200">{g.category.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-400 uppercase font-bold mb-0.5">Complainant Info</p>
                    <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                      {g.citizenName || 'Anonymous Citizen'} {g.contactInfo ? `(${g.contactInfo})` : ''}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-100 dark:border-zinc-800">
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 italic leading-relaxed">
                    "{g.description}"
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-1">
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                    <Mail className="w-3.5 h-3.5" />
                    Contact Citizen
                  </Button>
                  {g.status !== 'RESOLVED' ? (
                    <Button
                      size="sm"
                      className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={() => resolveGrievance(g.id, user?.name)}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Mark as Resolved
                    </Button>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg">
                      <UserCheck className="w-3.5 h-3.5" />
                      Resolved & Notification Sent
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
