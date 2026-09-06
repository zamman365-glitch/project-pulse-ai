import React from 'react';
import LoginForm from '@/components/auth/LoginForm';
import ThemeToggle from '@/components/theme/ThemeToggle';
import Link from 'next/link';
import { Activity, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Sign In | ProjectPulse AI',
  description: 'Department portal sign in for ProjectPulse AI infrastructure management platform.',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-100/70 font-sans text-slate-900 flex flex-col justify-between p-4 sm:p-6 lg:p-10 hero-bg-waves">
      
      {/* Top Header Bar */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between py-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-[#0b457b] transition-colors bg-white/80 backdrop-blur px-4 py-2 rounded-full border border-slate-200 shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#0b457b] text-white flex items-center justify-center font-black text-sm">
              <Activity className="w-4 h-4" />
            </div>
            <span className="text-lg font-black tracking-tight text-[#0b457b] dark:text-white">
              ProjectPulse<span className="text-blue-500">AI</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="my-auto py-8">
        <LoginForm />
      </main>

      {/* Footer */}
      <footer className="max-w-5xl w-full mx-auto text-center text-xs text-slate-400 font-medium py-4">
        &copy; {new Date().getFullYear()} ProjectPulse AI &bull; Smart Infrastructure & Primavera P6 Verification Engine. All Rights Reserved.
      </footer>
    </div>
  );
}
