import { useSyncExternalStore } from "react";
import { api } from "@/api";
import { seedCandidates, seedInterviews, seedJobs, seedOffers } from "./seed";
import type { Candidate, Interview, Job, Offer, Stage, TimelineItem, OfferStatus, EmploymentType } from "./types";

interface State {
  jobs: Job[];
  candidates: Candidate[];
  interviews: Interview[];
  offers: Offer[];
}

const STORAGE_KEY = "aurix.recruitment.v2";

const initial: State = {
  jobs: [],
  candidates: [],
  interviews: [],
  offers: [],
};

// ---------------------------------------------------------------------------
// Adapters to map database snake_case objects to frontend camelCase interfaces
// ---------------------------------------------------------------------------

function mapJobToFrontend(j: any): Job {
  return {
    id: j.id,
    title: j.title,
    department: j.department,
    employmentType: (j.employment_type === "FULL_TIME" ? "Full-time" :
                     j.employment_type === "PART_TIME" ? "Part-time" :
                     j.employment_type === "CONTRACT" ? "Contract" :
                     j.employment_type === "INTERN" ? "Internship" :
                     j.employment_type || "Full-time") as EmploymentType,
    experience: j.experience_required || `${j.min_experience || 0}-${j.max_experience || 0} yrs`,
    skills: j.skills?.map((s: any) => s.skill_name || s) || [],
    salaryMin: Number(j.min_salary || 0),
    salaryMax: Number(j.max_salary || 0),
    currency: "INR",
    vacancies: j.vacancies || 1,
    location: j.location || "Bengaluru",
    workMode: j.work_mode || "Onsite",
    description: j.job_description || "",
    responsibilities: typeof j.responsibilities === "string" ? j.responsibilities.split("\n").filter(Boolean) : (Array.isArray(j.responsibilities) ? j.responsibilities : []),
    requirements: typeof j.requirements === "string" ? j.requirements.split("\n").filter(Boolean) : (Array.isArray(j.requirements) ? j.requirements : []),
    benefits: typeof j.benefits === "string" ? j.benefits.split("\n").filter(Boolean) : (Array.isArray(j.benefits) ? j.benefits : []),
    hiringManager: "Hiring Manager",
    recruiter: "Recruiter",
    status: (j.status?.toLowerCase() === "published" ? "active" : j.status?.toLowerCase()) || "draft",
    publishedAt: j.created_at || new Date().toISOString(),
    closingAt: j.updated_at || new Date().toISOString(),
    applicants: j.applications?.length || 0,
  };
}

function mapCandidateToFrontend(c: any): Candidate {
  const latestApp = c.applications?.[0];
  const notes = c.notes?.map((n: any) => ({
    id: n.id,
    at: n.created_at,
    author: n.author ? `${n.author.first_name} ${n.author.last_name}` : "You",
    text: n.note_text,
  })) || [];

  const timeline = c.timeline || [];
  if (timeline.length === 0 && latestApp) {
    timeline.push({
      id: `tl-app-${c.id}`,
      at: latestApp.created_at,
      kind: "stage",
      title: `Applied for ${latestApp.job?.title || "Position"}`,
      actor: "System",
    });
    if (latestApp.status && latestApp.status !== "applied") {
      timeline.push({
        id: `tl-stage-${c.id}`,
        at: latestApp.updated_at,
        kind: "stage",
        title: `Moved to ${latestApp.status.toLowerCase()}`,
        actor: "System",
      });
    }
  }

  return {
    id: c.id,
    name: `${c.first_name} ${c.last_name}`,
    email: c.email,
    phone: c.phone,
    location: c.location,
    jobId: latestApp?.job_id || "",
    applicationId: latestApp?.id || "",
    appliedPosition: latestApp?.job?.title || c.current_role || "Candidate",
    stage: (latestApp?.status?.toLowerCase() || (c.is_talent_pool ? "screening" : "applied")) as Stage,
    atsScore: typeof c.ats_score === 'number' ? c.ats_score : null,
    jobMatch: typeof c.job_match === 'number' ? c.job_match : null,
    source: c.source || "DIRECT",
    tags: c.tags || [],
    skills: c.skills || [],
    yearsExperience: Number(c.years_experience || 0),
    currentCompany: c.current_company || "",
    currentRole: c.current_role || "",
    expectedSalary: Number(c.expected_salary || 0),
    noticeDays: c.notice_days || 0,
    resumeName: c.resume_name || "resume.pdf",
    summary: c.summary || "",
    experience: c.experience || [],
    education: c.education || [],
    projects: c.projects || [],
    certifications: c.certifications || [],
    languages: c.languages || [],
    feedback: c.feedback || [],
    notes: notes,
    documents: c.resume_path ? [{ name: c.resume_name || "Resume", type: "pdf" }] : [],
    timeline: timeline,
    appliedAt: latestApp?.created_at || c.created_at || new Date().toISOString(),
    vendorId: c.vendor_id || "",
  };
}

