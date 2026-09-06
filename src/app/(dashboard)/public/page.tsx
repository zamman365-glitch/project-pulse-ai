'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Info, AlertCircle, MessageSquare, Users } from 'lucide-react';
import PublicKPI from '@/components/features/transparency/PublicKPI';
import { useProjectStore } from '@/store/useProjectStore';

export default function PublicDashboard() {
  const router = useRouter();
  const { activities, grievances } = useProjectStore();

  const totalProgressSum = activities.reduce((acc, a) => acc + a.actualPercentComplete, 0);
  const overallProgress = Math.round(totalProgressSum / activities.length);

  const totalGrievances = grievances.length;
  const resolvedGrievances = grievances.filter((g) => g.status === 'RESOLVED').length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Public Project Tracker</h1>
          <p className="text-zinc-500">Transparent public monitoring of urban infrastructure development.</p>
        </div>
        <Button className="gap-2 shadow-sm" onClick={() => router.push('/public/grievance')}>
          <MessageSquare className="w-4 h-4" />
          Submit Citizen Grievance
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PublicKPI
          label="Overall Completion"
          value={`${overallProgress}%`}
          percentage={overallProgress}
          description="Aggregate progress across 6 WBS milestone packages"
        />
        <PublicKPI
          label="Scheduled Milestone"
          value="15 Sep 2026"
          description="Baseline completion target date"
        />
        <PublicKPI
          label="Estimated Delivery"
          value="18 Sep 2026"
          description="AI forecast adjusted for site progress updates"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <CardTitle className="text-lg">Project: Urban Road & Drainage Improvement</CardTitle>
            <div className="flex items-center gap-1.5 text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 px-2.5 py-1 rounded-full">
              <AlertCircle className="w-3.5 h-3.5" />
              MODERATE DELAY (Sector 4)
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-sm flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
                <Info className="w-4 h-4 text-blue-500" />
                Official Public Notice
              </h3>
              <div className="p-4 border rounded-xl bg-zinc-50 dark:bg-zinc-800/40 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                "Sector 4 drainage installation is undergoing concrete pipe alignment verification. Traffic diversions on Central Business District Corridor remain in effect with dedicated wardens during peak hours."
                <p className="text-[10px] text-zinc-400 mt-2 font-mono">Verified by Municipal Public Works Department &bull; Updated today</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Public Activity Breakdown</h4>
              <div className="space-y-2">
                {activities.map((act) => (
                  <div key={act.id} className="p-3 border rounded-xl text-xs space-y-1 bg-white dark:bg-zinc-950">
                    <div className="flex justify-between font-semibold">
                      <span>{act.code}: {act.name}</span>
                      <span className="text-blue-600 dark:text-blue-400">{act.actualPercentComplete}%</span>
                    </div>
                    <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: `${act.actualPercentComplete}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <CardTitle className="text-base font-semibold">Project Metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4 text-xs">
            <div className="flex items-center gap-2.5 text-zinc-600 dark:text-zinc-300">
              <MapPin className="w-4 h-4 text-zinc-400 shrink-0" />
              <span>Central Business District, Zone A</span>
            </div>
            <div className="flex items-center gap-2.5 text-zinc-600 dark:text-zinc-300">
              <Users className="w-4 h-4 text-zinc-400 shrink-0" />
              <span>Primary Contractor: BuildRight Infra Ltd</span>
            </div>
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
              <p className="font-semibold text-zinc-700 dark:text-zinc-300">Citizen Transparency Stats</p>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Total Grievances Filed</span>
                <span className="font-bold">{totalGrievances}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Resolved & Actioned</span>
                <span className="font-bold text-emerald-600">{resolvedGrievances}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
