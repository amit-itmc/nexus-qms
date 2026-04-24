export type UserRole = 'Admin' | 'QA' | 'Manager' | 'User';

export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  role: UserRole;
  createdAt: any;
}

export type DeviationCategory = 'Minor' | 'Major' | 'Critical';
export type DeviationStatus = 'Draft' | 'Open' | 'Investigation' | 'QA Review' | 'Closed';

export interface Deviation {
  id: string;
  title: string;
  description: string;
  category: DeviationCategory;
  status: DeviationStatus;
  rootCause?: string;
  rcaData?: {
    type: '5whys' | 'fishbone';
    data: any;
  };
  riskImpact?: string;
  attachments: string[];
  createdBy: string;
  createdAt: any;
  updatedAt: any;
  closedAt?: any;
  slaDeadline: any;
}

export type CCStatus = 'Initiated' | 'Impact Assessment' | 'In Review' | 'Approved' | 'Implementation' | 'Post-Review' | 'Closed';
export type CCType = 'Temporary' | 'Permanent' | 'Emergency';

export interface ChangeControl {
  id: string;
  title: string;
  description: string;
  type: CCType;
  status: CCStatus;
  impactQuality: string;
  impactRegulatory: string;
  impactCost: string;
  milestones: any[];
  createdBy: string;
  createdAt: any;
  updatedAt: any;
}

export type CAPAStatus = 'Open' | 'In Progress' | 'Verification' | 'Closed';
export type CAPAType = 'Correction' | 'Corrective Action' | 'Preventive Action';

export interface CAPA {
  id: string;
  title: string;
  description: string;
  type: CAPAType;
  ownerId: string;
  dueDate: any;
  status: CAPAStatus;
  effectivenessScore?: number;
  isRecurrent: boolean;
  linkedId?: string;
  createdBy: string;
  createdAt: any;
  updatedAt: any;
}

export interface Risk {
  id: string;
  title: string;
  description: string;
  severity: number;
  probability: number;
  score: number;
  mitigationPlan: string;
  status: 'Open' | 'Mitigated' | 'Monitoring' | 'Closed';
  createdBy: string;
  createdAt: any;
}