function mapInterviewToFrontend(iv: any): Interview {
  return {
    id: iv.id,
    candidateId: iv.application?.candidate_id || "",
    candidateName: iv.application?.candidate 
      ? `${iv.application.candidate.first_name} ${iv.application.candidate.last_name}` 
      : "Candidate",
    jobTitle: iv.application?.job?.title || "Job Position",
    interviewer: iv.schedules?.[0]?.interviewer?.first_name 
      ? `${iv.schedules[0].interviewer.first_name} ${iv.schedules[0].interviewer.last_name}`
      : "Interviewer",
    round: iv.round_name || "Technical Round",
    date: iv.schedules?.[0]?.scheduled_at || iv.created_at || new Date().toISOString(),
    durationMins: iv.schedules?.[0]?.duration_minutes || 45,
    meetingLink: iv.schedules?.[0]?.meeting_link || "https://meet.google.com/abc-xyz-123",
    status: (iv.status?.toLowerCase() === "scheduled" ? "scheduled" : iv.status?.toLowerCase()) || "scheduled",
    rating: iv.rating,
    feedback: iv.feedback_notes,
    notes: iv.notes,
  };
}

function mapOfferToFrontend(o: any): Offer {
  return {
    id: o.id,
    applicationId: o.application_id || o.application?.id || "",
    candidateId: o.application?.candidate_id || "",
    candidateName: o.application?.candidate 
      ? `${o.application.candidate.first_name} ${o.application.candidate.last_name}` 
      : "Candidate",
    jobId: o.application?.job_id || "",
    jobTitle: o.application?.job?.title || "Job Position",
    salary: Number(o.ctc || 0),
    currency: "INR",
    joiningDate: o.joining_date || new Date().toISOString(),
    benefits: ["Health Insurance", "Stock Options", "Flexible Hours"],
    status: (o.status?.toLowerCase()) as OfferStatus,
    sentAt: o.created_at,
    respondedAt: o.updated_at,
    approvals: [],
  };
}

// ---------------------------------------------------------------------------
// Store & Subscription logic
// ---------------------------------------------------------------------------

function load(): State {
  if (typeof window === "undefined") return initial;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initial;
    const parsed = JSON.parse(raw) as Partial<State>;
    return { ...initial, ...parsed };
  } catch {
    return initial;
  }
}

let state: State = load();
const listeners = new Set<() => void>();

function persist() {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
}

function set(next: Partial<State>) {
  state = { ...state, ...next };
  persist();
  listeners.forEach((l) => l());
}

let isLoading = false;
let hasLoaded = false;

