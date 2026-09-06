'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/useAuthStore';
import { UserRole } from '@/types';
import {
  ShieldCheck,
  Construction,
  HardHat,
  Users,
  ArrowRight,
  Activity,
  AlertCircle,
  CheckCircle2,
  Layers,
  ChevronRight,
  X,
  Sparkles,
  Clock,
  Eye,
  FileCheck
} from 'lucide-react';
import DemoGuide from '@/components/features/intelligence/DemoGuide';
import LoginForm from '@/components/auth/LoginForm';
import ThemeToggle from '@/components/theme/ThemeToggle';

const ROLE_CONFIG: Record<UserRole, { label: string; description: string; icon: any; route: string; badge: string }> = {
  SITE_ENGINEER: {
    label: 'Site Engineer',
    description: 'Capture site evidence, run computer vision progress analysis, and verify daily field work.',
    icon: HardHat,
    route: '/engineer',
    badge: 'Field Ops',
  },
  CONTRACTOR: {
    label: 'Contractor',
    description: 'Monitor activity float, manage WBS work packages, and submit recovery commitments.',
    icon: Construction,
    route: '/contractor',
    badge: 'Execution',
  },
  GOV_OFFICIAL: {
    label: 'Government Official',
    description: 'Supervise project health, inspect critical path graph, and approve field verifications.',
    icon: ShieldCheck,
    route: '/official',
    badge: 'Governance',
  },
  CITIZEN: {
    label: 'Public Citizen',
    description: 'Track urban infrastructure progress transparently and report citizen grievances.',
    icon: Users,
    route: '/public',
    badge: 'Transparency',
  },
};

