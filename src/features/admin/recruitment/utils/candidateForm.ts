import type { Candidate, Job, Stage } from "../types";

export interface CandidateFormData {
  name: string;
  email: string;
  phone: string;
  location: string;
  jobId: string;
  currentCompany: string;
  currentRole: string;
  yearsExperience: string;
  expectedSalary: string;
  noticeDays: string;
  skills: string;
  tags: string;
  summary: string;
}

export const EMPTY_CANDIDATE_FORM: CandidateFormData = {
  name: "",
  email: "",
  phone: "",
  location: "",
  jobId: "",
  currentCompany: "",
  currentRole: "",
  yearsExperience: "0",
  expectedSalary: "0",
  noticeDays: "0",
  skills: "",
  tags: "",
  summary: "",
};

function parseCommaList(value: string): string[] {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

export function buildCandidateFromForm(
  form: CandidateFormData,
  options: { id: string; stage: Stage; job?: Job | null; appliedPositionFallback?: string },
): Candidate {
  const appliedPosition =
    options.job?.title ??
    (form.currentRole || options.appliedPositionFallback || "Open Application");

  return {
    id: options.id,
    name: form.name,
    email: form.email,
    phone: form.phone,
    location: form.location,
    jobId: form.jobId,
    applicationId: "",
    appliedPosition,
    stage: options.stage,
    atsScore: null,
    jobMatch: null,
    source: "DIRECT",
    tags: parseCommaList(form.tags),
    skills: parseCommaList(form.skills),
    yearsExperience: Number(form.yearsExperience) || 0,
    currentCompany: form.currentCompany,
    currentRole: form.currentRole,
    expectedSalary: Number(form.expectedSalary) || 0,
    noticeDays: Number(form.noticeDays) || 0,
    resumeName: "resume.pdf",
    summary: form.summary,
    experience: [],
    education: [],
    projects: [],
    certifications: [],
    languages: [],
    feedback: [],
    notes: [],
    documents: [],
    timeline: [],
    appliedAt: new Date().toISOString(),
  };
}
