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
}

export type InterviewStatus = "scheduled" | "completed" | "cancelled" | "no-show";

export interface Interview {
  id: ID;
  candidateId: ID;
  candidateName: string;
  jobTitle: string;
  interviewer: string;
  round: string;
  date: string; // ISO datetime
  durationMins: number;
  meetingLink: string;
  status: InterviewStatus;
  rating?: number;
  feedback?: string;
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
