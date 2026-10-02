import { o as __toESM, r as __exportAll } from "../_runtime.mjs";
import { a as streamText, i as stepCountIs, o as require_react, r as convertToModelMessages } from "../_libs/@ai-sdk/react+[...].mjs";
import { B as useRouter, N as redirect, _ as Link, c as HeadContent, f as createRouter, g as createRootRouteWithContext, h as createFileRoute, m as lazyRouteComponent, p as Outlet, s as Scripts } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Gt as Lock, H as Sparkles, Ir as ChartColumn, J as ShieldAlert, Yr as Brain, di as ArrowLeft, o as Wrench, pn as House, q as ShieldCheck, x as UserCheck } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { a as createSlice, c as Provider_default, i as createAsyncThunk, n as fetchBaseQuery, o as isRejectedWithValue, r as configureStore, t as createApi } from "../_libs/@reduxjs/toolkit+[...].mjs";
import { t as __exportAll$1 } from "./rolldown-runtime-D7D4PA-g.mjs";
import { n as safeStorage, t as logger } from "./safe-storage-DInQCreU.mjs";
import { a as normalizeRole, c as useAurix, i as isSuperAdmin, l as useCurrentRole, t as aurix } from "./aurix-store-BcCbMqU4.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { t as axios } from "../_libs/axios+[...].mjs";
import { c as getRefreshToken, d as setTokens, l as getTokens, n as AUTH_ENDPOINTS, o as apiInstance, r as ApiError, s as clearApiCache, t as API_BASE_URL } from "./apiInstance-C5A0vaLH.mjs";
import { r as parseApiError, t as getErrorMessage$1 } from "./utils-DQc9Fr86.mjs";
import { M as departmentsSlice_default, Y as managersSlice_default } from "./departmentsSlice-BOlsHBgC.mjs";
import { t as authService } from "./auth-BRJn5RkQ.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { a as bulkDeleteReviews, c as createGoal, d as deleteReview, f as fetchPerformance$1, g as updateTrainingStatus, h as updateReview, i as assignTraining, l as createReview, m as updateGoal, n as addReward, o as bulkSetReviewStatus, p as importReviews, r as assignGoal, s as completeGoal, t as addFeedback, u as deleteGoal } from "./performanceThunk-CenAzX-9.mjs";
import { r as recruitmentSlice_default } from "./recruitmentSlice-CTSUTzrb.mjs";
import { i as employeeHierarchySlice_default } from "./employeeHierarchySlice-8KeWhm8x.mjs";
import { t as ThemeProvider } from "./ThemeProvider-2CHrEfXV.mjs";
import { n as posts } from "./blog-data-3DVoSlEv.mjs";
import { t as Route$246 } from "./blog._slug-B3ANgj6D.mjs";
import { t as ModuleHubView } from "./ModuleHubView-DR9XGfmj.mjs";
import { t as canAccessDocumentsRoute } from "./permissions-q3ueyeAm.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { i as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { Dt as stringType, Et as recordType, St as enumType, Tt as objectType, V as tool, wt as numberType, yt as anyType } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { t as createOpenAICompatible } from "../_libs/ai-sdk__openai-compatible.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-bootstrap-CR9kF6gO.js
var auth_bootstrap_CR9kF6gO_exports = /* @__PURE__ */ __exportAll({
	$: () => resetEmployeePassword,
	A: () => aiHubApi,
	B: () => fetchEmployeeHealthDashboard,
	C: () => clearOperationStatus$1,
	D: () => fetchChatConversation,
	E: () => deleteChatConversation,
	F: () => profileApi,
	G: () => fetchAIInsightsDashboard,
	H: () => fetchPolicyAssistantDashboard,
	I: () => fetchWorkforceInsightsDashboard,
	J: () => createEmployee,
	K: () => aiInsightsApi,
	L: () => fetchRecruiterDashboard,
	M: () => toggleSectionExpand,
	N: () => fetchSidebarPermissions,
	O: () => fetchChatConversations,
	P: () => settingsApi$1,
	Q: () => resendEmployeeInvite,
	R: () => fetchLeaveAssistantDashboard,
	S: () => superAdminApi,
	T: () => createChatConversation,
	U: () => fetchMeetingIntelligenceDashboard,
	V: () => askPolicyQuestion,
	W: () => fetchComplianceDashboard,
	X: () => deleteEmployee,
	Y: () => deactivateEmployee,
	Z: () => fetchEmployees,
	_: () => fetchSuperAdminStatistics,
	a: () => Route$155,
	b: () => collectAllPages,
	c: () => getSafeRedirectUrl,
	d: () => deactivatePlatformUser,
	et: () => updateEmployee,
	f: () => fetchActiveSessions,
	g: () => fetchPlatformUsers,
	h: () => fetchPlatformSettings,
	i: () => router_exports,
	j: () => setSectionExpand,
	k: () => sendChatMessage,
	l: () => getDefaultDashboardPath,
	m: () => fetchOrganizations,
	n: () => persistAuthSession,
	nt: () => hasValidAccessToken,
	o: () => AGENTS,
	p: () => fetchAuditLogs,
	q: () => activateEmployee,
	r: () => useAuthReady,
	s: () => AGENT_LIST,
	t: () => logout,
	tt: () => PageSkeleton,
	u: () => activatePlatformUser,
	v: () => fetchSystemHealth,
	w: () => setActiveConversation,
	x: () => normalizeStatistics,
	y: () => updatePlatformSettings,
	z: () => fetchPerformanceCoachDashboard
});
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function parseJwtPayload(token) {
	try {
		const parts = token.split(".");
		if (parts.length !== 3) return null;
		const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
		const payload = JSON.parse(atob(base64));
		return payload && typeof payload === "object" ? payload : null;
	} catch {
		return null;
	}
}
/** Returns true when the access token is missing or past its expiry (with optional leeway). */
function isAccessTokenExpired(token, leewaySec = 30) {
	const payload = parseJwtPayload(token);
	if (!payload?.exp) return false;
	return Date.now() >= (payload.exp - leewaySec) * 1e3;
}
function hasValidAccessToken() {
	const tokens = getTokens();
	if (!tokens?.accessToken) return false;
	return !isAccessTokenExpired(tokens.accessToken);
}
function PageSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full space-y-6 animate-in fade-in duration-200",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 w-56 rounded-lg bg-muted/60" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-96 max-w-full rounded-md bg-muted/40" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-9 w-24 rounded-lg bg-muted/50" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-9 w-32 rounded-lg bg-primary/20" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border/60 bg-card/40 p-5 shadow-sm backdrop-blur-sm space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-28 rounded bg-muted/50" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 w-8 rounded-lg bg-muted/40" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-7 w-20 rounded bg-muted/70" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-3.5 w-14 rounded bg-emerald-500/20" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-3 w-24 rounded bg-muted/40" })]
						})
					]
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-2 rounded-xl border border-border/60 bg-card/40 p-6 shadow-sm backdrop-blur-sm space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-5 w-40 rounded bg-muted/60" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 w-28 rounded-lg bg-muted/40" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-64 w-full rounded-lg bg-muted/20 flex items-end gap-3 p-4",
						children: Array.from({ length: 12 }).map((_, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1 bg-muted/40 rounded-t-md animate-pulse",
							style: { height: `${25 + idx * 17 % 65}%` }
						}, idx))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border/60 bg-card/40 p-6 shadow-sm backdrop-blur-sm space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-5 w-32 rounded bg-muted/60" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-3",
						children: Array.from({ length: 5 }).map((_, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 p-2 rounded-lg bg-muted/10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-9 w-9 rounded-full bg-muted/40 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5 flex-1 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-3.5 w-full rounded bg-muted/50" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-2.5 w-20 rounded bg-muted/30" })]
							})]
						}, idx))
					})]
				})]
			})
		]
	});
}
function mapEmployee(emp) {
	return {
		id: String(emp.id ?? ""),
		employeeId: String(emp.employee_id ?? ""),
		fullName: `${emp.first_name ?? ""} ${emp.last_name ?? ""}`.trim(),
		email: String(emp.personal_email ?? emp.company_email ?? ""),
		phone: String(emp.phone ?? ""),
		department: String(emp.department ?? ""),
		designation: String(emp.designation ?? ""),
		joiningDate: String(emp.joining_date ?? ""),
		managerName: "",
		shift: String(emp.shift ?? "General"),
		status: String(emp.status ?? "INVITED"),
		role: String(emp.role ?? "employee"),
		activationToken: emp.activation_token,
		activationTokenExpiresAt: emp.activation_token_expires_at
	};
}
var fetchEmployees = createAsyncThunk("employees/fetchEmployees", async (params, thunkAPI) => {
	try {
		const searchParams = new URLSearchParams();
		if (params?.search) searchParams.set("search", params.search);
		if (params?.department && params.department !== "all") searchParams.set("department", params.department);
		if (params?.designation && params.designation !== "all") searchParams.set("designation", params.designation);
		if (params?.shift && params.shift !== "all") searchParams.set("shift", params.shift);
		if (params?.status && params.status !== "all") searchParams.set("status", params.status);
		if (params?.role && params.role !== "all") searchParams.set("role", params.role);
		if (params?.sort) searchParams.set("sort", params.sort);
		if (params?.order) searchParams.set("order", params.order);
		if (params?.page) searchParams.set("page", String(params.page));
		if (params?.limit) searchParams.set("limit", String(params.limit));
		const data = (await apiInstance.get(`/employees?${searchParams.toString()}`)).data?.data ?? {};
		return {
			items: (data.items ?? []).map((item) => mapEmployee(item)),
			total: Number(data.total ?? 0),
			page: Number(data.page ?? 1),
			limit: Number(data.limit ?? 10),
			pages: Number(data.pages ?? 0),
			total_pages: Number(data.total_pages ?? data.pages ?? 0),
			has_next: Boolean(data.has_next ?? false),
			has_previous: Boolean(data.has_previous ?? false)
		};
	} catch (error) {
		return thunkAPI.rejectWithValue(parseApiError(error, "Failed to fetch employees"));
	}
});
var createEmployee = createAsyncThunk("employees/createEmployee", async (payload, thunkAPI) => {
	try {
		await apiInstance.post("/employees", payload);
	} catch (error) {
		return thunkAPI.rejectWithValue(parseApiError(error, "Failed to add employee"));
	}
});
var updateEmployee = createAsyncThunk("employees/updateEmployee", async ({ id, payload }, thunkAPI) => {
	try {
		await apiInstance.put(`/employees/${id}`, payload);
	} catch (error) {
		return thunkAPI.rejectWithValue(parseApiError(error, "Failed to update employee"));
	}
});
var deleteEmployee = createAsyncThunk("employees/deleteEmployee", async (id, thunkAPI) => {
	try {
		await apiInstance.delete(`/employees/${id}`);
		return id;
	} catch (error) {
		return thunkAPI.rejectWithValue(parseApiError(error, "Failed to remove employee"));
	}
});
var resendEmployeeInvite = createAsyncThunk("employees/resendEmployeeInvite", async (id, thunkAPI) => {
	try {
		await apiInstance.post(`/employees/${id}/send-invite`);
	} catch (error) {
		return thunkAPI.rejectWithValue(parseApiError(error, "Failed to resend invitation"));
	}
});
var deactivateEmployee = createAsyncThunk("employees/deactivateEmployee", async (id, thunkAPI) => {
	try {
		await apiInstance.post(`/employees/${id}/deactivate`);
	} catch (error) {
		return thunkAPI.rejectWithValue(parseApiError(error, "Failed to deactivate employee"));
	}
});
var activateEmployee = createAsyncThunk("employees/activateEmployee", async (id, thunkAPI) => {
	try {
		await apiInstance.post(`/employees/${id}/activate-by-admin`);
	} catch (error) {
		return thunkAPI.rejectWithValue(parseApiError(error, "Failed to activate employee"));
	}
});
var resetEmployeePassword = createAsyncThunk("employees/resetEmployeePassword", async (id, thunkAPI) => {
	try {
		await apiInstance.post(`/employees/${id}/reset-password`);
	} catch (error) {
		return thunkAPI.rejectWithValue(parseApiError(error, "Failed to reset password"));
	}
});
var initialState$15 = {
	employees: [],
	loading: false,
	submitting: false,
	error: null,
	total: 0,
	page: 1,
	limit: 10,
	pages: 0,
	has_next: false,
	has_previous: false
};
var mutationThunks = [
	createEmployee,
	updateEmployee,
	resendEmployeeInvite,
	deactivateEmployee,
	activateEmployee,
	resetEmployeePassword
];
var employeesSlice = createSlice({
	name: "employees",
	initialState: initialState$15,
	reducers: { clearEmployees(state) {
		state.employees = [];
		state.error = null;
	} },
	extraReducers: (builder) => {
		builder.addCase(fetchEmployees.pending, (state) => {
			state.loading = true;
			state.error = null;
		}).addCase(fetchEmployees.fulfilled, (state, action) => {
			state.loading = false;
			state.employees = action.payload.items;
			state.total = action.payload.total;
			state.page = action.payload.page;
			state.limit = action.payload.limit;
			state.pages = action.payload.pages;
			state.has_next = action.payload.has_next;
			state.has_previous = action.payload.has_previous;
		}).addCase(fetchEmployees.rejected, (state, action) => {
			state.loading = false;
			const err = action.payload;
			state.error = typeof err === "string" ? err : err?.message ?? action.error.message ?? "Something went wrong";
		}).addCase(deleteEmployee.pending, (state) => {
			state.submitting = true;
		}).addCase(deleteEmployee.fulfilled, (state, action) => {
			state.submitting = false;
			state.employees = state.employees.filter((e) => e.id !== action.payload);
		}).addCase(deleteEmployee.rejected, (state) => {
			state.submitting = false;
		});
		mutationThunks.forEach((thunk) => {
			builder.addCase(thunk.pending, (state) => {
				state.submitting = true;
			}).addCase(thunk.fulfilled, (state) => {
				state.submitting = false;
			}).addCase(thunk.rejected, (state) => {
				state.submitting = false;
			});
		});
	}
});
var { clearEmployees } = employeesSlice.actions;
var employeesSlice_default = employeesSlice.reducer;
var performanceSlice = createSlice({
	name: "performance",
	initialState: {
		reviews: [],
		goals: [],
		feedback360: [],
		rewards: [],
		courses: [],
		loading: false,
		error: null
	},
	reducers: { clearPerformance(state) {
		state.reviews = [];
		state.goals = [];
		state.feedback360 = [];
		state.rewards = [];
		state.courses = [];
		state.error = null;
	} },
	extraReducers: (builder) => {
		builder.addCase(fetchPerformance$1.pending, (state) => {
			state.loading = true;
			state.error = null;
		}).addCase(fetchPerformance$1.fulfilled, (state, action) => {
			state.loading = false;
			state.reviews = action.payload.reviews;
			state.goals = action.payload.goals;
			state.feedback360 = action.payload.feedback360;
			state.rewards = action.payload.rewards;
			state.courses = action.payload.courses;
		}).addCase(fetchPerformance$1.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload ?? "Failed to load performance data";
		}).addCase(createReview.fulfilled, (state, action) => {
			state.reviews = [action.payload, ...state.reviews];
		}).addCase(updateReview.fulfilled, (state, action) => {
			state.reviews = state.reviews.map((r) => r.id === action.payload.id ? action.payload : r);
		}).addCase(deleteReview.fulfilled, (state, action) => {
			state.reviews = state.reviews.filter((r) => r.id !== action.payload);
		}).addCase(bulkDeleteReviews.fulfilled, (state, action) => {
			state.reviews = state.reviews.filter((r) => !action.payload.includes(r.id));
		}).addCase(bulkSetReviewStatus.fulfilled, (state, action) => {
			const { ids, status } = action.payload;
			state.reviews = state.reviews.map((r) => ids.includes(r.id) ? {
				...r,
				reviewStatus: status
			} : r);
		}).addCase(importReviews.fulfilled, (state, action) => {
			state.reviews = [...action.payload, ...state.reviews];
		}).addCase(createGoal.fulfilled, (state, action) => {
			state.goals = [action.payload, ...state.goals];
		}).addCase(updateGoal.fulfilled, (state, action) => {
			state.goals = state.goals.map((g) => g.id === action.payload.id ? action.payload : g);
		}).addCase(deleteGoal.fulfilled, (state, action) => {
			state.goals = state.goals.filter((g) => g.id !== action.payload);
		}).addCase(assignGoal.fulfilled, (state, action) => {
			state.goals = [action.payload, ...state.goals];
		}).addCase(completeGoal.fulfilled, (state, action) => {
			state.goals = state.goals.map((g) => g.id === action.payload ? {
				...g,
				progress: 100,
				status: "completed"
			} : g);
		}).addCase(addFeedback.fulfilled, (state, action) => {
			state.feedback360 = [action.payload, ...state.feedback360];
		}).addCase(addReward.fulfilled, (state, action) => {
			state.rewards = [action.payload, ...state.rewards];
		}).addCase(assignTraining.fulfilled, (state, action) => {
			state.courses = [action.payload, ...state.courses];
		}).addCase(updateTrainingStatus.fulfilled, (state, action) => {
			const { id, status } = action.payload;
			state.courses = state.courses.map((c) => c.id === id ? {
				...c,
				status,
				completionDate: status === "completed" ? (/* @__PURE__ */ new Date()).toISOString().split("T")[0] : void 0
			} : c);
		});
	}
});
var { clearPerformance } = performanceSlice.actions;
var performanceSlice_default = performanceSlice.reducer;
function normalizeDashboardData(data) {
	if (!data || typeof data !== "object") return {
		summary: void 0,
		kpi: [],
		attrition: [],
		burnout: [],
		attendance: [],
		recruitment: void 0,
		performance: void 0,
		charts: void 0,
		alerts: [],
		recommendations: [],
		documents: []
	};
	return {
		has_data: data.has_data,
		partial: data.partial,
		errors: data.errors,
		summary: data.summary ?? void 0,
		kpi: Array.isArray(data.kpi) ? data.kpi : [],
		attrition: Array.isArray(data.attrition) ? data.attrition : [],
		burnout: Array.isArray(data.burnout) ? data.burnout : [],
		attendance: Array.isArray(data.attendance) ? data.attendance : [],
		recruitment: data.recruitment ? {
			openPositions: data.recruitment.openPositions ?? 0,
			recommendedCandidatesCount: data.recruitment.recommendedCandidatesCount ?? 0,
			pipelineHealth: data.recruitment.pipelineHealth ?? "",
			candidates: Array.isArray(data.recruitment.candidates) ? data.recruitment.candidates : []
		} : void 0,
		performance: data.performance ? {
			topPerformers: Array.isArray(data.performance.topPerformers) ? data.performance.topPerformers : [],
			supportPerformers: Array.isArray(data.performance.supportPerformers) ? data.performance.supportPerformers : [],
			skillGap: Array.isArray(data.performance.skillGap) ? data.performance.skillGap : []
		} : void 0,
		charts: data.charts ? {
			skillGap: Array.isArray(data.charts.skillGap) ? data.charts.skillGap : [],
			headcountForecast: Array.isArray(data.charts.headcountForecast) ? data.charts.headcountForecast : [],
			hiringDemand: Array.isArray(data.charts.hiringDemand) ? data.charts.hiringDemand : [],
			satisfactionTrend: Array.isArray(data.charts.satisfactionTrend) ? data.charts.satisfactionTrend : []
		} : void 0,
		alerts: Array.isArray(data.alerts) ? data.alerts : [],
		recommendations: Array.isArray(data.recommendations) ? data.recommendations : [],
		documents: Array.isArray(data.documents) ? data.documents : []
	};
}
var aiInsightsApi = {
	async getDashboard() {
		const response = await apiInstance.get("/ai-insights/dashboard");
		return normalizeDashboardData(response.data?.data ?? response.data);
	},
	async getKpi() {
		const response = await apiInstance.get("/ai-insights/kpi");
		const data = response.data?.data ?? response.data;
		return Array.isArray(data) ? data : [];
	},
	async getAttrition() {
		const response = await apiInstance.get("/ai-insights/attrition");
		const data = response.data?.data ?? response.data;
		return Array.isArray(data) ? data : [];
	},
	async getBurnout() {
		const response = await apiInstance.get("/ai-insights/burnout");
		const data = response.data?.data ?? response.data;
		return Array.isArray(data) ? data : [];
	},
	async getAttendance() {
		const response = await apiInstance.get("/ai-insights/attendance");
		const data = response.data?.data ?? response.data;
		return Array.isArray(data) ? data : [];
	},
	async getPerformance() {
		const response = await apiInstance.get("/ai-insights/performance");
		const data = response.data?.data ?? response.data ?? {};
		return {
			topPerformers: Array.isArray(data.topPerformers) ? data.topPerformers : [],
			supportPerformers: Array.isArray(data.supportPerformers) ? data.supportPerformers : [],
			skillGap: Array.isArray(data.skillGap) ? data.skillGap : []
		};
	},
	async getRecruitment() {
		const response = await apiInstance.get("/ai-insights/recruitment");
		const data = response.data?.data ?? response.data ?? {};
		return {
			openPositions: data.openPositions ?? 0,
			recommendedCandidatesCount: data.recommendedCandidatesCount ?? 0,
			pipelineHealth: data.pipelineHealth ?? "",
			candidates: Array.isArray(data.candidates) ? data.candidates : []
		};
	},
	async getCharts() {
		const response = await apiInstance.get("/ai-insights/charts");
		const data = response.data?.data ?? response.data ?? {};
		return {
			skillGap: Array.isArray(data.skillGap) ? data.skillGap : [],
			headcountForecast: Array.isArray(data.headcountForecast) ? data.headcountForecast : [],
			hiringDemand: Array.isArray(data.hiringDemand) ? data.hiringDemand : [],
			satisfactionTrend: Array.isArray(data.satisfactionTrend) ? data.satisfactionTrend : []
		};
	},
	async getRecommendations() {
		const response = await apiInstance.get("/ai-insights/recommendations");
		const data = response.data?.data ?? response.data;
		return Array.isArray(data) ? data : [];
	}
};
var fetchAIInsightsDashboard = createAsyncThunk("aiInsights/fetchDashboard", async (_, thunkAPI) => {
	try {
		return await aiInsightsApi.getDashboard();
	} catch (err) {
		try {
			const [kpiRes, attritionRes, burnoutRes, attendanceRes, performanceRes, recruitmentRes, chartsRes, recommendationsRes] = await Promise.allSettled([
				aiInsightsApi.getKpi(),
				aiInsightsApi.getAttrition(),
				aiInsightsApi.getBurnout(),
				aiInsightsApi.getAttendance(),
				aiInsightsApi.getPerformance(),
				aiInsightsApi.getRecruitment(),
				aiInsightsApi.getCharts(),
				aiInsightsApi.getRecommendations()
			]);
			const dashboardData = {
				kpi: kpiRes.status === "fulfilled" ? kpiRes.value : void 0,
				attrition: attritionRes.status === "fulfilled" ? attritionRes.value : void 0,
				burnout: burnoutRes.status === "fulfilled" ? burnoutRes.value : void 0,
				attendance: attendanceRes.status === "fulfilled" ? attendanceRes.value : void 0,
				performance: performanceRes.status === "fulfilled" ? performanceRes.value : void 0,
				recruitment: recruitmentRes.status === "fulfilled" ? recruitmentRes.value : void 0,
				charts: chartsRes.status === "fulfilled" ? chartsRes.value : void 0,
				recommendations: recommendationsRes.status === "fulfilled" ? recommendationsRes.value : void 0
			};
			if (![
				kpiRes,
				attritionRes,
				burnoutRes,
				attendanceRes,
				performanceRes,
				recruitmentRes,
				chartsRes,
				recommendationsRes
			].some((res) => res.status === "fulfilled")) return thunkAPI.rejectWithValue(getErrorMessage$1(err, "Failed to load AI Insights dashboard data"));
			return dashboardData;
		} catch {
			return thunkAPI.rejectWithValue(getErrorMessage$1(err, "Failed to load AI Insights dashboard data"));
		}
	}
});
var fetchKpi = createAsyncThunk("aiInsights/fetchKpi", async (_, thunkAPI) => {
	try {
		return await aiInsightsApi.getKpi();
	} catch (err) {
		return thunkAPI.rejectWithValue(getErrorMessage$1(err, "Failed to load KPI metrics"));
	}
});
var fetchAttrition = createAsyncThunk("aiInsights/fetchAttrition", async (_, thunkAPI) => {
	try {
		return await aiInsightsApi.getAttrition();
	} catch (err) {
		return thunkAPI.rejectWithValue(getErrorMessage$1(err, "Failed to load attrition predictions"));
	}
});
var fetchBurnout = createAsyncThunk("aiInsights/fetchBurnout", async (_, thunkAPI) => {
	try {
		return await aiInsightsApi.getBurnout();
	} catch (err) {
		return thunkAPI.rejectWithValue(getErrorMessage$1(err, "Failed to load burnout data"));
	}
});
var fetchAttendance = createAsyncThunk("aiInsights/fetchAttendance", async (_, thunkAPI) => {
	try {
		return await aiInsightsApi.getAttendance();
	} catch (err) {
		return thunkAPI.rejectWithValue(getErrorMessage$1(err, "Failed to load attendance insights"));
	}
});
var fetchPerformance = createAsyncThunk("aiInsights/fetchPerformance", async (_, thunkAPI) => {
	try {
		return await aiInsightsApi.getPerformance();
	} catch (err) {
		return thunkAPI.rejectWithValue(getErrorMessage$1(err, "Failed to load performance data"));
	}
});
var fetchRecruitment = createAsyncThunk("aiInsights/fetchRecruitment", async (_, thunkAPI) => {
	try {
		return await aiInsightsApi.getRecruitment();
	} catch (err) {
		return thunkAPI.rejectWithValue(getErrorMessage$1(err, "Failed to load recruitment data"));
	}
});
var fetchCharts = createAsyncThunk("aiInsights/fetchCharts", async (_, thunkAPI) => {
	try {
		return await aiInsightsApi.getCharts();
	} catch (err) {
		return thunkAPI.rejectWithValue(getErrorMessage$1(err, "Failed to load chart datasets"));
	}
});
var fetchRecommendations = createAsyncThunk("aiInsights/fetchRecommendations", async (_, thunkAPI) => {
	try {
		return await aiInsightsApi.getRecommendations();
	} catch (err) {
		return thunkAPI.rejectWithValue(getErrorMessage$1(err, "Failed to load recommendations"));
	}
});
var initialState$14 = {
	loading: false,
	error: null,
	lastUpdated: null,
	dashboard: null,
	kpi: [],
	attrition: [],
	burnout: [],
	attendance: [],
	recruitment: null,
	performance: null,
	charts: null,
	alerts: [],
	recommendations: [],
	documents: []
};
var aiInsightsSlice = createSlice({
	name: "aiInsights",
	initialState: initialState$14,
	reducers: {
		clearError(state) {
			state.error = null;
		},
		resetState() {
			return initialState$14;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(fetchAIInsightsDashboard.pending, (state) => {
			state.loading = true;
			state.error = null;
		}).addCase(fetchAIInsightsDashboard.fulfilled, (state, action) => {
			state.loading = false;
			state.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
			const data = action.payload;
			if (data.has_data !== void 0) state.hasDataFlag = data.has_data;
			if (data.partial !== void 0) state.partial = data.partial;
			if (data.errors !== void 0) state.partialErrors = data.errors;
			if (data.summary !== void 0) state.dashboard = data.summary;
			if (Array.isArray(data.kpi)) state.kpi = data.kpi;
			if (Array.isArray(data.attrition)) state.attrition = data.attrition;
			if (Array.isArray(data.burnout)) state.burnout = data.burnout;
			if (Array.isArray(data.attendance)) state.attendance = data.attendance;
			if (data.recruitment) state.recruitment = {
				...data.recruitment,
				candidates: Array.isArray(data.recruitment.candidates) ? data.recruitment.candidates : []
			};
			if (data.performance) state.performance = {
				...data.performance,
				topPerformers: Array.isArray(data.performance.topPerformers) ? data.performance.topPerformers : [],
				supportPerformers: Array.isArray(data.performance.supportPerformers) ? data.performance.supportPerformers : [],
				skillGap: Array.isArray(data.performance.skillGap) ? data.performance.skillGap : []
			};
			if (data.charts) state.charts = {
				skillGap: Array.isArray(data.charts.skillGap) ? data.charts.skillGap : [],
				headcountForecast: Array.isArray(data.charts.headcountForecast) ? data.charts.headcountForecast : [],
				hiringDemand: Array.isArray(data.charts.hiringDemand) ? data.charts.hiringDemand : [],
				satisfactionTrend: Array.isArray(data.charts.satisfactionTrend) ? data.charts.satisfactionTrend : []
			};
			if (Array.isArray(data.alerts)) state.alerts = data.alerts;
			if (Array.isArray(data.recommendations)) state.recommendations = data.recommendations;
			if (Array.isArray(data.documents)) state.documents = data.documents;
		}).addCase(fetchAIInsightsDashboard.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload ?? action.error.message ?? "Failed to fetch AI Insights dashboard";
		});
		builder.addCase(fetchKpi.fulfilled, (state, action) => {
			state.kpi = Array.isArray(action.payload) ? action.payload : [];
		});
		builder.addCase(fetchAttrition.fulfilled, (state, action) => {
			state.attrition = Array.isArray(action.payload) ? action.payload : [];
		});
		builder.addCase(fetchBurnout.fulfilled, (state, action) => {
			state.burnout = Array.isArray(action.payload) ? action.payload : [];
		});
		builder.addCase(fetchAttendance.fulfilled, (state, action) => {
			state.attendance = Array.isArray(action.payload) ? action.payload : [];
		});
		builder.addCase(fetchPerformance.fulfilled, (state, action) => {
			if (action.payload) state.performance = {
				topPerformers: Array.isArray(action.payload.topPerformers) ? action.payload.topPerformers : [],
				supportPerformers: Array.isArray(action.payload.supportPerformers) ? action.payload.supportPerformers : [],
				skillGap: Array.isArray(action.payload.skillGap) ? action.payload.skillGap : []
			};
		});
		builder.addCase(fetchRecruitment.fulfilled, (state, action) => {
			if (action.payload) state.recruitment = {
				openPositions: action.payload.openPositions ?? 0,
				recommendedCandidatesCount: action.payload.recommendedCandidatesCount ?? 0,
				pipelineHealth: action.payload.pipelineHealth ?? "",
				candidates: Array.isArray(action.payload.candidates) ? action.payload.candidates : []
			};
		});
		builder.addCase(fetchCharts.fulfilled, (state, action) => {
			if (action.payload) state.charts = {
				skillGap: Array.isArray(action.payload.skillGap) ? action.payload.skillGap : [],
				headcountForecast: Array.isArray(action.payload.headcountForecast) ? action.payload.headcountForecast : [],
				hiringDemand: Array.isArray(action.payload.hiringDemand) ? action.payload.hiringDemand : [],
				satisfactionTrend: Array.isArray(action.payload.satisfactionTrend) ? action.payload.satisfactionTrend : []
			};
		});
		builder.addCase(fetchRecommendations.fulfilled, (state, action) => {
			state.recommendations = Array.isArray(action.payload) ? action.payload : [];
		});
	}
});
var { clearError: clearError$9, resetState: resetState$7 } = aiInsightsSlice.actions;
var aiInsightsSlice_default = aiInsightsSlice.reducer;
function normalizeRiskByCategoryItems(raw) {
	if (!raw) return [];
	const body = typeof raw === "object" && raw !== null && "data" in raw ? raw.data : raw;
	if (!body) return [];
	if (Array.isArray(body)) return body.map((r) => ({
		c: String(r.c ?? r.category ?? r.risk_category ?? r.name ?? "General"),
		n: Number(r.n ?? r.risk_count ?? r.riskCount ?? r.count ?? 1)
	}));
	const catList = body.risks_by_category ?? body.risksByCategory;
	if (Array.isArray(catList)) return catList.map((r) => ({
		c: String(r.c ?? r.category ?? r.risk_category ?? r.name ?? "General"),
		n: Number(r.n ?? r.risk_count ?? r.riskCount ?? r.count ?? 1)
	}));
	if (Array.isArray(body.risks)) {
		const categoryCounts = {};
		for (const item of body.risks) {
			const cat = String(item.risk_category ?? item.category ?? item.title ?? "General");
			categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
		}
		return Object.entries(categoryCounts).map(([c, n]) => ({
			c,
			n
		}));
	}
	return [];
}
function normalizeComplianceDashboardData(data) {
	if (!data || typeof data !== "object") return {
		summary: void 0,
		kpi: [],
		risks: [],
		charts: void 0
	};
	const raw = data.data !== void 0 && typeof data.data === "object" ? data.data : data;
	let summary = void 0;
	if (raw.summary && typeof raw.summary === "object") {
		const s = raw.summary;
		const rawReadiness = s.auditReadiness ?? s.audit_readiness;
		summary = {
			complianceScore: Number(s.complianceScore ?? s.compliance_score ?? 0),
			openRisks: Number(s.openRisks ?? s.open_risks ?? 0),
			missingDocs: Number(s.missingDocs ?? s.missing_docs ?? 0),
			auditReadiness: typeof rawReadiness === "string" ? parseFloat(rawReadiness) || 0 : Number(rawReadiness ?? 0),
			lastAnalysis: s.lastAnalysis ? String(s.lastAnalysis) : void 0
		};
	} else if (raw.complianceScore !== void 0 || raw.compliance_score !== void 0 || raw.openRisks !== void 0 || raw.open_risks !== void 0 || raw.missingDocs !== void 0 || raw.missing_docs !== void 0 || raw.auditReadiness !== void 0 || raw.audit_readiness !== void 0) {
		const rawReadiness = raw.auditReadiness ?? raw.audit_readiness;
		summary = {
			complianceScore: Number(raw.complianceScore ?? raw.compliance_score ?? 0),
			openRisks: Number(raw.openRisks ?? raw.open_risks ?? 0),
			missingDocs: Number(raw.missingDocs ?? raw.missing_docs ?? 0),
			auditReadiness: typeof rawReadiness === "string" ? parseFloat(rawReadiness) || 0 : Number(rawReadiness ?? 0),
			lastAnalysis: raw.lastAnalysis ? String(raw.lastAnalysis) : void 0
		};
	}
	const rawCharts = raw.charts;
	const complianceTrend = (Array.isArray(rawCharts?.complianceTrend) ? rawCharts.complianceTrend : Array.isArray(raw.complianceTrend) ? raw.complianceTrend : Array.isArray(raw.compliance_trend) ? raw.compliance_trend : []).map((t) => ({
		m: String(t.m ?? t.month ?? t.label ?? t.period ?? ""),
		score: Number(t.score ?? t.compliance_score ?? t.complianceScore ?? t.value ?? 0)
	}));
	const risksByCategory = (Array.isArray(rawCharts?.risksByCategory) ? rawCharts.risksByCategory : Array.isArray(raw.risksByCategory) ? raw.risksByCategory : Array.isArray(raw.risks_by_category) ? raw.risks_by_category : []).map((r) => ({
		c: String(r.c ?? r.category ?? r.risk_category ?? r.name ?? ""),
		n: Number(r.n ?? r.risk_count ?? r.riskCount ?? r.count ?? 0)
	}));
	const charts = {
		complianceTrend,
		risksByCategory
	};
	const kpi = Array.isArray(raw.kpi) ? raw.kpi : [];
	const risks = Array.isArray(raw.risks) ? raw.risks : [];
	return {
		summary,
		kpi,
		risks,
		charts,
		complianceTrend,
		risksByCategory
	};
}
var complianceApi = {
	async getDashboard() {
		const response = await apiInstance.get("/ai/compliance/dashboard");
		return normalizeComplianceDashboardData(response.data?.data ?? response.data);
	},
	async getRisks() {
		const response = await apiInstance.get("/ai/compliance/risks");
		return normalizeRiskByCategoryItems(response.data?.data ?? response.data);
	}
};
var fetchComplianceDashboard = createAsyncThunk("compliance/fetchDashboard", async (_, thunkAPI) => {
	try {
		return await complianceApi.getDashboard();
	} catch (err) {
		try {
			return await complianceApi.getDashboard();
		} catch {
			try {
				const risks = await complianceApi.getRisks();
				if (risks && risks.length > 0) return {
					risksByCategory: risks,
					charts: {
						complianceTrend: [],
						risksByCategory: risks
					}
				};
				return thunkAPI.rejectWithValue(getErrorMessage$1(err, "Failed to load compliance dashboard data"));
			} catch {
				return thunkAPI.rejectWithValue(getErrorMessage$1(err, "Failed to load compliance dashboard data"));
			}
		}
	}
});
var fetchComplianceKpi = createAsyncThunk("compliance/fetchKpi", async (_, thunkAPI) => {
	try {
		return (await complianceApi.getDashboard()).kpi ?? [];
	} catch (err) {
		return thunkAPI.rejectWithValue(getErrorMessage$1(err, "Failed to load compliance KPI metrics"));
	}
});
var fetchComplianceRisks = createAsyncThunk("compliance/fetchRisks", async (_, thunkAPI) => {
	try {
		return await complianceApi.getRisks();
	} catch (err) {
		return thunkAPI.rejectWithValue(getErrorMessage$1(err, "Failed to load compliance risks"));
	}
});
var fetchComplianceTrend = createAsyncThunk("compliance/fetchTrend", async (_, thunkAPI) => {
	try {
		const data = await complianceApi.getDashboard();
		return data.charts?.complianceTrend ?? data.complianceTrend ?? [];
	} catch (err) {
		return thunkAPI.rejectWithValue(getErrorMessage$1(err, "Failed to load compliance trend"));
	}
});
var initialState$13 = {
	loading: false,
	error: null,
	lastUpdated: null,
	summary: null,
	kpi: [],
	risks: [],
	charts: null
};
var complianceSlice = createSlice({
	name: "compliance",
	initialState: initialState$13,
	reducers: {
		clearError(state) {
			state.error = null;
		},
		resetState() {
			return initialState$13;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(fetchComplianceDashboard.pending, (state) => {
			state.loading = true;
			state.error = null;
		}).addCase(fetchComplianceDashboard.fulfilled, (state, action) => {
			state.loading = false;
			state.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
			const data = action.payload;
			if (data.summary !== void 0) state.summary = data.summary;
			if (Array.isArray(data.kpi)) state.kpi = data.kpi;
			if (Array.isArray(data.risks)) state.risks = data.risks;
			if (data.charts) state.charts = {
				complianceTrend: Array.isArray(data.charts.complianceTrend) ? data.charts.complianceTrend : [],
				risksByCategory: Array.isArray(data.charts.risksByCategory) ? data.charts.risksByCategory : []
			};
			else if (data.complianceTrend || data.risksByCategory) state.charts = {
				complianceTrend: Array.isArray(data.complianceTrend) ? data.complianceTrend : [],
				risksByCategory: Array.isArray(data.risksByCategory) ? data.risksByCategory : []
			};
		}).addCase(fetchComplianceDashboard.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload ?? action.error.message ?? "Failed to fetch compliance dashboard";
		});
		builder.addCase(fetchComplianceKpi.fulfilled, (state, action) => {
			state.kpi = Array.isArray(action.payload) ? action.payload : [];
		});
		builder.addCase(fetchComplianceRisks.fulfilled, (state, action) => {
			if (Array.isArray(action.payload)) if (!state.charts) state.charts = {
				complianceTrend: [],
				risksByCategory: action.payload
			};
			else state.charts.risksByCategory = action.payload;
		});
		builder.addCase(fetchComplianceTrend.fulfilled, (state, action) => {
			if (Array.isArray(action.payload)) if (!state.charts) state.charts = {
				complianceTrend: action.payload,
				risksByCategory: []
			};
			else state.charts.complianceTrend = action.payload;
		});
	}
});
var { clearError: clearError$8, resetState: resetState$6 } = complianceSlice.actions;
var complianceSlice_default = complianceSlice.reducer;
function normalizeMeetingDashboardData(data) {
	if (!data || typeof data !== "object") return {
		summary: void 0,
		kpi: [],
		actionItems: [],
		charts: {
			actionItemsByWeek: [],
			meetingVolume: []
		},
		actionItemsByWeek: [],
		meetingVolume: []
	};
	let summary = void 0;
	const raw = data.summary && typeof data.summary === "object" ? data.summary : data;
	const meetingsAnalyzed = raw.meetings_analyzed ?? raw.meetingsAnalyzed;
	const actionItems = raw.action_items_count ?? (typeof raw.actionItems === "number" ? raw.actionItems : Array.isArray(raw.actionItems) ? raw.actionItems.length : void 0);
	const followUps = raw.follow_ups_count ?? raw.followUps;
	const avgDuration = raw.avg_duration ?? raw.avgDuration;
	if (meetingsAnalyzed !== void 0 || actionItems !== void 0 || followUps !== void 0 || avgDuration !== void 0) summary = {
		meetingsAnalyzed: Number(meetingsAnalyzed ?? 24),
		actionItems: Number(actionItems ?? 18),
		followUps: Number(followUps ?? 7),
		avgDuration: avgDuration != null ? typeof avgDuration === "number" ? `${avgDuration}m` : String(avgDuration) : "45m",
		lastAnalysis: raw.last_analysis ?? raw.lastAnalysis ?? "Live DB Sync"
	};
	const derivedKpi = summary ? [
		{
			label: "Meetings Analyzed",
			score: summary.meetingsAnalyzed,
			hint: "Total recorded sessions",
			icon: "Video"
		},
		{
			label: "Action Items",
			score: summary.actionItems,
			hint: "Extracted tasks pending",
			icon: "CheckSquare"
		},
		{
			label: "Follow-ups",
			score: summary.followUps,
			hint: "Open follow-up items",
			icon: "Clock"
		},
		{
			label: "Avg Duration",
			score: summary.avgDuration,
			hint: "Average session length",
			icon: "BarChart3"
		}
	] : [];
	const rawActionItems = data.charts?.actionItemsByWeek ?? data.actionItemsByWeek ?? data.action_items_by_week;
	const actionItemsByWeek = Array.isArray(rawActionItems) ? rawActionItems.map((item, idx) => ({
		w: item.w ?? item.week ?? `W${idx + 1}`,
		items: Number(item.items ?? item.count ?? item.action_items ?? 0)
	})) : [];
	const rawVolume = data.charts?.meetingVolume ?? data.meetingVolume ?? data.meeting_volume;
	const meetingVolume = Array.isArray(rawVolume) ? rawVolume.map((item, idx) => ({
		d: item.d ?? item.w ?? item.week ?? `W${idx + 1}`,
		n: Number(item.n ?? item.count ?? item.meetings ?? item.volume ?? 0),
		w: item.w ?? item.week ?? `W${idx + 1}`,
		count: Number(item.count ?? item.meetings ?? item.volume ?? 0)
	})) : [];
	const charts = {
		actionItemsByWeek,
		meetingVolume
	};
	return {
		summary,
		kpi: Array.isArray(data.kpi) && data.kpi.length > 0 ? data.kpi : derivedKpi,
		actionItems: Array.isArray(data.actionItems) ? data.actionItems : [],
		charts,
		actionItemsByWeek,
		meetingVolume
	};
}
var meetingIntelligenceApi = {
	async getDashboard() {
		const [dashRes, actionRes, volRes] = await Promise.allSettled([
			apiInstance.get("/ai/meeting/dashboard"),
			this.getActionItems(),
			this.getVolume()
		]);
		if (dashRes.status === "rejected") throw dashRes.reason;
		const rawData = dashRes.status === "fulfilled" ? dashRes.value.data?.data ?? dashRes.value.data : {};
		const actionItems = actionRes.status === "fulfilled" ? actionRes.value : [];
		const volume = volRes.status === "fulfilled" ? volRes.value : [];
		const actionItemsByWeek = Array.isArray(actionItems) && actionItems.length > 0 && "items" in (actionItems[0] || {}) ? actionItems : rawData?.actionItemsByWeek ?? [];
		return normalizeMeetingDashboardData({
			...typeof rawData === "object" && rawData !== null ? rawData : {},
			actionItemsByWeek: actionItemsByWeek.length > 0 ? actionItemsByWeek : rawData?.actionItemsByWeek ?? [],
			meetingVolume: volume.length > 0 ? volume : rawData?.meetingVolume ?? [],
			charts: {
				actionItemsByWeek: actionItemsByWeek.length > 0 ? actionItemsByWeek : rawData?.charts?.actionItemsByWeek ?? [],
				meetingVolume: volume.length > 0 ? volume : rawData?.charts?.meetingVolume ?? []
			}
		});
	},
	async getKpi() {
		try {
			const response = await apiInstance.get("/ai/meeting/kpi");
			const data = response.data?.data ?? response.data;
			if (Array.isArray(data)) return data;
			if (Array.isArray(data?.kpi)) return data.kpi;
			return [];
		} catch {
			return [];
		}
	},
	async getActionItems() {
		const response = await apiInstance.get("/ai/meeting/action-items");
		const data = response.data?.data ?? response.data;
		return Array.isArray(data) ? data : Array.isArray(data?.action_items) ? data.action_items : Array.isArray(data?.items) ? data.items : [];
	},
	async getVolume() {
		const response = await apiInstance.get("/ai/meeting/volume");
		const data = response.data?.data ?? response.data;
		return (Array.isArray(data) ? data : Array.isArray(data?.volume) ? data.volume : Array.isArray(data?.items) ? data.items : []).map((item, idx) => ({
			w: item.w ?? item.week ?? `W${idx + 1}`,
			count: Number(item.count ?? item.meetings ?? item.volume ?? 0)
		}));
	}
};
var fetchMeetingIntelligenceDashboard = createAsyncThunk("meetingIntelligence/fetchDashboard", async (_, thunkAPI) => {
	try {
		return await meetingIntelligenceApi.getDashboard();
	} catch (err) {
		try {
			const [kpiRes, actionItemsRes, volumeRes] = await Promise.allSettled([
				meetingIntelligenceApi.getKpi(),
				meetingIntelligenceApi.getActionItems(),
				meetingIntelligenceApi.getVolume()
			]);
			let actionItemsList = void 0;
			let actionItemsByWeek = void 0;
			if (actionItemsRes.status === "fulfilled" && Array.isArray(actionItemsRes.value)) {
				const first = actionItemsRes.value[0];
				if (first && "w" in first) actionItemsByWeek = actionItemsRes.value;
				else actionItemsList = actionItemsRes.value;
			}
			const meetingVolume = volumeRes.status === "fulfilled" && Array.isArray(volumeRes.value) ? volumeRes.value : void 0;
			const dashboardData = {
				kpi: kpiRes.status === "fulfilled" ? kpiRes.value : void 0,
				actionItems: actionItemsList,
				actionItemsByWeek,
				meetingVolume,
				charts: {
					actionItemsByWeek: actionItemsByWeek ?? [],
					meetingVolume: meetingVolume ?? []
				}
			};
			if (![
				kpiRes,
				actionItemsRes,
				volumeRes
			].some((res) => res.status === "fulfilled")) return thunkAPI.rejectWithValue(getErrorMessage$1(err, "Failed to load Meeting Intelligence dashboard data"));
			return dashboardData;
		} catch {
			return thunkAPI.rejectWithValue(getErrorMessage$1(err, "Failed to load Meeting Intelligence dashboard data"));
		}
	}
});
var fetchMeetingIntelligenceKpi = createAsyncThunk("meetingIntelligence/fetchKpi", async (_, thunkAPI) => {
	try {
		return await meetingIntelligenceApi.getKpi();
	} catch (err) {
		return thunkAPI.rejectWithValue(getErrorMessage$1(err, "Failed to load meeting intelligence KPI metrics"));
	}
});
var fetchMeetingActionItems$1 = createAsyncThunk("meetingIntelligence/fetchActionItems", async (_, thunkAPI) => {
	try {
		return await meetingIntelligenceApi.getActionItems();
	} catch (err) {
		return thunkAPI.rejectWithValue(getErrorMessage$1(err, "Failed to load meeting action items"));
	}
});
var fetchMeetingVolume = createAsyncThunk("meetingIntelligence/fetchVolume", async (_, thunkAPI) => {
	try {
		return await meetingIntelligenceApi.getVolume();
	} catch (err) {
		return thunkAPI.rejectWithValue(getErrorMessage$1(err, "Failed to load meeting volume"));
	}
});
var initialState$12 = {
	loading: false,
	error: null,
	lastUpdated: null,
	summary: null,
	kpi: [],
	actionItems: [],
	charts: null
};
var meetingIntelligenceSlice = createSlice({
	name: "meetingIntelligence",
	initialState: initialState$12,
	reducers: {
		clearError(state) {
			state.error = null;
		},
		resetState() {
			return initialState$12;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(fetchMeetingIntelligenceDashboard.pending, (state) => {
			state.loading = true;
			state.error = null;
		}).addCase(fetchMeetingIntelligenceDashboard.fulfilled, (state, action) => {
			state.loading = false;
			state.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
			const data = action.payload;
			if (data.summary !== void 0) state.summary = data.summary;
			if (Array.isArray(data.kpi)) state.kpi = data.kpi;
			if (Array.isArray(data.actionItems)) state.actionItems = data.actionItems;
			if (data.charts) state.charts = {
				actionItemsByWeek: Array.isArray(data.charts.actionItemsByWeek) ? data.charts.actionItemsByWeek : [],
				meetingVolume: Array.isArray(data.charts.meetingVolume) ? data.charts.meetingVolume : []
			};
			else if (data.actionItemsByWeek || data.meetingVolume) state.charts = {
				actionItemsByWeek: Array.isArray(data.actionItemsByWeek) ? data.actionItemsByWeek : [],
				meetingVolume: Array.isArray(data.meetingVolume) ? data.meetingVolume : []
			};
		}).addCase(fetchMeetingIntelligenceDashboard.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload ?? action.error.message ?? "Failed to fetch meeting intelligence dashboard";
		});
		builder.addCase(fetchMeetingIntelligenceKpi.fulfilled, (state, action) => {
			state.kpi = Array.isArray(action.payload) ? action.payload : [];
		});
		builder.addCase(fetchMeetingActionItems$1.fulfilled, (state, action) => {
			if (Array.isArray(action.payload)) {
				const first = action.payload[0];
				if (first && "w" in first) if (!state.charts) state.charts = {
					actionItemsByWeek: action.payload,
					meetingVolume: []
				};
				else state.charts.actionItemsByWeek = action.payload;
				else state.actionItems = action.payload;
			}
		});
		builder.addCase(fetchMeetingVolume.fulfilled, (state, action) => {
			if (Array.isArray(action.payload)) if (!state.charts) state.charts = {
				actionItemsByWeek: [],
				meetingVolume: action.payload
			};
			else state.charts.meetingVolume = action.payload;
		});
	}
});
var { clearError: clearError$7, resetState: resetState$5 } = meetingIntelligenceSlice.actions;
var meetingIntelligenceSlice_default = meetingIntelligenceSlice.reducer;
var policyAssistantApi = {
	/**
	* Policy Assistant is a chat-based assistant without a backend dashboard endpoint.
	* Returns a baseline state without making invalid network calls.
	*/
	async getDashboard() {
		return {
			summary: {
				queriesCount: 0,
				complianceRate: 100,
				lastAnalysis: "Live Knowledge Base"
			},
			recentQueries: []
		};
	},
	/**
	* Submit query to real AI Policy Assistant chat endpoint.
	* Calls POST /api/v1/ai/policy/chat.
	*/
	async askQuestion(question, conversationId) {
		const response = await apiInstance.post("/ai/policy/chat", {
			query: question,
			conversation_id: conversationId
		});
		const data = response.data?.data ?? response.data;
		const sources = Array.isArray(data?.sources) ? data.sources.map((s) => typeof s === "string" ? s : s?.document ? `${s.document}${s.section ? ` (${s.section})` : ""}` : JSON.stringify(s)) : [];
		return {
			question: data?.question ?? data?.query ?? question,
			answer: data?.answer ?? data?.reply ?? data?.message ?? "",
			confidence: data?.confidence,
			sources
		};
	}
};
var fetchPolicyAssistantDashboard = createAsyncThunk("policyAssistant/fetchDashboard", async (_, thunkAPI) => {
	try {
		return await policyAssistantApi.getDashboard();
	} catch (err) {
		return thunkAPI.rejectWithValue(getErrorMessage$1(err, "Failed to load policy assistant data"));
	}
});
var askPolicyQuestion = createAsyncThunk("policyAssistant/askQuestion", async (question, thunkAPI) => {
	try {
		return await policyAssistantApi.askQuestion(question);
	} catch (err) {
		return thunkAPI.rejectWithValue(getErrorMessage$1(err, "Unable to get an answer from Policy Assistant. Please try again."));
	}
});
var initialState$11 = {
	loading: false,
	asking: false,
	error: null,
	lastUpdated: null,
	summary: null,
	messages: [{
		role: "ai",
		text: "Hi! I'm your Policy Assistant. Ask me anything about HR, leave, attendance or payroll policies."
	}]
};
var policyAssistantSlice = createSlice({
	name: "policyAssistant",
	initialState: initialState$11,
	reducers: {
		clearError(state) {
			state.error = null;
		},
		resetChat(state) {
			state.messages = initialState$11.messages;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(fetchPolicyAssistantDashboard.pending, (state) => {
			state.loading = true;
			state.error = null;
		}).addCase(fetchPolicyAssistantDashboard.fulfilled, (state, action) => {
			state.loading = false;
			state.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
			if (action.payload.summary) state.summary = action.payload.summary;
		}).addCase(fetchPolicyAssistantDashboard.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload ?? action.error.message ?? "Failed to fetch policy assistant status";
		});
		builder.addCase(askPolicyQuestion.pending, (state, action) => {
			state.asking = true;
			state.error = null;
			state.messages.push({
				role: "user",
				text: action.meta.arg,
				timestamp: (/* @__PURE__ */ new Date()).toISOString()
			});
		}).addCase(askPolicyQuestion.fulfilled, (state, action) => {
			state.asking = false;
			state.messages.push({
				role: "ai",
				text: action.payload.answer && action.payload.answer.trim() ? action.payload.answer : "I found no direct policy clause matching your inquiry. Please consult your HR representative.",
				confidence: action.payload.confidence,
				sources: action.payload.sources,
				timestamp: (/* @__PURE__ */ new Date()).toISOString()
			});
		}).addCase(askPolicyQuestion.rejected, (state, action) => {
			state.asking = false;
			state.messages.push({
				role: "ai",
				text: action.payload ?? "Sorry, I encountered an issue querying the company policy knowledge base. Please try again.",
				timestamp: (/* @__PURE__ */ new Date()).toISOString()
			});
		});
	}
});
var { clearError: clearError$6, resetChat } = policyAssistantSlice.actions;
var policyAssistantSlice_default = policyAssistantSlice.reducer;
function normalizeEmployeeHealthData(data) {
	if (!data || typeof data !== "object") return {
		summary: void 0,
		kpi: [],
		charts: {
			burnoutRiskTrend: [],
			overtimeByTeam: []
		},
		burnoutRiskTrend: [],
		overtimeByTeam: []
	};
	let summary = void 0;
	const raw = data.summary && typeof data.summary === "object" ? data.summary : data;
	const wellbeingScore = raw.wellbeing_score ?? raw.wellbeingScore ?? raw.wellness_score ?? raw.wellnessScore;
	const burnoutRisk = raw.burnout_risk ?? raw.burnoutRisk ?? raw.burnout_risk_index ?? raw.burnoutRiskIndex;
	const avgWorkload = raw.avg_workload ?? raw.avgWorkload ?? raw.workload_hours;
	const otHours = raw.ot_hours ?? raw.otHours ?? raw.overtime_hours;
	if (wellbeingScore !== void 0 || burnoutRisk !== void 0 || avgWorkload !== void 0 || otHours !== void 0) summary = {
		wellbeingScore: Number(wellbeingScore ?? 84),
		burnoutRisk: Number(burnoutRisk ?? 12),
		avgWorkload: avgWorkload != null ? typeof avgWorkload === "number" ? `${avgWorkload}h` : String(avgWorkload) : "38.5h",
		otHours: Number(otHours ?? 14),
		lastAnalysis: raw.last_analysis ?? raw.lastAnalysis ?? "Live DB Sync"
	};
	const derivedKpi = summary ? [
		{
			label: "Wellbeing Score",
			score: summary.wellbeingScore,
			hint: "Company-wide wellbeing score",
			icon: "HeartPulse"
		},
		{
			label: "Burnout Risk",
			score: `${summary.burnoutRisk}%`,
			hint: "Employees showing risk indicators",
			icon: "Flame",
			invert: true
		},
		{
			label: "Avg Workload",
			score: summary.avgWorkload,
			hint: "Weekly hours per employee",
			icon: "Clock"
		},
		{
			label: "Overtime Hours",
			score: `${summary.otHours}h`,
			hint: "Total monthly overtime logged",
			icon: "ShieldAlert",
			invert: true
		}
	] : [];
	const rawBurnout = data.charts?.burnoutRiskTrend ?? data.burnoutRiskTrend ?? data.burnout_trend ?? data.burnout_risk_trend;
	const burnoutRiskTrend = Array.isArray(rawBurnout) ? rawBurnout.map((item, idx) => ({
		w: item.w ?? item.week ?? `W${idx + 1}`,
		risk: Number(item.risk ?? item.score ?? 0)
	})) : [];
	const rawOvertime = data.charts?.overtimeByTeam ?? data.overtimeByTeam ?? data.overtime ?? data.team_overtime;
	const overtimeByTeam = Array.isArray(rawOvertime) ? rawOvertime.map((item) => ({
		t: item.t ?? item.team ?? item.department ?? "Team",
		ot: Number(item.ot ?? item.hours ?? item.overtime_hours ?? 0)
	})) : [];
	const charts = {
		burnoutRiskTrend,
		overtimeByTeam
	};
	return {
		summary,
		kpi: Array.isArray(data.kpi) && data.kpi.length > 0 ? data.kpi : derivedKpi,
		charts,
		burnoutRiskTrend,
		overtimeByTeam
	};
}
var employeeHealthApi = {
	async getDashboard() {
		const [dashRes, trendRes, otRes] = await Promise.allSettled([
			apiInstance.get("/ai/employee-health/dashboard"),
			this.getBurnoutTrend(),
			this.getOvertime()
		]);
		if (dashRes.status === "rejected") throw dashRes.reason;
		const rawData = dashRes.status === "fulfilled" ? dashRes.value.data?.data ?? dashRes.value.data : {};
		const trend = trendRes.status === "fulfilled" ? trendRes.value : [];
		const ot = otRes.status === "fulfilled" ? otRes.value : [];
		return normalizeEmployeeHealthData({
			...typeof rawData === "object" && rawData !== null ? rawData : {},
			burnoutRiskTrend: trend.length > 0 ? trend : rawData?.burnoutRiskTrend ?? [],
			overtimeByTeam: ot.length > 0 ? ot : rawData?.overtimeByTeam ?? [],
			charts: {
				burnoutRiskTrend: trend.length > 0 ? trend : rawData?.charts?.burnoutRiskTrend ?? [],
				overtimeByTeam: ot.length > 0 ? ot : rawData?.charts?.overtimeByTeam ?? []
			}
		});
	},
	async getKpi() {
		return (await this.getDashboard()).kpi ?? [];
	},
	async getBurnoutTrend() {
		const response = await apiInstance.get("/ai/employee-health/burnout-trend");
		const data = response.data?.data ?? response.data;
		return (Array.isArray(data) ? data : Array.isArray(data?.trend) ? data.trend : Array.isArray(data?.items) ? data.items : []).map((item, idx) => ({
			w: item.w ?? item.week ?? `W${idx + 1}`,
			risk: Number(item.risk ?? item.score ?? 0)
		}));
	},
	async getOvertime() {
		const response = await apiInstance.get("/ai/employee-health/overtime");
		const data = response.data?.data ?? response.data;
		return (Array.isArray(data) ? data : Array.isArray(data?.overtime) ? data.overtime : Array.isArray(data?.teams) ? data.teams : Array.isArray(data?.items) ? data.items : []).map((item) => ({
			t: item.t ?? item.team ?? item.department ?? "Team",
			ot: Number(item.ot ?? item.hours ?? item.overtime_hours ?? 0)
		}));
	}
};
var fetchEmployeeHealthDashboard = createAsyncThunk("employeeHealth/fetchDashboard", async (_, thunkAPI) => {
	try {
		return await employeeHealthApi.getDashboard();
	} catch (err) {
		try {
			const [kpiRes, trendRes, otRes] = await Promise.allSettled([
				employeeHealthApi.getKpi(),
				employeeHealthApi.getBurnoutTrend(),
				employeeHealthApi.getOvertime()
			]);
			const burnoutRiskTrend = trendRes.status === "fulfilled" ? trendRes.value : void 0;
			const overtimeByTeam = otRes.status === "fulfilled" ? otRes.value : void 0;
			const dashboardData = {
				kpi: kpiRes.status === "fulfilled" ? kpiRes.value : void 0,
				burnoutRiskTrend,
				overtimeByTeam,
				charts: {
					burnoutRiskTrend: burnoutRiskTrend ?? [],
					overtimeByTeam: overtimeByTeam ?? []
				}
			};
			if (![
				kpiRes,
				trendRes,
				otRes
			].some((res) => res.status === "fulfilled")) return thunkAPI.rejectWithValue(getErrorMessage$1(err, "Failed to load employee health dashboard data"));
			return dashboardData;
		} catch {
			return thunkAPI.rejectWithValue(getErrorMessage$1(err, "Failed to load employee health dashboard data"));
		}
	}
});
var fetchEmployeeHealthKpi = createAsyncThunk("employeeHealth/fetchKpi", async (_, thunkAPI) => {
	try {
		return await employeeHealthApi.getKpi();
	} catch (err) {
		return thunkAPI.rejectWithValue(getErrorMessage$1(err, "Failed to load employee health KPI metrics"));
	}
});
var fetchBurnoutRiskTrend = createAsyncThunk("employeeHealth/fetchBurnoutRiskTrend", async (_, thunkAPI) => {
	try {
		return await employeeHealthApi.getBurnoutTrend();
	} catch (err) {
		return thunkAPI.rejectWithValue(getErrorMessage$1(err, "Failed to load burnout risk trend"));
	}
});
var fetchOvertimeByTeam = createAsyncThunk("employeeHealth/fetchOvertimeByTeam", async (_, thunkAPI) => {
	try {
		return await employeeHealthApi.getOvertime();
	} catch (err) {
		return thunkAPI.rejectWithValue(getErrorMessage$1(err, "Failed to load overtime by team"));
	}
});
var initialState$10 = {
	loading: false,
	error: null,
	lastUpdated: null,
	summary: null,
	kpi: [],
	charts: null
};
var employeeHealthSlice = createSlice({
	name: "employeeHealth",
	initialState: initialState$10,
	reducers: {
		clearError(state) {
			state.error = null;
		},
		resetState() {
			return initialState$10;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(fetchEmployeeHealthDashboard.pending, (state) => {
			state.loading = true;
			state.error = null;
		}).addCase(fetchEmployeeHealthDashboard.fulfilled, (state, action) => {
			state.loading = false;
			state.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
			const data = action.payload;
			if (data.summary !== void 0) state.summary = data.summary;
			if (Array.isArray(data.kpi)) state.kpi = data.kpi;
			if (data.charts) state.charts = {
				burnoutRiskTrend: Array.isArray(data.charts.burnoutRiskTrend) ? data.charts.burnoutRiskTrend : [],
				overtimeByTeam: Array.isArray(data.charts.overtimeByTeam) ? data.charts.overtimeByTeam : []
			};
			else if (data.burnoutRiskTrend || data.overtimeByTeam) state.charts = {
				burnoutRiskTrend: Array.isArray(data.burnoutRiskTrend) ? data.burnoutRiskTrend : [],
				overtimeByTeam: Array.isArray(data.overtimeByTeam) ? data.overtimeByTeam : []
			};
		}).addCase(fetchEmployeeHealthDashboard.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload ?? action.error.message ?? "Failed to fetch employee health dashboard";
		});
		builder.addCase(fetchEmployeeHealthKpi.fulfilled, (state, action) => {
			state.kpi = Array.isArray(action.payload) ? action.payload : [];
		});
		builder.addCase(fetchBurnoutRiskTrend.fulfilled, (state, action) => {
			if (Array.isArray(action.payload)) if (!state.charts) state.charts = {
				burnoutRiskTrend: action.payload,
				overtimeByTeam: []
			};
			else state.charts.burnoutRiskTrend = action.payload;
		});
		builder.addCase(fetchOvertimeByTeam.fulfilled, (state, action) => {
			if (Array.isArray(action.payload)) if (!state.charts) state.charts = {
				burnoutRiskTrend: [],
				overtimeByTeam: action.payload
			};
			else state.charts.overtimeByTeam = action.payload;
		});
	}
});
var { clearError: clearError$5, resetState: resetState$4 } = employeeHealthSlice.actions;
var employeeHealthSlice_default = employeeHealthSlice.reducer;
function normalizePerformanceCoachData(data) {
	if (!data || typeof data !== "object") return {
		summary: void 0,
		kpi: [],
		charts: {
			performanceTrend: [],
			kpiAttainment: []
		},
		performanceTrend: [],
		kpiAttainment: []
	};
	let summary = void 0;
	const raw = data.summary && typeof data.summary === "object" ? data.summary : data;
	const avgPerformance = raw.average_performance_score ?? raw.avgPerformance ?? raw.avg_performance;
	const topPerformers = raw.top_performers_count ?? raw.topPerformers ?? raw.top_performers;
	const skillGaps = raw.skill_gaps_count ?? raw.skillGaps ?? raw.skill_gaps;
	const promotionPicks = raw.promotion_picks_count ?? raw.promotionPicks ?? raw.promotion_picks;
	if (avgPerformance !== void 0 || topPerformers !== void 0 || skillGaps !== void 0 || promotionPicks !== void 0) summary = {
		avgPerformance: Number(avgPerformance ?? 3.8),
		topPerformers: Number(topPerformers ?? 0),
		skillGaps: Number(skillGaps ?? 0),
		promotionPicks: Number(promotionPicks ?? 0),
		lastAnalysis: raw.last_analysis ?? raw.lastAnalysis ?? "Live DB Sync"
	};
	const derivedKpi = summary ? [
		{
			label: "Avg Performance",
			score: typeof summary.avgPerformance === "number" ? summary.avgPerformance.toFixed(1) : summary.avgPerformance,
			hint: "Company average score",
			icon: "Star"
		},
		{
			label: "Top Performers",
			score: summary.topPerformers,
			hint: "Scoring >= 4.5 this cycle",
			icon: "Trophy"
		},
		{
			label: "Skill Gaps",
			score: summary.skillGaps,
			hint: "Identified gap areas",
			icon: "Target",
			invert: true
		},
		{
			label: "Promotion Picks",
			score: summary.promotionPicks,
			hint: "Ready for advancement",
			icon: "Award"
		}
	] : [];
	const rawTrend = data.charts?.performanceTrend ?? data.performanceTrend ?? data.trends;
	const performanceTrend = Array.isArray(rawTrend) ? rawTrend.map((t, idx) => ({
		q: t.q ?? t.label ?? t.period ?? `Q${idx + 1}`,
		team: Number(t.team ?? t.score ?? 0),
		top: Number(t.top ?? (t.score ? Number(t.score) + .6 : 0))
	})) : [];
	const rawAttainment = data.charts?.kpiAttainment ?? data.kpiAttainment ?? data.kpi_attainment ?? (Array.isArray(data.functions) ? data.functions : void 0);
	const kpiAttainment = Array.isArray(rawAttainment) ? rawAttainment.map((item) => ({
		f: item.f ?? item.function ?? item.name ?? "Function",
		att: Number(item.att ?? item.attainment ?? item.kpi_attainment_pct ?? 0)
	})) : [];
	const charts = {
		performanceTrend,
		kpiAttainment
	};
	return {
		summary,
		kpi: Array.isArray(data.kpi) && data.kpi.length > 0 ? data.kpi : derivedKpi,
		charts,
		performanceTrend,
		kpiAttainment
	};
}
var performanceCoachApi = {
	async getDashboard() {
		const [dashRes, trendRes, attRes] = await Promise.allSettled([
			apiInstance.get("/ai/performance/dashboard"),
			this.getTrend(),
			this.getAttainment()
		]);
		if (dashRes.status === "rejected") throw dashRes.reason;
		const rawData = dashRes.status === "fulfilled" ? dashRes.value.data?.data ?? dashRes.value.data : {};
		const trend = trendRes.status === "fulfilled" ? trendRes.value : [];
		const att = attRes.status === "fulfilled" ? attRes.value : [];
		return normalizePerformanceCoachData({
			...typeof rawData === "object" && rawData !== null ? rawData : {},
			performanceTrend: trend.length > 0 ? trend : rawData?.performanceTrend ?? [],
			kpiAttainment: att.length > 0 ? att : rawData?.kpiAttainment ?? [],
			charts: {
				performanceTrend: trend.length > 0 ? trend : rawData?.charts?.performanceTrend ?? [],
				kpiAttainment: att.length > 0 ? att : rawData?.charts?.kpiAttainment ?? []
			}
		});
	},
	async getKpi() {
		return (await this.getDashboard()).kpi ?? [];
	},
	async getTrend() {
		const response = await apiInstance.get("/ai/performance/trends");
		const data = response.data?.data ?? response.data;
		return (Array.isArray(data) ? data : Array.isArray(data?.trends) ? data.trends : Array.isArray(data?.items) ? data.items : []).map((t, idx) => ({
			q: t.q ?? t.label ?? t.period ?? `Q${idx + 1}`,
			team: Number(t.team ?? t.score ?? 0),
			top: Number(t.top ?? (t.score ? Number(t.score) + .6 : 0))
		}));
	},
	async getAttainment() {
		const response = await apiInstance.get("/ai/performance/kpi-attainment");
		const data = response.data?.data ?? response.data;
		return (Array.isArray(data) ? data : Array.isArray(data?.functions) ? data.functions : Array.isArray(data?.attainment) ? data.attainment : Array.isArray(data?.items) ? data.items : []).map((item) => ({
			f: item.f ?? item.function ?? item.name ?? "Function",
			att: Number(item.att ?? item.attainment ?? item.kpi_attainment_pct ?? 0)
		}));
	}
};
var fetchPerformanceCoachDashboard = createAsyncThunk("performanceCoach/fetchDashboard", async (_, thunkAPI) => {
	try {
		return await performanceCoachApi.getDashboard();
	} catch (err) {
		try {
			const [kpiRes, trendRes, attRes] = await Promise.allSettled([
				performanceCoachApi.getKpi(),
				performanceCoachApi.getTrend(),
				performanceCoachApi.getAttainment()
			]);
			const performanceTrend = trendRes.status === "fulfilled" ? trendRes.value : void 0;
			const kpiAttainment = attRes.status === "fulfilled" ? attRes.value : void 0;
			const dashboardData = {
				kpi: kpiRes.status === "fulfilled" ? kpiRes.value : void 0,
				performanceTrend,
				kpiAttainment,
				charts: {
					performanceTrend: performanceTrend ?? [],
					kpiAttainment: kpiAttainment ?? []
				}
			};
			if (![
				kpiRes,
				trendRes,
				attRes
			].some((res) => res.status === "fulfilled")) return thunkAPI.rejectWithValue(getErrorMessage$1(err, "Failed to load performance coach dashboard data"));
			return dashboardData;
		} catch {
			return thunkAPI.rejectWithValue(getErrorMessage$1(err, "Failed to load performance coach dashboard data"));
		}
	}
});
var fetchPerformanceCoachKpi = createAsyncThunk("performanceCoach/fetchKpi", async (_, thunkAPI) => {
	try {
		return await performanceCoachApi.getKpi();
	} catch (err) {
		return thunkAPI.rejectWithValue(getErrorMessage$1(err, "Failed to load performance coach KPI metrics"));
	}
});
var fetchPerformanceTrend = createAsyncThunk("performanceCoach/fetchTrend", async (_, thunkAPI) => {
	try {
		return await performanceCoachApi.getTrend();
	} catch (err) {
		return thunkAPI.rejectWithValue(getErrorMessage$1(err, "Failed to load performance trend"));
	}
});
var fetchKpiAttainment = createAsyncThunk("performanceCoach/fetchAttainment", async (_, thunkAPI) => {
	try {
		return await performanceCoachApi.getAttainment();
	} catch (err) {
		return thunkAPI.rejectWithValue(getErrorMessage$1(err, "Failed to load KPI attainment"));
	}
});
var initialState$9 = {
	loading: false,
	error: null,
	lastUpdated: null,
	summary: null,
	kpi: [],
	charts: null
};
var performanceCoachSlice = createSlice({
	name: "performanceCoach",
	initialState: initialState$9,
	reducers: {
		clearError(state) {
			state.error = null;
		},
		resetState() {
			return initialState$9;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(fetchPerformanceCoachDashboard.pending, (state) => {
			state.loading = true;
			state.error = null;
		}).addCase(fetchPerformanceCoachDashboard.fulfilled, (state, action) => {
			state.loading = false;
			state.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
			const data = action.payload;
			if (data.summary !== void 0) state.summary = data.summary;
			if (Array.isArray(data.kpi)) state.kpi = data.kpi;
			if (data.charts) state.charts = {
				performanceTrend: Array.isArray(data.charts.performanceTrend) ? data.charts.performanceTrend : [],
				kpiAttainment: Array.isArray(data.charts.kpiAttainment) ? data.charts.kpiAttainment : []
			};
			else if (data.performanceTrend || data.kpiAttainment) state.charts = {
				performanceTrend: Array.isArray(data.performanceTrend) ? data.performanceTrend : [],
				kpiAttainment: Array.isArray(data.kpiAttainment) ? data.kpiAttainment : []
			};
		}).addCase(fetchPerformanceCoachDashboard.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload ?? action.error.message ?? "Failed to fetch performance coach dashboard";
		});
		builder.addCase(fetchPerformanceCoachKpi.fulfilled, (state, action) => {
			state.kpi = Array.isArray(action.payload) ? action.payload : [];
		});
		builder.addCase(fetchPerformanceTrend.fulfilled, (state, action) => {
			if (Array.isArray(action.payload)) if (!state.charts) state.charts = {
				performanceTrend: action.payload,
				kpiAttainment: []
			};
			else state.charts.performanceTrend = action.payload;
		});
		builder.addCase(fetchKpiAttainment.fulfilled, (state, action) => {
			if (Array.isArray(action.payload)) if (!state.charts) state.charts = {
				performanceTrend: [],
				kpiAttainment: action.payload
			};
			else state.charts.kpiAttainment = action.payload;
		});
	}
});
var { clearError: clearError$4, resetState: resetState$3 } = performanceCoachSlice.actions;
var performanceCoachSlice_default = performanceCoachSlice.reducer;
function normalizeLeaveAssistantData(data) {
	if (!data || typeof data !== "object") return {
		summary: void 0,
		kpi: [],
		charts: {
			leaveForecast: [],
			leaveTypeDistribution: []
		},
		leaveForecast: [],
		leaveTypeDistribution: []
	};
	let summary = void 0;
	const raw = data.summary && typeof data.summary === "object" ? data.summary : data;
	const pendingRequests = raw.pending_leave_requests ?? raw.pendingRequests ?? raw.pendingApprovals;
	const approvalSuggestions = raw.approval_suggestions_count ?? raw.approvalSuggestions;
	const conflictsDetected = raw.leave_conflicts_count ?? raw.conflictsDetected;
	const teamAvail = raw.team_availability_percentage ?? raw.teamAvailability;
	if (pendingRequests !== void 0 || approvalSuggestions !== void 0 || conflictsDetected !== void 0 || teamAvail !== void 0) summary = {
		pendingRequests: Number(pendingRequests ?? 0),
		approvalSuggestions: Number(approvalSuggestions ?? 0),
		conflictsDetected: Number(conflictsDetected ?? 0),
		teamAvailability: teamAvail != null ? typeof teamAvail === "number" ? `${Math.round(teamAvail)}%` : String(teamAvail) : "100%",
		lastAnalysis: raw.last_analysis ?? raw.lastAnalysis ?? "Live DB Sync"
	};
	const derivedKpi = summary ? [
		{
			label: "Pending Requests",
			score: summary.pendingRequests,
			hint: "Applications awaiting review",
			icon: "CalendarCheck"
		},
		{
			label: "Approval Suggestions",
			score: summary.approvalSuggestions,
			hint: "AI recommendations ready",
			icon: "CheckCircle"
		},
		{
			label: "Conflicts Detected",
			score: summary.conflictsDetected,
			hint: "Overlapping team leaves flagged",
			icon: "AlertTriangle",
			invert: true
		},
		{
			label: "Team Availability",
			score: summary.teamAvailability,
			hint: "Staff capacity this week",
			icon: "Users"
		}
	] : [];
	const rawForecast = data.charts?.leaveForecast ?? data.leaveForecast ?? data.forecast;
	const leaveForecast = Array.isArray(rawForecast) ? rawForecast.map((item, idx) => ({
		w: item.w ?? item.week ?? item.period ?? `W${idx + 1}`,
		leaves: Number(item.leaves ?? item.req ?? item.requests ?? item.count ?? 0),
		req: Number(item.req ?? item.requests ?? item.count ?? 0),
		conf: Number(item.conf ?? item.conflicts ?? 0)
	})) : [];
	const rawDist = data.charts?.leaveTypeDistribution ?? data.leaveTypeDistribution ?? data.distribution;
	const leaveTypeDistribution = Array.isArray(rawDist) ? rawDist.map((item) => ({
		t: item.t ?? item.type ?? item.leave_type ?? item.label ?? "General",
		days: Number(item.days ?? item.pct ?? item.percentage ?? item.share ?? 0),
		type: item.type ?? item.leave_type ?? item.label ?? "General",
		pct: Number(item.pct ?? item.percentage ?? item.share ?? 0)
	})) : [];
	const charts = {
		leaveForecast,
		leaveTypeDistribution
	};
	return {
		summary,
		kpi: Array.isArray(data.kpi) && data.kpi.length > 0 ? data.kpi : derivedKpi,
		charts,
		leaveForecast,
		leaveTypeDistribution
	};
}
var leaveAssistantApi = {
	async getDashboard() {
		const [dashRes, forecastRes, distRes] = await Promise.allSettled([
			apiInstance.get("/ai/leave/dashboard"),
			this.getForecast(),
			this.getDistribution()
		]);
		if (dashRes.status === "rejected") throw dashRes.reason;
		const rawData = dashRes.status === "fulfilled" ? dashRes.value.data?.data ?? dashRes.value.data : {};
		const forecast = forecastRes.status === "fulfilled" ? forecastRes.value : [];
		const dist = distRes.status === "fulfilled" ? distRes.value : [];
		return normalizeLeaveAssistantData({
			...typeof rawData === "object" && rawData !== null ? rawData : {},
			leaveForecast: forecast.length > 0 ? forecast : rawData?.leaveForecast ?? [],
			leaveTypeDistribution: dist.length > 0 ? dist : rawData?.leaveTypeDistribution ?? [],
			charts: {
				leaveForecast: forecast.length > 0 ? forecast : rawData?.charts?.leaveForecast ?? [],
				leaveTypeDistribution: dist.length > 0 ? dist : rawData?.charts?.leaveTypeDistribution ?? []
			}
		});
	},
	async getKpi() {
		return (await this.getDashboard()).kpi ?? [];
	},
	async getForecast() {
		const response = await apiInstance.get("/ai/leave/forecast");
		const data = response.data?.data ?? response.data;
		return (Array.isArray(data) ? data : Array.isArray(data?.forecast) ? data.forecast : Array.isArray(data?.items) ? data.items : []).map((item, idx) => ({
			w: item.w ?? item.week ?? item.period ?? `W${idx + 1}`,
			req: Number(item.req ?? item.requests ?? item.count ?? 0),
			conf: Number(item.conf ?? item.conflicts ?? 0)
		}));
	},
	async getDistribution() {
		const response = await apiInstance.get("/ai/leave/distribution");
		const data = response.data?.data ?? response.data;
		return (Array.isArray(data) ? data : Array.isArray(data?.distribution) ? data.distribution : Array.isArray(data?.items) ? data.items : []).map((item) => ({
			type: item.type ?? item.leave_type ?? item.label ?? "General",
			pct: Number(item.pct ?? item.percentage ?? item.share ?? 0)
		}));
	}
};
var fetchLeaveAssistantDashboard = createAsyncThunk("leaveAssistant/fetchDashboard", async (_, thunkAPI) => {
	try {
		return await leaveAssistantApi.getDashboard();
	} catch (err) {
		try {
			const [kpiRes, forecastRes, distRes] = await Promise.allSettled([
				leaveAssistantApi.getKpi(),
				leaveAssistantApi.getForecast(),
				leaveAssistantApi.getDistribution()
			]);
			const leaveForecast = forecastRes.status === "fulfilled" ? forecastRes.value : void 0;
			const leaveTypeDistribution = distRes.status === "fulfilled" ? distRes.value : void 0;
			const dashboardData = {
				kpi: kpiRes.status === "fulfilled" ? kpiRes.value : void 0,
				leaveForecast,
				leaveTypeDistribution,
				charts: {
					leaveForecast: leaveForecast ?? [],
					leaveTypeDistribution: leaveTypeDistribution ?? []
				}
			};
			if (![
				kpiRes,
				forecastRes,
				distRes
			].some((res) => res.status === "fulfilled")) return thunkAPI.rejectWithValue(getErrorMessage$1(err, "Failed to load leave assistant dashboard data"));
			return dashboardData;
		} catch {
			return thunkAPI.rejectWithValue(getErrorMessage$1(err, "Failed to load leave assistant dashboard data"));
		}
	}
});
var fetchLeaveAssistantKpi = createAsyncThunk("leaveAssistant/fetchKpi", async (_, thunkAPI) => {
	try {
		return await leaveAssistantApi.getKpi();
	} catch (err) {
		return thunkAPI.rejectWithValue(getErrorMessage$1(err, "Failed to load leave assistant KPI metrics"));
	}
});
var fetchLeaveForecast = createAsyncThunk("leaveAssistant/fetchForecast", async (_, thunkAPI) => {
	try {
		return await leaveAssistantApi.getForecast();
	} catch (err) {
		return thunkAPI.rejectWithValue(getErrorMessage$1(err, "Failed to load leave forecast"));
	}
});
var fetchLeaveTypeDistribution = createAsyncThunk("leaveAssistant/fetchDistribution", async (_, thunkAPI) => {
	try {
		return await leaveAssistantApi.getDistribution();
	} catch (err) {
		return thunkAPI.rejectWithValue(getErrorMessage$1(err, "Failed to load leave type distribution"));
	}
});
var initialState$8 = {
	loading: false,
	error: null,
	lastUpdated: null,
	summary: null,
	kpi: [],
	charts: null
};
var leaveAssistantSlice = createSlice({
	name: "leaveAssistant",
	initialState: initialState$8,
	reducers: {
		clearError(state) {
			state.error = null;
		},
		resetState() {
			return initialState$8;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(fetchLeaveAssistantDashboard.pending, (state) => {
			state.loading = true;
			state.error = null;
		}).addCase(fetchLeaveAssistantDashboard.fulfilled, (state, action) => {
			state.loading = false;
			state.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
			const data = action.payload;
			if (data.summary !== void 0) state.summary = data.summary;
			if (Array.isArray(data.kpi)) state.kpi = data.kpi;
			if (data.charts) state.charts = {
				leaveForecast: Array.isArray(data.charts.leaveForecast) ? data.charts.leaveForecast : [],
				leaveTypeDistribution: Array.isArray(data.charts.leaveTypeDistribution) ? data.charts.leaveTypeDistribution : []
			};
			else if (data.leaveForecast || data.leaveTypeDistribution) state.charts = {
				leaveForecast: Array.isArray(data.leaveForecast) ? data.leaveForecast : [],
				leaveTypeDistribution: Array.isArray(data.leaveTypeDistribution) ? data.leaveTypeDistribution : []
			};
		}).addCase(fetchLeaveAssistantDashboard.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload ?? action.error.message ?? "Failed to fetch leave assistant dashboard";
		});
		builder.addCase(fetchLeaveAssistantKpi.fulfilled, (state, action) => {
			state.kpi = Array.isArray(action.payload) ? action.payload : [];
		});
		builder.addCase(fetchLeaveForecast.fulfilled, (state, action) => {
			if (Array.isArray(action.payload)) if (!state.charts) state.charts = {
				leaveForecast: action.payload,
				leaveTypeDistribution: []
			};
			else state.charts.leaveForecast = action.payload;
		});
		builder.addCase(fetchLeaveTypeDistribution.fulfilled, (state, action) => {
			if (Array.isArray(action.payload)) if (!state.charts) state.charts = {
				leaveForecast: [],
				leaveTypeDistribution: action.payload
			};
			else state.charts.leaveTypeDistribution = action.payload;
		});
	}
});
var { clearError: clearError$3, resetState: resetState$2 } = leaveAssistantSlice.actions;
var leaveAssistantSlice_default = leaveAssistantSlice.reducer;
function normalizeCandidateFunnel(data) {
	return (Array.isArray(data) ? data : Array.isArray(data?.funnel) ? data.funnel : Array.isArray(data?.items) ? data.items : []).map((item, idx) => {
		return {
			w: item.w ?? item.week ?? `W${idx + 1}`,
			applied: Number(item.applied ?? 0),
			shortlist: Number(item.shortlist ?? item.shortlisted ?? 0),
			offers: Number(item.offers ?? item.offer_accepted ?? item.offer_sent ?? 0)
		};
	});
}
function normalizeMatchDistribution(data) {
	if (Array.isArray(data)) return data.map((item) => ({
		band: String(item.band ?? item.label ?? ""),
		n: Number(item.n ?? item.count ?? item.candidates ?? 0)
	}));
	if (data && typeof data === "object") {
		const nested = data.distribution ?? data.items ?? data.buckets;
		if (Array.isArray(nested)) return normalizeMatchDistribution(nested);
		if (data.band_90_100 !== void 0 || data.band_80_89 !== void 0 || data.band_70_79 !== void 0 || data.band_60_69 !== void 0 || data.below_60 !== void 0) return [
			{
				band: "90–100%",
				n: Number(data.band_90_100 ?? 0)
			},
			{
				band: "80–89%",
				n: Number(data.band_80_89 ?? 0)
			},
			{
				band: "70–79%",
				n: Number(data.band_70_79 ?? 0)
			},
			{
				band: "60–69%",
				n: Number(data.band_60_69 ?? 0)
			},
			{
				band: "<60%",
				n: Number(data.below_60 ?? 0)
			}
		];
	}
	return [];
}
function normalizeRecruiterData(data) {
	if (!data || typeof data !== "object") return {
		summary: void 0,
		kpi: [],
		charts: {
			candidateFunnel: [],
			jdMatchDistribution: []
		},
		candidateFunnel: [],
		jdMatchDistribution: []
	};
	let summary = void 0;
	const rawSummary = data.summary && typeof data.summary === "object" ? data.summary : data;
	const openRoles = rawSummary.open_roles ?? rawSummary.openRoles;
	const candidatesScreened = rawSummary.candidates_screened ?? rawSummary.candidatesScreened;
	const topMatches = rawSummary.top_matches ?? rawSummary.topMatches;
	const timeToHire = rawSummary.average_time_to_hire ?? rawSummary.time_to_hire ?? rawSummary.timeToHire;
	if (openRoles !== void 0 || candidatesScreened !== void 0 || topMatches !== void 0 || timeToHire !== void 0) summary = {
		openRoles: Number(openRoles ?? 0),
		candidatesScreened: typeof candidatesScreened === "number" ? candidatesScreened : candidatesScreened != null ? Number(candidatesScreened) || candidatesScreened : 0,
		topMatches: Number(topMatches ?? 0),
		timeToHire: timeToHire != null ? typeof timeToHire === "number" ? Math.round(timeToHire * 10) / 10 : timeToHire : "—",
		jdMatchAvg: rawSummary.jd_match_avg ?? rawSummary.jdMatchAvg,
		lastAnalysis: rawSummary.last_analysis ?? rawSummary.lastAnalysis ?? "Live DB Sync"
	};
	const derivedKpi = summary ? [
		{
			label: "Open Roles",
			score: summary.openRoles,
			hint: "Active job openings",
			icon: "Briefcase"
		},
		{
			label: "Candidates Screened",
			score: typeof summary.candidatesScreened === "number" ? summary.candidatesScreened.toLocaleString() : summary.candidatesScreened,
			hint: "Resumes parsed & scored",
			icon: "FileSearch"
		},
		{
			label: "Top Matches",
			score: summary.topMatches,
			hint: "Match score ≥ 75%",
			icon: "Trophy"
		},
		{
			label: "Time to Hire",
			score: typeof summary.timeToHire === "number" ? `${summary.timeToHire}d` : summary.timeToHire,
			hint: "Average days to hire",
			icon: "BarChart3",
			invert: true
		}
	] : [];
	const candidateFunnel = normalizeCandidateFunnel(data.charts?.candidateFunnel ?? data.candidateFunnel ?? data.funnel ?? []);
	const jdMatchDistribution = normalizeMatchDistribution(data.charts?.jdMatchDistribution ?? data.jdMatchDistribution ?? data.distribution ?? data.matchDistribution ?? []);
	const charts = {
		candidateFunnel,
		jdMatchDistribution
	};
	return {
		summary,
		kpi: Array.isArray(data.kpi) && data.kpi.length > 0 ? data.kpi : derivedKpi,
		charts,
		candidateFunnel,
		jdMatchDistribution
	};
}
var recruiterApi = {
	async getDashboard() {
		const [dashRes, funnelRes, distRes] = await Promise.allSettled([
			apiInstance.get("/ai/recruiter/dashboard"),
			this.getFunnel(),
			this.getMatchDistribution()
		]);
		if (dashRes.status === "rejected") throw dashRes.reason;
		const rawData = dashRes.status === "fulfilled" ? dashRes.value.data?.data ?? dashRes.value.data : {};
		const funnel = funnelRes.status === "fulfilled" ? funnelRes.value : [];
		const dist = distRes.status === "fulfilled" ? distRes.value : [];
		return normalizeRecruiterData({
			...typeof rawData === "object" && rawData !== null ? rawData : {},
			candidateFunnel: funnel.length > 0 ? funnel : rawData?.candidateFunnel ?? [],
			jdMatchDistribution: dist.length > 0 ? dist : rawData?.jdMatchDistribution ?? [],
			charts: {
				candidateFunnel: funnel.length > 0 ? funnel : rawData?.charts?.candidateFunnel ?? [],
				jdMatchDistribution: dist.length > 0 ? dist : rawData?.charts?.jdMatchDistribution ?? []
			}
		});
	},
	async getKpi() {
		const response = await apiInstance.get("/ai/recruiter/dashboard");
		return normalizeRecruiterData(response.data?.data ?? response.data).kpi ?? [];
	},
	async getFunnel() {
		const response = await apiInstance.get("/ai/recruiter/funnel");
		return normalizeCandidateFunnel(response.data?.data ?? response.data);
	},
	async getMatchDistribution() {
		const response = await apiInstance.get("/ai/recruiter/match-distribution");
		return normalizeMatchDistribution(response.data?.data ?? response.data);
	},
	async getDistribution() {
		return this.getMatchDistribution();
	},
	async getAnalytics() {
		const response = await apiInstance.get("/ai/recruiter/analytics");
		return response.data?.data ?? response.data;
	}
};
var fetchRecruiterDashboard = createAsyncThunk("aiRecruiter/fetchDashboard", async (_, thunkAPI) => {
	try {
		return await recruiterApi.getDashboard();
	} catch (err) {
		try {
			const [kpiRes, funnelRes, distRes] = await Promise.allSettled([
				recruiterApi.getKpi(),
				recruiterApi.getFunnel(),
				recruiterApi.getDistribution()
			]);
			const candidateFunnel = funnelRes.status === "fulfilled" ? funnelRes.value : void 0;
			const jdMatchDistribution = distRes.status === "fulfilled" ? distRes.value : void 0;
			const dashboardData = {
				kpi: kpiRes.status === "fulfilled" ? kpiRes.value : void 0,
				candidateFunnel,
				jdMatchDistribution,
				charts: {
					candidateFunnel: candidateFunnel ?? [],
					jdMatchDistribution: jdMatchDistribution ?? []
				}
			};
			if (![
				kpiRes,
				funnelRes,
				distRes
			].some((res) => res.status === "fulfilled")) return thunkAPI.rejectWithValue(getErrorMessage$1(err, "Failed to load recruiter dashboard data"));
			return dashboardData;
		} catch {
			return thunkAPI.rejectWithValue(getErrorMessage$1(err, "Failed to load recruiter dashboard data"));
		}
	}
});
var fetchRecruiterKpi = createAsyncThunk("aiRecruiter/fetchKpi", async (_, thunkAPI) => {
	try {
		return await recruiterApi.getKpi();
	} catch (err) {
		return thunkAPI.rejectWithValue(getErrorMessage$1(err, "Failed to load recruiter KPI metrics"));
	}
});
var fetchCandidateFunnel = createAsyncThunk("aiRecruiter/fetchFunnel", async (_, thunkAPI) => {
	try {
		return await recruiterApi.getFunnel();
	} catch (err) {
		return thunkAPI.rejectWithValue(getErrorMessage$1(err, "Failed to load candidate funnel"));
	}
});
var fetchJdMatchDistribution = createAsyncThunk("aiRecruiter/fetchDistribution", async (_, thunkAPI) => {
	try {
		return await recruiterApi.getDistribution();
	} catch (err) {
		return thunkAPI.rejectWithValue(getErrorMessage$1(err, "Failed to load JD match distribution"));
	}
});
var initialState$7 = {
	loading: false,
	error: null,
	lastUpdated: null,
	summary: null,
	kpi: [],
	charts: null
};
var recruiterSlice = createSlice({
	name: "aiRecruiter",
	initialState: initialState$7,
	reducers: {
		clearError(state) {
			state.error = null;
		},
		resetState() {
			return initialState$7;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(fetchRecruiterDashboard.pending, (state) => {
			state.loading = true;
			state.error = null;
		}).addCase(fetchRecruiterDashboard.fulfilled, (state, action) => {
			state.loading = false;
			state.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
			const data = action.payload;
			if (data.summary !== void 0) state.summary = data.summary;
			if (Array.isArray(data.kpi)) state.kpi = data.kpi;
			if (data.charts) state.charts = {
				candidateFunnel: Array.isArray(data.charts.candidateFunnel) ? data.charts.candidateFunnel : [],
				jdMatchDistribution: Array.isArray(data.charts.jdMatchDistribution) ? data.charts.jdMatchDistribution : []
			};
			else if (data.candidateFunnel || data.jdMatchDistribution) state.charts = {
				candidateFunnel: Array.isArray(data.candidateFunnel) ? data.candidateFunnel : [],
				jdMatchDistribution: Array.isArray(data.jdMatchDistribution) ? data.jdMatchDistribution : []
			};
		}).addCase(fetchRecruiterDashboard.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload ?? action.error.message ?? "Failed to fetch recruiter dashboard";
		});
		builder.addCase(fetchRecruiterKpi.fulfilled, (state, action) => {
			state.kpi = Array.isArray(action.payload) ? action.payload : [];
		});
		builder.addCase(fetchCandidateFunnel.fulfilled, (state, action) => {
			if (Array.isArray(action.payload)) if (!state.charts) state.charts = {
				candidateFunnel: action.payload,
				jdMatchDistribution: []
			};
			else state.charts.candidateFunnel = action.payload;
		});
		builder.addCase(fetchJdMatchDistribution.fulfilled, (state, action) => {
			if (Array.isArray(action.payload)) if (!state.charts) state.charts = {
				candidateFunnel: [],
				jdMatchDistribution: action.payload
			};
			else state.charts.jdMatchDistribution = action.payload;
		});
	}
});
var { clearError: clearError$2, resetState: resetState$1 } = recruiterSlice.actions;
var recruiterSlice_default = recruiterSlice.reducer;
function normalizeWorkforceInsightsData(data) {
	if (!data || typeof data !== "object") return {
		summary: void 0,
		kpi: [],
		charts: {
			headcountTrends: [],
			departmentComparison: []
		},
		headcountTrends: [],
		departmentComparison: []
	};
	let summary = void 0;
	const raw = data.summary && typeof data.summary === "object" ? data.summary : data;
	const workforceHealth = raw.workforce_health ?? raw.workforceHealth ?? (raw.capacity_utilization_pct != null ? Math.round(raw.capacity_utilization_pct) : void 0);
	const attritionRisk = raw.attrition_risk ?? raw.attritionRisk ?? (raw.vacancy_rate != null ? `${Math.round(raw.vacancy_rate)}%` : void 0);
	const productivityScore = raw.productivity_score ?? raw.productivityScore ?? (raw.capacity_utilization_pct != null ? Math.round(raw.capacity_utilization_pct) : void 0);
	const headcount = raw.headcount ?? raw.workforce_size ?? raw.active_employees;
	if (workforceHealth !== void 0 || attritionRisk !== void 0 || productivityScore !== void 0 || headcount !== void 0) summary = {
		workforceHealth: Number(workforceHealth ?? 88),
		attritionRisk: attritionRisk != null ? typeof attritionRisk === "number" ? `${attritionRisk}%` : String(attritionRisk) : "4.2%",
		productivityScore: Number(productivityScore ?? 91),
		headcount: Number(headcount ?? 0),
		riskSignalsCount: raw.risk_signals_count ?? raw.riskSignalsCount ?? 3,
		lastAnalysis: raw.last_analysis ?? raw.lastAnalysis ?? "Live DB Sync"
	};
	const derivedKpi = summary ? [
		{
			label: "Workforce Health",
			score: summary.workforceHealth,
			hint: "Workforce health index",
			icon: "HeartPulse"
		},
		{
			label: "Attrition Risk",
			score: summary.attritionRisk,
			hint: "Employees flagged at risk",
			icon: "UserMinus",
			invert: true
		},
		{
			label: "Productivity Score",
			score: summary.productivityScore,
			hint: "Composite team productivity",
			icon: "Zap"
		},
		{
			label: "Headcount",
			score: summary.headcount,
			hint: "Active workforce count",
			icon: "Users"
		}
	] : [];
	const rawTrends = data.charts?.headcountTrends ?? data.headcountTrends ?? data.headcount_trends;
	const headcountTrends = Array.isArray(rawTrends) && rawTrends.length > 0 ? rawTrends.map((t, idx) => ({
		m: t.m ?? t.month ?? t.period ?? `M${idx + 1}`,
		hc: Number(t.hc ?? t.headcount ?? t.count ?? 0)
	})) : summary ? [
		{
			m: "Jan",
			hc: Math.max(10, summary.headcount - 15)
		},
		{
			m: "Feb",
			hc: Math.max(10, summary.headcount - 12)
		},
		{
			m: "Mar",
			hc: Math.max(10, summary.headcount - 8)
		},
		{
			m: "Apr",
			hc: Math.max(10, summary.headcount - 5)
		},
		{
			m: "May",
			hc: Math.max(10, summary.headcount - 2)
		},
		{
			m: "Jun",
			hc: summary.headcount
		}
	] : [];
	const rawDepts = data.charts?.departmentComparison ?? data.departmentComparison ?? data.department_comparison;
	const departmentComparison = Array.isArray(rawDepts) && rawDepts.length > 0 ? rawDepts.map((d) => ({
		d: d.d ?? d.department ?? d.name ?? "Team",
		prod: Number(d.prod ?? d.productivity ?? 90),
		risk: Number(d.risk ?? d.attrition_risk ?? 5)
	})) : [
		{
			d: "Engineering",
			prod: 92,
			risk: 4
		},
		{
			d: "Product",
			prod: 88,
			risk: 6
		},
		{
			d: "Sales",
			prod: 95,
			risk: 8
		},
		{
			d: "Marketing",
			prod: 84,
			risk: 5
		},
		{
			d: "Operations",
			prod: 89,
			risk: 3
		}
	];
	const charts = {
		headcountTrends,
		departmentComparison
	};
	return {
		summary,
		kpi: Array.isArray(data.kpi) && data.kpi.length > 0 ? data.kpi : derivedKpi,
		charts,
		headcountTrends,
		departmentComparison
	};
}
var workforceInsightsApi = {
	async getDashboard() {
		const response = await apiInstance.get("/ai-brain/workforce-insights");
		return normalizeWorkforceInsightsData(response.data?.data ?? response.data);
	},
	async getKpi() {
		return (await this.getDashboard()).kpi ?? [];
	},
	async getHeadcountTrends() {
		return (await this.getDashboard()).charts?.headcountTrends ?? [];
	},
	async getDepartmentComparison() {
		return (await this.getDashboard()).charts?.departmentComparison ?? [];
	}
};
var fetchWorkforceInsightsDashboard = createAsyncThunk("workforceInsights/fetchDashboard", async (_, thunkAPI) => {
	try {
		return await workforceInsightsApi.getDashboard();
	} catch (err) {
		try {
			const [kpiRes, hcRes, deptRes] = await Promise.allSettled([
				workforceInsightsApi.getKpi(),
				workforceInsightsApi.getHeadcountTrends(),
				workforceInsightsApi.getDepartmentComparison()
			]);
			const headcountTrends = hcRes.status === "fulfilled" ? hcRes.value : void 0;
			const departmentComparison = deptRes.status === "fulfilled" ? deptRes.value : void 0;
			const dashboardData = {
				kpi: kpiRes.status === "fulfilled" ? kpiRes.value : void 0,
				headcountTrends,
				departmentComparison,
				charts: {
					headcountTrends: headcountTrends ?? [],
					departmentComparison: departmentComparison ?? []
				}
			};
			if (![
				kpiRes,
				hcRes,
				deptRes
			].some((res) => res.status === "fulfilled")) return thunkAPI.rejectWithValue(getErrorMessage$1(err, "Failed to load workforce insights dashboard data"));
			return dashboardData;
		} catch {
			return thunkAPI.rejectWithValue(getErrorMessage$1(err, "Failed to load workforce insights dashboard data"));
		}
	}
});
var fetchWorkforceInsightsKpi = createAsyncThunk("workforceInsights/fetchKpi", async (_, thunkAPI) => {
	try {
		return await workforceInsightsApi.getKpi();
	} catch (err) {
		return thunkAPI.rejectWithValue(getErrorMessage$1(err, "Failed to load workforce insights KPI metrics"));
	}
});
var fetchHeadcountTrends = createAsyncThunk("workforceInsights/fetchHeadcountTrends", async (_, thunkAPI) => {
	try {
		return await workforceInsightsApi.getHeadcountTrends();
	} catch (err) {
		return thunkAPI.rejectWithValue(getErrorMessage$1(err, "Failed to load headcount trends"));
	}
});
var fetchDepartmentComparison = createAsyncThunk("workforceInsights/fetchDepartmentComparison", async (_, thunkAPI) => {
	try {
		return await workforceInsightsApi.getDepartmentComparison();
	} catch (err) {
		return thunkAPI.rejectWithValue(getErrorMessage$1(err, "Failed to load department comparison"));
	}
});
var initialState$6 = {
	loading: false,
	error: null,
	lastUpdated: null,
	summary: null,
	kpi: [],
	charts: null
};
var workforceInsightsSlice = createSlice({
	name: "workforceInsights",
	initialState: initialState$6,
	reducers: {
		clearError(state) {
			state.error = null;
		},
		resetState() {
			return initialState$6;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(fetchWorkforceInsightsDashboard.pending, (state) => {
			state.loading = true;
			state.error = null;
		}).addCase(fetchWorkforceInsightsDashboard.fulfilled, (state, action) => {
			state.loading = false;
			state.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
			const data = action.payload;
			if (data.summary !== void 0) state.summary = data.summary;
			if (Array.isArray(data.kpi)) state.kpi = data.kpi;
			if (data.charts) state.charts = {
				headcountTrends: Array.isArray(data.charts.headcountTrends) ? data.charts.headcountTrends : [],
				departmentComparison: Array.isArray(data.charts.departmentComparison) ? data.charts.departmentComparison : []
			};
			else if (data.headcountTrends || data.departmentComparison) state.charts = {
				headcountTrends: Array.isArray(data.headcountTrends) ? data.headcountTrends : [],
				departmentComparison: Array.isArray(data.departmentComparison) ? data.departmentComparison : []
			};
		}).addCase(fetchWorkforceInsightsDashboard.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload ?? action.error.message ?? "Failed to fetch workforce insights dashboard";
		});
		builder.addCase(fetchWorkforceInsightsKpi.fulfilled, (state, action) => {
			state.kpi = Array.isArray(action.payload) ? action.payload : [];
		});
		builder.addCase(fetchHeadcountTrends.fulfilled, (state, action) => {
			if (Array.isArray(action.payload)) if (!state.charts) state.charts = {
				headcountTrends: action.payload,
				departmentComparison: []
			};
			else state.charts.headcountTrends = action.payload;
		});
		builder.addCase(fetchDepartmentComparison.fulfilled, (state, action) => {
			if (Array.isArray(action.payload)) if (!state.charts) state.charts = {
				headcountTrends: [],
				departmentComparison: action.payload
			};
			else state.charts.departmentComparison = action.payload;
		});
	}
});
var { clearError: clearError$1, resetState } = workforceInsightsSlice.actions;
var workforceInsightsSlice_default = workforceInsightsSlice.reducer;
function extractData$3(res, fallback) {
	const r = res;
	const body = r?.data !== void 0 && (r?.status !== void 0 || r?.headers !== void 0) ? r.data : res;
	if (body == null) return fallback;
	if (typeof body === "object") {
		const b = body;
		if ("data" in b && b.data !== void 0) return b.data;
		if ("result" in b && b.result !== void 0) return b.result;
	}
	return body ?? fallback;
}
var profileApi = {
	async getCurrentUser() {
		try {
			const data = extractData$3(await apiInstance.get("/users/me"));
			if (data && typeof data === "object") return {
				id: String(data.id ?? ""),
				fullName: String(data.fullName ?? data.full_name ?? data.name ?? ""),
				name: String(data.name ?? data.fullName ?? ""),
				email: String(data.email ?? ""),
				phone: String(data.phone ?? data.phone_number ?? ""),
				designation: String(data.designation ?? data.title ?? ""),
				department: String(data.department ?? ""),
				bio: String(data.bio ?? ""),
				avatarUrl: String(data.avatarUrl ?? data.avatar_url ?? data.avatar ?? ""),
				role: String(data.role ?? ""),
				timezone: String(data.timezone ?? ""),
				language: String(data.language ?? ""),
				createdAt: String(data.createdAt ?? data.created_at ?? "")
			};
		} catch {}
		try {
			const authData = extractData$3(await apiInstance.get(AUTH_ENDPOINTS.me));
			if (authData && typeof authData === "object") return {
				id: String(authData.id ?? ""),
				fullName: String(authData.fullName ?? authData.full_name ?? authData.name ?? ""),
				name: String(authData.name ?? authData.fullName ?? ""),
				email: String(authData.email ?? ""),
				phone: String(authData.phone ?? authData.phone_number ?? ""),
				designation: String(authData.designation ?? authData.title ?? ""),
				department: String(authData.department ?? ""),
				bio: String(authData.bio ?? ""),
				avatarUrl: String(authData.avatarUrl ?? authData.avatar_url ?? authData.avatar ?? ""),
				role: String(authData.role ?? ""),
				timezone: String(authData.timezone ?? "UTC+05:30 (IST)"),
				language: String(authData.language ?? "en"),
				createdAt: String(authData.createdAt ?? authData.created_at ?? "")
			};
		} catch {}
		const ws = aurix.get();
		return {
			id: ws.user?.id || "",
			fullName: ws.user?.fullName || "Active User",
			name: ws.user?.fullName || "Active User",
			email: ws.user?.email || "",
			phone: ws.user?.phone || "",
			designation: "",
			department: "",
			bio: "",
			avatarUrl: "",
			role: ws.user?.role || "employee",
			timezone: "UTC+05:30 (IST)",
			language: "en",
			createdAt: ws.user?.createdAt || (/* @__PURE__ */ new Date()).toISOString()
		};
	},
	async updateCurrentUser(payload) {
		const fullName = payload.fullName;
		const cleanPayload = {};
		if (fullName !== void 0 && fullName !== null) cleanPayload.fullName = fullName;
		if (payload.email !== void 0 && payload.email !== null) cleanPayload.email = payload.email;
		if (payload.phone !== void 0 && payload.phone !== null) cleanPayload.phone = payload.phone;
		if (payload.designation !== void 0 && payload.designation !== null) cleanPayload.designation = payload.designation;
		if (payload.department !== void 0 && payload.department !== null) cleanPayload.department = payload.department;
		if (payload.bio !== void 0 && payload.bio !== null) cleanPayload.bio = payload.bio;
		const data = extractData$3(await apiInstance.put("/settings/profile", cleanPayload), cleanPayload);
		const ws = aurix.get();
		const updatedProfile = {
			id: String(data?.id ?? ws.user?.id ?? ""),
			fullName: String(data?.fullName ?? data?.full_name ?? fullName ?? ws.user?.fullName ?? ""),
			name: String(data?.fullName ?? data?.full_name ?? fullName ?? ws.user?.fullName ?? ""),
			email: String(data?.email ?? payload.email ?? ws.user?.email ?? ""),
			phone: String(data?.phone ?? payload.phone ?? ws.user?.phone ?? ""),
			designation: String(data?.designation ?? payload.designation ?? ""),
			department: String(data?.department ?? payload.department ?? ""),
			bio: String(data?.bio ?? payload.bio ?? ""),
			avatarUrl: String(data?.avatarUrl ?? data?.avatar_url ?? ""),
			role: String(data?.role ?? ws.user?.role ?? "employee"),
			timezone: String(data?.timezone ?? "UTC+05:30 (IST)"),
			language: String(data?.language ?? "en"),
			createdAt: String(data?.createdAt ?? data?.created_at ?? ws.user?.createdAt ?? "")
		};
		if (ws.user) aurix.set({ user: {
			...ws.user,
			fullName: updatedProfile.fullName,
			email: updatedProfile.email,
			phone: updatedProfile.phone || ws.user.phone || ""
		} });
		return updatedProfile;
	},
	async uploadAvatar(file) {
		let formData;
		if (file instanceof FormData) formData = file;
		else {
			formData = new FormData();
			formData.append("avatar", file);
			formData.append("file", file);
		}
		const data = extractData$3(await apiInstance.post("/users/me/avatar", formData, { headers: { "Content-Type": "multipart/form-data" } }));
		return {
			avatarUrl: typeof data === "string" ? data : String(data?.avatarUrl ?? data?.avatar_url ?? data?.url ?? ""),
			user: typeof data === "object" && data?.user ? extractData$3(data.user) : void 0
		};
	},
	async deleteAvatar() {
		const data = extractData$3(await apiInstance.delete("/users/me/avatar"));
		return {
			success: true,
			avatarUrl: String(data?.avatarUrl ?? "")
		};
	},
	async changePassword(payload) {
		try {
			const res = await apiInstance.patch(AUTH_ENDPOINTS.changePassword, {
				current_password: payload.currentPassword,
				new_password: payload.newPassword,
				confirm_password: payload.confirmPassword ?? payload.newPassword
			});
			const resObj = res?.data ?? res;
			return {
				success: resObj?.success ?? true,
				message: resObj?.message || resObj?.data?.message || "Password changed successfully."
			};
		} catch (err) {
			const parsed = parseApiError(err, "Failed to change password");
			let message = parsed.message;
			if (parsed.status === 400 && (!message || message === "Failed to change password" || message === "An error occurred")) message = "New password must be different from current password or passwords do not match.";
			else if (parsed.status === 401 && (!message || message === "Failed to change password" || message === "An error occurred")) message = "Current password is incorrect.";
			else if (parsed.status === 404 && (!message || message === "Failed to change password" || message === "An error occurred")) message = "User not found.";
			else if (parsed.status === 422 && (!message || message === "Failed to change password" || message === "An error occurred")) message = Object.values(parsed.fieldErrors)[0] || "Invalid password format. Please verify password requirements.";
			else if (parsed.status === 500 && (!message || message === "Failed to change password" || message === "An error occurred")) message = "Internal server error occurred while changing password. Please try again later.";
			throw new ApiError(message, parsed.status, parsed.fieldErrors);
		}
	},
	async getSessions() {
		const data = extractData$3(await apiInstance.get("/users/me/sessions"), []);
		return (Array.isArray(data) ? data : Array.isArray(data?.sessions) ? data.sessions : Array.isArray(data?.items) ? data.items : []).map((s) => ({
			id: String(s.id ?? s.session_id ?? Math.random().toString(36).substring(2, 9)),
			device: String(s.device ?? s.user_agent ?? s.deviceName ?? "Unknown Device"),
			ip: String(s.ip ?? s.ip_address ?? "127.0.0.1"),
			lastActive: String(s.lastActive ?? s.last_active ?? s.updated_at ?? "Just now"),
			current: Boolean(s.current ?? s.is_current ?? false),
			location: s.location ? String(s.location) : void 0,
			browser: s.browser ? String(s.browser) : void 0,
			os: s.os ? String(s.os) : void 0
		}));
	},
	async revokeSession(sessionId) {
		if (sessionId) try {
			await apiInstance.delete(`/users/me/sessions/${sessionId}`);
		} catch (err) {
			const error = err;
			if (error?.response?.status === 404 || error?.response?.status === 405) await apiInstance.delete("/users/me/sessions", {
				data: {
					sessionId,
					session_id: sessionId
				},
				params: { sessionId }
			});
			else throw err;
		}
		else await apiInstance.delete("/users/me/sessions");
		return {
			success: true,
			sessionId
		};
	},
	async getPreferences() {
		const data = extractData$3(await apiInstance.get("/users/me/preferences"));
		return {
			theme: data?.theme ?? "system",
			emailNotifications: Boolean(data?.emailNotifications ?? data?.email_notifications ?? true),
			pushNotifications: Boolean(data?.pushNotifications ?? data?.push_notifications ?? true),
			soundEnabled: Boolean(data?.soundEnabled ?? data?.sound_enabled ?? true),
			language: String(data?.language ?? "en"),
			timezone: String(data?.timezone ?? "UTC+05:30 (IST)"),
			dateFormat: String(data?.dateFormat ?? data?.date_format ?? "DD/MM/YYYY")
		};
	},
	async updatePreferences(payload) {
		const data = extractData$3(await apiInstance.patch("/users/me/preferences", payload));
		return {
			theme: data?.theme ?? payload.theme ?? "system",
			emailNotifications: Boolean(data?.emailNotifications ?? data?.email_notifications ?? payload.emailNotifications ?? true),
			pushNotifications: Boolean(data?.pushNotifications ?? data?.push_notifications ?? payload.pushNotifications ?? true),
			soundEnabled: Boolean(data?.soundEnabled ?? data?.sound_enabled ?? payload.soundEnabled ?? true),
			language: String(data?.language ?? payload.language ?? "en"),
			timezone: String(data?.timezone ?? payload.timezone ?? "UTC+05:30 (IST)"),
			dateFormat: String(data?.dateFormat ?? data?.date_format ?? payload.dateFormat ?? "DD/MM/YYYY")
		};
	}
};
function getProfileThunkErrorMessage(err, fallbackMessage) {
	const parsed = parseApiError(err, fallbackMessage);
	const msg = parsed.message;
	if (!msg || msg === "An error occurred" || msg === "Network error" || msg === fallbackMessage) switch (parsed.status) {
		case 400: return "Invalid request. Please check the provided information.";
		case 401: return "Authentication required. Please log in again.";
		case 403: return "Access denied. You do not have permission to modify this profile.";
		case 404: return "Profile record or session not found.";
		case 409: return "Profile update conflict. The resource might have been modified.";
		case 422: return "Validation failed. Please verify your details.";
		case 429: return "Too many requests. Please wait a moment before trying again.";
		default: return fallbackMessage || "Internal server error. Please try again later.";
	}
	return msg;
}
var fetchCurrentUser = createAsyncThunk("profile/fetchCurrentUser", async (_, thunkAPI) => {
	try {
		return await profileApi.getCurrentUser();
	} catch (err) {
		return thunkAPI.rejectWithValue(getProfileThunkErrorMessage(err, "Failed to load user profile"));
	}
});
var updateCurrentUser = createAsyncThunk("profile/updateCurrentUser", async (payload, thunkAPI) => {
	try {
		return await profileApi.updateCurrentUser(payload);
	} catch (err) {
		return thunkAPI.rejectWithValue(getProfileThunkErrorMessage(err, "Failed to update profile information"));
	}
});
var uploadProfileAvatar = createAsyncThunk("profile/uploadProfileAvatar", async (file, thunkAPI) => {
	try {
		return await profileApi.uploadAvatar(file);
	} catch (err) {
		return thunkAPI.rejectWithValue(getProfileThunkErrorMessage(err, "Failed to upload avatar image"));
	}
});
var deleteProfileAvatar = createAsyncThunk("profile/deleteProfileAvatar", async (_, thunkAPI) => {
	try {
		return await profileApi.deleteAvatar();
	} catch (err) {
		return thunkAPI.rejectWithValue(getProfileThunkErrorMessage(err, "Failed to delete avatar"));
	}
});
var changeCurrentUserPassword = createAsyncThunk("profile/changeCurrentUserPassword", async (payload, thunkAPI) => {
	try {
		return await profileApi.changePassword(payload);
	} catch (err) {
		return thunkAPI.rejectWithValue(getProfileThunkErrorMessage(err, "Failed to change password"));
	}
});
var fetchUserSessions = createAsyncThunk("profile/fetchUserSessions", async (_, thunkAPI) => {
	try {
		return await profileApi.getSessions();
	} catch (err) {
		return thunkAPI.rejectWithValue(getProfileThunkErrorMessage(err, "Failed to fetch active sessions"));
	}
});
var revokeUserSession = createAsyncThunk("profile/revokeUserSession", async (sessionId, thunkAPI) => {
	try {
		return await profileApi.revokeSession(sessionId);
	} catch (err) {
		return thunkAPI.rejectWithValue(getProfileThunkErrorMessage(err, "Failed to revoke session"));
	}
});
var fetchUserPreferences = createAsyncThunk("profile/fetchUserPreferences", async (_, thunkAPI) => {
	try {
		return await profileApi.getPreferences();
	} catch (err) {
		return thunkAPI.rejectWithValue(getProfileThunkErrorMessage(err, "Failed to fetch user preferences"));
	}
});
var updateUserPreferences = createAsyncThunk("profile/updateUserPreferences", async (payload, thunkAPI) => {
	try {
		return await profileApi.updatePreferences(payload);
	} catch (err) {
		return thunkAPI.rejectWithValue(getProfileThunkErrorMessage(err, "Failed to update preferences"));
	}
});
var initialState$5 = {
	currentUser: null,
	sessions: [],
	preferences: null,
	loading: false,
	submitting: false,
	error: null,
	operationLoading: {},
	operationErrors: {},
	operationSuccess: {}
};
var profileSlice = createSlice({
	name: "profile",
	initialState: initialState$5,
	reducers: {
		clearProfileError(state) {
			state.error = null;
			state.operationErrors = {};
		},
		clearProfileOperation(state, action) {
			delete state.operationErrors[action.payload];
			delete state.operationLoading[action.payload];
			delete state.operationSuccess[action.payload];
		},
		resetProfileState() {
			return initialState$5;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(fetchCurrentUser.pending, (state) => {
			state.loading = true;
			state.operationLoading.currentUser = true;
			state.operationErrors.currentUser = null;
		}).addCase(fetchCurrentUser.fulfilled, (state, action) => {
			state.loading = false;
			state.operationLoading.currentUser = false;
			state.currentUser = action.payload;
		}).addCase(fetchCurrentUser.rejected, (state, action) => {
			state.loading = false;
			state.operationLoading.currentUser = false;
			const msg = action.payload ?? "Failed to fetch user profile";
			state.error = msg;
			state.operationErrors.currentUser = msg;
		}).addCase(updateCurrentUser.pending, (state) => {
			state.submitting = true;
			state.operationLoading.updateUser = true;
			state.operationErrors.updateUser = null;
			state.operationSuccess.updateUser = false;
		}).addCase(updateCurrentUser.fulfilled, (state, action) => {
			state.submitting = false;
			state.operationLoading.updateUser = false;
			state.currentUser = state.currentUser ? {
				...state.currentUser,
				...action.payload
			} : action.payload;
			state.operationSuccess.updateUser = true;
		}).addCase(updateCurrentUser.rejected, (state, action) => {
			state.submitting = false;
			state.operationLoading.updateUser = false;
			const msg = action.payload ?? "Failed to update profile";
			state.error = msg;
			state.operationErrors.updateUser = msg;
		});
		builder.addCase(uploadProfileAvatar.pending, (state) => {
			state.operationLoading.avatar = true;
			state.operationErrors.avatar = null;
			state.operationSuccess.avatar = false;
		}).addCase(uploadProfileAvatar.fulfilled, (state, action) => {
			state.operationLoading.avatar = false;
			state.operationSuccess.avatar = true;
			if (state.currentUser && action.payload.avatarUrl) state.currentUser.avatarUrl = action.payload.avatarUrl;
		}).addCase(uploadProfileAvatar.rejected, (state, action) => {
			state.operationLoading.avatar = false;
			const msg = action.payload ?? "Failed to upload avatar";
			state.operationErrors.avatar = msg;
		}).addCase(deleteProfileAvatar.pending, (state) => {
			state.operationLoading.avatar = true;
			state.operationErrors.avatar = null;
			state.operationSuccess.avatar = false;
		}).addCase(deleteProfileAvatar.fulfilled, (state) => {
			state.operationLoading.avatar = false;
			state.operationSuccess.avatar = true;
			if (state.currentUser) state.currentUser.avatarUrl = "";
		}).addCase(deleteProfileAvatar.rejected, (state, action) => {
			state.operationLoading.avatar = false;
			const msg = action.payload ?? "Failed to delete avatar";
			state.operationErrors.avatar = msg;
		});
		builder.addCase(changeCurrentUserPassword.pending, (state) => {
			state.submitting = true;
			state.operationLoading.password = true;
			state.operationErrors.password = null;
			state.operationSuccess.password = false;
		}).addCase(changeCurrentUserPassword.fulfilled, (state) => {
			state.submitting = false;
			state.operationLoading.password = false;
			state.operationSuccess.password = true;
		}).addCase(changeCurrentUserPassword.rejected, (state, action) => {
			state.submitting = false;
			state.operationLoading.password = false;
			const msg = action.payload ?? "Failed to update password";
			state.error = msg;
			state.operationErrors.password = msg;
		});
		builder.addCase(fetchUserSessions.pending, (state) => {
			state.operationLoading.sessions = true;
			state.operationErrors.sessions = null;
		}).addCase(fetchUserSessions.fulfilled, (state, action) => {
			state.operationLoading.sessions = false;
			state.sessions = action.payload;
		}).addCase(fetchUserSessions.rejected, (state, action) => {
			state.operationLoading.sessions = false;
			const msg = action.payload ?? "Failed to fetch active sessions";
			state.operationErrors.sessions = msg;
		}).addCase(revokeUserSession.pending, (state) => {
			state.operationLoading.revokeSession = true;
			state.operationErrors.revokeSession = null;
		}).addCase(revokeUserSession.fulfilled, (state, action) => {
			state.operationLoading.revokeSession = false;
			state.operationSuccess.revokeSession = true;
			if (action.payload.sessionId) state.sessions = state.sessions.filter((s) => s.id !== action.payload.sessionId);
		}).addCase(revokeUserSession.rejected, (state, action) => {
			state.operationLoading.revokeSession = false;
			const msg = action.payload ?? "Failed to revoke session";
			state.operationErrors.revokeSession = msg;
		});
		builder.addCase(fetchUserPreferences.pending, (state) => {
			state.operationLoading.preferences = true;
			state.operationErrors.preferences = null;
		}).addCase(fetchUserPreferences.fulfilled, (state, action) => {
			state.operationLoading.preferences = false;
			state.preferences = action.payload;
		}).addCase(fetchUserPreferences.rejected, (state, action) => {
			state.operationLoading.preferences = false;
			const msg = action.payload ?? "Failed to fetch preferences";
			state.operationErrors.preferences = msg;
		}).addCase(updateUserPreferences.pending, (state) => {
			state.operationLoading.updatePreferences = true;
			state.operationErrors.updatePreferences = null;
			state.operationSuccess.updatePreferences = false;
		}).addCase(updateUserPreferences.fulfilled, (state, action) => {
			state.operationLoading.updatePreferences = false;
			state.operationSuccess.updatePreferences = true;
			state.preferences = action.payload;
		}).addCase(updateUserPreferences.rejected, (state, action) => {
			state.operationLoading.updatePreferences = false;
			const msg = action.payload ?? "Failed to update preferences";
			state.operationErrors.updatePreferences = msg;
		});
	}
});
var { clearProfileError, clearProfileOperation, resetProfileState } = profileSlice.actions;
var profileSlice_default = profileSlice.reducer;
function extractData$2(res, fallback) {
	const r = res;
	const body = r?.data !== void 0 && (r?.status !== void 0 || r?.headers !== void 0) ? r.data : res;
	if (body == null) return fallback;
	if (typeof body === "object") {
		const b = body;
		if ("data" in b && b.data !== void 0) return b.data;
		if ("result" in b && b.result !== void 0) return b.result;
	}
	return body ?? fallback;
}
var settingsApi$1 = {
	async getSecuritySettings() {
		return extractData$2(await apiInstance.get("/settings/security"));
	},
	async updateSecuritySettings(payload) {
		return extractData$2(await apiInstance.patch("/settings/security", payload));
	},
	async getNotificationSettings() {
		return extractData$2(await apiInstance.get("/settings/notifications"));
	},
	async updateNotificationSettings(payload) {
		return extractData$2(await apiInstance.put("/settings/notifications", payload));
	},
	async getBrandingSettings() {
		return extractData$2(await apiInstance.get("/settings/branding"));
	},
	async updateBrandingSettings(payload) {
		return extractData$2(await apiInstance.patch("/settings/branding", payload));
	},
	async getIntegrationSettings() {
		const data = extractData$2(await apiInstance.get("/settings/integrations"), []);
		if (Array.isArray(data)) return data;
		if (data && typeof data === "object") {
			if (Array.isArray(data.items)) return data.items;
			if (Array.isArray(data.integrations)) return data.integrations;
		}
		return [];
	},
	async updateIntegrationSettings(payload) {
		const data = extractData$2(await apiInstance.patch("/settings/integrations", payload), []);
		if (Array.isArray(data)) return data;
		if (data && typeof data === "object") {
			if (Array.isArray(data.items)) return data.items;
			if (Array.isArray(data.integrations)) return data.integrations;
		}
		return [];
	},
	async getBillingSettings() {
		return extractData$2(await apiInstance.get("/settings/billing"));
	},
	async updateBillingSettings(payload) {
		return extractData$2(await apiInstance.patch("/settings/billing", payload));
	},
	async getSubscriptionPlans() {
		const data = extractData$2(await apiInstance.get("/settings/subscription/plans"), []);
		if (Array.isArray(data)) return data;
		if (data && typeof data === "object") {
			if (Array.isArray(data.plans)) return data.plans;
			if (Array.isArray(data.items)) return data.items;
		}
		return [];
	},
	async upgradeSubscription(payload) {
		return extractData$2(await apiInstance.post("/settings/subscription/upgrade", payload));
	},
	async cancelSubscription(payload) {
		return extractData$2(await apiInstance.post("/settings/subscription/cancel", payload ?? {}));
	},
	async getAuditLogs(params) {
		const searchParams = new URLSearchParams();
		if (params?.page) searchParams.set("page", String(params.page));
		if (params?.limit) searchParams.set("limit", String(params.limit));
		if (params?.search) searchParams.set("search", params.search);
		if (params?.module && params.module !== "all") searchParams.set("module", params.module);
		if (params?.startDate) searchParams.set("startDate", params.startDate);
		if (params?.endDate) searchParams.set("endDate", params.endDate);
		const query = searchParams.toString();
		const data = extractData$2(await apiInstance.get(`/settings/audit-logs${query ? `?${query}` : ""}`));
		if (data && "items" in data && Array.isArray(data.items)) return {
			items: data.items,
			total: data.total ?? data.items.length,
			page: data.page ?? params?.page ?? 1,
			limit: data.limit ?? params?.limit ?? 10,
			pages: data.pages ?? Math.ceil((data.total ?? data.items.length) / (params?.limit ?? 10))
		};
		if (Array.isArray(data)) return {
			items: data,
			total: data.length,
			page: params?.page ?? 1,
			limit: params?.limit ?? 10,
			pages: Math.ceil(data.length / (params?.limit ?? 10))
		};
		return {
			items: [],
			total: 0,
			page: 1,
			limit: 10,
			pages: 1
		};
	},
	async exportAuditLogs(params) {
		const searchParams = new URLSearchParams();
		if (params?.search) searchParams.set("search", params.search);
		if (params?.module && params.module !== "all") searchParams.set("module", params.module);
		if (params?.format) searchParams.set("format", params.format);
		if (params?.startDate) searchParams.set("startDate", params.startDate);
		if (params?.endDate) searchParams.set("endDate", params.endDate);
		const query = searchParams.toString();
		return (await apiInstance.get(`/settings/audit-logs/export${query ? `?${query}` : ""}`, { responseType: "blob" })).data;
	},
	async testEmail(payload) {
		return extractData$2(await apiInstance.post("/settings/email/test", payload ?? {}), {
			success: true,
			message: "Test email sent successfully"
		});
	},
	async testSms(payload) {
		return extractData$2(await apiInstance.post("/settings/sms/test", payload ?? {}), {
			success: true,
			message: "Test SMS sent successfully"
		});
	},
	async getSecurity() {
		return this.getSecuritySettings();
	},
	async updateSecurity(payload) {
		return this.updateSecuritySettings(payload);
	},
	async getNotifications() {
		return this.getNotificationSettings();
	},
	async updateNotifications(payload) {
		return this.updateNotificationSettings(payload);
	},
	async getBilling() {
		return this.getBillingSettings();
	},
	async updateBilling(payload) {
		return this.updateBillingSettings(payload);
	},
	async getIntegrations() {
		return this.getIntegrationSettings();
	},
	async toggleIntegration(payload) {
		return this.updateIntegrationSettings(payload);
	},
	async getGeneralSettings() {
		return extractData$2(await apiInstance.get("/settings/general"));
	},
	async updateGeneralSettings(payload) {
		return extractData$2(await apiInstance.put("/settings/general", payload));
	},
	async getCompanySettings() {
		return extractData$2(await apiInstance.get("/settings/company"));
	},
	async updateCompanySettings(payload) {
		return extractData$2(await apiInstance.put("/settings/company", payload));
	},
	async getRoles() {
		return extractData$2(await apiInstance.get("/settings/roles"), []);
	},
	async createRole(payload) {
		return extractData$2(await apiInstance.post("/settings/roles", payload));
	},
	async updateRole(id, payload) {
		return extractData$2(await apiInstance.put(`/settings/roles/${id}`, payload));
	},
	async deleteRole(id) {
		await apiInstance.delete(`/settings/roles/${id}`);
	},
	async getPermissions() {
		return extractData$2(await apiInstance.get("/settings/permissions"), []);
	},
	async getProfile() {
		return extractData$2(await apiInstance.get("/settings/profile"));
	},
	async updateProfile(payload) {
		const fullName = payload.fullName ?? payload.name;
		const cleanPayload = {};
		if (fullName !== void 0) cleanPayload.fullName = fullName;
		if (payload.email !== void 0) cleanPayload.email = payload.email;
		if (payload.phone !== void 0) cleanPayload.phone = payload.phone;
		if (payload.designation !== void 0) cleanPayload.designation = payload.designation;
		if (payload.department !== void 0) cleanPayload.department = payload.department;
		if (payload.bio !== void 0) cleanPayload.bio = payload.bio;
		const data = extractData$2(await apiInstance.put("/settings/profile", cleanPayload));
		const ws = aurix.get();
		const newName = cleanPayload.fullName || data?.fullName;
		const newEmail = cleanPayload.email || data?.email;
		const newPhone = cleanPayload.phone || data?.phone;
		if (newName || newEmail || newPhone) aurix.set({ user: ws.user ? {
			...ws.user,
			fullName: newName || ws.user.fullName,
			email: newEmail || ws.user.email,
			phone: newPhone || ws.user.phone
		} : {
			id: "usr_current",
			fullName: newName || "User",
			email: newEmail || "",
			phone: newPhone || "",
			role: "super_admin",
			companyId: "workspace",
			emailVerified: true,
			onboardingComplete: true,
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		} });
		return data;
	}
};
function getThunkErrorMessage(err, fallbackMessage) {
	const parsed = parseApiError(err, fallbackMessage);
	const msg = parsed.message;
	if (!msg || msg === "An error occurred" || msg === "Network error" || msg === fallbackMessage) switch (parsed.status) {
		case 400: return "Invalid request. Please check the entered information.";
		case 401: return "Authentication required. Please log in again.";
		case 403: return "Access forbidden. You do not have permission to modify these settings.";
		case 404: return "The requested settings resource was not found.";
		case 409: return "Settings conflict. Another update may have superseded this change.";
		case 422: return "Validation failed. Please verify that all required fields are correctly filled.";
		case 429: return "Too many requests. Please slow down and try again shortly.";
		default: return fallbackMessage || "Internal server error. Please try again later.";
	}
	return msg;
}
function downloadFileBlob(blob, defaultFilename = "audit-logs.csv") {
	if (typeof window === "undefined") return;
	const url = window.URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.setAttribute("download", defaultFilename);
	document.body.appendChild(link);
	link.click();
	link.remove();
	window.URL.revokeObjectURL(url);
}
var fetchSecuritySettings = createAsyncThunk("settings/fetchSecuritySettings", async (_, thunkAPI) => {
	try {
		return await settingsApi$1.getSecuritySettings();
	} catch (err) {
		return thunkAPI.rejectWithValue(getThunkErrorMessage(err, "Failed to fetch security settings"));
	}
});
var updateSecuritySettings = createAsyncThunk("settings/updateSecuritySettings", async (payload, thunkAPI) => {
	try {
		return await settingsApi$1.updateSecuritySettings(payload);
	} catch (err) {
		return thunkAPI.rejectWithValue(getThunkErrorMessage(err, "Failed to update security settings"));
	}
});
var fetchNotificationSettings = createAsyncThunk("settings/fetchNotificationSettings", async (_, thunkAPI) => {
	try {
		return await settingsApi$1.getNotificationSettings();
	} catch (err) {
		return thunkAPI.rejectWithValue(getThunkErrorMessage(err, "Failed to fetch notification settings"));
	}
});
var updateNotificationSettings = createAsyncThunk("settings/updateNotificationSettings", async (payload, thunkAPI) => {
	try {
		return await settingsApi$1.updateNotificationSettings(payload);
	} catch (err) {
		return thunkAPI.rejectWithValue(getThunkErrorMessage(err, "Failed to update notification settings"));
	}
});
var fetchBrandingSettings = createAsyncThunk("settings/fetchBrandingSettings", async (_, thunkAPI) => {
	try {
		return await settingsApi$1.getBrandingSettings();
	} catch (err) {
		return thunkAPI.rejectWithValue(getThunkErrorMessage(err, "Failed to fetch branding settings"));
	}
});
var updateBrandingSettings = createAsyncThunk("settings/updateBrandingSettings", async (payload, thunkAPI) => {
	try {
		return await settingsApi$1.updateBrandingSettings(payload);
	} catch (err) {
		return thunkAPI.rejectWithValue(getThunkErrorMessage(err, "Failed to update branding settings"));
	}
});
var fetchIntegrationSettings = createAsyncThunk("settings/fetchIntegrationSettings", async (_, thunkAPI) => {
	try {
		return await settingsApi$1.getIntegrationSettings();
	} catch (err) {
		return thunkAPI.rejectWithValue(getThunkErrorMessage(err, "Failed to fetch integrations"));
	}
});
var updateIntegrationSettings = createAsyncThunk("settings/updateIntegrationSettings", async (payload, thunkAPI) => {
	try {
		return await settingsApi$1.updateIntegrationSettings(payload);
	} catch (err) {
		return thunkAPI.rejectWithValue(getThunkErrorMessage(err, "Failed to update integration"));
	}
});
var fetchBillingSettings = createAsyncThunk("settings/fetchBillingSettings", async (_, thunkAPI) => {
	try {
		return await settingsApi$1.getBillingSettings();
	} catch (err) {
		return thunkAPI.rejectWithValue(getThunkErrorMessage(err, "Failed to fetch billing data"));
	}
});
var updateBillingSettings = createAsyncThunk("settings/updateBillingSettings", async (payload, thunkAPI) => {
	try {
		return await settingsApi$1.updateBillingSettings(payload);
	} catch (err) {
		return thunkAPI.rejectWithValue(getThunkErrorMessage(err, "Failed to update billing details"));
	}
});
var fetchSubscriptionPlans = createAsyncThunk("settings/fetchSubscriptionPlans", async (_, thunkAPI) => {
	try {
		return await settingsApi$1.getSubscriptionPlans();
	} catch (err) {
		return thunkAPI.rejectWithValue(getThunkErrorMessage(err, "Failed to fetch subscription plans"));
	}
});
var upgradeSubscription = createAsyncThunk("settings/upgradeSubscription", async (payload, thunkAPI) => {
	try {
		return await settingsApi$1.upgradeSubscription(payload);
	} catch (err) {
		return thunkAPI.rejectWithValue(getThunkErrorMessage(err, "Failed to upgrade subscription plan"));
	}
});
var cancelSubscription = createAsyncThunk("settings/cancelSubscription", async (payload, thunkAPI) => {
	try {
		return await settingsApi$1.cancelSubscription(payload || void 0);
	} catch (err) {
		return thunkAPI.rejectWithValue(getThunkErrorMessage(err, "Failed to cancel subscription"));
	}
});
var fetchAuditLogs$1 = createAsyncThunk("settings/fetchAuditLogs", async (params, thunkAPI) => {
	try {
		return await settingsApi$1.getAuditLogs(params || void 0);
	} catch (err) {
		return thunkAPI.rejectWithValue(getThunkErrorMessage(err, "Failed to fetch audit logs"));
	}
});
var exportAuditLogs = createAsyncThunk("settings/exportAuditLogs", async (params, thunkAPI) => {
	try {
		const blob = await settingsApi$1.exportAuditLogs(params || void 0);
		const format = params && params.format ? params.format : "csv";
		const filename = `audit-logs-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.${format}`;
		downloadFileBlob(blob, filename);
		return {
			success: true,
			filename
		};
	} catch (err) {
		return thunkAPI.rejectWithValue(getThunkErrorMessage(err, "Failed to export audit logs"));
	}
});
var testEmailConfiguration = createAsyncThunk("settings/testEmailConfiguration", async (payload, thunkAPI) => {
	try {
		return await settingsApi$1.testEmail(payload || void 0);
	} catch (err) {
		return thunkAPI.rejectWithValue(getThunkErrorMessage(err, "Failed to send test email"));
	}
});
var testSmsConfiguration = createAsyncThunk("settings/testSmsConfiguration", async (payload, thunkAPI) => {
	try {
		return await settingsApi$1.testSms(payload || void 0);
	} catch (err) {
		return thunkAPI.rejectWithValue(getThunkErrorMessage(err, "Failed to send test SMS"));
	}
});
var fetchGeneralSettings = createAsyncThunk("settings/fetchGeneral", async (_, thunkAPI) => {
	try {
		return await settingsApi$1.getGeneralSettings();
	} catch (err) {
		return thunkAPI.rejectWithValue(getThunkErrorMessage(err, "Failed to fetch general settings"));
	}
});
var updateGeneralSettings = createAsyncThunk("settings/updateGeneral", async (payload, thunkAPI) => {
	try {
		return await settingsApi$1.updateGeneralSettings(payload);
	} catch (err) {
		return thunkAPI.rejectWithValue(getThunkErrorMessage(err, "Failed to update general settings"));
	}
});
var fetchCompanySettings = createAsyncThunk("settings/fetchCompany", async (_, thunkAPI) => {
	try {
		return await settingsApi$1.getCompanySettings();
	} catch (err) {
		return thunkAPI.rejectWithValue(getThunkErrorMessage(err, "Failed to fetch company settings"));
	}
});
var updateCompanySettings = createAsyncThunk("settings/updateCompany", async (payload, thunkAPI) => {
	try {
		return await settingsApi$1.updateCompanySettings(payload);
	} catch (err) {
		return thunkAPI.rejectWithValue(getThunkErrorMessage(err, "Failed to update company settings"));
	}
});
var fetchRoles = createAsyncThunk("settings/fetchRoles", async (_, thunkAPI) => {
	try {
		return await settingsApi$1.getRoles();
	} catch (err) {
		return thunkAPI.rejectWithValue(getThunkErrorMessage(err, "Failed to fetch roles"));
	}
});
var createRole = createAsyncThunk("settings/createRole", async (payload, thunkAPI) => {
	try {
		return await settingsApi$1.createRole(payload);
	} catch (err) {
		return thunkAPI.rejectWithValue(getThunkErrorMessage(err, "Failed to create role"));
	}
});
var updateRole = createAsyncThunk("settings/updateRole", async ({ id, ...payload }, thunkAPI) => {
	try {
		return await settingsApi$1.updateRole(id, payload);
	} catch (err) {
		return thunkAPI.rejectWithValue(getThunkErrorMessage(err, "Failed to update role"));
	}
});
var deleteRole = createAsyncThunk("settings/deleteRole", async (id, thunkAPI) => {
	try {
		await settingsApi$1.deleteRole(id);
		return id;
	} catch (err) {
		return thunkAPI.rejectWithValue(getThunkErrorMessage(err, "Failed to delete role"));
	}
});
var fetchPermissions = createAsyncThunk("settings/fetchPermissions", async (_, thunkAPI) => {
	try {
		return await settingsApi$1.getPermissions();
	} catch (err) {
		return thunkAPI.rejectWithValue(getThunkErrorMessage(err, "Failed to fetch permissions"));
	}
});
var fetchProfileSettings = createAsyncThunk("settings/fetchProfile", async (_, thunkAPI) => {
	try {
		return await settingsApi$1.getProfile();
	} catch (err) {
		return thunkAPI.rejectWithValue(getThunkErrorMessage(err, "Failed to fetch user profile"));
	}
});
var updateProfileSettings = createAsyncThunk("settings/updateProfile", async (payload, thunkAPI) => {
	try {
		return await settingsApi$1.updateProfile(payload);
	} catch (err) {
		return thunkAPI.rejectWithValue(getThunkErrorMessage(err, "Failed to update profile settings"));
	}
});
var initialState$4 = {
	loading: false,
	submitting: false,
	error: null,
	lastUpdated: null,
	security: null,
	notifications: null,
	branding: null,
	integrations: [],
	billing: null,
	subscriptionPlans: [],
	auditLogs: null,
	generalSettings: null,
	companySettings: null,
	roles: [],
	permissions: [],
	profile: null,
	operationLoading: {},
	operationErrors: {},
	operationSuccess: {}
};
var settingsSlice = createSlice({
	name: "settings",
	initialState: initialState$4,
	reducers: {
		clearError(state) {
			state.error = null;
			state.operationErrors = {};
		},
		clearOperationStatus(state, action) {
			delete state.operationErrors[action.payload];
			delete state.operationLoading[action.payload];
			delete state.operationSuccess[action.payload];
		},
		resetSettingsState() {
			return initialState$4;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(fetchSecuritySettings.pending, (state) => {
			state.loading = true;
			state.operationLoading.security = true;
			state.operationErrors.security = null;
		}).addCase(fetchSecuritySettings.fulfilled, (state, action) => {
			state.loading = false;
			state.operationLoading.security = false;
			state.security = action.payload;
			state.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
		}).addCase(fetchSecuritySettings.rejected, (state, action) => {
			state.loading = false;
			state.operationLoading.security = false;
			const msg = action.payload ?? "Failed to fetch security settings";
			state.error = msg;
			state.operationErrors.security = msg;
		}).addCase(updateSecuritySettings.pending, (state) => {
			state.submitting = true;
			state.operationLoading.updateSecurity = true;
			state.operationErrors.updateSecurity = null;
			state.operationSuccess.updateSecurity = false;
		}).addCase(updateSecuritySettings.fulfilled, (state, action) => {
			state.submitting = false;
			state.operationLoading.updateSecurity = false;
			state.security = action.payload;
			state.operationSuccess.updateSecurity = true;
			state.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
		}).addCase(updateSecuritySettings.rejected, (state, action) => {
			state.submitting = false;
			state.operationLoading.updateSecurity = false;
			const msg = action.payload ?? "Failed to update security settings";
			state.error = msg;
			state.operationErrors.updateSecurity = msg;
		});
		builder.addCase(fetchNotificationSettings.pending, (state) => {
			state.loading = true;
			state.operationLoading.notifications = true;
			state.operationErrors.notifications = null;
		}).addCase(fetchNotificationSettings.fulfilled, (state, action) => {
			state.loading = false;
			state.operationLoading.notifications = false;
			state.notifications = action.payload;
			state.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
		}).addCase(fetchNotificationSettings.rejected, (state, action) => {
			state.loading = false;
			state.operationLoading.notifications = false;
			const msg = action.payload ?? "Failed to fetch notification preferences";
			state.error = msg;
			state.operationErrors.notifications = msg;
		}).addCase(updateNotificationSettings.pending, (state) => {
			state.submitting = true;
			state.operationLoading.updateNotifications = true;
			state.operationErrors.updateNotifications = null;
			state.operationSuccess.updateNotifications = false;
		}).addCase(updateNotificationSettings.fulfilled, (state, action) => {
			state.submitting = false;
			state.operationLoading.updateNotifications = false;
			state.notifications = action.payload;
			state.operationSuccess.updateNotifications = true;
			state.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
		}).addCase(updateNotificationSettings.rejected, (state, action) => {
			state.submitting = false;
			state.operationLoading.updateNotifications = false;
			const msg = action.payload ?? "Failed to update notification preferences";
			state.error = msg;
			state.operationErrors.updateNotifications = msg;
		});
		builder.addCase(fetchBrandingSettings.pending, (state) => {
			state.operationLoading.branding = true;
			state.operationErrors.branding = null;
		}).addCase(fetchBrandingSettings.fulfilled, (state, action) => {
			state.operationLoading.branding = false;
			state.branding = action.payload;
			state.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
		}).addCase(fetchBrandingSettings.rejected, (state, action) => {
			state.operationLoading.branding = false;
			const msg = action.payload ?? "Failed to fetch branding settings";
			state.operationErrors.branding = msg;
		}).addCase(updateBrandingSettings.pending, (state) => {
			state.submitting = true;
			state.operationLoading.updateBranding = true;
			state.operationErrors.updateBranding = null;
			state.operationSuccess.updateBranding = false;
		}).addCase(updateBrandingSettings.fulfilled, (state, action) => {
			state.submitting = false;
			state.operationLoading.updateBranding = false;
			state.branding = action.payload;
			state.operationSuccess.updateBranding = true;
			state.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
		}).addCase(updateBrandingSettings.rejected, (state, action) => {
			state.submitting = false;
			state.operationLoading.updateBranding = false;
			const msg = action.payload ?? "Failed to update branding settings";
			state.operationErrors.updateBranding = msg;
		});
		builder.addCase(fetchIntegrationSettings.pending, (state) => {
			state.operationLoading.integrations = true;
			state.operationErrors.integrations = null;
		}).addCase(fetchIntegrationSettings.fulfilled, (state, action) => {
			state.operationLoading.integrations = false;
			state.integrations = action.payload;
		}).addCase(fetchIntegrationSettings.rejected, (state, action) => {
			state.operationLoading.integrations = false;
			const msg = action.payload ?? "Failed to fetch integrations";
			state.operationErrors.integrations = msg;
		}).addCase(updateIntegrationSettings.pending, (state) => {
			state.submitting = true;
			state.operationLoading.updateIntegration = true;
			state.operationErrors.updateIntegration = null;
		}).addCase(updateIntegrationSettings.fulfilled, (state, action) => {
			state.submitting = false;
			state.operationLoading.updateIntegration = false;
			state.integrations = action.payload;
		}).addCase(updateIntegrationSettings.rejected, (state, action) => {
			state.submitting = false;
			state.operationLoading.updateIntegration = false;
			const msg = action.payload ?? "Failed to update integration";
			state.operationErrors.updateIntegration = msg;
		});
		builder.addCase(fetchBillingSettings.pending, (state) => {
			state.loading = true;
			state.operationLoading.billing = true;
			state.operationErrors.billing = null;
		}).addCase(fetchBillingSettings.fulfilled, (state, action) => {
			state.loading = false;
			state.operationLoading.billing = false;
			state.billing = action.payload;
		}).addCase(fetchBillingSettings.rejected, (state, action) => {
			state.loading = false;
			state.operationLoading.billing = false;
			const msg = action.payload ?? "Failed to fetch billing data";
			state.operationErrors.billing = msg;
		}).addCase(updateBillingSettings.pending, (state) => {
			state.submitting = true;
			state.operationLoading.updateBilling = true;
			state.operationErrors.updateBilling = null;
		}).addCase(updateBillingSettings.fulfilled, (state, action) => {
			state.submitting = false;
			state.operationLoading.updateBilling = false;
			state.billing = action.payload;
		}).addCase(updateBillingSettings.rejected, (state, action) => {
			state.submitting = false;
			state.operationLoading.updateBilling = false;
			const msg = action.payload ?? "Failed to update billing details";
			state.operationErrors.updateBilling = msg;
		}).addCase(fetchSubscriptionPlans.pending, (state) => {
			state.operationLoading.subscriptionPlans = true;
			state.operationErrors.subscriptionPlans = null;
		}).addCase(fetchSubscriptionPlans.fulfilled, (state, action) => {
			state.operationLoading.subscriptionPlans = false;
			state.subscriptionPlans = action.payload;
		}).addCase(fetchSubscriptionPlans.rejected, (state, action) => {
			state.operationLoading.subscriptionPlans = false;
			const msg = action.payload ?? "Failed to fetch subscription plans";
			state.operationErrors.subscriptionPlans = msg;
		}).addCase(upgradeSubscription.pending, (state) => {
			state.submitting = true;
			state.operationLoading.upgradeSubscription = true;
			state.operationErrors.upgradeSubscription = null;
		}).addCase(upgradeSubscription.fulfilled, (state, action) => {
			state.submitting = false;
			state.operationLoading.upgradeSubscription = false;
			state.billing = action.payload;
		}).addCase(upgradeSubscription.rejected, (state, action) => {
			state.submitting = false;
			state.operationLoading.upgradeSubscription = false;
			const msg = action.payload ?? "Failed to upgrade subscription";
			state.operationErrors.upgradeSubscription = msg;
		}).addCase(cancelSubscription.pending, (state) => {
			state.submitting = true;
			state.operationLoading.cancelSubscription = true;
			state.operationErrors.cancelSubscription = null;
		}).addCase(cancelSubscription.fulfilled, (state, action) => {
			state.submitting = false;
			state.operationLoading.cancelSubscription = false;
			state.billing = action.payload;
		}).addCase(cancelSubscription.rejected, (state, action) => {
			state.submitting = false;
			state.operationLoading.cancelSubscription = false;
			const msg = action.payload ?? "Failed to cancel subscription";
			state.operationErrors.cancelSubscription = msg;
		});
		builder.addCase(fetchAuditLogs$1.pending, (state) => {
			state.loading = true;
			state.operationLoading.auditLogs = true;
			state.operationErrors.auditLogs = null;
		}).addCase(fetchAuditLogs$1.fulfilled, (state, action) => {
			state.loading = false;
			state.operationLoading.auditLogs = false;
			state.auditLogs = action.payload;
		}).addCase(fetchAuditLogs$1.rejected, (state, action) => {
			state.loading = false;
			state.operationLoading.auditLogs = false;
			const msg = action.payload ?? "Failed to fetch audit logs";
			state.operationErrors.auditLogs = msg;
		}).addCase(exportAuditLogs.pending, (state) => {
			state.operationLoading.exportAuditLogs = true;
			state.operationErrors.exportAuditLogs = null;
		}).addCase(exportAuditLogs.fulfilled, (state) => {
			state.operationLoading.exportAuditLogs = false;
			state.operationSuccess.exportAuditLogs = true;
		}).addCase(exportAuditLogs.rejected, (state, action) => {
			state.operationLoading.exportAuditLogs = false;
			const msg = action.payload ?? "Failed to export audit logs";
			state.operationErrors.exportAuditLogs = msg;
		});
		builder.addCase(testEmailConfiguration.pending, (state) => {
			state.operationLoading.testEmail = true;
			state.operationErrors.testEmail = null;
			state.operationSuccess.testEmail = false;
		}).addCase(testEmailConfiguration.fulfilled, (state) => {
			state.operationLoading.testEmail = false;
			state.operationSuccess.testEmail = true;
		}).addCase(testEmailConfiguration.rejected, (state, action) => {
			state.operationLoading.testEmail = false;
			const msg = action.payload ?? "Failed to send test email";
			state.operationErrors.testEmail = msg;
		}).addCase(testSmsConfiguration.pending, (state) => {
			state.operationLoading.testSms = true;
			state.operationErrors.testSms = null;
			state.operationSuccess.testSms = false;
		}).addCase(testSmsConfiguration.fulfilled, (state) => {
			state.operationLoading.testSms = false;
			state.operationSuccess.testSms = true;
		}).addCase(testSmsConfiguration.rejected, (state, action) => {
			state.operationLoading.testSms = false;
			const msg = action.payload ?? "Failed to send test SMS";
			state.operationErrors.testSms = msg;
		});
		builder.addCase(fetchGeneralSettings.pending, (state) => {
			state.loading = true;
			state.error = null;
		}).addCase(fetchGeneralSettings.fulfilled, (state, action) => {
			state.loading = false;
			state.generalSettings = action.payload;
		}).addCase(fetchGeneralSettings.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload ?? "Failed to fetch general settings";
		}).addCase(updateGeneralSettings.pending, (state) => {
			state.submitting = true;
		}).addCase(updateGeneralSettings.fulfilled, (state, action) => {
			state.submitting = false;
			state.generalSettings = action.payload;
		}).addCase(updateGeneralSettings.rejected, (state, action) => {
			state.submitting = false;
			state.error = action.payload ?? "Failed to update general settings";
		}).addCase(fetchCompanySettings.fulfilled, (state, action) => {
			state.companySettings = action.payload;
			if (action.payload?.name) {
				const currentWs = aurix.get();
				if (currentWs?.company) aurix.set({ company: {
					...currentWs.company,
					name: action.payload.name
				} });
			}
		}).addCase(updateCompanySettings.fulfilled, (state, action) => {
			state.companySettings = action.payload;
			if (action.payload?.name) {
				const currentWs = aurix.get();
				if (currentWs?.company) aurix.set({ company: {
					...currentWs.company,
					name: action.payload.name
				} });
			}
		});
		builder.addCase(fetchRoles.fulfilled, (state, action) => {
			state.roles = action.payload;
		}).addCase(createRole.fulfilled, (state, action) => {
			state.roles.push(action.payload);
		}).addCase(updateRole.fulfilled, (state, action) => {
			const index = state.roles.findIndex((r) => r.id === action.payload.id);
			if (index !== -1) state.roles[index] = action.payload;
		}).addCase(deleteRole.fulfilled, (state, action) => {
			state.roles = state.roles.filter((r) => r.id !== action.payload);
		}).addCase(fetchPermissions.fulfilled, (state, action) => {
			state.permissions = action.payload;
		});
		builder.addCase(fetchProfileSettings.fulfilled, (state, action) => {
			state.profile = action.payload;
		}).addCase(updateProfileSettings.fulfilled, (state, action) => {
			state.profile = state.profile ? {
				...state.profile,
				...action.payload
			} : action.payload;
		});
	}
});
var { clearError, clearOperationStatus: clearOperationStatus$2, resetSettingsState } = settingsSlice.actions;
var settingsSlice_default = settingsSlice.reducer;
var DEFAULT_ROLE_PERMISSIONS = {
	super_admin: [
		"platform.view",
		"platform.overview",
		"platform.users",
		"platform.organizations",
		"platform.analytics",
		"platform.activity",
		"platform.audit_logs",
		"platform.settings",
		"platform.config"
	],
	hr_admin: [
		"overview.view",
		"workforce.view",
		"workforce.people",
		"workforce.departments",
		"workforce.attendance",
		"workforce.timesheets",
		"workforce.leaves",
		"talent.view",
		"talent.recruitment",
		"talent.performance",
		"hrops.view",
		"hrops.dashboard",
		"hrops.timeline",
		"hrops.visitors",
		"hrops.onboarding",
		"hrops.offboarding",
		"hrops.exit",
		"resources.view",
		"resources.documents",
		"resources.assets",
		"resources.asset_management",
		"payroll.view",
		"payroll.process",
		"payroll.approve",
		"payroll.finalize",
		"payroll.disburse",
		"payroll.reports",
		"payroll.compensation.view",
		"payroll.compensation.edit",
		"payroll.statutory",
		"analytics.view",
		"analytics.reports",
		"analytics.ai_insights",
		"ai.view",
		"ai.hub",
		"ai.document_generator",
		"ai.assistant",
		"ai.automation",
		"settings.view",
		"settings.general",
		"settings.company",
		"settings.roles_permissions",
		"settings.audit_logs",
		"settings.billing",
		"settings.security",
		"settings.notifications",
		"settings.integrations",
		"settings.profile"
	],
	manager: [
		"overview.view",
		"workforce.view",
		"workforce.people",
		"workforce.attendance",
		"workforce.timesheets",
		"workforce.leaves",
		"talent.view",
		"talent.recruitment",
		"talent.performance",
		"hrops.view",
		"hrops.onboarding",
		"resources.view",
		"resources.documents",
		"resources.assets",
		"analytics.view",
		"analytics.reports",
		"analytics.ai_insights",
		"ai.view",
		"ai.hub",
		"ai.document_generator",
		"ai.assistant",
		"ai.automation",
		"settings.view",
		"settings.security",
		"settings.notifications",
		"settings.profile"
	],
	employee: [
		"overview.view",
		"workforce.view",
		"workforce.attendance",
		"workforce.timesheets",
		"workforce.leaves",
		"talent.view",
		"talent.performance",
		"resources.view",
		"resources.documents",
		"resources.assets",
		"ai.view",
		"ai.hub",
		"ai.document_generator",
		"ai.assistant",
		"settings.view",
		"settings.security",
		"settings.notifications",
		"settings.profile"
	],
	it_admin: [
		"overview.view",
		"system.view",
		"system.controls",
		"resources.view",
		"resources.assets",
		"resources.asset_management",
		"settings.view",
		"settings.security",
		"settings.audit_logs",
		"settings.integrations"
	],
	executive: [
		"overview.view",
		"analytics.view",
		"analytics.reports",
		"analytics.ai_insights",
		"ai.view",
		"ai.hub"
	],
	recruiter: [
		"overview.view",
		"talent.view",
		"talent.recruitment",
		"ai.view",
		"ai.hub",
		"ai.assistant",
		"settings.view",
		"settings.profile"
	]
};
var sidebarApi = { async getPermissions(userRole) {
	const effectiveRole = normalizeRole(userRole) || "employee";
	try {
		const response = await apiInstance.get("/sidebar/permissions");
		const data = response.data?.data ?? response.data;
		if (data && Array.isArray(data.permissions)) return {
			role: normalizeRole(typeof data.role === "string" ? data.role : userRole) || effectiveRole,
			permissions: data.permissions.filter((permission) => typeof permission === "string")
		};
		if (Array.isArray(data)) return {
			role: effectiveRole,
			permissions: data.filter((permission) => typeof permission === "string")
		};
	} catch {}
	return {
		role: effectiveRole,
		permissions: DEFAULT_ROLE_PERMISSIONS[effectiveRole] || DEFAULT_ROLE_PERMISSIONS.employee
	};
} };
var fetchSidebarPermissions = createAsyncThunk("sidebar/fetchPermissions", async (userRole, { rejectWithValue }) => {
	try {
		return await sidebarApi.getPermissions(userRole);
	} catch (err) {
		return rejectWithValue(err?.message || "Failed to fetch sidebar permissions");
	}
});
var STORAGE_KEY = "AURIX_SIDEBAR_EXPANDED";
function loadExpandedState() {
	if (typeof window !== "undefined") try {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved) return JSON.parse(saved);
	} catch {}
	return {
		workforce: true,
		talent: true,
		hrops: true,
		resources: true,
		analytics: true,
		aihub: true,
		settings: true
	};
}
function saveExpandedState(expandedState) {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(expandedState));
	} catch {}
}
var sidebarSlice = createSlice({
	name: "sidebar",
	initialState: {
		expandedSections: loadExpandedState(),
		selectedMenu: null,
		activeRoute: "/dashboard",
		userPermissions: [],
		permissionsLoading: false,
		permissionsError: null,
		userRole: null
	},
	reducers: {
		toggleSectionExpand(state, action) {
			const key = action.payload;
			state.expandedSections[key] = !state.expandedSections[key];
			saveExpandedState(state.expandedSections);
		},
		setSectionExpand(state, action) {
			const { sectionKey, expanded } = action.payload;
			state.expandedSections[sectionKey] = expanded;
			saveExpandedState(state.expandedSections);
		},
		setSelectedMenu(state, action) {
			state.selectedMenu = action.payload;
		},
		setActiveRoute(state, action) {
			state.activeRoute = action.payload;
		},
		setUserPermissions(state, action) {
			state.userPermissions = action.payload;
		},
		setUserRole(state, action) {
			state.userRole = action.payload;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(fetchSidebarPermissions.pending, (state) => {
			state.permissionsLoading = true;
			state.permissionsError = null;
		}).addCase(fetchSidebarPermissions.fulfilled, (state, action) => {
			state.permissionsLoading = false;
			state.userPermissions = action.payload.permissions;
			if (action.payload.role) state.userRole = action.payload.role;
		}).addCase(fetchSidebarPermissions.rejected, (state, action) => {
			state.permissionsLoading = false;
			state.permissionsError = action.payload ?? "Failed to fetch permissions";
		});
	}
});
var { toggleSectionExpand, setSectionExpand, setSelectedMenu, setActiveRoute, setUserPermissions, setUserRole } = sidebarSlice.actions;
var sidebarSlice_default = sidebarSlice.reducer;
/**
* Normalizes backend responses unwrapping { data: T } or { result: T } or direct payload.
*/
function extractData$1(res, fallback) {
	const r = res;
	const body = r?.data !== void 0 && (r?.status !== void 0 || r?.headers !== void 0) ? r.data : res;
	if (body == null) return fallback ?? null;
	if (typeof body === "object") {
		const b = body;
		if ("data" in b && b.data !== void 0) return b.data;
		if ("result" in b && b.result !== void 0) return b.result;
	}
	return body ?? fallback;
}
function mapToChatMessage(raw, fallbackConversationId) {
	if (!raw || typeof raw !== "object") return {
		id: `msg-${Date.now()}`,
		conversationId: fallbackConversationId,
		sender: "assistant",
		role: "ai",
		content: String(raw ?? ""),
		timestamp: (/* @__PURE__ */ new Date()).toISOString()
	};
	const r = raw;
	const rawRole = String(r.role ?? r.sender ?? "assistant").toLowerCase();
	const sender = rawRole === "user" ? "user" : rawRole === "system" ? "system" : "assistant";
	const role = rawRole === "user" ? "user" : rawRole === "system" ? "system" : "ai";
	const conversationId = String(r.conversationId ?? r.conversation_id ?? fallbackConversationId ?? "");
	const id = String(r.id ?? r.messageId ?? r.message_id ?? `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`);
	const timestamp = String(r.timestamp ?? r.createdAt ?? r.created_at ?? (/* @__PURE__ */ new Date()).toISOString());
	let content = String(r.content ?? r.message ?? r.answer ?? r.text ?? "");
	let cardType = r.cardType;
	let cardData = r.cardData;
	let actionRequired = r.actionRequired;
	const suggestions = Array.isArray(r.suggestions) ? r.suggestions : Array.isArray(r.followUpQuestions) ? r.followUpQuestions : Array.isArray(r.follow_up_questions) ? r.follow_up_questions : [];
	const sources = Array.isArray(r.sources) ? r.sources : void 0;
	const charts = Array.isArray(r.charts) ? r.charts : void 0;
	const tables = Array.isArray(r.tables) ? r.tables : void 0;
	if (r.metadata && typeof r.metadata === "object") {
		const meta = r.metadata;
		if (!cardType && meta.cardType) cardType = meta.cardType;
		if (!cardData && meta.cardData) cardData = meta.cardData;
		if (!actionRequired && meta.actionRequired) actionRequired = meta.actionRequired;
	}
	if (content && typeof content === "string") {
		const jsonBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
		if (jsonBlockMatch) try {
			const parsed = JSON.parse(jsonBlockMatch[1]);
			if (parsed && typeof parsed === "object") {
				if (!cardType && parsed.cardType) cardType = parsed.cardType;
				if (!cardData && parsed.cardData) cardData = parsed.cardData;
				if (!actionRequired && parsed.actionRequired) actionRequired = parsed.actionRequired;
				const cleaned = content.replace(/```(?:json)?\s*[\s\S]*?\s*```/, "").trim();
				if (cleaned) content = cleaned;
				else if (parsed.message || parsed.answer || parsed.text) content = String(parsed.message || parsed.answer || parsed.text);
			}
		} catch {}
		else if (content.trim().startsWith("{") && content.trim().endsWith("}")) try {
			const parsed = JSON.parse(content.trim());
			if (parsed && typeof parsed === "object") {
				if (!cardType && parsed.cardType) cardType = parsed.cardType;
				if (!cardData && parsed.cardData) cardData = parsed.cardData;
				if (!actionRequired && parsed.actionRequired) actionRequired = parsed.actionRequired;
				if (parsed.message || parsed.answer || parsed.text) content = String(parsed.message || parsed.answer || parsed.text);
			}
		} catch {}
	}
	return {
		id,
		conversationId: conversationId || void 0,
		sender,
		role,
		content,
		timestamp,
		cardType,
		cardData,
		actionRequired,
		suggestions: suggestions.length > 0 ? suggestions : void 0,
		sources,
		charts,
		tables,
		metadata: r.metadata
	};
}
function normalizeChatConversation(raw, defaultId) {
	if (!raw || typeof raw !== "object") return {
		id: defaultId || "",
		title: "Chat Conversation",
		messages: [],
		createdAt: (/* @__PURE__ */ new Date()).toISOString(),
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	const r = raw;
	const id = String(r.id ?? r.conversationId ?? r.conversation_id ?? defaultId ?? "");
	const messages = (Array.isArray(r.messages) ? r.messages : Array.isArray(r.history) ? r.history : r.answer ? [r] : []).map((m) => mapToChatMessage(m, id));
	return {
		id,
		title: String(r.title || "Chat Conversation"),
		agentId: r.agentId ? String(r.agentId) : void 0,
		messages,
		createdAt: String(r.createdAt ?? r.created_at ?? (/* @__PURE__ */ new Date()).toISOString()),
		updatedAt: String(r.updatedAt ?? r.updated_at ?? (/* @__PURE__ */ new Date()).toISOString())
	};
}
var aiHubApi = {
	async getOverview() {
		const raw = extractData$1(await apiInstance.get("/ai-hub"), {});
		return {
			totalAgents: Number(raw?.totalAgents ?? raw?.total_agents ?? 0),
			activeAgents: Number(raw?.activeAgents ?? raw?.active_agents ?? 0),
			tasksCompleted: Number(raw?.tasksCompleted ?? raw?.tasks_completed ?? 0),
			successRate: Number(raw?.successRate ?? raw?.success_rate ?? 0),
			systemHealth: String(raw?.systemHealth ?? raw?.system_health ?? "healthy"),
			lastUpdated: raw?.lastUpdated ? String(raw.lastUpdated) : (/* @__PURE__ */ new Date()).toISOString(),
			summary: raw?.summary ? String(raw.summary) : void 0,
			recentActivities: Array.isArray(raw?.recentActivities ?? raw?.recent_activities) ? raw.recentActivities ?? raw.recent_activities : [],
			metrics: raw?.metrics ?? {}
		};
	},
	async getAgents() {
		const raw = extractData$1(await apiInstance.get("/ai-hub/agents"), []);
		return Array.isArray(raw) ? raw : [];
	},
	async getAgentDetails(agentId) {
		return extractData$1(await apiInstance.get(`/ai-hub/agents/${encodeURIComponent(agentId)}`));
	},
	async runAgent(agentId, payload) {
		return extractData$1(await apiInstance.post(`/ai-hub/agents/${encodeURIComponent(agentId)}/run`, payload ?? {}));
	},
	async getAgentHistory(agentId, params) {
		const raw = extractData$1(await apiInstance.get(`/ai-hub/agents/${encodeURIComponent(agentId)}/history`, { params }), []);
		if (Array.isArray(raw)) return raw;
		if (raw && typeof raw === "object" && "items" in raw && Array.isArray(raw.items)) return raw.items;
		return [];
	},
	async getAgentStatus(agentId) {
		return extractData$1(await apiInstance.get(`/ai-hub/agents/${encodeURIComponent(agentId)}/status`), {
			agentId,
			status: "idle"
		});
	},
	async submitAgentFeedback(agentId, payload) {
		return extractData$1(await apiInstance.post(`/ai-hub/agents/${encodeURIComponent(agentId)}/feedback`, payload), { success: true });
	},
	async getWorkforceInsights() {
		const raw = extractData$1(await apiInstance.get("/ai-brain/workforce-insights"), []);
		return Array.isArray(raw) ? raw : [];
	},
	async analyzeWorkforceInsights(payload) {
		const raw = extractData$1(await apiInstance.post("/ai-hub/workforce-insights/analyze", payload ?? {}), []);
		return Array.isArray(raw) ? raw : [];
	},
	async getRecruiterInsights() {
		const raw = extractData$1(await apiInstance.get("/ai-hub/recruiter"), []);
		return Array.isArray(raw) ? raw : [];
	},
	async screenResumes(payload) {
		const raw = extractData$1(await apiInstance.post("/ai-hub/recruiter/screen-resumes", payload), []);
		return Array.isArray(raw) ? raw : [];
	},
	async matchCandidates(payload) {
		const raw = extractData$1(await apiInstance.post("/ai-hub/recruiter/match-candidates", payload), []);
		return Array.isArray(raw) ? raw : [];
	},
	async generateInterviewQuestions(payload) {
		return extractData$1(await apiInstance.post("/ai-hub/recruiter/generate-questions", payload), {
			questions: [],
			jobTitle: payload.jobTitle
		});
	},
	async getAttendanceMonitor() {
		return extractData$1(await apiInstance.get("/ai-hub/attendance-monitor"), {
			anomaliesCount: 0,
			onTimeRate: 0,
			averageLateMinutes: 0,
			anomalies: []
		});
	},
	async analyzeAttendance(payload) {
		return extractData$1(await apiInstance.post("/ai-hub/attendance-monitor/analyze", payload ?? {}), {
			anomaliesCount: 0,
			onTimeRate: 0,
			averageLateMinutes: 0,
			anomalies: []
		});
	},
	async getAttendanceAnomalies(params) {
		const raw = extractData$1(await apiInstance.get("/ai-hub/attendance-monitor/anomalies", { params }), []);
		if (Array.isArray(raw)) return raw;
		if (raw && typeof raw === "object" && "items" in raw && Array.isArray(raw.items)) return raw.items;
		return [];
	},
	async getLeaveAssistant() {
		return extractData$1(await apiInstance.get("/ai-hub/leave-assistant"), { pendingApprovals: 0 });
	},
	async forecastLeaves(payload) {
		return extractData$1(await apiInstance.post("/ai-hub/leave-assistant/forecast", payload ?? {}), {
			period: "Next 30 Days",
			projectedAbsenceRate: 0,
			predictedPeakDates: []
		});
	},
	async analyzeLeavePatterns(payload) {
		return extractData$1(await apiInstance.post("/ai-hub/leave-assistant/analyze", payload ?? {}), { pendingApprovals: 0 });
	},
	async getPerformanceCoach() {
		return extractData$1(await apiInstance.get("/ai-hub/performance-coach"), {
			coachingSessionsCount: 0,
			goalsGeneratedCount: 0,
			recommendationsCount: 0,
			goals: [],
			trainingRecommendations: []
		});
	},
	async generatePerformanceGoals(payload) {
		const raw = extractData$1(await apiInstance.post("/ai-hub/performance-coach/goals", payload), []);
		return Array.isArray(raw) ? raw : [];
	},
	async generateTrainingRecommendations(payload) {
		const raw = extractData$1(await apiInstance.post("/ai-hub/performance-coach/training-recommendations", payload), []);
		return Array.isArray(raw) ? raw : [];
	},
	async getPayrollInsights() {
		return extractData$1(await apiInstance.get("/ai-hub/payroll-insights"), {
			cycle: "Current",
			totalVariance: 0,
			variancePercentage: 0,
			anomaliesDetected: 0,
			taxAuditFlags: 0,
			summary: ""
		});
	},
	async analyzePayroll(payload) {
		return extractData$1(await apiInstance.post("/ai-hub/payroll-insights/analyze", payload ?? {}), {
			cycle: "Current",
			totalVariance: 0,
			variancePercentage: 0,
			anomaliesDetected: 0,
			taxAuditFlags: 0,
			summary: ""
		});
	},
	async getPayrollAnomalies(params) {
		const raw = extractData$1(await apiInstance.get("/ai-hub/payroll-insights/anomalies", { params }), []);
		if (Array.isArray(raw)) return raw;
		if (raw && typeof raw === "object" && "items" in raw && Array.isArray(raw.items)) return raw.items;
		return [];
	},
	async runTaxAudit(payload) {
		return extractData$1(await apiInstance.post("/ai-hub/payroll-insights/tax-audit", payload ?? {}), {
			passed: true,
			flagsCount: 0,
			summary: "Tax audit completed with no critical flags."
		});
	},
	async getWorkforcePlanning() {
		return extractData$1(await apiInstance.get("/ai/workforce/dashboard"), {
			currentHeadcount: 0,
			forecast: {
				horizonMonths: 12,
				projectedHeadcount: 0,
				projectedCost: 0
			}
		});
	},
	async forecastWorkforce(payload) {
		return extractData$1(await apiInstance.post("/ai/workforce/forecast", payload ?? {}), {
			horizonMonths: payload?.horizonMonths ?? 12,
			projectedHeadcount: 0,
			projectedCost: 0
		});
	},
	async forecastHeadcount(payload) {
		return extractData$1(await apiInstance.post("/ai-hub/workforce-planning/headcount", payload ?? {}), {
			recommendedHeadcount: 0,
			budgetEstimated: 0
		});
	},
	async getEmployeeHealth() {
		return extractData$1(await apiInstance.get("/ai-hub/employee-health"), {
			burnoutRiskIndex: 0,
			wellnessScore: 0,
			sentimentScore: 0,
			trend: 0
		});
	},
	async analyzeEmployeeHealth(payload) {
		return extractData$1(await apiInstance.post("/ai-hub/employee-health/analyze", payload ?? {}), {
			burnoutRiskIndex: 0,
			wellnessScore: 0,
			sentimentScore: 0,
			trend: 0
		});
	},
	async getWellnessInsights() {
		return extractData$1(await apiInstance.get("/ai-hub/employee-health/wellness"), {
			wellnessScore: 0,
			recommendations: []
		});
	},
	async getPolicyAssistant() {
		return extractData$1(await apiInstance.get("/ai-hub/policy-assistant"), {
			queriesCount: 0,
			complianceRate: 100,
			recentQueries: []
		});
	},
	async askPolicyAssistant(payload) {
		return extractData$1(await apiInstance.post("/ai-hub/policy-assistant/ask", payload), {
			question: payload.question,
			answer: "",
			confidence: 0
		});
	},
	async checkPolicyCompliance(payload) {
		return extractData$1(await apiInstance.post("/ai-hub/policy-assistant/check-compliance", payload), {
			compliant: true,
			score: 100,
			issues: []
		});
	},
	async getDocumentGenerator() {
		return extractData$1(await apiInstance.get("/ai-hub/document-generator"), {
			templatesCount: 0,
			documentsGeneratedCount: 0,
			templates: [],
			recentDocuments: []
		});
	},
	async getDocumentTemplates() {
		const raw = extractData$1(await apiInstance.get("/ai-hub/document-generator/templates"), []);
		return Array.isArray(raw) ? raw : [];
	},
	async generateDocument(payload) {
		return extractData$1(await apiInstance.post("/ai-hub/document-generator/generate", payload));
	},
	async previewDocument(payload) {
		return extractData$1(await apiInstance.post("/ai-hub/document-generator/preview", payload), {
			previewContent: "",
			templateId: payload.templateId
		});
	},
	async getMeetingIntelligence() {
		return extractData$1(await apiInstance.get("/ai-hub/meeting-intelligence"), {
			analyzedMeetingsCount: 0,
			actionItemsPendingCount: 0,
			recentSummaries: [],
			actionItems: []
		});
	},
	async analyzeMeeting(payload) {
		return extractData$1(await apiInstance.post("/ai-hub/meeting-intelligence/analyze", payload));
	},
	async summarizeMeeting(payload) {
		return extractData$1(await apiInstance.post("/ai-hub/meeting-intelligence/summarize", payload), {
			summary: "",
			keyPoints: []
		});
	},
	async getMeetingActionItems(params) {
		const raw = extractData$1(await apiInstance.get("/ai-hub/meeting-intelligence/action-items", { params }), []);
		if (Array.isArray(raw)) return raw;
		if (raw && typeof raw === "object" && "items" in raw && Array.isArray(raw.items)) return raw.items;
		return [];
	},
	async getComplianceMonitor() {
		return extractData$1(await apiInstance.get("/ai-hub/compliance-monitor"), {
			score: 100,
			status: "compliant",
			checklist: []
		});
	},
	async scanCompliance(payload) {
		return extractData$1(await apiInstance.post("/ai-hub/compliance-monitor/scan", payload ?? {}), {
			framework: payload?.framework ?? "General Statutory",
			overallScore: 100,
			status: "compliant",
			scannedAt: (/* @__PURE__ */ new Date()).toISOString()
		});
	},
	async getComplianceChecklist() {
		const raw = extractData$1(await apiInstance.get("/ai-hub/compliance-monitor/checklist"), []);
		return Array.isArray(raw) ? raw : [];
	},
	async getComplianceScore() {
		return extractData$1(await apiInstance.get("/ai-hub/compliance-monitor/score"), {
			score: 100,
			status: "compliant",
			lastScan: (/* @__PURE__ */ new Date()).toISOString()
		});
	},
	async getChatConversations(params) {
		try {
			const raw = extractData$1(await apiInstance.get("/ai-hub/chat-assistant/conversations", { params }), []);
			let items = [];
			if (Array.isArray(raw)) items = raw;
			else if (raw && typeof raw === "object" && "items" in raw) {
				const withItems = raw;
				if (Array.isArray(withItems.items)) items = withItems.items;
			}
			return items.map((item) => normalizeChatConversation(item));
		} catch {
			try {
				const raw = extractData$1(await apiInstance.get("/ai/chat/history"), {});
				return (Array.isArray(raw?.history) ? raw.history : []).map((item) => ({
					id: String(item.conversation_id || item.conversationId || ""),
					title: String(item.title || "Conversation"),
					messages: [],
					createdAt: item.updated_at ? new Date(String(item.updated_at)).toISOString() : (/* @__PURE__ */ new Date()).toISOString(),
					updatedAt: item.updated_at ? new Date(String(item.updated_at)).toISOString() : (/* @__PURE__ */ new Date()).toISOString()
				}));
			} catch {
				return [];
			}
		}
	},
	async createChatConversation(payload) {
		try {
			return normalizeChatConversation(extractData$1(await apiInstance.post("/ai-hub/chat-assistant/conversations", payload ?? {})));
		} catch (primaryErr) {
			try {
				return normalizeChatConversation(extractData$1(await apiInstance.post("/ai/chat/conversation", payload ?? {})));
			} catch {
				throw primaryErr;
			}
		}
	},
	async getChatConversation(conversationId) {
		try {
			return normalizeChatConversation(extractData$1(await apiInstance.get(`/ai-hub/chat-assistant/conversations/${encodeURIComponent(conversationId)}`)), conversationId);
		} catch (primaryErr) {
			try {
				return normalizeChatConversation(extractData$1(await apiInstance.get(`/ai/chat/history/${encodeURIComponent(conversationId)}`)), conversationId);
			} catch {
				throw primaryErr;
			}
		}
	},
	async sendChatMessage(payload) {
		try {
			return mapToChatMessage(extractData$1(await apiInstance.post("/ai-hub/chat-assistant/message", payload)), payload.conversationId);
		} catch (err) {
			try {
				return mapToChatMessage(extractData$1(await apiInstance.post("/ai/chat", {
					conversation_id: payload.conversationId,
					message: payload.content,
					query: payload.content
				})), payload.conversationId);
			} catch {
				throw err;
			}
		}
	},
	async getChatSuggestions() {
		try {
			const raw = extractData$1(await apiInstance.get("/ai/chat/suggestions"), []);
			if (Array.isArray(raw)) return raw.map((item) => {
				if (typeof item === "string") return {
					label: item,
					cmd: item
				};
				if (item && typeof item === "object") {
					const rec = item;
					return {
						label: String(rec.label || rec.cmd || rec.title || rec.query || ""),
						cmd: String(rec.cmd || rec.query || rec.label || rec.title || "")
					};
				}
				return {
					label: "",
					cmd: ""
				};
			}).filter((s) => s.cmd);
			if (raw && typeof raw === "object" && "suggestions" in raw && Array.isArray(raw.suggestions)) return raw.suggestions.map((item) => {
				if (typeof item === "string") return {
					label: item,
					cmd: item
				};
				if (item && typeof item === "object") {
					const rec = item;
					return {
						label: String(rec.label || rec.cmd || rec.title || rec.query || ""),
						cmd: String(rec.cmd || rec.query || rec.label || rec.title || "")
					};
				}
				return {
					label: "",
					cmd: ""
				};
			}).filter((s) => s.cmd);
			return [];
		} catch {
			return [];
		}
	},
	async sendChatFeedback(payload) {
		try {
			return extractData$1(await apiInstance.post("/ai/chat/feedback", {
				message_id: payload.messageId,
				messageId: payload.messageId,
				conversation_id: payload.conversationId,
				conversationId: payload.conversationId,
				rating: payload.rating,
				feedback: payload.feedback
			}), { success: true });
		} catch {
			return { success: true };
		}
	},
	async deleteChatConversation(conversationId) {
		try {
			return extractData$1(await apiInstance.delete(`/ai-hub/chat-assistant/conversations/${encodeURIComponent(conversationId)}`), {
				success: true,
				id: conversationId
			});
		} catch {
			try {
				await apiInstance.delete(`/ai/chat/history/${encodeURIComponent(conversationId)}`);
			} catch {}
			return {
				success: true,
				id: conversationId
			};
		}
	},
	async getAnalyticsCenter() {
		return extractData$1(await apiInstance.get("/ai-hub/analytics-center"), {});
	},
	async analyzeAnalytics(payload) {
		return extractData$1(await apiInstance.post("/ai-hub/analytics-center/analyze", payload ?? {}), {
			category: payload?.category ?? "General",
			timestamp: (/* @__PURE__ */ new Date()).toISOString()
		});
	},
	async getAttritionAnalytics() {
		return extractData$1(await apiInstance.get("/ai-hub/analytics-center/attrition"), {});
	},
	async getDiversityAnalytics() {
		return extractData$1(await apiInstance.get("/ai-hub/analytics-center/diversity"), {});
	},
	async getExecutiveSummary() {
		return extractData$1(await apiInstance.get("/ai-hub/analytics-center/executive-summary"), {
			executiveSummary: "",
			timestamp: (/* @__PURE__ */ new Date()).toISOString()
		});
	}
};
/**
* Normalizes API errors into user-friendly error messages with status code recognition.
*/
function getAIHubThunkErrorMessage(err, fallbackMessage) {
	const parsed = parseApiError(err, fallbackMessage);
	const msg = parsed.message;
	if (!msg || msg === "An error occurred" || msg === "Network error" || msg === fallbackMessage) switch (parsed.status) {
		case 400: return "Invalid request parameters. Please verify your input.";
		case 401: return "Authentication required. Please log in to continue.";
		case 403: return "Access denied. You do not have permission for this AI action.";
		case 404: return "The requested AI resource or agent was not found.";
		case 409: return "Conflict detected with ongoing AI processing.";
		case 422: return "Validation failed on the AI parameters.";
		case 429: return "Rate limit reached. Please wait a moment before trying again.";
		default: return fallbackMessage || "Internal AI service error. Please try again later.";
	}
	return msg;
}
var fetchAIHubOverview = createAsyncThunk("aiHub/fetchAIHubOverview", async (_, { rejectWithValue }) => {
	try {
		return await aiHubApi.getOverview();
	} catch (err) {
		return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to load AI Hub overview"));
	}
});
var fetchAIAgents = createAsyncThunk("aiHub/fetchAIAgents", async (_, { rejectWithValue }) => {
	try {
		return await aiHubApi.getAgents();
	} catch (err) {
		return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to load AI agents"));
	}
});
var fetchAIAgentDetails = createAsyncThunk("aiHub/fetchAIAgentDetails", async (agentId, { rejectWithValue }) => {
	try {
		return await aiHubApi.getAgentDetails(agentId);
	} catch (err) {
		return rejectWithValue(getAIHubThunkErrorMessage(err, `Failed to load details for agent ${agentId}`));
	}
});
var runAIAgent = createAsyncThunk("aiHub/runAIAgent", async ({ agentId, payload }, { rejectWithValue }) => {
	try {
		return await aiHubApi.runAgent(agentId, payload);
	} catch (err) {
		return rejectWithValue(getAIHubThunkErrorMessage(err, `Failed to run agent ${agentId}`));
	}
});
var fetchAIAgentHistory = createAsyncThunk("aiHub/fetchAIAgentHistory", async ({ agentId, params }, { rejectWithValue }) => {
	try {
		return await aiHubApi.getAgentHistory(agentId, params);
	} catch (err) {
		return rejectWithValue(getAIHubThunkErrorMessage(err, `Failed to load history for agent ${agentId}`));
	}
});
var fetchAIAgentStatus = createAsyncThunk("aiHub/fetchAIAgentStatus", async (agentId, { rejectWithValue }) => {
	try {
		return await aiHubApi.getAgentStatus(agentId);
	} catch (err) {
		return rejectWithValue(getAIHubThunkErrorMessage(err, `Failed to check status for agent ${agentId}`));
	}
});
var submitAIAgentFeedback = createAsyncThunk("aiHub/submitAIAgentFeedback", async ({ agentId, payload }, { rejectWithValue }) => {
	try {
		return await aiHubApi.submitAgentFeedback(agentId, payload);
	} catch (err) {
		return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to submit agent feedback"));
	}
});
var fetchWorkforceInsights = createAsyncThunk("aiHub/fetchWorkforceInsights", async (_, { rejectWithValue }) => {
	try {
		return await aiHubApi.getWorkforceInsights();
	} catch (err) {
		return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to load workforce insights"));
	}
});
var analyzeWorkforceInsights = createAsyncThunk("aiHub/analyzeWorkforceInsights", async (payload, { rejectWithValue }) => {
	try {
		return await aiHubApi.analyzeWorkforceInsights(payload);
	} catch (err) {
		return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to analyze workforce data"));
	}
});
var fetchRecruiterInsights = createAsyncThunk("aiHub/fetchRecruiterInsights", async (_, { rejectWithValue }) => {
	try {
		return await aiHubApi.getRecruiterInsights();
	} catch (err) {
		return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to load recruiter insights"));
	}
});
var screenResumes = createAsyncThunk("aiHub/screenResumes", async (payload, { rejectWithValue }) => {
	try {
		return await aiHubApi.screenResumes(payload);
	} catch (err) {
		return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to screen resumes"));
	}
});
var matchCandidates = createAsyncThunk("aiHub/matchCandidates", async (payload, { rejectWithValue }) => {
	try {
		return await aiHubApi.matchCandidates(payload);
	} catch (err) {
		return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to match candidates to job requirements"));
	}
});
var generateInterviewQuestions = createAsyncThunk("aiHub/generateInterviewQuestions", async (payload, { rejectWithValue }) => {
	try {
		return await aiHubApi.generateInterviewQuestions(payload);
	} catch (err) {
		return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to generate interview questions"));
	}
});
var fetchAttendanceMonitor = createAsyncThunk("aiHub/fetchAttendanceMonitor", async (_, { rejectWithValue }) => {
	try {
		return await aiHubApi.getAttendanceMonitor();
	} catch (err) {
		return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to load attendance monitor data"));
	}
});
var analyzeAttendance = createAsyncThunk("aiHub/analyzeAttendance", async (payload, { rejectWithValue }) => {
	try {
		return await aiHubApi.analyzeAttendance(payload);
	} catch (err) {
		return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to run attendance analysis"));
	}
});
var fetchAttendanceAnomalies = createAsyncThunk("aiHub/fetchAttendanceAnomalies", async (params, { rejectWithValue }) => {
	try {
		return await aiHubApi.getAttendanceAnomalies(params);
	} catch (err) {
		return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to fetch attendance anomalies"));
	}
});
var fetchLeaveAssistant = createAsyncThunk("aiHub/fetchLeaveAssistant", async (_, { rejectWithValue }) => {
	try {
		return await aiHubApi.getLeaveAssistant();
	} catch (err) {
		return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to load leave assistant data"));
	}
});
var forecastLeaves = createAsyncThunk("aiHub/forecastLeaves", async (payload, { rejectWithValue }) => {
	try {
		return await aiHubApi.forecastLeaves(payload);
	} catch (err) {
		return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to forecast leave trends"));
	}
});
var analyzeLeavePatterns = createAsyncThunk("aiHub/analyzeLeavePatterns", async (payload, { rejectWithValue }) => {
	try {
		return await aiHubApi.analyzeLeavePatterns(payload);
	} catch (err) {
		return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to analyze leave patterns"));
	}
});
var fetchPerformanceCoach = createAsyncThunk("aiHub/fetchPerformanceCoach", async (_, { rejectWithValue }) => {
	try {
		return await aiHubApi.getPerformanceCoach();
	} catch (err) {
		return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to load performance coach data"));
	}
});
var generatePerformanceGoals = createAsyncThunk("aiHub/generatePerformanceGoals", async (payload, { rejectWithValue }) => {
	try {
		return await aiHubApi.generatePerformanceGoals(payload);
	} catch (err) {
		return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to generate SMART performance goals"));
	}
});
var generateTrainingRecommendations = createAsyncThunk("aiHub/generateTrainingRecommendations", async (payload, { rejectWithValue }) => {
	try {
		return await aiHubApi.generateTrainingRecommendations(payload);
	} catch (err) {
		return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to generate training recommendations"));
	}
});
var fetchPayrollInsights = createAsyncThunk("aiHub/fetchPayrollInsights", async (_, { rejectWithValue }) => {
	try {
		return await aiHubApi.getPayrollInsights();
	} catch (err) {
		return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to load payroll insights"));
	}
});
var analyzePayroll = createAsyncThunk("aiHub/analyzePayroll", async (payload, { rejectWithValue }) => {
	try {
		return await aiHubApi.analyzePayroll(payload);
	} catch (err) {
		return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to analyze payroll variances"));
	}
});
var fetchPayrollAnomalies = createAsyncThunk("aiHub/fetchPayrollAnomalies", async (params, { rejectWithValue }) => {
	try {
		return await aiHubApi.getPayrollAnomalies(params);
	} catch (err) {
		return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to fetch payroll anomalies"));
	}
});
var runTaxAudit = createAsyncThunk("aiHub/runTaxAudit", async (payload, { rejectWithValue }) => {
	try {
		return await aiHubApi.runTaxAudit(payload);
	} catch (err) {
		return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to run automated tax audit"));
	}
});
var fetchWorkforcePlanning = createAsyncThunk("aiHub/fetchWorkforcePlanning", async (_, { rejectWithValue }) => {
	try {
		return await aiHubApi.getWorkforcePlanning();
	} catch (err) {
		return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to load workforce planning data"));
	}
});
var forecastWorkforce = createAsyncThunk("aiHub/forecastWorkforce", async (payload, { rejectWithValue }) => {
	try {
		return await aiHubApi.forecastWorkforce(payload);
	} catch (err) {
		return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to forecast workforce demand"));
	}
});
var forecastHeadcount = createAsyncThunk("aiHub/forecastHeadcount", async (payload, { rejectWithValue }) => {
	try {
		return await aiHubApi.forecastHeadcount(payload);
	} catch (err) {
		return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to forecast headcount requirements"));
	}
});
var fetchEmployeeHealth = createAsyncThunk("aiHub/fetchEmployeeHealth", async (_, { rejectWithValue }) => {
	try {
		return await aiHubApi.getEmployeeHealth();
	} catch (err) {
		return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to load employee health insights"));
	}
});
var analyzeEmployeeHealth = createAsyncThunk("aiHub/analyzeEmployeeHealth", async (payload, { rejectWithValue }) => {
	try {
		return await aiHubApi.analyzeEmployeeHealth(payload);
	} catch (err) {
		return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to analyze organizational wellness"));
	}
});
var fetchWellnessInsights = createAsyncThunk("aiHub/fetchWellnessInsights", async (_, { rejectWithValue }) => {
	try {
		return await aiHubApi.getWellnessInsights();
	} catch (err) {
		return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to load wellness recommendations"));
	}
});
var fetchPolicyAssistant = createAsyncThunk("aiHub/fetchPolicyAssistant", async (_, { rejectWithValue }) => {
	try {
		return await aiHubApi.getPolicyAssistant();
	} catch (err) {
		return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to load policy assistant overview"));
	}
});
var askPolicyAssistant = createAsyncThunk("aiHub/askPolicyAssistant", async (payload, { rejectWithValue }) => {
	try {
		return await aiHubApi.askPolicyAssistant(payload);
	} catch (err) {
		return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to resolve policy query"));
	}
});
var checkPolicyCompliance = createAsyncThunk("aiHub/checkPolicyCompliance", async (payload, { rejectWithValue }) => {
	try {
		return await aiHubApi.checkPolicyCompliance(payload);
	} catch (err) {
		return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to verify document compliance"));
	}
});
var fetchDocumentGenerator = createAsyncThunk("aiHub/fetchDocumentGenerator", async (_, { rejectWithValue }) => {
	try {
		return await aiHubApi.getDocumentGenerator();
	} catch (err) {
		return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to load document generator"));
	}
});
var fetchDocumentTemplates = createAsyncThunk("aiHub/fetchDocumentTemplates", async (_, { rejectWithValue }) => {
	try {
		return await aiHubApi.getDocumentTemplates();
	} catch (err) {
		return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to load document templates"));
	}
});
var generateDocument = createAsyncThunk("aiHub/generateDocument", async (payload, { rejectWithValue }) => {
	try {
		return await aiHubApi.generateDocument(payload);
	} catch (err) {
		return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to generate document"));
	}
});
var previewDocument = createAsyncThunk("aiHub/previewDocument", async (payload, { rejectWithValue }) => {
	try {
		return await aiHubApi.previewDocument(payload);
	} catch (err) {
		return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to preview document"));
	}
});
var fetchMeetingIntelligence = createAsyncThunk("aiHub/fetchMeetingIntelligence", async (_, { rejectWithValue }) => {
	try {
		return await aiHubApi.getMeetingIntelligence();
	} catch (err) {
		return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to load meeting intelligence"));
	}
});
var analyzeMeeting = createAsyncThunk("aiHub/analyzeMeeting", async (payload, { rejectWithValue }) => {
	try {
		return await aiHubApi.analyzeMeeting(payload);
	} catch (err) {
		return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to analyze meeting"));
	}
});
var summarizeMeeting = createAsyncThunk("aiHub/summarizeMeeting", async (payload, { rejectWithValue }) => {
	try {
		return await aiHubApi.summarizeMeeting(payload);
	} catch (err) {
		return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to summarize meeting"));
	}
});
var fetchMeetingActionItems = createAsyncThunk("aiHub/fetchMeetingActionItems", async (params, { rejectWithValue }) => {
	try {
		return await aiHubApi.getMeetingActionItems(params);
	} catch (err) {
		return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to load meeting action items"));
	}
});
var fetchComplianceMonitor = createAsyncThunk("aiHub/fetchComplianceMonitor", async (_, { rejectWithValue }) => {
	try {
		return await aiHubApi.getComplianceMonitor();
	} catch (err) {
		return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to load compliance monitor"));
	}
});
var scanCompliance = createAsyncThunk("aiHub/scanCompliance", async (payload, { rejectWithValue }) => {
	try {
		return await aiHubApi.scanCompliance(payload);
	} catch (err) {
		return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to run compliance scan"));
	}
});
var fetchComplianceChecklist = createAsyncThunk("aiHub/fetchComplianceChecklist", async (_, { rejectWithValue }) => {
	try {
		return await aiHubApi.getComplianceChecklist();
	} catch (err) {
		return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to load compliance checklist"));
	}
});
var fetchComplianceScore = createAsyncThunk("aiHub/fetchComplianceScore", async (_, { rejectWithValue }) => {
	try {
		return await aiHubApi.getComplianceScore();
	} catch (err) {
		return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to load compliance score"));
	}
});
var fetchChatConversations = createAsyncThunk("aiHub/fetchChatConversations", async (params, { rejectWithValue }) => {
	try {
		return await aiHubApi.getChatConversations(params);
	} catch (err) {
		return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to load chat conversations"));
	}
});
var createChatConversation = createAsyncThunk("aiHub/createChatConversation", async (payload, { rejectWithValue }) => {
	try {
		return await aiHubApi.createChatConversation(payload);
	} catch (err) {
		return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to create conversation"));
	}
});
var fetchChatConversation = createAsyncThunk("aiHub/fetchChatConversation", async (conversationId, { rejectWithValue }) => {
	try {
		return await aiHubApi.getChatConversation(conversationId);
	} catch (err) {
		return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to load conversation details"));
	}
});
var sendChatMessage = createAsyncThunk("aiHub/sendChatMessage", async (payload, { rejectWithValue }) => {
	try {
		return await aiHubApi.sendChatMessage(payload);
	} catch (err) {
		return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to send message to assistant"));
	}
});
var deleteChatConversation = createAsyncThunk("aiHub/deleteChatConversation", async (conversationId, { rejectWithValue }) => {
	try {
		return await aiHubApi.deleteChatConversation(conversationId);
	} catch (err) {
		return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to delete conversation"));
	}
});
var fetchAnalyticsCenter = createAsyncThunk("aiHub/fetchAnalyticsCenter", async (_, { rejectWithValue }) => {
	try {
		return await aiHubApi.getAnalyticsCenter();
	} catch (err) {
		return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to load analytics center"));
	}
});
var analyzeAnalytics = createAsyncThunk("aiHub/analyzeAnalytics", async (payload, { rejectWithValue }) => {
	try {
		return await aiHubApi.analyzeAnalytics(payload);
	} catch (err) {
		return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to run analytics query"));
	}
});
var fetchAttritionAnalytics$1 = createAsyncThunk("aiHub/fetchAttritionAnalytics", async (_, { rejectWithValue }) => {
	try {
		return await aiHubApi.getAttritionAnalytics();
	} catch (err) {
		return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to load attrition analytics"));
	}
});
var fetchDiversityAnalytics = createAsyncThunk("aiHub/fetchDiversityAnalytics", async (_, { rejectWithValue }) => {
	try {
		return await aiHubApi.getDiversityAnalytics();
	} catch (err) {
		return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to load diversity analytics"));
	}
});
var fetchExecutiveSummary = createAsyncThunk("aiHub/fetchExecutiveSummary", async (_, { rejectWithValue }) => {
	try {
		return await aiHubApi.getExecutiveSummary();
	} catch (err) {
		return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to load executive summary"));
	}
});
function createInitialSectionState$1(data = null) {
	return {
		data,
		loading: false,
		error: null,
		success: false,
		lastUpdated: null
	};
}
var initialState$2 = {
	overview: createInitialSectionState$1(),
	agents: createInitialSectionState$1([]),
	selectedAgent: null,
	agentDetails: createInitialSectionState$1(),
	agentHistory: createInitialSectionState$1([]),
	agentStatus: createInitialSectionState$1(),
	workforceInsights: createInitialSectionState$1([]),
	recruiter: createInitialSectionState$1([]),
	attendanceMonitor: createInitialSectionState$1({
		anomaliesCount: 0,
		onTimeRate: 0,
		averageLateMinutes: 0,
		anomalies: []
	}),
	leaveAssistant: createInitialSectionState$1({ pendingApprovals: 0 }),
	performanceCoach: createInitialSectionState$1({
		coachingSessionsCount: 0,
		goalsGeneratedCount: 0,
		recommendationsCount: 0,
		goals: [],
		trainingRecommendations: []
	}),
	payrollInsights: createInitialSectionState$1({
		cycle: "Current",
		totalVariance: 0,
		variancePercentage: 0,
		anomaliesDetected: 0,
		taxAuditFlags: 0,
		summary: ""
	}),
	workforcePlanning: createInitialSectionState$1({
		currentHeadcount: 0,
		forecast: {
			horizonMonths: 12,
			projectedHeadcount: 0,
			projectedCost: 0
		}
	}),
	employeeHealth: createInitialSectionState$1({
		burnoutRiskIndex: 0,
		wellnessScore: 0,
		sentimentScore: 0,
		trend: 0
	}),
	policyAssistant: createInitialSectionState$1({
		queriesCount: 0,
		complianceRate: 100,
		recentQueries: []
	}),
	documentGenerator: createInitialSectionState$1({
		templatesCount: 0,
		documentsGeneratedCount: 0,
		templates: [],
		recentDocuments: []
	}),
	meetingIntelligence: createInitialSectionState$1({
		analyzedMeetingsCount: 0,
		actionItemsPendingCount: 0,
		recentSummaries: [],
		actionItems: []
	}),
	complianceMonitor: createInitialSectionState$1({
		score: 100,
		status: "compliant",
		checklist: []
	}),
	chatAssistant: createInitialSectionState$1({
		conversations: [],
		activeConversation: null,
		totalMessages: 0
	}),
	analyticsCenter: createInitialSectionState$1({}),
	operationLoading: {},
	operationErrors: {},
	operationSuccess: {}
};
var aiHubSlice = createSlice({
	name: "aiHub",
	initialState: initialState$2,
	reducers: {
		setSelectedAgent: (state, action) => {
			state.selectedAgent = action.payload;
		},
		setActiveConversation: (state, action) => {
			if (state.chatAssistant.data) state.chatAssistant.data.activeConversation = state.chatAssistant.data.conversations.find((c) => c.id === action.payload) || null;
		},
		clearOperationStatus: (state, action) => {
			const key = action.payload;
			delete state.operationLoading[key];
			delete state.operationErrors[key];
			delete state.operationSuccess[key];
		},
		resetAIHubState: () => initialState$2
	},
	extraReducers: (builder) => {
		builder.addCase(fetchAIHubOverview.pending, (state) => {
			state.overview.loading = true;
			state.overview.error = null;
		}).addCase(fetchAIHubOverview.fulfilled, (state, action) => {
			state.overview.loading = false;
			state.overview.data = action.payload;
			state.overview.success = true;
			state.overview.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
		}).addCase(fetchAIHubOverview.rejected, (state, action) => {
			state.overview.loading = false;
			state.overview.error = action.payload || "Failed to load overview";
			state.overview.success = false;
		}).addCase(fetchAIAgents.pending, (state) => {
			state.agents.loading = true;
			state.agents.error = null;
		}).addCase(fetchAIAgents.fulfilled, (state, action) => {
			state.agents.loading = false;
			state.agents.data = action.payload;
			state.agents.success = true;
			state.agents.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
		}).addCase(fetchAIAgents.rejected, (state, action) => {
			state.agents.loading = false;
			state.agents.error = action.payload || "Failed to load agents";
			state.agents.success = false;
		}).addCase(fetchAIAgentDetails.pending, (state) => {
			state.agentDetails.loading = true;
			state.agentDetails.error = null;
		}).addCase(fetchAIAgentDetails.fulfilled, (state, action) => {
			state.agentDetails.loading = false;
			state.agentDetails.data = action.payload;
			state.agentDetails.success = true;
			state.agentDetails.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
		}).addCase(fetchAIAgentDetails.rejected, (state, action) => {
			state.agentDetails.loading = false;
			state.agentDetails.error = action.payload || "Failed to load agent details";
			state.agentDetails.success = false;
		});
		builder.addCase(runAIAgent.pending, (state) => {
			state.operationLoading["runAIAgent"] = true;
			state.operationErrors["runAIAgent"] = null;
			state.operationSuccess["runAIAgent"] = false;
		}).addCase(runAIAgent.fulfilled, (state, action) => {
			state.operationLoading["runAIAgent"] = false;
			state.operationSuccess["runAIAgent"] = true;
			if (state.overview.data) state.overview.data.tasksCompleted += 1;
			if (state.agentStatus.data && state.agentStatus.data.agentId === action.payload.agentId) state.agentStatus.data.status = action.payload.status || "idle";
		}).addCase(runAIAgent.rejected, (state, action) => {
			state.operationLoading["runAIAgent"] = false;
			state.operationErrors["runAIAgent"] = action.payload || "Agent run failed";
			state.operationSuccess["runAIAgent"] = false;
		}).addCase(fetchAIAgentHistory.pending, (state) => {
			state.agentHistory.loading = true;
			state.agentHistory.error = null;
		}).addCase(fetchAIAgentHistory.fulfilled, (state, action) => {
			state.agentHistory.loading = false;
			state.agentHistory.data = action.payload;
			state.agentHistory.success = true;
			state.agentHistory.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
		}).addCase(fetchAIAgentHistory.rejected, (state, action) => {
			state.agentHistory.loading = false;
			state.agentHistory.error = action.payload || "Failed to load agent history";
			state.agentHistory.success = false;
		}).addCase(fetchAIAgentStatus.pending, (state) => {
			state.agentStatus.loading = true;
			state.agentStatus.error = null;
		}).addCase(fetchAIAgentStatus.fulfilled, (state, action) => {
			state.agentStatus.loading = false;
			state.agentStatus.data = action.payload;
			state.agentStatus.success = true;
			state.agentStatus.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
		}).addCase(fetchAIAgentStatus.rejected, (state, action) => {
			state.agentStatus.loading = false;
			state.agentStatus.error = action.payload || "Failed to fetch agent status";
			state.agentStatus.success = false;
		}).addCase(submitAIAgentFeedback.pending, (state) => {
			state.operationLoading["submitAIAgentFeedback"] = true;
			state.operationErrors["submitAIAgentFeedback"] = null;
		}).addCase(submitAIAgentFeedback.fulfilled, (state) => {
			state.operationLoading["submitAIAgentFeedback"] = false;
			state.operationSuccess["submitAIAgentFeedback"] = true;
		}).addCase(submitAIAgentFeedback.rejected, (state, action) => {
			state.operationLoading["submitAIAgentFeedback"] = false;
			state.operationErrors["submitAIAgentFeedback"] = action.payload || "Feedback submission failed";
		});
		builder.addCase(fetchWorkforceInsights.pending, (state) => {
			state.workforceInsights.loading = true;
			state.workforceInsights.error = null;
		}).addCase(fetchWorkforceInsights.fulfilled, (state, action) => {
			state.workforceInsights.loading = false;
			state.workforceInsights.data = action.payload;
			state.workforceInsights.success = true;
			state.workforceInsights.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
		}).addCase(fetchWorkforceInsights.rejected, (state, action) => {
			state.workforceInsights.loading = false;
			state.workforceInsights.error = action.payload || "Failed to load workforce insights";
			state.workforceInsights.success = false;
		}).addCase(analyzeWorkforceInsights.pending, (state) => {
			state.operationLoading["analyzeWorkforceInsights"] = true;
			state.operationErrors["analyzeWorkforceInsights"] = null;
		}).addCase(analyzeWorkforceInsights.fulfilled, (state, action) => {
			state.operationLoading["analyzeWorkforceInsights"] = false;
			state.operationSuccess["analyzeWorkforceInsights"] = true;
			state.workforceInsights.data = action.payload;
			state.workforceInsights.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
		}).addCase(analyzeWorkforceInsights.rejected, (state, action) => {
			state.operationLoading["analyzeWorkforceInsights"] = false;
			state.operationErrors["analyzeWorkforceInsights"] = action.payload || "Workforce analysis failed";
		});
		builder.addCase(fetchRecruiterInsights.pending, (state) => {
			state.recruiter.loading = true;
			state.recruiter.error = null;
		}).addCase(fetchRecruiterInsights.fulfilled, (state, action) => {
			state.recruiter.loading = false;
			state.recruiter.data = action.payload;
			state.recruiter.success = true;
			state.recruiter.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
		}).addCase(fetchRecruiterInsights.rejected, (state, action) => {
			state.recruiter.loading = false;
			state.recruiter.error = action.payload || "Failed to load recruiter insights";
			state.recruiter.success = false;
		}).addCase(screenResumes.pending, (state) => {
			state.operationLoading["screenResumes"] = true;
			state.operationErrors["screenResumes"] = null;
		}).addCase(screenResumes.fulfilled, (state, action) => {
			state.operationLoading["screenResumes"] = false;
			state.operationSuccess["screenResumes"] = true;
			state.recruiter.data = action.payload;
		}).addCase(screenResumes.rejected, (state, action) => {
			state.operationLoading["screenResumes"] = false;
			state.operationErrors["screenResumes"] = action.payload || "Screen resumes failed";
		}).addCase(matchCandidates.pending, (state) => {
			state.operationLoading["matchCandidates"] = true;
			state.operationErrors["matchCandidates"] = null;
		}).addCase(matchCandidates.fulfilled, (state, action) => {
			state.operationLoading["matchCandidates"] = false;
			state.operationSuccess["matchCandidates"] = true;
			state.recruiter.data = action.payload;
		}).addCase(matchCandidates.rejected, (state, action) => {
			state.operationLoading["matchCandidates"] = false;
			state.operationErrors["matchCandidates"] = action.payload || "Candidate matching failed";
		}).addCase(generateInterviewQuestions.pending, (state) => {
			state.operationLoading["generateInterviewQuestions"] = true;
			state.operationErrors["generateInterviewQuestions"] = null;
		}).addCase(generateInterviewQuestions.fulfilled, (state) => {
			state.operationLoading["generateInterviewQuestions"] = false;
			state.operationSuccess["generateInterviewQuestions"] = true;
		}).addCase(generateInterviewQuestions.rejected, (state, action) => {
			state.operationLoading["generateInterviewQuestions"] = false;
			state.operationErrors["generateInterviewQuestions"] = action.payload || "Question generation failed";
		});
		builder.addCase(fetchAttendanceMonitor.pending, (state) => {
			state.attendanceMonitor.loading = true;
			state.attendanceMonitor.error = null;
		}).addCase(fetchAttendanceMonitor.fulfilled, (state, action) => {
			state.attendanceMonitor.loading = false;
			state.attendanceMonitor.data = action.payload;
			state.attendanceMonitor.success = true;
			state.attendanceMonitor.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
		}).addCase(fetchAttendanceMonitor.rejected, (state, action) => {
			state.attendanceMonitor.loading = false;
			state.attendanceMonitor.error = action.payload || "Failed to load attendance monitor";
			state.attendanceMonitor.success = false;
		}).addCase(analyzeAttendance.pending, (state) => {
			state.operationLoading["analyzeAttendance"] = true;
			state.operationErrors["analyzeAttendance"] = null;
		}).addCase(analyzeAttendance.fulfilled, (state, action) => {
			state.operationLoading["analyzeAttendance"] = false;
			state.operationSuccess["analyzeAttendance"] = true;
			state.attendanceMonitor.data = action.payload;
		}).addCase(analyzeAttendance.rejected, (state, action) => {
			state.operationLoading["analyzeAttendance"] = false;
			state.operationErrors["analyzeAttendance"] = action.payload || "Attendance analysis failed";
		}).addCase(fetchAttendanceAnomalies.fulfilled, (state, action) => {
			if (state.attendanceMonitor.data) state.attendanceMonitor.data.anomalies = action.payload;
		});
		builder.addCase(fetchLeaveAssistant.pending, (state) => {
			state.leaveAssistant.loading = true;
			state.leaveAssistant.error = null;
		}).addCase(fetchLeaveAssistant.fulfilled, (state, action) => {
			state.leaveAssistant.loading = false;
			state.leaveAssistant.data = action.payload;
			state.leaveAssistant.success = true;
			state.leaveAssistant.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
		}).addCase(fetchLeaveAssistant.rejected, (state, action) => {
			state.leaveAssistant.loading = false;
			state.leaveAssistant.error = action.payload || "Failed to load leave assistant";
			state.leaveAssistant.success = false;
		}).addCase(forecastLeaves.pending, (state) => {
			state.operationLoading["forecastLeaves"] = true;
			state.operationErrors["forecastLeaves"] = null;
		}).addCase(forecastLeaves.fulfilled, (state, action) => {
			state.operationLoading["forecastLeaves"] = false;
			state.operationSuccess["forecastLeaves"] = true;
			if (state.leaveAssistant.data) state.leaveAssistant.data.forecast = action.payload;
		}).addCase(forecastLeaves.rejected, (state, action) => {
			state.operationLoading["forecastLeaves"] = false;
			state.operationErrors["forecastLeaves"] = action.payload || "Leave forecast failed";
		}).addCase(analyzeLeavePatterns.fulfilled, (state, action) => {
			state.leaveAssistant.data = action.payload;
		});
		builder.addCase(fetchPerformanceCoach.pending, (state) => {
			state.performanceCoach.loading = true;
			state.performanceCoach.error = null;
		}).addCase(fetchPerformanceCoach.fulfilled, (state, action) => {
			state.performanceCoach.loading = false;
			state.performanceCoach.data = action.payload;
			state.performanceCoach.success = true;
			state.performanceCoach.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
		}).addCase(fetchPerformanceCoach.rejected, (state, action) => {
			state.performanceCoach.loading = false;
			state.performanceCoach.error = action.payload || "Failed to load performance coach";
			state.performanceCoach.success = false;
		}).addCase(generatePerformanceGoals.pending, (state) => {
			state.operationLoading["generatePerformanceGoals"] = true;
			state.operationErrors["generatePerformanceGoals"] = null;
		}).addCase(generatePerformanceGoals.fulfilled, (state, action) => {
			state.operationLoading["generatePerformanceGoals"] = false;
			state.operationSuccess["generatePerformanceGoals"] = true;
			if (state.performanceCoach.data) state.performanceCoach.data.goals = action.payload;
		}).addCase(generatePerformanceGoals.rejected, (state, action) => {
			state.operationLoading["generatePerformanceGoals"] = false;
			state.operationErrors["generatePerformanceGoals"] = action.payload || "Goal generation failed";
		}).addCase(generateTrainingRecommendations.fulfilled, (state, action) => {
			if (state.performanceCoach.data) state.performanceCoach.data.trainingRecommendations = action.payload;
		});
		builder.addCase(fetchPayrollInsights.pending, (state) => {
			state.payrollInsights.loading = true;
			state.payrollInsights.error = null;
		}).addCase(fetchPayrollInsights.fulfilled, (state, action) => {
			state.payrollInsights.loading = false;
			state.payrollInsights.data = action.payload;
			state.payrollInsights.success = true;
			state.payrollInsights.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
		}).addCase(fetchPayrollInsights.rejected, (state, action) => {
			state.payrollInsights.loading = false;
			state.payrollInsights.error = action.payload || "Failed to load payroll insights";
			state.payrollInsights.success = false;
		}).addCase(analyzePayroll.pending, (state) => {
			state.operationLoading["analyzePayroll"] = true;
			state.operationErrors["analyzePayroll"] = null;
		}).addCase(analyzePayroll.fulfilled, (state, action) => {
			state.operationLoading["analyzePayroll"] = false;
			state.operationSuccess["analyzePayroll"] = true;
			state.payrollInsights.data = action.payload;
		}).addCase(analyzePayroll.rejected, (state, action) => {
			state.operationLoading["analyzePayroll"] = false;
			state.operationErrors["analyzePayroll"] = action.payload || "Payroll analysis failed";
		}).addCase(fetchPayrollAnomalies.fulfilled, (state, action) => {
			if (state.payrollInsights.data) state.payrollInsights.data.anomalies = action.payload;
		}).addCase(runTaxAudit.pending, (state) => {
			state.operationLoading["runTaxAudit"] = true;
			state.operationErrors["runTaxAudit"] = null;
		}).addCase(runTaxAudit.fulfilled, (state) => {
			state.operationLoading["runTaxAudit"] = false;
			state.operationSuccess["runTaxAudit"] = true;
		}).addCase(runTaxAudit.rejected, (state, action) => {
			state.operationLoading["runTaxAudit"] = false;
			state.operationErrors["runTaxAudit"] = action.payload || "Tax audit failed";
		});
		builder.addCase(fetchWorkforcePlanning.pending, (state) => {
			state.workforcePlanning.loading = true;
			state.workforcePlanning.error = null;
		}).addCase(fetchWorkforcePlanning.fulfilled, (state, action) => {
			state.workforcePlanning.loading = false;
			state.workforcePlanning.data = action.payload;
			state.workforcePlanning.success = true;
			state.workforcePlanning.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
		}).addCase(fetchWorkforcePlanning.rejected, (state, action) => {
			state.workforcePlanning.loading = false;
			state.workforcePlanning.error = action.payload || "Failed to load workforce planning";
			state.workforcePlanning.success = false;
		}).addCase(forecastWorkforce.pending, (state) => {
			state.operationLoading["forecastWorkforce"] = true;
			state.operationErrors["forecastWorkforce"] = null;
		}).addCase(forecastWorkforce.fulfilled, (state, action) => {
			state.operationLoading["forecastWorkforce"] = false;
			state.operationSuccess["forecastWorkforce"] = true;
			if (state.workforcePlanning.data) state.workforcePlanning.data.forecast = action.payload;
		}).addCase(forecastWorkforce.rejected, (state, action) => {
			state.operationLoading["forecastWorkforce"] = false;
			state.operationErrors["forecastWorkforce"] = action.payload || "Workforce forecast failed";
		}).addCase(forecastHeadcount.pending, (state) => {
			state.operationLoading["forecastHeadcount"] = true;
		}).addCase(forecastHeadcount.fulfilled, (state) => {
			state.operationLoading["forecastHeadcount"] = false;
			state.operationSuccess["forecastHeadcount"] = true;
		}).addCase(forecastHeadcount.rejected, (state, action) => {
			state.operationLoading["forecastHeadcount"] = false;
			state.operationErrors["forecastHeadcount"] = action.payload || "Headcount forecast failed";
		});
		builder.addCase(fetchEmployeeHealth.pending, (state) => {
			state.employeeHealth.loading = true;
			state.employeeHealth.error = null;
		}).addCase(fetchEmployeeHealth.fulfilled, (state, action) => {
			state.employeeHealth.loading = false;
			state.employeeHealth.data = action.payload;
			state.employeeHealth.success = true;
			state.employeeHealth.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
		}).addCase(fetchEmployeeHealth.rejected, (state, action) => {
			state.employeeHealth.loading = false;
			state.employeeHealth.error = action.payload || "Failed to load employee health";
			state.employeeHealth.success = false;
		}).addCase(analyzeEmployeeHealth.pending, (state) => {
			state.operationLoading["analyzeEmployeeHealth"] = true;
			state.operationErrors["analyzeEmployeeHealth"] = null;
		}).addCase(analyzeEmployeeHealth.fulfilled, (state, action) => {
			state.operationLoading["analyzeEmployeeHealth"] = false;
			state.operationSuccess["analyzeEmployeeHealth"] = true;
			state.employeeHealth.data = action.payload;
		}).addCase(analyzeEmployeeHealth.rejected, (state, action) => {
			state.operationLoading["analyzeEmployeeHealth"] = false;
			state.operationErrors["analyzeEmployeeHealth"] = action.payload || "Health analysis failed";
		}).addCase(fetchWellnessInsights.fulfilled, (state, action) => {
			if (state.employeeHealth.data) {
				state.employeeHealth.data.wellnessScore = action.payload.wellnessScore;
				state.employeeHealth.data.wellnessRecommendations = action.payload.recommendations;
			}
		});
		builder.addCase(fetchPolicyAssistant.pending, (state) => {
			state.policyAssistant.loading = true;
			state.policyAssistant.error = null;
		}).addCase(fetchPolicyAssistant.fulfilled, (state, action) => {
			state.policyAssistant.loading = false;
			state.policyAssistant.data = action.payload;
			state.policyAssistant.success = true;
			state.policyAssistant.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
		}).addCase(fetchPolicyAssistant.rejected, (state, action) => {
			state.policyAssistant.loading = false;
			state.policyAssistant.error = action.payload || "Failed to load policy assistant";
			state.policyAssistant.success = false;
		}).addCase(askPolicyAssistant.pending, (state) => {
			state.operationLoading["askPolicyAssistant"] = true;
			state.operationErrors["askPolicyAssistant"] = null;
		}).addCase(askPolicyAssistant.fulfilled, (state, action) => {
			state.operationLoading["askPolicyAssistant"] = false;
			state.operationSuccess["askPolicyAssistant"] = true;
			if (state.policyAssistant.data) {
				state.policyAssistant.data.queriesCount += 1;
				state.policyAssistant.data.recentQueries = [action.payload, ...state.policyAssistant.data.recentQueries ?? []].slice(0, 10);
			}
		}).addCase(askPolicyAssistant.rejected, (state, action) => {
			state.operationLoading["askPolicyAssistant"] = false;
			state.operationErrors["askPolicyAssistant"] = action.payload || "Policy query failed";
		}).addCase(checkPolicyCompliance.pending, (state) => {
			state.operationLoading["checkPolicyCompliance"] = true;
		}).addCase(checkPolicyCompliance.fulfilled, (state) => {
			state.operationLoading["checkPolicyCompliance"] = false;
			state.operationSuccess["checkPolicyCompliance"] = true;
		}).addCase(checkPolicyCompliance.rejected, (state, action) => {
			state.operationLoading["checkPolicyCompliance"] = false;
			state.operationErrors["checkPolicyCompliance"] = action.payload || "Compliance check failed";
		});
		builder.addCase(fetchDocumentGenerator.pending, (state) => {
			state.documentGenerator.loading = true;
			state.documentGenerator.error = null;
		}).addCase(fetchDocumentGenerator.fulfilled, (state, action) => {
			state.documentGenerator.loading = false;
			state.documentGenerator.data = action.payload;
			state.documentGenerator.success = true;
			state.documentGenerator.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
		}).addCase(fetchDocumentGenerator.rejected, (state, action) => {
			state.documentGenerator.loading = false;
			state.documentGenerator.error = action.payload || "Failed to load document generator";
			state.documentGenerator.success = false;
		}).addCase(fetchDocumentTemplates.fulfilled, (state, action) => {
			if (state.documentGenerator.data) {
				state.documentGenerator.data.templates = action.payload;
				state.documentGenerator.data.templatesCount = action.payload.length;
			}
		}).addCase(generateDocument.pending, (state) => {
			state.operationLoading["generateDocument"] = true;
			state.operationErrors["generateDocument"] = null;
		}).addCase(generateDocument.fulfilled, (state, action) => {
			state.operationLoading["generateDocument"] = false;
			state.operationSuccess["generateDocument"] = true;
			if (state.documentGenerator.data) {
				state.documentGenerator.data.documentsGeneratedCount += 1;
				state.documentGenerator.data.recentDocuments = [action.payload, ...state.documentGenerator.data.recentDocuments ?? []];
			}
		}).addCase(generateDocument.rejected, (state, action) => {
			state.operationLoading["generateDocument"] = false;
			state.operationErrors["generateDocument"] = action.payload || "Document generation failed";
		}).addCase(previewDocument.pending, (state) => {
			state.operationLoading["previewDocument"] = true;
		}).addCase(previewDocument.fulfilled, (state) => {
			state.operationLoading["previewDocument"] = false;
			state.operationSuccess["previewDocument"] = true;
		}).addCase(previewDocument.rejected, (state, action) => {
			state.operationLoading["previewDocument"] = false;
			state.operationErrors["previewDocument"] = action.payload || "Document preview failed";
		});
		builder.addCase(fetchMeetingIntelligence.pending, (state) => {
			state.meetingIntelligence.loading = true;
			state.meetingIntelligence.error = null;
		}).addCase(fetchMeetingIntelligence.fulfilled, (state, action) => {
			state.meetingIntelligence.loading = false;
			state.meetingIntelligence.data = action.payload;
			state.meetingIntelligence.success = true;
			state.meetingIntelligence.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
		}).addCase(fetchMeetingIntelligence.rejected, (state, action) => {
			state.meetingIntelligence.loading = false;
			state.meetingIntelligence.error = action.payload || "Failed to load meeting intelligence";
			state.meetingIntelligence.success = false;
		}).addCase(analyzeMeeting.pending, (state) => {
			state.operationLoading["analyzeMeeting"] = true;
			state.operationErrors["analyzeMeeting"] = null;
		}).addCase(analyzeMeeting.fulfilled, (state, action) => {
			state.operationLoading["analyzeMeeting"] = false;
			state.operationSuccess["analyzeMeeting"] = true;
			if (state.meetingIntelligence.data) {
				state.meetingIntelligence.data.analyzedMeetingsCount += 1;
				state.meetingIntelligence.data.recentSummaries = [action.payload, ...state.meetingIntelligence.data.recentSummaries ?? []];
			}
		}).addCase(analyzeMeeting.rejected, (state, action) => {
			state.operationLoading["analyzeMeeting"] = false;
			state.operationErrors["analyzeMeeting"] = action.payload || "Meeting analysis failed";
		}).addCase(summarizeMeeting.fulfilled, (state) => {
			state.operationSuccess["summarizeMeeting"] = true;
		}).addCase(fetchMeetingActionItems.fulfilled, (state, action) => {
			if (state.meetingIntelligence.data) {
				state.meetingIntelligence.data.actionItems = action.payload;
				state.meetingIntelligence.data.actionItemsPendingCount = action.payload.filter((i) => i.status !== "completed").length;
			}
		});
		builder.addCase(fetchComplianceMonitor.pending, (state) => {
			state.complianceMonitor.loading = true;
			state.complianceMonitor.error = null;
		}).addCase(fetchComplianceMonitor.fulfilled, (state, action) => {
			state.complianceMonitor.loading = false;
			state.complianceMonitor.data = action.payload;
			state.complianceMonitor.success = true;
			state.complianceMonitor.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
		}).addCase(fetchComplianceMonitor.rejected, (state, action) => {
			state.complianceMonitor.loading = false;
			state.complianceMonitor.error = action.payload || "Failed to load compliance monitor";
			state.complianceMonitor.success = false;
		}).addCase(scanCompliance.pending, (state) => {
			state.operationLoading["scanCompliance"] = true;
			state.operationErrors["scanCompliance"] = null;
		}).addCase(scanCompliance.fulfilled, (state, action) => {
			state.operationLoading["scanCompliance"] = false;
			state.operationSuccess["scanCompliance"] = true;
			if (state.complianceMonitor.data) {
				state.complianceMonitor.data.score = action.payload.overallScore;
				state.complianceMonitor.data.status = action.payload.status;
				if (action.payload.checklist) state.complianceMonitor.data.checklist = action.payload.checklist;
			}
		}).addCase(scanCompliance.rejected, (state, action) => {
			state.operationLoading["scanCompliance"] = false;
			state.operationErrors["scanCompliance"] = action.payload || "Compliance scan failed";
		}).addCase(fetchComplianceChecklist.fulfilled, (state, action) => {
			if (state.complianceMonitor.data) state.complianceMonitor.data.checklist = action.payload;
		}).addCase(fetchComplianceScore.fulfilled, (state, action) => {
			if (state.complianceMonitor.data) {
				state.complianceMonitor.data.score = action.payload.score;
				state.complianceMonitor.data.status = action.payload.status;
			}
		});
		builder.addCase(fetchChatConversations.pending, (state) => {
			state.chatAssistant.loading = true;
			state.chatAssistant.error = null;
		}).addCase(fetchChatConversations.fulfilled, (state, action) => {
			state.chatAssistant.loading = false;
			state.chatAssistant.success = true;
			state.chatAssistant.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
			if (state.chatAssistant.data) state.chatAssistant.data.conversations = action.payload;
		}).addCase(fetchChatConversations.rejected, (state, action) => {
			state.chatAssistant.loading = false;
			state.chatAssistant.error = action.payload || "Failed to load chat conversations";
			state.chatAssistant.success = false;
		}).addCase(createChatConversation.pending, (state) => {
			state.operationLoading["createChatConversation"] = true;
			state.operationErrors["createChatConversation"] = null;
		}).addCase(createChatConversation.fulfilled, (state, action) => {
			state.operationLoading["createChatConversation"] = false;
			state.operationSuccess["createChatConversation"] = true;
			state.operationErrors["createChatConversation"] = null;
			if (state.chatAssistant.data) {
				state.chatAssistant.data.conversations = [action.payload, ...state.chatAssistant.data.conversations];
				state.chatAssistant.data.activeConversation = action.payload;
			}
		}).addCase(createChatConversation.rejected, (state, action) => {
			state.operationLoading["createChatConversation"] = false;
			state.operationErrors["createChatConversation"] = action.payload || "Failed to create conversation";
		}).addCase(fetchChatConversation.fulfilled, (state, action) => {
			if (state.chatAssistant.data) {
				state.chatAssistant.data.activeConversation = action.payload;
				const idx = state.chatAssistant.data.conversations.findIndex((c) => c.id === action.payload.id);
				if (idx !== -1) state.chatAssistant.data.conversations[idx] = action.payload;
				else state.chatAssistant.data.conversations.push(action.payload);
			}
		}).addCase(sendChatMessage.pending, (state) => {
			state.operationLoading["sendChatMessage"] = true;
			state.operationErrors["sendChatMessage"] = null;
		}).addCase(sendChatMessage.fulfilled, (state, action) => {
			state.operationLoading["sendChatMessage"] = false;
			state.operationSuccess["sendChatMessage"] = true;
			state.operationErrors["sendChatMessage"] = null;
			if (state.chatAssistant.data) {
				if (!state.chatAssistant.data.activeConversation) {
					const found = state.chatAssistant.data.conversations.find((c) => c.id === action.payload.conversationId);
					if (found) state.chatAssistant.data.activeConversation = found;
					else {
						const newConv = {
							id: action.payload.conversationId || `conv-${Date.now()}`,
							title: "Chat Conversation",
							messages: [],
							createdAt: (/* @__PURE__ */ new Date()).toISOString(),
							updatedAt: (/* @__PURE__ */ new Date()).toISOString()
						};
						state.chatAssistant.data.conversations.unshift(newConv);
						state.chatAssistant.data.activeConversation = newConv;
					}
				}
				state.chatAssistant.data.activeConversation.messages.push(action.payload);
				state.chatAssistant.data.totalMessages += 1;
			}
		}).addCase(sendChatMessage.rejected, (state, action) => {
			state.operationLoading["sendChatMessage"] = false;
			state.operationErrors["sendChatMessage"] = action.payload || "Failed to send message";
		}).addCase(deleteChatConversation.fulfilled, (state, action) => {
			if (state.chatAssistant.data) {
				state.chatAssistant.data.conversations = state.chatAssistant.data.conversations.filter((c) => c.id !== action.payload.id);
				if (state.chatAssistant.data.activeConversation?.id === action.payload.id) state.chatAssistant.data.activeConversation = null;
			}
		});
		builder.addCase(fetchAnalyticsCenter.pending, (state) => {
			state.analyticsCenter.loading = true;
			state.analyticsCenter.error = null;
		}).addCase(fetchAnalyticsCenter.fulfilled, (state, action) => {
			state.analyticsCenter.loading = false;
			state.analyticsCenter.data = action.payload;
			state.analyticsCenter.success = true;
			state.analyticsCenter.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
		}).addCase(fetchAnalyticsCenter.rejected, (state, action) => {
			state.analyticsCenter.loading = false;
			state.analyticsCenter.error = action.payload || "Failed to load analytics center";
			state.analyticsCenter.success = false;
		}).addCase(analyzeAnalytics.pending, (state) => {
			state.operationLoading["analyzeAnalytics"] = true;
			state.operationErrors["analyzeAnalytics"] = null;
		}).addCase(analyzeAnalytics.fulfilled, (state, action) => {
			state.operationLoading["analyzeAnalytics"] = false;
			state.operationSuccess["analyzeAnalytics"] = true;
			if (state.analyticsCenter.data) {
				state.analyticsCenter.data.overview = action.payload.metrics ?? {};
				state.analyticsCenter.data.executiveSummary = action.payload.executiveSummary;
			}
		}).addCase(analyzeAnalytics.rejected, (state, action) => {
			state.operationLoading["analyzeAnalytics"] = false;
			state.operationErrors["analyzeAnalytics"] = action.payload || "Analytics analysis failed";
		}).addCase(fetchAttritionAnalytics$1.fulfilled, (state, action) => {
			if (state.analyticsCenter.data) state.analyticsCenter.data.attrition = action.payload;
		}).addCase(fetchDiversityAnalytics.fulfilled, (state, action) => {
			if (state.analyticsCenter.data) state.analyticsCenter.data.diversity = action.payload;
		}).addCase(fetchExecutiveSummary.fulfilled, (state, action) => {
			if (state.analyticsCenter.data) state.analyticsCenter.data.executiveSummary = action.payload.executiveSummary;
		});
	}
});
var { setSelectedAgent, setActiveConversation, clearOperationStatus: clearOperationStatus$1, resetAIHubState } = aiHubSlice.actions;
var aiHubSlice_default = aiHubSlice.reducer;
function extractData(res, fallback) {
	const r = res;
	const body = r?.data !== void 0 && (r?.status !== void 0 || r?.headers !== void 0) ? r.data : res;
	if (body == null) return fallback ?? null;
	if (typeof body === "object") {
		const b = body;
		if ("data" in b && b.data !== void 0) return b.data;
		if ("result" in b && b.result !== void 0) return b.result;
	}
	return body ?? fallback;
}
var analyticsApi = {
	async getAnalytics() {
		return extractData(await apiInstance.get("/analytics"));
	},
	async getOverview() {
		const raw = extractData(await apiInstance.get("/analytics/overview"), {});
		return {
			totalEmployees: Number(raw?.totalEmployees ?? raw?.total_employees ?? 0),
			activeHeadcount: Number(raw?.activeHeadcount ?? raw?.active_headcount ?? 0),
			totalPayrollCost: Number(raw?.totalPayrollCost ?? raw?.total_payroll_cost ?? 0),
			turnoverRate: Number(raw?.turnoverRate ?? raw?.turnover_rate ?? 0),
			complianceScore: Number(raw?.complianceScore ?? raw?.compliance_score ?? 0),
			riskIndex: Number(raw?.riskIndex ?? raw?.risk_index ?? 0),
			sentimentScore: Number(raw?.sentimentScore ?? raw?.sentiment_score ?? 0),
			lastUpdated: raw?.lastUpdated ? String(raw.lastUpdated) : (/* @__PURE__ */ new Date()).toISOString(),
			summary: raw?.summary ? String(raw.summary) : void 0,
			departmentBreakdown: Array.isArray(raw?.departmentBreakdown ?? raw?.department_breakdown) ? raw.departmentBreakdown ?? raw.department_breakdown : [],
			metrics: raw?.metrics ?? {}
		};
	},
	async getSummary() {
		return extractData(await apiInstance.get("/analytics/summary"), {
			period: "Current Quarter",
			headline: "Workforce Analytics Summary",
			keyFindings: []
		});
	},
	async getReports(params) {
		const raw = extractData(await apiInstance.get("/analytics/reports", { params }), []);
		if (Array.isArray(raw)) return raw;
		if (raw && typeof raw === "object" && "items" in raw && Array.isArray(raw.items)) return raw.items;
		return [];
	},
	async getReportById(reportId) {
		return extractData(await apiInstance.get(`/analytics/reports/${encodeURIComponent(reportId)}`));
	},
	async createReport(payload) {
		return extractData(await apiInstance.post("/analytics/reports", payload));
	},
	async updateReport(reportId, payload) {
		return extractData(await apiInstance.patch(`/analytics/reports/${encodeURIComponent(reportId)}`, payload));
	},
	async deleteReport(reportId) {
		return extractData(await apiInstance.delete(`/analytics/reports/${encodeURIComponent(reportId)}`), {
			success: true,
			id: reportId
		});
	},
	async generateReport(payload) {
		return extractData(await apiInstance.post("/analytics/reports/generate", payload));
	},
	async exportReport(reportId, format = "csv") {
		const res = await apiInstance.get(`/analytics/reports/${encodeURIComponent(reportId)}/export`, {
			params: { format },
			responseType: "blob"
		});
		const blob = res.data instanceof Blob ? res.data : new Blob([res.data], { type: "text/csv" });
		if (typeof window !== "undefined") {
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `report_${reportId}_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.${format}`;
			document.body.appendChild(link);
			link.click();
			link.remove();
			window.URL.revokeObjectURL(url);
		}
		return blob;
	},
	async getHeadcountMetrics() {
		return extractData(await apiInstance.get("/analytics/headcount"), {
			totalHeadcount: 0,
			fullTime: 0,
			partTime: 0,
			contractors: 0,
			growthMoM: 0,
			byDepartment: [],
			monthlyTrend: []
		});
	},
	async getPayrollCostMetrics() {
		return extractData(await apiInstance.get("/analytics/payroll-costs"), {
			totalCost: 0,
			averageSalary: 0,
			overtimeSpend: 0,
			benefitsCost: 0,
			variancePercentage: 0,
			byDepartment: [],
			trend: []
		});
	},
	async getTurnoverMetrics() {
		return extractData(await apiInstance.get("/analytics/turnover-rates"), {
			rate: 0,
			voluntaryRate: 0,
			involuntaryRate: 0,
			retentionRate: 100,
			averageTenureMonths: 0,
			byDepartment: []
		});
	},
	async getComplianceMetrics() {
		return extractData(await apiInstance.get("/analytics/compliance-metrics"), {
			overallScore: 100,
			statutoryComplianceRate: 100,
			auditReadinessScore: 100,
			pendingAuditsCount: 0,
			flaggedViolationsCount: 0,
			standards: []
		});
	},
	async getPredictiveInsights() {
		const raw = extractData(await apiInstance.get("/analytics/predictive-insights"), []);
		return Array.isArray(raw) ? raw : [];
	},
	async analyzePredictiveInsights(payload) {
		const raw = extractData(await apiInstance.post("/analytics/predictive-insights/analyze", payload ?? {}), []);
		return Array.isArray(raw) ? raw : [];
	},
	async getAttritionAnalytics() {
		return extractData(await apiInstance.get("/analytics/attrition"), {
			projectedAttritionRate: 0,
			atRiskEmployeesCount: 0,
			highRiskDepartments: [],
			primaryDrivers: [],
			predictions: []
		});
	},
	async predictAttrition(payload) {
		return extractData(await apiInstance.post("/analytics/attrition/predict", payload ?? {}), {
			projectedAttritionRate: 0,
			atRiskEmployeesCount: 0,
			highRiskDepartments: [],
			primaryDrivers: [],
			predictions: []
		});
	},
	async getSentimentAnalytics() {
		return extractData(await apiInstance.get("/analytics/sentiment"), {
			overallSentiment: "neutral",
			sentimentScore: 70,
			engagementIndex: 75,
			positiveThemes: [],
			concernAreas: [],
			departmentBreakdown: []
		});
	},
	async analyzeSentiment(payload) {
		return extractData(await apiInstance.post("/analytics/sentiment/analyze", payload ?? {}), {
			overallSentiment: "neutral",
			sentimentScore: 70,
			engagementIndex: 75,
			positiveThemes: [],
			concernAreas: [],
			departmentBreakdown: []
		});
	},
	async getBurnoutRisk() {
		return extractData(await apiInstance.get("/analytics/burnout-risk"), {
			riskIndex: 0,
			employeesAtRiskCount: 0,
			overtimeAlertsCount: 0,
			excessiveHoursFlags: 0,
			criticalDepartments: [],
			recommendations: []
		});
	},
	async analyzeBurnoutRisk(payload) {
		return extractData(await apiInstance.post("/analytics/burnout-risk/analyze", payload ?? {}), {
			riskIndex: 0,
			employeesAtRiskCount: 0,
			overtimeAlertsCount: 0,
			excessiveHoursFlags: 0,
			criticalDepartments: [],
			recommendations: []
		});
	},
	async getSalaryBenchmarks() {
		const raw = extractData(await apiInstance.get("/analytics/salary-benchmarks"), []);
		return Array.isArray(raw) ? raw : [];
	},
	async analyzeSalaryBenchmarks(payload) {
		const raw = extractData(await apiInstance.post("/analytics/salary-benchmarks/analyze", payload ?? {}), []);
		return Array.isArray(raw) ? raw : [];
	}
};
/**
* Normalizes API errors into user-friendly error messages with status code recognition.
*/
function getAnalyticsThunkErrorMessage(err, fallbackMessage) {
	const parsed = parseApiError(err, fallbackMessage);
	const msg = parsed.message;
	if (!msg || msg === "An error occurred" || msg === "Network error" || msg === fallbackMessage) switch (parsed.status) {
		case 400: return "Invalid request parameters. Please verify your query.";
		case 401: return "Authentication required. Please log in to view analytics.";
		case 403: return "Access denied. You lack permissions for this analytics report.";
		case 404: return "The requested report or analytics resource was not found.";
		case 409: return "Conflict detected while processing the analytics report.";
		case 422: return "Validation failed on the analytics parameters.";
		case 429: return "Too many requests. Please wait a moment before generating more reports.";
		default: return fallbackMessage || "Internal analytics service error. Please try again later.";
	}
	return msg;
}
var fetchAnalyticsOverview = createAsyncThunk("analytics/fetchAnalyticsOverview", async (_, { rejectWithValue }) => {
	try {
		return await analyticsApi.getOverview();
	} catch (err) {
		return rejectWithValue(getAnalyticsThunkErrorMessage(err, "Failed to load analytics overview"));
	}
});
var fetchAnalyticsSummary = createAsyncThunk("analytics/fetchAnalyticsSummary", async (_, { rejectWithValue }) => {
	try {
		return await analyticsApi.getSummary();
	} catch (err) {
		return rejectWithValue(getAnalyticsThunkErrorMessage(err, "Failed to load analytics summary"));
	}
});
var fetchReports = createAsyncThunk("analytics/fetchReports", async (params, { rejectWithValue }) => {
	try {
		return await analyticsApi.getReports(params);
	} catch (err) {
		return rejectWithValue(getAnalyticsThunkErrorMessage(err, "Failed to load reports"));
	}
});
var fetchReportById = createAsyncThunk("analytics/fetchReportById", async (reportId, { rejectWithValue }) => {
	try {
		return await analyticsApi.getReportById(reportId);
	} catch (err) {
		return rejectWithValue(getAnalyticsThunkErrorMessage(err, `Failed to load report ${reportId}`));
	}
});
var createReport = createAsyncThunk("analytics/createReport", async (payload, { rejectWithValue }) => {
	try {
		return await analyticsApi.createReport(payload);
	} catch (err) {
		return rejectWithValue(getAnalyticsThunkErrorMessage(err, "Failed to create report"));
	}
});
var updateReport = createAsyncThunk("analytics/updateReport", async ({ reportId, payload }, { rejectWithValue }) => {
	try {
		return await analyticsApi.updateReport(reportId, payload);
	} catch (err) {
		return rejectWithValue(getAnalyticsThunkErrorMessage(err, "Failed to update report"));
	}
});
var deleteReport = createAsyncThunk("analytics/deleteReport", async (reportId, { rejectWithValue }) => {
	try {
		return await analyticsApi.deleteReport(reportId);
	} catch (err) {
		return rejectWithValue(getAnalyticsThunkErrorMessage(err, "Failed to delete report"));
	}
});
var generateReport = createAsyncThunk("analytics/generateReport", async (payload, { rejectWithValue }) => {
	try {
		return await analyticsApi.generateReport(payload);
	} catch (err) {
		return rejectWithValue(getAnalyticsThunkErrorMessage(err, "Failed to generate report"));
	}
});
var exportReport = createAsyncThunk("analytics/exportReport", async ({ reportId, format }, { rejectWithValue }) => {
	try {
		await analyticsApi.exportReport(reportId, format);
		return {
			success: true,
			reportId
		};
	} catch (err) {
		return rejectWithValue(getAnalyticsThunkErrorMessage(err, "Failed to export report"));
	}
});
var fetchHeadcountMetrics = createAsyncThunk("analytics/fetchHeadcountMetrics", async (_, { rejectWithValue }) => {
	try {
		return await analyticsApi.getHeadcountMetrics();
	} catch (err) {
		return rejectWithValue(getAnalyticsThunkErrorMessage(err, "Failed to load headcount metrics"));
	}
});
var fetchPayrollCostMetrics = createAsyncThunk("analytics/fetchPayrollCostMetrics", async (_, { rejectWithValue }) => {
	try {
		return await analyticsApi.getPayrollCostMetrics();
	} catch (err) {
		return rejectWithValue(getAnalyticsThunkErrorMessage(err, "Failed to load payroll cost metrics"));
	}
});
var fetchTurnoverMetrics = createAsyncThunk("analytics/fetchTurnoverMetrics", async (_, { rejectWithValue }) => {
	try {
		return await analyticsApi.getTurnoverMetrics();
	} catch (err) {
		return rejectWithValue(getAnalyticsThunkErrorMessage(err, "Failed to load turnover metrics"));
	}
});
var fetchComplianceMetrics = createAsyncThunk("analytics/fetchComplianceMetrics", async (_, { rejectWithValue }) => {
	try {
		return await analyticsApi.getComplianceMetrics();
	} catch (err) {
		return rejectWithValue(getAnalyticsThunkErrorMessage(err, "Failed to load compliance metrics"));
	}
});
var fetchPredictiveInsights = createAsyncThunk("analytics/fetchPredictiveInsights", async (_, { rejectWithValue }) => {
	try {
		return await analyticsApi.getPredictiveInsights();
	} catch (err) {
		return rejectWithValue(getAnalyticsThunkErrorMessage(err, "Failed to load predictive insights"));
	}
});
var analyzePredictiveInsights = createAsyncThunk("analytics/analyzePredictiveInsights", async (payload, { rejectWithValue }) => {
	try {
		return await analyticsApi.analyzePredictiveInsights(payload);
	} catch (err) {
		return rejectWithValue(getAnalyticsThunkErrorMessage(err, "Failed to analyze predictive insights"));
	}
});
var fetchAttritionAnalytics = createAsyncThunk("analytics/fetchAttritionAnalytics", async (_, { rejectWithValue }) => {
	try {
		return await analyticsApi.getAttritionAnalytics();
	} catch (err) {
		return rejectWithValue(getAnalyticsThunkErrorMessage(err, "Failed to load attrition analytics"));
	}
});
var predictAttrition = createAsyncThunk("analytics/predictAttrition", async (payload, { rejectWithValue }) => {
	try {
		return await analyticsApi.predictAttrition(payload);
	} catch (err) {
		return rejectWithValue(getAnalyticsThunkErrorMessage(err, "Failed to run attrition prediction"));
	}
});
var fetchSentimentAnalytics = createAsyncThunk("analytics/fetchSentimentAnalytics", async (_, { rejectWithValue }) => {
	try {
		return await analyticsApi.getSentimentAnalytics();
	} catch (err) {
		return rejectWithValue(getAnalyticsThunkErrorMessage(err, "Failed to load sentiment analytics"));
	}
});
var analyzeSentiment = createAsyncThunk("analytics/analyzeSentiment", async (payload, { rejectWithValue }) => {
	try {
		return await analyticsApi.analyzeSentiment(payload);
	} catch (err) {
		return rejectWithValue(getAnalyticsThunkErrorMessage(err, "Failed to analyze sentiment data"));
	}
});
var fetchBurnoutRisk = createAsyncThunk("analytics/fetchBurnoutRisk", async (_, { rejectWithValue }) => {
	try {
		return await analyticsApi.getBurnoutRisk();
	} catch (err) {
		return rejectWithValue(getAnalyticsThunkErrorMessage(err, "Failed to load burnout risk insights"));
	}
});
var analyzeBurnoutRisk = createAsyncThunk("analytics/analyzeBurnoutRisk", async (payload, { rejectWithValue }) => {
	try {
		return await analyticsApi.analyzeBurnoutRisk(payload);
	} catch (err) {
		return rejectWithValue(getAnalyticsThunkErrorMessage(err, "Failed to analyze burnout risk"));
	}
});
var fetchSalaryBenchmarks = createAsyncThunk("analytics/fetchSalaryBenchmarks", async (_, { rejectWithValue }) => {
	try {
		return await analyticsApi.getSalaryBenchmarks();
	} catch (err) {
		return rejectWithValue(getAnalyticsThunkErrorMessage(err, "Failed to load salary benchmarks"));
	}
});
var analyzeSalaryBenchmarks = createAsyncThunk("analytics/analyzeSalaryBenchmarks", async (payload, { rejectWithValue }) => {
	try {
		return await analyticsApi.analyzeSalaryBenchmarks(payload);
	} catch (err) {
		return rejectWithValue(getAnalyticsThunkErrorMessage(err, "Failed to run salary benchmarks analysis"));
	}
});
function createInitialSectionState(data = null) {
	return {
		data,
		loading: false,
		error: null,
		success: false,
		lastUpdated: null
	};
}
var initialState$1 = {
	overview: createInitialSectionState(),
	summary: createInitialSectionState(),
	reports: createInitialSectionState([]),
	selectedReport: createInitialSectionState(),
	headcount: createInitialSectionState({
		totalHeadcount: 0,
		fullTime: 0,
		partTime: 0,
		contractors: 0,
		growthMoM: 0,
		byDepartment: [],
		monthlyTrend: []
	}),
	payrollCosts: createInitialSectionState({
		totalCost: 0,
		averageSalary: 0,
		overtimeSpend: 0,
		benefitsCost: 0,
		variancePercentage: 0,
		byDepartment: [],
		trend: []
	}),
	turnoverRates: createInitialSectionState({
		rate: 0,
		voluntaryRate: 0,
		involuntaryRate: 0,
		retentionRate: 100,
		averageTenureMonths: 0,
		byDepartment: []
	}),
	complianceMetrics: createInitialSectionState({
		overallScore: 100,
		statutoryComplianceRate: 100,
		auditReadinessScore: 100,
		pendingAuditsCount: 0,
		flaggedViolationsCount: 0,
		standards: []
	}),
	predictiveInsights: createInitialSectionState([]),
	attrition: createInitialSectionState({
		projectedAttritionRate: 0,
		atRiskEmployeesCount: 0,
		highRiskDepartments: [],
		primaryDrivers: [],
		predictions: []
	}),
	sentiment: createInitialSectionState({
		overallSentiment: "neutral",
		sentimentScore: 70,
		engagementIndex: 75,
		positiveThemes: [],
		concernAreas: [],
		departmentBreakdown: []
	}),
	burnoutRisk: createInitialSectionState({
		riskIndex: 0,
		employeesAtRiskCount: 0,
		overtimeAlertsCount: 0,
		excessiveHoursFlags: 0,
		criticalDepartments: [],
		recommendations: []
	}),
	salaryBenchmarks: createInitialSectionState([]),
	exportLoading: false,
	operationLoading: {},
	operationErrors: {},
	operationSuccess: {}
};
var analyticsSlice = createSlice({
	name: "analytics",
	initialState: initialState$1,
	reducers: {
		setSelectedReport: (state, action) => {
			state.selectedReport.data = action.payload;
		},
		clearOperationStatus: (state, action) => {
			const key = action.payload;
			delete state.operationLoading[key];
			delete state.operationErrors[key];
			delete state.operationSuccess[key];
		},
		resetAnalyticsState: () => initialState$1
	},
	extraReducers: (builder) => {
		builder.addCase(fetchAnalyticsOverview.pending, (state) => {
			state.overview.loading = true;
			state.overview.error = null;
		}).addCase(fetchAnalyticsOverview.fulfilled, (state, action) => {
			state.overview.loading = false;
			state.overview.data = action.payload;
			state.overview.success = true;
			state.overview.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
		}).addCase(fetchAnalyticsOverview.rejected, (state, action) => {
			state.overview.loading = false;
			state.overview.error = action.payload || "Failed to load overview";
			state.overview.success = false;
		}).addCase(fetchAnalyticsSummary.pending, (state) => {
			state.summary.loading = true;
			state.summary.error = null;
		}).addCase(fetchAnalyticsSummary.fulfilled, (state, action) => {
			state.summary.loading = false;
			state.summary.data = action.payload;
			state.summary.success = true;
			state.summary.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
		}).addCase(fetchAnalyticsSummary.rejected, (state, action) => {
			state.summary.loading = false;
			state.summary.error = action.payload || "Failed to load summary";
			state.summary.success = false;
		});
		builder.addCase(fetchReports.pending, (state) => {
			state.reports.loading = true;
			state.reports.error = null;
		}).addCase(fetchReports.fulfilled, (state, action) => {
			state.reports.loading = false;
			state.reports.data = action.payload;
			state.reports.success = true;
			state.reports.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
		}).addCase(fetchReports.rejected, (state, action) => {
			state.reports.loading = false;
			state.reports.error = action.payload || "Failed to load reports";
			state.reports.success = false;
		}).addCase(fetchReportById.fulfilled, (state, action) => {
			state.selectedReport.data = action.payload;
		}).addCase(createReport.pending, (state) => {
			state.operationLoading["createReport"] = true;
			state.operationErrors["createReport"] = null;
		}).addCase(createReport.fulfilled, (state, action) => {
			state.operationLoading["createReport"] = false;
			state.operationSuccess["createReport"] = true;
			state.reports.data = [action.payload, ...state.reports.data ?? []];
		}).addCase(createReport.rejected, (state, action) => {
			state.operationLoading["createReport"] = false;
			state.operationErrors["createReport"] = action.payload || "Failed to create report";
		}).addCase(updateReport.pending, (state) => {
			state.operationLoading["updateReport"] = true;
			state.operationErrors["updateReport"] = null;
		}).addCase(updateReport.fulfilled, (state, action) => {
			state.operationLoading["updateReport"] = false;
			state.operationSuccess["updateReport"] = true;
			if (state.reports.data) {
				const index = state.reports.data.findIndex((r) => r.id === action.payload.id);
				if (index !== -1) state.reports.data[index] = action.payload;
			}
			if (state.selectedReport.data?.id === action.payload.id) state.selectedReport.data = action.payload;
		}).addCase(updateReport.rejected, (state, action) => {
			state.operationLoading["updateReport"] = false;
			state.operationErrors["updateReport"] = action.payload || "Failed to update report";
		}).addCase(deleteReport.pending, (state) => {
			state.operationLoading["deleteReport"] = true;
			state.operationErrors["deleteReport"] = null;
		}).addCase(deleteReport.fulfilled, (state, action) => {
			state.operationLoading["deleteReport"] = false;
			state.operationSuccess["deleteReport"] = true;
			if (state.reports.data) state.reports.data = state.reports.data.filter((r) => r.id !== action.payload.id);
			if (state.selectedReport.data?.id === action.payload.id) state.selectedReport.data = null;
		}).addCase(deleteReport.rejected, (state, action) => {
			state.operationLoading["deleteReport"] = false;
			state.operationErrors["deleteReport"] = action.payload || "Failed to delete report";
		}).addCase(generateReport.pending, (state) => {
			state.operationLoading["generateReport"] = true;
			state.operationErrors["generateReport"] = null;
		}).addCase(generateReport.fulfilled, (state) => {
			state.operationLoading["generateReport"] = false;
			state.operationSuccess["generateReport"] = true;
		}).addCase(generateReport.rejected, (state, action) => {
			state.operationLoading["generateReport"] = false;
			state.operationErrors["generateReport"] = action.payload || "Failed to generate report";
		}).addCase(exportReport.pending, (state) => {
			state.exportLoading = true;
			state.operationLoading["exportReport"] = true;
		}).addCase(exportReport.fulfilled, (state) => {
			state.exportLoading = false;
			state.operationLoading["exportReport"] = false;
			state.operationSuccess["exportReport"] = true;
		}).addCase(exportReport.rejected, (state, action) => {
			state.exportLoading = false;
			state.operationLoading["exportReport"] = false;
			state.operationErrors["exportReport"] = action.payload || "Failed to export report";
		});
		builder.addCase(fetchHeadcountMetrics.pending, (state) => {
			state.headcount.loading = true;
			state.headcount.error = null;
		}).addCase(fetchHeadcountMetrics.fulfilled, (state, action) => {
			state.headcount.loading = false;
			state.headcount.data = action.payload;
			state.headcount.success = true;
			state.headcount.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
		}).addCase(fetchHeadcountMetrics.rejected, (state, action) => {
			state.headcount.loading = false;
			state.headcount.error = action.payload || "Failed to load headcount metrics";
		}).addCase(fetchPayrollCostMetrics.pending, (state) => {
			state.payrollCosts.loading = true;
			state.payrollCosts.error = null;
		}).addCase(fetchPayrollCostMetrics.fulfilled, (state, action) => {
			state.payrollCosts.loading = false;
			state.payrollCosts.data = action.payload;
			state.payrollCosts.success = true;
			state.payrollCosts.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
		}).addCase(fetchPayrollCostMetrics.rejected, (state, action) => {
			state.payrollCosts.loading = false;
			state.payrollCosts.error = action.payload || "Failed to load payroll cost metrics";
		}).addCase(fetchTurnoverMetrics.pending, (state) => {
			state.turnoverRates.loading = true;
			state.turnoverRates.error = null;
		}).addCase(fetchTurnoverMetrics.fulfilled, (state, action) => {
			state.turnoverRates.loading = false;
			state.turnoverRates.data = action.payload;
			state.turnoverRates.success = true;
			state.turnoverRates.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
		}).addCase(fetchTurnoverMetrics.rejected, (state, action) => {
			state.turnoverRates.loading = false;
			state.turnoverRates.error = action.payload || "Failed to load turnover metrics";
		}).addCase(fetchComplianceMetrics.pending, (state) => {
			state.complianceMetrics.loading = true;
			state.complianceMetrics.error = null;
		}).addCase(fetchComplianceMetrics.fulfilled, (state, action) => {
			state.complianceMetrics.loading = false;
			state.complianceMetrics.data = action.payload;
			state.complianceMetrics.success = true;
			state.complianceMetrics.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
		}).addCase(fetchComplianceMetrics.rejected, (state, action) => {
			state.complianceMetrics.loading = false;
			state.complianceMetrics.error = action.payload || "Failed to load compliance metrics";
		});
		builder.addCase(fetchPredictiveInsights.pending, (state) => {
			state.predictiveInsights.loading = true;
			state.predictiveInsights.error = null;
		}).addCase(fetchPredictiveInsights.fulfilled, (state, action) => {
			state.predictiveInsights.loading = false;
			state.predictiveInsights.data = action.payload;
			state.predictiveInsights.success = true;
			state.predictiveInsights.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
		}).addCase(fetchPredictiveInsights.rejected, (state, action) => {
			state.predictiveInsights.loading = false;
			state.predictiveInsights.error = action.payload || "Failed to load predictive insights";
		}).addCase(analyzePredictiveInsights.pending, (state) => {
			state.operationLoading["analyzePredictiveInsights"] = true;
		}).addCase(analyzePredictiveInsights.fulfilled, (state, action) => {
			state.operationLoading["analyzePredictiveInsights"] = false;
			state.operationSuccess["analyzePredictiveInsights"] = true;
			state.predictiveInsights.data = action.payload;
		}).addCase(analyzePredictiveInsights.rejected, (state, action) => {
			state.operationLoading["analyzePredictiveInsights"] = false;
			state.operationErrors["analyzePredictiveInsights"] = action.payload || "Predictive analysis failed";
		}).addCase(fetchAttritionAnalytics.pending, (state) => {
			state.attrition.loading = true;
		}).addCase(fetchAttritionAnalytics.fulfilled, (state, action) => {
			state.attrition.loading = false;
			state.attrition.data = action.payload;
			state.attrition.success = true;
		}).addCase(fetchAttritionAnalytics.rejected, (state, action) => {
			state.attrition.loading = false;
			state.attrition.error = action.payload || "Failed to load attrition analytics";
		}).addCase(predictAttrition.pending, (state) => {
			state.operationLoading["predictAttrition"] = true;
		}).addCase(predictAttrition.fulfilled, (state, action) => {
			state.operationLoading["predictAttrition"] = false;
			state.operationSuccess["predictAttrition"] = true;
			state.attrition.data = action.payload;
		}).addCase(predictAttrition.rejected, (state, action) => {
			state.operationLoading["predictAttrition"] = false;
			state.operationErrors["predictAttrition"] = action.payload || "Attrition prediction failed";
		}).addCase(fetchSentimentAnalytics.fulfilled, (state, action) => {
			state.sentiment.data = action.payload;
			state.sentiment.success = true;
		}).addCase(analyzeSentiment.pending, (state) => {
			state.operationLoading["analyzeSentiment"] = true;
		}).addCase(analyzeSentiment.fulfilled, (state, action) => {
			state.operationLoading["analyzeSentiment"] = false;
			state.operationSuccess["analyzeSentiment"] = true;
			state.sentiment.data = action.payload;
		}).addCase(analyzeSentiment.rejected, (state, action) => {
			state.operationLoading["analyzeSentiment"] = false;
			state.operationErrors["analyzeSentiment"] = action.payload || "Sentiment analysis failed";
		}).addCase(fetchBurnoutRisk.fulfilled, (state, action) => {
			state.burnoutRisk.data = action.payload;
			state.burnoutRisk.success = true;
		}).addCase(analyzeBurnoutRisk.pending, (state) => {
			state.operationLoading["analyzeBurnoutRisk"] = true;
		}).addCase(analyzeBurnoutRisk.fulfilled, (state, action) => {
			state.operationLoading["analyzeBurnoutRisk"] = false;
			state.operationSuccess["analyzeBurnoutRisk"] = true;
			state.burnoutRisk.data = action.payload;
		}).addCase(analyzeBurnoutRisk.rejected, (state, action) => {
			state.operationLoading["analyzeBurnoutRisk"] = false;
			state.operationErrors["analyzeBurnoutRisk"] = action.payload || "Burnout analysis failed";
		}).addCase(fetchSalaryBenchmarks.fulfilled, (state, action) => {
			state.salaryBenchmarks.data = action.payload;
			state.salaryBenchmarks.success = true;
		}).addCase(analyzeSalaryBenchmarks.pending, (state) => {
			state.operationLoading["analyzeSalaryBenchmarks"] = true;
		}).addCase(analyzeSalaryBenchmarks.fulfilled, (state, action) => {
			state.operationLoading["analyzeSalaryBenchmarks"] = false;
			state.operationSuccess["analyzeSalaryBenchmarks"] = true;
			state.salaryBenchmarks.data = action.payload;
		}).addCase(analyzeSalaryBenchmarks.rejected, (state, action) => {
			state.operationLoading["analyzeSalaryBenchmarks"] = false;
			state.operationErrors["analyzeSalaryBenchmarks"] = action.payload || "Salary analysis failed";
		});
	}
});
var { setSelectedReport, clearOperationStatus, resetAnalyticsState } = analyticsSlice.actions;
var analyticsSlice_default = analyticsSlice.reducer;
/**
* Super Admin Centralized API Service.
*
* All operations call the real OFC360 backend at `/api/v1/super-admin/*`.
* The router is protected by `require_super_admin` in FastAPI (`app/api/super_admin.py`).
*
* Features:
* - Uses central `apiInstance` with automatic bearer token attachment & 401 refresh handling
* - Zero mock data, zero fake arrays, zero hardcoded business stats
* - Typed request/response models matching backend schemas
* - Normalized error handling throwing `ApiError`
*/
var SUPER_ADMIN_API_BASE = "/api/v1/super-admin";
function isRecord(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
function toNumber(value) {
	if (typeof value === "number") return Number.isFinite(value) ? value : null;
	if (typeof value === "string" && value.trim() !== "") {
		const parsed = Number(value);
		return Number.isFinite(parsed) ? parsed : null;
	}
	return null;
}
function toText(value) {
	if (typeof value === "string") {
		const trimmed = value.trim();
		return trimmed === "" ? null : trimmed;
	}
	if (typeof value === "number" && Number.isFinite(value)) return String(value);
	return null;
}
function toBool(value) {
	return typeof value === "boolean" ? value : null;
}
function toIsoTimestamp(value) {
	const text = toText(value);
	if (!text) return null;
	return Number.isNaN(Date.parse(text)) ? null : text;
}
function parseMilliseconds(value) {
	if (typeof value === "number") return Number.isFinite(value) ? value : null;
	const text = toText(value);
	if (!text) return null;
	const match = /^(\d+(?:\.\d+)?)\s*ms$/i.exec(text);
	return match ? Number(match[1]) : null;
}
function extractMessage(data) {
	if (!isRecord(data)) return null;
	const message = toText(data.message);
	if (message) return message;
	const detail = toText(data.detail);
	if (detail) return detail;
	return null;
}
function cleanParams(params) {
	if (!params) return void 0;
	const cleaned = {};
	for (const [key, value] of Object.entries(params)) {
		if (value === void 0 || value === null) continue;
		if (typeof value === "string") {
			const trimmed = value.trim();
			if (trimmed !== "") cleaned[key] = trimmed;
		} else cleaned[key] = value;
	}
	return cleaned;
}
var SESSION_EXPIRED_MESSAGE = "Your session has expired. Please sign in again.";
function toSuperAdminApiError(error) {
	if (error instanceof ApiError) return error;
	if (axios.isAxiosError(error)) {
		const status = error.response?.status ?? 0;
		const data = error.response?.data ?? null;
		return new ApiError(extractMessage(data) ?? (status === 0 ? "Unable to reach the OFC360 Super Admin API." : `Request failed with status ${status}.`), status, data);
	}
	if (error instanceof Error) {
		if (/refresh/i.test(error.message)) return new ApiError(SESSION_EXPIRED_MESSAGE, 401, null);
		return new ApiError(error.message, 0, null);
	}
	return new ApiError("Unexpected error while contacting the OFC360 API.", 0, null);
}
function logFailure(operation, error) {
	logger.error(`[super-admin] ${operation} failed (${error.status === 0 ? "network" : `HTTP ${error.status}`}): ${error.message}`, error.data ?? "");
}
function unwrapEnvelope(body, httpStatus) {
	if (isRecord(body) && typeof body.success === "boolean" && "data" in body) {
		if (body.success === false) throw new ApiError(extractMessage(body) ?? "The API reported a failure.", httpStatus, body);
		return body.data;
	}
	return body;
}
async function request(method, path, options = {}) {
	const url = `${SUPER_ADMIN_API_BASE}${path}`;
	try {
		const response = await apiInstance.request({
			method,
			url,
			params: cleanParams(options.params),
			data: options.data,
			skipCache: true
		});
		return unwrapEnvelope(response.data, response.status);
	} catch (error) {
		const apiError = toSuperAdminApiError(error);
		logFailure(`${method} ${url}`, apiError);
		throw apiError;
	}
}
function unexpectedShape(endpoint, body) {
	const error = new ApiError(`Unexpected response format from ${endpoint}.`, 200, body);
	logFailure(endpoint, error);
	return error;
}
function toList(body, endpoint) {
	if (Array.isArray(body)) return body;
	if (isRecord(body)) for (const key of [
		"items",
		"results",
		"data"
	]) {
		const candidate = body[key];
		if (Array.isArray(candidate)) return candidate;
	}
	throw unexpectedShape(endpoint, body);
}
function compact(values) {
	return values.filter((value) => value !== null);
}
function normalizeStatistics(body) {
	if (!isRecord(body) || !isRecord(body.kpis)) throw unexpectedShape("GET /super-admin/statistics", body);
	const k = body.kpis;
	return {
		users: {
			total: toNumber(k.total_users),
			active: toNumber(k.active_users),
			inactive: toNumber(k.inactive_users),
			hrAdmins: toNumber(k.total_hr_admins),
			managers: toNumber(k.total_managers),
			employees: toNumber(k.total_employees),
			executives: toNumber(k.total_executives),
			itAdmins: toNumber(k.total_it_admins),
			superAdmins: toNumber(k.total_super_admins)
		},
		organizations: {
			total: toNumber(k.total_organizations),
			onboarded: toNumber(k.active_organizations),
			trial: toNumber(k.trial_organizations),
			suspended: toNumber(k.suspended_organizations),
			paid: toNumber(k.paid_organizations),
			complimentary: toNumber(k.complimentary_organizations),
			withoutSubscription: toNumber(k.free_organizations)
		},
		activeWorkforce: toNumber(k.total_workforce_managed ?? k.total_employees_count),
		raw: body
	};
}
function normalizeUser(raw) {
	if (!isRecord(raw)) return null;
	const id = toText(raw.id);
	if (!id) return null;
	const organizationId = toText(raw.organization_id ?? raw.company_id ?? raw.companyId);
	const statusText = toText(raw.status)?.toLowerCase();
	const isActive = toBool(raw.is_active) ?? (statusText === "active" ? true : statusText === "inactive" ? false : null);
	const rawOrgName = toText(raw.company_name ?? raw.companyName ?? raw.organization);
	const orgName = organizationId ? rawOrgName === "Global Platform" ? null : rawOrgName : null;
	return {
		id,
		name: toText(raw.name) ?? "Platform User",
		email: toText(raw.email) ?? "",
		phone: toText(raw.phone) ?? "",
		role: toText(raw.role) ?? "employee",
		organization_id: organizationId,
		organizationId,
		companyId: organizationId ?? "",
		company_id: organizationId,
		company_name: orgName ?? "Global Platform",
		companyName: orgName ?? "Global Platform",
		organization: orgName ?? "Global Platform",
		organizationName: orgName,
		status: isActive ? "Active" : "Inactive",
		is_active: Boolean(isActive),
		isActive: Boolean(isActive),
		is_verified: toBool(raw.is_verified) ?? true,
		isVerified: toBool(raw.is_verified) ?? true,
		created_at: toIsoTimestamp(raw.created_at) ?? (/* @__PURE__ */ new Date()).toISOString(),
		createdAt: (toIsoTimestamp(raw.created_at) ?? (/* @__PURE__ */ new Date()).toISOString()).split("T")[0],
		last_login: toIsoTimestamp(raw.last_login),
		lastLoginAt: toIsoTimestamp(raw.last_login),
		lastLogin: toIsoTimestamp(raw.last_login)?.split("T")[0] ?? "Never"
	};
}
function normalizeOrganization(raw) {
	if (!isRecord(raw)) return null;
	const id = toText(raw.id);
	if (!id) return null;
	const hrAdmin = isRecord(raw.hr_admin) ? raw.hr_admin : null;
	const hrAdminsRaw = Array.isArray(raw.hr_admins) ? raw.hr_admins : [];
	const primaryHr = hrAdmin ? {
		name: toText(hrAdmin.name),
		email: toText(hrAdmin.email),
		phone: toText(hrAdmin.phone)
	} : null;
	const createdIso = toIsoTimestamp(raw.created_at) ?? (/* @__PURE__ */ new Date()).toISOString();
	return {
		id,
		name: toText(raw.name) ?? "Unnamed Organization",
		domain: toText(raw.domain),
		plan: toText(raw.plan),
		status: toText(raw.status) ?? "Active",
		access_status: toText(raw.access_status) ?? "ACTIVE",
		access_type: toText(raw.access_type) ?? "FULL",
		payment_status: toText(raw.payment_status) ?? "UNPAID",
		access_source: toText(raw.access_source) ?? "SUPER_ADMIN",
		access_granted_by: toText(raw.access_granted_by) ?? "Super Admin",
		access_expires_at: toIsoTimestamp(raw.access_expires_at),
		access_grant_reason: toText(raw.access_grant_reason),
		mrr: toNumber(raw.mrr) ?? 0,
		storageUsedGb: toNumber(raw.storageUsedGb) ?? 0,
		industry: toText(raw.industry) ?? "General",
		location: toText(raw.location) ?? "Global",
		user_count: toNumber(raw.user_count) ?? 0,
		userCount: toNumber(raw.user_count) ?? 0,
		employee_count: toNumber(raw.employee_count ?? raw.employeeCount) ?? 0,
		employeeCount: toNumber(raw.employee_count ?? raw.employeeCount) ?? 0,
		hr_admin: primaryHr,
		primaryHrAdmin: primaryHr,
		hr_admins: hrAdminsRaw.map((u) => ({
			id: toText(u.id) ?? void 0,
			name: toText(u.name),
			email: toText(u.email),
			phone: toText(u.phone)
		})),
		hrAdminName: toText(raw.hrAdminName) ?? primaryHr?.name ?? "",
		hrAdminEmail: toText(raw.hrAdminEmail) ?? primaryHr?.email ?? "",
		owner: primaryHr,
		created_at: createdIso,
		createdAt: createdIso.split("T")[0]
	};
}
function normalizeAuditEvent(raw) {
	if (!isRecord(raw)) return null;
	const id = toText(raw.id);
	if (!id) return null;
	const actor = toText(raw.actor);
	const action = toText(raw.action);
	const details = toText(raw.details);
	const timestamp = toIsoTimestamp(raw.timestamp) ?? (/* @__PURE__ */ new Date()).toISOString();
	const ip = toText(raw.ip ?? raw.ip_address) ?? "127.0.0.1";
	const result = toText(raw.result)?.toUpperCase() === "BLOCKED" ? "BLOCKED" : "SUCCESS";
	return {
		id,
		timestamp,
		actor: actor ?? "System",
		actorEmail: toText(raw.actorEmail) ?? (actor && actor !== "System" ? actor : "superadmin@ofc360.com"),
		action: action ?? "ACTION",
		resource: toText(raw.resource) ?? "PLATFORM_RESOURCE",
		targetCompany: toText(raw.targetCompany),
		organizationId: toText(raw.targetCompany),
		result,
		ip,
		ip_address: ip,
		details: details ?? action ?? ""
	};
}
function normalizeSession(raw) {
	if (!isRecord(raw)) return null;
	const id = toText(raw.id);
	if (!id) return null;
	return {
		id,
		adminName: toText(raw.adminName) ?? "Administrator",
		userName: toText(raw.adminName) ?? "Administrator",
		adminEmail: toText(raw.adminEmail) ?? "admin@ofc360.com",
		userEmail: toText(raw.adminEmail) ?? "admin@ofc360.com",
		ipAddress: toText(raw.ipAddress) ?? "127.0.0.1",
		location: toText(raw.location) ?? "Production Gateway",
		browser: toText(raw.browser) ?? "Chrome / Desktop",
		os: toText(raw.os) ?? "Windows / Linux",
		device: toText(raw.device) ?? "Desktop",
		loginTime: toIsoTimestamp(raw.loginTime) ?? (/* @__PURE__ */ new Date()).toISOString(),
		startedAt: toIsoTimestamp(raw.loginTime) ?? (/* @__PURE__ */ new Date()).toISOString(),
		lastActivity: toText(raw.lastActivity) ?? "Active",
		status: toText(raw.status) ?? "Active"
	};
}
function normalizeSettings(body, endpoint = "GET /super-admin/settings") {
	if (!isRecord(body)) throw unexpectedShape(endpoint, body);
	const settings = {};
	for (const [key, value] of Object.entries(body)) if (typeof value === "string" || typeof value === "boolean") settings[key] = value;
	else if (typeof value === "number" && Number.isFinite(value)) settings[key] = value;
	return settings;
}
function publicUrl(path) {
	return `${API_BASE_URL || (typeof window !== "undefined" ? window.location.origin : "")}${path}`;
}
async function fetchPublicJson(path) {
	let response;
	try {
		response = await fetch(publicUrl(path), {
			method: "GET",
			cache: "no-store",
			credentials: "omit",
			headers: { Accept: "application/json" }
		});
	} catch (error) {
		const apiError = new ApiError(`Unable to reach ${path}: ${error instanceof Error ? error.message : "network error"}`, 0, null);
		logFailure(`GET ${path}`, apiError);
		throw apiError;
	}
	let body = null;
	try {
		body = await response.json();
	} catch {
		body = null;
	}
	return {
		status: response.status,
		body
	};
}
var superAdminApi = {
	/** GET /api/v1/super-admin/statistics (or /dashboard) */
	async getSuperAdminStatistics() {
		return await request("GET", "/statistics");
	},
	/** GET /api/v1/super-admin/statistics normalized for legacy consumers */
	async getStatistics() {
		return normalizeStatistics(await request("GET", "/statistics"));
	},
	/** GET /api/v1/super-admin/organizations */
	async listOrganizations(params) {
		return compact(toList(await request("GET", "/organizations", { params: {
			page: params?.page,
			page_size: params?.pageSize ?? params?.page_size,
			search: params?.search,
			status: params?.status ?? (params?.onboarding === "complete" ? "active" : params?.onboarding === "pending" ? "trial" : void 0),
			access_status: params?.access_status,
			plan: params?.plan
		} }), "GET /super-admin/organizations").map(normalizeOrganization));
	},
	/** GET /api/v1/super-admin/organizations/{org_id} */
	async getOrganization(orgId) {
		return request("GET", `/organizations/${encodeURIComponent(orgId)}`);
	},
	/** POST /api/v1/super-admin/organizations */
	async createOrganization(payload) {
		const raw = await request("POST", "/organizations", { data: payload });
		const normalized = normalizeOrganization(raw);
		if (!normalized) throw new ApiError("Failed to normalize created organization response.", 500, raw);
		return normalized;
	},
	/** PATCH/PUT /api/v1/super-admin/organizations/{org_id} */
	async updateOrganization(orgId, payload) {
		return request("PATCH", `/organizations/${encodeURIComponent(orgId)}`, { data: payload });
	},
	/** DELETE /api/v1/super-admin/organizations/{org_id} */
	async deleteOrganization(orgId) {
		return request("DELETE", `/organizations/${encodeURIComponent(orgId)}`);
	},
	/** POST /api/v1/super-admin/organizations/{org_id}/access/grant */
	async grantOrganizationAccess(orgId, payload) {
		return request("POST", `/organizations/${encodeURIComponent(orgId)}/access/grant`, { data: payload ?? {} });
	},
	/** POST /api/v1/super-admin/organizations/{org_id}/access/extend */
	async extendOrganizationAccess(orgId, payload) {
		return request("POST", `/organizations/${encodeURIComponent(orgId)}/access/extend`, { data: payload ?? {} });
	},
	/** POST /api/v1/super-admin/organizations/{org_id}/access/suspend */
	async suspendOrganization(orgId, payload) {
		return request("POST", `/organizations/${encodeURIComponent(orgId)}/access/suspend`, { data: payload ?? {} });
	},
	/** POST /api/v1/super-admin/organizations/{org_id}/access/cancel */
	async cancelOrganization(orgId, payload) {
		return request("POST", `/organizations/${encodeURIComponent(orgId)}/access/cancel`, { data: payload ?? {} });
	},
	/** POST /api/v1/super-admin/organizations/{org_id}/access/reactivate */
	async reactivateOrganization(orgId, payload) {
		return request("POST", `/organizations/${encodeURIComponent(orgId)}/access/reactivate`, { data: payload ?? {} });
	},
	/** GET /api/v1/super-admin/users */
	async listPlatformUsers(params) {
		return compact(toList(await request("GET", "/users", { params: {
			page: params?.page,
			page_size: params?.pageSize ?? params?.page_size,
			search: params?.search,
			role: params?.role,
			status: params?.status,
			organization_id: params?.organizationId ?? params?.organization_id
		} }), "GET /super-admin/users").map(normalizeUser));
	},
	/** Backward-compatible alias */
	async listUsers(params) {
		return this.listPlatformUsers(params);
	},
	/** GET /api/v1/super-admin/users/{user_id} */
	async getPlatformUser(userId) {
		return request("GET", `/users/${encodeURIComponent(userId)}`);
	},
	/** POST /api/v1/super-admin/users */
	async createPlatformUser(payload) {
		const raw = await request("POST", "/users", { data: payload });
		const normalized = normalizeUser(raw);
		if (!normalized) throw new ApiError("Failed to normalize created user response.", 500, raw);
		return normalized;
	},
	/** PATCH/PUT /api/v1/super-admin/users/{user_id} */
	async updatePlatformUser(userId, payload) {
		return request("PATCH", `/users/${encodeURIComponent(userId)}`, { data: payload });
	},
	/** DELETE /api/v1/super-admin/users/{user_id} */
	async deletePlatformUser(userId) {
		return request("DELETE", `/users/${encodeURIComponent(userId)}`);
	},
	/** POST /api/v1/super-admin/users/{user_id}/activate */
	async activatePlatformUser(userId) {
		return request("POST", `/users/${encodeURIComponent(userId)}/activate`);
	},
	/** POST /api/v1/super-admin/users/{user_id}/deactivate */
	async deactivatePlatformUser(userId) {
		return request("POST", `/users/${encodeURIComponent(userId)}/deactivate`);
	},
	/** POST /api/v1/super-admin/users/{user_id}/toggle-status */
	async togglePlatformUserStatus(userId) {
		return request("POST", `/users/${encodeURIComponent(userId)}/toggle-status`);
	},
	/** POST /api/v1/super-admin/users/{user_id}/reset-password */
	async resetPlatformUserPassword(userId) {
		return request("POST", `/users/${encodeURIComponent(userId)}/reset-password`);
	},
	/** Helper forwarding to activate/deactivate */
	async setUserActive(userId, active) {
		return (active ? await this.activatePlatformUser(userId) : await this.deactivatePlatformUser(userId)).message ?? (active ? "User activated." : "User deactivated.");
	},
	/** GET /api/v1/super-admin/hr-admins */
	async listHrAdmins(params) {
		return compact(toList(await request("GET", "/hr-admins", { params }), "GET /super-admin/hr-admins").map(normalizeUser));
	},
	/** POST /api/v1/super-admin/hr-admins */
	async createHrAdmin(payload) {
		const raw = await request("POST", "/hr-admins", { data: payload });
		const normalized = normalizeUser(raw);
		if (!normalized) throw new ApiError("Failed to normalize HR admin response.", 500, raw);
		return normalized;
	},
	/** PATCH /api/v1/super-admin/hr-admins/{admin_id} */
	async updateHrAdmin(adminId, payload) {
		return request("PATCH", `/hr-admins/${encodeURIComponent(adminId)}`, { data: payload });
	},
	/** DELETE /api/v1/super-admin/hr-admins/{admin_id} */
	async deleteHrAdmin(adminId) {
		return request("DELETE", `/hr-admins/${encodeURIComponent(adminId)}`);
	},
	/** POST /api/v1/super-admin/hr-admins/{admin_id}/assign */
	async assignHrAdmin(adminId, payload) {
		return request("POST", `/hr-admins/${encodeURIComponent(adminId)}/assign`, { data: payload });
	},
	/** POST /api/v1/super-admin/hr-admins/{admin_id}/remove-org */
	async removeHrAdminOrganization(adminId) {
		return request("POST", `/hr-admins/${encodeURIComponent(adminId)}/remove-org`);
	},
	/** GET /api/v1/super-admin/subscriptions */
	async listSubscriptions() {
		return request("GET", "/subscriptions");
	},
	/** GET /api/v1/super-admin/subscriptions/{sub_id} */
	async getSubscription(subId) {
		return request("GET", `/subscriptions/${encodeURIComponent(subId)}`);
	},
	/** PATCH /api/v1/super-admin/subscriptions/{sub_or_org_id} */
	async updateSubscription(subOrOrgId, payload) {
		return request("PATCH", `/subscriptions/${encodeURIComponent(subOrOrgId)}`, { data: payload });
	},
	/** GET /api/v1/super-admin/plans */
	async listPlans() {
		return request("GET", "/plans");
	},
	/** POST /api/v1/super-admin/plans */
	async createPlan(payload) {
		return request("POST", "/plans", { data: payload });
	},
	/** PATCH /api/v1/super-admin/plans/{plan_id} */
	async updatePlan(planId, payload) {
		return request("PATCH", `/plans/${encodeURIComponent(planId)}`, { data: payload });
	},
	/** DELETE /api/v1/super-admin/plans/{plan_id} */
	async deletePlan(planId) {
		return request("DELETE", `/plans/${encodeURIComponent(planId)}`);
	},
	/** GET /api/v1/super-admin/entitlements */
	async getEntitlements() {
		return request("GET", "/entitlements");
	},
	/** PUT/PATCH /api/v1/super-admin/entitlements */
	async updateEntitlements(payload) {
		return request("PUT", "/entitlements", { data: payload });
	},
	/** GET /api/v1/super-admin/billing */
	async listBilling() {
		return request("GET", "/billing");
	},
	/** GET /api/v1/super-admin/security */
	async getSecurityOverview() {
		return request("GET", "/security");
	},
	/** GET /api/v1/super-admin/security/events */
	async listSecurityEvents() {
		return request("GET", "/security/events");
	},
	/** GET /api/v1/super-admin/security/alerts */
	async listSecurityAlerts() {
		return request("GET", "/security/alerts");
	},
	/** POST /api/v1/super-admin/security/events/{event_id}/resolve */
	async resolveSecurityEvent(eventId) {
		return request("POST", `/security/events/${encodeURIComponent(eventId)}/resolve`);
	},
	/** POST /api/v1/super-admin/security/block-ip */
	async blockIp(ip) {
		return request("POST", "/security/block-ip", { data: { ip } });
	},
	/** POST /api/v1/super-admin/security/unblock-ip */
	async unblockIp(ip) {
		return request("POST", "/security/unblock-ip", { data: { ip } });
	},
	/** GET /api/v1/super-admin/security/sessions */
	async listActiveSessions() {
		return compact(toList(await request("GET", "/security/sessions"), "GET /super-admin/security/sessions").map(normalizeSession));
	},
	/** POST /api/v1/super-admin/security/sessions/{session_id}/terminate */
	async terminateSession(sessionId) {
		return request("POST", `/security/sessions/${encodeURIComponent(sessionId)}/terminate`);
	},
	/** POST /api/v1/super-admin/security/sessions/terminate-all */
	async terminateAllSessions() {
		return request("POST", "/security/sessions/terminate-all");
	},
	/** GET /api/v1/super-admin/audit-logs */
	async listAuditLogs(params) {
		return compact(toList(await request("GET", "/audit-logs", { params: {
			page: params?.page,
			page_size: params?.pageSize ?? params?.page_size,
			search: params?.search,
			action: params?.action
		} }), "GET /super-admin/audit-logs").map(normalizeAuditEvent));
	},
	/** Alias for existing audit logs call */
	async listAuditEvents(params) {
		return this.listAuditLogs(params);
	},
	/** DELETE /api/v1/super-admin/audit-logs */
	async pruneAuditLogs() {
		return request("DELETE", "/audit-logs");
	},
	/** GET /api/v1/super-admin/system-health */
	async getRawSystemHealth() {
		return request("GET", "/system-health");
	},
	/** GET /api/v1/super-admin/system-health with browser latency snapshot */
	async getSystemHealth() {
		const startedAt = performance.now();
		const body = await request("GET", "/system-health");
		const apiRoundTripMs = Math.max(0, Math.round(performance.now() - startedAt));
		if (!isRecord(body)) throw unexpectedShape("GET /super-admin/system-health", body);
		const database = (Array.isArray(body.services) ? body.services : []).find((service) => isRecord(service) && typeof service.name === "string" && /postgres/i.test(service.name));
		const dbStatusText = database ? toText(database.status)?.toUpperCase() : null;
		return {
			database: {
				status: dbStatusText ? dbStatusText === "ONLINE" ? "online" : "degraded" : null,
				pingMs: database ? parseMilliseconds(database.latency ?? database.response_time) : null
			},
			apiRoundTripMs,
			checkedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
	},
	/** GET /health (public) */
	async getPublicHealth() {
		const { status, body } = await fetchPublicJson("/health");
		if (status < 200 || status >= 300 || !isRecord(body)) {
			const error = new ApiError(extractMessage(body) ?? `Health check failed with status ${status}.`, status, body);
			logFailure("GET /health", error);
			throw error;
		}
		return {
			status: toText(body.status),
			database: toText(body.database),
			appName: toText(body.app),
			version: toText(body.version),
			environment: toText(body.environment)
		};
	},
	/** GET /health/ready (public) */
	async getReadiness() {
		const { status, body } = await fetchPublicJson("/health/ready");
		if (status !== 200 && status !== 503 || !isRecord(body)) {
			const error = new ApiError(extractMessage(body) ?? `Readiness check failed with status ${status}.`, status, body);
			logFailure("GET /health/ready", error);
			throw error;
		}
		const llm = isRecord(body.llm) ? body.llm : null;
		const providers = llm && isRecord(llm.providers) ? Object.entries(llm.providers).filter((entry) => typeof entry[1] === "boolean").map(([name, healthy]) => ({
			name,
			healthy
		})) : [];
		return {
			ready: toBool(body.ready),
			database: toText(body.database),
			llm: llm ? {
				healthy: toBool(llm.healthy),
				providers,
				healthyCount: toNumber(llm.healthy_count),
				totalCount: toNumber(llm.total_count)
			} : null,
			httpStatus: status
		};
	},
	/** GET /api/v1/super-admin/settings */
	async getPlatformSettings() {
		return normalizeSettings(await request("GET", "/settings"));
	},
	/** Alias */
	async getSettings() {
		return this.getPlatformSettings();
	},
	/** PATCH/PUT /api/v1/super-admin/settings */
	async updatePlatformSettings(changes) {
		const body = await request("PATCH", "/settings", { data: changes });
		if (isRecord(body) && isRecord(body.settings)) return normalizeSettings(body.settings, "PATCH /super-admin/settings");
		throw unexpectedShape("PATCH /super-admin/settings", body);
	},
	/** Alias */
	async updateSettings(changes) {
		return this.updatePlatformSettings(changes);
	},
	/** GET /api/v1/super-admin/onboarding */
	async listOnboarding() {
		return request("GET", "/onboarding");
	},
	/** GET /api/v1/super-admin/onboarding/{org_id} */
	async getOrganizationOnboarding(orgId) {
		return request("GET", `/onboarding/${encodeURIComponent(orgId)}`);
	},
	/** POST /api/v1/super-admin/onboarding/{org_id}/fast-track */
	async fastTrackOnboarding(orgId) {
		return request("POST", `/onboarding/${encodeURIComponent(orgId)}/fast-track`);
	},
	/** GET /api/v1/super-admin/analytics */
	async getPlatformAnalytics() {
		return request("GET", "/analytics");
	},
	/** GET /api/v1/super-admin/analytics/ai-usage */
	async getAiUsage() {
		return request("GET", "/analytics/ai-usage");
	},
	/** GET /api/v1/super-admin/announcements */
	async listAnnouncements() {
		return request("GET", "/announcements");
	},
	/** POST /api/v1/super-admin/announcements */
	async createAnnouncement(payload) {
		return request("POST", "/announcements", { data: payload });
	},
	/** PATCH /api/v1/super-admin/announcements/{ann_id} */
	async updateAnnouncement(annId, payload) {
		return request("PATCH", `/announcements/${encodeURIComponent(annId)}`, { data: payload });
	},
	/** DELETE /api/v1/super-admin/announcements/{ann_id} */
	async deleteAnnouncement(annId) {
		return request("DELETE", `/announcements/${encodeURIComponent(annId)}`);
	}
};
/**
* Walks a paginated list endpoint until it is exhausted or `maxRecords` is reached.
*/
async function collectAllPages(fetchPage, maxRecords, pageSize = 200) {
	const items = [];
	const maxPages = Math.max(1, Math.ceil(maxRecords / pageSize));
	for (let page = 1; page <= maxPages; page += 1) {
		const batch = await fetchPage(page, pageSize);
		items.push(...batch);
		if (batch.length < pageSize) return {
			items,
			truncated: false
		};
	}
	return {
		items,
		truncated: (await fetchPage(maxPages * pageSize + 1, 1)).length > 0
	};
}
function getErrorMessage(err, defaultMessage = "Operation failed") {
	if (err && typeof err === "object" && "message" in err && typeof err.message === "string") return err.message;
	if (typeof err === "string") return err;
	return defaultMessage;
}
var fetchSuperAdminStatistics = createAsyncThunk("superAdmin/fetchStatistics", async (_, { rejectWithValue }) => {
	try {
		return await superAdminApi.getSuperAdminStatistics();
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to fetch platform statistics"));
	}
});
var fetchOrganizations = createAsyncThunk("superAdmin/fetchOrganizations", async (params, { rejectWithValue }) => {
	try {
		return await superAdminApi.listOrganizations(params);
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to fetch organizations"));
	}
});
var fetchOrganization = createAsyncThunk("superAdmin/fetchOrganization", async (orgId, { rejectWithValue }) => {
	try {
		return await superAdminApi.getOrganization(orgId);
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to fetch organization details"));
	}
});
var createOrganization = createAsyncThunk("superAdmin/createOrganization", async (payload, { rejectWithValue }) => {
	try {
		return await superAdminApi.createOrganization(payload);
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to create organization"));
	}
});
var updateOrganization = createAsyncThunk("superAdmin/updateOrganization", async ({ orgId, payload }, { rejectWithValue }) => {
	try {
		return {
			orgId,
			payload,
			message: (await superAdminApi.updateOrganization(orgId, payload)).message
		};
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to update organization"));
	}
});
var deleteOrganization = createAsyncThunk("superAdmin/deleteOrganization", async (orgId, { rejectWithValue }) => {
	try {
		return {
			orgId,
			message: (await superAdminApi.deleteOrganization(orgId)).message
		};
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to deactivate organization"));
	}
});
var grantOrganizationAccess = createAsyncThunk("superAdmin/grantOrganizationAccess", async ({ orgId, payload }, { rejectWithValue }) => {
	try {
		const res = await superAdminApi.grantOrganizationAccess(orgId, payload);
		return {
			orgId,
			plan: payload?.plan,
			message: res.message
		};
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to grant organization access"));
	}
});
createAsyncThunk("superAdmin/extendOrganizationAccess", async ({ orgId, payload }, { rejectWithValue }) => {
	try {
		const res = await superAdminApi.extendOrganizationAccess(orgId, payload);
		return {
			orgId,
			days: payload?.days,
			message: res.message
		};
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to extend organization access"));
	}
});
var suspendOrganization = createAsyncThunk("superAdmin/suspendOrganization", async ({ orgId, payload }, { rejectWithValue }) => {
	try {
		return {
			orgId,
			message: (await superAdminApi.suspendOrganization(orgId, payload)).message
		};
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to suspend organization"));
	}
});
var cancelOrganization = createAsyncThunk("superAdmin/cancelOrganization", async ({ orgId, payload }, { rejectWithValue }) => {
	try {
		return {
			orgId,
			message: (await superAdminApi.cancelOrganization(orgId, payload)).message
		};
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to cancel organization access"));
	}
});
var reactivateOrganization = createAsyncThunk("superAdmin/reactivateOrganization", async ({ orgId, payload }, { rejectWithValue }) => {
	try {
		return {
			orgId,
			message: (await superAdminApi.reactivateOrganization(orgId, payload)).message
		};
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to reactivate organization"));
	}
});
var fetchPlatformUsers = createAsyncThunk("superAdmin/fetchPlatformUsers", async (params, { rejectWithValue }) => {
	try {
		return await superAdminApi.listPlatformUsers(params);
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to fetch platform users"));
	}
});
var fetchPlatformUser = createAsyncThunk("superAdmin/fetchPlatformUser", async (userId, { rejectWithValue }) => {
	try {
		return await superAdminApi.getPlatformUser(userId);
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to fetch user details"));
	}
});
var createPlatformUser = createAsyncThunk("superAdmin/createPlatformUser", async (payload, { rejectWithValue }) => {
	try {
		return await superAdminApi.createPlatformUser(payload);
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to create user"));
	}
});
var updatePlatformUser = createAsyncThunk("superAdmin/updatePlatformUser", async ({ userId, payload }, { rejectWithValue }) => {
	try {
		return {
			userId,
			payload,
			message: (await superAdminApi.updatePlatformUser(userId, payload)).message
		};
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to update user"));
	}
});
var deletePlatformUser = createAsyncThunk("superAdmin/deletePlatformUser", async (userId, { rejectWithValue }) => {
	try {
		return {
			userId,
			message: (await superAdminApi.deletePlatformUser(userId)).message
		};
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to delete user"));
	}
});
var activatePlatformUser = createAsyncThunk("superAdmin/activatePlatformUser", async (userId, { rejectWithValue }) => {
	try {
		return {
			userId,
			message: (await superAdminApi.activatePlatformUser(userId)).message
		};
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to activate user"));
	}
});
var deactivatePlatformUser = createAsyncThunk("superAdmin/deactivatePlatformUser", async (userId, { rejectWithValue }) => {
	try {
		return {
			userId,
			message: (await superAdminApi.deactivatePlatformUser(userId)).message
		};
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to deactivate user"));
	}
});
var togglePlatformUserStatus = createAsyncThunk("superAdmin/togglePlatformUserStatus", async (userId, { rejectWithValue }) => {
	try {
		const res = await superAdminApi.togglePlatformUserStatus(userId);
		return {
			userId,
			is_active: res.is_active,
			message: res.message
		};
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to toggle user status"));
	}
});
createAsyncThunk("superAdmin/resetPlatformUserPassword", async (userId, { rejectWithValue }) => {
	try {
		return {
			userId,
			message: (await superAdminApi.resetPlatformUserPassword(userId)).message
		};
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to reset password"));
	}
});
var fetchHrAdmins = createAsyncThunk("superAdmin/fetchHrAdmins", async (params, { rejectWithValue }) => {
	try {
		return await superAdminApi.listHrAdmins(params);
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to fetch HR admins"));
	}
});
var createHrAdmin = createAsyncThunk("superAdmin/createHrAdmin", async (payload, { rejectWithValue }) => {
	try {
		return await superAdminApi.createHrAdmin(payload);
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to create HR admin"));
	}
});
createAsyncThunk("superAdmin/updateHrAdmin", async ({ adminId, payload }, { rejectWithValue }) => {
	try {
		return {
			adminId,
			payload,
			message: (await superAdminApi.updateHrAdmin(adminId, payload)).message
		};
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to update HR admin"));
	}
});
var deleteHrAdmin = createAsyncThunk("superAdmin/deleteHrAdmin", async (adminId, { rejectWithValue }) => {
	try {
		return {
			adminId,
			message: (await superAdminApi.deleteHrAdmin(adminId)).message
		};
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to delete HR admin"));
	}
});
createAsyncThunk("superAdmin/assignHrAdmin", async ({ adminId, payload }, { rejectWithValue }) => {
	try {
		const res = await superAdminApi.assignHrAdmin(adminId, payload);
		return {
			adminId,
			companyId: payload.companyId,
			message: res.message
		};
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to assign HR admin"));
	}
});
createAsyncThunk("superAdmin/removeHrAdminOrganization", async (adminId, { rejectWithValue }) => {
	try {
		return {
			adminId,
			message: (await superAdminApi.removeHrAdminOrganization(adminId)).message
		};
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to remove HR admin organization assignment"));
	}
});
var fetchSubscriptions = createAsyncThunk("superAdmin/fetchSubscriptions", async (_, { rejectWithValue }) => {
	try {
		return await superAdminApi.listSubscriptions();
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to fetch subscriptions"));
	}
});
var fetchSubscription = createAsyncThunk("superAdmin/fetchSubscription", async (subId, { rejectWithValue }) => {
	try {
		return await superAdminApi.getSubscription(subId);
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to fetch subscription detail"));
	}
});
var updateSubscription = createAsyncThunk("superAdmin/updateSubscription", async ({ subOrOrgId, payload }, { rejectWithValue }) => {
	try {
		return {
			subOrOrgId,
			payload,
			message: (await superAdminApi.updateSubscription(subOrOrgId, payload)).message
		};
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to update subscription"));
	}
});
var fetchPlans = createAsyncThunk("superAdmin/fetchPlans", async (_, { rejectWithValue }) => {
	try {
		return await superAdminApi.listPlans();
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to fetch subscription plans"));
	}
});
var createPlan = createAsyncThunk("superAdmin/createPlan", async (payload, { rejectWithValue }) => {
	try {
		const res = await superAdminApi.createPlan(payload);
		return {
			plan: res.plan,
			message: res.message
		};
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to create plan"));
	}
});
var updatePlan = createAsyncThunk("superAdmin/updatePlan", async ({ planId, payload }, { rejectWithValue }) => {
	try {
		return {
			planId,
			payload,
			message: (await superAdminApi.updatePlan(planId, payload)).message
		};
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to update plan"));
	}
});
var deletePlan = createAsyncThunk("superAdmin/deletePlan", async (planId, { rejectWithValue }) => {
	try {
		return {
			planId,
			message: (await superAdminApi.deletePlan(planId)).message
		};
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to delete plan"));
	}
});
var fetchEntitlements = createAsyncThunk("superAdmin/fetchEntitlements", async (_, { rejectWithValue }) => {
	try {
		return await superAdminApi.getEntitlements();
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to fetch entitlements"));
	}
});
var updateEntitlements = createAsyncThunk("superAdmin/updateEntitlements", async (payload, { rejectWithValue }) => {
	try {
		return {
			payload,
			message: (await superAdminApi.updateEntitlements(payload)).message
		};
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to update entitlements"));
	}
});
var fetchBilling = createAsyncThunk("superAdmin/fetchBilling", async (_, { rejectWithValue }) => {
	try {
		return await superAdminApi.listBilling();
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to fetch billing transactions"));
	}
});
var fetchSecurity = createAsyncThunk("superAdmin/fetchSecurity", async (_, { rejectWithValue }) => {
	try {
		return await superAdminApi.getSecurityOverview();
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to fetch security posture"));
	}
});
var fetchSecurityEvents = createAsyncThunk("superAdmin/fetchSecurityEvents", async (_, { rejectWithValue }) => {
	try {
		return await superAdminApi.listSecurityEvents();
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to fetch security events"));
	}
});
var fetchSecurityAlerts = createAsyncThunk("superAdmin/fetchSecurityAlerts", async (_, { rejectWithValue }) => {
	try {
		return await superAdminApi.listSecurityAlerts();
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to fetch security alerts"));
	}
});
var resolveSecurityEvent = createAsyncThunk("superAdmin/resolveSecurityEvent", async (eventId, { rejectWithValue }) => {
	try {
		return {
			eventId,
			message: (await superAdminApi.resolveSecurityEvent(eventId)).message
		};
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to resolve security event"));
	}
});
createAsyncThunk("superAdmin/blockIp", async (ip, { rejectWithValue }) => {
	try {
		return {
			ip,
			message: (await superAdminApi.blockIp(ip)).message
		};
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to block IP"));
	}
});
createAsyncThunk("superAdmin/unblockIp", async (ip, { rejectWithValue }) => {
	try {
		return {
			ip,
			message: (await superAdminApi.unblockIp(ip)).message
		};
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to unblock IP"));
	}
});
var fetchActiveSessions = createAsyncThunk("superAdmin/fetchActiveSessions", async (_, { rejectWithValue }) => {
	try {
		return await superAdminApi.listActiveSessions();
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to fetch active sessions"));
	}
});
var terminateSession = createAsyncThunk("superAdmin/terminateSession", async (sessionId, { rejectWithValue }) => {
	try {
		return {
			sessionId,
			message: (await superAdminApi.terminateSession(sessionId)).message
		};
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to terminate session"));
	}
});
var terminateAllSessions = createAsyncThunk("superAdmin/terminateAllSessions", async (_, { rejectWithValue }) => {
	try {
		return { message: (await superAdminApi.terminateAllSessions()).message };
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to terminate all sessions"));
	}
});
var fetchAuditLogs = createAsyncThunk("superAdmin/fetchAuditLogs", async (params, { rejectWithValue }) => {
	try {
		return await superAdminApi.listAuditLogs(params);
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to fetch audit logs"));
	}
});
var pruneAuditLogs = createAsyncThunk("superAdmin/pruneAuditLogs", async (_, { rejectWithValue }) => {
	try {
		return await superAdminApi.pruneAuditLogs();
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to prune audit logs"));
	}
});
var fetchSystemHealth = createAsyncThunk("superAdmin/fetchSystemHealth", async (_, { rejectWithValue }) => {
	try {
		return await superAdminApi.getRawSystemHealth();
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to fetch system health telemetry"));
	}
});
var fetchPlatformSettings = createAsyncThunk("superAdmin/fetchPlatformSettings", async (_, { rejectWithValue }) => {
	try {
		return await superAdminApi.getPlatformSettings();
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to fetch platform settings"));
	}
});
var updatePlatformSettings = createAsyncThunk("superAdmin/updatePlatformSettings", async (changes, { rejectWithValue }) => {
	try {
		return await superAdminApi.updatePlatformSettings(changes);
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to save platform settings"));
	}
});
var fetchOnboarding = createAsyncThunk("superAdmin/fetchOnboarding", async (_, { rejectWithValue }) => {
	try {
		return await superAdminApi.listOnboarding();
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to fetch onboarding pipeline"));
	}
});
var fetchOrganizationOnboarding = createAsyncThunk("superAdmin/fetchOrganizationOnboarding", async (orgId, { rejectWithValue }) => {
	try {
		return await superAdminApi.getOrganizationOnboarding(orgId);
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to fetch organization onboarding details"));
	}
});
var fastTrackOnboarding = createAsyncThunk("superAdmin/fastTrackOnboarding", async (orgId, { rejectWithValue }) => {
	try {
		return {
			orgId,
			message: (await superAdminApi.fastTrackOnboarding(orgId)).message
		};
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to fast track onboarding"));
	}
});
var fetchPlatformAnalytics = createAsyncThunk("superAdmin/fetchPlatformAnalytics", async (_, { rejectWithValue }) => {
	try {
		return await superAdminApi.getPlatformAnalytics();
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to fetch platform analytics"));
	}
});
var fetchAiUsage = createAsyncThunk("superAdmin/fetchAiUsage", async (_, { rejectWithValue }) => {
	try {
		return await superAdminApi.getAiUsage();
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to fetch AI usage telemetry"));
	}
});
var fetchAnnouncements = createAsyncThunk("superAdmin/fetchAnnouncements", async (_, { rejectWithValue }) => {
	try {
		return await superAdminApi.listAnnouncements();
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to fetch announcements"));
	}
});
var createAnnouncement = createAsyncThunk("superAdmin/createAnnouncement", async (payload, { rejectWithValue }) => {
	try {
		return (await superAdminApi.createAnnouncement(payload)).announcement;
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to create announcement"));
	}
});
var updateAnnouncement = createAsyncThunk("superAdmin/updateAnnouncement", async ({ annId, payload }, { rejectWithValue }) => {
	try {
		return (await superAdminApi.updateAnnouncement(annId, payload)).announcement;
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to update announcement"));
	}
});
var deleteAnnouncement = createAsyncThunk("superAdmin/deleteAnnouncement", async (annId, { rejectWithValue }) => {
	try {
		return {
			annId,
			message: (await superAdminApi.deleteAnnouncement(annId)).message
		};
	} catch (err) {
		return rejectWithValue(getErrorMessage(err, "Failed to delete announcement"));
	}
});
var superAdminSlice = createSlice({
	name: "superAdmin",
	initialState: {
		statistics: {
			data: null,
			loading: false,
			error: null
		},
		organizations: {
			items: [],
			selected: null,
			loading: false,
			error: null
		},
		users: {
			items: [],
			selected: null,
			loading: false,
			error: null
		},
		hrAdmins: {
			items: [],
			loading: false,
			error: null
		},
		subscriptions: {
			items: [],
			selected: null,
			loading: false,
			error: null
		},
		plans: {
			items: [],
			loading: false,
			error: null
		},
		entitlements: {
			data: null,
			loading: false,
			error: null
		},
		billing: {
			items: [],
			loading: false,
			error: null
		},
		security: {
			overview: null,
			events: [],
			alerts: [],
			sessions: [],
			loading: false,
			error: null
		},
		auditLogs: {
			items: [],
			loading: false,
			error: null
		},
		systemHealth: {
			data: null,
			loading: false,
			error: null
		},
		settings: {
			data: null,
			loading: false,
			error: null
		},
		onboarding: {
			items: [],
			selected: null,
			loading: false,
			error: null
		},
		analytics: {
			data: null,
			aiUsage: null,
			loading: false,
			error: null
		},
		announcements: {
			items: [],
			loading: false,
			error: null
		}
	},
	reducers: {
		clearSuperAdminError: (state, action) => {
			if (action.payload) state[action.payload].error = null;
			else Object.keys(state).forEach((key) => {
				state[key].error = null;
			});
		},
		setSelectedOrganization: (state, action) => {
			state.organizations.selected = action.payload;
		},
		setSelectedUser: (state, action) => {
			state.users.selected = action.payload;
		},
		setSelectedSubscription: (state, action) => {
			state.subscriptions.selected = action.payload;
		},
		setSelectedOnboarding: (state, action) => {
			state.onboarding.selected = action.payload;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(fetchSuperAdminStatistics.pending, (state) => {
			state.statistics.loading = true;
			state.statistics.error = null;
		}).addCase(fetchSuperAdminStatistics.fulfilled, (state, action) => {
			state.statistics.loading = false;
			state.statistics.data = action.payload;
		}).addCase(fetchSuperAdminStatistics.rejected, (state, action) => {
			state.statistics.loading = false;
			state.statistics.error = action.payload ?? "Failed to fetch statistics";
		});
		builder.addCase(fetchOrganizations.pending, (state) => {
			state.organizations.loading = true;
			state.organizations.error = null;
		}).addCase(fetchOrganizations.fulfilled, (state, action) => {
			state.organizations.loading = false;
			state.organizations.items = action.payload;
		}).addCase(fetchOrganizations.rejected, (state, action) => {
			state.organizations.loading = false;
			state.organizations.error = action.payload ?? "Failed to fetch organizations";
		}).addCase(fetchOrganization.pending, (state) => {
			state.organizations.loading = true;
			state.organizations.error = null;
		}).addCase(fetchOrganization.fulfilled, (state, action) => {
			state.organizations.loading = false;
			state.organizations.selected = action.payload;
		}).addCase(fetchOrganization.rejected, (state, action) => {
			state.organizations.loading = false;
			state.organizations.error = action.payload ?? "Failed to fetch organization";
		}).addCase(createOrganization.fulfilled, (state, action) => {
			state.organizations.items.unshift(action.payload);
		}).addCase(updateOrganization.fulfilled, (state, action) => {
			const { orgId, payload } = action.payload;
			const index = state.organizations.items.findIndex((o) => o.id === orgId);
			if (index !== -1) state.organizations.items[index] = {
				...state.organizations.items[index],
				...payload,
				name: payload.name ?? state.organizations.items[index].name,
				plan: payload.plan ?? state.organizations.items[index].plan,
				status: payload.status ?? state.organizations.items[index].status
			};
		}).addCase(deleteOrganization.fulfilled, (state, action) => {
			const { orgId } = action.payload;
			const index = state.organizations.items.findIndex((o) => o.id === orgId);
			if (index !== -1) {
				state.organizations.items[index].status = "Deactivated";
				state.organizations.items[index].access_status = "DEACTIVATED";
			}
		}).addCase(grantOrganizationAccess.fulfilled, (state, action) => {
			const { orgId, plan } = action.payload;
			const index = state.organizations.items.findIndex((o) => o.id === orgId);
			if (index !== -1) {
				state.organizations.items[index].status = "Active";
				state.organizations.items[index].access_status = "ACTIVE";
				if (plan) state.organizations.items[index].plan = plan;
			}
		}).addCase(suspendOrganization.fulfilled, (state, action) => {
			const { orgId } = action.payload;
			const index = state.organizations.items.findIndex((o) => o.id === orgId);
			if (index !== -1) {
				state.organizations.items[index].status = "Suspended";
				state.organizations.items[index].access_status = "SUSPENDED";
			}
		}).addCase(cancelOrganization.fulfilled, (state, action) => {
			const { orgId } = action.payload;
			const index = state.organizations.items.findIndex((o) => o.id === orgId);
			if (index !== -1) {
				state.organizations.items[index].status = "Cancelled";
				state.organizations.items[index].access_status = "CANCELLED";
			}
		}).addCase(reactivateOrganization.fulfilled, (state, action) => {
			const { orgId } = action.payload;
			const index = state.organizations.items.findIndex((o) => o.id === orgId);
			if (index !== -1) {
				state.organizations.items[index].status = "Active";
				state.organizations.items[index].access_status = "ACTIVE";
			}
		});
		builder.addCase(fetchPlatformUsers.pending, (state) => {
			state.users.loading = true;
			state.users.error = null;
		}).addCase(fetchPlatformUsers.fulfilled, (state, action) => {
			state.users.loading = false;
			state.users.items = action.payload;
		}).addCase(fetchPlatformUsers.rejected, (state, action) => {
			state.users.loading = false;
			state.users.error = action.payload ?? "Failed to fetch users";
		}).addCase(fetchPlatformUser.pending, (state) => {
			state.users.loading = true;
			state.users.error = null;
		}).addCase(fetchPlatformUser.fulfilled, (state, action) => {
			state.users.loading = false;
			state.users.selected = action.payload;
		}).addCase(fetchPlatformUser.rejected, (state, action) => {
			state.users.loading = false;
			state.users.error = action.payload ?? "Failed to fetch user";
		}).addCase(createPlatformUser.fulfilled, (state, action) => {
			state.users.items.unshift(action.payload);
		}).addCase(updatePlatformUser.fulfilled, (state, action) => {
			const { userId, payload } = action.payload;
			const index = state.users.items.findIndex((u) => u.id === userId);
			if (index !== -1) state.users.items[index] = {
				...state.users.items[index],
				...payload,
				name: payload.name ?? state.users.items[index].name,
				phone: payload.phone ?? state.users.items[index].phone,
				role: payload.role ?? state.users.items[index].role,
				status: payload.status ?? state.users.items[index].status,
				is_active: payload.status ? payload.status.toLowerCase() === "active" : state.users.items[index].is_active
			};
		}).addCase(deletePlatformUser.fulfilled, (state, action) => {
			const { userId } = action.payload;
			state.users.items = state.users.items.filter((u) => u.id !== userId);
		}).addCase(activatePlatformUser.fulfilled, (state, action) => {
			const { userId } = action.payload;
			const index = state.users.items.findIndex((u) => u.id === userId);
			if (index !== -1) {
				state.users.items[index].is_active = true;
				state.users.items[index].status = "Active";
			}
		}).addCase(deactivatePlatformUser.fulfilled, (state, action) => {
			const { userId } = action.payload;
			const index = state.users.items.findIndex((u) => u.id === userId);
			if (index !== -1) {
				state.users.items[index].is_active = false;
				state.users.items[index].status = "Inactive";
			}
		}).addCase(togglePlatformUserStatus.fulfilled, (state, action) => {
			const { userId, is_active } = action.payload;
			const index = state.users.items.findIndex((u) => u.id === userId);
			if (index !== -1) {
				state.users.items[index].is_active = is_active;
				state.users.items[index].status = is_active ? "Active" : "Inactive";
			}
		});
		builder.addCase(fetchHrAdmins.pending, (state) => {
			state.hrAdmins.loading = true;
			state.hrAdmins.error = null;
		}).addCase(fetchHrAdmins.fulfilled, (state, action) => {
			state.hrAdmins.loading = false;
			state.hrAdmins.items = action.payload;
		}).addCase(fetchHrAdmins.rejected, (state, action) => {
			state.hrAdmins.loading = false;
			state.hrAdmins.error = action.payload ?? "Failed to fetch HR admins";
		}).addCase(createHrAdmin.fulfilled, (state, action) => {
			state.hrAdmins.items.unshift(action.payload);
		}).addCase(deleteHrAdmin.fulfilled, (state, action) => {
			state.hrAdmins.items = state.hrAdmins.items.filter((a) => a.id !== action.payload.adminId);
		});
		builder.addCase(fetchSubscriptions.pending, (state) => {
			state.subscriptions.loading = true;
			state.subscriptions.error = null;
		}).addCase(fetchSubscriptions.fulfilled, (state, action) => {
			state.subscriptions.loading = false;
			state.subscriptions.items = action.payload;
		}).addCase(fetchSubscriptions.rejected, (state, action) => {
			state.subscriptions.loading = false;
			state.subscriptions.error = action.payload ?? "Failed to fetch subscriptions";
		}).addCase(fetchSubscription.fulfilled, (state, action) => {
			state.subscriptions.selected = action.payload;
		}).addCase(updateSubscription.fulfilled, (state, action) => {
			const { subOrOrgId, payload } = action.payload;
			const index = state.subscriptions.items.findIndex((s) => s.id === subOrOrgId || s.companyId === subOrOrgId);
			if (index !== -1) state.subscriptions.items[index] = {
				...state.subscriptions.items[index],
				...payload,
				plan: payload.plan ?? state.subscriptions.items[index].plan,
				amount: payload.amount ?? state.subscriptions.items[index].amount,
				status: payload.status ?? state.subscriptions.items[index].status
			};
		});
		builder.addCase(fetchPlans.pending, (state) => {
			state.plans.loading = true;
			state.plans.error = null;
		}).addCase(fetchPlans.fulfilled, (state, action) => {
			state.plans.loading = false;
			state.plans.items = action.payload;
		}).addCase(fetchPlans.rejected, (state, action) => {
			state.plans.loading = false;
			state.plans.error = action.payload ?? "Failed to fetch plans";
		}).addCase(createPlan.fulfilled, (state, action) => {
			state.plans.items.push(action.payload.plan);
		}).addCase(updatePlan.fulfilled, (state, action) => {
			const { planId, payload } = action.payload;
			const index = state.plans.items.findIndex((p) => p.id === planId);
			if (index !== -1) state.plans.items[index] = {
				...state.plans.items[index],
				...payload
			};
		}).addCase(deletePlan.fulfilled, (state, action) => {
			state.plans.items = state.plans.items.filter((p) => p.id !== action.payload.planId);
		});
		builder.addCase(fetchEntitlements.pending, (state) => {
			state.entitlements.loading = true;
			state.entitlements.error = null;
		}).addCase(fetchEntitlements.fulfilled, (state, action) => {
			state.entitlements.loading = false;
			state.entitlements.data = action.payload;
		}).addCase(fetchEntitlements.rejected, (state, action) => {
			state.entitlements.loading = false;
			state.entitlements.error = action.payload ?? "Failed to fetch entitlements";
		}).addCase(updateEntitlements.fulfilled, (state, action) => {
			if (state.entitlements.data) state.entitlements.data = {
				...state.entitlements.data,
				...action.payload.payload
			};
		});
		builder.addCase(fetchBilling.pending, (state) => {
			state.billing.loading = true;
			state.billing.error = null;
		}).addCase(fetchBilling.fulfilled, (state, action) => {
			state.billing.loading = false;
			state.billing.items = action.payload;
		}).addCase(fetchBilling.rejected, (state, action) => {
			state.billing.loading = false;
			state.billing.error = action.payload ?? "Failed to fetch billing transactions";
		});
		builder.addCase(fetchSecurity.pending, (state) => {
			state.security.loading = true;
			state.security.error = null;
		}).addCase(fetchSecurity.fulfilled, (state, action) => {
			state.security.loading = false;
			state.security.overview = action.payload;
		}).addCase(fetchSecurity.rejected, (state, action) => {
			state.security.loading = false;
			state.security.error = action.payload ?? "Failed to fetch security posture";
		}).addCase(fetchSecurityEvents.fulfilled, (state, action) => {
			state.security.events = action.payload;
		}).addCase(fetchSecurityAlerts.fulfilled, (state, action) => {
			state.security.alerts = action.payload;
		}).addCase(resolveSecurityEvent.fulfilled, (state, action) => {
			const { eventId } = action.payload;
			const evIndex = state.security.events.findIndex((e) => e.id === eventId);
			if (evIndex !== -1) state.security.events[evIndex].status = "Resolved";
		}).addCase(fetchActiveSessions.fulfilled, (state, action) => {
			state.security.sessions = action.payload;
		}).addCase(terminateSession.fulfilled, (state, action) => {
			state.security.sessions = state.security.sessions.filter((s) => s.id !== action.payload.sessionId);
		}).addCase(terminateAllSessions.fulfilled, (state) => {
			state.security.sessions = [];
		});
		builder.addCase(fetchAuditLogs.pending, (state) => {
			state.auditLogs.loading = true;
			state.auditLogs.error = null;
		}).addCase(fetchAuditLogs.fulfilled, (state, action) => {
			state.auditLogs.loading = false;
			state.auditLogs.items = action.payload;
		}).addCase(fetchAuditLogs.rejected, (state, action) => {
			state.auditLogs.loading = false;
			state.auditLogs.error = action.payload ?? "Failed to fetch audit logs";
		}).addCase(pruneAuditLogs.fulfilled, (state) => {});
		builder.addCase(fetchSystemHealth.pending, (state) => {
			state.systemHealth.loading = true;
			state.systemHealth.error = null;
		}).addCase(fetchSystemHealth.fulfilled, (state, action) => {
			state.systemHealth.loading = false;
			state.systemHealth.data = action.payload;
		}).addCase(fetchSystemHealth.rejected, (state, action) => {
			state.systemHealth.loading = false;
			state.systemHealth.error = action.payload ?? "Failed to fetch system health";
		});
		builder.addCase(fetchPlatformSettings.pending, (state) => {
			state.settings.loading = true;
			state.settings.error = null;
		}).addCase(fetchPlatformSettings.fulfilled, (state, action) => {
			state.settings.loading = false;
			state.settings.data = action.payload;
		}).addCase(fetchPlatformSettings.rejected, (state, action) => {
			state.settings.loading = false;
			state.settings.error = action.payload ?? "Failed to fetch platform settings";
		}).addCase(updatePlatformSettings.fulfilled, (state, action) => {
			state.settings.data = action.payload;
		});
		builder.addCase(fetchOnboarding.pending, (state) => {
			state.onboarding.loading = true;
			state.onboarding.error = null;
		}).addCase(fetchOnboarding.fulfilled, (state, action) => {
			state.onboarding.loading = false;
			state.onboarding.items = action.payload;
		}).addCase(fetchOnboarding.rejected, (state, action) => {
			state.onboarding.loading = false;
			state.onboarding.error = action.payload ?? "Failed to fetch onboarding items";
		}).addCase(fetchOrganizationOnboarding.fulfilled, (state, action) => {
			state.onboarding.selected = action.payload;
		}).addCase(fastTrackOnboarding.fulfilled, (state, action) => {
			const { orgId } = action.payload;
			const item = state.onboarding.items.find((i) => i.id === orgId);
			if (item) {
				item.status = "Active";
				item.progressPercentage = 100;
				item.currentStep = "Complete";
			}
		});
		builder.addCase(fetchPlatformAnalytics.pending, (state) => {
			state.analytics.loading = true;
			state.analytics.error = null;
		}).addCase(fetchPlatformAnalytics.fulfilled, (state, action) => {
			state.analytics.loading = false;
			state.analytics.data = action.payload;
		}).addCase(fetchPlatformAnalytics.rejected, (state, action) => {
			state.analytics.loading = false;
			state.analytics.error = action.payload ?? "Failed to fetch platform analytics";
		}).addCase(fetchAiUsage.fulfilled, (state, action) => {
			state.analytics.aiUsage = action.payload;
		});
		builder.addCase(fetchAnnouncements.pending, (state) => {
			state.announcements.loading = true;
			state.announcements.error = null;
		}).addCase(fetchAnnouncements.fulfilled, (state, action) => {
			state.announcements.loading = false;
			state.announcements.items = action.payload;
		}).addCase(fetchAnnouncements.rejected, (state, action) => {
			state.announcements.loading = false;
			state.announcements.error = action.payload ?? "Failed to fetch announcements";
		}).addCase(createAnnouncement.fulfilled, (state, action) => {
			state.announcements.items.unshift(action.payload);
		}).addCase(updateAnnouncement.fulfilled, (state, action) => {
			const index = state.announcements.items.findIndex((a) => a.id === action.payload.id);
			if (index !== -1) state.announcements.items[index] = action.payload;
		}).addCase(deleteAnnouncement.fulfilled, (state, action) => {
			state.announcements.items = state.announcements.items.filter((a) => a.id !== action.payload.annId);
		});
	}
});
var { clearSuperAdminError, setSelectedOrganization, setSelectedUser, setSelectedSubscription, setSelectedOnboarding } = superAdminSlice.actions;
var superAdminSlice_default = superAdminSlice.reducer;
/**
* Resolves the backend base URL for API v1.
* Uses environment variable `VITE_API_URL`, defaulting to `https://api.ofc360.com/api/v1`.
*/
function getApiBaseUrl() {
	let url = "https://api.ofc360.com".trim();
	if (!url) return "https://api.ofc360.com/api/v1";
	url = url.replace(/^\/+/, "");
	if (!url.startsWith("http://") && !url.startsWith("https://")) url = `https://${url}`;
	url = url.replace(/www\.api\.ofc360\.com/g, "api.ofc360.com").replace(/\/+$/, "");
	if (!url.endsWith("/api/v1")) url = url.replace(/\/api(\/v1)?$/, "") + "/api/v1";
	return url;
}
/**
* Extracts auth token from cookies as a fallback if localStorage token is absent.
*/
function getCookieAuthToken() {
	if (typeof document === "undefined") return null;
	const match = document.cookie.match(/(?:^|;\s*)(?:access_token|token|auth_token|bearer)=([^;]+)/);
	return match ? decodeURIComponent(match[1]) : null;
}
/**
* Base Redux Toolkit Query API definition for all Settings submodules.
* All feature-specific endpoints are injected via `settingsApi.injectEndpoints()`.
*/
var settingsApi = createApi({
	reducerPath: "settingsApi",
	baseQuery: fetchBaseQuery({
		baseUrl: getApiBaseUrl(),
		credentials: "include",
		prepareHeaders: (headers) => {
			const token = getTokens()?.accessToken || getCookieAuthToken();
			if (token) headers.set("Authorization", `Bearer ${token}`);
			headers.set("Accept", "application/json");
			return headers;
		}
	}),
	tagTypes: [
		"SettingsSummary",
		"GeneralSettings",
		"CompanySettings",
		"Role",
		"Permission",
		"AuditLog",
		"Billing",
		"SecuritySettings",
		"NotificationSettings",
		"IntegrationSettings",
		"Profile",
		"ProfileSettings",
		"HrSettings",
		"MfaStatus",
		"PayrollSettings",
		"PayrollHistory",
		"PayrollAudit",
		"OvertimeSettings",
		"OvertimeHistory",
		"OvertimeAudit",
		"Tax",
		"TaxAudit",
		"TaxHistory",
		"PayrollSecurityRole",
		"PayrollSecurityPolicy",
		"PayrollSecuritySession",
		"PayrollSecurityIp",
		"PayrollSecurityAudit"
	],
	endpoints: () => ({})
});
/**
* Global RTK Query error logger middleware using Sonner toast and project error parser.
* Automatically displays user-friendly error toasts when any query or mutation fails.
*/
var settingsApiErrorLogger = () => (next) => (action) => {
	if (isRejectedWithValue(action)) {
		const parsed = parseApiError(action.payload, "Failed to complete settings operation");
		if (parsed.message && parsed.status !== 401) toast.error(parsed.message);
	}
	return next(action);
};
var store = configureStore({
	reducer: {
		employees: employeesSlice_default,
		departments: departmentsSlice_default,
		managers: managersSlice_default,
		performance: performanceSlice_default,
		recruitment: recruitmentSlice_default,
		aiInsights: aiInsightsSlice_default,
		compliance: complianceSlice_default,
		meetingIntelligence: meetingIntelligenceSlice_default,
		policyAssistant: policyAssistantSlice_default,
		employeeHealth: employeeHealthSlice_default,
		performanceCoach: performanceCoachSlice_default,
		leaveAssistant: leaveAssistantSlice_default,
		aiRecruiter: recruiterSlice_default,
		workforceInsights: workforceInsightsSlice_default,
		settings: settingsSlice_default,
		profile: profileSlice_default,
		sidebar: sidebarSlice_default,
		employeeHierarchy: employeeHierarchySlice_default,
		aiHub: aiHubSlice_default,
		analytics: analyticsSlice_default,
		superAdmin: superAdminSlice_default,
		[settingsApi.reducerPath]: settingsApi.reducer
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(settingsApi.middleware, settingsApiErrorLogger)
});
/**
* Utility to detect and recover from dynamic import / chunk loading failures
* caused by new deployments changing asset hashes while a user has an active tab.
*/
var CHUNK_RETRY_KEY = "ofc360_chunk_reload_attempted";
var CHUNK_RETRY_TIMESTAMP_KEY = "ofc360_chunk_reload_ts";
/**
* Checks whether an error is caused by a missing chunk or failed dynamic import
*/
function isChunkLoadError(error) {
	if (!error) return false;
	const message = error instanceof Error ? error.message : typeof error === "string" ? error : typeof error?.message === "string" ? String(error.message) : "";
	const name = error instanceof Error ? error.name : "";
	if ([
		/Failed to fetch dynamically imported module/i,
		/error loading dynamically imported module/i,
		/Importing a module script failed/i,
		/Loading chunk [0-9a-zA-Z_-]+ failed/i,
		/Loading CSS chunk [0-9a-zA-Z_-]+ failed/i,
		/Unable to preload CSS/i,
		/ChunkLoadError/i,
		/Minified React error #520/i,
		/dynamically imported module/i
	].some((pattern) => pattern.test(message) || pattern.test(name))) return true;
	if (error instanceof Error && error.cause) return isChunkLoadError(error.cause);
	return false;
}
/**
* Clears the chunk reload flags after the app has mounted and run smoothly
*/
function clearChunkReloadFlag() {
	if (typeof window === "undefined" || !window.sessionStorage) return;
	try {
		window.sessionStorage.removeItem(CHUNK_RETRY_KEY);
		window.sessionStorage.removeItem(CHUNK_RETRY_TIMESTAMP_KEY);
	} catch {}
}
/**
* Deregisters any rogue or legacy service workers that may be caching stale JS assets
*/
function unregisterLegacyServiceWorkers() {
	if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
	try {
		navigator.serviceWorker.getRegistrations().then((registrations) => {
			for (const registration of registrations) if (!registration.active?.scriptURL.endsWith("/push-sw.js")) registration.unregister().then((success) => {
				if (success) logger.info("[ServiceWorker] Successfully unregistered stale service worker:", registration.scope);
			});
		}).catch(() => {});
	} catch {}
}
/**
* Initializes global listeners for Vite's preloadError and unhandled module rejections.
* Returns an unbind cleanup function.
*/
function setupGlobalChunkErrorListeners() {
	if (typeof window === "undefined") return () => {};
	const onPreloadError = (event) => {
		event.preventDefault();
		console.warn("[Vite] vite:preloadError event caught:", event);
	};
	const onUnhandledRejection = (event) => {
		if (isChunkLoadError(event.reason)) console.warn("[Vite] Dynamic import promise rejection caught:", event.reason);
	};
	const onError = (event) => {
		if (isChunkLoadError(event.error || event.message)) console.warn("[Vite] Global script error caught:", event.message);
	};
	window.addEventListener("vite:preloadError", onPreloadError);
	window.addEventListener("unhandledrejection", onUnhandledRejection);
	window.addEventListener("error", onError);
	return () => {
		window.removeEventListener("vite:preloadError", onPreloadError);
		window.removeEventListener("unhandledrejection", onUnhandledRejection);
		window.removeEventListener("error", onError);
	};
}
var styles_default = "/assets/styles-jZMfVZga.css";
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	const router = useRouter();
	const isChunkError = isChunkLoadError(error);
	(0, import_react.useEffect)(() => {
		console.error("Root error boundary caught error:", error);
	}, [error]);
	if (isChunkError) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-2xl border border-border bg-card p-6 text-center shadow-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
						className: "h-6 w-6 animate-spin",
						xmlns: "http://www.w3.org/2000/svg",
						fill: "none",
						viewBox: "0 0 24 24",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							className: "opacity-25",
							cx: "12",
							cy: "12",
							r: "10",
							stroke: "currentColor",
							strokeWidth: "4"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							className: "opacity-75",
							fill: "currentColor",
							d: "M4 12a8 8 0 018-8v8H4z"
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "App Update Available"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "A new version of OFC360 has been deployed. Please refresh to load the latest features and updates."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-col gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							const url = new URL(window.location.href);
							url.searchParams.set("_v", String(Date.now()));
							window.location.replace(url.toString());
						},
						className: "inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
						children: "Update & Refresh Now"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex w-full items-center justify-center rounded-md border border-input bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Back to Home"
					})]
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$245 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "OFC360 — Operations & Intelligence Platform" },
			{
				name: "description",
				content: "Futuristic operations and intelligence platform for modern enterprise teams."
			},
			{
				name: "author",
				content: "OFC360"
			},
			{
				property: "og:title",
				content: "OFC360"
			},
			{
				property: "og:description",
				content: "Futuristic operations and intelligence platform for modern enterprise teams."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary"
			},
			{
				name: "twitter:site",
				content: "@OFC360"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "alternate icon",
				href: "/favicon.ico"
			},
			{
				rel: "stylesheet",
				href: styles_default
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("head", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", { dangerouslySetInnerHTML: { __html: `
              (function() {
                try {
                  window.addEventListener('vite:preloadError', function(event) {
                    event.preventDefault();
                    console.warn('[Vite] vite:preloadError event caught');
                  });

                  if ('serviceWorker' in navigator) {
                    navigator.serviceWorker.getRegistrations().then(function(regs) {
                      regs.forEach(function(r) {
                        if (!r.active || !r.active.scriptURL.endsWith('/push-sw.js')) {
                          r.unregister();
                        }
                      });
                    }).catch(function() {});
                  }
                } catch(e) {}
              })();
            ` } })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$245.useRouteContext();
	(0, import_react.useEffect)(() => {
		bootstrapAuth();
		unregisterLegacyServiceWorkers();
		const cleanupListeners = setupGlobalChunkErrorListeners();
		clearChunkReloadFlag();
		return () => {
			cleanupListeners();
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Provider_default, {
		store,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
			client: queryClient,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
				fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageSkeleton, {}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				richColors: true,
				position: "top-right"
			})]
		})
	}) });
}
var $$splitComponentImporter$240 = () => import("./verify-reset-otp-nQ0JRx8z.mjs");
var Route$244 = createFileRoute("/verify-reset-otp")({
	validateSearch: objectType({ email: stringType().optional() }),
	head: () => ({ meta: [{ title: "Verify OTP — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$240, "component")
});
var $$splitComponentImporter$239 = () => import("./verify-email-DgXwlCUd.mjs");
var Route$243 = createFileRoute("/verify-email")({
	head: () => ({ meta: [{ title: "Verify your email — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$239, "component")
});
var $$splitComponentImporter$238 = () => import("./terms-BKovT3dx.mjs");
var Route$242 = createFileRoute("/terms")({
	head: () => ({
		meta: [
			{ title: "Terms & Conditions — OFC360" },
			{
				name: "description",
				content: "The terms that govern your use of OFC360."
			},
			{
				property: "og:title",
				content: "Terms & Conditions — OFC360"
			},
			{
				property: "og:url",
				content: "/terms"
			}
		],
		links: [{
			rel: "canonical",
			href: "/terms"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$238, "component")
});
var BASE_URL = "";
var Route$241 = createFileRoute("/sitemap.xml")({ server: { handlers: { GET: async () => {
	const staticPaths = [
		"/",
		"/features",
		"/pricing",
		"/about",
		"/blog",
		"/faq",
		"/contact",
		"/privacy",
		"/terms"
	];
	const blogPaths = posts.map((p) => `/blog/${p.slug}`);
	const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...staticPaths, ...blogPaths].map((p) => `  <url><loc>${BASE_URL}${p}</loc><changefreq>weekly</changefreq></url>`).join("\n")}\n</urlset>`;
	return new Response(xml, { headers: {
		"Content-Type": "application/xml",
		"Cache-Control": "public, max-age=3600"
	} });
} } } });
var $$splitComponentImporter$237 = () => import("./reset-password-DWfFTobr.mjs");
var Route$240 = createFileRoute("/reset-password")({
	validateSearch: objectType({
		email: stringType().optional(),
		resetToken: stringType().optional(),
		token: stringType().optional()
	}),
	head: () => ({ meta: [{ title: "Set new password — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$237, "component")
});
var $$splitComponentImporter$236 = () => import("./register-CUwsANfJ.mjs");
var Route$239 = createFileRoute("/register")({
	head: () => ({ meta: [{ title: "Create your workspace — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$236, "component")
});
var $$splitComponentImporter$235 = () => import("./privacy-CdLPLSNg.mjs");
var Route$238 = createFileRoute("/privacy")({
	head: () => ({
		meta: [
			{ title: "Privacy Policy — OFC360" },
			{
				name: "description",
				content: "How OFC360 collects, uses, and protects your data."
			},
			{
				property: "og:title",
				content: "Privacy Policy — OFC360"
			},
			{
				property: "og:url",
				content: "/privacy"
			}
		],
		links: [{
			rel: "canonical",
			href: "/privacy"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$235, "component")
});
var $$splitComponentImporter$234 = () => import("./pricing-CW-AmVOu.mjs");
var Route$237 = createFileRoute("/pricing")({
	head: () => ({
		meta: [
			{ title: "Pricing — OFC360" },
			{
				name: "description",
				content: "Simple, transparent pricing. Free for small teams. Scales with you."
			},
			{
				property: "og:title",
				content: "Pricing — OFC360"
			},
			{
				property: "og:description",
				content: "Simple, transparent pricing for every team size."
			},
			{
				property: "og:url",
				content: "/pricing"
			}
		],
		links: [{
			rel: "canonical",
			href: "/pricing"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$234, "component")
});
var $$splitComponentImporter$233 = () => import("./onboarding-8LWt3O_6.mjs");
var Route$236 = createFileRoute("/onboarding")({
	validateSearch: objectType({ token: stringType().optional() }),
	head: () => ({ meta: [{ title: "Set up your workspace — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$233, "component")
});
/**
* Returns the canonical default dashboard landing page for a given user or role.
*
* - Super Admin  -> /dashboard/super-admin
* - HR Admin     -> /dashboard (or /onboarding if setup incomplete)
* - Recruiter    -> /dashboard/recruitment
* - Manager      -> /dashboard/manager
* - Employee     -> /dashboard/employee
* - IT Admin     -> /dashboard/admin
* - Executive    -> /dashboard/executive
* - Unverified   -> /verify-email
* - Fallback     -> /dashboard
*/
function getDefaultDashboardPath(target) {
	if (!target) return "/dashboard";
	if (typeof target === "object") {
		if (!("is_verified" in target ? target.is_verified : "emailVerified" in target ? target.emailVerified : true)) return "/verify-email";
		const role = normalizeRole(target.role);
		const onboardingCompleted = "onboarding_completed" in target ? target.onboarding_completed : "onboardingComplete" in target ? target.onboardingComplete : true;
		if (role === "hr_admin" && !onboardingCompleted) return "/onboarding";
		return getRoleDashboard(role);
	}
	return getRoleDashboard(normalizeRole(target));
}
function getRoleDashboard(role) {
	switch (role) {
		case "super_admin": return "/dashboard/super-admin";
		case "recruiter": return "/dashboard/recruitment";
		case "manager": return "/dashboard/manager";
		case "employee": return "/dashboard/employee";
		case "it_admin": return "/dashboard/admin";
		case "executive": return "/dashboard/executive";
		case "hr_admin": return "/dashboard";
		default: return "/dashboard";
	}
}
var DISALLOWED_REDIRECT_PATHS = /* @__PURE__ */ new Set([
	"/",
	"/login",
	"/login/",
	"/auth/login",
	"/auth/login/",
	"/register",
	"/register/",
	"/forgot-password",
	"/forgot-password/",
	"/reset-password",
	"/reset-password/",
	"/verify-email",
	"/verify-email/",
	"/verify-reset-otp",
	"/verify-reset-otp/"
]);
/**
* Validates and returns a safe destination path for post-login or guarded redirects.
*
* Honours the requested target URL ONLY if:
* 1. It is a local relative path or matches the current window origin.
* 2. It does NOT point to an authentication page or the root route (preventing redirect loops).
* 3. The user has permission to access the target route according to checkRouteAccess().
*
* Otherwise, falls back to the user's role-based default dashboard path.
*/
function getSafeRedirectUrl(targetUrl, userOrRole) {
	const fallback = getDefaultDashboardPath(userOrRole);
	if (!targetUrl || typeof targetUrl !== "string") return fallback;
	const trimmed = targetUrl.trim();
	if (!trimmed) return fallback;
	let pathname = "";
	let fullTarget = "";
	try {
		if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
			const url = new URL(trimmed, "http://localhost");
			pathname = url.pathname;
			fullTarget = `${url.pathname}${url.search}${url.hash}`;
		} else if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
			const url = new URL(trimmed);
			if (typeof window !== "undefined" && url.origin !== window.location.origin) return fallback;
			pathname = url.pathname;
			fullTarget = `${url.pathname}${url.search}${url.hash}`;
		} else return fallback;
	} catch {
		return fallback;
	}
	if (DISALLOWED_REDIRECT_PATHS.has(pathname)) return fallback;
	const role = typeof userOrRole === "object" && userOrRole !== null ? normalizeRole(userOrRole.role) : normalizeRole(userOrRole);
	if (!checkRouteAccess(pathname, role).allowed) return fallback;
	return fullTarget;
}
/**
* Central route authorization for OFC360 RBAC architecture.
* Enforces clean separation between platform owner (SUPER_ADMIN)
* and normal organization roles (HR_ADMIN, MANAGER, EMPLOYEE, IT_ADMIN, EXECUTIVE).
*/
var PLATFORM_ROLES = ["super_admin"];
var HR_OPERATIONS_ROLES = ["hr_admin"];
var TEAM_MANAGEMENT_ROLES = ["hr_admin", "manager"];
var SYSTEM_ADMIN_ROLES = ["it_admin"];
var EXECUTIVE_ROLES = ["executive", "hr_admin"];
var RECRUITMENT_ROLES = ["recruiter", "hr_admin"];
var ROUTE_ROLE_ACCESS = {
	"/dashboard/notifications": [...[
		"hr_admin",
		"executive",
		"manager",
		"employee",
		"it_admin",
		"recruiter"
	], ...PLATFORM_ROLES],
	"/dashboard/super-admin": PLATFORM_ROLES,
	"/dashboard/super-admin/users": PLATFORM_ROLES,
	"/dashboard/super-admin/organizations": PLATFORM_ROLES,
	"/dashboard/super-admin/analytics": PLATFORM_ROLES,
	"/dashboard/super-admin/activity": PLATFORM_ROLES,
	"/dashboard/super-admin/audit-logs": PLATFORM_ROLES,
	"/dashboard/super-admin/settings": PLATFORM_ROLES,
	"/dashboard/super-admin/platform-config": PLATFORM_ROLES,
	"/dashboard/executive/cio": [
		"executive",
		"it_admin",
		"hr_admin"
	],
	"/dashboard/executive": EXECUTIVE_ROLES,
	"/dashboard/analytics": [
		"hr_admin",
		"executive",
		"manager"
	],
	"/dashboard/recruitment/hiring-manager": [
		"hr_admin",
		"manager",
		"recruiter"
	],
	"/dashboard/recruitment/requisitions": [
		"hr_admin",
		"manager",
		"recruiter"
	],
	"/dashboard/recruitment/interviews": [
		"hr_admin",
		"manager",
		"recruiter"
	],
	"/dashboard/recruitment": RECRUITMENT_ROLES,
	"/dashboard/talent/recruitment": RECRUITMENT_ROLES,
	"/dashboard/payroll/payslips": [
		"hr_admin",
		"employee",
		"manager"
	],
	"/dashboard/payroll/payments": HR_OPERATIONS_ROLES,
	"/dashboard/payroll/full-and-final": HR_OPERATIONS_ROLES,
	"/dashboard/payroll": HR_OPERATIONS_ROLES,
	"/dashboard/hr": HR_OPERATIONS_ROLES,
	"/dashboard/hr-ops": HR_OPERATIONS_ROLES,
	"/dashboard/hr-operations": HR_OPERATIONS_ROLES,
	"/dashboard/onboarding-checklist": HR_OPERATIONS_ROLES,
	"/dashboard/offboarding": HR_OPERATIONS_ROLES,
	"/dashboard/managers": HR_OPERATIONS_ROLES,
	"/dashboard/it-admin": HR_OPERATIONS_ROLES,
	"/dashboard/executives": HR_OPERATIONS_ROLES,
	"/dashboard/exit": TEAM_MANAGEMENT_ROLES,
	"/dashboard/exit-management": TEAM_MANAGEMENT_ROLES,
	"/dashboard/employees": TEAM_MANAGEMENT_ROLES,
	"/dashboard/manager": ["manager", "hr_admin"],
	"/dashboard/admin": SYSTEM_ADMIN_ROLES,
	"/dashboard/settings/audit-logs": SYSTEM_ADMIN_ROLES,
	"/dashboard/employee": ["employee"],
	"/dashboard/settings/company": HR_OPERATIONS_ROLES,
	"/dashboard/settings/employees": HR_OPERATIONS_ROLES,
	"/dashboard/settings/payroll": HR_OPERATIONS_ROLES,
	"/dashboard/settings/roles-permissions": HR_OPERATIONS_ROLES,
	"/dashboard/roles": HR_OPERATIONS_ROLES
};
function getRoleDefaultHome(role) {
	return getDefaultDashboardPath(role);
}
function isUserAuthenticated() {
	if (typeof window === "undefined") return true;
	return Boolean(aurix.get().user) && hasValidAccessToken();
}
function checkRouteAccess(pathname, userRole) {
	const role = normalizeRole(userRole);
	if (pathname === "/dashboard/forbidden") return { allowed: true };
	if (isSuperAdmin(role)) {
		if (pathname.startsWith("/dashboard/super-admin")) return { allowed: true };
		if (pathname === "/dashboard" || pathname === "/dashboard/") return {
			allowed: false,
			redirectPath: "/dashboard/super-admin"
		};
		if (pathname.startsWith("/dashboard/payroll") || pathname.startsWith("/dashboard/employee") || pathname.startsWith("/dashboard/manager") || pathname.startsWith("/dashboard/recruitment")) return {
			allowed: false,
			redirectPath: "/dashboard/super-admin",
			reason: "Super Admin is the platform owner and does not belong to company operational workflows."
		};
		return { allowed: true };
	}
	if (pathname.startsWith("/dashboard/super-admin")) return {
		allowed: false,
		redirectPath: "/dashboard/forbidden",
		reason: "Forbidden: Super Admin platform area requires platform owner privilege."
	};
	if (pathname === "/dashboard" || pathname === "/dashboard/") {
		if (role && role !== "hr_admin" && role !== "executive") return {
			allowed: false,
			redirectPath: getDefaultDashboardPath(role),
			reason: `Role '${role}' redirected from generic dashboard to role dashboard.`
		};
	}
	const matchedPrefix = Object.keys(ROUTE_ROLE_ACCESS).filter((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)).sort((a, b) => b.length - a.length)[0];
	if (!matchedPrefix) return { allowed: true };
	const allowedRoles = ROUTE_ROLE_ACCESS[matchedPrefix];
	if (role && allowedRoles.includes(role)) return { allowed: true };
	return {
		allowed: false,
		redirectPath: role ? getDefaultDashboardPath(role) : "/dashboard/forbidden",
		reason: `Role '${role ?? "unrecognized"}' lacks permission to access '${matchedPrefix}'.`
	};
}
var $$splitComponentImporter$232 = () => import("./login-cYYzCiOS.mjs");
var Route$235 = createFileRoute("/login")({
	beforeLoad: async ({ search }) => {
		if (typeof window !== "undefined") {
			await waitForAuth();
			if (isUserAuthenticated()) {
				const ws = aurix.get();
				const destination = getSafeRedirectUrl(search?.redirect || search?.callbackUrl, ws.user);
				if (destination && destination !== "/login" && destination !== "/auth/login") throw redirect({ to: destination });
			}
		}
	},
	head: () => ({ meta: [{ title: "Sign in — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$232, "component")
});
var $$splitComponentImporter$231 = () => import("./forgot-password-D3SZGw7n.mjs");
var Route$234 = createFileRoute("/forgot-password")({
	head: () => ({ meta: [{ title: "Reset password — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$231, "component")
});
var $$splitComponentImporter$230 = () => import("./features-D7l55RmU.mjs");
var Route$233 = createFileRoute("/features")({
	head: () => ({
		meta: [
			{ title: "Features — OFC360" },
			{
				name: "description",
				content: "Explore everything OFC360 can do — planning, AI, analytics, integrations, and more."
			},
			{
				property: "og:title",
				content: "Features — OFC360"
			},
			{
				property: "og:description",
				content: "Every capability OFC360 offers, in detail."
			},
			{
				property: "og:url",
				content: "/features"
			}
		],
		links: [{
			rel: "canonical",
			href: "/features"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$230, "component")
});
var $$splitComponentImporter$229 = () => import("./faq-BiIagXmx.mjs");
var Route$232 = createFileRoute("/faq")({
	head: () => ({
		meta: [
			{ title: "FAQ — OFC360" },
			{
				name: "description",
				content: "Answers to common questions about OFC360 — product, pricing, security, and more."
			},
			{
				property: "og:title",
				content: "FAQ — OFC360"
			},
			{
				property: "og:description",
				content: "Everything you need to know about OFC360."
			},
			{
				property: "og:url",
				content: "/faq"
			}
		],
		links: [{
			rel: "canonical",
			href: "/faq"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$229, "component")
});
var $$splitComponentImporter$228 = () => import("./employee-onboarding-B3ANVRby.mjs");
var Route$231 = createFileRoute("/employee-onboarding")({
	head: () => ({ meta: [{ title: "Dashboard — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$228, "component")
});
var $$splitComponentImporter$227 = () => import("./dashboard-R-q7bq2d.mjs");
var Route$230 = createFileRoute("/dashboard")({
	beforeLoad: async ({ location }) => {
		if (typeof window !== "undefined") {
			await waitForAuth();
			if (!isUserAuthenticated()) throw redirect({
				to: "/login",
				search: { redirect: location.href }
			});
			const ws = aurix.get();
			const access = checkRouteAccess(location.pathname, ws.user?.role);
			if (!access.allowed && access.redirectPath) throw redirect({ to: access.redirectPath });
		}
	},
	head: () => ({ meta: [{ title: "Dashboard — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$227, "component")
});
var $$splitComponentImporter$226 = () => import("./contact-0K0EnfRj.mjs");
var Route$229 = createFileRoute("/contact")({
	head: () => ({
		meta: [
			{ title: "Contact — OFC360" },
			{
				name: "description",
				content: "Get in touch with the OFC360 team. We respond within one business day."
			},
			{
				property: "og:title",
				content: "Contact — OFC360"
			},
			{
				property: "og:description",
				content: "Talk to the OFC360 team."
			},
			{
				property: "og:url",
				content: "/contact"
			}
		],
		links: [{
			rel: "canonical",
			href: "/contact"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$226, "component")
});
var $$splitComponentImporter$225 = () => import("./blog-GHsbigBI.mjs");
var Route$228 = createFileRoute("/blog")({
	head: () => ({
		meta: [
			{ title: "Blog — OFC360" },
			{
				name: "description",
				content: "Stories, product updates, and ideas from the OFC360 team."
			},
			{
				property: "og:title",
				content: "Blog — OFC360"
			},
			{
				property: "og:description",
				content: "Stories and ideas from the team building OFC360."
			},
			{
				property: "og:url",
				content: "/blog"
			}
		],
		links: [{
			rel: "canonical",
			href: "/blog"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$225, "component")
});
var $$splitComponentImporter$224 = () => import("./ai-CJDJqagh.mjs");
var Route$227 = createFileRoute("/ai")({
	head: () => ({ meta: [{ title: "AI Hub — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$224, "component")
});
var $$splitComponentImporter$223 = () => import("./about-bVsxf0zh.mjs");
var Route$226 = createFileRoute("/about")({
	head: () => ({
		meta: [
			{ title: "About — OFC360" },
			{
				name: "description",
				content: "OFC360 is on a mission to give every team the operating system they deserve."
			},
			{
				property: "og:title",
				content: "About — OFC360"
			},
			{
				property: "og:description",
				content: "Our mission, our story, and the team building OFC360."
			},
			{
				property: "og:url",
				content: "/about"
			}
		],
		links: [{
			rel: "canonical",
			href: "/about"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$223, "component")
});
var $$splitComponentImporter$222 = () => import("./routes-BUk-to_V.mjs");
var Route$225 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Dashboard — OFC360" },
		{
			name: "description",
			content: "OFC360 Enterprise Operations & Intelligence Platform"
		},
		{
			property: "og:title",
			content: "Dashboard — OFC360"
		},
		{
			property: "og:description",
			content: "OFC360 Enterprise Operations & Intelligence Platform"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$222, "component")
});
var $$splitComponentImporter$221 = () => import("./dashboard.index-BMp8BYvl.mjs");
var Route$224 = createFileRoute("/dashboard/")({
	beforeLoad: async () => {
		if (typeof window !== "undefined") {
			await waitForAuth();
			const ws = aurix.get();
			const role = normalizeRole(ws.user?.role);
			if (role && role !== "hr_admin" && role !== "executive") throw redirect({ to: getDefaultDashboardPath(ws.user) });
		}
	},
	head: () => ({ meta: [{ title: "Executive Command Center — OFC360 HR" }, {
		name: "description",
		content: "OFC360 Enterprise Executive Dashboard — a world-class HR operating system command center with real-time KPIs, approvals, analytics, recruitment, payroll, attendance, and more."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$221, "component")
});
var $$splitComponentImporter$220 = () => import("./blog.index-DZYiXiXP.mjs");
var Route$223 = createFileRoute("/blog/")({
	head: () => ({
		meta: [
			{ title: "Blog — OFC360" },
			{
				name: "description",
				content: "Stories, product updates, and ideas from the OFC360 team."
			},
			{
				property: "og:title",
				content: "Blog — OFC360"
			},
			{
				property: "og:description",
				content: "Stories and ideas from the team building OFC360."
			},
			{
				property: "og:url",
				content: "/blog"
			}
		],
		links: [{
			rel: "canonical",
			href: "/blog"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$220, "component")
});
var $$splitComponentImporter$219 = () => import("./ai.index-C0DBDxcW.mjs");
var Route$222 = createFileRoute("/ai/")({
	head: () => ({ meta: [{ title: "AI Hub — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$219, "component")
});
var $$splitComponentImporter$218 = () => import("./dashboard.workforce-DuR9C1yb.mjs");
var Route$221 = createFileRoute("/dashboard/workforce")({
	head: () => ({ meta: [{ title: "Workforce — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$218, "component")
});
var $$splitComponentImporter$217 = () => import("./dashboard.visitors-nSI8FpE_.mjs");
var Route$220 = createFileRoute("/dashboard/visitors")({
	head: () => ({ meta: [{ title: "Visitor Management — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$217, "component")
});
var $$splitComponentImporter$216 = () => import("./dashboard.travel-D4MxMt1G.mjs");
var Route$219 = createFileRoute("/dashboard/travel")({
	head: () => ({ meta: [{ title: "Travel Management — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$216, "component")
});
var $$splitComponentImporter$215 = () => import("./dashboard.timesheets-D9-RxlIy.mjs");
var Route$218 = createFileRoute("/dashboard/timesheets")({
	head: () => ({ meta: [{ title: "Timesheets — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$215, "component")
});
var $$splitComponentImporter$214 = () => import("./dashboard.timeline-CeaC6OG4.mjs");
var Route$217 = createFileRoute("/dashboard/timeline")({
	head: () => ({ meta: [{ title: "Employee Timeline — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$214, "component")
});
var $$splitComponentImporter$213 = () => import("./dashboard.talent-C5nQkE-c.mjs");
var Route$216 = createFileRoute("/dashboard/talent")({
	head: () => ({ meta: [{ title: "Talent Management — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$213, "component")
});
var $$splitComponentImporter$212 = () => import("./dashboard.super-admin-BvvC4fAW.mjs");
/**
* Layout for every /dashboard/super-admin/* page.
*
* Route-level `beforeLoad` in /dashboard already redirects non-super-admin roles; this component
* re-checks the role verified by `/auth/me` on every render so no Super Admin page (and no Super
* Admin API call) mounts for another role. The backend independently enforces `require_super_admin`
* on every /api/v1/super-admin endpoint.
*/
var Route$215 = createFileRoute("/dashboard/super-admin")({
	head: () => ({ meta: [{ title: "Super Admin Platform — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$212, "component")
});
var $$splitComponentImporter$211 = () => import("./dashboard.settings-DrNb29bR.mjs");
var Route$214 = createFileRoute("/dashboard/settings")({
	head: () => ({ meta: [{ title: "Settings — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$211, "component")
});
var $$splitComponentImporter$210 = () => import("./dashboard.roles-CabTPpVE.mjs");
var Route$213 = createFileRoute("/dashboard/roles")({ component: lazyRouteComponent($$splitComponentImporter$210, "component") });
var $$splitComponentImporter$209 = () => import("./dashboard.resources-OcjgDbN7.mjs");
var Route$212 = createFileRoute("/dashboard/resources")({
	head: () => ({ meta: [{ title: "Resources — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$209, "component")
});
var $$splitComponentImporter$208 = () => import("./dashboard.reports-BxPbM0RW.mjs");
var Route$211 = createFileRoute("/dashboard/reports")({
	head: () => ({ meta: [{ title: "Reports — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$208, "component")
});
var $$splitComponentImporter$207 = () => import("./recruitment-DvVQnCRS.mjs");
var Route$210 = createFileRoute("/dashboard/recruitment")({
	head: () => ({ meta: [{ title: "Recruitment — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$207, "component")
});
var $$splitComponentImporter$206 = () => import("./dashboard.performance-JsJY-eFo.mjs");
var Route$209 = createFileRoute("/dashboard/performance")({
	head: () => ({ meta: [{ title: "Performance — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$206, "component")
});
var $$splitComponentImporter$205 = () => import("./dashboard.payroll-BCdfurTZ.mjs");
var Route$208 = createFileRoute("/dashboard/payroll")({ component: lazyRouteComponent($$splitComponentImporter$205, "component") });
var $$splitComponentImporter$204 = () => import("./dashboard.onboarding-checklist-DW27W5QE.mjs");
var Route$207 = createFileRoute("/dashboard/onboarding-checklist")({
	head: () => ({ meta: [{ title: "Onboarding Checklist — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$204, "component")
});
var $$splitComponentImporter$203 = () => import("./dashboard.offboarding-DZrBJZx1.mjs");
var Route$206 = createFileRoute("/dashboard/offboarding")({
	head: () => ({ meta: [{ title: "Offboarding — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$203, "component")
});
var $$splitComponentImporter$202 = () => import("./dashboard.notifications-CUzQZ4J9.mjs");
var Route$205 = createFileRoute("/dashboard/notifications")({
	head: () => ({ meta: [{ title: "Notifications — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$202, "component")
});
var $$splitComponentImporter$201 = () => import("./dashboard.managers-pRaEigJX.mjs");
var Route$204 = createFileRoute("/dashboard/managers")({
	head: () => ({ meta: [{ title: "Managers — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$201, "component")
});
var $$splitComponentImporter$200 = () => import("./dashboard.manager-BUjm_p6-.mjs");
var Route$203 = createFileRoute("/dashboard/manager")({
	head: () => ({ meta: [{ title: "Manager Dashboard — OFC360 HR" }, {
		name: "description",
		content: "OFC360 Manager Dashboard — manage your team's attendance, leave, performance, assets, recruitment and more from one place."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$200, "component")
});
var $$splitComponentImporter$199 = () => import("./dashboard.leaves-D5cE_ma6.mjs");
var Route$202 = createFileRoute("/dashboard/leaves")({
	head: () => ({ meta: [{ title: "Leave Management — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$199, "component")
});
var $$splitComponentImporter$198 = () => import("./dashboard.it-admin-DfumOfiz.mjs");
var Route$201 = createFileRoute("/dashboard/it-admin")({
	head: () => ({ meta: [{ title: "IT Administrators — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$198, "component")
});
var $$splitComponentImporter$197 = () => import("./dashboard.hr-ops-BGT19UPl.mjs");
var Route$200 = createFileRoute("/dashboard/hr-ops")({
	head: () => ({ meta: [{ title: "HR Operations — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$197, "component")
});
var $$splitComponentImporter$196 = () => import("./dashboard.hr-operations-BCHOq0SI.mjs");
var Route$199 = createFileRoute("/dashboard/hr-operations")({
	head: () => ({ meta: [{ title: "HR Operations — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$196, "component")
});
var $$splitComponentImporter$195 = () => import("./dashboard.hr-Dt3U2I2L.mjs");
var Route$198 = createFileRoute("/dashboard/hr")({
	head: () => ({ meta: [{ title: "HR Management — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$195, "component")
});
var $$splitComponentImporter$194 = () => import("./dashboard.hierarchy-BnWKT3of.mjs");
var Route$197 = createFileRoute("/dashboard/hierarchy")({
	head: () => ({ meta: [{ title: "Organizational Graph — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$194, "component")
});
var Route$196 = createFileRoute("/dashboard/forbidden")({
	head: () => ({ meta: [{ title: "403 Forbidden — Access Denied | OFC360" }] }),
	component: DashboardForbiddenPage
});
function DashboardForbiddenPage() {
	const role = useAurix().user?.role || "employee";
	const homePath = getRoleDefaultHome(role);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-[65vh] flex-col items-center justify-center p-6 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-20 w-20 place-items-center rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive shadow-glow",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-10 w-10 animate-pulse" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute -bottom-1.5 -right-1.5 grid h-7 w-7 place-items-center rounded-lg bg-card border border-border text-muted-foreground shadow-sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3.5 w-3.5" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "inline-block rounded-full bg-destructive/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-destructive border border-destructive/20 mb-3",
				children: "403 — Access Restricted"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl",
				children: "Module Access Denied"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2.5 max-w-md text-sm text-muted-foreground leading-relaxed",
				children: [
					"Your current account role (",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "text-foreground capitalize",
						children: role
					}),
					") does not have authorization to view this enterprise module. Contact your organization administrator to request elevated permissions."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-wrap items-center justify-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					size: "sm",
					className: "gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => window.history.back(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Go Back"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					size: "sm",
					className: "gap-2 bg-gradient-brand text-brand-foreground hover:opacity-90",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: homePath,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "h-4 w-4" }), " Return to My Portal"]
					})
				})]
			})
		]
	});
}
var $$splitComponentImporter$193 = () => import("./dashboard.expenses-CjTcHQ7Y.mjs");
var Route$195 = createFileRoute("/dashboard/expenses")({
	head: () => ({ meta: [{ title: "Expense Management — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$193, "component")
});
var $$splitComponentImporter$192 = () => import("./dashboard.exit-management-pd5u4TUQ.mjs");
var Route$194 = createFileRoute("/dashboard/exit-management")({
	head: () => ({ meta: [{ title: "Exit Management — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$192, "component")
});
var $$splitComponentImporter$191 = () => import("./dashboard.exit-BWzRsEPW.mjs");
var Route$193 = createFileRoute("/dashboard/exit")({
	head: () => ({ meta: [{ title: "Exit Management — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$191, "component")
});
var $$splitComponentImporter$190 = () => import("./dashboard.executives-C77BDdsY.mjs");
var Route$192 = createFileRoute("/dashboard/executives")({
	head: () => ({ meta: [{ title: "Executive Leadership — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$190, "component")
});
var $$splitComponentImporter$189 = () => import("./dashboard.employees-B4nn-ZFk.mjs");
var Route$191 = createFileRoute("/dashboard/employees")({
	validateSearch: (search) => {
		return {
			page: search.page ? Number(search.page) : void 0,
			limit: search.limit ? Number(search.limit) : void 0,
			search: search.search ? String(search.search) : void 0,
			department: search.department ? String(search.department) : void 0,
			designation: search.designation ? String(search.designation) : void 0,
			shift: search.shift ? String(search.shift) : void 0,
			status: search.status ? String(search.status) : void 0,
			sort: search.sort ? String(search.sort) : void 0,
			order: search.order === "asc" || search.order === "desc" ? search.order : void 0
		};
	},
	head: () => ({ meta: [{ title: "Employees — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$189, "component")
});
var $$splitComponentImporter$188 = () => import("./dashboard.employee-es9tEZDO.mjs");
var Route$190 = createFileRoute("/dashboard/employee")({
	head: () => ({ meta: [{ title: "My Dashboard — OFC360 HR" }, {
		name: "description",
		content: "OFC360 Employee Self-Service Dashboard — manage your attendance, leaves, payslips, performance goals, documents, and assets."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$188, "component")
});
var $$splitComponentImporter$187 = () => import("./dashboard.documents-Ch5EVCEd.mjs");
var Route$189 = createFileRoute("/dashboard/documents")({
	head: () => ({ meta: [{ title: "My Documents — OFC360 HR" }] }),
	component: lazyRouteComponent($$splitComponentImporter$187, "component")
});
var $$splitComponentImporter$186 = () => import("./dashboard.departments-cq1N3b8R.mjs");
var Route$188 = createFileRoute("/dashboard/departments")({
	head: () => ({ meta: [{ title: "Departments — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$186, "component")
});
var $$splitComponentImporter$185 = () => import("./dashboard.billing-DDamlIqz.mjs");
var Route$187 = createFileRoute("/dashboard/billing")({ component: lazyRouteComponent($$splitComponentImporter$185, "component") });
var $$splitComponentImporter$184 = () => import("./dashboard.audit-logs-DkI5obUe.mjs");
var Route$186 = createFileRoute("/dashboard/audit-logs")({ component: lazyRouteComponent($$splitComponentImporter$184, "component") });
var $$splitComponentImporter$183 = () => import("./dashboard.attendance-DzTAMzyy.mjs");
var Route$185 = createFileRoute("/dashboard/attendance")({
	head: () => ({ meta: [{ title: "Attendance — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$183, "component")
});
var $$splitComponentImporter$182 = () => import("./dashboard.assets-BnFhjUZq.mjs");
var Route$184 = createFileRoute("/dashboard/assets")({
	head: () => ({ meta: [{ title: "Asset Management — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$182, "component")
});
var $$splitComponentImporter$181 = () => import("./dashboard.asset-management-DelFAcxx.mjs");
var Route$183 = createFileRoute("/dashboard/asset-management")({
	head: () => ({ meta: [{ title: "Asset Management — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$181, "component")
});
var $$splitComponentImporter$180 = () => import("./dashboard.analytics-CDAH4-Y3.mjs");
var Route$182 = createFileRoute("/dashboard/analytics")({
	head: () => ({ meta: [{ title: "Analytics — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$180, "component")
});
var $$splitComponentImporter$179 = () => import("./dashboard.ai-insights-DxMTtR0x.mjs");
var Route$181 = createFileRoute("/dashboard/ai-insights")({
	head: () => ({ meta: [{ title: "AI Insights — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$179, "component")
});
var $$splitComponentImporter$178 = () => import("./dashboard.ai-hub-BVJmzOMx.mjs");
var Route$180 = createFileRoute("/dashboard/ai-hub")({
	head: () => ({ meta: [{ title: "AI Hub — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$178, "component")
});
var $$splitComponentImporter$177 = () => import("./verify-reset-otp-BICPBceE.mjs");
var Route$179 = createFileRoute("/auth/verify-reset-otp")({
	validateSearch: objectType({ email: stringType().optional() }),
	head: () => ({ meta: [{ title: "Verify OTP — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$177, "component")
});
var $$splitComponentImporter$176 = () => import("./verify-email-CjONlYjx.mjs");
var Route$178 = createFileRoute("/auth/verify-email")({
	head: () => ({ meta: [{ title: "Verify your email — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$176, "component")
});
var $$splitComponentImporter$175 = () => import("./reset-password-CzgT-pux.mjs");
var Route$177 = createFileRoute("/auth/reset-password")({
	validateSearch: objectType({
		email: stringType().optional(),
		resetToken: stringType().optional(),
		token: stringType().optional()
	}),
	head: () => ({ meta: [{ title: "Set new password — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$175, "component")
});
var $$splitComponentImporter$174 = () => import("./register-DcohgYFs.mjs");
var Route$176 = createFileRoute("/auth/register")({
	head: () => ({ meta: [{ title: "Create your workspace — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$174, "component")
});
var $$splitComponentImporter$173 = () => import("./login-lNjOeDDK.mjs");
var Route$175 = createFileRoute("/auth/login")({
	beforeLoad: async ({ search }) => {
		if (typeof window !== "undefined") {
			await waitForAuth();
			if (isUserAuthenticated()) {
				const ws = aurix.get();
				const destination = getSafeRedirectUrl(search?.redirect || search?.callbackUrl, ws.user);
				if (destination && destination !== "/login" && destination !== "/auth/login") throw redirect({ to: destination });
			}
		}
	},
	head: () => ({ meta: [{ title: "Sign in — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$173, "component")
});
var $$splitComponentImporter$172 = () => import("./forgot-password-CgiACrF1.mjs");
var Route$174 = createFileRoute("/auth/forgot-password")({
	head: () => ({ meta: [{ title: "Reset password — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$172, "component")
});
function createAiGatewayProvider(apiKey) {
	return createOpenAICompatible({
		name: "ai-gateway",
		baseURL: process.env.AI_GATEWAY_URL || "https://api.openai.com/v1",
		headers: { Authorization: `Bearer ${apiKey}` }
	});
}
var SHARED_GUARDRAILS = `
You are part of OFC360 Insight 2.0 — an autonomous HR brain operating inside
an enterprise HRMS. Be concise, executive-grade, and structured. Default to
Markdown: short paragraphs, bullet lists, and tables when comparing entities.

Operating principles:
- Think step by step before recommending an action. State assumptions explicitly.
- Prefer using the provided tools to fetch real data over guessing.
- For any action that mutates data, sends communication, or affects compensation,
  return a clearly labeled "Proposed action" block and wait for human approval —
  do not claim it was executed.
- When numbers, names, or policies are uncertain, say so and ask for the
  missing input rather than fabricating.
- Cite the policy section, employee id, or report you used when relevant.
`.trim();
var AGENTS = {
	router: {
		id: "router",
		name: "HR Brain",
		tagline: "One assistant — routes your request to the right specialist.",
		audience: "all",
		icon: "Brain",
		accent: "from-violet-500/30 to-fuchsia-500/10",
		system: `${SHARED_GUARDRAILS}

You are the HR Brain router. Identify the user's intent and either answer
directly (small talk, definitions, single-step lookups) or call the most
appropriate specialist tool. When delegating, summarize what you did and why.`,
		suggestions: [
			"Who is at risk of leaving this quarter?",
			"Draft an offer letter for a shortlisted candidate",
			"Summarize last month's attrition by department",
			"What's my leave balance?"
		]
	},
	recruitment: {
		id: "recruitment",
		name: "Recruitment Agent",
		tagline: "Screen, rank, and shortlist candidates end-to-end.",
		audience: "hr",
		icon: "Briefcase",
		accent: "from-sky-500/30 to-cyan-500/10",
		system: `${SHARED_GUARDRAILS}

Role: AI Recruiter. Given a Job Description and candidate inputs, you:
1. Extract must-have vs nice-to-have requirements.
2. Score each candidate on: skill match, experience fit, education, ATS keyword
   density, role progression, and red flags (gaps, job-hopping, inconsistencies).
3. Output a ranked table with: Name | ATS Score (0-100) | Skill Match % |
   Recommendation (Shortlist / Hold / Reject) | Top 3 strengths | Top concern.
4. Flag likely-fake or AI-fabricated resumes with a confidence score.
5. On request, generate role-specific interview questions (mix of behavioral,
   technical, and case-based) and a suggested interview panel.`,
		suggestions: [
			"Rank these 3 candidates for a Senior React Engineer role",
			"Generate 10 interview questions for a Product Manager hire",
			"Detect red flags in this resume",
			"Draft a screening call script for a Data Scientist role"
		]
	},
	interview: {
		id: "interview",
		name: "Interview Agent",
		tagline: "Conduct AI interviews & evaluate transcripts.",
		audience: "hr",
		icon: "Video",
		accent: "from-fuchsia-500/30 to-pink-500/10",
		system: `${SHARED_GUARDRAILS}

Role: AI Interviewer & evaluator. You can:
- Conduct a structured text-based mock interview, one question at a time.
- Score a provided transcript on: Technical depth, Communication clarity,
  Confidence, Problem decomposition, and Culture signals (each 0–10).
- Detect contradictions or memorized answers.
- Output a final verdict: STRONG HIRE / HIRE / HOLD / NO HIRE with rationale,
  followed by a 3-line summary for the hiring manager.`,
		suggestions: [
			"Start a 20-minute mock interview for a Senior Backend Engineer",
			"Score this interview transcript and recommend a verdict",
			"What follow-up questions should I ask this candidate?"
		]
	},
	employee: {
		id: "employee",
		name: "Employee Assistant",
		tagline: "Self-service for leave, payroll, policies & more.",
		audience: "employee",
		icon: "User",
		accent: "from-emerald-500/30 to-teal-500/10",
		system: `${SHARED_GUARDRAILS}

Role: Employee-facing assistant. Use the lookup tools to answer questions about
the signed-in employee's leave balance, payslip, attendance, assets, training,
and benefits. For requests (apply leave, raise reimbursement, request asset),
collect the required fields, then return a "Proposed action" block summarizing
exactly what will be submitted on the user's behalf.
Tone: friendly, plain language, no HR jargon unless asked.`,
		suggestions: [
			"What's my leave balance?",
			"Apply 2 days casual leave for next Mon-Tue — family event",
			"Show me my last 3 payslips",
			"How do I claim WFH internet reimbursement?"
		]
	},
	hr: {
		id: "hr",
		name: "HR Assistant",
		tagline: "HR ops co-pilot for the People team.",
		audience: "hr",
		icon: "Users",
		accent: "from-indigo-500/30 to-blue-500/10",
		system: `${SHARED_GUARDRAILS}

Role: HR operations co-pilot. You answer organizational questions
("who should be promoted?", "who has attendance issues?", "who is overworked?")
by combining lookup tools with policy reasoning. When asked to act (approve a
request, send an email, generate a letter), return a "Proposed action" block
for human approval — never claim the action is done. Cite the rule, threshold,
or data point behind every recommendation.`,
		suggestions: [
			"Who should be considered for promotion this cycle?",
			"List employees with >3 unplanned absences this month",
			"Draft a warning email for repeated late logins to Rahul Mehta",
			"Build a retention plan for the Engineering team"
		]
	},
	performance: {
		id: "performance",
		name: "Performance Agent",
		tagline: "Scores promotions, bonuses & risk automatically.",
		audience: "hr",
		icon: "Gauge",
		accent: "from-rose-500/30 to-pink-500/10",
		system: `${SHARED_GUARDRAILS}

Role: Performance analyst. For each employee or team in scope, compute and
explain: Performance Score, Promotion Score, Bonus Score, Risk Score, Growth
Score (each 0–100). Show the contributing signals — attendance, task throughput,
manager feedback, peer reviews, training, deadline hit-rate — in a compact
table. End with one clear recommendation per person.`,
		suggestions: [
			"Score the Engineering team for the H2 promotion cycle",
			"Who deserves the top 10% bonus pool this quarter?",
			"Identify high performers without recent training"
		]
	},
	attrition: {
		id: "attrition",
		name: "Attrition Predictor",
		tagline: "Who may leave, why, and how to retain them.",
		audience: "hr",
		icon: "AlertTriangle",
		accent: "from-amber-500/30 to-orange-500/10",
		system: `${SHARED_GUARDRAILS}

Role: Attrition risk model. Produce a ranked list: Employee | Risk %
(Confidence) | Top 3 reasons | Suggested retention play | Owner. Reasons must
map to observable signals (comp gap, manager change, stagnant role, drop in
engagement, long hours). Close with a 90-day retention plan for the top 5.`,
		suggestions: [
			"Who is most likely to resign in the next 60 days?",
			"Why is attrition rising in the Sales team?",
			"Build a retention plan for our top 10 risk employees"
		]
	},
	workforce: {
		id: "workforce",
		name: "Workforce Planner",
		tagline: "Hiring needs, skill gaps & headcount forecasts.",
		audience: "exec",
		icon: "Target",
		accent: "from-violet-500/30 to-purple-500/10",
		system: `${SHARED_GUARDRAILS}

Role: Workforce planning. Given current org data + business goals, estimate
hiring needs by quarter, surface skill gaps, model attrition replacement,
and produce a budgeted hiring plan (role, level, location, target CTC, ROI).`,
		suggestions: [
			"Forecast hiring needs for Engineering for next 2 quarters",
			"Which critical skills are we short on?",
			"Estimate the headcount budget impact of 20% revenue growth"
		]
	},
	payroll: {
		id: "payroll",
		name: "Payroll Assistant",
		tagline: "Run, audit & forecast payroll.",
		audience: "hr",
		icon: "Banknote",
		accent: "from-emerald-500/30 to-green-500/10",
		system: `${SHARED_GUARDRAILS}

Role: Payroll co-pilot. Help compute salary, deductions (PF, ESI, TDS, income
tax — India default unless told otherwise), bonus, overtime, leave deductions.
When generating a payslip or run, output a clean Markdown table and call out
anomalies (sudden +/-15% changes, missing inputs, statutory mismatches).
Never finalize a payroll run — return a "Proposed payroll run" for approval.`,
		suggestions: [
			"Compute December net pay for an employee earning ₹18L CTC",
			"Find payroll anomalies in last month's run",
			"Project next quarter's payroll cost"
		]
	},
	compliance: {
		id: "compliance",
		name: "Compliance Agent",
		tagline: "Policy violations, expiring docs & risk flags.",
		audience: "hr",
		icon: "ShieldCheck",
		accent: "from-teal-500/30 to-cyan-500/10",
		system: `${SHARED_GUARDRAILS}

Role: Compliance & risk monitor. Surface expired contracts, missing KYC/PoSH
training, statutory due-date risks, and policy violations. Rank by severity
(Critical / High / Medium / Low) and list the precise remediation step + owner.`,
		suggestions: [
			"Which employees have expired or missing documents?",
			"List compliance risks for this quarter",
			"Who hasn't completed mandatory training?"
		]
	},
	learning: {
		id: "learning",
		name: "Learning Agent",
		tagline: "Personalized growth paths & training plans.",
		audience: "all",
		icon: "BookOpen",
		accent: "from-cyan-500/30 to-sky-500/10",
		system: `${SHARED_GUARDRAILS}

Role: L&D planner. Build a tailored learning roadmap for the role / employee
in scope — courses, certifications, mentors, and a 30-60-90 day plan with
measurable outcomes. Prefer reputable providers and explain why each item fits.`,
		suggestions: [
			"Build a 6-month career roadmap from SDE-2 to Engineering Manager",
			"Recommend training for a new Product Manager hire",
			"Plan an upskilling path for our Data team"
		]
	},
	email: {
		id: "email",
		name: "Email Agent",
		tagline: "Drafts every HR letter, email & announcement.",
		audience: "hr",
		icon: "Mail",
		accent: "from-blue-500/30 to-indigo-500/10",
		system: `${SHARED_GUARDRAILS}

Role: HR communications writer. Generate the requested letter or email
(offer, joining, experience, promotion, salary revision, warning, termination,
internship, announcement, meeting invite). Always include Subject + Body and a
placeholder block for variables (e.g. {{employee_name}}, {{ctc}}). Match the
company tone: warm, clear, legally clean. Return as a "Proposed email" block
for human review before sending.`,
		suggestions: [
			"Draft an offer letter for Priya Singh, Senior Engineer, ₹28L CTC",
			"Write a warning letter for repeated tardiness",
			"Draft a company-wide announcement about a new leave policy"
		]
	},
	documents: {
		id: "documents",
		name: "Document Generator",
		tagline: "Letters, payslips, certificates as PDFs.",
		audience: "hr",
		icon: "FileText",
		accent: "from-yellow-500/30 to-amber-500/10",
		system: `${SHARED_GUARDRAILS}

Role: HR document drafter. Produce print-ready document content (Markdown with
a clear header block, body, and signature block). After the document, list the
merge variables used so the renderer can fill them. Do not invent stamps,
signatures, or registration numbers.`,
		suggestions: [
			"Generate an experience letter template for a Senior Designer",
			"Create a relieving letter for an employee leaving on 30 Jun",
			"Build a salary revision letter template"
		]
	},
	analytics: {
		id: "analytics",
		name: "Analytics Engine",
		tagline: "Live dashboards & KPI commentary.",
		audience: "exec",
		icon: "BarChart3",
		accent: "from-blue-500/30 to-cyan-500/10",
		system: `${SHARED_GUARDRAILS}

Role: Analytics narrator. When asked for a metric or dashboard, return:
1. The headline number + delta vs prior period.
2. A short "why" paragraph explaining drivers.
3. A Markdown table of the top contributing slices.
4. One recommended action.
If data is missing, say which input is needed.`,
		suggestions: [
			"Show this month's hiring funnel",
			"Summarize attendance trends across departments",
			"Build an organization health snapshot"
		]
	},
	automation: {
		id: "automation",
		name: "Automation Engine",
		tagline: "Designs end-to-end HR workflows.",
		audience: "hr",
		icon: "Workflow",
		accent: "from-purple-500/30 to-fuchsia-500/10",
		system: `${SHARED_GUARDRAILS}

Role: Workflow designer. Given a trigger (e.g. "candidate selected"), output
the full automation as a numbered list of steps with: actor (AI vs human),
system/tool, and approval gates. End with the YAML-style spec so it can be
wired into the automation engine. Highlight which steps need human approval.`,
		suggestions: [
			"Design the new-hire onboarding automation",
			"Automate the offboarding & asset-return flow",
			"Build an automated weekly attrition-risk digest for managers"
		]
	},
	knowledge: {
		id: "knowledge",
		name: "Knowledge Brain",
		tagline: "Answers from company policies, SOPs & handbooks.",
		audience: "all",
		icon: "Library",
		accent: "from-slate-500/30 to-zinc-500/10",
		system: `${SHARED_GUARDRAILS}

Role: Policy & knowledge assistant. Answer using the indexed knowledge base.
When the answer isn't supported by the indexed content, say so and offer to
ingest the relevant document. Always cite the policy section or document name.`,
		suggestions: [
			"What is our paternity leave policy?",
			"Summarize the IT acceptable-use policy",
			"What's the process for raising a PoSH complaint?"
		]
	},
	executive: {
		id: "executive",
		name: "Executive Assistant",
		tagline: "CEO-grade briefings on the workforce.",
		audience: "exec",
		icon: "Crown",
		accent: "from-amber-500/30 to-yellow-500/10",
		system: `${SHARED_GUARDRAILS}

Role: Executive briefer. Default format = 1-page brief:
- TL;DR (3 bullets)
- KPIs table (vs target + delta)
- Risks & opportunities
- Recommended decisions for the CEO this week.
No fluff. Numbers first. Cite sources.`,
		suggestions: [
			"Give me the weekly company health brief",
			"Top performers and bottom performers this quarter",
			"Project the 12-month payroll & hiring budget"
		]
	}
};
var AGENT_LIST = Object.values(AGENTS);
function getAgent(id) {
	if (id && id in AGENTS) return AGENTS[id];
	return AGENTS.router;
}
/**
* Server-side HR tool catalog exposed to AI Brain agents.
* Connects directly to authenticated backend services with user token forwarding
* and role-based tool scoping.
*/
function createHrTools({ token, role = "employee" } = {}) {
	const normRole = normalizeRole(role);
	const isExecutiveOrHr = normRole === "super_admin" || normRole === "hr_admin" || normRole === "executive";
	const isManager = isExecutiveOrHr || normRole === "manager";
	const authHeaders = token ? { Authorization: `Bearer ${token}` } : void 0;
	const tools = {};
	tools.searchPolicies = tool({
		description: "Retrieval over the indexed company policies & SOP knowledge base.",
		inputSchema: objectType({
			query: stringType().describe("Natural-language question or topic"),
			topK: numberType().min(1).max(5).optional().default(3)
		}),
		execute: async ({ query, topK = 3 }) => {
			try {
				const res = await apiInstance.get("/policy-assistant/search", {
					params: {
						q: query,
						limit: topK
					},
					headers: authHeaders
				});
				const results = res.data?.data ?? res.data ?? [];
				return {
					count: Array.isArray(results) ? results.length : 0,
					query,
					results: Array.isArray(results) ? results : []
				};
			} catch {
				return {
					count: 0,
					query,
					results: []
				};
			}
		}
	});
	tools.getLeaveBalance = tool({
		description: "Return leave balance (casual, sick, earned) for an employee id or name.",
		inputSchema: objectType({ employeeId: stringType().optional() }),
		execute: async ({ employeeId }) => {
			try {
				const targetId = isManager ? employeeId : void 0;
				const res = await apiInstance.get("/leaves/balances", {
					params: targetId ? { employee_id: targetId } : void 0,
					headers: authHeaders
				});
				const balances = res.data?.data ?? res.data ?? [];
				return {
					found: Array.isArray(balances) && balances.length > 0,
					employeeId: targetId || "current_user",
					balances: Array.isArray(balances) ? balances : [],
					asOf: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
				};
			} catch {
				return {
					found: false,
					employeeId,
					balances: []
				};
			}
		}
	});
	tools.proposeAction = tool({
		description: "Stage an action that requires human approval before execution (e.g. apply leave, send email, generate offer letter, approve reimbursement). Returns a structured proposal — DOES NOT execute the action.",
		inputSchema: objectType({
			kind: enumType([
				"apply_leave",
				"send_email",
				"generate_letter",
				"approve_request",
				"reject_request",
				"reimburse_expense",
				"create_employee",
				"schedule_interview",
				"trigger_workflow"
			]),
			summary: stringType().describe("One-sentence human-readable summary"),
			payload: recordType(stringType(), anyType()).describe("Structured fields the executor would consume"),
			requiresApprovalFrom: stringType().optional().describe("Role that must approve, e.g. 'manager', 'hr_admin', 'finance'")
		}),
		execute: async (input) => ({
			status: "pending_approval",
			proposalId: `prop_${Math.random().toString(36).slice(2, 10)}`,
			proposedAt: (/* @__PURE__ */ new Date()).toISOString(),
			...input
		})
	});
	if (isManager) {
		tools.searchEmployees = tool({
			description: "Search the employee directory by name fragment, department, role, or manager. Returns up to 20 matching employees with summary fields.",
			inputSchema: objectType({
				query: stringType().optional().describe("Free-text fragment to match against name, email, role, or department"),
				department: stringType().optional(),
				manager: stringType().optional(),
				minRiskScore: numberType().min(0).max(100).optional().describe("Only return employees with attrition risk at or above this score"),
				limit: numberType().min(1).max(50).optional().default(20)
			}),
			execute: async ({ query, department, manager, limit = 20 }) => {
				try {
					const params = { limit };
					if (query) params.search = query;
					if (department && department !== "all") params.department = department;
					if (manager) params.manager = manager;
					const res = await apiInstance.get("/employees", {
						params,
						headers: authHeaders
					});
					const employees = (res.data?.data?.items ?? res.data?.items ?? (Array.isArray(res.data) ? res.data : [])).map((e) => ({
						id: e.id || e.employee_id || "",
						name: `${e.first_name || ""} ${e.last_name || ""}`.trim() || e.name || "Employee",
						email: e.personal_email || e.company_email || e.email || "",
						department: e.department || "",
						role: e.designation || e.role || "",
						manager: e.manager_name || e.manager || ""
					}));
					return {
						count: employees.length,
						employees
					};
				} catch {
					return {
						count: 0,
						employees: []
					};
				}
			}
		});
		tools.getEmployee = tool({
			description: "Fetch a full employee profile by employee id or exact name.",
			inputSchema: objectType({ idOrName: stringType() }),
			execute: async ({ idOrName }) => {
				try {
					const needle = idOrName.toLowerCase().trim();
					const res = await apiInstance.get("/employees", {
						params: {
							search: needle,
							limit: 10
						},
						headers: authHeaders
					});
					const match = (res.data?.data?.items ?? res.data?.items ?? (Array.isArray(res.data) ? res.data : [])).find((e) => {
						const name = `${e.first_name || ""} ${e.last_name || ""}`.trim().toLowerCase();
						const empId = String(e.employee_id || e.id || "").toLowerCase();
						return name === needle || empId === needle || name.includes(needle);
					});
					if (!match) return {
						found: false,
						idOrName
					};
					return {
						found: true,
						employee: {
							id: match.employee_id || match.id,
							name: `${match.first_name || ""} ${match.last_name || ""}`.trim() || match.name,
							email: match.personal_email || match.company_email || match.email,
							department: match.department,
							role: match.designation || match.role,
							status: match.status,
							joiningDate: match.joining_date
						}
					};
				} catch {
					return {
						found: false,
						idOrName
					};
				}
			}
		});
	}
	if (isExecutiveOrHr) tools.attritionRiskList = tool({
		description: "Return the top-N employees by predicted attrition risk, optionally scoped to a department.",
		inputSchema: objectType({
			department: stringType().optional(),
			topN: numberType().min(1).max(50).optional().default(10)
		}),
		execute: async ({ department, topN = 10 }) => {
			try {
				const res = await apiInstance.get("/ai-insights/attrition", { headers: authHeaders });
				const items = res.data?.data ?? res.data ?? [];
				const scope = Array.isArray(items) ? items : [];
				const filtered = department ? scope.filter((e) => String(e.department || "").toLowerCase() === department.toLowerCase()) : scope;
				return {
					count: filtered.slice(0, topN).length,
					scope: department ?? "company",
					employees: filtered.slice(0, topN)
				};
			} catch {
				return {
					count: 0,
					scope: department ?? "company",
					employees: []
				};
			}
		}
	});
	return tools;
}
createHrTools();
/**
* Reusable server-side authentication and authorization guards for API routes in TanStack Start / Nitro.
* Enforces:
* 1. Bearer token validation (401 Unauthorized)
* 2. Role-based backend authorization (403 Forbidden)
* 3. Platform Owner (Super Admin) separation (403 Forbidden)
* 4. Tenant / Organization isolation (403 Forbidden)
*/
function getBackendApiUrl() {
	let url = (process.env.VITE_API_URL || "https://api.ofc360.com").trim().replace(/\/+$/, "");
	if (!url.startsWith("http://") && !url.startsWith("https://")) url = `https://${url}`;
	return url;
}
/**
* Validates that the incoming request contains a valid Bearer token,
* and verifies it against the backend identity service.
*/
async function requireAuth(request) {
	const authHeader = request.headers.get("authorization") || request.headers.get("Authorization");
	if (!authHeader || !authHeader.startsWith("Bearer ")) return { error: new Response(JSON.stringify({ error: "Unauthorized: Missing or malformed Authorization header" }), {
		status: 401,
		headers: {
			"Content-Type": "application/json",
			"WWW-Authenticate": "Bearer realm=\"aurix-api\""
		}
	}) };
	const token = authHeader.slice(7).trim();
	if (!token) return { error: new Response(JSON.stringify({ error: "Unauthorized: Token missing" }), {
		status: 401,
		headers: {
			"Content-Type": "application/json",
			"WWW-Authenticate": "Bearer realm=\"aurix-api\""
		}
	}) };
	const baseUrl = getBackendApiUrl();
	try {
		let response = await fetch(`${baseUrl}/api/v1/auth/me`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: "application/json"
			}
		});
		if (response.status === 401 || response.status === 403) return { error: new Response(JSON.stringify({ error: "Unauthorized: Invalid or expired token" }), {
			status: 401,
			headers: {
				"Content-Type": "application/json",
				"WWW-Authenticate": "Bearer realm=\"aurix-api\""
			}
		}) };
		if (!response.ok) return { error: new Response(JSON.stringify({ error: "Unauthorized: Identity verification failed" }), {
			status: 401,
			headers: { "Content-Type": "application/json" }
		}) };
		const payload = await response.json();
		const userData = payload?.data ?? payload?.user ?? payload;
		if (!userData || !userData.id && !userData.sub && !userData.email) return { error: new Response(JSON.stringify({ error: "Unauthorized: Invalid user payload from identity service" }), {
			status: 401,
			headers: { "Content-Type": "application/json" }
		}) };
		return {
			user: {
				id: String(userData.id || userData.sub || userData.email),
				name: userData.name || userData.full_name || "",
				email: userData.email || "",
				role: normalizeRole(typeof userData.role === "string" ? userData.role : null),
				company_id: userData.company_id,
				...userData
			},
			token
		};
	} catch (err) {
		console.error("[requireAuth] Failed to verify token with backend:", err);
		return { error: new Response(JSON.stringify({ error: "Unauthorized: Authentication service unavailable" }), {
			status: 401,
			headers: { "Content-Type": "application/json" }
		}) };
	}
}
var rateLimitStore = /* @__PURE__ */ new Map();
var MINUTE_LIMIT = 20;
var DAY_LIMIT = 200;
var ONE_MINUTE_MS = 60 * 1e3;
var ONE_DAY_MS = 1440 * 60 * 1e3;
var CLEANUP_INTERVAL_MS = 600 * 1e3;
var lastCleanup = Date.now();
function purgeStaleRecords(now) {
	if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
	lastCleanup = now;
	for (const [key, record] of rateLimitStore.entries()) if (now - record.dayWindowStart > ONE_DAY_MS) rateLimitStore.delete(key);
}
/**
* Checks rate limits for a given user identifier.
*/
function checkRateLimit(userId) {
	const now = Date.now();
	purgeStaleRecords(now);
	let record = rateLimitStore.get(userId);
	if (!record) {
		record = {
			minuteWindowStart: now,
			minuteCount: 1,
			dayWindowStart: now,
			dayCount: 1
		};
		rateLimitStore.set(userId, record);
		return {
			allowed: true,
			remaining: MINUTE_LIMIT - 1,
			limit: MINUTE_LIMIT
		};
	}
	if (now - record.minuteWindowStart >= ONE_MINUTE_MS) {
		record.minuteWindowStart = now;
		record.minuteCount = 0;
	}
	if (now - record.dayWindowStart >= ONE_DAY_MS) {
		record.dayWindowStart = now;
		record.dayCount = 0;
	}
	if (record.minuteCount >= MINUTE_LIMIT) {
		const retryAfterSeconds = Math.ceil((record.minuteWindowStart + ONE_MINUTE_MS - now) / 1e3);
		return {
			allowed: false,
			retryAfterSeconds: Math.max(1, retryAfterSeconds),
			limit: MINUTE_LIMIT,
			remaining: 0,
			reason: "Rate limit exceeded: max 20 requests per minute allowed."
		};
	}
	if (record.dayCount >= DAY_LIMIT) {
		const retryAfterSeconds = Math.ceil((record.dayWindowStart + ONE_DAY_MS - now) / 1e3);
		return {
			allowed: false,
			retryAfterSeconds: Math.max(1, retryAfterSeconds),
			limit: DAY_LIMIT,
			remaining: 0,
			reason: "Daily limit exceeded: max 200 requests per day allowed."
		};
	}
	record.minuteCount += 1;
	record.dayCount += 1;
	return {
		allowed: true,
		limit: MINUTE_LIMIT,
		remaining: MINUTE_LIMIT - record.minuteCount
	};
}
var ALLOWED_MODELS = /* @__PURE__ */ new Set([
	"google/gemini-3-flash-preview",
	"google/gemini-2.5-flash",
	"google/gemini-2.5-pro",
	"openai/gpt-5",
	"openai/gpt-5-mini"
]);
var MAX_PAYLOAD_BYTES = 100 * 1024;
var MAX_MESSAGES_COUNT = 40;
var Route$173 = createFileRoute("/api/ai-brain")({ server: { handlers: { POST: async ({ request }) => {
	const auth = await requireAuth(request);
	if (auth.error) return auth.error;
	const rateLimit = checkRateLimit(auth.user.id);
	if (!rateLimit.allowed) return new Response(JSON.stringify({ error: rateLimit.reason || "Too Many Requests" }), {
		status: 429,
		headers: {
			"Content-Type": "application/json",
			"Retry-After": String(rateLimit.retryAfterSeconds ?? 60),
			"X-RateLimit-Limit": String(rateLimit.limit ?? 20),
			"X-RateLimit-Remaining": "0"
		}
	});
	let body;
	try {
		const rawText = await request.text();
		if (rawText.length > MAX_PAYLOAD_BYTES) return new Response(JSON.stringify({ error: "Payload too large (maximum allowed size is 100KB)" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		body = JSON.parse(rawText);
	} catch {
		return new Response(JSON.stringify({ error: "Malformed or invalid JSON in request body" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
	}
	const { messages, agentId, model: modelOverride } = body;
	if (!Array.isArray(messages) || messages.length === 0) return new Response(JSON.stringify({ error: "Messages array is required and must not be empty" }), {
		status: 400,
		headers: { "Content-Type": "application/json" }
	});
	if (messages.length > MAX_MESSAGES_COUNT) return new Response(JSON.stringify({ error: `Too many messages in conversation (maximum allowed is ${MAX_MESSAGES_COUNT})` }), {
		status: 400,
		headers: { "Content-Type": "application/json" }
	});
	const key = process.env.AI_GATEWAY_API_KEY || process.env.OPENAI_API_KEY;
	if (!key) return new Response(JSON.stringify({ error: "AI service is temporarily unavailable" }), {
		status: 500,
		headers: { "Content-Type": "application/json" }
	});
	const agent = getAgent(agentId);
	const modelName = modelOverride && ALLOWED_MODELS.has(modelOverride) ? modelOverride : "google/gemini-3-flash-preview";
	const gateway = createAiGatewayProvider(key);
	const tools = createHrTools({
		token: auth.token,
		role: auth.user.role || void 0
	});
	try {
		return streamText({
			model: gateway(modelName),
			system: agent.system,
			messages: await convertToModelMessages(messages),
			tools,
			stopWhen: stepCountIs(8)
		}).toUIMessageStreamResponse({
			originalMessages: messages,
			headers: {
				"X-OFC360-Agent": agent.id,
				"X-OFC360-Model": modelName
			}
		});
	} catch (err) {
		console.error("[ai-brain] Streaming execution error:", err);
		return new Response(JSON.stringify({ error: "AI Brain processing failed. Please try again later." }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
} } } });
var $$splitComponentImporter$171 = () => import("./ai.workforce-planning-BK9Wsb3v.mjs");
var Route$172 = createFileRoute("/ai/workforce-planning")({
	head: () => ({ meta: [{ title: "AI Workforce Planning — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$171, "component")
});
var $$splitComponentImporter$170 = () => import("./ai.workforce-insights-CROIbiqc.mjs");
var Route$171 = createFileRoute("/ai/workforce-insights")({
	head: () => ({ meta: [{ title: "AI Workforce Insights — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$170, "component")
});
var $$splitComponentImporter$169 = () => import("./ai.recruiter-Dl57T1J3.mjs");
var Route$170 = createFileRoute("/ai/recruiter")({
	head: () => ({ meta: [{ title: "AI Recruiter — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$169, "component")
});
var $$splitComponentImporter$168 = () => import("./ai.policy-assistant-BISUyp2r.mjs");
var Route$169 = createFileRoute("/ai/policy-assistant")({
	head: () => ({ meta: [{ title: "AI Policy Assistant — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$168, "component")
});
var $$splitComponentImporter$167 = () => import("./ai.performance-coach-CBuOhGO0.mjs");
var Route$168 = createFileRoute("/ai/performance-coach")({
	head: () => ({ meta: [{ title: "AI Performance Coach — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$167, "component")
});
var $$splitComponentImporter$166 = () => import("./ai.meeting-intelligence-BYs8PKHF.mjs");
var Route$167 = createFileRoute("/ai/meeting-intelligence")({
	head: () => ({ meta: [{ title: "AI Meeting Intelligence — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$166, "component")
});
var $$splitComponentImporter$165 = () => import("./ai.leave-assistant-CWuk584_.mjs");
var Route$166 = createFileRoute("/ai/leave-assistant")({
	head: () => ({ meta: [{ title: "AI Leave Assistant — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$165, "component")
});
var $$splitComponentImporter$164 = () => import("./ai.employee-health-CsddkT5e.mjs");
var Route$165 = createFileRoute("/ai/employee-health")({
	head: () => ({ meta: [{ title: "AI Employee Health — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$164, "component")
});
var $$splitComponentImporter$163 = () => import("./ai.document-generator-BwLQv1Ps.mjs");
var Route$164 = createFileRoute("/ai/document-generator")({
	head: () => ({ meta: [{ title: "AI Document Generator — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$163, "component")
});
var $$splitComponentImporter$162 = () => import("./ai.compliance-monitor-BiJwUlTj.mjs");
var Route$163 = createFileRoute("/ai/compliance-monitor")({
	head: () => ({ meta: [{ title: "AI Compliance Monitor — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$162, "component")
});
var $$splitComponentImporter$161 = () => import("./ai.chat-assistant-QrSuyKaZ.mjs");
var Route$162 = createFileRoute("/ai/chat-assistant")({
	head: () => ({ meta: [{ title: "AI Chat Assistant — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$161, "component")
});
var $$splitComponentImporter$160 = () => import("./ai.brain-Dh1d3tDW.mjs");
var Route$161 = createFileRoute("/ai/brain")({
	head: () => ({ meta: [{ title: "AI Insight 2.0 — Autonomous HR Brain | OFC360" }, {
		name: "description",
		content: "An autonomous AI HR brain: 15+ specialist agents that recruit, evaluate, predict attrition, run payroll, draft letters and more."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$160, "component")
});
var $$splitComponentImporter$159 = () => import("./ai.attendance-monitor-6w4jjvlb.mjs");
var Route$160 = createFileRoute("/ai/attendance-monitor")({
	head: () => ({ meta: [{ title: "AI Attendance Monitor — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$159, "component")
});
var $$splitComponentImporter$158 = () => import("./ai.analytics-center-B9SdtyZG.mjs");
var Route$159 = createFileRoute("/ai/analytics-center")({
	head: () => ({ meta: [{ title: "AI Analytics Center — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$158, "component")
});
var $$splitComponentImporter$157 = () => import("./dashboard.workforce.index-n4dOEbh_.mjs");
var Route$158 = createFileRoute("/dashboard/workforce/")({
	head: () => ({ meta: [{ title: "Workforce Hub — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$157, "component")
});
var $$splitComponentImporter$156 = () => import("./dashboard.talent.index-Bng5r6iB.mjs");
var Route$157 = createFileRoute("/dashboard/talent/")({
	head: () => ({ meta: [{ title: "Talent Management — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$156, "component")
});
var $$splitComponentImporter$155 = () => import("./dashboard.super-admin.index-DyTta1NV.mjs");
var Route$156 = createFileRoute("/dashboard/super-admin/")({
	head: () => ({ meta: [{ title: "Super Admin Command Center — OFC360" }, {
		name: "description",
		content: "Platform owner administration, global statistics, multi-organization health, and audit trail."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$155, "component")
});
var $$splitComponentImporter$154 = () => import("./dashboard.settings.index-Budx671t.mjs");
var Route$155 = createFileRoute("/dashboard/settings/")({
	head: () => ({ meta: [{ title: "Organization Settings — OFC360" }] }),
	validateSearch: (search) => {
		return { section: search.section || void 0 };
	},
	component: lazyRouteComponent($$splitComponentImporter$154, "component")
});
var $$splitComponentImporter$153 = () => import("./dashboard.resources.index-DXbj342l.mjs");
var Route$154 = createFileRoute("/dashboard/resources/")({
	head: () => ({ meta: [{ title: "Resources Hub — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$153, "component")
});
var $$splitComponentImporter$152 = () => import("./recruitment-BnM-leFE.mjs");
var Route$153 = createFileRoute("/dashboard/recruitment/")({
	head: () => ({ meta: [{ title: "Recruitment Workspace — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$152, "component")
});
var $$splitComponentImporter$151 = () => import("./dashboard.people.index-B9DgF388.mjs");
var Route$152 = createFileRoute("/dashboard/people/")({
	head: () => ({ meta: [{ title: "People Hub — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$151, "component")
});
var $$splitComponentImporter$150 = () => import("./dashboard.payroll.index-ClqV65W2.mjs");
var Route$151 = createFileRoute("/dashboard/payroll/")({
	head: () => ({ meta: [{ title: "Payroll Dashboard — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$150, "component")
});
var $$splitComponentImporter$149 = () => import("./dashboard.hr-operations.index-C5rAguGS.mjs");
var Route$150 = createFileRoute("/dashboard/hr-operations/")({
	head: () => ({ meta: [{ title: "HR Operations Hub — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$149, "component")
});
var $$splitComponentImporter$148 = () => import("./dashboard.executive.index-YGlok3mo.mjs");
var Route$149 = createFileRoute("/dashboard/executive/")({
	head: () => ({ meta: [{ title: "Executive Control Center — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$148, "component")
});
var $$splitComponentImporter$147 = () => import("./dashboard.attendance.index-CNkqIMmg.mjs");
var Route$148 = createFileRoute("/dashboard/attendance/")({
	head: () => ({ meta: [{ title: "Attendance — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$147, "component")
});
var Route$147 = createFileRoute("/dashboard/analytics/")({
	head: () => ({ meta: [{ title: "Analytics Hub — OFC360" }] }),
	component: AnalyticsHubPage
});
var ALL_ANALYTICS_MODULES = [
	{
		id: "reports",
		title: "HR Reports Builder",
		description: "Custom reporting engine for headcount, payroll costs, turnover rates, and compliance metrics.",
		icon: ChartColumn,
		to: "/dashboard/analytics/reports",
		color: "from-indigo-500/20 to-blue-500/20 text-indigo-400 border-indigo-500/30"
	},
	{
		id: "ai-insights",
		title: "AI Predictive Insights",
		description: "Predictive attrition analytics, team sentiment monitoring, burnout risk alerts, and salary benchmarks.",
		icon: Sparkles,
		to: "/dashboard/analytics/ai-insights",
		color: "from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30",
		badge: "AI"
	},
	{
		id: "ai-analytics-center",
		title: "AI Analytics Center",
		description: "Unified executive intelligence dashboard with live database-driven workforce forecasting and predictive KPI metrics.",
		icon: Brain,
		to: "/ai/analytics-center",
		color: "from-violet-500/20 to-indigo-500/20 text-violet-400 border-violet-500/30",
		badge: "Intelligence"
	},
	{
		id: "recruitment-analytics",
		title: "Recruitment & Hiring Analytics",
		description: "Hiring velocity, candidate pipeline conversion, source effectiveness, and recruitment team metrics.",
		icon: UserCheck,
		to: "/dashboard/recruitment/analytics",
		color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30"
	},
	{
		id: "cio-analytics",
		title: "Technology & IT Analytics",
		description: "Infrastructure uptime, device compliance, SaaS licensing, and security telemetry for executive leaders.",
		icon: ShieldCheck,
		to: "/dashboard/executive/cio/analytics",
		color: "from-sky-500/20 to-cyan-500/20 text-sky-400 border-sky-500/30"
	},
	{
		id: "cto-analytics",
		title: "Engineering & Tech Analytics",
		description: "Engineering velocity, deployment health, security vulnerability trends, and technical infrastructure ROI.",
		icon: Wrench,
		to: "/dashboard/executive/cto/analytics",
		color: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30"
	}
];
function AnalyticsHubPage() {
	const currentRole = useCurrentRole();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModuleHubView, { modules: (0, import_react.useMemo)(() => {
		return ALL_ANALYTICS_MODULES.filter((module) => {
			return checkRouteAccess(module.to, currentRole).allowed;
		});
	}, [currentRole]) });
}
var $$splitComponentImporter$146 = () => import("./dashboard.ai-hub.index-BBBXV-dW.mjs");
var Route$146 = createFileRoute("/dashboard/ai-hub/")({
	head: () => ({ meta: [{ title: "AI Hub — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$146, "component")
});
var $$splitComponentImporter$145 = () => import("./jobs.apply._ukey-DzVqaXqr.mjs");
var Route$145 = createFileRoute("/jobs/apply/$ukey")({
	head: () => ({ meta: [{ title: "Apply for Position — Careers | OFC360" }, {
		name: "description",
		content: "Submit your application and join our world-class engineering and enterprise intelligence teams."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$145, "component")
});
var $$splitComponentImporter$144 = () => import("./dashboard.workforce.timesheets-Dp6YYRPa.mjs");
var Route$144 = createFileRoute("/dashboard/workforce/timesheets")({
	head: () => ({ meta: [{ title: "Timesheets — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$144, "component")
});
var $$splitComponentImporter$143 = () => import("./dashboard.workforce.people-DCVdZe4n.mjs");
var Route$143 = createFileRoute("/dashboard/workforce/people")({
	head: () => ({ meta: [{ title: "People — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$143, "component")
});
var $$splitComponentImporter$142 = () => import("./dashboard.workforce.leaves-B2OxOdKV.mjs");
var Route$142 = createFileRoute("/dashboard/workforce/leaves")({
	head: () => ({ meta: [{ title: "Leaves — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$142, "component")
});
var $$splitComponentImporter$141 = () => import("./dashboard.workforce.departments-lydOGIol.mjs");
var Route$141 = createFileRoute("/dashboard/workforce/departments")({
	head: () => ({ meta: [{ title: "Departments — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$141, "component")
});
var $$splitComponentImporter$140 = () => import("./dashboard.workforce.attendance-Dsn-5MH7.mjs");
var Route$140 = createFileRoute("/dashboard/workforce/attendance")({
	head: () => ({ meta: [{ title: "Attendance — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$140, "component")
});
var $$splitComponentImporter$139 = () => import("./dashboard.talent.recruitment-Cqu57OJo.mjs");
var Route$139 = createFileRoute("/dashboard/talent/recruitment")({
	head: () => ({ meta: [{ title: "Recruitment — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$139, "component")
});
var $$splitComponentImporter$138 = () => import("./dashboard.talent.performance-B9grv-nq.mjs");
var Route$138 = createFileRoute("/dashboard/talent/performance")({
	head: () => ({ meta: [{ title: "Performance — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$138, "component")
});
var $$splitComponentImporter$137 = () => import("./dashboard.super-admin.users-SW3Je3l4.mjs");
var Route$137 = createFileRoute("/dashboard/super-admin/users")({
	head: () => ({ meta: [{ title: "User Management — OFC360 Super Admin" }, {
		name: "description",
		content: "Platform-wide user management, role statistics, and account activation/deactivation."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$137, "component")
});
var $$splitComponentImporter$136 = () => import("./dashboard.super-admin.settings-C8SwEaox.mjs");
var Route$136 = createFileRoute("/dashboard/super-admin/settings")({
	head: () => ({ meta: [{ title: "System Settings — OFC360 Super Admin" }, {
		name: "description",
		content: "Platform-level settings, maintenance mode, security policies and session timeouts."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$136, "component")
});
var $$splitComponentImporter$135 = () => import("./dashboard.super-admin.platform-config-CEVfYjuS.mjs");
var Route$135 = createFileRoute("/dashboard/super-admin/platform-config")({
	head: () => ({ meta: [{ title: "Platform Configuration & Health — OFC360 Super Admin" }, {
		name: "description",
		content: "Platform diagnostics, cluster telemetry, uptime, database and API latency."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$135, "component")
});
var $$splitComponentImporter$134 = () => import("./dashboard.super-admin.organizations-BKZI6Wt9.mjs");
var Route$134 = createFileRoute("/dashboard/super-admin/organizations")({
	head: () => ({ meta: [{ title: "Organizations — OFC360 Super Admin" }, {
		name: "description",
		content: "Multi-tenant company accounts, usage, and subscription plans."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$134, "component")
});
var $$splitComponentImporter$133 = () => import("./dashboard.super-admin.audit-logs-CDe8ZVBD.mjs");
var Route$133 = createFileRoute("/dashboard/super-admin/audit-logs")({
	head: () => ({ meta: [{ title: "Platform Audit Logs — OFC360 Super Admin" }, {
		name: "description",
		content: "Security audit logs, system-level actor trails, and compliance history."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$133, "component")
});
var $$splitComponentImporter$132 = () => import("./dashboard.super-admin.analytics-YMaIF7aM.mjs");
var Route$132 = createFileRoute("/dashboard/super-admin/analytics")({
	head: () => ({ meta: [{ title: "Usage & Analytics — OFC360 Super Admin" }, {
		name: "description",
		content: "Platform metrics, MAU trends, resource utilization and analytics."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$132, "component")
});
var $$splitComponentImporter$131 = () => import("./dashboard.super-admin.activity-BGeRbf3E.mjs");
var Route$131 = createFileRoute("/dashboard/super-admin/activity")({
	head: () => ({ meta: [{ title: "System Activity — OFC360 Super Admin" }, {
		name: "description",
		content: "Platform-wide real-time activity and security events across all tenants."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$131, "component")
});
var $$splitComponentImporter$130 = () => import("./dashboard.settings.security-CTr_VmYQ.mjs");
var Route$130 = createFileRoute("/dashboard/settings/security")({
	head: () => ({ meta: [{ title: "Security Settings — Access Restricted" }] }),
	component: lazyRouteComponent($$splitComponentImporter$130, "component")
});
var $$splitComponentImporter$129 = () => import("./dashboard.settings.roles-permissions-CZORl6eJ.mjs");
var Route$129 = createFileRoute("/dashboard/settings/roles-permissions")({
	head: () => ({ meta: [{ title: "Roles & Permissions — Access Restricted" }] }),
	component: lazyRouteComponent($$splitComponentImporter$129, "component")
});
var $$splitComponentImporter$128 = () => import("./dashboard.settings.profile-BuO20V6G.mjs");
var Route$128 = createFileRoute("/dashboard/settings/profile")({
	head: () => ({ meta: [{ title: "User Profile — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$128, "component")
});
var $$splitComponentImporter$127 = () => import("./dashboard.settings.notifications-DGkWXlm5.mjs");
var Route$127 = createFileRoute("/dashboard/settings/notifications")({
	head: () => ({ meta: [{ title: "Notification Settings — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$127, "component")
});
var $$splitComponentImporter$126 = () => import("./dashboard.settings.integrations-DyOKQwkQ.mjs");
var Route$126 = createFileRoute("/dashboard/settings/integrations")({
	head: () => ({ meta: [{ title: "Integrations — Access Restricted" }] }),
	component: lazyRouteComponent($$splitComponentImporter$126, "component")
});
var $$splitComponentImporter$125 = () => import("./dashboard.settings.general-y5JDTMXd.mjs");
var Route$125 = createFileRoute("/dashboard/settings/general")({
	head: () => ({ meta: [{ title: "General Settings — Access Restricted" }] }),
	component: lazyRouteComponent($$splitComponentImporter$125, "component")
});
var $$splitComponentImporter$124 = () => import("./dashboard.settings.company-LspChFvy.mjs");
var Route$124 = createFileRoute("/dashboard/settings/company")({
	head: () => ({ meta: [{ title: "Company Settings — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$124, "component")
});
var $$splitComponentImporter$123 = () => import("./dashboard.settings.billing-Dl5CF2pe.mjs");
var Route$123 = createFileRoute("/dashboard/settings/billing")({
	head: () => ({ meta: [{ title: "Billing Settings — Access Restricted" }] }),
	component: lazyRouteComponent($$splitComponentImporter$123, "component")
});
var $$splitComponentImporter$122 = () => import("./dashboard.settings.audit-logs-CGOMQ8qU.mjs");
var Route$122 = createFileRoute("/dashboard/settings/audit-logs")({
	head: () => ({ meta: [{ title: "Audit Logs — Access Restricted" }] }),
	component: lazyRouteComponent($$splitComponentImporter$122, "component")
});
var $$splitComponentImporter$121 = () => import("./dashboard.resources.documents-gAqYGEO5.mjs");
var Route$121 = createFileRoute("/dashboard/resources/documents")({
	beforeLoad: async () => {
		if (typeof window !== "undefined") {
			const user = aurix.get().user;
			if (!canAccessDocumentsRoute(user?.role)) throw redirect({ to: getDefaultDashboardPath(user?.role) });
		}
	},
	head: () => ({ meta: [{ title: "Documents — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$121, "component")
});
var $$splitComponentImporter$120 = () => import("./dashboard.resources.assets-B6ixg3Nf.mjs");
var Route$120 = createFileRoute("/dashboard/resources/assets")({
	head: () => ({ meta: [{ title: "Assets — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$120, "component")
});
var $$splitComponentImporter$119 = () => import("./dashboard.resources.asset-management-DamiI6pX.mjs");
var Route$119 = createFileRoute("/dashboard/resources/asset-management")({
	head: () => ({ meta: [{ title: "Asset Management — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$119, "component")
});
var $$splitComponentImporter$118 = () => import("./workforce-planning-C9AIrNns.mjs");
var Route$118 = createFileRoute("/dashboard/recruitment/workforce-planning")({
	head: () => ({ meta: [{ title: "Workforce Planning — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$118, "component")
});
var $$splitComponentImporter$117 = () => import("./verification-bsJhf_oa.mjs");
var Route$117 = createFileRoute("/dashboard/recruitment/verification")({
	head: () => ({ meta: [{ title: "Background Verification (BGV) — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$117, "component")
});
var $$splitComponentImporter$116 = () => import("./vendors-DlaULM8a.mjs");
var Route$116 = createFileRoute("/dashboard/recruitment/vendors")({
	head: () => ({ meta: [{ title: "Vendors — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$116, "component")
});
var $$splitComponentImporter$115 = () => import("./templates-BB098xwq.mjs");
var Route$115 = createFileRoute("/dashboard/recruitment/templates")({
	head: () => ({ meta: [{ title: "Templates — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$115, "component")
});
var $$splitComponentImporter$114 = () => import("./talent-pool-DvJ5EoCd.mjs");
var Route$114 = createFileRoute("/dashboard/recruitment/talent-pool")({
	head: () => ({ meta: [{ title: "Talent Pool — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$114, "component")
});
var $$splitComponentImporter$113 = () => import("./sourcing-3HphjOCD.mjs");
var Route$113 = createFileRoute("/dashboard/recruitment/sourcing")({
	head: () => ({ meta: [{ title: "Candidate Sourcing — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$113, "component")
});
var $$splitComponentImporter$112 = () => import("./search-CEOBd0Mz.mjs");
var Route$112 = createFileRoute("/dashboard/recruitment/search")({
	head: () => ({ meta: [{ title: "Search — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$112, "component")
});
var $$splitComponentImporter$111 = () => import("./scorecards-CNYGl1gx.mjs");
var Route$111 = createFileRoute("/dashboard/recruitment/scorecards")({
	head: () => ({ meta: [{ title: "Scorecards — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$111, "component")
});
var $$splitComponentImporter$110 = () => import("./resume-intelligence-ByQc1FhS.mjs");
var Route$110 = createFileRoute("/dashboard/recruitment/resume-intelligence")({
	head: () => ({ meta: [{ title: "Resume Intelligence — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$110, "component")
});
var $$splitComponentImporter$109 = () => import("./requisitions-CRFkAxOv.mjs");
var Route$109 = createFileRoute("/dashboard/recruitment/requisitions")({
	head: () => ({ meta: [{ title: "Requisitions — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$109, "component")
});
var $$splitComponentImporter$108 = () => import("./reports-Cjx4Oyy3.mjs");
var Route$108 = createFileRoute("/dashboard/recruitment/reports")({
	head: () => ({ meta: [{ title: "Reports — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$108, "component")
});
var $$splitComponentImporter$107 = () => import("./referrals-C-41FASn.mjs");
var Route$107 = createFileRoute("/dashboard/recruitment/referrals")({
	head: () => ({ meta: [{ title: "Referrals — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$107, "component")
});
var $$splitComponentImporter$106 = () => import("./preboarding-BqClrTlk.mjs");
var Route$106 = createFileRoute("/dashboard/recruitment/preboarding")({
	head: () => ({ meta: [{ title: "Preboarding Engagement — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$106, "component")
});
var $$splitComponentImporter$105 = () => import("./pipeline-C2oQndVY.mjs");
var Route$105 = createFileRoute("/dashboard/recruitment/pipeline")({
	head: () => ({ meta: [{ title: "Pipeline — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$105, "component")
});
var $$splitComponentImporter$104 = () => import("./onboarding-D6aEkO4z.mjs");
var Route$104 = createFileRoute("/dashboard/recruitment/onboarding")({
	head: () => ({ meta: [{ title: "Onboarding — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$104, "component")
});
var $$splitComponentImporter$103 = () => import("./offers-4pAWELdQ.mjs");
var Route$103 = createFileRoute("/dashboard/recruitment/offers")({
	head: () => ({ meta: [{ title: "Offers — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$103, "component")
});
var $$splitComponentImporter$102 = () => import("./notifications-BTV0O5Nq.mjs");
var Route$102 = createFileRoute("/dashboard/recruitment/notifications")({
	head: () => ({ meta: [{ title: "Notifications — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$102, "component")
});
var $$splitComponentImporter$101 = () => import("./kt-probation-COmSB_Y2.mjs");
var Route$101 = createFileRoute("/dashboard/recruitment/kt-probation")({
	head: () => ({ meta: [{ title: "Knowledge Transfer & Probation — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$101, "component")
});
var $$splitComponentImporter$100 = () => import("./interviews-WEE0lggh.mjs");
var Route$100 = createFileRoute("/dashboard/recruitment/interviews")({
	head: () => ({ meta: [{ title: "Interviews — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$100, "component")
});
var $$splitComponentImporter$99 = () => import("./import-export-DB_aQSkK.mjs");
var Route$99 = createFileRoute("/dashboard/recruitment/import-export")({
	head: () => ({ meta: [{ title: "Import / Export — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$99, "component")
});
var $$splitComponentImporter$98 = () => import("./hiring-manager-C9PwFRMs.mjs");
var Route$98 = createFileRoute("/dashboard/recruitment/hiring-manager")({
	head: () => ({ meta: [{ title: "Hiring Manager Hub — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$98, "component")
});
var $$splitComponentImporter$97 = () => import("./employee-onboarding-DMUSQhvB.mjs");
var Route$97 = createFileRoute("/dashboard/recruitment/employee-onboarding")({
	head: () => ({ meta: [{ title: "Enterprise Onboarding Hub — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$97, "component")
});
var $$splitComponentImporter$96 = () => import("./crm-Ce-Geyrx.mjs");
var Route$96 = createFileRoute("/dashboard/recruitment/crm")({
	head: () => ({ meta: [{ title: "CRM — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$96, "component")
});
var $$splitComponentImporter$95 = () => import("./compliance-Dt0mhNMc.mjs");
var Route$95 = createFileRoute("/dashboard/recruitment/compliance")({
	head: () => ({ meta: [{ title: "Compliance — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$95, "component")
});
var $$splitComponentImporter$94 = () => import("./compensation-B4MyL6n7.mjs");
var Route$94 = createFileRoute("/dashboard/recruitment/compensation")({
	head: () => ({ meta: [{ title: "Compensation & Offer Builder — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$94, "component")
});
var $$splitComponentImporter$93 = () => import("./communication-jTBt55Q9.mjs");
var Route$93 = createFileRoute("/dashboard/recruitment/communication")({
	head: () => ({ meta: [{ title: "Candidate Communication — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$93, "component")
});
var $$splitComponentImporter$92 = () => import("./career-site-B_F230ti.mjs");
var Route$92 = createFileRoute("/dashboard/recruitment/career-site")({
	head: () => ({ meta: [{ title: "Career Site — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$92, "component")
});
var $$splitComponentImporter$91 = () => import("./candidates-W3Aoi1q8.mjs");
var Route$91 = createFileRoute("/dashboard/recruitment/candidates")({
	head: () => ({ meta: [{ title: "Candidates — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$91, "component")
});
var $$splitComponentImporter$90 = () => import("./calendar-BXXfrtua.mjs");
var Route$90 = createFileRoute("/dashboard/recruitment/calendar")({
	head: () => ({ meta: [{ title: "Calendar — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$90, "component")
});
var $$splitComponentImporter$89 = () => import("./automation-QeEeX4lm.mjs");
var Route$89 = createFileRoute("/dashboard/recruitment/automation")({
	head: () => ({ meta: [{ title: "Automation — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$89, "component")
});
var $$splitComponentImporter$88 = () => import("./analytics-Cck54W4T.mjs");
var Route$88 = createFileRoute("/dashboard/recruitment/analytics")({
	head: () => ({ meta: [{ title: "Analytics — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$88, "component")
});
var $$splitComponentImporter$87 = () => import("./ai-screening-BNyZR4Rn.mjs");
var Route$87 = createFileRoute("/dashboard/recruitment/ai-screening")({
	head: () => ({ meta: [{ title: "AI Resume Screening — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$87, "component")
});
var $$splitComponentImporter$86 = () => import("./ai-interview-CMl-HPsQ.mjs");
var Route$86 = createFileRoute("/dashboard/recruitment/ai-interview")({
	head: () => ({ meta: [{ title: "AI Interview & Integrity — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$86, "component")
});
var $$splitComponentImporter$85 = () => import("./ai-B6rUWVze.mjs");
var Route$85 = createFileRoute("/dashboard/recruitment/ai")({
	head: () => ({ meta: [{ title: "AI — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$85, "component")
});
var $$splitComponentImporter$84 = () => import("./dashboard.payroll.variable-inputs-BsTcUjpP.mjs");
var Route$84 = createFileRoute("/dashboard/payroll/variable-inputs")({
	head: () => ({ meta: [{ title: "Variable Payroll Inputs & Adjustments — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$84, "component")
});
var $$splitComponentImporter$83 = () => import("./dashboard.payroll.statutory-CEbXFcUT.mjs");
var Route$83 = createFileRoute("/dashboard/payroll/statutory")({
	head: () => ({ meta: [{ title: "Statutory Compliance & Government Returns — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$83, "component")
});
var $$splitComponentImporter$82 = () => import("./dashboard.payroll.salary-structure-BZK7dRb6.mjs");
var Route$82 = createFileRoute("/dashboard/payroll/salary-structure")({
	head: () => ({ meta: [{ title: "Salary Structures & Component Master — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$82, "component")
});
var $$splitComponentImporter$81 = () => import("./dashboard.payroll.reports-DbRwYSh0.mjs");
var Route$81 = createFileRoute("/dashboard/payroll/reports")({
	head: () => ({ meta: [{ title: "Payroll Reports & Exports — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$81, "component")
});
var $$splitComponentImporter$80 = () => import("./dashboard.payroll.periods-Cz6qQOrL.mjs");
var Route$80 = createFileRoute("/dashboard/payroll/periods")({
	head: () => ({ meta: [{ title: "Payroll Periods — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$80, "component")
});
var $$splitComponentImporter$79 = () => import("./dashboard.payroll.payslips-BvwIbE9F.mjs");
var Route$79 = createFileRoute("/dashboard/payroll/payslips")({
	head: () => ({ meta: [{ title: "My Payslips & Salary Statements — OFC360" }, {
		name: "description",
		content: "View, print, and download official finalized salary payslips."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$79, "component")
});
var $$splitComponentImporter$78 = () => import("./dashboard.payroll.payments-Br2kCWt1.mjs");
var Route$78 = createFileRoute("/dashboard/payroll/payments")({
	head: () => ({ meta: [{ title: "Salary Payments & Disbursements — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$78, "component")
});
var $$splitComponentImporter$77 = () => import("./dashboard.payroll.full-and-final-CfX0A1Sd.mjs");
var Route$77 = createFileRoute("/dashboard/payroll/full-and-final")({
	head: () => ({ meta: [{ title: "Full & Final (F&F) Settlement — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$77, "component")
});
var $$splitComponentImporter$76 = () => import("./dashboard.payroll.compensation-ZydZWXwY.mjs");
var Route$76 = createFileRoute("/dashboard/payroll/compensation")({
	head: () => ({ meta: [{ title: "Employee Compensation & Revisions — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$76, "component")
});
var $$splitComponentImporter$75 = () => import("./dashboard.hr-operations.visitor-management-CVDPojGy.mjs");
var Route$75 = createFileRoute("/dashboard/hr-operations/visitor-management")({
	head: () => ({ meta: [{ title: "Visitor Management — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$75, "component")
});
var $$splitComponentImporter$74 = () => import("./dashboard.hr-operations.timeline-yKxPgVEt.mjs");
var Route$74 = createFileRoute("/dashboard/hr-operations/timeline")({
	head: () => ({ meta: [{ title: "Timeline — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$74, "component")
});
var $$splitComponentImporter$73 = () => import("./dashboard.hr-operations.onboarding-LOaqn5JJ.mjs");
var Route$73 = createFileRoute("/dashboard/hr-operations/onboarding")({
	head: () => ({ meta: [{ title: "Onboarding Checklist — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$73, "component")
});
var $$splitComponentImporter$72 = () => import("./dashboard.hr-operations.offboarding-D2Z77NCq.mjs");
var Route$72 = createFileRoute("/dashboard/hr-operations/offboarding")({
	head: () => ({ meta: [{ title: "Offboarding — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$72, "component")
});
var $$splitComponentImporter$71 = () => import("./dashboard.hr-operations.exit-management-Cd7BUztX.mjs");
var Route$71 = createFileRoute("/dashboard/hr-operations/exit-management")({
	head: () => ({ meta: [{ title: "Exit Management — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$71, "component")
});
var $$splitComponentImporter$70 = () => import("./dashboard.hr-operations.command-center-BGy0-I4c.mjs");
var Route$70 = createFileRoute("/dashboard/hr-operations/command-center")({
	head: () => ({ meta: [{ title: "HR Ops Command Center — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$70, "component")
});
var $$splitComponentImporter$69 = () => import("./dashboard.executive.cto-D0DHAQc9.mjs");
var Route$69 = createFileRoute("/dashboard/executive/cto")({ component: lazyRouteComponent($$splitComponentImporter$69, "component") });
var $$splitComponentImporter$68 = () => import("./dashboard.executive.coo-eykGlAKb.mjs");
var Route$68 = createFileRoute("/dashboard/executive/coo")({
	head: () => ({ meta: [{ title: "COO Dashboard — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$68, "component")
});
var $$splitComponentImporter$67 = () => import("./dashboard.executive.cmo-qPQSj0NP.mjs");
var Route$67 = createFileRoute("/dashboard/executive/cmo")({
	head: () => ({ meta: [{ title: "CMO Dashboard — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$67, "component")
});
var $$splitComponentImporter$66 = () => import("./dashboard.executive.cio-DvEhdVSm.mjs");
var Route$66 = createFileRoute("/dashboard/executive/cio")({ component: lazyRouteComponent($$splitComponentImporter$66, "component") });
var $$splitComponentImporter$65 = () => import("./dashboard.executive.cfo-B56Fic8A.mjs");
var Route$65 = createFileRoute("/dashboard/executive/cfo")({
	head: () => ({ meta: [{ title: "CFO Dashboard — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$65, "component")
});
var $$splitComponentImporter$64 = () => import("./dashboard.executive.ceo-BdtV-eI4.mjs");
var Route$64 = createFileRoute("/dashboard/executive/ceo")({ component: lazyRouteComponent($$splitComponentImporter$64, "component") });
var $$splitComponentImporter$63 = () => import("./dashboard.employee.payroll-DIGMK_Fh.mjs");
var Route$63 = createFileRoute("/dashboard/employee/payroll")({
	head: () => ({ meta: [{ title: "My Payroll & Payslips — OFC360" }, {
		name: "description",
		content: "Employee self-service payroll portal — view salary, download payslips, and review tax declarations."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$63, "component")
});
var $$splitComponentImporter$62 = () => import("./dashboard.attendance.shifts-Bh0kB6TS.mjs");
var Route$62 = createFileRoute("/dashboard/attendance/shifts")({
	head: () => ({ meta: [{ title: "Shifts Management — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$62, "component")
});
var $$splitComponentImporter$61 = () => import("./dashboard.attendance.rosters-DUTxuhbX.mjs");
var Route$61 = createFileRoute("/dashboard/attendance/rosters")({
	head: () => ({ meta: [{ title: "Rosters — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$61, "component")
});
var $$splitComponentImporter$60 = () => import("./dashboard.attendance.holidays-DIxuosqk.mjs");
var Route$60 = createFileRoute("/dashboard/attendance/holidays")({
	head: () => ({ meta: [{ title: "Holidays — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$60, "component")
});
var $$splitComponentImporter$59 = () => import("./dashboard.attendance.checkin-CR6iILcJ.mjs");
var Route$59 = createFileRoute("/dashboard/attendance/checkin")({
	head: () => ({ meta: [{ title: "Check In / Check Out — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$59, "component")
});
var $$splitComponentImporter$58 = () => import("./dashboard.analytics.reports-SghfKaI_.mjs");
var Route$58 = createFileRoute("/dashboard/analytics/reports")({
	head: () => ({ meta: [{ title: "Reports — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$58, "component")
});
var $$splitComponentImporter$57 = () => import("./dashboard.analytics.ai-insights-ImvEaKZL.mjs");
var Route$57 = createFileRoute("/dashboard/analytics/ai-insights")({
	head: () => ({ meta: [{ title: "AI Insights — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$57, "component")
});
var $$splitComponentImporter$56 = () => import("./dashboard.ai-hub.document-generator-CQwfhqBV.mjs");
var Route$56 = createFileRoute("/dashboard/ai-hub/document-generator")({
	head: () => ({ meta: [{ title: "Document Generator — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$56, "component")
});
var $$splitComponentImporter$55 = () => import("./dashboard.ai-hub.automation-Cxcr5upW.mjs");
var Route$55 = createFileRoute("/dashboard/ai-hub/automation")({
	head: () => ({ meta: [{ title: "AI Automation — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$55, "component")
});
var $$splitComponentImporter$54 = () => import("./dashboard.ai-hub.assistant-nxwpu294.mjs");
var Route$54 = createFileRoute("/dashboard/ai-hub/assistant")({
	head: () => ({ meta: [{ title: "Chat Assistant — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$54, "component")
});
var $$splitComponentImporter$53 = () => import("./jobs-CnfHx9pl.mjs");
var Route$53 = createFileRoute("/dashboard/recruitment/jobs/")({
	head: () => ({ meta: [{ title: "Jobs — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$53, "component")
});
var $$splitComponentImporter$52 = () => import("./candidates-By1tFqxa.mjs");
var Route$52 = createFileRoute("/dashboard/recruitment/candidates/")({
	head: () => ({ meta: [{ title: "Candidates — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$52, "component")
});
var $$splitComponentImporter$51 = () => import("./dashboard.executive.cto.index-N8QvMGYq.mjs");
var Route$51 = createFileRoute("/dashboard/executive/cto/")({
	head: () => ({ meta: [{ title: "CTO Executive Control Center — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$51, "component")
});
var $$splitComponentImporter$50 = () => import("./dashboard.executive.cio.index-BXswp69e.mjs");
var Route$50 = createFileRoute("/dashboard/executive/cio/")({
	head: () => ({ meta: [{ title: "CIO IT Executive Hub — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$50, "component")
});
var $$splitComponentImporter$49 = () => import("./dashboard.executive.ceo.index-BvVRdUD-.mjs");
var Route$49 = createFileRoute("/dashboard/executive/ceo/")({
	head: () => ({ meta: [{ title: "CEO Executive Control Center — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$49, "component")
});
var $$splitComponentImporter$48 = () => import("./payroll.runs._runId.validation-BKFHxfdL.mjs");
var Route$48 = createFileRoute("/payroll/runs/$runId/validation")({
	head: () => ({ meta: [{ title: "Payroll Validation & Issues — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$48, "component")
});
var $$splitComponentImporter$47 = () => import("./payroll.runs._runId.review-DOewT626.mjs");
var Route$47 = createFileRoute("/payroll/runs/$runId/review")({
	head: () => ({ meta: [{ title: "Payroll Review & Approval — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$47, "component")
});
var $$splitComponentImporter$46 = () => import("./payroll.runs._runId.processing-DsZvy01k.mjs");
var Route$46 = createFileRoute("/payroll/runs/$runId/processing")({
	head: () => ({ meta: [{ title: "Payroll Processing — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$46, "component")
});
var $$splitComponentImporter$45 = () => import("./payroll.runs._runId.preview-DczGHMrg.mjs");
var Route$45 = createFileRoute("/payroll/runs/$runId/preview")({
	head: () => ({ meta: [{ title: "Payroll Preview — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$45, "component")
});
var $$splitComponentImporter$44 = () => import("./payroll.runs._runId.finalize-BpnNlITw.mjs");
var Route$44 = createFileRoute("/payroll/runs/$runId/finalize")({
	head: () => ({ meta: [{ title: "Payroll Finalization — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$44, "component")
});
var $$splitComponentImporter$43 = () => import("./payroll.runs._runId.approval-NKqNKVSV.mjs");
var Route$43 = createFileRoute("/payroll/runs/$runId/approval")({
	head: () => ({ meta: [{ title: "Payroll Review & Approval — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$43, "component")
});
var $$splitComponentImporter$42 = () => import("./new-Dqe2ToOt.mjs");
var Route$42 = createFileRoute("/dashboard/recruitment/jobs/new")({
	head: () => ({ meta: [{ title: "New Job — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$42, "component")
});
var $$splitComponentImporter$41 = () => import("../_jobId-DwCRAPjA.mjs");
var Route$41 = createFileRoute("/dashboard/recruitment/jobs/$jobId")({
	head: () => ({ meta: [{ title: "Job Detail — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$41, "component")
});
var $$splitComponentImporter$40 = () => import("../_candidateId-Dbx72VMR.mjs");
var Route$40 = createFileRoute("/dashboard/recruitment/candidates/$candidateId")({
	head: () => ({ meta: [{ title: "Candidate Profile — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$40, "component")
});
var $$splitComponentImporter$39 = () => import("./dashboard.payroll.payments._batchId-DVgco1lM.mjs");
var Route$39 = createFileRoute("/dashboard/payroll/payments/$batchId")({
	head: () => ({ meta: [{ title: "Payment Batch Details & Reconciliation — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$39, "component")
});
var $$splitComponentImporter$38 = () => import("./dashboard.executive.cto.settings-BX5DSOrq.mjs");
var Route$38 = createFileRoute("/dashboard/executive/cto/settings")({
	head: () => ({ meta: [{ title: "CTO Settings — OFC360 CTO" }] }),
	component: lazyRouteComponent($$splitComponentImporter$38, "component")
});
var $$splitComponentImporter$37 = () => import("./dashboard.executive.cto.security-BDRS4xl5.mjs");
var Route$37 = createFileRoute("/dashboard/executive/cto/security")({
	head: () => ({ meta: [{ title: "Security Center — OFC360 CTO" }] }),
	component: lazyRouteComponent($$splitComponentImporter$37, "component")
});
var $$splitComponentImporter$36 = () => import("./dashboard.executive.cto.projects-C6EozQ41.mjs");
var Route$36 = createFileRoute("/dashboard/executive/cto/projects")({
	head: () => ({ meta: [{ title: "Project Portfolio — OFC360 CTO" }] }),
	component: lazyRouteComponent($$splitComponentImporter$36, "component")
});
var $$splitComponentImporter$35 = () => import("./dashboard.executive.cto.monitoring-BDGSAVeQ.mjs");
var Route$35 = createFileRoute("/dashboard/executive/cto/monitoring")({
	head: () => ({ meta: [{ title: "Monitoring & Observability — OFC360 CTO" }] }),
	component: lazyRouteComponent($$splitComponentImporter$35, "component")
});
var $$splitComponentImporter$34 = () => import("./dashboard.executive.cto.infrastructure-B17oxXKF.mjs");
var Route$34 = createFileRoute("/dashboard/executive/cto/infrastructure")({
	head: () => ({ meta: [{ title: "Infrastructure Hub — OFC360 CTO" }] }),
	component: lazyRouteComponent($$splitComponentImporter$34, "component")
});
var $$splitComponentImporter$33 = () => import("./dashboard.executive.cto.engineering-DzTxWwwu.mjs");
var Route$33 = createFileRoute("/dashboard/executive/cto/engineering")({
	head: () => ({ meta: [{ title: "Engineering Hub — OFC360 CTO" }] }),
	component: lazyRouteComponent($$splitComponentImporter$33, "component")
});
var $$splitComponentImporter$32 = () => import("./dashboard.executive.cto.devops-DR1Tu26W.mjs");
var Route$32 = createFileRoute("/dashboard/executive/cto/devops")({
	head: () => ({ meta: [{ title: "DevOps & CI/CD Hub — OFC360 CTO" }] }),
	component: lazyRouteComponent($$splitComponentImporter$32, "component")
});
var $$splitComponentImporter$31 = () => import("./dashboard.executive.cto.developers-BLS_q9sP.mjs");
var Route$31 = createFileRoute("/dashboard/executive/cto/developers")({
	head: () => ({ meta: [{ title: "Developers Directory — OFC360 CTO" }] }),
	component: lazyRouteComponent($$splitComponentImporter$31, "component")
});
var $$splitComponentImporter$30 = () => import("./dashboard.executive.cto.database-B0TlWveu.mjs");
var Route$30 = createFileRoute("/dashboard/executive/cto/database")({
	head: () => ({ meta: [{ title: "Database Hub — OFC360 CTO" }] }),
	component: lazyRouteComponent($$splitComponentImporter$30, "component")
});
var $$splitComponentImporter$29 = () => import("./dashboard.executive.cto.analytics-CqFkkBq0.mjs");
var Route$29 = createFileRoute("/dashboard/executive/cto/analytics")({
	head: () => ({ meta: [{ title: "Engineering Analytics — OFC360 CTO" }] }),
	component: lazyRouteComponent($$splitComponentImporter$29, "component")
});
var $$splitComponentImporter$28 = () => import("./dashboard.executive.cto.ai-0WpwDfF2.mjs");
var Route$28 = createFileRoute("/dashboard/executive/cto/ai")({
	head: () => ({ meta: [{ title: "AI & LLM Platform — OFC360 CTO" }] }),
	component: lazyRouteComponent($$splitComponentImporter$28, "component")
});
var $$splitComponentImporter$27 = () => import("./dashboard.executive.cio.settings-BdpqH2HL.mjs");
var Route$27 = createFileRoute("/dashboard/executive/cio/settings")({
	head: () => ({ meta: [{ title: "Enterprise IT Settings — CIO Portal" }] }),
	component: lazyRouteComponent($$splitComponentImporter$27, "component")
});
var $$splitComponentImporter$26 = () => import("./dashboard.executive.cio.it-operations-B9cqm1UA.mjs");
var Route$26 = createFileRoute("/dashboard/executive/cio/it-operations")({
	head: () => ({ meta: [{ title: "IT Operations — CIO Portal" }] }),
	component: lazyRouteComponent($$splitComponentImporter$26, "component")
});
var $$splitComponentImporter$25 = () => import("./dashboard.executive.cio.it-governance-D5Ql-vK_.mjs");
var Route$25 = createFileRoute("/dashboard/executive/cio/it-governance")({
	head: () => ({ meta: [{ title: "IT Governance — CIO Portal" }] }),
	component: lazyRouteComponent($$splitComponentImporter$25, "component")
});
var $$splitComponentImporter$24 = () => import("./dashboard.executive.cio.infrastructure-dqIjYs30.mjs");
var Route$24 = createFileRoute("/dashboard/executive/cio/infrastructure")({
	head: () => ({ meta: [{ title: "Infrastructure — CIO Portal" }] }),
	component: lazyRouteComponent($$splitComponentImporter$24, "component")
});
var $$splitComponentImporter$23 = () => import("./dashboard.executive.cio.digital-transformation-BIkffAC7.mjs");
var Route$23 = createFileRoute("/dashboard/executive/cio/digital-transformation")({
	head: () => ({ meta: [{ title: "Digital Transformation — CIO Portal" }] }),
	component: lazyRouteComponent($$splitComponentImporter$23, "component")
});
var $$splitComponentImporter$22 = () => import("./dashboard.executive.cio.cyber-security-CglqE2Dh.mjs");
var Route$22 = createFileRoute("/dashboard/executive/cio/cyber-security")({
	head: () => ({ meta: [{ title: "Cyber Security — CIO Portal" }] }),
	component: lazyRouteComponent($$splitComponentImporter$22, "component")
});
var $$splitComponentImporter$21 = () => import("./dashboard.executive.cio.cloud-network-KvKTqocY.mjs");
var Route$21 = createFileRoute("/dashboard/executive/cio/cloud-network")({
	head: () => ({ meta: [{ title: "Cloud & Network — CIO Portal" }] }),
	component: lazyRouteComponent($$splitComponentImporter$21, "component")
});
var $$splitComponentImporter$20 = () => import("./dashboard.executive.cio.analytics-C2KNLkh1.mjs");
var Route$20 = createFileRoute("/dashboard/executive/cio/analytics")({
	head: () => ({ meta: [{ title: "IT Analytics — CIO Portal" }] }),
	component: lazyRouteComponent($$splitComponentImporter$20, "component")
});
var $$splitComponentImporter$19 = () => import("./dashboard.executive.ceo.settings-BEs97B-F.mjs");
var Route$19 = createFileRoute("/dashboard/executive/ceo/settings")({
	head: () => ({ meta: [{ title: "CEO Corporate Settings — CEO Portal" }] }),
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
var $$splitComponentImporter$18 = () => import("./dashboard.executive.ceo.sales-skTMU2DV.mjs");
var Route$18 = createFileRoute("/dashboard/executive/ceo/sales")({
	head: () => ({ meta: [{ title: "Sales & Revenue Engine — CEO Portal" }] }),
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
var $$splitComponentImporter$17 = () => import("./dashboard.executive.ceo.reports-C6WUtzB4.mjs");
var Route$17 = createFileRoute("/dashboard/executive/ceo/reports")({
	head: () => ({ meta: [{ title: "Executive Reports — CEO Portal" }] }),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("./dashboard.executive.ceo.organization-k0L_Dho7.mjs");
var Route$16 = createFileRoute("/dashboard/executive/ceo/organization")({
	head: () => ({ meta: [{ title: "Organization & Headcount — CEO Portal" }] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./dashboard.executive.ceo.operations-DX5arwSQ.mjs");
var Route$15 = createFileRoute("/dashboard/executive/ceo/operations")({
	head: () => ({ meta: [{ title: "Business Operations — CEO Portal" }] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./dashboard.executive.ceo.finance-BEksqD4h.mjs");
var Route$14 = createFileRoute("/dashboard/executive/ceo/finance")({
	head: () => ({ meta: [{ title: "Corporate Finance — CEO Portal" }] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./dashboard.executive.ceo.business-DKHhkiE9.mjs");
var Route$13 = createFileRoute("/dashboard/executive/ceo/business")({
	head: () => ({ meta: [{ title: "Business Strategy — CEO Portal" }] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./dashboard.executive.ceo.ai-insights-Dvbwrxz-.mjs");
var Route$12 = createFileRoute("/dashboard/executive/ceo/ai-insights")({
	head: () => ({ meta: [{ title: "Executive AI Intelligence — CEO Portal" }] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./payroll.runs._runId.employee._employeeId-BdoNTl99.mjs");
var Route$11 = createFileRoute("/payroll/runs/$runId/employee/$employeeId")({
	head: () => ({ meta: [{ title: "Employee Payroll Detail — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./publish-BTnZnsRE.mjs");
var Route$10 = createFileRoute("/dashboard/recruitment/jobs/$jobId/publish")({
	head: () => ({ meta: [{ title: "Publish Job — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./dashboard.payroll.runs._runId.validation-C5034U4O.mjs");
var Route$9 = createFileRoute("/dashboard/payroll/runs/$runId/validation")({
	head: () => ({ meta: [{ title: "Payroll Validation & Issues — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./dashboard.payroll.runs._runId.review-IBuaT6bT.mjs");
var Route$8 = createFileRoute("/dashboard/payroll/runs/$runId/review")({
	head: () => ({ meta: [{ title: "Payroll Review & Approval — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./dashboard.payroll.runs._runId.processing-C0OVYDJW.mjs");
var Route$7 = createFileRoute("/dashboard/payroll/runs/$runId/processing")({
	head: () => ({ meta: [{ title: "Payroll Processing — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./dashboard.payroll.runs._runId.preview-BS-l0hVP.mjs");
var Route$6 = createFileRoute("/dashboard/payroll/runs/$runId/preview")({
	head: () => ({ meta: [{ title: "Payroll Preview — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./dashboard.payroll.runs._runId.payment-glbaCUpC.mjs");
var Route$5 = createFileRoute("/dashboard/payroll/runs/$runId/payment")({
	head: () => ({ meta: [{ title: "Payroll Payment & Disbursement — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./dashboard.payroll.runs._runId.finalize-s7HtfW6g.mjs");
var Route$4 = createFileRoute("/dashboard/payroll/runs/$runId/finalize")({
	head: () => ({ meta: [{ title: "Payroll Finalization — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./dashboard.payroll.runs._runId.approval-DaacXR0H.mjs");
var Route$3 = createFileRoute("/dashboard/payroll/runs/$runId/approval")({
	head: () => ({ meta: [{ title: "Payroll Review & Approval — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./payroll.runs._runId.employee._employeeId.payslip-BEp3S1pK.mjs");
var Route$2 = createFileRoute("/payroll/runs/$runId/employee/$employeeId/payslip")({
	head: () => ({ meta: [{ title: "Final Payslip — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./dashboard.payroll.runs._runId.employees._employeeId-D2-wsFj2.mjs");
var Route$1 = createFileRoute("/dashboard/payroll/runs/$runId/employees/$employeeId")({
	head: () => ({ meta: [{ title: "Employee Payroll Detail — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./dashboard.payroll.runs._runId.employees._employeeId.payslip-B9-Q85IG.mjs");
var Route = createFileRoute("/dashboard/payroll/runs/$runId/employees/$employeeId/payslip")({
	head: () => ({ meta: [{ title: "Final Payslip — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var VerifyResetOtpRoute = Route$244.update({
	id: "/verify-reset-otp",
	path: "/verify-reset-otp",
	getParentRoute: () => Route$245
});
var VerifyEmailRoute = Route$243.update({
	id: "/verify-email",
	path: "/verify-email",
	getParentRoute: () => Route$245
});
var TermsRoute = Route$242.update({
	id: "/terms",
	path: "/terms",
	getParentRoute: () => Route$245
});
var SitemapDotxmlRoute = Route$241.update({
	id: "/sitemap.xml",
	path: "/sitemap.xml",
	getParentRoute: () => Route$245
});
var ResetPasswordRoute = Route$240.update({
	id: "/reset-password",
	path: "/reset-password",
	getParentRoute: () => Route$245
});
var RegisterRoute = Route$239.update({
	id: "/register",
	path: "/register",
	getParentRoute: () => Route$245
});
var PrivacyRoute = Route$238.update({
	id: "/privacy",
	path: "/privacy",
	getParentRoute: () => Route$245
});
var PricingRoute = Route$237.update({
	id: "/pricing",
	path: "/pricing",
	getParentRoute: () => Route$245
});
var OnboardingRoute = Route$236.update({
	id: "/onboarding",
	path: "/onboarding",
	getParentRoute: () => Route$245
});
var LoginRoute = Route$235.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$245
});
var ForgotPasswordRoute = Route$234.update({
	id: "/forgot-password",
	path: "/forgot-password",
	getParentRoute: () => Route$245
});
var FeaturesRoute = Route$233.update({
	id: "/features",
	path: "/features",
	getParentRoute: () => Route$245
});
var FaqRoute = Route$232.update({
	id: "/faq",
	path: "/faq",
	getParentRoute: () => Route$245
});
var EmployeeOnboardingRoute = Route$231.update({
	id: "/employee-onboarding",
	path: "/employee-onboarding",
	getParentRoute: () => Route$245
});
var DashboardRoute = Route$230.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => Route$245
});
var ContactRoute = Route$229.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$245
});
var BlogRoute = Route$228.update({
	id: "/blog",
	path: "/blog",
	getParentRoute: () => Route$245
});
var AiRoute = Route$227.update({
	id: "/ai",
	path: "/ai",
	getParentRoute: () => Route$245
});
var AboutRoute = Route$226.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => Route$245
});
var IndexRoute = Route$225.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$245
});
var DashboardIndexRoute = Route$224.update({
	id: "/",
	path: "/",
	getParentRoute: () => DashboardRoute
});
var BlogIndexRoute = Route$223.update({
	id: "/",
	path: "/",
	getParentRoute: () => BlogRoute
});
var AiIndexRoute = Route$222.update({
	id: "/",
	path: "/",
	getParentRoute: () => AiRoute
});
var DashboardWorkforceRoute = Route$221.update({
	id: "/workforce",
	path: "/workforce",
	getParentRoute: () => DashboardRoute
});
var DashboardVisitorsRoute = Route$220.update({
	id: "/visitors",
	path: "/visitors",
	getParentRoute: () => DashboardRoute
});
var DashboardTravelRoute = Route$219.update({
	id: "/travel",
	path: "/travel",
	getParentRoute: () => DashboardRoute
});
var DashboardTimesheetsRoute = Route$218.update({
	id: "/timesheets",
	path: "/timesheets",
	getParentRoute: () => DashboardRoute
});
var DashboardTimelineRoute = Route$217.update({
	id: "/timeline",
	path: "/timeline",
	getParentRoute: () => DashboardRoute
});
var DashboardTalentRoute = Route$216.update({
	id: "/talent",
	path: "/talent",
	getParentRoute: () => DashboardRoute
});
var DashboardSuperAdminRoute = Route$215.update({
	id: "/super-admin",
	path: "/super-admin",
	getParentRoute: () => DashboardRoute
});
var DashboardSettingsRoute = Route$214.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => DashboardRoute
});
var DashboardRolesRoute = Route$213.update({
	id: "/roles",
	path: "/roles",
	getParentRoute: () => DashboardRoute
});
var DashboardResourcesRoute = Route$212.update({
	id: "/resources",
	path: "/resources",
	getParentRoute: () => DashboardRoute
});
var DashboardReportsRoute = Route$211.update({
	id: "/reports",
	path: "/reports",
	getParentRoute: () => DashboardRoute
});
var DashboardRecruitmentRoute = Route$210.update({
	id: "/recruitment",
	path: "/recruitment",
	getParentRoute: () => DashboardRoute
});
var DashboardPerformanceRoute = Route$209.update({
	id: "/performance",
	path: "/performance",
	getParentRoute: () => DashboardRoute
});
var DashboardPayrollRoute = Route$208.update({
	id: "/payroll",
	path: "/payroll",
	getParentRoute: () => DashboardRoute
});
var DashboardOnboardingChecklistRoute = Route$207.update({
	id: "/onboarding-checklist",
	path: "/onboarding-checklist",
	getParentRoute: () => DashboardRoute
});
var DashboardOffboardingRoute = Route$206.update({
	id: "/offboarding",
	path: "/offboarding",
	getParentRoute: () => DashboardRoute
});
var DashboardNotificationsRoute = Route$205.update({
	id: "/notifications",
	path: "/notifications",
	getParentRoute: () => DashboardRoute
});
var DashboardManagersRoute = Route$204.update({
	id: "/managers",
	path: "/managers",
	getParentRoute: () => DashboardRoute
});
var DashboardManagerRoute = Route$203.update({
	id: "/manager",
	path: "/manager",
	getParentRoute: () => DashboardRoute
});
var DashboardLeavesRoute = Route$202.update({
	id: "/leaves",
	path: "/leaves",
	getParentRoute: () => DashboardRoute
});
var DashboardItAdminRoute = Route$201.update({
	id: "/it-admin",
	path: "/it-admin",
	getParentRoute: () => DashboardRoute
});
var DashboardHrOpsRoute = Route$200.update({
	id: "/hr-ops",
	path: "/hr-ops",
	getParentRoute: () => DashboardRoute
});
var DashboardHrOperationsRoute = Route$199.update({
	id: "/hr-operations",
	path: "/hr-operations",
	getParentRoute: () => DashboardRoute
});
var DashboardHrRoute = Route$198.update({
	id: "/hr",
	path: "/hr",
	getParentRoute: () => DashboardRoute
});
var DashboardHierarchyRoute = Route$197.update({
	id: "/hierarchy",
	path: "/hierarchy",
	getParentRoute: () => DashboardRoute
});
var DashboardForbiddenRoute = Route$196.update({
	id: "/forbidden",
	path: "/forbidden",
	getParentRoute: () => DashboardRoute
});
var DashboardExpensesRoute = Route$195.update({
	id: "/expenses",
	path: "/expenses",
	getParentRoute: () => DashboardRoute
});
var DashboardExitManagementRoute = Route$194.update({
	id: "/exit-management",
	path: "/exit-management",
	getParentRoute: () => DashboardRoute
});
var DashboardExitRoute = Route$193.update({
	id: "/exit",
	path: "/exit",
	getParentRoute: () => DashboardRoute
});
var DashboardExecutivesRoute = Route$192.update({
	id: "/executives",
	path: "/executives",
	getParentRoute: () => DashboardRoute
});
var DashboardEmployeesRoute = Route$191.update({
	id: "/employees",
	path: "/employees",
	getParentRoute: () => DashboardRoute
});
var DashboardEmployeeRoute = Route$190.update({
	id: "/employee",
	path: "/employee",
	getParentRoute: () => DashboardRoute
});
var DashboardDocumentsRoute = Route$189.update({
	id: "/documents",
	path: "/documents",
	getParentRoute: () => DashboardRoute
});
var DashboardDepartmentsRoute = Route$188.update({
	id: "/departments",
	path: "/departments",
	getParentRoute: () => DashboardRoute
});
var DashboardBillingRoute = Route$187.update({
	id: "/billing",
	path: "/billing",
	getParentRoute: () => DashboardRoute
});
var DashboardAuditLogsRoute = Route$186.update({
	id: "/audit-logs",
	path: "/audit-logs",
	getParentRoute: () => DashboardRoute
});
var DashboardAttendanceRoute = Route$185.update({
	id: "/attendance",
	path: "/attendance",
	getParentRoute: () => DashboardRoute
});
var DashboardAssetsRoute = Route$184.update({
	id: "/assets",
	path: "/assets",
	getParentRoute: () => DashboardRoute
});
var DashboardAssetManagementRoute = Route$183.update({
	id: "/asset-management",
	path: "/asset-management",
	getParentRoute: () => DashboardRoute
});
var DashboardAnalyticsRoute = Route$182.update({
	id: "/analytics",
	path: "/analytics",
	getParentRoute: () => DashboardRoute
});
var DashboardAiInsightsRoute = Route$181.update({
	id: "/ai-insights",
	path: "/ai-insights",
	getParentRoute: () => DashboardRoute
});
var DashboardAiHubRoute = Route$180.update({
	id: "/ai-hub",
	path: "/ai-hub",
	getParentRoute: () => DashboardRoute
});
var BlogSlugRoute = Route$246.update({
	id: "/$slug",
	path: "/$slug",
	getParentRoute: () => BlogRoute
});
var AuthVerifyResetOtpRoute = Route$179.update({
	id: "/auth/verify-reset-otp",
	path: "/auth/verify-reset-otp",
	getParentRoute: () => Route$245
});
var AuthVerifyEmailRoute = Route$178.update({
	id: "/auth/verify-email",
	path: "/auth/verify-email",
	getParentRoute: () => Route$245
});
var AuthResetPasswordRoute = Route$177.update({
	id: "/auth/reset-password",
	path: "/auth/reset-password",
	getParentRoute: () => Route$245
});
var AuthRegisterRoute = Route$176.update({
	id: "/auth/register",
	path: "/auth/register",
	getParentRoute: () => Route$245
});
var AuthLoginRoute = Route$175.update({
	id: "/auth/login",
	path: "/auth/login",
	getParentRoute: () => Route$245
});
var AuthForgotPasswordRoute = Route$174.update({
	id: "/auth/forgot-password",
	path: "/auth/forgot-password",
	getParentRoute: () => Route$245
});
var ApiAiBrainRoute = Route$173.update({
	id: "/api/ai-brain",
	path: "/api/ai-brain",
	getParentRoute: () => Route$245
});
var AiWorkforcePlanningRoute = Route$172.update({
	id: "/workforce-planning",
	path: "/workforce-planning",
	getParentRoute: () => AiRoute
});
var AiWorkforceInsightsRoute = Route$171.update({
	id: "/workforce-insights",
	path: "/workforce-insights",
	getParentRoute: () => AiRoute
});
var AiRecruiterRoute = Route$170.update({
	id: "/recruiter",
	path: "/recruiter",
	getParentRoute: () => AiRoute
});
var AiPolicyAssistantRoute = Route$169.update({
	id: "/policy-assistant",
	path: "/policy-assistant",
	getParentRoute: () => AiRoute
});
var AiPerformanceCoachRoute = Route$168.update({
	id: "/performance-coach",
	path: "/performance-coach",
	getParentRoute: () => AiRoute
});
var AiMeetingIntelligenceRoute = Route$167.update({
	id: "/meeting-intelligence",
	path: "/meeting-intelligence",
	getParentRoute: () => AiRoute
});
var AiLeaveAssistantRoute = Route$166.update({
	id: "/leave-assistant",
	path: "/leave-assistant",
	getParentRoute: () => AiRoute
});
var AiEmployeeHealthRoute = Route$165.update({
	id: "/employee-health",
	path: "/employee-health",
	getParentRoute: () => AiRoute
});
var AiDocumentGeneratorRoute = Route$164.update({
	id: "/document-generator",
	path: "/document-generator",
	getParentRoute: () => AiRoute
});
var AiComplianceMonitorRoute = Route$163.update({
	id: "/compliance-monitor",
	path: "/compliance-monitor",
	getParentRoute: () => AiRoute
});
var AiChatAssistantRoute = Route$162.update({
	id: "/chat-assistant",
	path: "/chat-assistant",
	getParentRoute: () => AiRoute
});
var AiBrainRoute = Route$161.update({
	id: "/brain",
	path: "/brain",
	getParentRoute: () => AiRoute
});
var AiAttendanceMonitorRoute = Route$160.update({
	id: "/attendance-monitor",
	path: "/attendance-monitor",
	getParentRoute: () => AiRoute
});
var AiAnalyticsCenterRoute = Route$159.update({
	id: "/analytics-center",
	path: "/analytics-center",
	getParentRoute: () => AiRoute
});
var DashboardWorkforceIndexRoute = Route$158.update({
	id: "/",
	path: "/",
	getParentRoute: () => DashboardWorkforceRoute
});
var DashboardTalentIndexRoute = Route$157.update({
	id: "/",
	path: "/",
	getParentRoute: () => DashboardTalentRoute
});
var DashboardSuperAdminIndexRoute = Route$156.update({
	id: "/",
	path: "/",
	getParentRoute: () => DashboardSuperAdminRoute
});
var DashboardSettingsIndexRoute = Route$155.update({
	id: "/",
	path: "/",
	getParentRoute: () => DashboardSettingsRoute
});
var DashboardResourcesIndexRoute = Route$154.update({
	id: "/",
	path: "/",
	getParentRoute: () => DashboardResourcesRoute
});
var DashboardRecruitmentIndexRoute = Route$153.update({
	id: "/",
	path: "/",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardPeopleIndexRoute = Route$152.update({
	id: "/people/",
	path: "/people/",
	getParentRoute: () => DashboardRoute
});
var DashboardPayrollIndexRoute = Route$151.update({
	id: "/",
	path: "/",
	getParentRoute: () => DashboardPayrollRoute
});
var DashboardHrOperationsIndexRoute = Route$150.update({
	id: "/",
	path: "/",
	getParentRoute: () => DashboardHrOperationsRoute
});
var DashboardExecutiveIndexRoute = Route$149.update({
	id: "/executive/",
	path: "/executive/",
	getParentRoute: () => DashboardRoute
});
var DashboardAttendanceIndexRoute = Route$148.update({
	id: "/",
	path: "/",
	getParentRoute: () => DashboardAttendanceRoute
});
var DashboardAnalyticsIndexRoute = Route$147.update({
	id: "/",
	path: "/",
	getParentRoute: () => DashboardAnalyticsRoute
});
var DashboardAiHubIndexRoute = Route$146.update({
	id: "/",
	path: "/",
	getParentRoute: () => DashboardAiHubRoute
});
var JobsApplyUkeyRoute = Route$145.update({
	id: "/jobs/apply/$ukey",
	path: "/jobs/apply/$ukey",
	getParentRoute: () => Route$245
});
var DashboardWorkforceTimesheetsRoute = Route$144.update({
	id: "/timesheets",
	path: "/timesheets",
	getParentRoute: () => DashboardWorkforceRoute
});
var DashboardWorkforcePeopleRoute = Route$143.update({
	id: "/people",
	path: "/people",
	getParentRoute: () => DashboardWorkforceRoute
});
var DashboardWorkforceLeavesRoute = Route$142.update({
	id: "/leaves",
	path: "/leaves",
	getParentRoute: () => DashboardWorkforceRoute
});
var DashboardWorkforceDepartmentsRoute = Route$141.update({
	id: "/departments",
	path: "/departments",
	getParentRoute: () => DashboardWorkforceRoute
});
var DashboardWorkforceAttendanceRoute = Route$140.update({
	id: "/attendance",
	path: "/attendance",
	getParentRoute: () => DashboardWorkforceRoute
});
var DashboardTalentRecruitmentRoute = Route$139.update({
	id: "/recruitment",
	path: "/recruitment",
	getParentRoute: () => DashboardTalentRoute
});
var DashboardTalentPerformanceRoute = Route$138.update({
	id: "/performance",
	path: "/performance",
	getParentRoute: () => DashboardTalentRoute
});
var DashboardSuperAdminUsersRoute = Route$137.update({
	id: "/users",
	path: "/users",
	getParentRoute: () => DashboardSuperAdminRoute
});
var DashboardSuperAdminSettingsRoute = Route$136.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => DashboardSuperAdminRoute
});
var DashboardSuperAdminPlatformConfigRoute = Route$135.update({
	id: "/platform-config",
	path: "/platform-config",
	getParentRoute: () => DashboardSuperAdminRoute
});
var DashboardSuperAdminOrganizationsRoute = Route$134.update({
	id: "/organizations",
	path: "/organizations",
	getParentRoute: () => DashboardSuperAdminRoute
});
var DashboardSuperAdminAuditLogsRoute = Route$133.update({
	id: "/audit-logs",
	path: "/audit-logs",
	getParentRoute: () => DashboardSuperAdminRoute
});
var DashboardSuperAdminAnalyticsRoute = Route$132.update({
	id: "/analytics",
	path: "/analytics",
	getParentRoute: () => DashboardSuperAdminRoute
});
var DashboardSuperAdminActivityRoute = Route$131.update({
	id: "/activity",
	path: "/activity",
	getParentRoute: () => DashboardSuperAdminRoute
});
var DashboardSettingsSecurityRoute = Route$130.update({
	id: "/security",
	path: "/security",
	getParentRoute: () => DashboardSettingsRoute
});
var DashboardSettingsRolesPermissionsRoute = Route$129.update({
	id: "/roles-permissions",
	path: "/roles-permissions",
	getParentRoute: () => DashboardSettingsRoute
});
var DashboardSettingsProfileRoute = Route$128.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => DashboardSettingsRoute
});
var DashboardSettingsNotificationsRoute = Route$127.update({
	id: "/notifications",
	path: "/notifications",
	getParentRoute: () => DashboardSettingsRoute
});
var DashboardSettingsIntegrationsRoute = Route$126.update({
	id: "/integrations",
	path: "/integrations",
	getParentRoute: () => DashboardSettingsRoute
});
var DashboardSettingsGeneralRoute = Route$125.update({
	id: "/general",
	path: "/general",
	getParentRoute: () => DashboardSettingsRoute
});
var DashboardSettingsCompanyRoute = Route$124.update({
	id: "/company",
	path: "/company",
	getParentRoute: () => DashboardSettingsRoute
});
var DashboardSettingsBillingRoute = Route$123.update({
	id: "/billing",
	path: "/billing",
	getParentRoute: () => DashboardSettingsRoute
});
var DashboardSettingsAuditLogsRoute = Route$122.update({
	id: "/audit-logs",
	path: "/audit-logs",
	getParentRoute: () => DashboardSettingsRoute
});
var DashboardResourcesDocumentsRoute = Route$121.update({
	id: "/documents",
	path: "/documents",
	getParentRoute: () => DashboardResourcesRoute
});
var DashboardResourcesAssetsRoute = Route$120.update({
	id: "/assets",
	path: "/assets",
	getParentRoute: () => DashboardResourcesRoute
});
var DashboardResourcesAssetManagementRoute = Route$119.update({
	id: "/asset-management",
	path: "/asset-management",
	getParentRoute: () => DashboardResourcesRoute
});
var DashboardRecruitmentWorkforcePlanningRoute = Route$118.update({
	id: "/workforce-planning",
	path: "/workforce-planning",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentVerificationRoute = Route$117.update({
	id: "/verification",
	path: "/verification",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentVendorsRoute = Route$116.update({
	id: "/vendors",
	path: "/vendors",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentTemplatesRoute = Route$115.update({
	id: "/templates",
	path: "/templates",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentTalentPoolRoute = Route$114.update({
	id: "/talent-pool",
	path: "/talent-pool",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentSourcingRoute = Route$113.update({
	id: "/sourcing",
	path: "/sourcing",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentSearchRoute = Route$112.update({
	id: "/search",
	path: "/search",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentScorecardsRoute = Route$111.update({
	id: "/scorecards",
	path: "/scorecards",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentResumeIntelligenceRoute = Route$110.update({
	id: "/resume-intelligence",
	path: "/resume-intelligence",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentRequisitionsRoute = Route$109.update({
	id: "/requisitions",
	path: "/requisitions",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentReportsRoute = Route$108.update({
	id: "/reports",
	path: "/reports",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentReferralsRoute = Route$107.update({
	id: "/referrals",
	path: "/referrals",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentPreboardingRoute = Route$106.update({
	id: "/preboarding",
	path: "/preboarding",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentPipelineRoute = Route$105.update({
	id: "/pipeline",
	path: "/pipeline",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentOnboardingRoute = Route$104.update({
	id: "/onboarding",
	path: "/onboarding",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentOffersRoute = Route$103.update({
	id: "/offers",
	path: "/offers",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentNotificationsRoute = Route$102.update({
	id: "/notifications",
	path: "/notifications",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentKtProbationRoute = Route$101.update({
	id: "/kt-probation",
	path: "/kt-probation",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentInterviewsRoute = Route$100.update({
	id: "/interviews",
	path: "/interviews",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentImportExportRoute = Route$99.update({
	id: "/import-export",
	path: "/import-export",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentHiringManagerRoute = Route$98.update({
	id: "/hiring-manager",
	path: "/hiring-manager",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentEmployeeOnboardingRoute = Route$97.update({
	id: "/employee-onboarding",
	path: "/employee-onboarding",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentCrmRoute = Route$96.update({
	id: "/crm",
	path: "/crm",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentComplianceRoute = Route$95.update({
	id: "/compliance",
	path: "/compliance",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentCompensationRoute = Route$94.update({
	id: "/compensation",
	path: "/compensation",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentCommunicationRoute = Route$93.update({
	id: "/communication",
	path: "/communication",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentCareerSiteRoute = Route$92.update({
	id: "/career-site",
	path: "/career-site",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentCandidatesRoute = Route$91.update({
	id: "/candidates",
	path: "/candidates",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentCalendarRoute = Route$90.update({
	id: "/calendar",
	path: "/calendar",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentAutomationRoute = Route$89.update({
	id: "/automation",
	path: "/automation",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentAnalyticsRoute = Route$88.update({
	id: "/analytics",
	path: "/analytics",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentAiScreeningRoute = Route$87.update({
	id: "/ai-screening",
	path: "/ai-screening",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentAiInterviewRoute = Route$86.update({
	id: "/ai-interview",
	path: "/ai-interview",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentAiRoute = Route$85.update({
	id: "/ai",
	path: "/ai",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardPayrollVariableInputsRoute = Route$84.update({
	id: "/variable-inputs",
	path: "/variable-inputs",
	getParentRoute: () => DashboardPayrollRoute
});
var DashboardPayrollStatutoryRoute = Route$83.update({
	id: "/statutory",
	path: "/statutory",
	getParentRoute: () => DashboardPayrollRoute
});
var DashboardPayrollSalaryStructureRoute = Route$82.update({
	id: "/salary-structure",
	path: "/salary-structure",
	getParentRoute: () => DashboardPayrollRoute
});
var DashboardPayrollReportsRoute = Route$81.update({
	id: "/reports",
	path: "/reports",
	getParentRoute: () => DashboardPayrollRoute
});
var DashboardPayrollPeriodsRoute = Route$80.update({
	id: "/periods",
	path: "/periods",
	getParentRoute: () => DashboardPayrollRoute
});
var DashboardPayrollPayslipsRoute = Route$79.update({
	id: "/payslips",
	path: "/payslips",
	getParentRoute: () => DashboardPayrollRoute
});
var DashboardPayrollPaymentsRoute = Route$78.update({
	id: "/payments",
	path: "/payments",
	getParentRoute: () => DashboardPayrollRoute
});
var DashboardPayrollFullAndFinalRoute = Route$77.update({
	id: "/full-and-final",
	path: "/full-and-final",
	getParentRoute: () => DashboardPayrollRoute
});
var DashboardPayrollCompensationRoute = Route$76.update({
	id: "/compensation",
	path: "/compensation",
	getParentRoute: () => DashboardPayrollRoute
});
var DashboardHrOperationsVisitorManagementRoute = Route$75.update({
	id: "/visitor-management",
	path: "/visitor-management",
	getParentRoute: () => DashboardHrOperationsRoute
});
var DashboardHrOperationsTimelineRoute = Route$74.update({
	id: "/timeline",
	path: "/timeline",
	getParentRoute: () => DashboardHrOperationsRoute
});
var DashboardHrOperationsOnboardingRoute = Route$73.update({
	id: "/onboarding",
	path: "/onboarding",
	getParentRoute: () => DashboardHrOperationsRoute
});
var DashboardHrOperationsOffboardingRoute = Route$72.update({
	id: "/offboarding",
	path: "/offboarding",
	getParentRoute: () => DashboardHrOperationsRoute
});
var DashboardHrOperationsExitManagementRoute = Route$71.update({
	id: "/exit-management",
	path: "/exit-management",
	getParentRoute: () => DashboardHrOperationsRoute
});
var DashboardHrOperationsCommandCenterRoute = Route$70.update({
	id: "/command-center",
	path: "/command-center",
	getParentRoute: () => DashboardHrOperationsRoute
});
var DashboardExecutiveCtoRoute = Route$69.update({
	id: "/executive/cto",
	path: "/executive/cto",
	getParentRoute: () => DashboardRoute
});
var DashboardExecutiveCooRoute = Route$68.update({
	id: "/executive/coo",
	path: "/executive/coo",
	getParentRoute: () => DashboardRoute
});
var DashboardExecutiveCmoRoute = Route$67.update({
	id: "/executive/cmo",
	path: "/executive/cmo",
	getParentRoute: () => DashboardRoute
});
var DashboardExecutiveCioRoute = Route$66.update({
	id: "/executive/cio",
	path: "/executive/cio",
	getParentRoute: () => DashboardRoute
});
var DashboardExecutiveCfoRoute = Route$65.update({
	id: "/executive/cfo",
	path: "/executive/cfo",
	getParentRoute: () => DashboardRoute
});
var DashboardExecutiveCeoRoute = Route$64.update({
	id: "/executive/ceo",
	path: "/executive/ceo",
	getParentRoute: () => DashboardRoute
});
var DashboardEmployeePayrollRoute = Route$63.update({
	id: "/payroll",
	path: "/payroll",
	getParentRoute: () => DashboardEmployeeRoute
});
var DashboardAttendanceShiftsRoute = Route$62.update({
	id: "/shifts",
	path: "/shifts",
	getParentRoute: () => DashboardAttendanceRoute
});
var DashboardAttendanceRostersRoute = Route$61.update({
	id: "/rosters",
	path: "/rosters",
	getParentRoute: () => DashboardAttendanceRoute
});
var DashboardAttendanceHolidaysRoute = Route$60.update({
	id: "/holidays",
	path: "/holidays",
	getParentRoute: () => DashboardAttendanceRoute
});
var DashboardAttendanceCheckinRoute = Route$59.update({
	id: "/checkin",
	path: "/checkin",
	getParentRoute: () => DashboardAttendanceRoute
});
var DashboardAnalyticsReportsRoute = Route$58.update({
	id: "/reports",
	path: "/reports",
	getParentRoute: () => DashboardAnalyticsRoute
});
var DashboardAnalyticsAiInsightsRoute = Route$57.update({
	id: "/ai-insights",
	path: "/ai-insights",
	getParentRoute: () => DashboardAnalyticsRoute
});
var DashboardAiHubDocumentGeneratorRoute = Route$56.update({
	id: "/document-generator",
	path: "/document-generator",
	getParentRoute: () => DashboardAiHubRoute
});
var DashboardAiHubAutomationRoute = Route$55.update({
	id: "/automation",
	path: "/automation",
	getParentRoute: () => DashboardAiHubRoute
});
var DashboardAiHubAssistantRoute = Route$54.update({
	id: "/assistant",
	path: "/assistant",
	getParentRoute: () => DashboardAiHubRoute
});
var DashboardRecruitmentJobsIndexRoute = Route$53.update({
	id: "/jobs/",
	path: "/jobs/",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentCandidatesIndexRoute = Route$52.update({
	id: "/",
	path: "/",
	getParentRoute: () => DashboardRecruitmentCandidatesRoute
});
var DashboardExecutiveCtoIndexRoute = Route$51.update({
	id: "/",
	path: "/",
	getParentRoute: () => DashboardExecutiveCtoRoute
});
var DashboardExecutiveCioIndexRoute = Route$50.update({
	id: "/",
	path: "/",
	getParentRoute: () => DashboardExecutiveCioRoute
});
var DashboardExecutiveCeoIndexRoute = Route$49.update({
	id: "/",
	path: "/",
	getParentRoute: () => DashboardExecutiveCeoRoute
});
var PayrollRunsRunIdValidationRoute = Route$48.update({
	id: "/payroll/runs/$runId/validation",
	path: "/payroll/runs/$runId/validation",
	getParentRoute: () => Route$245
});
var PayrollRunsRunIdReviewRoute = Route$47.update({
	id: "/payroll/runs/$runId/review",
	path: "/payroll/runs/$runId/review",
	getParentRoute: () => Route$245
});
var PayrollRunsRunIdProcessingRoute = Route$46.update({
	id: "/payroll/runs/$runId/processing",
	path: "/payroll/runs/$runId/processing",
	getParentRoute: () => Route$245
});
var PayrollRunsRunIdPreviewRoute = Route$45.update({
	id: "/payroll/runs/$runId/preview",
	path: "/payroll/runs/$runId/preview",
	getParentRoute: () => Route$245
});
var PayrollRunsRunIdFinalizeRoute = Route$44.update({
	id: "/payroll/runs/$runId/finalize",
	path: "/payroll/runs/$runId/finalize",
	getParentRoute: () => Route$245
});
var PayrollRunsRunIdApprovalRoute = Route$43.update({
	id: "/payroll/runs/$runId/approval",
	path: "/payroll/runs/$runId/approval",
	getParentRoute: () => Route$245
});
var DashboardRecruitmentJobsNewRoute = Route$42.update({
	id: "/jobs/new",
	path: "/jobs/new",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentJobsJobIdRoute = Route$41.update({
	id: "/jobs/$jobId",
	path: "/jobs/$jobId",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentCandidatesCandidateIdRoute = Route$40.update({
	id: "/$candidateId",
	path: "/$candidateId",
	getParentRoute: () => DashboardRecruitmentCandidatesRoute
});
var DashboardPayrollPaymentsBatchIdRoute = Route$39.update({
	id: "/$batchId",
	path: "/$batchId",
	getParentRoute: () => DashboardPayrollPaymentsRoute
});
var DashboardExecutiveCtoSettingsRoute = Route$38.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => DashboardExecutiveCtoRoute
});
var DashboardExecutiveCtoSecurityRoute = Route$37.update({
	id: "/security",
	path: "/security",
	getParentRoute: () => DashboardExecutiveCtoRoute
});
var DashboardExecutiveCtoProjectsRoute = Route$36.update({
	id: "/projects",
	path: "/projects",
	getParentRoute: () => DashboardExecutiveCtoRoute
});
var DashboardExecutiveCtoMonitoringRoute = Route$35.update({
	id: "/monitoring",
	path: "/monitoring",
	getParentRoute: () => DashboardExecutiveCtoRoute
});
var DashboardExecutiveCtoInfrastructureRoute = Route$34.update({
	id: "/infrastructure",
	path: "/infrastructure",
	getParentRoute: () => DashboardExecutiveCtoRoute
});
var DashboardExecutiveCtoEngineeringRoute = Route$33.update({
	id: "/engineering",
	path: "/engineering",
	getParentRoute: () => DashboardExecutiveCtoRoute
});
var DashboardExecutiveCtoDevopsRoute = Route$32.update({
	id: "/devops",
	path: "/devops",
	getParentRoute: () => DashboardExecutiveCtoRoute
});
var DashboardExecutiveCtoDevelopersRoute = Route$31.update({
	id: "/developers",
	path: "/developers",
	getParentRoute: () => DashboardExecutiveCtoRoute
});
var DashboardExecutiveCtoDatabaseRoute = Route$30.update({
	id: "/database",
	path: "/database",
	getParentRoute: () => DashboardExecutiveCtoRoute
});
var DashboardExecutiveCtoAnalyticsRoute = Route$29.update({
	id: "/analytics",
	path: "/analytics",
	getParentRoute: () => DashboardExecutiveCtoRoute
});
var DashboardExecutiveCtoAiRoute = Route$28.update({
	id: "/ai",
	path: "/ai",
	getParentRoute: () => DashboardExecutiveCtoRoute
});
var DashboardExecutiveCioSettingsRoute = Route$27.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => DashboardExecutiveCioRoute
});
var DashboardExecutiveCioItOperationsRoute = Route$26.update({
	id: "/it-operations",
	path: "/it-operations",
	getParentRoute: () => DashboardExecutiveCioRoute
});
var DashboardExecutiveCioItGovernanceRoute = Route$25.update({
	id: "/it-governance",
	path: "/it-governance",
	getParentRoute: () => DashboardExecutiveCioRoute
});
var DashboardExecutiveCioInfrastructureRoute = Route$24.update({
	id: "/infrastructure",
	path: "/infrastructure",
	getParentRoute: () => DashboardExecutiveCioRoute
});
var DashboardExecutiveCioDigitalTransformationRoute = Route$23.update({
	id: "/digital-transformation",
	path: "/digital-transformation",
	getParentRoute: () => DashboardExecutiveCioRoute
});
var DashboardExecutiveCioCyberSecurityRoute = Route$22.update({
	id: "/cyber-security",
	path: "/cyber-security",
	getParentRoute: () => DashboardExecutiveCioRoute
});
var DashboardExecutiveCioCloudNetworkRoute = Route$21.update({
	id: "/cloud-network",
	path: "/cloud-network",
	getParentRoute: () => DashboardExecutiveCioRoute
});
var DashboardExecutiveCioAnalyticsRoute = Route$20.update({
	id: "/analytics",
	path: "/analytics",
	getParentRoute: () => DashboardExecutiveCioRoute
});
var DashboardExecutiveCeoSettingsRoute = Route$19.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => DashboardExecutiveCeoRoute
});
var DashboardExecutiveCeoSalesRoute = Route$18.update({
	id: "/sales",
	path: "/sales",
	getParentRoute: () => DashboardExecutiveCeoRoute
});
var DashboardExecutiveCeoReportsRoute = Route$17.update({
	id: "/reports",
	path: "/reports",
	getParentRoute: () => DashboardExecutiveCeoRoute
});
var DashboardExecutiveCeoOrganizationRoute = Route$16.update({
	id: "/organization",
	path: "/organization",
	getParentRoute: () => DashboardExecutiveCeoRoute
});
var DashboardExecutiveCeoOperationsRoute = Route$15.update({
	id: "/operations",
	path: "/operations",
	getParentRoute: () => DashboardExecutiveCeoRoute
});
var DashboardExecutiveCeoFinanceRoute = Route$14.update({
	id: "/finance",
	path: "/finance",
	getParentRoute: () => DashboardExecutiveCeoRoute
});
var DashboardExecutiveCeoBusinessRoute = Route$13.update({
	id: "/business",
	path: "/business",
	getParentRoute: () => DashboardExecutiveCeoRoute
});
var DashboardExecutiveCeoAiInsightsRoute = Route$12.update({
	id: "/ai-insights",
	path: "/ai-insights",
	getParentRoute: () => DashboardExecutiveCeoRoute
});
var PayrollRunsRunIdEmployeeEmployeeIdRoute = Route$11.update({
	id: "/payroll/runs/$runId/employee/$employeeId",
	path: "/payroll/runs/$runId/employee/$employeeId",
	getParentRoute: () => Route$245
});
var DashboardRecruitmentJobsJobIdPublishRoute = Route$10.update({
	id: "/publish",
	path: "/publish",
	getParentRoute: () => DashboardRecruitmentJobsJobIdRoute
});
var DashboardPayrollRunsRunIdValidationRoute = Route$9.update({
	id: "/runs/$runId/validation",
	path: "/runs/$runId/validation",
	getParentRoute: () => DashboardPayrollRoute
});
var DashboardPayrollRunsRunIdReviewRoute = Route$8.update({
	id: "/runs/$runId/review",
	path: "/runs/$runId/review",
	getParentRoute: () => DashboardPayrollRoute
});
var DashboardPayrollRunsRunIdProcessingRoute = Route$7.update({
	id: "/runs/$runId/processing",
	path: "/runs/$runId/processing",
	getParentRoute: () => DashboardPayrollRoute
});
var DashboardPayrollRunsRunIdPreviewRoute = Route$6.update({
	id: "/runs/$runId/preview",
	path: "/runs/$runId/preview",
	getParentRoute: () => DashboardPayrollRoute
});
var DashboardPayrollRunsRunIdPaymentRoute = Route$5.update({
	id: "/runs/$runId/payment",
	path: "/runs/$runId/payment",
	getParentRoute: () => DashboardPayrollRoute
});
var DashboardPayrollRunsRunIdFinalizeRoute = Route$4.update({
	id: "/runs/$runId/finalize",
	path: "/runs/$runId/finalize",
	getParentRoute: () => DashboardPayrollRoute
});
var DashboardPayrollRunsRunIdApprovalRoute = Route$3.update({
	id: "/runs/$runId/approval",
	path: "/runs/$runId/approval",
	getParentRoute: () => DashboardPayrollRoute
});
var PayrollRunsRunIdEmployeeEmployeeIdPayslipRoute = Route$2.update({
	id: "/payslip",
	path: "/payslip",
	getParentRoute: () => PayrollRunsRunIdEmployeeEmployeeIdRoute
});
var DashboardPayrollRunsRunIdEmployeesEmployeeIdRoute = Route$1.update({
	id: "/runs/$runId/employees/$employeeId",
	path: "/runs/$runId/employees/$employeeId",
	getParentRoute: () => DashboardPayrollRoute
});
var DashboardPayrollRunsRunIdEmployeesEmployeeIdPayslipRoute = Route.update({
	id: "/payslip",
	path: "/payslip",
	getParentRoute: () => DashboardPayrollRunsRunIdEmployeesEmployeeIdRoute
});
var AiRouteChildren = {
	AiAnalyticsCenterRoute,
	AiAttendanceMonitorRoute,
	AiBrainRoute,
	AiChatAssistantRoute,
	AiComplianceMonitorRoute,
	AiDocumentGeneratorRoute,
	AiEmployeeHealthRoute,
	AiLeaveAssistantRoute,
	AiMeetingIntelligenceRoute,
	AiPerformanceCoachRoute,
	AiPolicyAssistantRoute,
	AiRecruiterRoute,
	AiWorkforceInsightsRoute,
	AiWorkforcePlanningRoute,
	AiIndexRoute
};
var AiRouteWithChildren = AiRoute._addFileChildren(AiRouteChildren);
var BlogRouteChildren = {
	BlogSlugRoute,
	BlogIndexRoute
};
var BlogRouteWithChildren = BlogRoute._addFileChildren(BlogRouteChildren);
var DashboardAiHubRouteChildren = {
	DashboardAiHubAssistantRoute,
	DashboardAiHubAutomationRoute,
	DashboardAiHubDocumentGeneratorRoute,
	DashboardAiHubIndexRoute
};
var DashboardAiHubRouteWithChildren = DashboardAiHubRoute._addFileChildren(DashboardAiHubRouteChildren);
var DashboardAnalyticsRouteChildren = {
	DashboardAnalyticsAiInsightsRoute,
	DashboardAnalyticsReportsRoute,
	DashboardAnalyticsIndexRoute
};
var DashboardAnalyticsRouteWithChildren = DashboardAnalyticsRoute._addFileChildren(DashboardAnalyticsRouteChildren);
var DashboardAttendanceRouteChildren = {
	DashboardAttendanceCheckinRoute,
	DashboardAttendanceHolidaysRoute,
	DashboardAttendanceRostersRoute,
	DashboardAttendanceShiftsRoute,
	DashboardAttendanceIndexRoute
};
var DashboardAttendanceRouteWithChildren = DashboardAttendanceRoute._addFileChildren(DashboardAttendanceRouteChildren);
var DashboardEmployeeRouteChildren = { DashboardEmployeePayrollRoute };
var DashboardEmployeeRouteWithChildren = DashboardEmployeeRoute._addFileChildren(DashboardEmployeeRouteChildren);
var DashboardHrOperationsRouteChildren = {
	DashboardHrOperationsCommandCenterRoute,
	DashboardHrOperationsExitManagementRoute,
	DashboardHrOperationsOffboardingRoute,
	DashboardHrOperationsOnboardingRoute,
	DashboardHrOperationsTimelineRoute,
	DashboardHrOperationsVisitorManagementRoute,
	DashboardHrOperationsIndexRoute
};
var DashboardHrOperationsRouteWithChildren = DashboardHrOperationsRoute._addFileChildren(DashboardHrOperationsRouteChildren);
var DashboardPayrollPaymentsRouteChildren = { DashboardPayrollPaymentsBatchIdRoute };
var DashboardPayrollPaymentsRouteWithChildren = DashboardPayrollPaymentsRoute._addFileChildren(DashboardPayrollPaymentsRouteChildren);
var DashboardPayrollRunsRunIdEmployeesEmployeeIdRouteChildren = { DashboardPayrollRunsRunIdEmployeesEmployeeIdPayslipRoute };
var DashboardPayrollRouteChildren = {
	DashboardPayrollCompensationRoute,
	DashboardPayrollFullAndFinalRoute,
	DashboardPayrollPaymentsRoute: DashboardPayrollPaymentsRouteWithChildren,
	DashboardPayrollPayslipsRoute,
	DashboardPayrollPeriodsRoute,
	DashboardPayrollReportsRoute,
	DashboardPayrollSalaryStructureRoute,
	DashboardPayrollStatutoryRoute,
	DashboardPayrollVariableInputsRoute,
	DashboardPayrollIndexRoute,
	DashboardPayrollRunsRunIdApprovalRoute,
	DashboardPayrollRunsRunIdFinalizeRoute,
	DashboardPayrollRunsRunIdPaymentRoute,
	DashboardPayrollRunsRunIdPreviewRoute,
	DashboardPayrollRunsRunIdProcessingRoute,
	DashboardPayrollRunsRunIdReviewRoute,
	DashboardPayrollRunsRunIdValidationRoute,
	DashboardPayrollRunsRunIdEmployeesEmployeeIdRoute: DashboardPayrollRunsRunIdEmployeesEmployeeIdRoute._addFileChildren(DashboardPayrollRunsRunIdEmployeesEmployeeIdRouteChildren)
};
var DashboardPayrollRouteWithChildren = DashboardPayrollRoute._addFileChildren(DashboardPayrollRouteChildren);
var DashboardRecruitmentCandidatesRouteChildren = {
	DashboardRecruitmentCandidatesCandidateIdRoute,
	DashboardRecruitmentCandidatesIndexRoute
};
var DashboardRecruitmentCandidatesRouteWithChildren = DashboardRecruitmentCandidatesRoute._addFileChildren(DashboardRecruitmentCandidatesRouteChildren);
var DashboardRecruitmentJobsJobIdRouteChildren = { DashboardRecruitmentJobsJobIdPublishRoute };
var DashboardRecruitmentRouteChildren = {
	DashboardRecruitmentAiRoute,
	DashboardRecruitmentAiInterviewRoute,
	DashboardRecruitmentAiScreeningRoute,
	DashboardRecruitmentAnalyticsRoute,
	DashboardRecruitmentAutomationRoute,
	DashboardRecruitmentCalendarRoute,
	DashboardRecruitmentCandidatesRoute: DashboardRecruitmentCandidatesRouteWithChildren,
	DashboardRecruitmentCareerSiteRoute,
	DashboardRecruitmentCommunicationRoute,
	DashboardRecruitmentCompensationRoute,
	DashboardRecruitmentComplianceRoute,
	DashboardRecruitmentCrmRoute,
	DashboardRecruitmentEmployeeOnboardingRoute,
	DashboardRecruitmentHiringManagerRoute,
	DashboardRecruitmentImportExportRoute,
	DashboardRecruitmentInterviewsRoute,
	DashboardRecruitmentKtProbationRoute,
	DashboardRecruitmentNotificationsRoute,
	DashboardRecruitmentOffersRoute,
	DashboardRecruitmentOnboardingRoute,
	DashboardRecruitmentPipelineRoute,
	DashboardRecruitmentPreboardingRoute,
	DashboardRecruitmentReferralsRoute,
	DashboardRecruitmentReportsRoute,
	DashboardRecruitmentRequisitionsRoute,
	DashboardRecruitmentResumeIntelligenceRoute,
	DashboardRecruitmentScorecardsRoute,
	DashboardRecruitmentSearchRoute,
	DashboardRecruitmentSourcingRoute,
	DashboardRecruitmentTalentPoolRoute,
	DashboardRecruitmentTemplatesRoute,
	DashboardRecruitmentVendorsRoute,
	DashboardRecruitmentVerificationRoute,
	DashboardRecruitmentWorkforcePlanningRoute,
	DashboardRecruitmentIndexRoute,
	DashboardRecruitmentJobsJobIdRoute: DashboardRecruitmentJobsJobIdRoute._addFileChildren(DashboardRecruitmentJobsJobIdRouteChildren),
	DashboardRecruitmentJobsNewRoute,
	DashboardRecruitmentJobsIndexRoute
};
var DashboardRecruitmentRouteWithChildren = DashboardRecruitmentRoute._addFileChildren(DashboardRecruitmentRouteChildren);
var DashboardResourcesRouteChildren = {
	DashboardResourcesAssetManagementRoute,
	DashboardResourcesAssetsRoute,
	DashboardResourcesDocumentsRoute,
	DashboardResourcesIndexRoute
};
var DashboardResourcesRouteWithChildren = DashboardResourcesRoute._addFileChildren(DashboardResourcesRouteChildren);
var DashboardSettingsRouteChildren = {
	DashboardSettingsAuditLogsRoute,
	DashboardSettingsBillingRoute,
	DashboardSettingsCompanyRoute,
	DashboardSettingsGeneralRoute,
	DashboardSettingsIntegrationsRoute,
	DashboardSettingsNotificationsRoute,
	DashboardSettingsProfileRoute,
	DashboardSettingsRolesPermissionsRoute,
	DashboardSettingsSecurityRoute,
	DashboardSettingsIndexRoute
};
var DashboardSettingsRouteWithChildren = DashboardSettingsRoute._addFileChildren(DashboardSettingsRouteChildren);
var DashboardSuperAdminRouteChildren = {
	DashboardSuperAdminActivityRoute,
	DashboardSuperAdminAnalyticsRoute,
	DashboardSuperAdminAuditLogsRoute,
	DashboardSuperAdminOrganizationsRoute,
	DashboardSuperAdminPlatformConfigRoute,
	DashboardSuperAdminSettingsRoute,
	DashboardSuperAdminUsersRoute,
	DashboardSuperAdminIndexRoute
};
var DashboardSuperAdminRouteWithChildren = DashboardSuperAdminRoute._addFileChildren(DashboardSuperAdminRouteChildren);
var DashboardTalentRouteChildren = {
	DashboardTalentPerformanceRoute,
	DashboardTalentRecruitmentRoute,
	DashboardTalentIndexRoute
};
var DashboardTalentRouteWithChildren = DashboardTalentRoute._addFileChildren(DashboardTalentRouteChildren);
var DashboardWorkforceRouteChildren = {
	DashboardWorkforceAttendanceRoute,
	DashboardWorkforceDepartmentsRoute,
	DashboardWorkforceLeavesRoute,
	DashboardWorkforcePeopleRoute,
	DashboardWorkforceTimesheetsRoute,
	DashboardWorkforceIndexRoute
};
var DashboardWorkforceRouteWithChildren = DashboardWorkforceRoute._addFileChildren(DashboardWorkforceRouteChildren);
var DashboardExecutiveCeoRouteChildren = {
	DashboardExecutiveCeoAiInsightsRoute,
	DashboardExecutiveCeoBusinessRoute,
	DashboardExecutiveCeoFinanceRoute,
	DashboardExecutiveCeoOperationsRoute,
	DashboardExecutiveCeoOrganizationRoute,
	DashboardExecutiveCeoReportsRoute,
	DashboardExecutiveCeoSalesRoute,
	DashboardExecutiveCeoSettingsRoute,
	DashboardExecutiveCeoIndexRoute
};
var DashboardExecutiveCeoRouteWithChildren = DashboardExecutiveCeoRoute._addFileChildren(DashboardExecutiveCeoRouteChildren);
var DashboardExecutiveCioRouteChildren = {
	DashboardExecutiveCioAnalyticsRoute,
	DashboardExecutiveCioCloudNetworkRoute,
	DashboardExecutiveCioCyberSecurityRoute,
	DashboardExecutiveCioDigitalTransformationRoute,
	DashboardExecutiveCioInfrastructureRoute,
	DashboardExecutiveCioItGovernanceRoute,
	DashboardExecutiveCioItOperationsRoute,
	DashboardExecutiveCioSettingsRoute,
	DashboardExecutiveCioIndexRoute
};
var DashboardExecutiveCioRouteWithChildren = DashboardExecutiveCioRoute._addFileChildren(DashboardExecutiveCioRouteChildren);
var DashboardExecutiveCtoRouteChildren = {
	DashboardExecutiveCtoAiRoute,
	DashboardExecutiveCtoAnalyticsRoute,
	DashboardExecutiveCtoDatabaseRoute,
	DashboardExecutiveCtoDevelopersRoute,
	DashboardExecutiveCtoDevopsRoute,
	DashboardExecutiveCtoEngineeringRoute,
	DashboardExecutiveCtoInfrastructureRoute,
	DashboardExecutiveCtoMonitoringRoute,
	DashboardExecutiveCtoProjectsRoute,
	DashboardExecutiveCtoSecurityRoute,
	DashboardExecutiveCtoSettingsRoute,
	DashboardExecutiveCtoIndexRoute
};
var DashboardRouteChildren = {
	DashboardAiHubRoute: DashboardAiHubRouteWithChildren,
	DashboardAiInsightsRoute,
	DashboardAnalyticsRoute: DashboardAnalyticsRouteWithChildren,
	DashboardAssetManagementRoute,
	DashboardAssetsRoute,
	DashboardAttendanceRoute: DashboardAttendanceRouteWithChildren,
	DashboardAuditLogsRoute,
	DashboardBillingRoute,
	DashboardDepartmentsRoute,
	DashboardDocumentsRoute,
	DashboardEmployeeRoute: DashboardEmployeeRouteWithChildren,
	DashboardEmployeesRoute,
	DashboardExecutivesRoute,
	DashboardExitRoute,
	DashboardExitManagementRoute,
	DashboardExpensesRoute,
	DashboardForbiddenRoute,
	DashboardHierarchyRoute,
	DashboardHrRoute,
	DashboardHrOperationsRoute: DashboardHrOperationsRouteWithChildren,
	DashboardHrOpsRoute,
	DashboardItAdminRoute,
	DashboardLeavesRoute,
	DashboardManagerRoute,
	DashboardManagersRoute,
	DashboardNotificationsRoute,
	DashboardOffboardingRoute,
	DashboardOnboardingChecklistRoute,
	DashboardPayrollRoute: DashboardPayrollRouteWithChildren,
	DashboardPerformanceRoute,
	DashboardRecruitmentRoute: DashboardRecruitmentRouteWithChildren,
	DashboardReportsRoute,
	DashboardResourcesRoute: DashboardResourcesRouteWithChildren,
	DashboardRolesRoute,
	DashboardSettingsRoute: DashboardSettingsRouteWithChildren,
	DashboardSuperAdminRoute: DashboardSuperAdminRouteWithChildren,
	DashboardTalentRoute: DashboardTalentRouteWithChildren,
	DashboardTimelineRoute,
	DashboardTimesheetsRoute,
	DashboardTravelRoute,
	DashboardVisitorsRoute,
	DashboardWorkforceRoute: DashboardWorkforceRouteWithChildren,
	DashboardIndexRoute,
	DashboardExecutiveCeoRoute: DashboardExecutiveCeoRouteWithChildren,
	DashboardExecutiveCfoRoute,
	DashboardExecutiveCioRoute: DashboardExecutiveCioRouteWithChildren,
	DashboardExecutiveCmoRoute,
	DashboardExecutiveCooRoute,
	DashboardExecutiveCtoRoute: DashboardExecutiveCtoRoute._addFileChildren(DashboardExecutiveCtoRouteChildren),
	DashboardExecutiveIndexRoute,
	DashboardPeopleIndexRoute
};
var DashboardRouteWithChildren = DashboardRoute._addFileChildren(DashboardRouteChildren);
var PayrollRunsRunIdEmployeeEmployeeIdRouteChildren = { PayrollRunsRunIdEmployeeEmployeeIdPayslipRoute };
var rootRouteChildren = {
	IndexRoute,
	AboutRoute,
	AiRoute: AiRouteWithChildren,
	BlogRoute: BlogRouteWithChildren,
	ContactRoute,
	DashboardRoute: DashboardRouteWithChildren,
	EmployeeOnboardingRoute,
	FaqRoute,
	FeaturesRoute,
	ForgotPasswordRoute,
	LoginRoute,
	OnboardingRoute,
	PricingRoute,
	PrivacyRoute,
	RegisterRoute,
	ResetPasswordRoute,
	SitemapDotxmlRoute,
	TermsRoute,
	VerifyEmailRoute,
	VerifyResetOtpRoute,
	ApiAiBrainRoute,
	AuthForgotPasswordRoute,
	AuthLoginRoute,
	AuthRegisterRoute,
	AuthResetPasswordRoute,
	AuthVerifyEmailRoute,
	AuthVerifyResetOtpRoute,
	JobsApplyUkeyRoute,
	PayrollRunsRunIdApprovalRoute,
	PayrollRunsRunIdFinalizeRoute,
	PayrollRunsRunIdPreviewRoute,
	PayrollRunsRunIdProcessingRoute,
	PayrollRunsRunIdReviewRoute,
	PayrollRunsRunIdValidationRoute,
	PayrollRunsRunIdEmployeeEmployeeIdRoute: PayrollRunsRunIdEmployeeEmployeeIdRoute._addFileChildren(PayrollRunsRunIdEmployeeEmployeeIdRouteChildren)
};
var routeTree = Route$245._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll$1({
	clearQueryCache: () => clearQueryCache,
	getQueryClient: () => getQueryClient,
	getRouter: () => getRouter
});
var sharedQueryClient = null;
var getQueryClient = () => {
	if (!sharedQueryClient) sharedQueryClient = new QueryClient({ defaultOptions: { queries: {
		staleTime: 1e3 * 60,
		gcTime: 1e3 * 60 * 5,
		refetchOnWindowFocus: false,
		retry: 1
	} } });
	return sharedQueryClient;
};
var clearQueryCache = () => {
	if (sharedQueryClient) sharedQueryClient.clear();
};
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: getQueryClient() },
		scrollRestoration: true,
		defaultPreload: "intent",
		defaultPreloadStaleTime: 1e3 * 30
	});
};
var status = typeof window === "undefined" ? "ready" : "loading";
var bootstrapPromise = null;
var listeners = /* @__PURE__ */ new Set();
function emit() {
	listeners.forEach((listener) => listener());
}
function setStatus(next) {
	status = next;
	emit();
}
function mapAuthUser(data) {
	const ws = aurix.get();
	const companyId = data.company_id ? String(data.company_id) : ws.user?.companyId || "workspace";
	return {
		user: {
			id: String(data.id),
			fullName: data.name,
			email: data.email,
			phone: data.phone || "",
			role: normalizeRole(data.role) ?? "employee",
			companyId,
			emailVerified: data.is_verified,
			onboardingComplete: Boolean(data.onboarding_completed),
			createdAt: data.created_at ?? (/* @__PURE__ */ new Date()).toISOString()
		},
		company: {
			id: companyId,
			name: data.company_name || ws.company?.name || "Workspace"
		}
	};
}
function persistAuthSession(user, tokens) {
	setTokens(tokens);
	aurix.set(mapAuthUser(user));
}
async function bootstrapAuth() {
	if (typeof window === "undefined") return;
	if (bootstrapPromise) return bootstrapPromise;
	bootstrapPromise = (async () => {
		const finish = () => {
			aurix.set({ isRestoring: false });
			setStatus("ready");
		};
		const tokens = getTokens();
		const ws = aurix.get();
		if (tokens?.accessToken && !isAccessTokenExpired(tokens.accessToken)) {
			if (!ws.user) try {
				const res = await authService.getMe();
				if (res.success && res.data) aurix.set(mapAuthUser(res.data));
			} catch {}
			finish();
			return;
		}
		if (!(Boolean(ws.user) || Boolean(getRefreshToken()))) {
			finish();
			return;
		}
		try {
			await authService.refresh();
			const res = await authService.getMe();
			if (res.success && res.data) aurix.set(mapAuthUser(res.data));
			else {
				setTokens(null);
				aurix.set({
					user: null,
					company: null
				});
			}
		} catch {
			setTokens(null);
			aurix.set({
				user: null,
				company: null
			});
		} finally {
			finish();
		}
	})();
	return bootstrapPromise;
}
if (typeof window !== "undefined") bootstrapAuth();
/**
* Returns a promise that resolves once the initial auth bootstrap has completed.
* Route guards (e.g. TanStack Router `beforeLoad`) must `await` this before
* checking `isUserAuthenticated()`, otherwise they race ahead of the async
* refresh-token flow and incorrectly redirect to login on page refresh.
*/
function waitForAuth() {
	return bootstrapPromise ?? Promise.resolve();
}
function useAuthReady() {
	return (0, import_react.useSyncExternalStore)((listener) => {
		listeners.add(listener);
		return () => listeners.delete(listener);
	}, () => status === "ready", () => true);
}
async function logout(options) {
	try {
		await authService.logout();
	} catch {}
	setTokens(null);
	aurix.reset();
	safeStorage.removeItem("aurix:tokens");
	safeStorage.removeItem("aurix:workspace:v1");
	safeStorage.removeItem("aurix:remember");
	safeStorage.removeItem("ofc360_notifications_state_v1");
	safeStorage.clear(typeof window !== "undefined" ? window.sessionStorage : void 0);
	clearApiCache();
	clearQueryCache();
	setStatus("ready");
	if (options?.redirect !== false && typeof window !== "undefined") window.location.replace("/login");
}
var lastActiveUserId = void 0;
aurix.subscribe(() => {
	const currentUserId = aurix.get().user?.id ?? null;
	if (lastActiveUserId !== void 0 && lastActiveUserId !== currentUserId) {
		clearQueryCache();
		clearApiCache();
		safeStorage.removeItem("ofc360_notifications_state_v1");
	}
	lastActiveUserId = currentUserId;
});
//#endregion
export { toggleSectionExpand as $, fetchPerformanceCoachDashboard as A, getSafeRedirectUrl as B, fetchChatConversations as C, fetchLeaveAssistantDashboard as D, fetchEmployees as E, fetchSidebarPermissions as F, profileApi as G, logout as H, fetchSuperAdminStatistics as I, sendChatMessage as J, resendEmployeeInvite as K, fetchSystemHealth as L, fetchPlatformUsers as M, fetchPolicyAssistantDashboard as N, fetchMeetingIntelligenceDashboard as O, fetchRecruiterDashboard as P, superAdminApi as Q, fetchWorkforceInsightsDashboard as R, fetchChatConversation as S, fetchEmployeeHealthDashboard as T, normalizeStatistics as U, hasValidAccessToken as V, persistAuthSession as W, setSectionExpand as X, setActiveConversation as Y, settingsApi$1 as Z, deleteChatConversation as _, activateEmployee as a, fetchActiveSessions as b, aiInsightsApi as c, clearOperationStatus$1 as d, updateEmployee as et, collectAllPages as f, deactivatePlatformUser as g, deactivateEmployee as h, Route$155 as i, fetchPlatformSettings as j, fetchOrganizations as k, askPolicyQuestion as l, createEmployee as m, AGENT_LIST as n, useAuthReady as nt, activatePlatformUser as o, createChatConversation as p, resetEmployeePassword as q, PageSkeleton as r, aiHubApi as s, AGENTS as t, updatePlatformSettings as tt, auth_bootstrap_CR9kF6gO_exports as u, deleteEmployee as v, fetchComplianceDashboard as w, fetchAuditLogs as x, fetchAIInsightsDashboard as y, getDefaultDashboardPath as z };
