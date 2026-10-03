import type {
  Candidate,
  EmploymentType,
  HumanDecision,
  Interview,
  Job,
  Offer,
  OfferStatus,
  ScreeningDecision,
  ScreeningResult,
  ScreeningResultsData,
  ScreeningRun,
  ScreeningStatus,
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
  const mappedApplications = Array.isArray(applications)
    ? applications.map((app) => ({
        id: String(app.id ?? ""),
        jobId: String(app.job_id ?? app.jobId ?? ""),
        stage: (String(app.status ?? app.stage ?? "").toLowerCase() || "applied") as Stage,
        appliedPosition: String(
          (app.job as Record<string, unknown> | undefined)?.title ?? app.applied_position ?? app.appliedPosition ?? "",
        ),
        appliedAt: String(app.created_at ?? app.applied_at ?? app.appliedAt ?? ""),
      }))
    : [];
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
    applications: mappedApplications,
  };
}

export function mapInterviewToFrontend(iv: Record<string, unknown>): Interview {
  const application = iv.application as Record<string, unknown> | undefined;
  const candidate = (iv.candidate || application?.candidate) as Record<string, unknown> | undefined;
  const job = (iv.job || application?.job) as Record<string, unknown> | undefined;
  const schedules = iv.schedules as Array<Record<string, unknown>> | undefined;
  const schedule = schedules?.[0];
  const interviewer = (iv.interviewer || schedule?.interviewer) as Record<string, unknown> | undefined;

  const interviewId = String(iv.interview_id ?? iv.id ?? "");
  const roundId = String(iv.round_id ?? iv.id ?? "");
  const scheduleId = iv.schedule_id ? String(iv.schedule_id) : schedule?.id ? String(schedule.id) : null;
  const applicationId = String(iv.application_id ?? application?.id ?? iv.applicationId ?? "");
  const candidateId = String(iv.candidate_id ?? candidate?.id ?? application?.candidate_id ?? "");

  let candidateName = "Candidate";
  if (typeof candidate?.name === "string" && candidate.name.trim()) {
    candidateName = candidate.name.trim();
  } else if (candidate?.first_name || candidate?.last_name) {
    candidateName = `${candidate.first_name ?? ""} ${candidate.last_name ?? ""}`.trim() || "Candidate";
  }

  let interviewerName = "Unassigned";
  if (typeof interviewer?.name === "string" && interviewer.name.trim()) {
    interviewerName = interviewer.name.trim();
  } else if (interviewer?.first_name || interviewer?.last_name) {
    interviewerName = `${interviewer.first_name ?? ""} ${interviewer.last_name ?? ""}`.trim() || "Unassigned";
  } else if (typeof iv.interviewer_name === "string" && iv.interviewer_name.trim()) {
    interviewerName = iv.interviewer_name.trim();
  }

  const rawScheduledAt = iv.scheduled_at ?? schedule?.scheduled_at;
  const date = rawScheduledAt ? String(rawScheduledAt) : null;

  const durationMins = Number(iv.duration_minutes ?? schedule?.duration_minutes ?? 0);
  const meetingLink = (iv.meeting_url || schedule?.meeting_link || schedule?.meeting_url)
    ? String(iv.meeting_url || schedule?.meeting_link || schedule?.meeting_url)
    : null;
  const officeAddress = (iv.office_address || schedule?.office_address)
    ? String(iv.office_address || schedule?.office_address)
    : null;

  const statusRaw = String(iv.status ?? "PENDING_SCHEDULE").toUpperCase();
  let status: Interview["status"] = "PENDING_SCHEDULE";
  if (statusRaw === "SCHEDULED" || statusRaw === "SCHEDULE") status = "SCHEDULED";
  else if (statusRaw === "COMPLETED") status = "COMPLETED";
  else if (statusRaw === "CANCELLED") status = "CANCELLED";
  else if (statusRaw === "NO_SHOW" || statusRaw === "NO-SHOW") status = "NO_SHOW";
  else if (statusRaw === "PENDING_SCHEDULE" || statusRaw === "PENDING") status = "PENDING_SCHEDULE";
  else if (statusRaw.toLowerCase() === "scheduled") status = "SCHEDULED";
  else if (statusRaw.toLowerCase() === "completed") status = "COMPLETED";
  else if (statusRaw.toLowerCase() === "cancelled") status = "CANCELLED";
  else if (statusRaw.toLowerCase() === "no-show") status = "NO_SHOW";

  const mode = (String(iv.mode ?? schedule?.mode ?? "ONLINE").toUpperCase() === "OFFLINE" ? "OFFLINE" : "ONLINE") as Interview["mode"];

  return {
    id: interviewId || roundId || String(iv.id ?? ""),
    interviewId,
    roundId,
    scheduleId,
    applicationId,
    candidateId,
    candidateName,
    candidateEmail: candidate?.email ? String(candidate.email) : undefined,
    jobId: String(iv.job_id ?? job?.id ?? application?.job_id ?? ""),
    jobTitle: String(job?.title ?? job?.name ?? "Job Position"),
    round: String(iv.round_name || iv.round || "Technical Round"),
    interviewerId: interviewer?.id ? String(interviewer.id) : null,
    interviewer: interviewerName,
    date,
    durationMins,
    timezone: (iv.timezone || schedule?.timezone) ? String(iv.timezone || schedule?.timezone) : undefined,
    mode,
    meetingLink,
    officeAddress,
    status,
    isOverdue: Boolean(iv.is_overdue),
    rating: typeof iv.rating === "number" ? iv.rating : (iv.rating ? Number(iv.rating) : null),
    recommendation: (iv.recommendation as Interview["recommendation"]) || null,
    feedback: (iv.feedback || iv.feedback_notes) ? String(iv.feedback || iv.feedback_notes) : null,
    cancelledReason: iv.cancelled_reason ? String(iv.cancelled_reason) : null,
    createdAt: iv.created_at ? String(iv.created_at) : undefined,
    notes: iv.notes ? String(iv.notes) : undefined,
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

export function extractItems(
  result: PromiseSettledResult<unknown> | unknown,
): Record<string, unknown>[] {
  if (!result) return [];
  const isSettled =
    typeof result === "object" && result !== null && "status" in result && ("value" in result || "reason" in result);

  let raw: any;
  if (isSettled) {
    const settled = result as PromiseSettledResult<unknown>;
    if (settled.status !== "fulfilled" || !settled.value) return [];
    raw = settled.value;
  } else {
    raw = result;
  }

  const payload = raw && typeof raw === "object" && "data" in raw && raw.data !== undefined
    ? raw.data
    : raw;

  if (Array.isArray(payload)) {
    return payload as Record<string, unknown>[];
  }

  if (payload && typeof payload === "object") {
    if (Array.isArray(payload.items)) {
      return payload.items as Record<string, unknown>[];
    }
    if (Array.isArray(payload.results)) {
      return payload.results as Record<string, unknown>[];
    }
    if (payload.data && Array.isArray(payload.data)) {
      return payload.data as Record<string, unknown>[];
    }
    if (payload.data && typeof payload.data === "object" && Array.isArray(payload.data.items)) {
      return payload.data.items as Record<string, unknown>[];
    }
  }

  return [];
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
    if (import.meta.env.DEV) {
      console.warn("Jobs API failed:", jobsResult.reason);
    }
  }

  const candidateItems = extractItems(candidatesResult);
  if (candidatesResult.status === "fulfilled" && candidateItems.length >= 0) {
    data.candidates = candidateItems.map(mapCandidateToFrontend);
    anySuccess = true;
  } else if (candidatesResult.status === "rejected") {
    if (import.meta.env.DEV) {
      console.warn("Candidates API failed:", candidatesResult.reason);
    }
  }

  const interviewItems = extractItems(interviewsResult);
  if (interviewsResult.status === "fulfilled" && interviewItems.length >= 0) {
    data.interviews = interviewItems.map(mapInterviewToFrontend);
    anySuccess = true;
  } else if (interviewsResult.status === "rejected") {
    if (import.meta.env.DEV) {
      console.warn("Interviews API failed:", interviewsResult.reason);
    }
  }

  const offerItems = extractItems(offersResult);
  if (offersResult.status === "fulfilled" && offerItems.length >= 0) {
    data.offers = offerItems.map(mapOfferToFrontend);
    anySuccess = true;
  } else if (offersResult.status === "rejected") {
    if (import.meta.env.DEV) {
      console.warn("Offers API failed:", offersResult.reason);
    }
  }

  return { data, anySuccess };
}

export function mapScreeningResultItemToFrontend(raw: Record<string, unknown>): ScreeningResult {
  const statusRaw = String(raw.status ?? "PENDING").toUpperCase();
  const validStatus: ScreeningStatus =
    statusRaw === "COMPLETED"
      ? "COMPLETED"
      : statusRaw === "RUNNING"
        ? "RUNNING"
        : statusRaw === "FAILED"
          ? "FAILED"
          : "PENDING";

  let decision: ScreeningDecision | null = null;
  const decRaw = raw.decision ? String(raw.decision).toUpperCase() : null;
  if (decRaw === "SHORTLIST" || decRaw === "REVIEW" || decRaw === "REJECT") {
    decision = decRaw;
  }

  let humanDecision: HumanDecision | null = null;
  const humanDecRaw =
    raw.human_decision || raw.humanDecision
      ? String(raw.human_decision || raw.humanDecision).toUpperCase()
      : null;
  if (humanDecRaw === "SHORTLIST" || humanDecRaw === "REJECT" || humanDecRaw === "KEEP_REVIEW") {
    humanDecision = humanDecRaw;
  }

  const confidenceRaw = Math.round(Number(raw.confidence ?? 0));
  const matchScoreRaw = Math.round(Number(raw.match_score ?? raw.matchScore ?? 0));

  const id = String(raw.id ?? raw.screening_id ?? raw.screeningId ?? raw.application_id ?? "");
  const screeningId =
    raw.screening_id || raw.screeningId
      ? String(raw.screening_id || raw.screeningId)
      : undefined;

  return {
    id,
    screeningId,
    applicationId: String(raw.application_id ?? raw.applicationId ?? ""),
    candidateId: String(raw.candidate_id ?? raw.candidateId ?? ""),
    candidateName: String(raw.candidate_name ?? raw.candidateName ?? "Candidate"),
    status: validStatus,
    error: raw.error ? String(raw.error) : null,
    decision,
    confidence: confidenceRaw,
    matchScore: matchScoreRaw,
    strengths: Array.isArray(raw.strengths) ? raw.strengths.map(String) : [],
    weaknesses: Array.isArray(raw.weaknesses) ? raw.weaknesses.map(String) : [],
    missingSkills: Array.isArray(raw.missing_skills ?? raw.missingSkills)
      ? ((raw.missing_skills ?? raw.missingSkills) as unknown[]).map(String)
      : [],
    redFlags: Array.isArray(raw.red_flags ?? raw.redFlags)
      ? ((raw.red_flags ?? raw.redFlags) as unknown[]).map(String)
      : [],
    greenFlags: Array.isArray(raw.green_flags ?? raw.greenFlags)
      ? ((raw.green_flags ?? raw.greenFlags) as unknown[]).map(String)
      : [],
    hiringRecommendation: String(raw.hiring_recommendation ?? raw.hiringRecommendation ?? ""),
    hrNotes: String(raw.hr_notes ?? raw.hrNotes ?? ""),
    questionsToAsk: Array.isArray(raw.questions_to_ask ?? raw.questionsToAsk)
      ? ((raw.questions_to_ask ?? raw.questionsToAsk) as unknown[]).map(String)
      : [],
    modelUsed: String(raw.model_used ?? raw.modelUsed ?? "AI"),
    screenedAt:
      raw.screened_at || raw.screenedAt ? String(raw.screened_at || raw.screenedAt) : null,
    humanDecision,
    humanDecisionBy:
      raw.human_decision_by || raw.humanDecisionBy
        ? String(raw.human_decision_by || raw.humanDecisionBy)
        : null,
    humanDecisionReason:
      raw.human_decision_reason || raw.humanDecisionReason
        ? String(raw.human_decision_reason || raw.humanDecisionReason)
        : null,
    humanDecidedAt:
      raw.human_decided_at || raw.humanDecidedAt
        ? String(raw.human_decided_at || raw.humanDecidedAt)
        : null,
  };
}

export function mapScreeningResultsToFrontend(raw: unknown): ScreeningResultsData {
  if (!raw || typeof raw !== "object") {
    return {
      thresholds: null,
      run: null,
      results: [],
    };
  }

  const obj = raw as Record<string, unknown>;
  const data = (obj.data && typeof obj.data === "object" ? obj.data : obj) as Record<
    string,
    unknown
  >;

  const thresholdsRaw = data.thresholds as Record<string, unknown> | undefined;
  const thresholds =
    thresholdsRaw &&
    typeof thresholdsRaw.shortlist === "number" &&
    typeof thresholdsRaw.reject === "number"
      ? {
          shortlist: Number(thresholdsRaw.shortlist),
          reject: Number(thresholdsRaw.reject),
        }
      : null;

  let run: ScreeningRun | null = null;
  const runRaw = data.run as Record<string, unknown> | undefined;
  if (runRaw && typeof runRaw === "object") {
    run = {
      runId: String(runRaw.run_id ?? runRaw.runId ?? ""),
      status: String(runRaw.status ?? ""),
      completed: Number(runRaw.completed ?? 0),
      total: Number(runRaw.total ?? 0),
    };
  }

  const rawResults = Array.isArray(data.results) ? data.results : [];
  const results = rawResults
    .filter((r): r is Record<string, unknown> => Boolean(r && typeof r === "object"))
    .map(mapScreeningResultItemToFrontend);

  return { thresholds, run, results };
}

