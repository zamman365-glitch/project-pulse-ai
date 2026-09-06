import { ProgressUpdate } from '@/types';

export interface VisionAnalysisResponse {
  estimatedProgress: number;
  detectedObjects: string[];
  confidence: number;
  anomalies: string[];
}

export interface IVisionAnalysisService {
  analyzePhoto(photoUrl: string, activityId: string): Promise<VisionAnalysisResponse>;
}

export class MockVisionAnalysisService implements IVisionAnalysisService {
  async analyzePhoto(photoUrl: string, activityId: string): Promise<VisionAnalysisResponse> {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Return deterministic results based on activityId for demo consistency
    if (activityId === 'act-3') {
      return {
        estimatedProgress: 60,
        detectedObjects: ['drainage pipes', 'concrete base', 'excavated trench'],
        confidence: 0.82,
        anomalies: ['Minor misalignment in pipe joint'],
      };
    }

    return {
      estimatedProgress: 85,
      detectedObjects: ['completed excavation', 'stabilized soil'],
      confidence: 0.91,
      anomalies: [],
    };
  }
}

export const visionAnalysisService = new MockVisionAnalysisService();
