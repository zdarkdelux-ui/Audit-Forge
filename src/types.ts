import { LucideIcon } from 'lucide-react';

export type Severity = 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';
export type IssueType = 'SEO' | 'UX' | 'CRO' | 'Content' | 'Technical' | 'Frontend' | 'Metadata' | 'Structure' | 'Images' | 'Forms' | 'Schema' | 'Internal linking';
export type IssueStatus = 'New' | 'In Progress' | 'Fixed' | 'Ignored' | 'Needs Review';

export interface Issue {
  id: string;
  auditId: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  url: string;
  location?: string;
  evidence?: string;
  type: IssueType;
  severity: Severity;
  impact?: string;
  recommendation: string;
  comment?: string;
  status: IssueStatus;
  responsible?: string;
  deadline?: string;
  createdAt: string;
  updatedAt: string;
  isSitewide?: boolean;
}

export interface Audit {
  id: string;
  projectName: string;
  domain: string;
  auditType: string;
  date: string;
  executor: string;
  client: string;
  comment?: string;
  status: 'Draft' | 'Sent' | 'Completed' | 'Archived';
  createdAt: string;
}

export interface AppState {
  audits: Audit[];
  issues: Issue[];
  currentAuditId: string | null;
}
