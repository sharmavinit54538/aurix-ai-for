import { createSlice } from "@reduxjs/toolkit";
import {
  SEED_COURSES,
  SEED_FEEDBACK,
  SEED_GOALS,
  SEED_REVIEWS,
  SEED_REWARDS,
} from "./constants";
import type { PerformanceState } from "./performanceTypes";
import {
  addFeedback,
  addReward,
  assignGoal,
  assignTraining,
  bulkDeleteReviews,
  bulkSetReviewStatus,
  completeGoal,
  createGoal,
  createReview,
  deleteGoal,
  deleteReview,
  fetchPerformance,
  importReviews,
  updateGoal,
  updateReview,
  updateTrainingStatus,
} from "./performanceThunk";

const initialState: PerformanceState = {
  reviews: [],
  goals: [],
  feedback360: [],
  rewards: [],
  courses: [],
  loading: false,
  error: null,
};

const performanceSlice = createSlice({
  name: "performance",
  initialState,
  reducers: {
    clearPerformance(state) {
      state.reviews = [];
      state.goals = [];
      state.feedback360 = [];
      state.rewards = [];
      state.courses = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPerformance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPerformance.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.reviews;
        state.goals = action.payload.goals;
        state.feedback360 = action.payload.feedback360;
        state.rewards = action.payload.rewards;
        state.courses = action.payload.courses;
      })
      .addCase(fetchPerformance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to load performance data";
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.reviews = [action.payload, ...state.reviews];
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.map((r) =>
          r.id === action.payload.id ? action.payload : r,
        );
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter((r) => r.id !== action.payload);
      })
      .addCase(bulkDeleteReviews.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter((r) => !action.payload.includes(r.id));
      })
      .addCase(bulkSetReviewStatus.fulfilled, (state, action) => {
        const { ids, status } = action.payload;
        state.reviews = state.reviews.map((r) =>
          ids.includes(r.id) ? { ...r, reviewStatus: status } : r,
        );
      })
      .addCase(importReviews.fulfilled, (state, action) => {
        state.reviews = [...action.payload, ...state.reviews];
      })
      .addCase(createGoal.fulfilled, (state, action) => {
        state.goals = [action.payload, ...state.goals];
      })
      .addCase(updateGoal.fulfilled, (state, action) => {
        state.goals = state.goals.map((g) => (g.id === action.payload.id ? action.payload : g));
      })
      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.goals = state.goals.filter((g) => g.id !== action.payload);
      })
      .addCase(assignGoal.fulfilled, (state, action) => {
        state.goals = [action.payload, ...state.goals];
      })
      .addCase(completeGoal.fulfilled, (state, action) => {
        state.goals = state.goals.map((g) =>
          g.id === action.payload
            ? { ...g, progress: 100, status: "completed" as const }
            : g,
        );
      })
      .addCase(addFeedback.fulfilled, (state, action) => {
        state.feedback360 = [action.payload, ...state.feedback360];
      })
      .addCase(addReward.fulfilled, (state, action) => {
        state.rewards = [action.payload, ...state.rewards];
      })
      .addCase(assignTraining.fulfilled, (state, action) => {
        state.courses = [action.payload, ...state.courses];
      })
      .addCase(updateTrainingStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        state.courses = state.courses.map((c) =>
          c.id === id
            ? {
                ...c,
                status,
                completionDate:
                  status === "completed" ? new Date().toISOString().split("T")[0] : undefined,
              }
            : c,
        );
      });
  },
});

export const { clearPerformance } = performanceSlice.actions;
export default performanceSlice.reducer;
