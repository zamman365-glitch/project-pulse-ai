'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Upload, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useProjectStore } from '@/store/useProjectStore';

export default function GrievancePage() {
  const router = useRouter();
  const { submitGrievance } = useProjectStore();

  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [category, setCategory] = useState('ROAD_ACCESS');
  const [description, setDescription] = useState('');
  const [citizenName, setCitizenName] = useState('');
  const [contactInfo, setContactInfo] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setLoading(true);

    const trackingId = submitGrievance({
      projectId: 'proj-1',
      citizenId: 'cit-' + Date.now().toString().slice(-4),
      citizenName: citizenName.trim() || 'Anonymous Citizen',
      contactInfo: contactInfo.trim() || undefined,
      category,
      description,
      priority: 'HIGH',
    });

    setLoading(false);
    setSubmittedId(trackingId);
  };

  if (submittedId) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 py-8">
        <Card className="text-center py-10 shadow-lg border-zinc-200 dark:border-zinc-800">
          <CardContent className="flex flex-col items-center justify-center space-y-4">
            <div className="p-4 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 rounded-full">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold">Grievance Registered</h2>
            <p className="text-xs text-zinc-500 max-w-md leading-relaxed">
              Your concern has been logged into the ProjectPulse AI system and routed to municipal authorities.
            </p>
            <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl border text-center font-mono">
              <p className="text-[10px] text-zinc-400 uppercase font-bold">Official Tracking ID</p>
              <p className="text-lg font-black text-blue-600 dark:text-blue-400">{submittedId}</p>
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => router.push('/public')} className="text-xs">
                Back to Public Dashboard
              </Button>
              <Button onClick={() => router.push('/official/grievances')} className="text-xs gap-2">
                View in Official Portal
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Submit Public Grievance</h1>
          <p className="text-zinc-500 text-xs mt-1">Direct feedback channel for urban infrastructure issues.</p>
        </div>
        <Button variant="ghost" className="text-xs gap-1.5" onClick={() => router.back()}>
          <ArrowLeft className="w-3.5 h-3.5" />
          Cancel
        </Button>
      </div>

      <Card className="shadow-md">
        <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <MessageSquare className="w-4 h-4 text-blue-600" />
            Grievance Intake Form
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Target Infrastructure Project</label>
                <select className="w-full p-2 text-xs border rounded-lg bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 font-medium">
                  <option>Urban Road & Drainage Improvement (CBD Zone A)</option>
                  <option>Central Park Revitalization</option>
                  <option>North-South Corridor Bridge</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Issue Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 text-xs border rounded-lg bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 font-medium"
                >
                  <option value="ROAD_ACCESS">Road Access / Debris Blockage</option>
                  <option value="NOISE">Machinery Noise / Night Hours</option>
                  <option value="ENVIRONMENT">Dust & Environmental Pollution</option>
                  <option value="QUALITY">Work Quality Concern</option>
                  <option value="OTHER">Other Issue</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Detailed Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border rounded-xl bg-white dark:bg-zinc-900 text-xs h-28 border-zinc-200 dark:border-zinc-800"
                placeholder="Describe the issue, exact location, and time observed..."
                required
              />
            </div>

            <div className="flex items-center gap-2 p-3 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-xl text-blue-700 dark:text-blue-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-blue-500" />
              <p>Your report will generate a tracking ID and trigger an instant alert for Municipal Project Engineers.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Your Name (Optional)</label>
                <input
                  type="text"
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  className="w-full p-2 text-xs border rounded-lg bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                  placeholder="e.g. Suresh Iyer"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Contact Email / Phone (Optional)</label>
                <input
                  type="text"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  className="w-full p-2 text-xs border rounded-lg bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                  placeholder="For status updates"
                />
              </div>
            </div>

            <Button type="submit" className="w-full py-5 text-sm font-semibold shadow-md" disabled={loading}>
              {loading ? 'Logging Grievance...' : 'Submit Grievance & Get Tracking ID'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
