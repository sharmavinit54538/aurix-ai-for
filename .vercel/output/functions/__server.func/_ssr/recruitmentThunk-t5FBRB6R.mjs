import { i as createAsyncThunk } from "../_libs/@reduxjs/toolkit+[...].mjs";
import { o as apiInstance } from "./apiInstance-C5A0vaLH.mjs";
import { r as parseApiError } from "./utils-DQc9Fr86.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/recruitmentThunk-t5FBRB6R.js
function mapJobToFrontend(j) {
	const skills = j.skills;
	const applications = j.applications;
	return {
		id: String(j.id ?? ""),
		title: String(j.title ?? ""),
		department: String(j.department ?? ""),
		employmentType: j.employment_type === "FULL_TIME" ? "Full-time" : j.employment_type === "PART_TIME" ? "Part-time" : j.employment_type === "CONTRACT" ? "Contract" : j.employment_type === "INTERN" ? "Internship" : j.employment_type || "Full-time",
		experience: String(j.experience_required ?? `${j.min_experience || 0}-${j.max_experience || 0} yrs`),
		skills: skills?.map((s) => typeof s === "object" && s?.skill_name ? s.skill_name : String(s)) || [],
		salaryMin: Number(j.min_salary || 0),
		salaryMax: Number(j.max_salary || 0),
		currency: "INR",
		vacancies: Number(j.vacancies || 1),
		location: String(j.location || "Bengaluru"),
		workMode: String(j.work_mode || "Onsite"),
		description: String(j.job_description || ""),
		responsibilities: typeof j.responsibilities === "string" ? j.responsibilities.split("\n").filter(Boolean) : Array.isArray(j.responsibilities) ? j.responsibilities : [],
		requirements: typeof j.requirements === "string" ? j.requirements.split("\n").filter(Boolean) : Array.isArray(j.requirements) ? j.requirements : [],
		benefits: typeof j.benefits === "string" ? j.benefits.split("\n").filter(Boolean) : Array.isArray(j.benefits) ? j.benefits : [],
		hiringManager: "Hiring Manager",
		recruiter: "Recruiter",
		status: String(j.status ?? "").toLowerCase() === "published" ? "active" : String(j.status ?? "draft").toLowerCase(),
		publishedAt: String(j.created_at || (/* @__PURE__ */ new Date()).toISOString()),
		closingAt: String(j.updated_at || (/* @__PURE__ */ new Date()).toISOString()),
		applicants: applications?.length || 0
	};
}
function mapCandidateToFrontend(c) {
	const latestApp = c.applications?.[0];
	const notes = c.notes?.map((n) => ({
		id: String(n.id ?? ""),
		at: String(n.created_at ?? ""),
		author: n.author && typeof n.author === "object" ? `${n.author.first_name ?? ""} ${n.author.last_name ?? ""}`.trim() || "You" : "You",
		text: String(n.note_text ?? "")
	})) || [];
	const timeline = [...c.timeline || []];
	if (timeline.length === 0 && latestApp) {
		timeline.push({
			id: `tl-app-${c.id}`,
			at: String(latestApp.created_at ?? ""),
			kind: "stage",
			title: `Applied for ${latestApp.job?.title || "Position"}`,
			actor: "System"
		});
		if (latestApp.status && latestApp.status !== "applied") timeline.push({
			id: `tl-stage-${c.id}`,
			at: String(latestApp.updated_at ?? ""),
			kind: "stage",
			title: `Moved to ${String(latestApp.status).toLowerCase()}`,
			actor: "System"
		});
	}
	return {
		id: String(c.id ?? ""),
		name: `${c.first_name ?? ""} ${c.last_name ?? ""}`.trim(),
		email: String(c.email ?? ""),
		phone: String(c.phone ?? ""),
		location: String(c.location ?? ""),
		jobId: String(latestApp?.job_id ?? ""),
		applicationId: String(latestApp?.id ?? ""),
		appliedPosition: String((latestApp?.job)?.title ?? c.current_role ?? "Candidate"),
		stage: String(latestApp?.status ?? "").toLowerCase() || (c.is_talent_pool ? "screening" : "applied"),
		atsScore: typeof c.ats_score === "number" ? c.ats_score : null,
		jobMatch: typeof c.job_match === "number" ? c.job_match : null,
		source: String(c.source || "DIRECT"),
		tags: c.tags || [],
		skills: c.skills || [],
		yearsExperience: Number(c.years_experience || 0),
		currentCompany: String(c.current_company || ""),
		currentRole: String(c.current_role || ""),
		expectedSalary: Number(c.expected_salary || 0),
		noticeDays: Number(c.notice_days || 0),
		resumeName: String(c.resume_name || "resume.pdf"),
		summary: String(c.summary || ""),
		experience: c.experience || [],
		education: c.education || [],
		projects: c.projects || [],
		certifications: c.certifications || [],
		languages: c.languages || [],
		feedback: c.feedback || [],
		notes,
		documents: c.resume_path ? [{
			name: String(c.resume_name || "Resume"),
			type: "pdf"
		}] : [],
		timeline,
		appliedAt: String(latestApp?.created_at ?? c.created_at ?? (/* @__PURE__ */ new Date()).toISOString()),
		vendorId: String(c.vendor_id || "")
	};
}
function mapInterviewToFrontend(iv) {
	const application = iv.application;
	const candidate = application?.candidate;
	const job = application?.job;
	const schedule = iv.schedules?.[0];
	const interviewer = schedule?.interviewer;
	return {
		id: String(iv.id ?? ""),
		candidateId: String(application?.candidate_id ?? ""),
		candidateName: candidate ? `${candidate.first_name ?? ""} ${candidate.last_name ?? ""}`.trim() || "Candidate" : "Candidate",
		jobTitle: String(job?.title ?? "Job Position"),
		interviewer: interviewer?.first_name ? `${interviewer.first_name} ${interviewer.last_name ?? ""}`.trim() : "Interviewer",
		round: String(iv.round_name || "Technical Round"),
		date: String(schedule?.scheduled_at ?? iv.created_at ?? (/* @__PURE__ */ new Date()).toISOString()),
		durationMins: Number(schedule?.duration_minutes || 45),
		meetingLink: String(schedule?.meeting_link || "https://meet.google.com/abc-xyz-123"),
		status: String(iv.status ?? "").toLowerCase() === "scheduled" ? "scheduled" : String(iv.status ?? "scheduled").toLowerCase(),
		rating: iv.rating,
		feedback: iv.feedback_notes,
		notes: iv.notes
	};
}
function mapOfferToFrontend(o) {
	const application = o.application;
	const candidate = application?.candidate;
	const job = application?.job;
	return {
		id: String(o.id ?? ""),
		applicationId: String(o.application_id ?? application?.id ?? ""),
		candidateId: String(application?.candidate_id ?? ""),
		candidateName: candidate ? `${candidate.first_name ?? ""} ${candidate.last_name ?? ""}`.trim() || "Candidate" : "Candidate",
		jobId: String(application?.job_id ?? ""),
		jobTitle: String(job?.title ?? "Job Position"),
		salary: Number(o.ctc || 0),
		currency: "INR",
		joiningDate: String(o.joining_date || (/* @__PURE__ */ new Date()).toISOString()),
		benefits: [
			"Health Insurance",
			"Stock Options",
			"Flexible Hours"
		],
		status: String(o.status ?? "").toLowerCase(),
		sentAt: String(o.created_at ?? ""),
		respondedAt: o.updated_at,
		approvals: []
	};
}
function extractItems(result) {
	if (result.status !== "fulfilled" || !result.value) return [];
	const raw = result.value;
	const payload = raw && typeof raw === "object" && "data" in raw && raw.data !== void 0 ? raw.data : raw;
	if (Array.isArray(payload)) return payload;
	if (payload && typeof payload === "object") {
		if (Array.isArray(payload.items)) return payload.items;
		if (Array.isArray(payload.results)) return payload.results;
		if (payload.data && Array.isArray(payload.data)) return payload.data;
		if (payload.data && typeof payload.data === "object" && Array.isArray(payload.data.items)) return payload.data.items;
	}
	return [];
}
function parseRecruitmentApiResults(jobsResult, candidatesResult, interviewsResult, offersResult) {
	const data = {};
	let anySuccess = false;
	const jobItems = extractItems(jobsResult);
	if (jobsResult.status === "fulfilled" && jobItems.length >= 0) {
		data.jobs = jobItems.map(mapJobToFrontend);
		anySuccess = true;
	} else if (jobsResult.status === "rejected") {}
	const candidateItems = extractItems(candidatesResult);
	if (candidatesResult.status === "fulfilled" && candidateItems.length >= 0) {
		data.candidates = candidateItems.map(mapCandidateToFrontend);
		anySuccess = true;
	} else if (candidatesResult.status === "rejected") {}
	const interviewItems = extractItems(interviewsResult);
	if (interviewsResult.status === "fulfilled" && interviewItems.length >= 0) {
		data.interviews = interviewItems.map(mapInterviewToFrontend);
		anySuccess = true;
	} else if (interviewsResult.status === "rejected") {}
	const offerItems = extractItems(offersResult);
	if (offersResult.status === "fulfilled" && offerItems.length >= 0) {
		data.offers = offerItems.map(mapOfferToFrontend);
		anySuccess = true;
	} else if (offersResult.status === "rejected") {}
	return {
		data,
		anySuccess
	};
}
function mapScreeningResultItemToFrontend(raw) {
	const statusRaw = String(raw.status ?? "PENDING").toUpperCase();
	const validStatus = statusRaw === "COMPLETED" ? "COMPLETED" : statusRaw === "RUNNING" ? "RUNNING" : statusRaw === "FAILED" ? "FAILED" : "PENDING";
	let decision = null;
	const decRaw = raw.decision ? String(raw.decision).toUpperCase() : null;
	if (decRaw === "SHORTLIST" || decRaw === "REVIEW" || decRaw === "REJECT") decision = decRaw;
	let humanDecision = null;
	const humanDecRaw = raw.human_decision || raw.humanDecision ? String(raw.human_decision || raw.humanDecision).toUpperCase() : null;
	if (humanDecRaw === "SHORTLIST" || humanDecRaw === "REJECT" || humanDecRaw === "KEEP_REVIEW") humanDecision = humanDecRaw;
	const confidenceRaw = Number(raw.confidence ?? 0);
	const matchScoreRaw = Number(raw.match_score ?? raw.matchScore ?? 0);
	return {
		id: String(raw.id ?? raw.screening_id ?? raw.screeningId ?? raw.application_id ?? ""),
		screeningId: raw.screening_id || raw.screeningId || raw.id ? String(raw.screening_id || raw.screeningId || raw.id) : void 0,
		applicationId: String(raw.application_id ?? raw.applicationId ?? ""),
		candidateId: String(raw.candidate_id ?? raw.candidateId ?? ""),
		candidateName: String(raw.candidate_name ?? raw.candidateName ?? "Candidate"),
		status: validStatus,
		decision,
		confidence: confidenceRaw,
		matchScore: matchScoreRaw,
		strengths: Array.isArray(raw.strengths) ? raw.strengths.map(String) : [],
		weaknesses: Array.isArray(raw.weaknesses) ? raw.weaknesses.map(String) : [],
		missingSkills: Array.isArray(raw.missing_skills ?? raw.missingSkills) ? (raw.missing_skills ?? raw.missingSkills).map(String) : [],
		redFlags: Array.isArray(raw.red_flags ?? raw.redFlags) ? (raw.red_flags ?? raw.redFlags).map(String) : [],
		greenFlags: Array.isArray(raw.green_flags ?? raw.greenFlags) ? (raw.green_flags ?? raw.greenFlags).map(String) : [],
		hiringRecommendation: String(raw.hiring_recommendation ?? raw.hiringRecommendation ?? ""),
		hrNotes: String(raw.hr_notes ?? raw.hrNotes ?? ""),
		questionsToAsk: Array.isArray(raw.questions_to_ask ?? raw.questionsToAsk) ? (raw.questions_to_ask ?? raw.questionsToAsk).map(String) : [],
		modelUsed: String(raw.model_used ?? raw.modelUsed ?? "AI"),
		screenedAt: raw.screened_at || raw.screenedAt ? String(raw.screened_at || raw.screenedAt) : null,
		humanDecision,
		humanDecisionBy: raw.human_decision_by || raw.humanDecisionBy ? String(raw.human_decision_by || raw.humanDecisionBy) : null,
		humanDecisionReason: raw.human_decision_reason || raw.humanDecisionReason ? String(raw.human_decision_reason || raw.humanDecisionReason) : null
	};
}
function mapScreeningResultsToFrontend(raw) {
	if (!raw || typeof raw !== "object") return {
		thresholds: {
			shortlist: 85,
			reject: 60
		},
		run: null,
		results: []
	};
	const obj = raw;
	const data = obj.data && typeof obj.data === "object" ? obj.data : obj;
	const thresholdsRaw = data.thresholds;
	const thresholds = {
		shortlist: Number(thresholdsRaw?.shortlist ?? 85),
		reject: Number(thresholdsRaw?.reject ?? 60)
	};
	let run = null;
	const runRaw = data.run;
	if (runRaw && typeof runRaw === "object") run = {
		runId: String(runRaw.run_id ?? runRaw.runId ?? ""),
		status: String(runRaw.status ?? ""),
		completed: Number(runRaw.completed ?? 0),
		total: Number(runRaw.total ?? 0)
	};
	const results = (Array.isArray(data.results) ? data.results : []).filter((r) => Boolean(r && typeof r === "object")).map(mapScreeningResultItemToFrontend);
	return {
		thresholds,
		run,
		results
	};
}
var screeningApi = {
	/**
	* Run AI screening for a job requisition.
	* POST /api/v2/screening/jobs/{job_id}/run
	*/
	runScreening: async (jobId, payload) => {
		const res = await apiInstance.post(`/api/v2/screening/jobs/${jobId}/run`, payload || {});
		const data = res.data?.data ?? res.data;
		return {
			run_id: String(data?.run_id ?? data?.runId ?? ""),
			status: String(data?.status ?? "RUNNING"),
			total: Number(data?.total ?? 0)
		};
	},
	/**
	* Fetch AI screening results and run status for a job requisition.
	* GET /api/v2/screening/jobs/{job_id}/results
	* 404 is treated as "no results yet / endpoint unavailable" without throwing or retrying.
	*/
	getScreeningResults: async (jobId) => {
		try {
			const res = await apiInstance.get(`/api/v2/screening/jobs/${jobId}/results`);
			const data = res.data?.data ?? res.data;
			return {
				thresholds: {
					shortlist: Number(data?.thresholds?.shortlist ?? 85),
					reject: Number(data?.thresholds?.reject ?? 60)
				},
				run: data?.run ? {
					run_id: String(data.run.run_id ?? data.run.runId ?? ""),
					status: String(data.run.status ?? ""),
					completed: Number(data.run.completed ?? 0),
					total: Number(data.run.total ?? 0)
				} : null,
				results: Array.isArray(data?.results) ? data.results : []
			};
		} catch (err) {
			if (err?.response?.status === 404 || err?.status === 404) return {
				thresholds: {
					shortlist: 85,
					reject: 60
				},
				run: null,
				results: []
			};
			throw err;
		}
	},
	/**
	* Submit human decision for a screening result.
	* POST /api/v2/screening/results/{screening_id}/decision
	*/
	submitDecision: async (screeningId, payload) => {
		const res = await apiInstance.post(`/api/v2/screening/results/${screeningId}/decision`, payload);
		return res.data?.data ?? res.data;
	}
};
function toBodyResult(result) {
	return result.status === "fulfilled" ? {
		status: "fulfilled",
		value: result.value.data
	} : result;
}
var recruitmentApi = {
	getJobs: async (params) => {
		return (await apiInstance.get("/jobs", { params })).data;
	},
	getJobById: async (id) => {
		return (await apiInstance.get(`/jobs/${id}`)).data;
	},
	createJob: async (payload) => {
		return (await apiInstance.post("/jobs", payload)).data;
	},
	updateJob: async (id, payload) => {
		return (await apiInstance.put(`/jobs/${id}`, payload)).data;
	},
	deleteJob: async (id) => {
		return (await apiInstance.delete(`/jobs/${id}`)).data;
	},
	closeJob: async (id) => {
		return (await apiInstance.post(`/jobs/${id}/close`)).data;
	},
	duplicateJob: async (id) => {
		return (await apiInstance.post(`/jobs/${id}/duplicate`)).data;
	},
	getCandidates: async (params) => {
		return (await apiInstance.get("/candidates", { params })).data;
	},
	createCandidate: async (payload) => {
		return (await apiInstance.post("/candidates", payload)).data;
	},
	updateCandidate: async (id, payload) => {
		return (await apiInstance.put(`/candidates/${id}`, payload)).data;
	},
	updateApplicationStage: async (applicationId, stage) => {
		return (await apiInstance.patch(`/applications/${applicationId}/stage`, { stage })).data;
	},
	addCandidateNote: async (candidateId, text) => {
		return (await apiInstance.post("/crm/notes", {
			candidate_id: candidateId,
			note_text: text
		})).data;
	},
	getInterviews: async (params) => {
		return (await apiInstance.get("/interviews", { params })).data;
	},
	submitInterviewScorecard: async (payload) => {
		return (await apiInstance.post("/scorecards/submissions", payload)).data;
	},
	getOffers: async (params) => {
		return (await apiInstance.get("/offers", { params })).data;
	},
	createOffer: async (applicationId, payload) => {
		return (await apiInstance.post(`/applications/${applicationId}/offer`, payload)).data;
	},
	fetchRecruitmentDashboardData: async () => {
		const [jobsRes, candidatesRes, interviewsRes, offersRes] = await Promise.allSettled([
			apiInstance.get("/jobs"),
			apiInstance.get("/candidates"),
			apiInstance.get("/interviews"),
			apiInstance.get("/offers")
		]);
		const { data } = parseRecruitmentApiResults(toBodyResult(jobsRes), toBodyResult(candidatesRes), toBodyResult(interviewsRes), toBodyResult(offersRes));
		return {
			jobs: data.jobs || [],
			candidates: data.candidates || [],
			interviews: data.interviews || [],
			offers: data.offers || []
		};
	}
};
function isUuid(id) {
	return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}
