import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  clearScreeningState,
  optimisticMoveStage,
  optimisticUpsertInterview,
} from "../recruitmentSlice";
import {
  addNote,
  archiveJob,
  deleteJob,
  duplicateJob,
  fetchJobById,
  fetchRecruitmentData,
  fetchScreeningResults,
  moveStage,
  runScreening,
  submitDecision,
  upsertCandidate,
  upsertInterview,
  upsertJob,
  upsertOffer,
} from "../recruitmentThunk";
import type { RecruitmentResources } from "../recruitmentTypes";
import type {
  Candidate,
  Interview,
  Job,
  Offer,
  ScreeningResult,
  ScreeningResultsData,
  ScreeningRun,
  ScreeningThresholds,
  Stage,
} from "../types";
import { newId } from "../utils/newId";

export { newId };

export interface UseRecruitmentReturn extends RecruitmentResources {
  loading: boolean;
  submitting: boolean;
  error: string | null;
  refreshAll: () => void;
  getJob: (id: string) => Promise<Job>;
  upsertJob: (job: Job) => Promise<unknown>;
  deleteJob: (id: string) => Promise<void>;
  archiveJob: (id: string) => Promise<void>;
  duplicateJob: (id: string) => Promise<void>;
  upsertCandidate: (candidate: Candidate) => Promise<void>;
  moveStage: (id: string, stage: Stage) => void;
  addNote: (candidateId: string, text: string) => void;
  upsertInterview: (interview: Interview) => Promise<void>;
  upsertOffer: (offer: Offer) => Promise<void>;
  // Screening state and actions
  screeningThresholds: ScreeningThresholds | null;
  screeningRun: ScreeningRun | null;
  screeningResults: ScreeningResult[];
  screeningLoading: boolean;
  screeningSubmitting: boolean;
  screeningError: string | null;
  clearScreeningState: () => void;
  runScreening: (params: {
    jobId: string;
    applicationIds?: string[];
    model?: string;
    force?: boolean;
  }) => Promise<ScreeningRun>;
  fetchScreeningResults: (jobId: string) => Promise<ScreeningResultsData>;
  submitDecision: (params: {
    screeningId: string;
    action: "SHORTLIST" | "REJECT" | "KEEP_REVIEW";
    reason?: string;
    jobId?: string;
  }) => Promise<ScreeningResult>;
}


