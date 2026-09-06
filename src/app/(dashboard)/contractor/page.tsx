'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, MessageSquare, FileText, ArrowRight, Clock, ShieldCheck } from 'lucide-react';
import { useProjectStore } from '@/store/useProjectStore';
import { riskEngineService } from '@/services/risk/RiskEngineService';

export default function ContractorDashboard() {
  const router = useRouter();
  const { activities, recoveryPlans } = useProjectStore();

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contractor Portal</h1>
          <p className="text-zinc-500">Monitor WBS work packages, mitigate critical path float, and coordinate recovery.</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={() => router.push('/contractor/activity/act-3')}>
          <FileText className="w-4 h-4 text-blue-500" />
          Drainage Recovery Details
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <CardTitle className="text-lg">Assigned Project Activities</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {activities.map((act) => {
                const risk = riskEngineService.calculateRisk(act, {
                  id: `chk-${act.id}`,
                  activityId: act.id,
                  estimatedPercent: act.actualPercentComplete,
                  confidenceScore: 1,
                  source: 'MANUAL',
                  timestamp: new Date(),
                });

                const isDelayed = act.actualPercentComplete < act.plannedPercentComplete;

                return (
                  <div
                    key={act.id}
                    className="p-4 border rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                          {act.code}
                        </span>
                        <p className="font-semibold text-sm">{act.name}</p>
                        {act.isCriticalPath && (
                          <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300">
                            Critical Path
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500">
                        <span>Progress: <strong>{act.actualPercentComplete}%</strong> / {act.plannedPercentComplete}%</span>
                        <span>Float: <strong>{act.remainingFloat}d</strong></span>
                        <span
                          className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase ${
                            risk.level === 'CRITICAL'
                              ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                              : risk.level === 'MODERATE'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                          }`}
                        >
                          {risk.level} RISK
                        </span>
                      </div>

                      <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            risk.level === 'CRITICAL' ? 'bg-red-500' :
                            risk.level === 'MODERATE' ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${act.actualPercentComplete}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex sm:flex-col gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="default"
                        className="gap-1 text-xs h-8"
                        onClick={() => router.push(`/contractor/activity/${act.id}`)}
                      >
                        Manage & Recover
                        <ArrowRight className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Pending Actions & Recovery Status */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <CardTitle className="text-base font-semibold">Immediate Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="p-3.5 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-900/50">
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-1 font-bold text-xs">
                  <AlertCircle className="w-4 h-4" />
                  CRITICAL PATH DELAY
                </div>
                <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Drainage Installation (WBS-1.3)</p>
                <p className="text-xs text-zinc-500 mt-1">
                  Progress deficit consumes remaining float. Submit recovery plan to prevent milestone penalty.
                </p>
                <Button
                  size="sm"
                  className="w-full mt-3 h-8 text-xs bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => router.push('/contractor/activity/act-3')}
                >
                  Submit Recovery Plan
                </Button>
              </div>

              <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700">
                <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300 mb-1 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  DAILY LOG COMPLIANCE
                </div>
                <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">CBD Zone A shift attendance logged (42 workers on site).</p>
              </div>
            </CardContent>
          </Card>

          {/* Submitted Recovery Plans */}
          <Card>
            <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-500" />
                Submitted Recovery Commitments
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {recoveryPlans.length === 0 ? (
                <div className="text-center py-6 text-xs text-zinc-500">
                  No recovery plans submitted yet. Click "Manage & Recover" on any activity to submit.
                </div>
              ) : (
                <div className="space-y-3">
                  {recoveryPlans.map((plan) => (
                    <div key={plan.id} className="p-3 border rounded-xl text-xs bg-zinc-50 dark:bg-zinc-800/40 space-y-1">
                      <div className="flex justify-between items-center font-bold">
                        <span>Recover +{plan.proposedRecoveryDays} days</span>
                        <span className="text-[10px] text-amber-600 bg-amber-50 dark:bg-amber-950 px-1.5 py-0.5 rounded">
                          {plan.status}
                        </span>
                      </div>
                      <p className="text-zinc-600 dark:text-zinc-400 text-[11px]">{plan.resourceChanges}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

