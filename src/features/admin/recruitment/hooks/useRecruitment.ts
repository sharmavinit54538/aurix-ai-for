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
  cancelInterviewSchedule,
  deleteJob,
  duplicateJob,
  fetchInterviewers,
  fetchInterviews,
  fetchJobById,
  fetchRecruitmentData,
  fetchScreeningResults,
  markInterviewNoShow,
  moveStage,
  rescheduleInterviewSchedule,
  runScreening,
  scheduleInterviewRound,
  sendInterviewInvite,
  sendInterviewReminder,
  submitDecision,
  submitRoundFeedback,
  upsertCandidate,
  upsertInterview,
  upsertJob,
  upsertOffer,
} from "../recruitmentThunk";
import type { RecruitmentResources } from "../recruitmentTypes";
import type {
  Candidate,
  Interview,
  Interviewer,
  InterviewRecommendation,
  Job,
  Offer,
  ScreeningResult,
  ScreeningResultsData,
  ScreeningRun,
  ScreeningThresholds,
  Stage,
} from "../types";
import type {
  CancelInterviewPayload,
  InterviewListParams,
  RescheduleInterviewPayload,
  RoundFeedbackPayload,
  ScheduleInterviewPayload,
} from "@/services/interviewApi";
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
  // Interviews state and actions
  interviewPagination: { total: number; page: number; limit: number } | null;
  interviewers: Interviewer[];
  interviewLoading: boolean;
  interviewSubmitting: boolean;
  interviewError: string | null;
  fetchInterviews: (params?: InterviewListParams) => Promise<{ items: Interview[]; total: number; page: number; limit: number }>;
  fetchInterviewers: () => Promise<Interviewer[]>;
  scheduleInterview: (params: { interviewId: string; roundId: string; payload: ScheduleInterviewPayload }) => Promise<unknown>;
  rescheduleInterview: (params: { scheduleId: string; payload: RescheduleInterviewPayload }) => Promise<unknown>;
  cancelInterview: (params: { scheduleId: string; payload: CancelInterviewPayload }) => Promise<unknown>;
  sendInterviewReminder: (scheduleId: string) => Promise<unknown>;
  markInterviewNoShow: (scheduleId: string) => Promise<unknown>;
  submitRoundFeedback: (params: {
    roundId: string;
    action: "pass" | "reject" | "hold" | InterviewRecommendation;
    payload: RoundFeedbackPayload;
  }) => Promise<unknown>;
  sendInterviewInvite: (params: { applicationId: string; roundNames?: string }) => Promise<unknown>;
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
    interviewPagination,
    interviewers,
    interviewLoading,
    interviewSubmitting,
    interviewError,
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

  const fetchInterviewsAction = useCallback(
    async (params?: InterviewListParams) => {
      const result = await dispatch(fetchInterviews(params));
      if (fetchInterviews.rejected.match(result)) {
        throw new Error(result.payload ?? "Failed to fetch interviews");
      }
      return result.payload;
    },
    [dispatch],
  );

  const fetchInterviewersAction = useCallback(async () => {
    const result = await dispatch(fetchInterviewers());
    if (fetchInterviewers.rejected.match(result)) {
      throw new Error(result.payload ?? "Failed to fetch interviewers");
    }
    return result.payload;
  }, [dispatch]);

  const scheduleInterviewAction = useCallback(
    async (params: { interviewId: string; roundId: string; payload: ScheduleInterviewPayload }) => {
      const result = await dispatch(scheduleInterviewRound(params));
      if (scheduleInterviewRound.rejected.match(result)) {
        throw new Error(result.payload ?? "Failed to schedule interview");
      }
      return result.payload;
    },
    [dispatch],
  );

  const rescheduleInterviewAction = useCallback(
    async (params: { scheduleId: string; payload: RescheduleInterviewPayload }) => {
      const result = await dispatch(rescheduleInterviewSchedule(params));
      if (rescheduleInterviewSchedule.rejected.match(result)) {
        throw new Error(result.payload ?? "Failed to reschedule interview");
      }
      return result.payload;
    },
    [dispatch],
  );

  const cancelInterviewAction = useCallback(
    async (params: { scheduleId: string; payload: CancelInterviewPayload }) => {
      const result = await dispatch(cancelInterviewSchedule(params));
      if (cancelInterviewSchedule.rejected.match(result)) {
        throw new Error(result.payload ?? "Failed to cancel interview");
      }
      return result.payload;
    },
    [dispatch],
  );

  const sendInterviewReminderAction = useCallback(
    async (scheduleId: string) => {
      const result = await dispatch(sendInterviewReminder(scheduleId));
      if (sendInterviewReminder.rejected.match(result)) {
        throw new Error(result.payload ?? "Failed to send interview reminder");
      }
      return result.payload;
    },
    [dispatch],
  );

  const markInterviewNoShowAction = useCallback(
    async (scheduleId: string) => {
      const result = await dispatch(markInterviewNoShow(scheduleId));
      if (markInterviewNoShow.rejected.match(result)) {
        throw new Error(result.payload ?? "Failed to mark interview as no show");
      }
      return result.payload;
    },
    [dispatch],
  );

  const submitRoundFeedbackAction = useCallback(
    async (params: {
      roundId: string;
      action: "pass" | "reject" | "hold" | InterviewRecommendation;
      payload: RoundFeedbackPayload;
    }) => {
      const result = await dispatch(submitRoundFeedback(params));
      if (submitRoundFeedback.rejected.match(result)) {
        throw new Error(result.payload ?? "Failed to submit round feedback");
      }
      return result.payload;
    },
    [dispatch],
  );

  const sendInterviewInviteAction = useCallback(
    async (params: { applicationId: string; roundNames?: string }) => {
      const result = await dispatch(sendInterviewInvite(params));
      if (sendInterviewInvite.rejected.match(result)) {
        throw new Error(result.payload ?? "Failed to send interview invite");
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
    // Interviews
    interviewPagination,
    interviewers,
    interviewLoading,
    interviewSubmitting,
    interviewError,
    fetchInterviews: fetchInterviewsAction,
    fetchInterviewers: fetchInterviewersAction,
    scheduleInterview: scheduleInterviewAction,
    rescheduleInterview: rescheduleInterviewAction,
    cancelInterview: cancelInterviewAction,
    sendInterviewReminder: sendInterviewReminderAction,
    markInterviewNoShow: markInterviewNoShowAction,
    submitRoundFeedback: submitRoundFeedbackAction,
    sendInterviewInvite: sendInterviewInviteAction,
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
