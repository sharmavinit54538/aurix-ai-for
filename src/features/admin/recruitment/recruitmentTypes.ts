import type {
  Candidate,
  Interview,
  Interviewer,
  Job,
  Offer,
  ScreeningResult,
  ScreeningResultsData,
  ScreeningRun,
  ScreeningThresholds,
} from "./types";

export interface RecruitmentResources {
  jobs: Job[];
  candidates: Candidate[];
  interviews: Interview[];
  offers: Offer[];
}

export interface RecruitmentState extends RecruitmentResources {
  loading: boolean;
  lastFetchedAt: number | null;
  submitting: boolean;
  error: string | null;
  // AI Screening State
  screeningThresholds: ScreeningThresholds | null;
  screeningJobId: string | null;
  screeningRun: ScreeningRun | null;
  screeningResults: ScreeningResult[];
  screeningLoading: boolean;
  screeningSubmitting: boolean;
  screeningError: string | null;
  // Interviews State
  interviewPagination: { total: number; page: number; limit: number } | null;
  interviewers: Interviewer[];
  interviewLoading: boolean;
  interviewSubmitting: boolean;
  interviewError: string | null;
}

export type RecruitmentDataPayload = RecruitmentResources;
export type { ScreeningThresholds, ScreeningRun, ScreeningResult, ScreeningResultsData, Interviewer };

