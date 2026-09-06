'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Camera, Upload, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { visionAnalysisService } from '@/services/ai/VisionAnalysisService';
import { scheduleService } from '@/services/schedule/ScheduleService';
import { riskEngineService } from '@/services/risk/RiskEngineService';
import { auditService } from '@/services/audit/AuditService';
import { useAuthStore } from '@/store/useAuthStore';
import { useNotificationStore } from '@/store/useNotificationStore';

export default function CapturePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [step, setStep] = useState<'upload' | 'analyzing' | 'result'>('upload');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setStep('analyzing');
        processImage();
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async () => {
    setAnalyzing(true);
    try {
      // Using 'act-3' for demo purposes to trigger the critical delay scenario
      const analysis = await visionAnalysisService.analyzePhoto('mock-url', 'act-3');

      auditService.logEvent({
        userId: user?.id || 'system',
        action: 'AI_ESTIMATION',
        entityId: 'act-3',
        details: `AI estimated ${analysis.estimatedProgress}% completion.`,
      });

      setResult(analysis);
      setStep('result');
    } catch (error) {
      console.error('Analysis failed', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleConfirmSubmit = async (verifiedProgress: number) => {
    const activityId = 'act-3';

    // 1. Update Schedule
    await scheduleService.updateActivityProgress(activityId, verifiedProgress);

    // 2. Log verification
    auditService.logEvent({
      userId: user?.id || 'system',
      action: 'VERIFY_PROGRESS',
      entityId: activityId,
      details: `Engineer verified progress as ${verifiedProgress}%.`,
    });

    // 3. Calculate Risk
    const activities = await scheduleService.getActivitiesForProject('proj-1');
    const activity = activities.find(a => a.id === activityId)!;
    const dependencies = await scheduleService.getDependenciesForProject('proj-1');

    const risk = riskEngineService.calculateRisk(activity, {
      activityId,
      estimatedPercent: verifiedProgress,
      confidenceScore: 1,
      source: 'MANUAL',
      timestamp: new Date(),
    });

    // 4. Log risk change
    auditService.logEvent({
      userId: 'system',
      action: 'STATUS_CHANGE',
      entityId: activityId,
      details: `Risk status changed to ${risk.level}. ${risk.trigger}`,
    });

    // 5. Trigger Notification if Critical
    if (risk.level === 'CRITICAL') {
      addNotification({
        userId: 'gov-1',
        title: 'CRITICAL DELAY DETECTED',
        message: `Activity ${activity.name} is now critical. Downstream impact likely.`,
        priority: 'URGENT',
        read: false,
      });

      auditService.logEvent({
        userId: 'system',
        action: 'NOTIFICATION_SENT',
        entityId: activityId,
        details: 'Urgent alert sent to Government Official.',
      });
    }

    router.push('/engineer');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
        &larr; Back to Work
      </Button>

      {step === 'upload' && (
        <Card>
          <CardHeader>
            <CardTitle>Capture Site Evidence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl p-12 text-center space-y-4">
              <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                <Camera className="w-8 h-8 text-zinc-500" />
              </div>
              <div>
                <p className="font-medium">Upload site photo</p>
                <p className="text-sm text-zinc-500">Take a photo or upload an image from your gallery</p>
              </div>
              <div className="flex gap-3">
                <label
                  className={cn(buttonVariants({ variant: 'default' }), "cursor-pointer flex items-center justify-center gap-2")}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                </label>
                <Button variant="outline" className="gap-2">
                  <Camera className="w-4 h-4 mr-2" />
                  Use Camera
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'analyzing' && (
        <Card>
          <CardHeader>
            <CardTitle>AI Intelligence Analysis</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12 space-y-6">
            <div className="relative">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold">AI</span>
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="font-medium text-lg">Analyzing site evidence...</p>
              <div className="flex flex-col gap-2 text-sm text-zinc-500">
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                  Image received
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                  Activity identified: Drainage Installation
                </p>
                <p className="flex items-center gap-2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Estimating progress...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'result' && result && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Analysis Result</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/2">
                  {image && <img src={image} alt="Evidence" className="rounded-lg w-full h-64 object-cover border" />}
                </div>
                <div className="w-full md:w-1/2 space-y-4">
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-zinc-500">AI Estimated Progress</span>
                      <span className="text-2xl font-bold text-primary">{result.estimatedProgress}%</span>
                    </div>
                    <div className="w-full bg-zinc-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: `${result.estimatedProgress}%` }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-zinc-400">
                      <span>Confidence: {result.confidence * 100}%</span>
                      <span>Status: PARTIALLY COMPLETE</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Detected Objects:</p>
                    <div className="flex flex-wrap gap-2">
                      {result.detectedObjects.map((obj: string) => (
                        <span key={obj} className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded border">{obj}</span>
                      ))}
                    </div>
                  </div>
                  {result.anomalies.length > 0 && (
                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex gap-2 text-amber-700 dark:text-amber-400">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <p className="text-xs">{result.anomalies[0]}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Engineer Verification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Verify progress estimate</p>
                  <p className="text-xs text-zinc-500">AI suggested {result.estimatedProgress}%</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    id="verified-progress"
                    defaultValue={result.estimatedProgress}
                    className="w-20 p-2 border rounded text-center font-bold"
                  />
                  <span className="font-bold">%</span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep('upload')}>Retake Photo</Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    const input = document.getElementById('verified-progress') as HTMLInputElement;
                    handleConfirmSubmit(Number(input.value));
                  }}
                >
                  Confirm & Submit
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
