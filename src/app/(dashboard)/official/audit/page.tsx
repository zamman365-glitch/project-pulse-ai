'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Activity, AlertTriangle, Download, Shield, Sparkles, Filter, CheckCircle2, MessageSquare, Wrench } from 'lucide-react';
import { useProjectStore } from '@/store/useProjectStore';

export default function AuditTrailPage() {
  const { auditEvents } = useProjectStore();
  const [filterAction, setFilterAction] = useState<string>('ALL');

  const filteredEvents = auditEvents.filter((evt) => {
    if (filterAction === 'ALL') return true;
    return evt.action === filterAction;
  });

  const handleExportCSV = () => {
    const headers = ['ID', 'Timestamp', 'Actor/User', 'Action', 'Entity ID', 'Details'];
    const rows = auditEvents.map((evt) => [
      evt.id,
      new Date(evt.timestamp).toISOString(),
      `"${evt.userId}"`,
      evt.action,
      evt.entityId,
      `"${(evt.details || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ProjectPulse_AuditTrail_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getActionBadgeStyle = (action: string) => {
    switch (action) {
      case 'STATUS_CHANGE':
        return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-300';
      case 'VERIFY_PROGRESS':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-300';
      case 'AI_ESTIMATION':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-300';
      case 'GRIEVANCE_SUBMITTED':
      case 'GRIEVANCE_RESOLVED':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-300';
      case 'RECOVERY_PLAN_SUBMITTED':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300';
      default:
        return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-300';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'STATUS_CHANGE':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'VERIFY_PROGRESS':
        return <CheckCircle2 className="w-4 h-4 text-blue-500" />;
      case 'AI_ESTIMATION':
        return <Sparkles className="w-4 h-4 text-purple-500" />;
      case 'GRIEVANCE_SUBMITTED':
      case 'GRIEVANCE_RESOLVED':
        return <MessageSquare className="w-4 h-4 text-amber-500" />;
      case 'RECOVERY_PLAN_SUBMITTED':
        return <Wrench className="w-4 h-4 text-emerald-500" />;
      default:
        return <Activity className="w-4 h-4 text-zinc-500" />;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" />
            <h1 className="text-3xl font-bold tracking-tight">System Audit Trail</h1>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Immutable system event ledger documenting all field updates, AI estimates, and government approvals.
          </p>
        </div>
        <Button variant="outline" className="gap-2 text-xs" onClick={handleExportCSV}>
          <Download className="w-4 h-4" />
          Export CSV Log
        </Button>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Filter className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
        <span className="text-xs font-semibold text-zinc-500 shrink-0">Filter:</span>
        {['ALL', 'VERIFY_PROGRESS', 'AI_ESTIMATION', 'STATUS_CHANGE', 'GRIEVANCE_SUBMITTED', 'RECOVERY_PLAN_SUBMITTED'].map((act) => (
          <button
            key={act}
            onClick={() => setFilterAction(act)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors shrink-0 ${
              filterAction === act
                ? 'bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900 shadow-sm'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
            }`}
          >
            {act.replace('_', ' ')}
          </button>
        ))}
      </div>

      {filteredEvents.length === 0 ? (
        <Card className="py-16 text-center border-dashed">
          <p className="text-xs text-zinc-500">No audit events match the selected filter.</p>
        </Card>
      ) : (
        <div className="relative space-y-6 before:absolute before:inset-0 before:left-5 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-zinc-300 before:to-zinc-200 dark:before:via-zinc-800">
          {filteredEvents.map((event) => (
            <div key={event.id} className="relative flex items-start gap-4 pl-12 group">
              {/* Timeline marker */}
              <div className="absolute left-2.5 top-1.5 w-6 h-6 rounded-full bg-white dark:bg-zinc-900 border-2 border-blue-500 shadow-sm flex items-center justify-center -translate-x-1/2">
                {getActionIcon(event.action)}
              </div>

              <div className="flex-1 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{event.userId}</span>
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${getActionBadgeStyle(event.action)}`}>
                      {event.action}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(event.timestamp).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </span>
                </div>

                <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
                  {event.details || 'System event recorded.'}
                </p>

                {event.entityId && (
                  <div className="mt-2 text-[10px] font-mono text-zinc-400 bg-zinc-50 dark:bg-zinc-900 px-2 py-1 rounded inline-block">
                    Target Entity: {event.entityId}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
