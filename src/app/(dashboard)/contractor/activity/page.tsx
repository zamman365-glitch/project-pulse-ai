'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, AlertCircle, CheckCircle2, FileText, Camera } from 'lucide-react';
import { MOCK_ACTIVITIES } from '@/lib/mock-data';
import { riskEngineService } from '@/services/risk/RiskEngineService';

export default function ActivityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const activityId = params.id as string;
  const activity = MOCK_ACTIVITIES.find(a => a.id === activityId) || MOCK_ACTIVITIES[0];

  const risk = riskEngineService.calculateRisk(activity, {
    activityId: activity.id,
    estimatedPercent: activity.actualPercentComplete,
    confidenceScore: 1,
    source: 'MANUAL',
    timestamp: new Date(),
  });

  const evidenceHistory = [
    { date: 'Aug 28', type: 'PHOTO', progress: 35, note: 'Initial site preparation started.', status: 'VERIFIED' },
    { date: 'Aug 29', type: 'REPORT', progress: 48, note: 'Excavation of main trench complete.', status: 'VERIFIED' },
    { date: 'Aug 30', type: 'PHOTO', progress: 60, note: 'Drainage pipe installation in progress.', status: 'PENDING' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          &larr; Back to Dashboard
        </Button>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-bold px-2 py-1 rounded ${
            risk.level === 'CRITICAL' ? 'bg-red-100 text-red-700' :
            risk.level === 'MODERATE' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
          }`}>
            {risk.level} RISK
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{activity.name}</CardTitle>
              <p className="text-sm text-zinc-500">Activity Code: {activity.code} | WBS Level 3</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                  <p className="text-xs text-zinc-500 mb-1">Planned Start</p>
                  <p className="text-sm font-medium">{activity.plannedStart.toLocaleDateString()}</p>
                </div>
                <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                  <p className="text-xs text-zinc-500 mb-1">Planned Finish</p>
                  <p className="text-sm font-medium">{activity.plannedFinish.toLocaleDateString()}</p>
                </div>
                <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                  <p className="text-xs text-zinc-500 mb-1">Current Progress</p>
                  <p className="text-sm font-bold text-primary">{activity.actualPercentComplete}%</p>
                </div>
                <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                  <p className="text-xs text-zinc-500 mb-1">Float (Slack)</p>
                  <p className="text-sm font-medium">{activity.remainingFloat} days</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Progress Timeline</span>
                  <span className="text-zinc-500">{activity.actualPercentComplete}% of {activity.plannedPercentComplete}% planned</span>
                </div>
                <div className="w-full bg-zinc-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ${
                      risk.level === 'CRITICAL' ? 'bg-red-500' :
                      risk.level === 'MODERATE' ? 'bg-amber-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${activity.actualPercentComplete}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-zinc-400" />
                Evidence History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {evidenceHistory.map((entry, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                    <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                      {entry.type === 'PHOTO' ? <Camera className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold">{entry.date}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          entry.status === 'VERIFIED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {entry.status}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">{entry.note}</p>
                      <p className="text-xs font-medium text-primary">Progress: {entry.progress}%</p>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Risk Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`p-4 rounded-lg border-2 ${
                risk.level === 'CRITICAL' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                risk.level === 'MODERATE' ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' :
                'border-green-500 bg-green-50 dark:bg-green-900/20'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className={`w-4 h-4 ${
                    risk.level === 'CRITICAL' ? 'text-red-500' :
                    risk.level === 'MODERATE' ? 'text-amber-500' : 'text-green-500'
                  }`} />
                  <span className="font-bold text-sm">{risk.level} RISK</span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {risk.trigger}
                </p>
              </div>
              <Button className="w-full gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Submit Recovery Plan
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Downstream Impact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 border rounded-lg flex items-center justify-between text-sm">
                <span className="text-zinc-600">Base Layer Compaction</span>
                <span className="text-red-500 font-bold">High Risk</span>
              </div>
              <div className="p-3 border rounded-lg flex items-center justify-between text-sm">
                <span className="text-zinc-600">Pavement Work</span>
                <span className="text-amber-500 font-bold">Moderate Risk</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
