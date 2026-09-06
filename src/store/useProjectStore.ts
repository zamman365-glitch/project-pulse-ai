import { create } from 'zustand';
import { Activity, ActivityDependency, AuditEvent, Grievance, RecoveryPlan } from '@/types';
import { MOCK_ACTIVITIES, MOCK_DEPENDENCIES } from '@/lib/mock-data';
import { riskEngineService } from '@/services/risk/RiskEngineService';
import { useNotificationStore } from './useNotificationStore';

const INITIAL_GRIEVANCES: Grievance[] = [
  {
    id: 'grv-1',
    trackingId: 'GRV-2026-0905-882',
    projectId: 'proj-1',
    citizenId: 'cit-1',
    citizenName: 'Suresh Iyer',
    contactInfo: 'suresh.iyer@gmail.com',
    category: 'ROAD_ACCESS',
    description: 'Construction debris is blocking the main entrance to residential colony in Sector 4.',
    status: 'OPEN',
    priority: 'HIGH',
    timestamp: new Date(Date.now() - 86400000),
  },
  {
    id: 'grv-2',
    trackingId: 'GRV-2026-0904-122',
    projectId: 'proj-1',
    citizenId: 'cit-2',
    citizenName: 'Meera Rao',
    contactInfo: 'meera.r@outlook.com',
    category: 'NOISE',
    description: 'Excessive concrete vibrator noise after 11 PM near hospital zone.',
    status: 'RESOLVED',
    priority: 'LOW',
    timestamp: new Date(Date.now() - 172800000),
  },
];

const INITIAL_AUDIT_EVENTS: AuditEvent[] = [
  {
    id: 'evt-init-1',
    userId: 'system',
    action: 'SYSTEM_BOOT',
    entityId: 'proj-1',
    details: 'Project baseline P6 schedule imported: Urban Road & Drainage Improvement.',
    timestamp: new Date(Date.now() - 259200000),
  },
  {
    id: 'evt-init-2',
    userId: 'eng-1',
    action: 'VERIFY_PROGRESS',
    entityId: 'act-2',
    details: 'Excavation Phase 1 verified at 100% completion.',
    timestamp: new Date(Date.now() - 172800000),
  },
  {
    id: 'evt-init-3',
    userId: 'cit-1',
    action: 'GRIEVANCE_SUBMITTED',
    entityId: 'grv-1',
    details: 'Citizen Suresh Iyer reported road blockage in Sector 4 (GRV-2026-0905-882).',
    timestamp: new Date(Date.now() - 86400000),
  },
];

interface ProjectState {
  activities: Activity[];
  dependencies: ActivityDependency[];
  grievances: Grievance[];
  auditEvents: AuditEvent[];
  recoveryPlans: RecoveryPlan[];

  // Actions
  updateActivityProgress: (
    activityId: string,
    progress: number,
    engineerId?: string,
    notes?: string
  ) => void;
  submitGrievance: (
    data: Omit<Grievance, 'id' | 'timestamp' | 'status'>
  ) => string;
  resolveGrievance: (grievanceId: string, officialName?: string) => void;
  approveProgress: (activityId: string, officialName: string) => void;
  rejectProgress: (activityId: string, officialName: string, reason: string) => void;
  submitRecoveryPlan: (plan: Omit<RecoveryPlan, 'id' | 'submittedAt' | 'status'>) => void;
  logAuditEvent: (event: Omit<AuditEvent, 'id' | 'timestamp'>) => void;
  resetDemoData: () => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  activities: JSON.parse(JSON.stringify(MOCK_ACTIVITIES)).map((act: any) => ({
    ...act,
    plannedStart: new Date(act.plannedStart),
    plannedFinish: new Date(act.plannedFinish),
    actualStart: act.actualStart ? new Date(act.actualStart) : undefined,
    actualFinish: act.actualFinish ? new Date(act.actualFinish) : undefined,
  })),
  dependencies: [...MOCK_DEPENDENCIES],
  grievances: [...INITIAL_GRIEVANCES],
  auditEvents: [...INITIAL_AUDIT_EVENTS],
  recoveryPlans: [],

  logAuditEvent: (event) => {
    const newEvent: AuditEvent = {
      ...event,
      id: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date(),
    };
    set((state) => ({
      auditEvents: [newEvent, ...state.auditEvents],
    }));
  },

