'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, MessageSquare, Filter } from 'lucide-react';

export default function OfficialGrievancesPage() {
  const mockGrievances = [
    {
      id: 'GRV-2026-0905-882',
      project: 'Urban Road & Drainage Improvement',
      category: 'Road access',
      description: 'Construction debris is blocking the main entrance to the residential colony in Sector 4.',
      status: 'OPEN',
      timestamp: '2026-09-05 10:15 AM',
      priority: 'HIGH',
    },
    {
      id: 'GRV-2026-0904-122',
      project: 'Urban Road & Drainage Improvement',
      category: 'Noise',
      description: 'Excessive noise from machinery after 11 PM on Tuesday night.',
      status: 'RESOLVED',
      timestamp: '2026-09-04 08:30 AM',
      priority: 'LOW',
    },
    {
      id: 'GRV-2026-0903-441',
      project: 'Central Park Revitalization',
      category: 'Environment',
      description: 'Dust pollution causing issues for local shops.',
      status: 'IN_REVIEW',
      timestamp: '2026-09-03 02:45 PM',
      priority: 'MEDIUM',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Grievance Management</h1>
          <p className="text-zinc-500">Review and resolve citizen concerns across all projects.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {mockGrievances.map((g) => (
          <Card key={g.id}>
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                  {g.id}
                </span>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                  g.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                  g.priority === 'MEDIUM' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {g.priority} Priority
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium px-2 py-1 rounded ${
                  g.status === 'OPEN' ? 'bg-amber-100 text-amber-700' :
                  g.status === 'RESOLVED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {g.status}
                </span>
                <span className="text-xs text-zinc-400">{g.timestamp}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Project</p>
                  <p className="text-sm font-medium">{g.project}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Category</p>
                  <p className="text-sm font-medium">{g.category}</p>
                </div>
              </div>
              <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                <p className="text-sm text-zinc-600 dark:text-zinc-400 italic">
                  "{g.description}"
                </p>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" size="sm" className="gap-2">
                  <MessageSquare className="w-3 h-3" />
                  Contact Citizen
                </Button>
                {g.status !== 'RESOLVED' && (
                  <Button size="sm" className="gap-2">
                    <CheckCircle2 className="w-3 h-3" />
                    Mark as Resolved
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
