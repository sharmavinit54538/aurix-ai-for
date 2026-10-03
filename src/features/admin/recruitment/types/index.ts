export type ID = string;

export type JobStatus = "active" | "draft" | "closed" | "archived";
export type EmploymentType = "Full-time" | "Part-time" | "Contract" | "Internship" | "Temporary";
export type WorkMode = "Remote" | "Hybrid" | "Onsite";

export interface Job {
  id: ID;
  title: string;
  department: string;
  employmentType: EmploymentType;
  experience: string;
  skills: string[];
  salaryMin: number;
  salaryMax: number;
  currency: string;
  vacancies: number;
  location: string;
  workMode: WorkMode;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  hiringManager: string;
  recruiter: string;
  status: JobStatus;
  publishedAt: string;
  closingAt: string;
  applicants: number;
}

export type Stage =
  | "applied"
  | "screening"
  | "assessment"
  | "interview"
  | "technical"
  | "hr"
  | "offer"
  | "hired"
  | "rejected";

export const STAGES: Stage[] = [
  "applied",
  "screening",
  "assessment",
  "interview",
  "technical",
  "hr",
  "offer",
  "hired",
  "rejected",
];

export const STAGE_LABEL: Record<Stage, string> = {
  applied: "Applied",
  screening: "Screening",
  assessment: "Assessment",
  interview: "Interview",
  technical: "Technical Round",
  hr: "HR Round",
  offer: "Offer",
  hired: "Hired",
  rejected: "Rejected",
};

export interface CandidateExperience {
  company: string;
  role: string;
  start: string;
  end: string;
  highlights: string[];
}

export interface CandidateEducation {
  school: string;
  degree: string;
  start: string;
  end: string;
}

export interface CandidateProject {
  name: string;
  description: string;
  tech: string[];
}

export interface InterviewFeedback {
  interviewer: string;
  round: string;
  rating: number;
  notes: string;
  date: string;
}

export interface TimelineItem {
  id: ID;
  at: string;
  kind: "stage" | "note" | "interview" | "offer" | "email" | "system";
  title: string;
  detail?: string;
  actor?: string;
}

export interface CandidateApplication {
  id: ID;
  jobId: ID;
  stage: Stage;
  appliedPosition?: string;
  appliedAt?: string;
}

export interface Candidate {
  id: ID;
  name: string;
  email: string;
  phone: string;
  photoUrl?: string;
  location: string;
  jobId: ID;
  applicationId?: ID;
  appliedPosition: string;
  stage: Stage;
  atsScore: number | null;
  jobMatch: number | null;
  source: string;
  tags: string[];
  skills: string[];
  yearsExperience: number;
  currentCompany?: string;
  currentRole?: string;
  expectedSalary?: number;
  noticeDays?: number;
  vendorId?: ID;
  resumeName: string;
  summary: string;
  experience: CandidateExperience[];
  education: CandidateEducation[];
  projects: CandidateProject[];
  certifications: string[];
  languages: string[];
  feedback: InterviewFeedback[];
  notes: { id: ID; at: string; author: string; text: string }[];
  documents: { name: string; type: string }[];
  timeline: TimelineItem[];
  appliedAt: string;
  applications?: CandidateApplication[];
}

export type InterviewStatus =
  | "PENDING_SCHEDULE"
  | "SCHEDULED"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW"
  | "scheduled"
  | "completed"
  | "cancelled"
  | "no-show";

export type InterviewRecommendation = "PASS" | "REJECT" | "HOLD";
export type InterviewMode = "ONLINE" | "OFFLINE";

export interface Interviewer {
  id: ID;
  name: string;
  email?: string;
  role?: string;
}

export interface Interview {
  id: ID;
  interviewId: ID;
  roundId: ID;
  scheduleId: ID | null;
  applicationId: ID;
  candidateId: ID;
  candidateName: string;
  candidateEmail?: string;
  jobId: ID;
  jobTitle: string;
  round: string;
  interviewerId: ID | null;
  interviewer: string;
  date: string | null; // ISO datetime or null if not scheduled
  durationMins: number;
  timezone?: string;
  mode: InterviewMode;
  meetingLink: string | null;
  officeAddress?: string | null;
  status: InterviewStatus;
  isOverdue?: boolean;
  rating?: number | null;
  recommendation?: InterviewRecommendation | null;
  feedback?: string | null;
  cancelledReason?: string | null;
  createdAt?: string;
  notes?: string;
}

export type OfferStatus = "draft" | "pending-approval" | "sent" | "accepted" | "declined" | "expired";

export interface Offer {
  id: ID;
  applicationId?: ID;
  candidateId: ID;
  candidateName: string;
  jobId: ID;
  jobTitle: string;
  salary: number;
  currency: string;
  joiningDate: string;
  benefits: string[];
  status: OfferStatus;
  sentAt?: string;
  respondedAt?: string;
  approvals: { stage: string; by: string; at: string; status: "pending" | "approved" | "rejected" }[];
}

export interface ScreeningThresholds {
  shortlist: number;
  reject: number;
}

export type ScreeningDecision = "SHORTLIST" | "REVIEW" | "REJECT";
export type HumanDecision = "SHORTLIST" | "REJECT" | "KEEP_REVIEW";
export type ScreeningStatus = "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";

export interface ScreeningResult {
  id: ID;
  screeningId?: ID;
  applicationId: ID;
  candidateId: ID;
  candidateName: string;
  status: ScreeningStatus;
  error?: string | null;
  decision: ScreeningDecision | null;
  confidence: number;
  matchScore: number;
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  redFlags: string[];
  greenFlags: string[];
  hiringRecommendation: string;
  hrNotes: string;
  questionsToAsk: string[];
  modelUsed: string;
  screenedAt: string | null;
  humanDecision: HumanDecision | null;
  humanDecisionBy: string | null;
  humanDecisionReason: string | null;
  humanDecidedAt?: string | null;
}

export interface ScreeningRun {
  runId: string;
  status: string;
  completed: number;
  total: number;
}

export interface ScreeningResultsData {
  thresholds: ScreeningThresholds | null;
  run: ScreeningRun | null;
  results: ScreeningResult[];
}

export interface CandidateWithScreening extends Candidate {
  screening?: ScreeningResult;
  calculatedScore?: number;
  decisionCategory?: "shortlisted" | "review" | "rejected" | "unscreened";
}