var fetchRecruitmentData = createAsyncThunk("recruitment/fetchData", async (_, thunkAPI) => {
	try {
		return await recruitmentApi.fetchRecruitmentDashboardData();
	} catch (error) {
		return thunkAPI.rejectWithValue(parseApiError(error, "Failed to fetch recruitment data").message);
	}
}, { condition: (arg, { getState }) => {
	if (arg?.force) return true;
	const { recruitment } = getState();
	if (recruitment.loading) return false;
	if (recruitment.lastFetchedAt && Date.now() - recruitment.lastFetchedAt < 3e4) return false;
	return true;
} });
var fetchJobById = createAsyncThunk("recruitment/fetchJobById", async (id, thunkAPI) => {
	try {
		const body = (await apiInstance.get(`/jobs/${id}`)).data;
		if (body?.success && body.data) return mapJobToFrontend(body.data);
		return thunkAPI.rejectWithValue(body?.message ?? "Job not found");
	} catch (error) {
		return thunkAPI.rejectWithValue(parseApiError(error, "Job not found").message);
	}
});
var upsertJob = createAsyncThunk("recruitment/upsertJob", async (job, thunkAPI) => {
	try {
		const minExp = parseInt(job.experience || "0", 10) || 0;
		const maxExp = parseInt(job.experience?.split("-")?.[1] || "0", 10) || null;
		const payload = {
			title: job.title,
			department: job.department,
			designation: job.title,
			employment_type: job.employmentType === "Full-time" ? "FULL_TIME" : job.employmentType === "Part-time" ? "PART_TIME" : job.employmentType === "Contract" ? "CONTRACT" : job.employmentType === "Internship" ? "INTERN" : "FULL_TIME",
			experience_required: job.experience || "3-5 yrs",
			min_experience: minExp,
			max_experience: maxExp,
			min_salary: job.salaryMin || 0,
			max_salary: job.salaryMax || 0,
			location: job.location,
			vacancies: job.vacancies || 1,
			job_description: job.description || "",
			responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities.join("\n") : job.responsibilities,
			requirements: Array.isArray(job.requirements) ? job.requirements.join("\n") : job.requirements,
			benefits: Array.isArray(job.benefits) ? job.benefits.join("\n") : job.benefits,
			status: job.status === "active" ? "PUBLISHED" : job.status.toUpperCase(),
			rounds: [
				"Screening",
				"Technical",
				"Manager",
				"HR"
			],
			skills: job.skills || []
		};
		const response = isUuid(job.id) ? await apiInstance.put(`/jobs/${job.id}`, payload) : await apiInstance.post("/jobs", payload);
		await thunkAPI.dispatch(fetchRecruitmentData({ force: true }));
		return response.data;
	} catch (error) {
		return thunkAPI.rejectWithValue(parseApiError(error, "Failed to save job").message);
	}
});
var deleteJob = createAsyncThunk("recruitment/deleteJob", async (id, thunkAPI) => {
	try {
		await apiInstance.delete(`/jobs/${id}`);
		await thunkAPI.dispatch(fetchRecruitmentData({ force: true }));
		return id;
	} catch (error) {
		return thunkAPI.rejectWithValue(parseApiError(error, "Failed to delete job").message);
	}
});
var archiveJob = createAsyncThunk("recruitment/archiveJob", async (id, thunkAPI) => {
	try {
		await apiInstance.post(`/jobs/${id}/close`);
		await thunkAPI.dispatch(fetchRecruitmentData({ force: true }));
		return id;
	} catch (error) {
		return thunkAPI.rejectWithValue(parseApiError(error, "Failed to archive job").message);
	}
});
var duplicateJob = createAsyncThunk("recruitment/duplicateJob", async (id, thunkAPI) => {
	try {
		await apiInstance.post(`/jobs/${id}/duplicate`);
		await thunkAPI.dispatch(fetchRecruitmentData({ force: true }));
		return id;
	} catch (error) {
		return thunkAPI.rejectWithValue(parseApiError(error, "Failed to duplicate job").message);
	}
});
var upsertCandidate = createAsyncThunk("recruitment/upsertCandidate", async (candidate, thunkAPI) => {
	try {
		const [firstName, ...lastNames] = candidate.name.split(" ");
		const payload = {
			first_name: firstName,
			last_name: lastNames.join(" ") || "Candidate",
			email: candidate.email,
			phone: candidate.phone || "0000000000",
			location: candidate.location || "Unknown",
			summary: candidate.summary || "",
			skills: candidate.skills || [],
			tags: candidate.tags || [],
			years_experience: candidate.yearsExperience || 0,
			current_company: candidate.currentCompany || "",
			current_role: candidate.currentRole || "",
			expected_salary: candidate.expectedSalary || 0,
			notice_days: candidate.noticeDays || 0,
			source: candidate.source || "DIRECT",
			is_talent_pool: candidate.stage === "screening" || !candidate.jobId
		};
		if (isUuid(candidate.id)) await apiInstance.put(`/candidates/${candidate.id}`, payload);
		else await apiInstance.post("/candidates", payload);
		await thunkAPI.dispatch(fetchRecruitmentData({ force: true }));
	} catch (error) {
		return thunkAPI.rejectWithValue(parseApiError(error, "Failed to save candidate").message);
	}
});
var moveStage = createAsyncThunk("recruitment/moveStage", async ({ id, stage }, thunkAPI) => {
	try {
		const cand = thunkAPI.getState().recruitment.candidates.find((c) => c.applicationId === id || c.id === id);
		const targetId = cand?.applicationId || (cand?.id === id ? null : id);
		if (targetId && isUuid(targetId)) await apiInstance.patch(`/applications/${targetId}/stage`, { stage });
		await thunkAPI.dispatch(fetchRecruitmentData({ force: true }));
		return {
			id,
			stage
		};
	} catch (error) {
		return thunkAPI.rejectWithValue(parseApiError(error, "Failed to move candidate stage").message);
	}
});
var addNote = createAsyncThunk("recruitment/addNote", async ({ candidateId, text }, thunkAPI) => {
	try {
		await apiInstance.post("/crm/notes", {
			candidate_id: candidateId,
			note_text: text
		});
		await thunkAPI.dispatch(fetchRecruitmentData({ force: true }));
		return {
			candidateId,
			text
		};
	} catch (error) {
		return thunkAPI.rejectWithValue(parseApiError(error, "Failed to add note").message);
	}
});
var upsertInterview = createAsyncThunk("recruitment/upsertInterview", async (interview, thunkAPI) => {
	try {
		if (isUuid(interview.id)) {
			const payload = {
				interview_round_id: interview.id,
				scores: {},
				overall_recommendation: interview.rating && interview.rating >= 3 ? "HIRE" : "NO_HIRE",
				feedback_notes: interview.feedback || ""
			};
			await apiInstance.post("/scorecards/submissions", payload);
		}
		await thunkAPI.dispatch(fetchRecruitmentData({ force: true }));
		return interview;
	} catch (error) {
		return thunkAPI.rejectWithValue(parseApiError(error, "Failed to save interview").message);
	}
});
var upsertOffer = createAsyncThunk("recruitment/upsertOffer", async (offer, thunkAPI) => {
	try {
		const appId = offer.applicationId || offer.candidateId;
		const jDate = offer.joiningDate.includes("T") ? offer.joiningDate.split("T")[0] : offer.joiningDate;
		const expDate = new Date(Date.now() + 7 * 864e5).toISOString().split("T")[0];
		const payload = {
			ctc: offer.salary,
			joining_date: jDate,
			offer_expiry_date: expDate
		};
		await apiInstance.post(`/applications/${appId}/offer`, payload);
		await thunkAPI.dispatch(fetchRecruitmentData({ force: true }));
		return offer;
	} catch (error) {
		return thunkAPI.rejectWithValue(parseApiError(error, "Failed to save offer").message);
	}
});
var runScreening = createAsyncThunk("recruitment/runScreening", async ({ jobId, applicationIds, model }, thunkAPI) => {
	try {
		const res = await screeningApi.runScreening(jobId, {
			application_ids: applicationIds,
			model
		});
		return {
			runId: res.run_id,
			status: res.status,
			completed: 0,
			total: res.total
		};
	} catch (error) {
		return thunkAPI.rejectWithValue(parseApiError(error, "Failed to run AI screening").message);
	}
});
var fetchScreeningResults = createAsyncThunk("recruitment/fetchScreeningResults", async (jobId, thunkAPI) => {
	try {
		return mapScreeningResultsToFrontend(await screeningApi.getScreeningResults(jobId));
	} catch (error) {
		return thunkAPI.rejectWithValue(parseApiError(error, "Failed to fetch screening results").message);
	}
});
var submitDecision = createAsyncThunk("recruitment/submitDecision", async ({ screeningId, action, reason, jobId }, thunkAPI) => {
	try {
		const res = await screeningApi.submitDecision(screeningId, {
			action,
			reason
		});
		if (jobId) await thunkAPI.dispatch(fetchScreeningResults(jobId));
		if (res?.data) return mapScreeningResultItemToFrontend(res.data);
		return {
			id: screeningId,
			screeningId,
			applicationId: "",
			candidateId: "",
			candidateName: "",
			status: "COMPLETED",
			decision: action === "SHORTLIST" ? "SHORTLIST" : action === "REJECT" ? "REJECT" : "REVIEW",
			confidence: 1,
			matchScore: 0,
			strengths: [],
			weaknesses: [],
			missingSkills: [],
			redFlags: [],
			greenFlags: [],
			hiringRecommendation: "",
			hrNotes: "",
			questionsToAsk: [],
			modelUsed: "AI",
			screenedAt: (/* @__PURE__ */ new Date()).toISOString(),
			humanDecision: action,
			humanDecisionBy: "You",
			humanDecisionReason: reason || null
		};
	} catch (error) {
		return thunkAPI.rejectWithValue(parseApiError(error, "Failed to submit screening decision").message);
	}
});
//#endregion
export { fetchJobById as a, moveStage as c, submitDecision as d, upsertCandidate as f, upsertOffer as h, duplicateJob as i, recruitmentApi as l, upsertJob as m, archiveJob as n, fetchRecruitmentData as o, upsertInterview as p, deleteJob as r, fetchScreeningResults as s, addNote as t, runScreening as u };
