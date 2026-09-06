'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, Clock, Activity, ListChecks } from 'lucide-react';
import DependencyGraph from '@/components/features/schedule/DependencyGraph';
import { useProjectStore } from '@/store/useProjectStore';
import { riskEngineService } from '@/services/risk/RiskEngineService';

export default function OfficialDashboard() {
  const router = useRouter();
  const { activities, dependencies, grievances } = useProjectStore();

  // Dynamic KPI calculations from store
  const stats = useMemo(() => {
    let onTrack = 0;
    let moderate = 0;
    let critical = 0;

    activities.forEach(act => {
      const risk = riskEngineService.calculateRisk(act, {
        id: `chk-${act.id}`,
        activityId: act.id,
        estimatedPercent: act.actualPercentComplete,
        confidenceScore: 1,
        source: 'MANUAL',
        timestamp: new Date(),
      });

      if (risk.level === 'LOW') onTrack++;
      else if (risk.level === 'MODERATE') moderate++;
      else if (risk.level === 'CRITICAL') critical++;
    });

    return {
      total: activities.length,
      onTrack,
      moderate,
      critical,
    };
  }, [activities]);

  const criticalActivities = useMemo(() => {
    return activities.filter(act => {
      const risk = riskEngineService.calculateRisk(act, {
        id: `crit-${act.id}`,
        activityId: act.id,
        estimatedPercent: act.actualPercentComplete,
        confidenceScore: 1,
        source: 'MANUAL',
        timestamp: new Date(),
      });
      return risk.level === 'CRITICAL';
    });
  }, [activities]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project Oversight & Governance</h1>
          <p className="text-zinc-500">Autonomous schedule variance detection and critical path risk intelligence.</p>
        </div>
        <div className="flex gap-2.5">
          <Button variant="outline" className="gap-2 text-xs" onClick={() => router.push('/official/audit')}>
            <ListChecks className="w-4 h-4 text-emerald-500" />
            Audit Trail
          </Button>
          <Button className="gap-2 text-xs" onClick={() => router.push('/official/approvals')}>
            <AlertCircle className="w-4 h-4 text-white" />
            Field Approvals (1)
          </Button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Total Activities</CardTitle>
            <Activity className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{stats.total}</div>
            <p className="text-xs text-zinc-400 mt-1">WBS Level 2 & 3 packages</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">On Track</CardTitle>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{stats.onTrack}</div>
            <p className="text-xs text-zinc-400 mt-1">{Math.round((stats.onTrack / stats.total) * 100)}% within baseline float</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">At Risk (Moderate)</CardTitle>
            <Clock className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400">{stats.moderate}</div>
            <p className="text-xs text-zinc-400 mt-1">Buffer consuming &le; 10d</p>
          </CardContent>
        </Card>

        <Card className={`border-l-4 shadow-sm ${stats.critical > 0 ? 'border-l-red-500 bg-red-50/20 dark:bg-red-950/10' : 'border-l-zinc-300'}`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Critical Delays</CardTitle>
            <AlertCircle className={`w-4 h-4 ${stats.critical > 0 ? 'text-red-500 animate-pulse' : 'text-zinc-400'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-black ${stats.critical > 0 ? 'text-red-600 dark:text-red-400' : 'text-zinc-700 dark:text-zinc-300'}`}>
              {stats.critical}
            </div>
            <p className={`text-xs font-medium mt-1 ${stats.critical > 0 ? 'text-red-500 font-semibold' : 'text-zinc-400'}`}>
              {stats.critical > 0 ? 'Immediate action required' : 'No critical alerts'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Project Critical Path Network</CardTitle>
              <p className="text-xs text-zinc-500">Real-time precedence diagram with automated risk calculation</p>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <DependencyGraph
              activities={activities}
              dependencies={dependencies}
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Critical Alerts */}
          <Card className="shadow-sm">
            <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                Critical Alerts ({criticalActivities.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {criticalActivities.length > 0 ? (
                  criticalActivities.map(act => (
                    <div key={act.id} className="p-3.5 border-l-4 border-l-red-500 bg-red-50/60 dark:bg-red-950/20 rounded-r-xl border border-red-200 dark:border-red-900/40 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-red-700 dark:text-red-300">{act.code}: {act.name}</span>
                        <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-red-200 dark:bg-red-900/80 text-red-800 dark:text-red-200 uppercase">
                          Critical
                        </span>
                      </div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400">
                        Progress: {act.actualPercentComplete}% (Planned: {act.plannedPercentComplete}%). Float exhausted: {act.remainingFloat} days.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-2 h-7 text-xs border-red-300 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-950/40"
                        onClick={() => router.push('/official/audit')}
                      >
                        Inspect Audit Trail
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-xs text-zinc-500">
                    All activities operating within nominal schedule float.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Grievances Feed */}
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div>
                <CardTitle className="text-base font-semibold">Citizen Grievances</CardTitle>
                <p className="text-[11px] text-zinc-400">{grievances.filter(g => g.status === 'OPEN').length} pending review</p>
              </div>
              <Button variant="ghost" size="sm" className="text-xs text-blue-600" onClick={() => router.push('/official/grievances')}>
                Manage All
              </Button>
            </CardHeader>
            <CardContent className="pt-3">
              <div className="space-y-2.5">
                {grievances.slice(0, 3).map(g => (
                  <div key={g.id} className="flex items-center justify-between p-2.5 rounded-lg border text-xs hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <div className="space-y-0.5 truncate max-w-[190px]">
                      <p className="font-semibold truncate">{g.description}</p>
                      <span className="text-[10px] text-zinc-400 font-mono">{g.trackingId || g.id}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                      g.status === 'OPEN'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                    }`}>
                      {g.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
