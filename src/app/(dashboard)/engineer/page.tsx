'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, MapPin, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

export default function EngineerDashboard() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Today's Field Work</h1>
          <p className="text-zinc-500">Capture progress and report site status.</p>
        </div>
        <Button className="gap-2" onClick={() => router.push('/engineer/capture')}>
          <Camera className="w-4 h-4" />
          Quick Capture
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Drainage Installation</CardTitle>
            <span className="text-xs font-medium bg-amber-100 text-amber-700 px-2 py-1 rounded">MODERATE RISK</span>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-zinc-600">
                <MapPin className="w-4 h-4" />
                Sector 4 - North Side
              </div>
              <div className="flex items-center gap-2 text-zinc-600">
                <Clock className="w-4 h-4" />
                Deadline: Today
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Current Progress</span>
                <span className="font-bold">65%</span>
              </div>
              <div className="w-full bg-zinc-200 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>

            <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-xs text-zinc-600 dark:text-zinc-400">
              <p className="font-medium mb-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-500" />
                Next Activity: Base Layer
              </p>
              <p>Scheduled to start: Sep 3 (Buffer: 48 hours)</p>
            </div>

            <Button className="w-full gap-2" onClick={() => router.push('/engineer/capture')}>
              <Camera className="w-4 h-4" />
              Capture Evidence
            </Button>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Excavation - Phase 1</CardTitle>
            <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded">LOW RISK</span>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-zinc-600">
                <MapPin className="w-4 h-4" />
                Main Junction
              </div>
              <div className="flex items-center gap-2 text-zinc-600">
                <Clock className="w-4 h-4" />
                Deadline: Sep 10
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Current Progress</span>
                <span className="font-bold">92%</span>
              </div>
              <div className="w-full bg-zinc-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>

            <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-xs text-zinc-600 dark:text-zinc-400">
              <p className="font-medium mb-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-green-500" />
                Status: Nearly Complete
              </p>
              <p>No downstream conflicts detected.</p>
            </div>

            <Button variant="outline" className="w-full gap-2" onClick={() => router.push('/engineer/capture')}>
              <Camera className="w-4 h-4" />
              Capture Evidence
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
