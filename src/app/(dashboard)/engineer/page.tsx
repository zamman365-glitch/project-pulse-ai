'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, MapPin, AlertTriangle, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useProjectStore } from '@/store/useProjectStore';
import { riskEngineService } from '@/services/risk/RiskEngineService';

export default function EngineerDashboard() {
  const router = useRouter();
  const { activities } = useProjectStore();

  const drainageAct = activities.find((a) => a.id === 'act-3') || activities[2];
  const excavationAct = activities.find((a) => a.id === 'act-2') || activities[1];

  const drainageRisk = riskEngineService.calculateRisk(drainageAct, {
    id: `chk-${drainageAct.id}`,
    activityId: drainageAct.id,
    estimatedPercent: drainageAct.actualPercentComplete,
    confidenceScore: 1,
    source: 'MANUAL',
    timestamp: new Date(),
  });

  const excavationRisk = riskEngineService.calculateRisk(excavationAct, {
    id: `chk-${excavationAct.id}`,
    activityId: excavationAct.id,
    estimatedPercent: excavationAct.actualPercentComplete,
    confidenceScore: 1,
    source: 'MANUAL',
    timestamp: new Date(),
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Today's Field Work</h1>
          <p className="text-zinc-500">Capture geo-tagged progress and report site verification.</p>
        </div>
        <Button className="gap-2 shadow-sm" onClick={() => router.push('/engineer/capture')}>
          <Camera className="w-4 h-4" />
          Quick Capture
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Drainage Card */}
        <Card className={`border-l-4 ${drainageRisk.level === 'CRITICAL' ? 'border-l-red-500' : drainageRisk.level === 'MODERATE' ? 'border-l-amber-500' : 'border-l-emerald-500'}`}>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                {drainageAct.code}
              </span>
              <CardTitle className="text-lg mt-1">{drainageAct.name}</CardTitle>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                drainageRisk.level === 'CRITICAL'
                  ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                  : drainageRisk.level === 'MODERATE'
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
              }`}
            >
              {drainageRisk.level} RISK
            </span>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-xs text-zinc-600 dark:text-zinc-400">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                Sector 4 - North Trench
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                Float: {drainageAct.remainingFloat} days
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">Verified Progress</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{drainageAct.actualPercentComplete}% (Planned: {drainageAct.plannedPercentComplete}%)</span>
              </div>
              <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    drainageRisk.level === 'CRITICAL' ? 'bg-red-500' :
                    drainageRisk.level === 'MODERATE' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${drainageAct.actualPercentComplete}%` }}
                />
              </div>
            </div>

            <div className={`p-3 rounded-xl text-xs border ${
              drainageRisk.level === 'CRITICAL'
                ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-300'
                : 'bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'
            }`}>
              <p className="font-medium flex items-center gap-1.5">
                {drainageRisk.level === 'CRITICAL' ? <AlertCircle className="w-3.5 h-3.5 text-red-500" /> : <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
                {drainageRisk.trigger}
              </p>
            </div>

            <Button className="w-full gap-2 text-xs" onClick={() => router.push('/engineer/capture')}>
              <Camera className="w-4 h-4" />
              Capture Evidence for Drainage
            </Button>
          </CardContent>
        </Card>

        {/* Excavation Card */}
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                {excavationAct.code}
              </span>
              <CardTitle className="text-lg mt-1">{excavationAct.name}</CardTitle>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 uppercase tracking-wider">
              {excavationRisk.level} RISK
            </span>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-xs text-zinc-600 dark:text-zinc-400">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                CBD Main Junction
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                Float: {excavationAct.remainingFloat} days
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">Verified Progress</span>
                <span className="font-bold text-emerald-600">{excavationAct.actualPercentComplete}%</span>
              </div>
              <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2.5 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${excavationAct.actualPercentComplete}%` }} />
              </div>
            </div>

            <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs text-zinc-600 dark:text-zinc-400">
              <p className="font-medium flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Phase Completed & Inspected
              </p>
              <p className="mt-0.5 text-zinc-500">Compaction test certificate signed off.</p>
            </div>

            <Button variant="outline" className="w-full gap-2 text-xs" onClick={() => router.push('/engineer/capture')}>
              <Camera className="w-4 h-4" />
              Upload Supplementary Record
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
