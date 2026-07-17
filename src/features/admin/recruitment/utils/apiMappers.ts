import type {
  Candidate,
  EmploymentType,
  Interview,
  Job,
  Offer,
  OfferStatus,
  Stage,
} from "../types";

export function mapJobToFrontend(j: Record<string, unknown>): Job {
  const skills = j.skills as Array<{ skill_name?: string } | string> | undefined;
  const applications = j.applications as unknown[] | undefined;

  return {
    id: String(j.id ?? ""),
    title: String(j.title ?? ""),
    department: String(j.department ?? ""),
    employmentType: (j.employment_type === "FULL_TIME"
      ? "Full-time"
      : j.employment_type === "PART_TIME"
        ? "Part-time"
        : j.employment_type === "CONTRACT"
          ? "Contract"
          : j.employment_type === "INTERN"
            ? "Internship"
            : j.employment_type || "Full-time") as EmploymentType,
    experience: String(j.experience_required ?? `${j.min_experience || 0}-${j.max_experience || 0} yrs`),
    skills: skills?.map((s) => (typeof s === "object" && s?.skill_name ? s.skill_name : String(s))) || [],
    salaryMin: Number(j.min_salary || 0),
    salaryMax: Number(j.max_salary || 0),
    currency: "INR",
    vacancies: Number(j.vacancies || 1),
    location: String(j.location || "Bengaluru"),
    workMode: String(j.work_mode || "Onsite") as Job["workMode"],
    description: String(j.job_description || ""),
    responsibilities:
      typeof j.responsibilities === "string"
        ? j.responsibilities.split("\n").filter(Boolean)
        : Array.isArray(j.responsibilities)
          ? (j.responsibilities as string[])
          : [],
    requirements:
      typeof j.requirements === "string"
        ? j.requirements.split("\n").filter(Boolean)
        : Array.isArray(j.requirements)
          ? (j.requirements as string[])
          : [],
    benefits:
      typeof j.benefits === "string"
        ? j.benefits.split("\n").filter(Boolean)
        : Array.isArray(j.benefits)
          ? (j.benefits as string[])
          : [],
    hiringManager: "Hiring Manager",
    recruiter: "Recruiter",
    status: (String(j.status ?? "").toLowerCase() === "published"
      ? "active"
      : String(j.status ?? "draft").toLowerCase()) as Job["status"],
    publishedAt: String(j.created_at || new Date().toISOString()),
    closingAt: String(j.updated_at || new Date().toISOString()),
    applicants: applications?.length || 0,
  };
}

export function mapCandidateToFrontend(c: Record<string, unknown>): Candidate {
  const applications = c.applications as Array<Record<string, unknown>> | undefined;
  const latestApp = applications?.[0];
  const notesRaw = c.notes as Array<Record<string, unknown>> | undefined;
  const notes =
    notesRaw?.map((n) => ({
      id: String(n.id ?? ""),
      at: String(n.created_at ?? ""),
      author:
        n.author && typeof n.author === "object"
          ? `${(n.author as Record<string, unknown>).first_name ?? ""} ${(n.author as Record<string, unknown>).last_name ?? ""}`.trim() ||
            "You"
          : "You",
      text: String(n.note_text ?? ""),
    })) || [];

  const timeline = [...((c.timeline as Candidate["timeline"]) || [])];
  if (timeline.length === 0 && latestApp) {
    timeline.push({
      id: `tl-app-${c.id}`,
      at: String(latestApp.created_at ?? ""),
      kind: "stage",
      title: `Applied for ${(latestApp.job as Record<string, unknown> | undefined)?.title || "Position"}`,
      actor: "System",
    });
    if (latestApp.status && latestApp.status !== "applied") {
      timeline.push({
        id: `tl-stage-${c.id}`,
        at: String(latestApp.updated_at ?? ""),
        kind: "stage",
        title: `Moved to ${String(latestApp.status).toLowerCase()}`,
        actor: "System",
      });
    }
  }

  return {
    id: String(c.id ?? ""),
    name: `${c.first_name ?? ""} ${c.last_name ?? ""}`.trim(),
    email: String(c.email ?? ""),
    phone: String(c.phone ?? ""),
    location: String(c.location ?? ""),
    jobId: String(latestApp?.job_id ?? ""),
    applicationId: String(latestApp?.id ?? ""),
    appliedPosition: String(
      (latestApp?.job as Record<string, unknown> | undefined)?.title ?? c.current_role ?? "Candidate",
    ),
    stage: (String(latestApp?.status ?? "").toLowerCase() ||
      (c.is_talent_pool ? "screening" : "applied")) as Stage,
    atsScore: typeof c.ats_score === "number" ? c.ats_score : null,
    jobMatch: typeof c.job_match === "number" ? c.job_match : null,
    source: String(c.source || "DIRECT"),
    tags: (c.tags as string[]) || [],
    skills: (c.skills as string[]) || [],
    yearsExperience: Number(c.years_experience || 0),
    currentCompany: String(c.current_company || ""),
    currentRole: String(c.current_role || ""),
    expectedSalary: Number(c.expected_salary || 0),
    noticeDays: Number(c.notice_days || 0),
    resumeName: String(c.resume_name || "resume.pdf"),
    summary: String(c.summary || ""),
    experience: (c.experience as Candidate["experience"]) || [],
    education: (c.education as Candidate["education"]) || [],
    projects: (c.projects as Candidate["projects"]) || [],
    certifications: (c.certifications as Candidate["certifications"]) || [],
    languages: (c.languages as Candidate["languages"]) || [],
    feedback: (c.feedback as Candidate["feedback"]) || [],
    notes,
    documents: c.resume_path ? [{ name: String(c.resume_name || "Resume"), type: "pdf" }] : [],
    timeline,
    appliedAt: String(latestApp?.created_at ?? c.created_at ?? new Date().toISOString()),
    vendorId: String(c.vendor_id || ""),
  };
}

