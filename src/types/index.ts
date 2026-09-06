export type UserRole = 'SITE_ENGINEER' | 'CONTRACTOR' | 'GOV_OFFICIAL' | 'CITIZEN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Project {
  id: string;
  name: string;
  location: string;
  baselineEndDate: Date;
  currentEndDate: Date;
  overallStatus: 'ON_TRACK' | 'AT_RISK' | 'CRITICAL';
  budget: number;
}

export interface Activity {
  id: string;
  projectId: string;
  code: string; // P6 Activity ID
  name: string;
  plannedStart: Date;
  plannedFinish: Date;
  actualStart?: Date;
  actualFinish?: Date;
  baselineDuration: number; // in days
  remainingFloat: number;  // Key for Risk Engine
  isCriticalPath: boolean;
  plannedPercentComplete: number;
  actualPercentComplete: number;
}

export interface ActivityDependency {
  id: string;
  predecessorId: string;
  successorId: string;
  type: 'FS' | 'SS' | 'FF' | 'SF'; // Finish-to-Start, etc.
  lag: number;
}

export interface FieldReport {
  id: string;
  activityId: string;
  engineerId: string;
  timestamp: Date;
  notes: string;
  status: 'SUBMITTED' | 'VERIFIED' | 'REJECTED';
}

export interface SitePhoto {
  id: string;
  reportId: string;
  url: string;
  timestamp: Date;
  metadata: {
    lat: number;
    lng: number;
    device: string;
  };
}

export interface ProgressUpdate {
  id: string;
  activityId: string;
  estimatedPercent: number;
  confidenceScore: number; // AI confidence
  source: 'MANUAL' | 'AI_VISION';
  timestamp: Date;
}

export interface DelayReport {
  id: string;
  activityId: string;
  reason: string;
  daysDelayed: number;
  isExcusable: boolean;
}

export interface RiskAssessment {
  id: string;
  activityId: string;
  level: 'LOW' | 'MODERATE' | 'CRITICAL';
  trigger: string; // e.g., "Float consumed > 80%"
  timestamp: Date;
}

export interface Grievance {
  id: string;
  projectId: string;
  citizenId: string;
  category: 'NOISE' | 'TRAFFIC' | 'ENVIRONMENT' | 'OTHER';
  description: string;
  status: 'OPEN' | 'IN_REVIEW' | 'RESOLVED';
  timestamp: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  priority: 'INFO' | 'WARNING' | 'URGENT';
  read: boolean;
  timestamp: Date;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isAiGenerated: boolean;
}

export interface AuditEvent {
  id: string;
  userId: string;
  action: string;
  entityId: string;
  oldValue?: any;
  newValue?: any;
  timestamp: Date;
}
