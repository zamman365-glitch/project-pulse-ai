'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Camera, Upload, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { visionAnalysisService } from '@/services/ai/VisionAnalysisService';
import { useProjectStore } from '@/store/useProjectStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useNotificationStore } from '@/store/useNotificationStore';

const SAMPLE_PRESETS = [
  {
    title: 'Sector 4 Trench (Scenario: Delay)',
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f7?auto=format&fit=crop&q=80&w=800',
    activityId: 'act-3',
  },
  {
    title: 'Excavation Junction (On Track)',
    url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800',
    activityId: 'act-2',
  },
];

export default function CapturePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { updateActivityProgress, logAuditEvent } = useProjectStore();
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [step, setStep] = useState<'upload' | 'analyzing' | 'result'>('upload');
  const [selectedActivityId, setSelectedActivityId] = useState('act-3');

  const handleSelectPreset = (preset: typeof SAMPLE_PRESETS[0]) => {
    setImage(preset.url);
    setSelectedActivityId(preset.activityId);
    setStep('analyzing');
    processImage(preset.activityId, preset.url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setImage(dataUrl);
        setStep('analyzing');
        processImage(selectedActivityId, dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (actId = 'act-3', photoUrl = 'mock-url') => {
    setAnalyzing(true);
    try {
      const analysis = await visionAnalysisService.analyzePhoto(photoUrl, actId);

      logAuditEvent({
        userId: user?.name || 'Site Engineer',
        action: 'AI_ESTIMATION',
        entityId: actId,
        details: `Computer Vision estimated ${analysis.estimatedProgress}% progress with ${(analysis.confidence * 100).toFixed(0)}% confidence. Objects: ${analysis.detectedObjects.join(', ')}.`,
      });

      setResult(analysis);
      setStep('result');
    } catch (error) {
      console.error('Analysis failed', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleConfirmSubmit = (verifiedProgress: number) => {
    // Updates activity progress in store, logs verification & status change, notifies Gov Official if critical
    updateActivityProgress(
      selectedActivityId,
      verifiedProgress,
      user?.name || 'Amit Sharma',
      `Field verification confirmed at ${verifiedProgress}%. AI estimate verified.`
    );

    router.push('/engineer');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button variant="ghost" className="mb-4 text-xs gap-2" onClick={() => router.push('/engineer')}>
        &larr; Back to Work List
      </Button>

      {step === 'upload' && (
        <Card className="shadow-lg border-zinc-200 dark:border-zinc-800">
          <CardHeader>
            <CardTitle className="text-xl">Capture Site Evidence</CardTitle>
            <p className="text-xs text-zinc-500">Upload site photos or choose a demo preset to test AI Vision analysis.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl p-10 text-center space-y-4 bg-zinc-50/50 dark:bg-zinc-900/30">
              <div className="p-4 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-full shadow-sm">
                <Camera className="w-8 h-8" />
              </div>
              <div>
                <p className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">Upload site survey photo</p>
                <p className="text-xs text-zinc-500 mt-1">Accepts JPG, PNG, or mobile camera capture</p>
              </div>
              <div className="flex flex-wrap gap-3 justify-center">
                <label
                  className={cn(buttonVariants({ variant: 'default' }), "cursor-pointer flex items-center justify-center gap-2 text-xs h-9")}
                >
                  <Upload className="w-4 h-4 mr-1.5" />
                  Select File
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                </label>
              </div>
            </div>

            {/* Quick Demo Presets */}
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Or Quick Test with Demo Scenario</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SAMPLE_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className="flex items-center gap-3 p-3 border rounded-xl hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 text-left transition-all group"
                  >
                    <img src={preset.url} alt={preset.title} className="w-12 h-12 rounded-lg object-cover border" />
                    <div>
                      <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 transition-colors">
                        {preset.title}
                      </p>
                      <span className="text-[10px] text-zinc-400">Click to analyze</span>
                    </div>
                  </button>
                ))}
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
