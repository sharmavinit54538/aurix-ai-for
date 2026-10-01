import type {
  Candidate,
  Interview,
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
  submitting: boolean;
  error: string | null;
  // AI Screening State
  screeningThresholds: ScreeningThresholds;
  screeningRun: ScreeningRun | null;
  screeningResults: ScreeningResult[];
  screeningLoading: boolean;
  screeningSubmitting: boolean;
  screeningError: string | null;
}

export type RecruitmentDataPayload = RecruitmentResources;
export type { ScreeningThresholds, ScreeningRun, ScreeningResult, ScreeningResultsData };

