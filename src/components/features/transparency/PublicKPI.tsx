'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface PublicKPIProps {
  label: string;
  value: string | number;
  percentage?: number;
  trend?: 'up' | 'down' | 'stable';
  description: string;
}

export default function PublicKPI({ label, value, percentage, trend, description }: PublicKPIProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-zinc-500">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-2">{value}</div>
        {percentage !== undefined && (
          <div className="space-y-2">
            <Progress value={percentage} className="h-2" />
            <p className="text-xs text-zinc-400">{percentage}% complete</p>
          </div>
        )}
        <p className="text-xs text-zinc-500 mt-2">{description}</p>
      </CardContent>
    </Card>
  );
}
