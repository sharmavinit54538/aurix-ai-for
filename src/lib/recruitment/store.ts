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
  jobs: seedJobs,
  candidates: seedCandidates,
  interviews: seedInterviews,
  offers: seedOffers,
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
    appliedPosition: latestApp?.job?.title || c.current_role || "Candidate",
    stage: (latestApp?.status?.toLowerCase() || (c.is_talent_pool ? "screening" : "applied")) as Stage,
    atsScore: c.ats_score || 85,
    jobMatch: c.job_match || 80,
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
    const [jobsRes, candidatesRes, interviewsRes, offersRes] = await Promise.all([
      api.get("/jobs").catch(() => ({ data: [] })),
      api.get("/candidates").catch(() => ({ data: { items: [] } })),
      api.get("/interviews").catch(() => ({ data: [] })),
      api.get("/offers").catch(() => ({ data: { items: [] } })),
    ]);

    const jobs = (jobsRes?.data?.items || jobsRes?.data || []).map(mapJobToFrontend);
    const candidates = (candidatesRes?.data?.items || candidatesRes?.data || []).map(mapCandidateToFrontend);
    const interviews = (interviewsRes?.data || []).map(mapInterviewToFrontend);
    const offers = (offersRes?.data?.items || offersRes?.data || []).map(mapOfferToFrontend);

    if (jobs.length > 0 || candidates.length > 0) {
      set({ jobs, candidates, interviews, offers });
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
    try {
      await api.patch(`/applications/${id}/stage`, { stage });
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
    try {
      const payload = {
        interview_round_id: iv.id,
        scores: {},
        overall_recommendation: "HIRE",
        feedback_notes: iv.feedback || "",
      };
      await api.post("/scorecards/submissions", payload);
      await refreshAll();
    } catch (err) {
      console.error("upsertInterview failed:", err);
    }
  },

  upsertOffer: async (o: Offer) => {
    try {
      const payload = {
        ctc: o.salary,
        joining_date: o.joiningDate,
        offer_expiry_date: new Date(Date.now() + 7 * 86400000).toISOString(),
        status: o.status.toUpperCase(),
      };
      await api.post(`/applications/${o.candidateId}/offer`, payload);
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
