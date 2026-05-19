export interface MandateData {
  companyName: string;
  website: string;
  coid: string;
  address: string;
  contactName: string;
  contactMail: string;
  auditType: string;
  referential: string;
  auditWindow: string;
  scope: string;
  exclusion: string;
  productExamples: string;
  technologySectors: string;
  processSteps: string;
  auditOrganization: string;
  duration: number;
  dates: string;
  leadAuditor: string;
}

export interface Activity {
  id: string;
  time: string;
  chapterIFS: string;
  chapterBRC?: string;
  description: string;
  duration: number;
  isOnSite: boolean;
  isFixed: boolean;
  isTraceability: boolean;
  day: number;
  endTime?: string;
}

export interface DayPlan {
  day: number;
  label: string;
  date?: string;
  activities: Activity[];
}

export interface AuditPlan {
  mandate: MandateData;
  referentialType: 'IFS' | 'IFS+BRC';
  isAnnounced: boolean;
  durationDays: number;
  days: DayPlan[];
  traceabilityMarker?: {
    day: number;
    time: string;
    dayLabel: string;
  };
}

export interface ValidationResult {
  type: 'error' | 'warning' | 'success';
  message: string;
  icon: string;
}

export interface TemplateConfig {
  referentialType: 'IFS' | 'IFS+BRC';
  isAnnounced: boolean;
  durationDays: number;
}

export type AppStep = 'upload' | 'preview' | 'configure' | 'edit' | 'generate';
