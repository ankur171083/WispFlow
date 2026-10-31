export type SkillStatus = 'mastered' | 'adjacent' | 'critical_gap';
export type SkillCategory = 'Languages' | 'Distributed Systems' | 'Cloud & Infra' | 'System Design' | 'Databases';

export interface SkillNode {
  id: string;
  name: string;
  category: SkillCategory;
  status: SkillStatus;
  marketFrequency: number; // 0.0 - 1.0 (recurrence in target JDs)
  demonstratedProof?: string;
  prerequisites?: string[];
  description: string;
}

export interface JobDescription {
  id: string;
  company: string;
  role: string;
  stage: 'Seed / Series A' | 'Series B-D' | 'Public / FAANG';
  location: string;
  requiredSkills: string[];
  preferredSkills: string[];
  matchScore: number; // 0 - 100
  snippet: string;
}

export interface LearningResource {
  id: string;
  title: string;
  type: 'RFC' | 'Documentation' | 'Whitepaper' | 'Benchmark Repo';
  url: string;
  readTime: string;
}

export interface RoadmapWeek {
  weekNumber: number;
  title: string;
  focusSkillId: string;
  objective: string;
  deliverable: string;
  deliverableType: string;
  estimatedHours: number;
  completed: boolean;
  resources: LearningResource[];
  selfCheckQuestions: string[];
}

export interface PortfolioProject {
  id: string;
  title: string;
  tagline: string;
  targetedGaps: string[];
  architectureSummary: string;
  techStack: string[];
  mvpRequirements: string[];
  stretchFeatures: string[];
  recruiterDemoHook: string;
  readmeMarkdown: string;
}

export interface MockQuestion {
  id: string;
  roleCategory: string;
  prompt: string;
  context: string;
  interviewerAudioText: string;
  idealRubricPoints: string[];
}

export interface RubricEvaluation {
  overallScore: number;
  technicalAccuracy: number;
  tradeoffDepth: number;
  communicationBrevity: number;
  structuralClarity: number;
  strengths: string[];
  criticalGaps: string[];
  staffEngineerPhrasing: string;
}

export type ApplicationStage = 'Wishlist' | 'Applied' | 'Screening' | 'Technical Round' | 'Offer' | 'Rejected';

export interface ApplicationItem {
  id: string;
  company: string;
  role: string;
  stage: ApplicationStage;
  companyType: 'Seed / Series A' | 'Series B-D' | 'Public / FAANG';
  resumeVariantId: string;
  appliedDate: string;
  responseDays?: number;
  autopsyNotes?: string;
  keySkills: string[];
}

export interface ResumeVariant {
  id: string;
  name: string;
  tagline: string;
  targetFocus: string;
  activeApplicationsCount: number;
  interviewConversionRate: number; // percentage
}

export interface UserProfileState {
  name: string;
  title: string;
  targetRole: string;
  targetSeniority: string;
  weeklyHoursBudget: number;
  marketReadinessIndex: number; // 0 - 100
  voiceAspirationTranscript: string;
}
