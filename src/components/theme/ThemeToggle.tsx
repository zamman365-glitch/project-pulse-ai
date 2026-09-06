'use client';

import React from 'react';
import { useTheme } from './ThemeProvider';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ThemeToggleProps {
  className?: string;
  variant?: 'outline' | 'ghost' | 'default';
  size?: 'sm' | 'default' | 'icon';
}

export default function ThemeToggle({
  className = '',
  variant = 'outline',
  size = 'sm'
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleTheme}
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className={`rounded-xl transition-all gap-1.5 text-xs font-semibold ${
        theme === 'dark'
          ? 'bg-zinc-800 border-zinc-700 text-amber-300 hover:bg-zinc-700 hover:text-amber-200'
          : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900'
      } ${className}`}
    >
      {theme === 'dark' ? (
        <>
          <Sun className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">Light Mode</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-indigo-600" />
          <span className="hidden sm:inline">Dark Mode</span>
        </>
      )}
    </Button>
  );
}