export default function HomePage() {
  const router = useRouter();
  const { setRole } = useAuthStore();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setRole(role);
    router.push(ROLE_CONFIG[role].route);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen font-sans bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 selection:bg-blue-100 dark:selection:bg-blue-900 relative overflow-x-hidden transition-colors duration-200">
      
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800 px-6 lg:px-12 h-20 flex items-center justify-between shadow-xs">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 rounded-xl bg-[#0b457b] text-white flex items-center justify-center font-extrabold text-lg shadow-md tracking-tighter">
            <Activity className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tight text-[#0b457b] dark:text-white">
              ProjectPulse<span className="text-blue-600 dark:text-blue-400">AI</span>
            </span>
            <span className="text-lg">🇮🇳</span>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600 dark:text-zinc-300">
          <button onClick={() => scrollToSection('features')} className="hover:text-[#0b457b] dark:hover:text-blue-400 transition-colors">
            Intelligence Engine
          </button>
          <button onClick={() => scrollToSection('how-it-works')} className="hover:text-[#0b457b] dark:hover:text-blue-400 transition-colors">
            How It Works
          </button>
          <button onClick={() => scrollToSection('portals')} className="hover:text-[#0b457b] dark:hover:text-blue-400 transition-colors">
            User Portals
          </button>
          <button onClick={() => handleRoleSelect('CITIZEN')} className="hover:text-[#0b457b] dark:hover:text-blue-400 transition-colors flex items-center gap-1">
            Citizen Transparency
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button
            variant="outline"
            className="rounded-full px-5 h-10 border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 font-semibold hover:border-[#0b457b] hover:text-[#0b457b] dark:hover:border-blue-400 dark:hover:text-blue-400 text-xs sm:text-sm"
            onClick={() => setShowLoginModal(true)}
          >
            Log In
          </Button>
          <Button
            className="rounded-full px-6 h-10 bg-[#0b457b] hover:bg-[#07325b] text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all"
            onClick={() => setShowLoginModal(true)}
          >
            Enter Portal
          </Button>
        </div>
      </header>

      {/* Infrastructure Hero Section */}
      <section className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 px-6 lg:px-12 hero-bg-waves overflow-hidden">
        
        {/* Subtle Background Accent */}
        <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20">
          <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-[#ff9933]/15 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#138808]/10 to-transparent" />
        </div>

        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Hero Left Text (Explicit High-Contrast Dark Mode Visibility) */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-extrabold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                Infrastructure Intelligence System
              </span>

              {/* Explicit high-contrast headline for both Light and Dark mode */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.08]">
                Predict Delays.<br />
                Verify Progress.<br />
                <span className="text-[#0b457b] dark:text-blue-400">Protect Milestones.</span>
              </h1>

              <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-300 font-normal leading-relaxed max-w-xl">
                Autonomous Primavera P6 schedule tracking, computer vision site verification, and critical path risk intelligence for smart infrastructure.
              </p>

              <p className="text-xs sm:text-sm font-semibold text-zinc-500 dark:text-zinc-400 flex items-center gap-2 pt-1">
                <span>Under the aegis of</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-200">Ministry of Housing & Urban Affairs & Smart Cities Mission.</span>
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <Button
                size="lg"
                className="rounded-full px-8 h-14 bg-[#0b457b] hover:bg-[#07325b] text-white font-bold text-base shadow-xl hover:shadow-2xl transition-all gap-3 group"
                onClick={() => setShowLoginModal(true)}
              >
                Login to Portal
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 h-14 bg-emerald-50/60 dark:bg-emerald-950/40 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/60 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 font-bold text-base transition-all"
                onClick={() => handleRoleSelect('CITIZEN')}
              >
                View Citizen Portal
              </Button>
            </div>

            {/* Stats Row */}
            <div className="pt-8 border-t border-zinc-200/80 dark:border-zinc-800 grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div>
                <div className="text-3xl font-black text-[#0b457b] dark:text-blue-400">6</div>
                <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mt-0.5">WBS Work Packages</div>
              </div>
              <div>
                <div className="text-3xl font-black text-[#0b457b] dark:text-blue-400">100%</div>
                <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mt-0.5">Immutable Audit Trail</div>
              </div>
              <div>
                <div className="text-3xl font-black text-[#0b457b] dark:text-blue-400">95%</div>
                <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mt-0.5">AI Vision Precision</div>
              </div>
              <div>
                <div className="text-3xl font-black text-[#0b457b] dark:text-blue-400">0</div>
                <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mt-0.5">Delay Blindspots</div>
              </div>
            </div>
          </div>

          {/* Hero Right Graphic Card */}
          <div className="lg:col-span-6 relative">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/90 dark:border-zinc-800 shadow-2xl overflow-hidden backdrop-blur transform hover:scale-[1.01] transition-transform">
              {/* Card Header Bar */}
              <div className="px-6 py-4 bg-zinc-50/90 dark:bg-zinc-800/80 border-b border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">🇮🇳</span>
                  <div>
                    <p className="text-xs font-extrabold tracking-wider text-zinc-800 dark:text-zinc-100 uppercase">PROJECTPULSE AI ENGINE</p>
                    <p className="text-[10px] text-zinc-400 font-medium">Bhopal CBD Zone A &bull; P6 Schedule Sync</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 text-xs font-bold shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-red-600 dark:bg-red-400 animate-ping" />
                  <span>Critical Path Alert</span>
                </div>
              </div>

              {/* Graphic Body */}
              <div className="p-6 space-y-4 bg-gradient-to-b from-white dark:from-zinc-900 to-zinc-50/50 dark:to-zinc-950/50">
                {/* Visual Schedule Bar */}
                <div className="p-4 border rounded-2xl bg-white dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700 shadow-sm space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-zinc-800 dark:text-zinc-100">WBS-1.3: Drainage Installation</span>
                    <span className="font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 px-2 py-0.5 rounded">Critical Risk (60% Progress)</span>
                  </div>
                  <div className="w-full bg-zinc-100 dark:bg-zinc-700 rounded-full h-3 overflow-hidden p-0.5 border dark:border-zinc-600">
                    <div className="bg-red-500 h-full rounded-full w-[60%] transition-all" />
                  </div>
                  <div className="flex justify-between text-[11px] text-zinc-400 dark:text-zinc-400">
                    <span>Baseline Float: 1 Day</span>
                    <span>Predicted Ripple Delay: +48h</span>
                  </div>
                </div>

                {/* AI Vision Highlight Card */}
                <div className="p-4 border rounded-2xl bg-blue-50/40 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-900 dark:text-blue-300">
                      <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>AI Vision Photo Audit</span>
                    </div>
                    <span className="text-[10px] font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-full">
                      95% Confidence
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300">
                    Detected: <span className="font-semibold text-zinc-800 dark:text-zinc-100">Drainage pipes, excavation trench, concrete base.</span>
                  </p>
                  <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                    Anomaly Flag: Joint alignment requires 18h cure window.
                  </p>
                </div>

                {/* Floating Status Badge */}
                <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Cross-Role Live Sync Active</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">Synced</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Login Portals / Persona Selector Section */}
      <section id="portals" className="py-20 px-6 lg:px-12 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200/80 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-extrabold tracking-widest uppercase text-[#0b457b] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3.5 py-1.5 rounded-full border border-blue-100 dark:border-blue-900">
              Departmental Access Portals
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Select Your Role to Enter Portal
            </h2>
            <p className="text-base text-zinc-600 dark:text-zinc-300">
              Multi-stakeholder infrastructure intelligence for engineers, contractors, officials, and citizens.
            </p>
          </div>

          {/* Role Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(Object.keys(ROLE_CONFIG) as UserRole[]).map((role) => {
              const config = ROLE_CONFIG[role];
              const Icon = config.icon;
              return (
                <Card
                  key={role}
                  className="group hover:border-[#0b457b] dark:hover:border-blue-500 hover:shadow-xl transition-all cursor-pointer bg-white dark:bg-zinc-900 rounded-2xl border-zinc-200/80 dark:border-zinc-800 overflow-hidden flex flex-col justify-between"
                  onClick={() => handleRoleSelect(role)}
                >
                  <CardHeader className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 group-hover:bg-[#0b457b] group-hover:text-white text-[#0b457b] dark:text-blue-400 transition-colors">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 group-hover:bg-blue-50 group-hover:text-[#0b457b] transition-colors">
                        {config.badge}
                      </span>
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-zinc-900 dark:text-white group-hover:text-[#0b457b] dark:group-hover:text-blue-400 transition-colors">
                        {config.label}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <CardDescription className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      {config.description}
                    </CardDescription>
                    <Button
                      variant="outline"
                      className="w-full rounded-xl group-hover:bg-[#0b457b] group-hover:text-white group-hover:border-[#0b457b] transition-all font-bold text-xs h-10 gap-2 dark:border-zinc-700 dark:text-zinc-200"
                    >
                      Enter as {config.label}
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <DemoGuide />
        </div>
      </section>

      {/* Feature Highlights */}
      <section id="features" className="py-20 px-6 lg:px-12 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0b457b] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-900">
                Core Capabilities
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                End-to-End Infrastructure Intelligence
              </h2>
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
                ProjectPulse AI bridges physical site execution with schedule logic to eliminate delay blindspots and enforce accountability across contractors and authorities.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                    Primavera P6 schedule float analytics & successor ripple prediction
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                    Computer Vision site evidence inspection & anomaly detection
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                    Immutable system audit trail logging all human and AI updates
                  </span>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-zinc-900 dark:bg-zinc-950 text-white border border-zinc-800 shadow-2xl space-y-6">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-400" />
                  <span className="font-bold text-sm">System Operations Engine</span>
                </div>
                <span className="text-xs text-emerald-400 font-mono font-bold">ONLINE</span>
              </div>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-zinc-800/80 border border-zinc-700 flex justify-between items-center">
                  <span>Site Evidence Processing</span>
                  <span className="text-emerald-400 font-bold">Verified (60%)</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-800/80 border border-zinc-700 flex justify-between items-center">
                  <span>Schedule Risk Engine</span>
                  <span className="text-red-400 font-bold">Critical Path Triggered</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-800/80 border border-zinc-700 flex justify-between items-center">
                  <span>Contractor Recovery Plan</span>
                  <span className="text-blue-400 font-bold">+48h Float Mitigation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-900 text-zinc-400 py-12 px-6 lg:px-12 text-xs border-t border-zinc-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="text-[#0b457b] font-black text-xl bg-white px-2.5 py-1 rounded-md">ProjectPulse AI</span>
            <span>&copy; 2026 Smart Cities Mission &bull; SIH26122 Infrastructure Intelligence</span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => setShowLoginModal(true)} className="hover:text-white transition-colors">Portal Login</button>
            <button onClick={() => handleRoleSelect('CITIZEN')} className="hover:text-white transition-colors">Citizen Transparency</button>
          </div>
        </div>
      </footer>

      {/* Interactive Split-Card Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-5xl my-auto animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute -top-12 right-0 sm:right-2 p-2 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors z-50 flex items-center gap-1.5 text-xs font-semibold px-3"
            >
              <X className="w-4 h-4" />
              <span>Close</span>
            </button>
            <LoginForm onSuccess={() => setShowLoginModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