function useRecruitmentBase() {
  const dispatch = useAppDispatch();
  const {
    jobs,
    candidates,
    interviews,
    offers,
    loading,
    lastFetchedAt,
    submitting,
    error,
    screeningThresholds,
    screeningRun,
    screeningResults,
    screeningLoading,
    screeningSubmitting,
    screeningError,
  } = useAppSelector((state) => state.recruitment);

  const shouldFetch =
    !loading &&
    (!lastFetchedAt || Date.now() - lastFetchedAt >= 30_000) &&
    jobs.length === 0 &&
    candidates.length === 0 &&
    interviews.length === 0 &&
    offers.length === 0;

  useEffect(() => {
    if (shouldFetch) {
      dispatch(fetchRecruitmentData());
    }
  }, [dispatch, shouldFetch]);

  const refreshAll = useCallback(() => {
    dispatch(fetchRecruitmentData({ force: true }));
  }, [dispatch]);

  const getJob = useCallback(
    async (id: string) => {
      const result = await dispatch(fetchJobById(id));
      if (fetchJobById.fulfilled.match(result)) return result.payload;
      throw new Error(result.payload ?? "Job not found");
    },
    [dispatch],
  );

  const upsertJobAction = useCallback(
    async (job: Job) => {
      const result = await dispatch(upsertJob(job));
      if (upsertJob.rejected.match(result)) throw new Error(result.payload ?? "Failed to save job");
      return result.payload;
    },
    [dispatch],
  );

  const deleteJobAction = useCallback(
    async (id: string) => {
      await dispatch(deleteJob(id));
    },
    [dispatch],
  );

  const archiveJobAction = useCallback(
    async (id: string) => {
      await dispatch(archiveJob(id));
    },
    [dispatch],
  );

  const duplicateJobAction = useCallback(
    async (id: string) => {
      await dispatch(duplicateJob(id));
    },
    [dispatch],
  );

  const upsertCandidateAction = useCallback(
    async (candidate: Candidate) => {
      const result = await dispatch(upsertCandidate(candidate));
      if (upsertCandidate.rejected.match(result)) {
        throw new Error(result.payload ?? "Failed to save candidate");
      }
    },
    [dispatch],
  );

  const moveStageAction = useCallback(
    (id: string, stage: Stage) => {
      dispatch(optimisticMoveStage({ id, stage }));
      dispatch(moveStage({ id, stage }));
    },
    [dispatch],
  );

  const addNoteAction = useCallback(
    (candidateId: string, text: string) => {
      dispatch(addNote({ candidateId, text }));
    },
    [dispatch],
  );

  const upsertInterviewAction = useCallback(
    async (interview: Interview) => {
      dispatch(optimisticUpsertInterview(interview));
      await dispatch(upsertInterview(interview));
    },
    [dispatch],
  );

  const upsertOfferAction = useCallback(
    async (offer: Offer) => {
      await dispatch(upsertOffer(offer));
    },
    [dispatch],
  );

  const runScreeningAction = useCallback(
    async (params: { jobId: string; applicationIds?: string[]; model?: string; force?: boolean }) => {
      const result = await dispatch(runScreening(params));
      if (runScreening.rejected.match(result)) {
        throw new Error(result.payload ?? "Failed to run screening");
      }
      return result.payload;
    },
    [dispatch],
  );

  const clearScreeningStateAction = useCallback(() => {
    dispatch(clearScreeningState());
  }, [dispatch]);

  const fetchScreeningResultsAction = useCallback(
    async (jobId: string) => {
      const result = await dispatch(fetchScreeningResults(jobId));
      if (fetchScreeningResults.rejected.match(result)) {
        throw new Error(result.payload ?? "Failed to fetch screening results");
      }
      return result.payload;
    },
    [dispatch],
  );

  const submitDecisionAction = useCallback(
    async (params: {
      screeningId: string;
      action: "SHORTLIST" | "REJECT" | "KEEP_REVIEW";
      reason?: string;
      jobId?: string;
    }) => {
      const result = await dispatch(submitDecision(params));
      if (submitDecision.rejected.match(result)) {
        throw new Error(result.payload ?? "Failed to submit decision");
      }
      return result.payload;
    },
    [dispatch],
  );

  return {
    jobs,
    candidates,
    interviews,
    offers,
    loading,
    submitting,
    error,
    refreshAll,
    getJob,
    upsertJob: upsertJobAction,
    deleteJob: deleteJobAction,
    archiveJob: archiveJobAction,
    duplicateJob: duplicateJobAction,
    upsertCandidate: upsertCandidateAction,
    moveStage: moveStageAction,
    addNote: addNoteAction,
    upsertInterview: upsertInterviewAction,
    upsertOffer: upsertOfferAction,
    // Screening
    screeningThresholds,
    screeningRun,
    screeningResults,
    screeningLoading,
    screeningSubmitting,
    screeningError,
    clearScreeningState: clearScreeningStateAction,
    runScreening: runScreeningAction,
    fetchScreeningResults: fetchScreeningResultsAction,
    submitDecision: submitDecisionAction,
  };
}

export function useRecruitment(): UseRecruitmentReturn;
export function useRecruitment<T>(selector: (resources: RecruitmentResources) => T): T;
export function useRecruitment<T>(selector?: (resources: RecruitmentResources) => T) {
  const base = useRecruitmentBase();
  const resources: RecruitmentResources = {
    jobs: base.jobs,
    candidates: base.candidates,
    interviews: base.interviews,
    offers: base.offers,
  };

  if (selector) {
    return selector(resources);
  }

  return base;
}

/** Imperative-style API for gradual migration from the legacy store. */
export function createRecruitmentApi(dispatch: ReturnType<typeof useAppDispatch>) {
  return {
    getJob: async (id: string) => {
      const result = await dispatch(fetchJobById(id));
      if (fetchJobById.fulfilled.match(result)) return result.payload;
      throw new Error(result.payload ?? "Job not found");
    },
    upsertJob: async (job: Job) => {
      const result = await dispatch(upsertJob(job));
      if (upsertJob.rejected.match(result)) throw new Error(result.payload ?? "Failed to save job");
      return result.payload;
    },
    deleteJob: async (id: string) => {
      await dispatch(deleteJob(id));
    },
    archiveJob: async (id: string) => {
      await dispatch(archiveJob(id));
    },
    duplicateJob: async (id: string) => {
      await dispatch(duplicateJob(id));
    },
    upsertCandidate: async (candidate: Candidate) => {
      await dispatch(upsertCandidate(candidate));
    },
    moveStage: (id: string, stage: Stage) => {
      dispatch(optimisticMoveStage({ id, stage }));
      dispatch(moveStage({ id, stage }));
    },
    addNote: (candidateId: string, text: string) => {
      dispatch(addNote({ candidateId, text }));
    },
    upsertInterview: async (interview: Interview) => {
      dispatch(optimisticUpsertInterview(interview));
      await dispatch(upsertInterview(interview));
    },
    upsertOffer: async (offer: Offer) => {
      await dispatch(upsertOffer(offer));
    },
  };
}

export async function refreshAll(dispatch: ReturnType<typeof useAppDispatch>) {
  await dispatch(fetchRecruitmentData());
}
