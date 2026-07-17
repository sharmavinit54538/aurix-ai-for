import { createSlice } from "@reduxjs/toolkit";
import {
  addNote,
  archiveJob,
  deleteJob,
  duplicateJob,
  fetchRecruitmentData,
  moveStage,
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
  submitting: false,
  error: null,
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecruitmentData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecruitmentData.fulfilled, (state, action) => {
        console.log("action.payload", action.payload);
        state.loading = false;
        state.jobs = action.payload.jobs;
        state.candidates = action.payload.candidates;
        state.interviews = action.payload.interviews;
        state.offers = action.payload.offers;
      })
      .addCase(fetchRecruitmentData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? "Failed to load recruitment data";
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

export const { clearRecruitment, optimisticMoveStage, optimisticUpsertInterview } =
  recruitmentSlice.actions;
export default recruitmentSlice.reducer;
