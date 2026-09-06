'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Clock, FileText } from 'lucide-react';

export default function ApprovalsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Progress Verifications</h1>
          <p className="text-zinc-500">Review and approve field evidence submitted by engineers.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Activity: Drainage Installation (Sector 4)</CardTitle>
            <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded">PENDING REVIEW</span>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="aspect-video bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center border overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1541888946425-48m-5970c88?auto=format&fit=crop&q=80&w=1000" alt="Site Evidence" className="object-cover w-full h-full" />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <FileText className="w-3 h-3" />
                    View Full Report
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">AI Estimated Progress</span>
                    <span className="font-bold">60%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Engineer Verified</span>
                    <span className="font-bold text-primary">60%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Planned Progress</span>
                    <span className="font-bold text-red-500">90%</span>
                  </div>
                </div>
                <div className="p-3 border rounded-lg text-xs text-zinc-600 dark:text-zinc-400 italic">
                  "Concrete pouring delayed by 18 hours due to logistics issue. Adjusted progress accordingly."
                </div>
                <div className="flex gap-3">
                  <Button className="flex-1 gap-2" variant="default">
                    <CheckCircle2 className="w-4 h-4" />
                    Approve Progress
                  </Button>
                  <Button className="flex-1 gap-2" variant="destructive">
                    <XCircle className="w-4 h-4" />
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="opacity-60">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Activity: Excavation Phase 1</CardTitle>
            <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded">VERIFIED</span>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">Verified by Rajesh Kumar on Aug 30</span>
              </div>
              <Button variant="ghost" size="sm">View History</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
