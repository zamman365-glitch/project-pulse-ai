'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, Clock, Activity, ListChecks } from 'lucide-react';
import DependencyGraph from '@/components/features/schedule/DependencyGraph';
import { MOCK_ACTIVITIES, MOCK_DEPENDENCIES } from '@/lib/mock-data';

export default function OfficialDashboard() {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project Oversight</h1>
          <p className="text-zinc-500">High-level system health and critical alerts.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2" onClick={() => router.push('/official/audit')}>
            <ListChecks className="w-4 h-4" />
            System Audit
          </Button>
          <Button className="gap-2" onClick={() => router.push('/official/approvals')}>
            <AlertCircle className="w-4 h-4" />
            Pending Approvals (1)
          </Button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Activity className="w-4 h-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-zinc-500">Across 3 regions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">On Track</CardTitle>
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-zinc-500">67% of projects</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">At Risk</CardTitle>
            <Clock className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-zinc-500">Moderate variance</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
            <AlertCircle className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-red-500 font-medium">Immediate action required</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Project Dependency Graph</CardTitle>
          </CardHeader>
          <CardContent>
            <DependencyGraph
              activities={MOCK_ACTIVITIES}
              dependencies={MOCK_DEPENDENCIES}
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Critical Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/10 flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="font-bold text-red-700 dark:text-red-400">Project A: Bridge Slab</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Predicted delay: 18h</p>
                    <p className="text-xs text-zinc-500">Impact: Pavement Work</p>
                  </div>
                  <Button variant="outline" size="sm" className="text-red-600 border-red-200">Detail</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Grievances</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => router.push('/official/grievances')}>
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-sm">Road Access Issue</span>
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">Open</span>
                </div>
                <div className="flex items-center justify-between p-2 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-sm">Noise Complaint</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Resolved</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
