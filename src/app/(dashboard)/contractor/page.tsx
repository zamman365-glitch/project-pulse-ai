'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, MessageSquare, FileText } from 'lucide-react';

export default function ContractorDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contractor Portal</h1>
          <p className="text-zinc-500">Manage assigned activities and resolve delays.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <FileText className="w-4 h-4" />
          Submit Daily Report
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Active Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">Drainage Installation - Sector 4</p>
                  <p className="text-xs text-zinc-500">Progress: 65% | Status: DELAYED</p>
                </div>
                <Button size="sm" variant="outline" className="gap-2">
                  <MessageSquare className="w-3 h-3" />
                  Respond to Delay
                </Button>
              </div>
              <div className="p-4 border rounded-lg flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">Excavation - Phase 1</p>
                  <p className="text-xs text-zinc-500">Progress: 92% | Status: ON TRACK</p>
                </div>
                <Button size="sm" variant="ghost">Details</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800">
              <div className="flex items-center gap-2 text-red-600 mb-1">
                <AlertCircle className="w-4 h-4" />
                <span className="text-xs font-bold uppercase">Critical Action</span>
              </div>
              <p className="text-sm font-medium">Respond to Bridge Slab Delay</p>
              <p className="text-xs text-zinc-500 mt-1">Gov Official requested explanation for 18h delay.</p>
              <Button size="sm" className="w-full mt-3 h-8 text-xs">Submit Explanation</Button>
            </div>
            <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
              <div className="flex items-center gap-2 text-zinc-600 mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xs font-bold uppercase">Verification</span>
              </div>
              <p className="text-sm font-medium">Verify Site Photo for Activity #C-102</p>
              <Button size="sm" variant="outline" className="w-full mt-3 h-8 text-xs">Verify</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
