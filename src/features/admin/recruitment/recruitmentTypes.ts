import type { Candidate, Interview, Job, Offer } from "./types";

export interface RecruitmentResources {
  jobs: Job[];
  candidates: Candidate[];
  interviews: Interview[];
  offers: Offer[];
}

export interface RecruitmentState extends RecruitmentResources {
  loading: boolean;
  submitting: boolean;
  error: string | null;
}

export type RecruitmentDataPayload = RecruitmentResources;
