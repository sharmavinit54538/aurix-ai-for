import { i as createAsyncThunk } from "../_libs/@reduxjs/toolkit+[...].mjs";
import { o as apiInstance } from "./apiInstance-C5A0vaLH.mjs";
import { t as getErrorMessage } from "./utils-DQc9Fr86.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/performanceThunk-CenAzX-9.js
var emptyData = {
	reviews: [],
	goals: [],
	feedback360: [],
	rewards: [],
	courses: []
};
var fetchPerformance = createAsyncThunk("performance/fetchPerformance", async () => {
	try {
		const response = await apiInstance.get("/api/v2/performance");
		const data = response.data?.data ?? response.data ?? {};
		return {
			reviews: Array.isArray(data.reviews) ? data.reviews : [],
			goals: Array.isArray(data.goals) ? data.goals : [],
			feedback360: Array.isArray(data.feedback360) ? data.feedback360 : [],
			rewards: Array.isArray(data.rewards) ? data.rewards : [],
			courses: Array.isArray(data.courses) ? data.courses : []
		};
	} catch (err) {
		console.error("Failed to fetch performance data from /api/v2/performance:", err);
		return emptyData;
	}
});
var createReview = createAsyncThunk("performance/createReview", async (review, thunkAPI) => {
	try {
		const res = await apiInstance.post("/api/v2/performance/reviews", review);
		const data = res.data?.data ?? res.data;
		return data && typeof data === "object" && "id" in data ? {
			...review,
			...data
		} : review;
	} catch (err) {
		return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to create review"));
	}
});
var updateReview = createAsyncThunk("performance/updateReview", async (review, thunkAPI) => {
	try {
		const res = await apiInstance.put(`/api/v2/performance/reviews/${review.id}`, review);
		const data = res.data?.data ?? res.data;
		return data && typeof data === "object" && "id" in data ? {
			...review,
			...data
		} : review;
	} catch (err) {
		return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to update review"));
	}
});
var deleteReview = createAsyncThunk("performance/deleteReview", async (id, thunkAPI) => {
	try {
		await apiInstance.delete(`/api/v2/performance/reviews/${id}`);
		return id;
	} catch (err) {
		return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to delete review"));
	}
});
var bulkDeleteReviews = createAsyncThunk("performance/bulkDeleteReviews", async (ids, thunkAPI) => {
	try {
		await apiInstance.post("/api/v2/performance/reviews/bulk-delete", { ids });
		return ids;
	} catch (err) {
		return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to bulk delete reviews"));
	}
});
var bulkSetReviewStatus = createAsyncThunk("performance/bulkSetReviewStatus", async (payload, thunkAPI) => {
	try {
		await apiInstance.patch("/api/v2/performance/reviews/bulk-status", payload);
		return payload;
	} catch (err) {
		return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to update review status"));
	}
});
var importReviews = createAsyncThunk("performance/importReviews", async (reviews, thunkAPI) => {
	try {
		const res = await apiInstance.post("/api/v2/performance/reviews/import", { reviews });
		const imported = res.data?.data?.reviews ?? res.data?.reviews ?? res.data?.data ?? res.data;
		return Array.isArray(imported) ? imported : reviews;
	} catch (err) {
		return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to import reviews"));
	}
});
var createGoal = createAsyncThunk("performance/createGoal", async (goal, thunkAPI) => {
	try {
		const res = await apiInstance.post("/api/v2/performance/goals", goal);
		const data = res.data?.data ?? res.data;
		return data && typeof data === "object" && "id" in data ? {
			...goal,
			...data
		} : goal;
	} catch (err) {
		return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to create goal"));
	}
});
var updateGoal = createAsyncThunk("performance/updateGoal", async (goal, thunkAPI) => {
	try {
		const res = await apiInstance.put(`/api/v2/performance/goals/${goal.id}`, goal);
		const data = res.data?.data ?? res.data;
		return data && typeof data === "object" && "id" in data ? {
			...goal,
			...data
		} : goal;
	} catch (err) {
		return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to update goal"));
	}
});
var deleteGoal = createAsyncThunk("performance/deleteGoal", async (id, thunkAPI) => {
	try {
		await apiInstance.delete(`/api/v2/performance/goals/${id}`);
		return id;
	} catch (err) {
		return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to delete goal"));
	}
});
var assignGoal = createAsyncThunk("performance/assignGoal", async (payload, thunkAPI) => {
	const goal = {
		id: `g_${Math.random().toString(36).slice(2, 11)}`,
		employeeId: payload.employeeId,
		title: payload.title,
		description: payload.description,
		progress: 0,
		status: "not_started",
		priority: payload.priority,
		dueDate: payload.dueDate,
		createdAt: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
	};
	try {
		const res = await apiInstance.post("/api/v2/performance/goals/assign", goal);
		const data = res.data?.data ?? res.data;
		return data && typeof data === "object" && "id" in data ? {
			...goal,
			...data
		} : goal;
	} catch (err) {
		return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to assign goal"));
	}
});
var completeGoal = createAsyncThunk("performance/completeGoal", async (id, thunkAPI) => {
	try {
		await apiInstance.post(`/api/v2/performance/goals/${id}/complete`);
		return id;
	} catch (err) {
		return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to complete goal"));
	}
});
var addFeedback = createAsyncThunk("performance/addFeedback", async (_feedback, thunkAPI) => {
	const message = "Backend route /performance/feedback is not implemented in API v1 or v2. Needs backend work, not a frontend URL fix.";
	console.error(`[performance/addFeedback] ${message}`);
	return thunkAPI.rejectWithValue(message);
});
var addReward = createAsyncThunk("performance/addReward", async (_reward, thunkAPI) => {
	const message = "Backend route /performance/rewards is not implemented in API v1 or v2. Needs backend work, not a frontend URL fix.";
	console.error(`[performance/addReward] ${message}`);
	return thunkAPI.rejectWithValue(message);
});
var assignTraining = createAsyncThunk("performance/assignTraining", async ({ employeeId: _employeeId, courseName: _courseName }, thunkAPI) => {
	const message = "Backend route /performance/training/assign is not implemented in API v1 or v2. Needs backend work, not a frontend URL fix.";
	console.error(`[performance/assignTraining] ${message}`);
	return thunkAPI.rejectWithValue(message);
});
var updateTrainingStatus = createAsyncThunk("performance/updateTrainingStatus", async ({ id, status: _status }, thunkAPI) => {
	const message = `Backend route /performance/training/${id} is not implemented in API v1 or v2. Needs backend work, not a frontend URL fix.`;
	console.error(`[performance/updateTrainingStatus] ${message}`);
	return thunkAPI.rejectWithValue(message);
});
//#endregion
export { bulkDeleteReviews as a, createGoal as c, deleteReview as d, fetchPerformance as f, updateTrainingStatus as g, updateReview as h, assignTraining as i, createReview as l, updateGoal as m, addReward as n, bulkSetReviewStatus as o, importReviews as p, assignGoal as r, completeGoal as s, addFeedback as t, deleteGoal as u };
