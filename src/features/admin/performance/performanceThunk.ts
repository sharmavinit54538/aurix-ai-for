import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiInstance } from "@/api";
import { tryApi } from "@/api/utils";
import {
  SEED_COURSES,
  SEED_FEEDBACK,
  SEED_GOALS,
  SEED_REVIEWS,
  SEED_REWARDS,
} from "./constants";
import type { PerformanceData } from "./performanceTypes";
import type {
  Feedback360,
  Goal,
  GoalPriority,
  PerformanceReview,
  Reward,
  TrainingCourse,
} from "./types";

const emptyData: PerformanceData = {
  reviews: [],
  goals: [],
  feedback360: [],
  rewards: [],
  courses: [],
};

export const fetchPerformance = createAsyncThunk<PerformanceData, void, { rejectValue: string }>(
  "performance/fetchPerformance",
  async () => {
    return tryApi(async () => {
      const response = await apiInstance.get("../../v2/performance");
      const data = response.data?.data ?? response.data ?? {};
      return {
        reviews: data.reviews ?? [],
        goals: data.goals ?? [],
        feedback360: data.feedback360 ?? [],
        rewards: data.rewards ?? [],
        courses: data.courses ?? [],
      };
    }, emptyData);
  },
);

export const createReview = createAsyncThunk<PerformanceReview, PerformanceReview>(
  "performance/createReview",
  async (review) => {
    await tryApi(() => apiInstance.post("../../v2/performance/reviews", review), undefined);
    return review;
  },
);

export const updateReview = createAsyncThunk<PerformanceReview, PerformanceReview>(
  "performance/updateReview",
  async (review) => {
    await tryApi(() => apiInstance.put(`../../v2/performance/reviews/${review.id}`, review), undefined);
    return review;
  },
);

export const deleteReview = createAsyncThunk<string, string>("performance/deleteReview", async (id) => {
  await tryApi(() => apiInstance.delete(`../../v2/performance/reviews/${id}`), undefined);
  return id;
});

export const bulkDeleteReviews = createAsyncThunk<string[], string[]>(
  "performance/bulkDeleteReviews",
  async (ids) => {
    await tryApi(() => apiInstance.post("../../v2/performance/reviews/bulk-delete", { ids }), undefined);
    return ids;
  },
);

export const bulkSetReviewStatus = createAsyncThunk<
  { ids: string[]; status: PerformanceReview["reviewStatus"] },
  { ids: string[]; status: PerformanceReview["reviewStatus"] }
>("performance/bulkSetReviewStatus", async (payload) => {
  await tryApi(() => apiInstance.patch("../../v2/performance/reviews/bulk-status", payload), undefined);
  return payload;
});

export const importReviews = createAsyncThunk<PerformanceReview[], PerformanceReview[]>(
  "performance/importReviews",
  async (reviews) => {
    await tryApi(() => apiInstance.post("../../v2/performance/reviews/import", { reviews }), undefined);
    return reviews;
  },
);

export const createGoal = createAsyncThunk<Goal, Goal>("performance/createGoal", async (goal) => {
  await tryApi(() => apiInstance.post("../../v2/performance/goals", goal), undefined);
  return goal;
});

export const updateGoal = createAsyncThunk<Goal, Goal>("performance/updateGoal", async (goal) => {
  await tryApi(() => apiInstance.put(`../../v2/performance/goals/${goal.id}`, goal), undefined);
  return goal;
});

export const deleteGoal = createAsyncThunk<string, string>("performance/deleteGoal", async (id) => {
  await tryApi(() => apiInstance.delete(`../../v2/performance/goals/${id}`), undefined);
  return id;
});

export const assignGoal = createAsyncThunk<
  Goal,
  {
    employeeId: string;
    title: string;
    description: string;
    priority: GoalPriority;
    dueDate: string;
  }
>("performance/assignGoal", async (payload) => {
  const goal: Goal = {
    id: `g_${Math.random().toString(36).slice(2, 11)}`,
    employeeId: payload.employeeId,
    title: payload.title,
    description: payload.description,
    progress: 0,
    status: "not_started",
    priority: payload.priority,
    dueDate: payload.dueDate,
    createdAt: new Date().toISOString().split("T")[0],
  };
  await tryApi(() => apiInstance.post("../../v2/performance/goals/assign", goal), undefined);
  return goal;
});

export const completeGoal = createAsyncThunk<string, string>("performance/completeGoal", async (id) => {
  await tryApi(() => apiInstance.post(`../../v2/performance/goals/${id}/complete`), undefined);
  return id;
});

export const addFeedback = createAsyncThunk<Feedback360, Feedback360>(
  "performance/addFeedback",
  async (feedback) => {
    await tryApi(() => apiInstance.post("../../v2/performance/feedback", feedback), undefined);
    return feedback;
  },
);

export const addReward = createAsyncThunk<Reward, Reward>("performance/addReward", async (reward) => {
  await tryApi(() => apiInstance.post("../../v2/performance/rewards", reward), undefined);
  return reward;
});

export const assignTraining = createAsyncThunk<
  TrainingCourse,
  { employeeId: string; courseName: string }
>("performance/assignTraining", async ({ employeeId, courseName }) => {
  const course: TrainingCourse = {
    id: `c_${Math.random().toString(36).slice(2, 11)}`,
    employeeId,
    courseName,
    status: "assigned",
    assignedDate: new Date().toISOString().split("T")[0],
  };
  await tryApi(() => apiInstance.post("../../v2/performance/training/assign", course), undefined);
  return course;
});

export const updateTrainingStatus = createAsyncThunk<
  { id: string; status: TrainingCourse["status"] },
  { id: string; status: TrainingCourse["status"] }
>("performance/updateTrainingStatus", async ({ id, status }) => {
  await tryApi(() => apiInstance.patch(`../../v2/performance/training/${id}`, { status }), undefined);
  return { id, status };
});