  updateActivityProgress: (activityId, progress, engineerId = 'eng-1', notes) => {
    const state = get();
    const currentActivity = state.activities.find((a) => a.id === activityId);
    if (!currentActivity) return;

    // Calculate whether delay consumes float
    let updatedFloat = currentActivity.remainingFloat;
    if (progress < currentActivity.plannedPercentComplete) {
      const deficitPercent = currentActivity.plannedPercentComplete - progress;
      const daysLost = Math.ceil((deficitPercent / 100) * currentActivity.baselineDuration);
      updatedFloat = Math.max(-3, currentActivity.remainingFloat - Math.min(2, daysLost));
    }

    const updatedActivity: Activity = {
      ...currentActivity,
      actualPercentComplete: progress,
      remainingFloat: updatedFloat,
    };

    // Calculate risk
    const risk = riskEngineService.calculateRisk(updatedActivity, {
      id: `prog-${Date.now()}`,
      activityId,
      estimatedPercent: progress,
      confidenceScore: 0.95,
      source: 'MANUAL',
      timestamp: new Date(),
    });

    const updatedActivities = state.activities.map((a) =>
      a.id === activityId ? updatedActivity : a
    );

    // Prepare audit events
    const verifyEvent: AuditEvent = {
      id: `evt-${Date.now()}-1`,
      userId: engineerId,
      action: 'VERIFY_PROGRESS',
      entityId: activityId,
      details: `Site Engineer verified progress for ${currentActivity.name} at ${progress}% (Planned: ${currentActivity.plannedPercentComplete}%). ${notes || ''}`.trim(),
      timestamp: new Date(),
    };

    const riskEvent: AuditEvent = {
      id: `evt-${Date.now()}-2`,
      userId: 'system',
      action: 'STATUS_CHANGE',
      entityId: activityId,
      details: `Risk status flagged as ${risk.level}. ${risk.trigger}`,
      timestamp: new Date(),
    };

    // Trigger urgent notification if critical
    if (risk.level === 'CRITICAL') {
      useNotificationStore.getState().addNotification({
        userId: 'gov-1',
        title: 'CRITICAL DELAY DETECTED',
        message: `Activity ${currentActivity.name} progress fell to ${progress}%. Downstream schedule at risk!`,
        priority: 'URGENT',
        read: false,
      });
    }

    set({
      activities: updatedActivities,
      auditEvents: [riskEvent, verifyEvent, ...state.auditEvents],
    });
  },

  submitGrievance: (data) => {
    const trackingId = data.trackingId || `GRV-2026-0906-${Math.floor(100 + Math.random() * 900)}`;
    const newGrievance: Grievance = {
      ...data,
      id: `grv-${Date.now()}`,
      trackingId,
      status: 'OPEN',
      priority: data.priority || 'HIGH',
      timestamp: new Date(),
    };

    const auditEvent: AuditEvent = {
      id: `evt-${Date.now()}`,
      userId: data.citizenId || 'citizen',
      action: 'GRIEVANCE_SUBMITTED',
      entityId: newGrievance.id,
      details: `Citizen submitted ${data.category} grievance: "${data.description}". Tracking ID: ${trackingId}`,
      timestamp: new Date(),
    };

    useNotificationStore.getState().addNotification({
      userId: 'gov-1',
      title: 'NEW CITIZEN GRIEVANCE',
      message: `New ${data.category} complaint registered: ${data.description.slice(0, 60)}... [${trackingId}]`,
      priority: 'WARNING',
      read: false,
    });

    set((state) => ({
      grievances: [newGrievance, ...state.grievances],
      auditEvents: [auditEvent, ...state.auditEvents],
    }));

    return trackingId;
  },

  resolveGrievance: (grievanceId, officialName = 'Rajesh Kumar') => {
    const state = get();
    const grv = state.grievances.find((g) => g.id === grievanceId);
    if (!grv) return;

    const updatedGrievances = state.grievances.map((g) =>
      g.id === grievanceId ? { ...g, status: 'RESOLVED' as const } : g
    );

    const auditEvent: AuditEvent = {
      id: `evt-${Date.now()}`,
      userId: officialName,
      action: 'GRIEVANCE_RESOLVED',
      entityId: grievanceId,
      details: `Official ${officialName} marked grievance ${grv.trackingId || grv.id} as RESOLVED.`,
      timestamp: new Date(),
    };

    useNotificationStore.getState().addNotification({
      userId: grv.citizenId,
      title: 'GRIEVANCE RESOLVED',
      message: `Your grievance ${grv.trackingId || ''} has been reviewed and resolved by government administration.`,
      priority: 'INFO',
      read: false,
    });

    set({
      grievances: updatedGrievances,
      auditEvents: [auditEvent, ...state.auditEvents],
    });
  },

