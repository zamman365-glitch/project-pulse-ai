'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, User, Activity, AlertTriangle } from 'lucide-react';

export default function AuditTrailPage() {
  const mockEvents = [
    {
      id: 'evt-1',
      timestamp: '2026-09-05 10:14 AM',
      user: 'Amit Sharma (Site Engineer)',
      action: 'UPLOAD_PHOTO',
      details: 'Uploaded site evidence for Activity #WBS-1.3 (Drainage Installation)',
      status: 'SUCCESS',
      type: 'INFO',
    },
    {
      id: 'evt-2',
      timestamp: '2026-09-05 10:15 AM',
      user: 'ProjectPulse AI',
      action: 'AI_ESTIMATION',
      details: 'AI estimated 60% completion for Activity #WBS-1.3 (Planned: 90%)',
      status: 'SUCCESS',
      type: 'INFO',
    },
    {
      id: 'evt-3',
      timestamp: '2026-09-05 10:16 AM',
      user: 'Amit Sharma (Site Engineer)',
      action: 'VERIFY_PROGRESS',
      details: 'Engineer verified progress as 60%',
      status: 'SUCCESS',
      type: 'INFO',
    },
    {
      id: 'evt-4',
      timestamp: '2026-09-05 10:17 AM',
      user: 'Risk Engine',
      action: 'STATUS_CHANGE',
      details: 'Risk status changed from MODERATE to CRITICAL for Activity #WBS-1.3',
      status: 'SUCCESS',
      type: 'WARNING',
    },
    {
      id: 'evt-5',
      timestamp: '2026-09-05 10:20 AM',
      user: 'System',
      action: 'NOTIFICATION_SENT',
      details: 'Urgent alert sent to Government Official (Rajesh Kumar)',
      status: 'SUCCESS',
      type: 'INFO',
    },
    {
      id: 'evt-6',
      timestamp: '2026-09-05 11:05 AM',
      user: 'Suresh Iyer (Citizen)',
      action: 'SUBMIT_GRIEVANCE',
      details: 'Submitted grievance regarding road access in Sector 4',
      status: 'SUCCESS',
      type: 'INFO',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Audit Trail</h1>
          <p className="text-zinc-500">Immutable log of all system and human actions.</p>
        </div>
        <Button variant="outline" className="gap-2">
          Export Log
        </Button>
      </div>

      <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-300 before:to-transparent">
        {mockEvents.map((event, index) => (
          <div key={event.id} className="relative flex items-start gap-6">
            <div className={`absolute left-0 mt-1.5 w-10 h-10 rounded-full border-4 border-white dark:border-zinc-950 flex items-center justify-center z-10 ${
              event.type === 'WARNING' ? 'bg-red-500 text-white' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
            }`}>
              {event.type === 'WARNING' ? <AlertTriangle className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
            </div>
            <div className="flex-1 pt-1">
              <Card className="border-none shadow-none bg-transparent">
                <CardContent className="p-0 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{event.user}</span>
                    <span className="text-xs text-zinc-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {event.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {event.details}
                  </p>
                  <div className="flex gap-2">
                    <span className="text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-500">
                      {event.action}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