export async function refreshAll() {
  if (isLoading) return;
  isLoading = true;
  try {
    // Fetch all resources independently — a failure in one should NOT wipe others
    const [jobsResult, candidatesResult, interviewsResult, offersResult] = await Promise.allSettled([
      api.get("/jobs"),
      api.get("/candidates"),
      api.get("/interviews"),
      api.get("/offers"),
    ]);

    const update: Partial<State> = {};
    let anySuccess = false;

    if (jobsResult.status === "fulfilled") {
      const d = jobsResult.value;
      const items = d?.data?.items || d?.data || [];
      if (Array.isArray(items) && items.length >= 0) {
        update.jobs = items.map(mapJobToFrontend);
        anySuccess = true;
      }
    } else {
      console.warn("Jobs API failed:", jobsResult.reason);
    }

    if (candidatesResult.status === "fulfilled") {
      const d = candidatesResult.value;
      const items = d?.data?.items || d?.data || [];
      if (Array.isArray(items) && items.length >= 0) {
        update.candidates = items.map(mapCandidateToFrontend);
        anySuccess = true;
      }
    } else {
      console.warn("Candidates API failed:", candidatesResult.reason);
    }

    if (interviewsResult.status === "fulfilled") {
      const d = interviewsResult.value;
      const items = d?.data || [];
      if (Array.isArray(items) && items.length >= 0) {
        update.interviews = items.map(mapInterviewToFrontend);
        anySuccess = true;
      }
    } else {
      console.warn("Interviews API failed:", interviewsResult.reason);
    }

    if (offersResult.status === "fulfilled") {
      const d = offersResult.value;
      const items = d?.data?.items || d?.data || [];
      if (Array.isArray(items) && items.length >= 0) {
        update.offers = items.map(mapOfferToFrontend);
        anySuccess = true;
      }
    } else {
      console.warn("Offers API failed:", offersResult.reason);
    }

    if (Object.keys(update).length > 0) {
      set(update);
    }
    if (anySuccess) {
      hasLoaded = true;
    }
  } catch (err) {
    console.error("Failed to load recruitment data from backend:", err);
  } finally {
    isLoading = false;
  }
}

// Trigger load once the store is imported
if (typeof window !== "undefined") {
  setTimeout(() => {
    refreshAll();
  }, 500);
}

