'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Clock, FileText, AlertCircle, ShieldCheck } from 'lucide-react';
import { useProjectStore } from '@/store/useProjectStore';
import { useAuthStore } from '@/store/useAuthStore';

export default function ApprovalsPage() {
  const { user } = useAuthStore();
  const { activities, approveProgress, rejectProgress } = useProjectStore();
  const [approvedStatus, setApprovedStatus] = useState<Record<string, 'APPROVED' | 'REJECTED'>>({});

  const drainageAct = activities.find((a) => a.id === 'act-3') || activities[2];

  const handleApprove = (actId: string) => {
    approveProgress(actId, user?.name || 'Rajesh Kumar');
    setApprovedStatus((prev) => ({ ...prev, [actId]: 'APPROVED' }));
  };

  const handleReject = (actId: string) => {
    rejectProgress(actId, user?.name || 'Rajesh Kumar', 'Site photo evidence requires re-survey with GPS accuracy < 1m.');
    setApprovedStatus((prev) => ({ ...prev, [actId]: 'REJECTED' }));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-purple-600" />
            <h1 className="text-3xl font-bold tracking-tight">Progress Verifications</h1>
          </div>
          <p className="text-xs text-zinc-500 mt-1">Review and approve field evidence submitted by site engineers.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="shadow-md border-zinc-200 dark:border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <div>
              <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                {drainageAct.code}
              </span>
              <CardTitle className="text-lg mt-1">Activity: {drainageAct.name} (Sector 4)</CardTitle>
            </div>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                approvedStatus['act-3'] === 'APPROVED'
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                  : approvedStatus['act-3'] === 'REJECTED'
                  ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                  : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 animate-pulse'
              }`}
            >
              {approvedStatus['act-3'] || 'PENDING REVIEW'}
            </span>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="aspect-video bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center border overflow-hidden relative shadow-inner">
                  <img
                    src="https://images.unsplash.com/photo-1541888946425-d0fbb18086f7?auto=format&fit=crop&q=80&w=800"
                    alt="Site Evidence"
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded backdrop-blur">
                    GPS: 28.6139° N, 77.2090° E
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl space-y-3 border border-zinc-100 dark:border-zinc-800">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">Computer Vision AI Estimate</span>
                    <span className="font-bold text-purple-600 dark:text-purple-400">60%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">Engineer Verified</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">{drainageAct.actualPercentComplete}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">Baseline Target</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">{drainageAct.plannedPercentComplete}%</span>
                  </div>
                </div>

                <div className="p-3 border rounded-xl text-xs text-zinc-600 dark:text-zinc-400 bg-zinc-50/50 dark:bg-zinc-800/30">
                  <p className="font-semibold text-zinc-800 dark:text-zinc-200 mb-1">Engineer Note:</p>
                  "Trenching complete; main RC pipe jointing at 60%. Concrete pouring logistics caused 18h lag. Adjusted float."
                </div>

                {approvedStatus['act-3'] ? (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Decision recorded: {approvedStatus['act-3']}. Logged in System Audit Trail.
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <Button className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-9" onClick={() => handleApprove('act-3')}>
                      <CheckCircle2 className="w-4 h-4" />
                      Approve Progress
                    </Button>
                    <Button className="flex-1 gap-2 variant-destructive text-xs h-9" variant="destructive" onClick={() => handleReject('act-3')}>
                      <XCircle className="w-4 h-4" />
                      Reject Evidence
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Previously Verified */}
        <Card className="opacity-75 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <CardTitle className="text-base font-semibold">Activity: Excavation Phase 1</CardTitle>
            <span className="text-xs font-bold px-2 py-0.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 rounded-full">
              OFFICIALLY APPROVED
            </span>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border text-xs">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Verified by Govt Administrator on Aug 30</span>
              </div>
              <span className="font-mono text-zinc-400">evt-init-2</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
