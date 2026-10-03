import { createSlice } from "@reduxjs/toolkit";
import {
  addNote,
  archiveJob,
  cancelInterviewSchedule,
  deleteJob,
  duplicateJob,
  fetchInterviewers,
  fetchInterviews,
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
} from "./recruitmentThunk";
import type { RecruitmentState } from "./recruitmentTypes";

const initialState: RecruitmentState = {
  jobs: [],
  candidates: [],
  interviews: [],
  offers: [],
  loading: false,
  lastFetchedAt: null,
  submitting: false,
  error: null,
  screeningThresholds: null,
  screeningJobId: null,
  screeningRun: null,
  screeningResults: [],
  screeningLoading: false,
  screeningSubmitting: false,
  screeningError: null,
  interviewPagination: null,
  interviewers: [],
  interviewLoading: false,
  interviewSubmitting: false,
  interviewError: null,
};

const mutationThunks = [
  upsertJob,
  deleteJob,
  archiveJob,
  duplicateJob,
  upsertCandidate,
  moveStage,
  addNote,
  upsertInterview,
  upsertOffer,
  scheduleInterviewRound,
  rescheduleInterviewSchedule,
  cancelInterviewSchedule,
  sendInterviewReminder,
  markInterviewNoShow,
  submitRoundFeedback,
  sendInterviewInvite,
];

const recruitmentSlice = createSlice({
  name: "recruitment",
  initialState,
  reducers: {
    clearRecruitment(state) {
      state.jobs = [];
      state.candidates = [];
      state.interviews = [];
      state.offers = [];
      state.error = null;
      state.lastFetchedAt = null;
    },
    optimisticMoveStage(
      state,
      action: { payload: { id: string; stage: import("./types").Stage } },
    ) {
      const cand = state.candidates.find(
        (c) => c.id === action.payload.id || c.applicationId === action.payload.id,
      );
      if (cand) cand.stage = action.payload.stage;
    },
    optimisticUpsertInterview(state, action: { payload: import("./types").Interview }) {
      const idx = state.interviews.findIndex((item) => item.id === action.payload.id);
      if (idx >= 0) state.interviews[idx] = action.payload;
      else state.interviews.push(action.payload);
    },
    clearScreeningState(state) {
      state.screeningThresholds = null;
      state.screeningJobId = null;
      state.screeningRun = null;
      state.screeningResults = [];
      state.screeningLoading = false;
      state.screeningSubmitting = false;
      state.screeningError = null;
    },
    setScreeningThresholds(state, action: { payload: { shortlist: number; reject: number } | null }) {
      state.screeningThresholds = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecruitmentData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecruitmentData.fulfilled, (state, action) => {
        state.loading = false;
        state.lastFetchedAt = Date.now();
        state.jobs = action.payload.jobs;
        state.candidates = action.payload.candidates;
        state.interviews = action.payload.interviews;
        state.offers = action.payload.offers;
      })
      .addCase(fetchRecruitmentData.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error.message || "Failed to load recruitment data";
      })
      .addCase(runScreening.pending, (state) => {
        state.screeningSubmitting = true;
        state.screeningError = null;
      })
      .addCase(runScreening.fulfilled, (state, action) => {
        state.screeningSubmitting = false;
        state.screeningRun = action.payload;
      })
      .addCase(runScreening.rejected, (state, action) => {
        state.screeningSubmitting = false;
        state.screeningError =
          (action.payload as string) || action.error.message || "Failed to run AI screening";
      })
      .addCase(fetchScreeningResults.pending, (state, action) => {
        state.screeningLoading = true;
        state.screeningError = null;
        state.screeningJobId = action.meta.arg;
      })
      .addCase(fetchScreeningResults.fulfilled, (state, action) => {
        if (state.screeningJobId && action.meta.arg !== state.screeningJobId) {
          return;
        }
        state.screeningLoading = false;
        state.screeningThresholds = action.payload.thresholds;
        state.screeningRun = action.payload.run;
        state.screeningResults = action.payload.results;
      })
      .addCase(fetchScreeningResults.rejected, (state, action) => {
        if (state.screeningJobId && action.meta.arg !== state.screeningJobId) {
          return;
        }
        state.screeningLoading = false;
        state.screeningError =
          (action.payload as string) || action.error.message || "Failed to fetch screening results";
      })
      .addCase(submitDecision.pending, (state) => {
        state.screeningSubmitting = true;
        state.screeningError = null;
      })
      .addCase(submitDecision.fulfilled, (state, action) => {
        state.screeningSubmitting = false;
        const updated = action.payload;
        const idx = state.screeningResults.findIndex(
          (r) =>
            (updated.screeningId && r.screeningId === updated.screeningId) ||
            r.id === updated.id ||
            (updated.applicationId && r.applicationId === updated.applicationId),
        );
        if (idx >= 0) {
          state.screeningResults[idx] = {
            ...state.screeningResults[idx],
            humanDecision: updated.humanDecision,
            humanDecisionBy: updated.humanDecisionBy,
            humanDecisionReason: updated.humanDecisionReason,
            humanDecidedAt: updated.humanDecidedAt ?? state.screeningResults[idx].humanDecidedAt ?? new Date().toISOString(),
          };
        }
      })
      .addCase(submitDecision.rejected, (state, action) => {
        state.screeningSubmitting = false;
        state.screeningError =
          (action.payload as string) || action.error.message || "Failed to submit decision";
      })
      .addCase(fetchInterviews.pending, (state) => {
        state.interviewLoading = true;
        state.interviewError = null;
      })
      .addCase(fetchInterviews.fulfilled, (state, action) => {
        state.interviewLoading = false;
        state.interviews = action.payload.items;
        state.interviewPagination = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
        };
      })
      .addCase(fetchInterviews.rejected, (state, action) => {
        state.interviewLoading = false;
        state.interviewError =
          (action.payload as string) || action.error.message || "Failed to fetch interviews";
      })
      .addCase(fetchInterviewers.fulfilled, (state, action) => {
        state.interviewers = action.payload;
      });

    mutationThunks.forEach((thunk) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.submitting = true;
        })
        .addCase(thunk.fulfilled, (state) => {
          state.submitting = false;
        })
        .addCase(thunk.rejected, (state) => {
          state.submitting = false;
        });
    });
  },
});

export const {
  clearRecruitment,
  optimisticMoveStage,
  optimisticUpsertInterview,
  clearScreeningState,
  setScreeningThresholds,
} = recruitmentSlice.actions;
export default recruitmentSlice.reducer;