export const recruitment = {
  get: () => {
    if (!hasLoaded && !isLoading) {
      refreshAll();
    }
    return state;
  },
  subscribe: (l: () => void) => { listeners.add(l); return () => listeners.delete(l); },
  reset: () => { state = { ...initial }; persist(); listeners.forEach((l) => l()); },

  getJob: async (id: string) => {
    const res = await api.get(`/jobs/${id}`);
    if (res.success && res.data) {
      return mapJobToFrontend(res.data);
    }
    throw new Error(res.message || "Job not found");
  },

  upsertJob: async (j: Job) => {
    try {
      const minExp = parseInt(j.experience || "0") || 0;
      const maxExp = parseInt(j.experience?.split("-")?.[1] || "0") || null;
      const payload = {
        title: j.title,
        department: j.department,
        designation: j.title,
        employment_type: j.employmentType === "Full-time" ? "FULL_TIME" :
                         j.employmentType === "Part-time" ? "PART_TIME" :
                         j.employmentType === "Contract" ? "CONTRACT" :
                         j.employmentType === "Internship" ? "INTERN" : "FULL_TIME",
        experience_required: j.experience || "3-5 yrs",
        min_experience: minExp,
        max_experience: maxExp,
        min_salary: j.salaryMin || 0,
        max_salary: j.salaryMax || 0,
        location: j.location,
        vacancies: j.vacancies || 1,
        job_description: j.description || "",
        responsibilities: Array.isArray(j.responsibilities) ? j.responsibilities.join("\n") : j.responsibilities,
        requirements: Array.isArray(j.requirements) ? j.requirements.join("\n") : j.requirements,
        benefits: Array.isArray(j.benefits) ? j.benefits.join("\n") : j.benefits,
        status: j.status === "active" ? "PUBLISHED" : j.status.toUpperCase(),
        rounds: ["Screening", "Technical", "Manager", "HR"],
        skills: j.skills || [],
      };
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(j.id);
      let response;
      if (isUuid) {
        response = await api.put(`/jobs/${j.id}`, payload);
      } else {
        response = await api.post("/jobs", payload);
      }
      await refreshAll();
      return response;
    } catch (err) {
      console.error("upsertJob failed:", err);
      throw err;
    }
  },

  deleteJob: async (id: string) => {
    try {
      await api.delete(`/jobs/${id}`);
      await refreshAll();
    } catch (err) {
      console.error("deleteJob failed:", err);
    }
  },

  archiveJob: async (id: string) => {
    try {
      await api.post(`/jobs/${id}/close`);
      await refreshAll();
    } catch (err) {
      console.error("archiveJob failed:", err);
    }
  },

  duplicateJob: async (id: string) => {
    try {
      await api.post(`/jobs/${id}/duplicate`);
      await refreshAll();
    } catch (err) {
      console.error("duplicateJob failed:", err);
    }
  },

  upsertCandidate: async (c: Candidate) => {
    try {
      const [firstName, ...lastNames] = c.name.split(" ");
      const lastName = lastNames.join(" ") || "Candidate";
      const payload = {
        first_name: firstName,
        last_name: lastName,
        email: c.email,
        phone: c.phone || "0000000000",
        location: c.location || "Unknown",
        summary: c.summary || "",
        skills: c.skills || [],
        tags: c.tags || [],
        years_experience: c.yearsExperience || 0,
        current_company: c.currentCompany || "",
        current_role: c.currentRole || "",
        expected_salary: c.expectedSalary || 0,
        notice_days: c.noticeDays || 0,
        source: c.source || "DIRECT",
        is_talent_pool: c.stage === "screening" || !c.jobId,
      };
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(c.id);
      if (isUuid) {
        await api.put(`/candidates/${c.id}`, payload);
      } else {
        await api.post("/candidates", payload);
      }
      await refreshAll();
    } catch (err) {
      console.error("upsertCandidate failed:", err);
    }
  },

  moveStage: async (id: string, stage: Stage) => {
    // Optimistic local update
    const current = [...state.candidates];
    const cand = current.find((c) => c.applicationId === id || c.id === id);
    if (cand) {
      cand.stage = stage;
      set({ candidates: current });
    }

    try {
      let targetId: string | null = null;
      if (cand) {
        targetId = cand.applicationId || (cand.id === id ? null : id);
      } else {
        targetId = id;
      }

      if (targetId) {
        const isTargetUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetId);
        if (isTargetUuid) {
          await api.patch(`/applications/${targetId}/stage`, { stage });
        }
      }
      await refreshAll();
    } catch (err) {
      console.error("moveStage failed:", err);
    }
  },

  addNote: async (id: string, text: string) => {
    try {
      await api.post("/crm/notes", { candidate_id: id, note_text: text });
      await refreshAll();
    } catch (err) {
      console.error("addNote failed:", err);
    }
  },

  upsertInterview: async (iv: Interview) => {
    // Optimistic local update
    const current = [...state.interviews];
    const idx = current.findIndex((item) => item.id === iv.id);
    if (idx >= 0) {
      current[idx] = iv;
    } else {
      current.push(iv);
    }
    set({ interviews: current });

    try {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(iv.id);
      if (isUuid) {
        const payload = {
          interview_round_id: iv.id,
          scores: {},
          overall_recommendation: iv.rating && iv.rating >= 3 ? "HIRE" : "NO_HIRE",
          feedback_notes: iv.feedback || "",
        };
        await api.post("/scorecards/submissions", payload);
      }
      await refreshAll();
    } catch (err) {
      console.error("upsertInterview failed:", err);
    }
  },

  upsertOffer: async (o: Offer) => {
    try {
      const appId = o.applicationId || o.candidateId;
      const jDate = o.joiningDate.includes("T") ? o.joiningDate.split("T")[0] : o.joiningDate;
      const expDate = new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];
      const payload = {
        ctc: o.salary,
        joining_date: jDate,
        offer_expiry_date: expDate,
      };
      await api.post(`/applications/${appId}/offer`, payload);
      await refreshAll();
    } catch (err) {
      console.error("upsertOffer failed:", err);
    }
  },
};

export function useRecruitment<T>(selector: (s: State) => T): T {
  if (!hasLoaded && !isLoading && typeof window !== "undefined") {
    refreshAll();
  }
  return useSyncExternalStore(
    recruitment.subscribe,
    () => selector(state),
    () => selector(initial),
  );
}

export function newId(prefix = "id") {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}
