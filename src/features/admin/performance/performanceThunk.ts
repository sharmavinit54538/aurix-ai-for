import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiInstance } from "@/api";
import { getErrorMessage } from "@/api/utils";
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
    try {
      const response = await apiInstance.get("/api/v2/performance");
      const data = response.data?.data ?? response.data ?? {};
      return {
        reviews: Array.isArray(data.reviews) ? data.reviews : [],
        goals: Array.isArray(data.goals) ? data.goals : [],
        feedback360: Array.isArray(data.feedback360) ? data.feedback360 : [],
        rewards: Array.isArray(data.rewards) ? data.rewards : [],
        courses: Array.isArray(data.courses) ? data.courses : [],
      };
    } catch (err) {
      console.error("Failed to fetch performance data from /api/v2/performance:", err);
      return emptyData;
    }
  },
);

export const createReview = createAsyncThunk<
  PerformanceReview,
  PerformanceReview,
  { rejectValue: string }
>("performance/createReview", async (review, thunkAPI) => {
  try {
    const res = await apiInstance.post("/api/v2/performance/reviews", review);
    const data = res.data?.data ?? res.data;
    return data && typeof data === "object" && "id" in data ? { ...review, ...data } : review;
  } catch (err) {
    return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to create review"));
  }
});

export const updateReview = createAsyncThunk<
  PerformanceReview,
  PerformanceReview,
  { rejectValue: string }
>("performance/updateReview", async (review, thunkAPI) => {
  try {
    const res = await apiInstance.put(`/api/v2/performance/reviews/${review.id}`, review);
    const data = res.data?.data ?? res.data;
    return data && typeof data === "object" && "id" in data ? { ...review, ...data } : review;
  } catch (err) {
    return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to update review"));
  }
});

