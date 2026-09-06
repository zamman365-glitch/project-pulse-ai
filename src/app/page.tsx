'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/useAuthStore';
import { UserRole } from '@/types';
import { ShieldCheck, Construction, HardHat, Users } from 'lucide-react';
import DemoGuide from '@/components/features/intelligence/DemoGuide';

const ROLE_CONFIG: Record<UserRole, { label: string, description: string, icon: any, route: string }> = {
  SITE_ENGINEER: {
    label: 'Site Engineer',
    description: 'Capture site evidence, report progress and manage daily activities.',
    icon: HardHat,
    route: '/engineer',
  },
  CONTRACTOR: {
    label: 'Contractor',
    description: 'Monitor activity progress, respond to delays and coordinate work.',
    icon: Construction,
    route: '/contractor',
  },
  GOV_OFFICIAL: {
    label: 'Government Official',
    description: 'Supervise project health, approve verification and monitor risks.',
    icon: ShieldCheck,
    route: '/official',
  },
  CITIZEN: {
    label: 'Public Citizen',
    description: 'View project transparency dashboard and submit grievances.',
    icon: Users,
    route: '/public',
  },
};

export default function LoginPage() {
  const router = useRouter();
  const { setRole } = useAuthStore();

  const handleRoleSelect = (role: UserRole) => {
    setRole(role);
    router.push(ROLE_CONFIG[role].route);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
            ProjectPulse AI
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Planning &rarr; Execution &rarr; Verification &rarr; Risk
          </p>
          <div className="mt-4 inline-block px-3 py-1 rounded-full bg-zinc-200 dark:bg-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Prototype Mode
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(Object.keys(ROLE_CONFIG) as UserRole[]).map((role) => {
            const config = ROLE_CONFIG[role];
            const Icon = config.icon;
            return (
              <Card
                key={role}
                className="group hover:border-primary transition-all cursor-pointer"
                onClick={() => handleRoleSelect(role)}
              >
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 group-hover:bg-primary group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle>{config.label}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-6">
                    {config.description}
                  </CardDescription>
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                    Enter as {config.label}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <DemoGuide />

        <footer className="mt-16 text-center text-sm text-zinc-500">
          <p>&copy; 2026 ProjectPulse AI &bull; SIH26122 Infrastructure Intelligence</p>
        </footer>
      </div>
    </div>
  );
}
