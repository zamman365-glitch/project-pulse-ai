'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Info, AlertCircle, MessageSquare } from 'lucide-react';
import PublicKPI from '@/components/features/transparency/PublicKPI';

export default function PublicDashboard() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Public Project Tracker</h1>
          <p className="text-zinc-500">Transparent monitoring of urban infrastructure development.</p>
        </div>
        <Button className="gap-2" onClick={() => router.push('/public/grievance')}>
          <MessageSquare className="w-4 h-4" />
          Submit Grievance
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PublicKPI
          label="Overall Progress"
          value="72%"
          percentage={72}
          description="Towards total project completion"
        />
        <PublicKPI
          label="Scheduled Completion"
          value="15 Sep"
          description="Original target date"
        />
        <PublicKPI
          label="Estimated Completion"
          value="18 Sep"
          description="Revised date based on current progress"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Active Project: Urban Road & Drainage Improvement</CardTitle>
            <div className="flex items-center gap-2 text-xs font-medium bg-amber-100 text-amber-700 px-2 py-1 rounded">
              <AlertCircle className="w-3 h-3" />
              MODERATE DELAY
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <Info className="w-4 h-4 text-zinc-400" />
                Public Status Update
              </h3>
              <div className="p-4 border rounded-lg bg-white dark:bg-zinc-900">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  "Current work on the drainage system in Sector 4 is experiencing a slight delay due to material supply chain issues. We are working with the contractor to accelerate the process."
                </p>
                <p className="text-xs text-zinc-400 mt-2">Last updated: 1 Sep 2026</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="w-4 h-4 text-zinc-400" />
              <span>Central Business District, Zone A</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Users className="w-4 h-4 text-zinc-400" />
              <span>Contractor: BuildRight Infra Ltd</span>
            </div>
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <p className="text-xs text-zinc-500 mb-3">Citizen Grievances</p>
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Total Submitted</span>
                <span className="font-bold">14</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Resolved</span>
                <span className="font-bold text-green-600">9</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Users({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
