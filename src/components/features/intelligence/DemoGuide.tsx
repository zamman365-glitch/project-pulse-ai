'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function DemoGuide() {
  const steps = [
    {
      role: 'Government Official',
      action: 'Login as Official',
      goal: 'Observe the overall project health and the Dependency Graph.',
    },
    {
      role: 'Site Engineer',
      action: 'Login as Engineer $\rightarrow$ Capture Evidence',
      goal: 'Upload a photo, see AI estimate 60% progress, and confirm it.',
    },
    {
      role: 'System',
      action: 'Automatic Risk Trigger',
      goal: 'The Risk Engine detects a Critical Path delay $\rightarrow$ Risk turns RED.',
    },
    {
      role: 'Government Official',
      action: 'Check Notifications',
      goal: 'Receive a "CRITICAL DELAY" alert and open the Dependency Graph to see ripple effects.',
    },
    {
      role: 'Public Citizen',
      action: 'Login as Citizen $\rightarrow$ Submit Grievance',
      goal: 'Report a road access issue and see the tracking ID.',
    },
    {
      role: 'Government Official',
      action: 'Review Audit Trail',
      goal: 'Trace the entire sequence from photo upload to grievance.',
    },
  ];

  return (
    <Card className="mt-12 border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Play className="w-5 h-5 text-primary" />
          Demo Sequence Guide
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start gap-4 p-3 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">
                {index + 1}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase text-zinc-400">{step.role}</span>
                  <span className="text-sm font-semibold">{step.action}</span>
                </div>
                <p className="text-sm text-zinc-500">{step.goal}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-300 hidden md:block" />
            </div>
          ))}
          <div className="flex justify-center pt-4">
            <div className="flex items-center gap-2 text-sm font-medium text-green-600">
              <CheckCircle2 className="w-4 h-4" />
              Full Narrative Loop Completed
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
