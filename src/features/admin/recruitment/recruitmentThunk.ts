import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiInstance } from "@/api";
import { parseApiError } from "@/api/utils";
import type { RootState } from "@/redux/store";
import type { RecruitmentDataPayload } from "./recruitmentTypes";
import type { Candidate, Interview, Job, Offer, Stage } from "./types";
import {
  mapJobToFrontend,
  parseRecruitmentApiResults,
} from "./utils/apiMappers";

function isUuid(id: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

function toBodyResult(
  result: PromiseSettledResult<{ data: unknown }>,
): PromiseSettledResult<unknown> {
  return result.status === "fulfilled"
    ? { status: "fulfilled", value: result.value.data }
    : result;
}

async function fetchAllResources(): Promise<RecruitmentDataPayload> {
  const [jobsRes, candidatesRes, interviewsRes, offersRes] = await Promise.allSettled([
    apiInstance.get("/jobs"),
    apiInstance.get("/candidates"),
    apiInstance.get("/interviews"),
    apiInstance.get("/offers"),
  ]);

  const { data, anySuccess } = parseRecruitmentApiResults(
    toBodyResult(jobsRes),
    toBodyResult(candidatesRes),
    toBodyResult(interviewsRes),
    toBodyResult(offersRes),
  );

  if (!anySuccess) {
    throw new Error("Failed to load recruitment data");
  }

  return {
    jobs: data.jobs ?? [],
    candidates: data.candidates ?? [],
    interviews: data.interviews ?? [],
    offers: data.offers ?? [],
  };
}

export const fetchRecruitmentData = createAsyncThunk<
  RecruitmentDataPayload,
  void,
  { rejectValue: string }
>("recruitment/fetchData", async (_, thunkAPI) => {
  try {
    return await fetchAllResources();
  } catch (error) {
    return thunkAPI.rejectWithValue(parseApiError(error, "Failed to load recruitment data").message);
  }
});

/** @deprecated Use fetchRecruitmentData */
export const fetchRecruitmentDashboard = fetchRecruitmentData;

export const fetchJobById = createAsyncThunk<Job, string, { rejectValue: string }>(
  "recruitment/fetchJobById",
  async (id, thunkAPI) => {
    try {
      const response = await apiInstance.get(`/jobs/${id}`);
      const body = response.data as { success?: boolean; data?: Record<string, unknown>; message?: string };
      if (body?.success && body.data) {
        return mapJobToFrontend(body.data);
      }
      return thunkAPI.rejectWithValue(body?.message ?? "Job not found");
    } catch (error) {
      return thunkAPI.rejectWithValue(parseApiError(error, "Job not found").message);
    }
  },
);

export const upsertJob = createAsyncThunk<unknown, Job, { rejectValue: string }>(
  "recruitment/upsertJob",
  async (job, thunkAPI) => {
    try {
      const minExp = parseInt(job.experience || "0", 10) || 0;
      const maxExp = parseInt(job.experience?.split("-")?.[1] || "0", 10) || null;
      const payload = {
        title: job.title,
        department: job.department,
        designation: job.title,
        employment_type:
          job.employmentType === "Full-time"
            ? "FULL_TIME"
            : job.employmentType === "Part-time"
              ? "PART_TIME"
              : job.employmentType === "Contract"
                ? "CONTRACT"
                : job.employmentType === "Internship"
                  ? "INTERN"
                  : "FULL_TIME",
        experience_required: job.experience || "3-5 yrs",
        min_experience: minExp,
        max_experience: maxExp,
        min_salary: job.salaryMin || 0,
        max_salary: job.salaryMax || 0,
        location: job.location,
        vacancies: job.vacancies || 1,
        job_description: job.description || "",
        responsibilities: Array.isArray(job.responsibilities)
          ? job.responsibilities.join("\n")
          : job.responsibilities,
        requirements: Array.isArray(job.requirements)
          ? job.requirements.join("\n")
          : job.requirements,
        benefits: Array.isArray(job.benefits) ? job.benefits.join("\n") : job.benefits,
        status: job.status === "active" ? "PUBLISHED" : job.status.toUpperCase(),
        rounds: ["Screening", "Technical", "Manager", "HR"],
        skills: job.skills || [],
      };

      const response = isUuid(job.id)
        ? await apiInstance.put(`/jobs/${job.id}`, payload)
        : await apiInstance.post("/jobs", payload);

      await thunkAPI.dispatch(fetchRecruitmentData());
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(parseApiError(error, "Failed to save job").message);
    }
  },
);

export const deleteJob = createAsyncThunk<string, string, { rejectValue: string }>(
  "recruitment/deleteJob",
  async (id, thunkAPI) => {
    try {
      await apiInstance.delete(`/jobs/${id}`);
      await thunkAPI.dispatch(fetchRecruitmentData());
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(parseApiError(error, "Failed to delete job").message);
    }
  },
);

export const archiveJob = createAsyncThunk<string, string, { rejectValue: string }>(
  "recruitment/archiveJob",
  async (id, thunkAPI) => {
    try {
      await apiInstance.post(`/jobs/${id}/close`);
      await thunkAPI.dispatch(fetchRecruitmentData());
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(parseApiError(error, "Failed to archive job").message);
    }
  },
);

export const duplicateJob = createAsyncThunk<string, string, { rejectValue: string }>(
  "recruitment/duplicateJob",
  async (id, thunkAPI) => {
    try {
      await apiInstance.post(`/jobs/${id}/duplicate`);
      await thunkAPI.dispatch(fetchRecruitmentData());
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(parseApiError(error, "Failed to duplicate job").message);
    }
  },
);

export const upsertCandidate = createAsyncThunk<void, Candidate, { rejectValue: string }>(
  "recruitment/upsertCandidate",
  async (candidate, thunkAPI) => {
    try {
      const [firstName, ...lastNames] = candidate.name.split(" ");
      const lastName = lastNames.join(" ") || "Candidate";
      const payload = {
        first_name: firstName,
        last_name: lastName,
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
        is_talent_pool: candidate.stage === "screening" || !candidate.jobId,
      };

      if (isUuid(candidate.id)) {
        await apiInstance.put(`/candidates/${candidate.id}`, payload);
      } else {
        await apiInstance.post("/candidates", payload);
      }

      await thunkAPI.dispatch(fetchRecruitmentData());
    } catch (error) {
      return thunkAPI.rejectWithValue(parseApiError(error, "Failed to save candidate").message);
    }
  },
);

export const moveStage = createAsyncThunk<
  { id: string; stage: Stage },
  { id: string; stage: Stage },
  { rejectValue: string }
>("recruitment/moveStage", async ({ id, stage }, thunkAPI) => {
  try {
    const state = thunkAPI.getState() as RootState;
    const cand = state.recruitment.candidates.find(
      (c) => c.applicationId === id || c.id === id,
    );
    const targetId = cand?.applicationId || (cand?.id === id ? null : id);

    if (targetId && isUuid(targetId)) {
      await apiInstance.patch(`/applications/${targetId}/stage`, { stage });
    }

    await thunkAPI.dispatch(fetchRecruitmentData());
    return { id, stage };
  } catch (error) {
    return thunkAPI.rejectWithValue(parseApiError(error, "Failed to move candidate stage").message);
  }
});

export const addNote = createAsyncThunk<
  { candidateId: string; text: string },
  { candidateId: string; text: string },
  { rejectValue: string }
>("recruitment/addNote", async ({ candidateId, text }, thunkAPI) => {
  try {
    await apiInstance.post("/crm/notes", { candidate_id: candidateId, note_text: text });
    await thunkAPI.dispatch(fetchRecruitmentData());
    return { candidateId, text };
  } catch (error) {
    return thunkAPI.rejectWithValue(parseApiError(error, "Failed to add note").message);
  }
});

export const upsertInterview = createAsyncThunk<Interview, Interview, { rejectValue: string }>(
  "recruitment/upsertInterview",
  async (interview, thunkAPI) => {
    try {
      if (isUuid(interview.id)) {
        const payload = {
          interview_round_id: interview.id,
          scores: {},
          overall_recommendation: interview.rating && interview.rating >= 3 ? "HIRE" : "NO_HIRE",
          feedback_notes: interview.feedback || "",
        };
        await apiInstance.post("/scorecards/submissions", payload);
      }

      await thunkAPI.dispatch(fetchRecruitmentData());
      return interview;
    } catch (error) {
      return thunkAPI.rejectWithValue(parseApiError(error, "Failed to save interview").message);
    }
  },
);

export const upsertOffer = createAsyncThunk<Offer, Offer, { rejectValue: string }>(
  "recruitment/upsertOffer",
  async (offer, thunkAPI) => {
    try {
      const appId = offer.applicationId || offer.candidateId;
      const jDate = offer.joiningDate.includes("T")
        ? offer.joiningDate.split("T")[0]
        : offer.joiningDate;
      const expDate = new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];
      const payload = {
        ctc: offer.salary,
        joining_date: jDate,
        offer_expiry_date: expDate,
      };

      await apiInstance.post(`/applications/${appId}/offer`, payload);
      await thunkAPI.dispatch(fetchRecruitmentData());
      return offer;
    } catch (error) {
      return thunkAPI.rejectWithValue(parseApiError(error, "Failed to save offer").message);
    }
  },
);
