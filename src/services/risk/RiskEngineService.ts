import { Activity, ProgressUpdate, RiskAssessment } from '@/types';

export interface IRiskEngineService {
  calculateRisk(activity: Activity, progressUpdate: ProgressUpdate): RiskAssessment;
  analyzeDownstreamImpact(activityId: string, activities: Activity[], dependencies: any[]): string[];
}

export class RiskEngineService implements IRiskEngineService {
  calculateRisk(activity: Activity, progressUpdate: ProgressUpdate): RiskAssessment {
    const { actualPercentComplete, remainingFloat, isCriticalPath } = activity;
    const { estimatedPercent } = progressUpdate;

    // Use the most recent estimate (AI or Manual)
    const currentProgress = Math.max(actualPercentComplete, estimatedPercent);
    const plannedProgress = activity.plannedPercentComplete;

    let level: 'LOW' | 'MODERATE' | 'CRITICAL' = 'LOW';
    let trigger = 'Progress is on track.';

    if (currentProgress < plannedProgress) {
      if (remainingFloat < 2 || isCriticalPath) {
        level = 'CRITICAL';
        trigger = `Critical path activity delayed. Remaining float: ${remainingFloat} days.`;
      } else if (remainingFloat <= 10) {
        level = 'MODERATE';
        trigger = `Activity delayed. Buffer remaining: ${remainingFloat} days.`;
      } else {
        level = 'LOW';
        trigger = `Activity delayed, but significant buffer remains (${remainingFloat} days).`;
      }
    }

    return {
      id: `risk-${Date.now()}`,
      activityId: activity.id,
      level,
      trigger,
      timestamp: new Date(),
    };
  }

  analyzeDownstreamImpact(activityId: string, activities: Activity[], dependencies: any[]): string[] {
    const impacted: string[] = [];
    const queue = [activityId];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      if (visited.has(currentId)) continue;
      visited.add(currentId);

      // Find all successors
      const successors = dependencies
        .filter(dep => dep.predecessorId === currentId)
        .map(dep => dep.successorId);

      for (const succId of successors) {
        impacted.push(succId);
        queue.push(succId);
      }
    }

    return impacted;
  }
}

export const riskEngineService = new RiskEngineService();