export function mapInterviewToFrontend(iv: Record<string, unknown>): Interview {
  const application = iv.application as Record<string, unknown> | undefined;
  const candidate = application?.candidate as Record<string, unknown> | undefined;
  const job = application?.job as Record<string, unknown> | undefined;
  const schedules = iv.schedules as Array<Record<string, unknown>> | undefined;
  const schedule = schedules?.[0];
  const interviewer = schedule?.interviewer as Record<string, unknown> | undefined;

  return {
    id: String(iv.id ?? ""),
    candidateId: String(application?.candidate_id ?? ""),
    candidateName: candidate
      ? `${candidate.first_name ?? ""} ${candidate.last_name ?? ""}`.trim() || "Candidate"
      : "Candidate",
    jobTitle: String(job?.title ?? "Job Position"),
    interviewer: interviewer?.first_name
      ? `${interviewer.first_name} ${interviewer.last_name ?? ""}`.trim()
      : "Interviewer",
    round: String(iv.round_name || "Technical Round"),
    date: String(schedule?.scheduled_at ?? iv.created_at ?? new Date().toISOString()),
    durationMins: Number(schedule?.duration_minutes || 45),
    meetingLink: String(schedule?.meeting_link || "https://meet.google.com/abc-xyz-123"),
    status: (String(iv.status ?? "").toLowerCase() === "scheduled"
      ? "scheduled"
      : String(iv.status ?? "scheduled").toLowerCase()) as Interview["status"],
    rating: iv.rating as number | undefined,
    feedback: iv.feedback_notes as string | undefined,
    notes: iv.notes as string | undefined,
  };
}

export function mapOfferToFrontend(o: Record<string, unknown>): Offer {
  const application = o.application as Record<string, unknown> | undefined;
  const candidate = application?.candidate as Record<string, unknown> | undefined;
  const job = application?.job as Record<string, unknown> | undefined;

  return {
    id: String(o.id ?? ""),
    applicationId: String(o.application_id ?? application?.id ?? ""),
    candidateId: String(application?.candidate_id ?? ""),
    candidateName: candidate
      ? `${candidate.first_name ?? ""} ${candidate.last_name ?? ""}`.trim() || "Candidate"
      : "Candidate",
    jobId: String(application?.job_id ?? ""),
    jobTitle: String(job?.title ?? "Job Position"),
    salary: Number(o.ctc || 0),
    currency: "INR",
    joiningDate: String(o.joining_date || new Date().toISOString()),
    benefits: ["Health Insurance", "Stock Options", "Flexible Hours"],
    status: String(o.status ?? "").toLowerCase() as OfferStatus,
    sentAt: String(o.created_at ?? ""),
    respondedAt: o.updated_at as string | undefined,
    approvals: [],
  };
}

function extractItems(
  result: PromiseSettledResult<unknown>,
  nestedItems = true,
): Record<string, unknown>[] {
  if (result.status !== "fulfilled") return [];

  const value = result.value as { data?: { items?: unknown[] } | unknown[] };
  const items = nestedItems
    ? (value?.data as { items?: unknown[] })?.items || value?.data || []
    : value?.data || [];

  return Array.isArray(items) ? (items as Record<string, unknown>[]) : [];
}

export interface RecruitmentResources {
  jobs: Job[];
  candidates: Candidate[];
  interviews: Interview[];
  offers: Offer[];
}

export function parseRecruitmentApiResults(
  jobsResult: PromiseSettledResult<unknown>,
  candidatesResult: PromiseSettledResult<unknown>,
  interviewsResult: PromiseSettledResult<unknown>,
  offersResult: PromiseSettledResult<unknown>,
): { data: Partial<RecruitmentResources>; anySuccess: boolean } {
  const data: Partial<RecruitmentResources> = {};
  let anySuccess = false;

  const jobItems = extractItems(jobsResult);
  if (jobsResult.status === "fulfilled" && jobItems.length >= 0) {
    data.jobs = jobItems.map(mapJobToFrontend);
    anySuccess = true;
  } else if (jobsResult.status === "rejected") {
    console.warn("Jobs API failed:", jobsResult.reason);
  }

  const candidateItems = extractItems(candidatesResult);
  if (candidatesResult.status === "fulfilled" && candidateItems.length >= 0) {
    data.candidates = candidateItems.map(mapCandidateToFrontend);
    anySuccess = true;
  } else if (candidatesResult.status === "rejected") {
    console.warn("Candidates API failed:", candidatesResult.reason);
  }

  const interviewItems = extractItems(interviewsResult, false);
  if (interviewsResult.status === "fulfilled" && interviewItems.length >= 0) {
    data.interviews = interviewItems.map(mapInterviewToFrontend);
    anySuccess = true;
  } else if (interviewsResult.status === "rejected") {
    console.warn("Interviews API failed:", interviewsResult.reason);
  }

  const offerItems = extractItems(offersResult);
  if (offersResult.status === "fulfilled" && offerItems.length >= 0) {
    data.offers = offerItems.map(mapOfferToFrontend);
    anySuccess = true;
  } else if (offersResult.status === "rejected") {
    console.warn("Offers API failed:", offersResult.reason);
  }

  return { data, anySuccess };
}
