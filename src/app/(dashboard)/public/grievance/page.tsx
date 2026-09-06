'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function GrievancePage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 py-12">
        <Card className="text-center py-12">
          <CardContent className="flex flex-col items-center justify-center space-y-4">
            <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold">Grievance Submitted</h2>
            <p className="text-zinc-500 max-w-sm">
              Your concern has been logged. Your tracking ID is <strong>GRV-2026-0905-882</strong>.
              Government officials will review this and take appropriate action.
            </p>
            <Button onClick={() => router.push('/public')} className="mt-4">
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Submit Grievance</h1>
          <p className="text-zinc-500">Report issues related to the urban infrastructure project.</p>
        </div>
        <Button variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Grievance Form
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Project</label>
                <select className="w-full p-2 border rounded-md bg-white dark:bg-zinc-900">
                  <option>Urban Road & Drainage Improvement</option>
                  <option>Central Park Revitalization</option>
                  <option>North-South Corridor Bridge</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select className="w-full p-2 border rounded-md bg-white dark:bg-zinc-900">
                  <option>Work quality</option>
                  <option>Work not happening</option>
                  <option>Safety issue</option>
                  <option>Environmental issue</option>
                  <option>Road access</option>
                  <option>Noise</option>
                  <option>Drainage</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description of Issue</label>
              <textarea
                className="w-full p-2 border rounded-md bg-white dark:bg-zinc-900 h-32"
                placeholder="Please describe the issue in detail..."
                required
              ></textarea>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Evidence (Optional)</label>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg p-6 text-center space-y-2 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                <Upload className="w-6 h-6 text-zinc-400" />
                <p className="text-xs text-zinc-500">Click to upload photo or document</p>
                <input type="file" className="hidden" />
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg text-blue-700 dark:text-blue-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p>You can choose to submit this grievance anonymously. Your contact details will only be used for status updates.</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">Your Name (Optional)</label>
                <input type="text" className="w-full p-2 border rounded-md bg-white dark:bg-zinc-900" placeholder="Full Name" />
              </div>
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">Contact Info (Optional)</label>
                <input type="text" className="w-full p-2 border rounded-md bg-white dark:bg-zinc-900" placeholder="Email or Phone" />
              </div>
            </div>

            <Button type="submit" className="w-full py-6 text-lg" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Grievance'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