  approveProgress: (activityId, officialName) => {
    const state = get();
    const act = state.activities.find((a) => a.id === activityId);
    const auditEvent: AuditEvent = {
      id: `evt-${Date.now()}`,
      userId: officialName,
      action: 'PROGRESS_APPROVED',
      entityId: activityId,
      details: `Official ${officialName} approved field evidence for ${act?.name || activityId}.`,
      timestamp: new Date(),
    };

    useNotificationStore.getState().addNotification({
      userId: 'eng-1',
      title: 'FIELD REPORT APPROVED',
      message: `Progress report for ${act?.name || activityId} was verified and officially approved.`,
      priority: 'INFO',
      read: false,
    });

    set({
      auditEvents: [auditEvent, ...state.auditEvents],
    });
  },

  rejectProgress: (activityId, officialName, reason) => {
    const state = get();
    const act = state.activities.find((a) => a.id === activityId);
    const auditEvent: AuditEvent = {
      id: `evt-${Date.now()}`,
      userId: officialName,
      action: 'PROGRESS_REJECTED',
      entityId: activityId,
      details: `Official ${officialName} rejected field evidence for ${act?.name || activityId}. Reason: ${reason}`,
      timestamp: new Date(),
    };

    useNotificationStore.getState().addNotification({
      userId: 'eng-1',
      title: 'FIELD REPORT REJECTED',
      message: `Progress report for ${act?.name || activityId} was rejected. Note: ${reason}`,
      priority: 'WARNING',
      read: false,
    });

    set({
      auditEvents: [auditEvent, ...state.auditEvents],
    });
  },

  submitRecoveryPlan: (planData) => {
    const state = get();
    const act = state.activities.find((a) => a.id === planData.activityId);

    const newPlan: RecoveryPlan = {
      ...planData,
      id: `rec-${Date.now()}`,
      submittedAt: new Date(),
      status: 'SUBMITTED',
    };

    // Improve remaining float by proposed recovery days (up to 2 days)
    const updatedActivities = state.activities.map((a) =>
      a.id === planData.activityId
        ? {
            ...a,
            remainingFloat: a.remainingFloat + planData.proposedRecoveryDays,
          }
        : a
    );

    const auditEvent: AuditEvent = {
      id: `evt-${Date.now()}`,
      userId: planData.contractorId,
      action: 'RECOVERY_PLAN_SUBMITTED',
      entityId: planData.activityId,
      details: `Contractor submitted recovery plan for ${act?.name || planData.activityId}: Recover +${planData.proposedRecoveryDays} days by ${planData.resourceChanges}.`,
      timestamp: new Date(),
    };

    useNotificationStore.getState().addNotification({
      userId: 'gov-1',
      title: 'RECOVERY PLAN SUBMITTED',
      message: `Contractor proposed +${planData.proposedRecoveryDays}d recovery plan for ${act?.name || planData.activityId}.`,
      priority: 'INFO',
      read: false,
    });

    set({
      activities: updatedActivities,
      recoveryPlans: [newPlan, ...state.recoveryPlans],
      auditEvents: [auditEvent, ...state.auditEvents],
    });
  },

  resetDemoData: () => {
    set({
      activities: JSON.parse(JSON.stringify(MOCK_ACTIVITIES)).map((act: any) => ({
        ...act,
        plannedStart: new Date(act.plannedStart),
        plannedFinish: new Date(act.plannedFinish),
        actualStart: act.actualStart ? new Date(act.actualStart) : undefined,
        actualFinish: act.actualFinish ? new Date(act.actualFinish) : undefined,
      })),
      dependencies: [...MOCK_DEPENDENCIES],
      grievances: [...INITIAL_GRIEVANCES],
      auditEvents: [...INITIAL_AUDIT_EVENTS],
      recoveryPlans: [],
    });
    useNotificationStore.getState().clearAll();
  },
}));
