import { AuditEvent } from '@/types';

export interface IAuditService {
  logEvent(event: Omit<AuditEvent, 'id' | 'timestamp'>): AuditEvent;
  getEvents(): AuditEvent[];
  getEventsForEntity(entityId: string): AuditEvent[];
}

export class AuditService implements IAuditService {
  private events: AuditEvent[] = [];

  logEvent(event: Omit<AuditEvent, 'id' | 'timestamp'>): AuditEvent {
    const newEvent: AuditEvent = {
      ...event,
      id: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date(),
    };
    this.events.push(newEvent);
    console.log('[AuditLog]', newEvent);
    return newEvent;
  }

  getEvents(): AuditEvent[] {
    return [...this.events].reverse();
  }

  getEventsForEntity(entityId: string): AuditEvent[] {
    return this.events
      .filter(e => e.entityId === entityId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
}

export const auditService = new AuditService();