export const deleteReview = createAsyncThunk<string, string, { rejectValue: string }>(
  "performance/deleteReview",
  async (id, thunkAPI) => {
    try {
      await apiInstance.delete(`/api/v2/performance/reviews/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to delete review"));
    }
  },
);

export const bulkDeleteReviews = createAsyncThunk<string[], string[], { rejectValue: string }>(
  "performance/bulkDeleteReviews",
  async (ids, thunkAPI) => {
    try {
      await apiInstance.post("/api/v2/performance/reviews/bulk-delete", { ids });
      return ids;
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to bulk delete reviews"));
    }
  },
);

export const bulkSetReviewStatus = createAsyncThunk<
  { ids: string[]; status: PerformanceReview["reviewStatus"] },
  { ids: string[]; status: PerformanceReview["reviewStatus"] },
  { rejectValue: string }
>("performance/bulkSetReviewStatus", async (payload, thunkAPI) => {
  try {
    await apiInstance.post("/api/v2/performance/reviews/bulk-status", payload);
    return payload;
  } catch (err) {
    return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to update review status"));
  }
});

export const importReviews = createAsyncThunk<
  PerformanceReview[],
  PerformanceReview[],
  { rejectValue: string }
>("performance/importReviews", async (reviews, thunkAPI) => {
  try {
    const res = await apiInstance.post("/api/v2/performance/reviews/import", { reviews });
    const imported = res.data?.data?.reviews ?? res.data?.reviews ?? res.data?.data ?? res.data;
    return Array.isArray(imported) ? imported : reviews;
  } catch (err) {
    return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to import reviews"));
  }
});

export const createGoal = createAsyncThunk<Goal, Goal, { rejectValue: string }>(
  "performance/createGoal",
  async (goal, thunkAPI) => {
    try {
      const res = await apiInstance.post("/api/v2/performance/goals", goal);
      const data = res.data?.data ?? res.data;
      return data && typeof data === "object" && "id" in data ? { ...goal, ...data } : goal;
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to create goal"));
    }
  },
);

export const updateGoal = createAsyncThunk<Goal, Goal, { rejectValue: string }>(
  "performance/updateGoal",
  async (goal, thunkAPI) => {
    try {
      const res = await apiInstance.put(`/api/v2/performance/goals/${goal.id}`, goal);
      const data = res.data?.data ?? res.data;
      return data && typeof data === "object" && "id" in data ? { ...goal, ...data } : goal;
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to update goal"));
    }
  },
);

export const deleteGoal = createAsyncThunk<string, string, { rejectValue: string }>(
  "performance/deleteGoal",
  async (id, thunkAPI) => {
    try {
      await apiInstance.delete(`/api/v2/performance/goals/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to delete goal"));
    }
  },
);

export const assignGoal = createAsyncThunk<
  Goal,
  {
    employeeId: string;
    title: string;
    description: string;
    priority: GoalPriority;
    dueDate: string;
  },
  { rejectValue: string }
>("performance/assignGoal", async (payload, thunkAPI) => {
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
  try {
    const res = await apiInstance.post("/api/v2/performance/goals/assign", goal);
    const data = res.data?.data ?? res.data;
    return data && typeof data === "object" && "id" in data ? { ...goal, ...data } : goal;
  } catch (err) {
    return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to assign goal"));
  }
});

export const completeGoal = createAsyncThunk<string, string, { rejectValue: string }>(
  "performance/completeGoal",
  async (id, thunkAPI) => {
    try {
      await apiInstance.post(`/api/v2/performance/goals/${id}/complete`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to complete goal"));
    }
  },
);

// NOT IMPLEMENTED ON BACKEND — no /performance/feedback, /performance/rewards, or /performance/training/* route exists in either API v1 or v2 as of this audit. This thunk will always fail until a backend endpoint is added. Needs backend work, not a frontend URL fix.
export const addFeedback = createAsyncThunk<Feedback360, Feedback360, { rejectValue: string }>(
  "performance/addFeedback",
  async (_feedback, thunkAPI) => {
    const message =
      "Backend route /performance/feedback is not implemented in API v1 or v2. Needs backend work, not a frontend URL fix.";
    console.error(`[performance/addFeedback] ${message}`);
    return thunkAPI.rejectWithValue(message);
  },
);

// NOT IMPLEMENTED ON BACKEND — no /performance/feedback, /performance/rewards, or /performance/training/* route exists in either API v1 or v2 as of this audit. This thunk will always fail until a backend endpoint is added. Needs backend work, not a frontend URL fix.
export const addReward = createAsyncThunk<Reward, Reward, { rejectValue: string }>(
  "performance/addReward",
  async (_reward, thunkAPI) => {
    const message =
      "Backend route /performance/rewards is not implemented in API v1 or v2. Needs backend work, not a frontend URL fix.";
    console.error(`[performance/addReward] ${message}`);
    return thunkAPI.rejectWithValue(message);
  },
);

// NOT IMPLEMENTED ON BACKEND — no /performance/feedback, /performance/rewards, or /performance/training/* route exists in either API v1 or v2 as of this audit. This thunk will always fail until a backend endpoint is added. Needs backend work, not a frontend URL fix.
export const assignTraining = createAsyncThunk<
  TrainingCourse,
  { employeeId: string; courseName: string },
  { rejectValue: string }
>("performance/assignTraining", async ({ employeeId: _employeeId, courseName: _courseName }, thunkAPI) => {
  const message =
    "Backend route /performance/training/assign is not implemented in API v1 or v2. Needs backend work, not a frontend URL fix.";
  console.error(`[performance/assignTraining] ${message}`);
  return thunkAPI.rejectWithValue(message);
});

// NOT IMPLEMENTED ON BACKEND — no /performance/feedback, /performance/rewards, or /performance/training/* route exists in either API v1 or v2 as of this audit. This thunk will always fail until a backend endpoint is added. Needs backend work, not a frontend URL fix.
export const updateTrainingStatus = createAsyncThunk<
  { id: string; status: TrainingCourse["status"] },
  { id: string; status: TrainingCourse["status"] },
  { rejectValue: string }
>("performance/updateTrainingStatus", async ({ id, status: _status }, thunkAPI) => {
  const message = `Backend route /performance/training/${id} is not implemented in API v1 or v2. Needs backend work, not a frontend URL fix.`;
  console.error(`[performance/updateTrainingStatus] ${message}`);
  return thunkAPI.rejectWithValue(message);
});
