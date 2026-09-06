'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Activity, AlertTriangle } from 'lucide-react';
import { auditService } from '@/services/audit/AuditService';
import { AuditEvent } from '@/types';

export default function AuditTrailPage() {
  const [events, setEvents] = useState<AuditEvent[]>([]);

  useEffect(() => {
    setEvents(auditService.getEvents());
  }, []);

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

      {events.length === 0 ? (
        <div className="text-center py-20 text-zinc-500">
          No audit events recorded yet. Try uploading a photo as a Site Engineer.
        </div>
      ) : (
        <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-300 before:to-transparent">
          {events.map((event) => (
            <div key={event.id} className="relative flex items-start gap-6">
              <div className={`absolute left-0 mt-1.5 w-10 h-10 rounded-full border-4 border-white dark:border-zinc-950 flex items-center justify-center z-10 ${
                event.action === 'STATUS_CHANGE' ? 'bg-red-500 text-white' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
              }`}>
                {event.action === 'STATUS_CHANGE' ? <AlertTriangle className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
              </div>
              <div className="flex-1 pt-1">
                <Card className="border-none shadow-none bg-transparent">
                  <CardContent className="p-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{event.userId}</span>
                      <span className="text-xs text-zinc-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {event.timestamp.toLocaleTimeString()}
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
      )}
    </div>
  );
}
