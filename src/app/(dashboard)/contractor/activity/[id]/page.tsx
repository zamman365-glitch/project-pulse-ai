'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Clock,
  AlertCircle,
  CheckCircle2,
  FileText,
  Camera,
  Calendar,
  Layers,
  ArrowLeft,
  Wrench,
  Sparkles
} from 'lucide-react';
import { useProjectStore } from '@/store/useProjectStore';
import { useAuthStore } from '@/store/useAuthStore';
import { riskEngineService } from '@/services/risk/RiskEngineService';

export default function ActivityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { activities, dependencies, submitRecoveryPlan } = useProjectStore();

  const activityId = (params?.id as string) || 'act-3';
  const activity = activities.find((a) => a.id === activityId) || activities[2] || activities[0];

  const [showPlanModal, setShowPlanModal] = useState(false);
  const [recoveryDays, setRecoveryDays] = useState(2);
  const [resourcePlan, setResourcePlan] = useState('Deploy additional 20T excavator and double-shift operators');
  const [justification, setJustification] = useState('Critical path drainage activity delayed. Extra crew recovers 48 hours buffer before base compaction starts.');
  const [submittedPlan, setSubmittedPlan] = useState(false);

  const risk = riskEngineService.calculateRisk(activity, {
    id: `chk-${activity.id}`,
    activityId: activity.id,
    estimatedPercent: activity.actualPercentComplete,
    confidenceScore: 1,
    source: 'MANUAL',
    timestamp: new Date(),
  });

  const downstreamImpacts = riskEngineService.analyzeDownstreamImpact(activity.id, activities, dependencies);
  const impactedActivities = activities.filter((a) => downstreamImpacts.includes(a.id));

  const evidenceHistory = [
    { date: 'Aug 28', type: 'PHOTO', progress: 35, note: 'Initial site trench layout survey approved.', status: 'VERIFIED' },
    { date: 'Aug 29', type: 'REPORT', progress: 48, note: 'Excavation of main trench complete.', status: 'VERIFIED' },
    { date: 'Aug 30', type: 'PHOTO', progress: activity.actualPercentComplete, note: 'Drainage pipe installation in progress.', status: 'INSPECTION' },
  ];

  const handlePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitRecoveryPlan({
      activityId: activity.id,
      contractorId: user?.name || 'BuildRight Infra Ltd',
      proposedRecoveryDays: Number(recoveryDays),
      resourceChanges: resourcePlan,
      justification,
    });
    setSubmittedPlan(true);
    setShowPlanModal(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50" onClick={() => router.push('/contractor')}>
          <ArrowLeft className="w-4 h-4" />
          Back to Contractor Overview
        </Button>
        <div className="flex items-center gap-3">
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
              risk.level === 'CRITICAL'
                ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 ring-1 ring-red-500/30'
                : risk.level === 'MODERATE'
                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 ring-1 ring-amber-500/30'
                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 ring-1 ring-emerald-500/30'
            }`}
          >
            {risk.level} RISK
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                    {activity.code}
                  </span>
                  <CardTitle className="text-2xl mt-1">{activity.name}</CardTitle>
                </div>
                {activity.isCriticalPath && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 uppercase">
                    Critical Path (Zero Slack)
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl border border-zinc-100 dark:border-zinc-800">
                  <p className="text-xs text-zinc-400 mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Planned Start
                  </p>
                  <p className="text-sm font-semibold">{new Date(activity.plannedStart).toLocaleDateString()}</p>
                </div>
                <div className="p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl border border-zinc-100 dark:border-zinc-800">
                  <p className="text-xs text-zinc-400 mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Planned Finish
                  </p>
                  <p className="text-sm font-semibold">{new Date(activity.plannedFinish).toLocaleDateString()}</p>
                </div>
                <div className="p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl border border-zinc-100 dark:border-zinc-800">
                  <p className="text-xs text-zinc-400 mb-1">Current Progress</p>
                  <p className="text-base font-bold text-blue-600 dark:text-blue-400">{activity.actualPercentComplete}%</p>
                </div>
                <div className="p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl border border-zinc-100 dark:border-zinc-800">
                  <p className="text-xs text-zinc-400 mb-1">Remaining Float</p>
                  <p className={`text-base font-bold ${activity.remainingFloat <= 0 ? 'text-red-600' : 'text-zinc-700 dark:text-zinc-300'}`}>
                    {activity.remainingFloat} days
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">Execution Variance</span>
                  <span className="text-xs text-zinc-500 font-medium">
                    Actual: {activity.actualPercentComplete}% | Planned: {activity.plannedPercentComplete}%
                  </span>
                </div>
                <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-3 overflow-hidden p-0.5 border">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      risk.level === 'CRITICAL' ? 'bg-red-500' :
                      risk.level === 'MODERATE' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, activity.actualPercentComplete)}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Evidence History */}
          <Card>
            <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Clock className="w-4 h-4 text-zinc-400" />
                Evidence History & Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {evidenceHistory.map((entry, i) => (
                  <div key={i} className="flex items-start gap-3 p-3.5 border rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-lg shrink-0">
                      {entry.type === 'PHOTO' ? <Camera className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{entry.date}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                          {entry.status}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400">{entry.note}</p>
                      <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">Completion: {entry.progress}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Actions & Impact */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                Risk Analysis Engine
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div
                className={`p-4 rounded-xl border-2 ${
                  risk.level === 'CRITICAL'
                    ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20'
                    : risk.level === 'MODERATE'
                    ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20'
                    : 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-sm tracking-wide">{risk.level} RISK</span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {risk.trigger}
                </p>
              </div>

              {submittedPlan ? (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>Recovery Plan submitted! +{recoveryDays} days buffer requested. Gov Official notified.</span>
                </div>
              ) : (
                <Button className="w-full gap-2 font-medium" onClick={() => setShowPlanModal(true)}>
                  <Wrench className="w-4 h-4" />
                  Submit Recovery Plan
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Downstream Impact Card */}
          <Card>
            <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Layers className="w-4 h-4 text-zinc-400" />
                Downstream Impact ({impactedActivities.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 pt-4">
              {impactedActivities.length === 0 ? (
                <p className="text-xs text-zinc-500">No downstream successors impacted.</p>
              ) : (
                impactedActivities.map((succ) => (
                  <div key={succ.id} className="p-3 border rounded-xl flex items-center justify-between text-xs bg-zinc-50/50 dark:bg-zinc-800/40">
                    <div>
                      <p className="font-semibold text-zinc-900 dark:text-zinc-100">{succ.name}</p>
                      <p className="text-[10px] text-zinc-400">{succ.code}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300">
                      Ripple Delay
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recovery Plan Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-lg">Submit Schedule Recovery Plan</h3>
                <p className="text-xs text-zinc-500">Formally notify Government Authority of mitigation measures</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowPlanModal(false)}>✕</Button>
            </div>

            <form onSubmit={handlePlanSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Activity</label>
                <input
                  type="text"
                  disabled
                  value={`${activity.code} - ${activity.name}`}
                  className="w-full p-2 border rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Target Days to Recover</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={recoveryDays}
                  onChange={(e) => setRecoveryDays(Number(e.target.value))}
                  className="w-full p-2 border rounded-lg text-sm font-bold"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Resource Mobilization</label>
                <textarea
                  value={resourcePlan}
                  onChange={(e) => setResourcePlan(e.target.value)}
                  className="w-full p-2 border rounded-lg text-xs h-20"
                  placeholder="Specify equipment, manpower, or overtime shifts..."
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Justification / Technical Basis</label>
                <textarea
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  className="w-full p-2 border rounded-lg text-xs h-16"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowPlanModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="gap-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  Submit Recovery Commitment
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
