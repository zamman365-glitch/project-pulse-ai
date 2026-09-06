'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { UserRole } from '@/types';
import {
  Activity,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  Building2,
  ArrowRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const DEMO_CREDENTIALS = [
  { email: 'official@projectpulse.gov.in', label: 'Gov Official', role: 'GOV_OFFICIAL' as UserRole, route: '/official' },
  { email: 'engineer@projectpulse.gov.in', label: 'Site Engineer', role: 'SITE_ENGINEER' as UserRole, route: '/engineer' },
  { email: 'contractor@projectpulse.gov.in', label: 'Contractor', role: 'CONTRACTOR' as UserRole, route: '/contractor' },
  { email: 'citizen@projectpulse.gov.in', label: 'Public Citizen', role: 'CITIZEN' as UserRole, route: '/public' },
  { email: 'admin@projectpulse.gov.in', label: 'System Admin', role: 'GOV_OFFICIAL' as UserRole, route: '/official' },
];

const ROLE_ROUTES: Record<UserRole, string> = {
  SITE_ENGINEER: '/engineer',
  CONTRACTOR: '/contractor',
  GOV_OFFICIAL: '/official',
  CITIZEN: '/public',
};

interface LoginFormProps {
  onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const router = useRouter();
  const { loginByEmail, setRole } = useAuthStore();

  const [email, setEmail] = useState('official@projectpulse.gov.in');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeChip, setActiveChip] = useState('official@projectpulse.gov.in');

  const handleSignIn = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const assignedRole = loginByEmail(email);
      const targetRoute = ROLE_ROUTES[assignedRole] || '/official';
      setLoading(false);
      if (onSuccess) onSuccess();
      router.push(targetRoute);
    }, 400);
  };

  const handleSelectCredential = (cred: typeof DEMO_CREDENTIALS[0]) => {
    setEmail(cred.email);
    setPassword('••••••••••••');
    setActiveChip(cred.email);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Main Split Login Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200/90 dark:border-zinc-800 grid grid-cols-1 md:grid-cols-12 min-h-[520px]">
        
        {/* Left Blue Panel */}
        <div className="md:col-span-5 bg-gradient-to-br from-[#0b457b] via-[#093967] to-[#052647] p-8 md:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Decorative Floating Orbs */}
          <div className="absolute top-10 right-10 w-24 h-24 rounded-full bg-blue-400/10 blur-xl pointer-events-none" />
          <div className="absolute bottom-16 left-8 w-32 h-32 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/3 w-2 h-2 rounded-full bg-blue-300/40 animate-pulse pointer-events-none" />
          <div className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-amber-300/30 animate-ping pointer-events-none" />

          {/* Top Brand Logo */}
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-inner">
              <Activity className="w-5 h-5 text-blue-200" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-white">
                ProjectPulse<span className="text-blue-300">AI</span>
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white/15 border border-white/20 text-blue-100">
                GovPortal
              </span>
            </div>
          </div>

          {/* Middle Banner Text */}
          <div className="space-y-4 my-10 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white">
              Unified Intelligence for Smarter Cities
            </h2>
            <p className="text-sm text-blue-100/80 leading-relaxed font-normal">
              Empowering municipal operators, site engineers, and governance officers with real-time insights and synchronized P6 workflows.
            </p>
          </div>

          {/* Bottom Security Badge */}
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-200/90 pt-6 border-t border-white/10 relative z-10">
            <Shield className="w-4 h-4 text-blue-300" />
            <span>Secure Government Network Access</span>
          </div>
        </div>

        {/* Right Form Panel (Light / Dark Mode Adaptive) */}
        <div className="md:col-span-7 p-8 md:p-12 bg-white dark:bg-zinc-900 flex flex-col justify-between">
          <div className="space-y-6 max-w-md mx-auto w-full">
            
            {/* Form Top Icon Header */}
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#0b457b] dark:text-blue-400 border border-blue-100 dark:border-blue-900 flex items-center justify-center shadow-xs">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Welcome back
              </h3>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Sign in to your department account
              </p>
            </div>

            {/* Login Inputs */}
            <form onSubmit={handleSignIn} className="space-y-5">
              
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Department Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setActiveChip(e.target.value);
                    }}
                    placeholder="admin@projectpulse.gov.in"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 rounded-xl text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0b457b]/30 focus:border-[#0b457b] transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Password reset link sent to department administrator.')}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-[#0b457b] transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50/50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 rounded-xl text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0b457b]/30 focus:border-[#0b457b] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0b457b] hover:bg-[#07325b] text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 dark:border-zinc-800 w-full" />
              <span className="bg-white dark:bg-zinc-900 px-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider absolute">
                or
              </span>
            </div>

            {/* Bottom Links */}
            <div className="text-center space-y-2 pt-1 text-xs">
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                New department staff?{' '}
                <button
                  type="button"
                  onClick={() => alert('Please request onboarding access from your Nodal Officer.')}
                  className="font-bold text-[#0b457b] dark:text-blue-400 hover:underline"
                >
                  Register here
                </button>
              </p>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                Citizen?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setRole('CITIZEN');
                    router.push('/public');
                  }}
                  className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View the public portal
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Credentials Section (Bottom Bar) */}
      <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur rounded-2xl p-5 border border-slate-200 dark:border-zinc-800 shadow-md text-center space-y-3">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            DEMO ACCESS CREDENTIALS
          </span>
        </div>

        {/* Credential Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {DEMO_CREDENTIALS.map((cred) => {
            const isSelected = activeChip === cred.email;
            return (
              <button
                key={cred.email}
                type="button"
                onClick={() => handleSelectCredential(cred)}
                className={`font-mono text-xs px-3 py-1.5 rounded-xl border font-semibold transition-all flex items-center gap-1.5 shadow-2xs ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 dark:border-blue-500 text-[#0b457b] dark:text-blue-300 ring-2 ring-blue-500/20'
                    : 'bg-slate-50/80 dark:bg-zinc-800/80 border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-300 hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-zinc-800 hover:text-blue-900 dark:hover:text-white'
                }`}
              >
                {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                <span>{cred.email}</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-sans font-normal border-l border-slate-300 dark:border-zinc-700 pl-1.5 ml-0.5">
                  {cred.label}
                </span>
              </button>
            );
          })}
        </div>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
          Click any credential pill to auto-populate email inputs and trigger persona role sign-in.
        </p>
      </div>
    </div>
  );
}
