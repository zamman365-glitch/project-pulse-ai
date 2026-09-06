import { Activity, ActivityDependency } from '@/types';
import { MOCK_ACTIVITIES, MOCK_DEPENDENCIES } from '@/lib/mock-data';

export interface IScheduleService {
  getActivitiesForProject(projectId: string): Promise<Activity[]>;
  getDependenciesForProject(projectId: string): Promise<ActivityDependency[]>;
  updateActivityProgress(activityId: string, progress: number): Promise<void>;
}

export class MockScheduleService implements IScheduleService {
  private activities = [...MOCK_ACTIVITIES];
  private dependencies = [...MOCK_DEPENDENCIES];

  async getActivitiesForProject(projectId: string): Promise<Activity[]> {
    return this.activities.filter(a => a.projectId === projectId);
  }

  async getDependenciesForProject(projectId: string): Promise<ActivityDependency[]> {
    // For now, return all dependencies as they belong to the one mock project
    return this.dependencies;
  }

  async updateActivityProgress(activityId: string, progress: number): Promise<void> {
    const activity = this.activities.find(a => a.id === activityId);
    if (activity) {
      activity.actualPercentComplete = progress;
    }
  }
}

export const scheduleService = new MockScheduleService();
