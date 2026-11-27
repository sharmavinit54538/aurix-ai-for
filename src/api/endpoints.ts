/**
 * Centralized endpoint definitions for OFC360 backend API.
 * All backend API routes exist under /api/v1/ on the remote backend.
 */
export const AUTH_ENDPOINTS = {
  login: "/api/v1/auth/login",
  refresh: "/api/v1/auth/refresh",
  refreshToken: "/api/v1/auth/refresh-token",
  logout: "/api/v1/auth/logout",
  me: "/api/v1/auth/me",
  register: "/api/v1/auth/register",
  verifyEmail: "/api/v1/auth/verify-email",
  verifyEmailOtp: "/api/v1/auth/verify-email-otp",
  resendOtp: "/api/v1/auth/resend-otp",
  resendVerification: "/api/v1/auth/resend-verification",
  resendEmailOtp: "/api/v1/auth/resend-email-otp",
  forgotPassword: "/api/v1/auth/forgot-password",
  verifyResetOtp: "/api/v1/auth/verify-reset-otp",
  resetPassword: "/api/v1/auth/reset-password",
  changePassword: "/api/v1/auth/change-password",
  changeEmail: "/api/v1/auth/change-email",
  verifyNewEmail: "/api/v1/auth/verify-new-email",
  changePhone: "/api/v1/auth/change-phone",
  status: "/api/v1/auth/status",
} as const;

export type AuthEndpointKey = keyof typeof AUTH_ENDPOINTS;

export const MANAGER_ENDPOINTS = {
  list: "/api/v1/managers",
  detail: (id: string) => `/api/v1/managers/${id}`,
  create: "/api/v1/managers",
  update: (id: string) => `/api/v1/managers/${id}`,
  delete: (id: string) => `/api/v1/managers/${id}`,
  resetPassword: (id: string) => `/api/v1/managers/${id}/reset-password`,
  deactivate: (id: string) => `/api/v1/managers/${id}/deactivate`,
  activateByAdmin: (id: string) => `/api/v1/managers/${id}/activate-by-admin`,
  onboardingComplete: "/api/v1/managers/onboarding/complete",
} as const;

export type ManagerEndpointKey = keyof typeof MANAGER_ENDPOINTS;

export const RECRUITMENT_ENDPOINTS = {
  // Jobs
  JOBS: "/jobs",
  JOB_BY_ID: (id: string) => `/jobs/${id}`,
  JOB_AI_AUTOFILL: "/jobs/ai-autofill",
  JOB_QR: (id: string) => `/jobs/${id}/qr`,
  JOB_SOURCING_LINK: (id: string) => `/jobs/${id}/sourcing-link`,
  JOB_PUBLISH: (id: string) => `/jobs/${id}/publish`,
  JOB_CLOSE: (id: string) => `/jobs/${id}/close`,
  JOB_DRAFT: (id: string) => `/jobs/${id}/draft`,
  JOB_DUPLICATE: (id: string) => `/jobs/${id}/duplicate`,
  JOB_APPLICANTS_EXPORT: (id: string) => `/jobs/${id}/applicants/export`,
  JOB_GENERATE_DESC: "/recruitment/jobs/generate-description",
  JOB_MODIFY_DESC: "/recruitment/jobs/modify-description",

  // Candidates & Parsing / Match
  CANDIDATES: "/candidates",
  CANDIDATE_BY_ID: (id: string) => `/candidates/${id}`,
  CANDIDATES_EXPORT_CSV: "/candidates/export/csv",
  CANDIDATES_IMPORT: "/candidates/import",
  PARSED_CANDIDATES: "/recruitment/candidates",
  PARSED_CANDIDATE_BY_ID: (id: string) => `/recruitment/candidates/${id}`,
  CANDIDATE_ATS: (id: string) => `/recruitment/candidates/${id}/ats`,
  CANDIDATE_MATCH_JOB: (candidateId: string, jobId: string) =>
    `/recruitment/candidates/${candidateId}/match/${jobId}`,
  JOB_MATCH_CANDIDATES: (jobId: string) => `/recruitment/jobs/${jobId}/match`,
  RESUME_UPLOAD: "/recruitment/resume/upload",
  RESUME_PARSE: "/recruitment/resumes/parse",
  RESUME_PARSE_V2_UPLOAD: "/api/v2/resume-parser/upload-and-parse",
  RESUME_PARSE_V2_GET: (documentId: string) => `/api/v2/resume-parser/${documentId}`,
  RESUME_OCR_STATUS_V2: "/api/v2/resume-parser/ocr/engines/status",
  RESUME_ATS_CHECK_V2: "/api/v2/resume-ats-checker/check",

  // Applications
  APPLICATIONS: "/applications",
  APPLICATION_STATS: "/applications/stats",
  APPLICATION_BY_ID: (id: string) => `/applications/${id}`,
  APPLICATION_BULK_MOVE: "/applications/bulk-move",
  APPLICATION_BULK_TAG: "/applications/bulk-tag",
  APPLICATION_STAGE: (id: string) => `/applications/${id}/stage`,
  APPLICATION_SHORTLIST: (id: string) => `/applications/${id}/shortlist`,
  APPLICATION_REJECT: (id: string) => `/applications/${id}/reject`,
  APPLICATION_HOLD: (id: string) => `/applications/${id}/hold`,
  APPLICATION_OFFER: (id: string) => `/applications/${id}/offer`,
  APPLICATION_SEND_INTERVIEW: (id: string) => `/applications/${id}/send-interview`,
  APPLICATION_CONVERT: (id: string) => `/applications/${id}/convert`,

  // Interviews
  INTERVIEWS: "/interviews",
  INTERVIEW_BY_ID: (id: string) => `/interviews/${id}`,
  INTERVIEW_SCHEDULE: (id: string) => `/interviews/${id}/schedule`,
  INTERVIEW_ROUND_PASS: (roundId: string) => `/interviews/rounds/${roundId}/pass`,
  INTERVIEW_ROUND_REJECT: (roundId: string) => `/interviews/rounds/${roundId}/reject`,
  INTERVIEW_ROUND_HOLD: (roundId: string) => `/interviews/rounds/${roundId}/hold`,

  // Offers & Offer Letters V2
  OFFERS: "/offers",
  OFFER_ACCEPT: (id: string) => `/offers/${id}/accept`,
  OFFER_REJECT: (id: string) => `/offers/${id}/reject`,
  OFFER_LETTER_GENERATE_V2: "/api/v2/offer-letters/generate",
  OFFER_LETTER_DOWNLOAD_V2: (filename: string) =>
    `/api/v2/offer-letters/download/${encodeURIComponent(filename)}`,

  // Requisitions
  REQUISITIONS: "/requisitions",
  REQUISITION_BY_ID: (id: string) => `/requisitions/${id}`,
  REQUISITION_APPROVE: (id: string) => `/requisitions/${id}/approve`,

  // Vendors, CRM, Automations, Scorecards
  VENDORS: "/vendors",
  VENDOR_BY_ID: (id: string) => `/vendors/${id}`,
  CRM_NOTES: "/crm/notes",
  CRM_NOTES_BY_CANDIDATE: (candidateId: string) => `/crm/notes/${candidateId}`,
  AUTOMATIONS_RULES: "/automations/rules",
  SCORECARD_TEMPLATES: "/scorecards/templates",
  SCORECARD_SUBMISSIONS: "/scorecards/submissions",
  SCORECARD_SUBMISSIONS_BY_ROUND: (roundId: string) => `/scorecards/submissions/${roundId}`,

  // Referrals & Templates & Ranking
  REFERRALS: "/referrals",
  REFERRAL_STATUS: (id: string) => `/referrals/${id}/status`,
  DOCUMENT_TEMPLATES: "/document-templates",
  DOCUMENT_TEMPLATE_GENERATE: (id: string) => `/document-templates/${id}/generate`,
  TALENT_MATCH_V2: "/api/v2/talent/match",
  RANKING_V2_RANK: "/api/v2/ranking/rank",
  RANKING_V2_TOP: (jobId: string) => `/api/v2/ranking/top/${jobId}`,

  // Dashboard, Notifications & Analytics
  RECRUITMENT_DASHBOARD: "/recruitment/dashboard",
  RECRUITMENT_STATS: "/recruitment/stats",
  RECRUITMENT_ANALYTICS: "/recruitment/analytics",
  RECRUITMENT_NOTIFICATIONS: "/recruitment/notifications",
  RECRUITMENT_NOTIFICATION_READ: (id: string) => `/recruitment/notifications/${id}/read`,
  AI_RECRUITER_DASHBOARD: "/ai/recruiter/dashboard",
  AI_RECRUITER_FUNNEL: "/ai/recruiter/funnel",
  AI_RECRUITER_MATCH_DISTRIBUTION: "/ai/recruiter/match-distribution",
  AI_RECRUITER_ANALYTICS: "/ai/recruiter/analytics",
  AI_RECRUITER_RANK: "/ai/recruiter/rank",
  AI_RECRUITER_MATCH: "/ai/recruiter/match",
  AI_RECRUITER_INTERVIEW_QUESTIONS: "/ai/recruiter/interview/questions",
  AI_RECRUITER_RESUME_ANALYZE: "/ai/recruiter/resume/analyze",
  AI_RECRUITER_CANDIDATE_SCORE: (id: string) => `/ai/recruiter/candidate/${id}/score`,
  AI_RECRUITER_CANDIDATE_RECOMMENDATION: (id: string) =>
    `/ai/recruiter/candidate/${id}/recommendation`,
} as const;

export const SCREENING_V2_ENDPOINTS = {
  SCREEN: "/api/v2/screening/screen",
  BATCH_SCREEN: "/api/v2/screening/batch-screen",
  RUN_JOB: (jobId: string) => `/api/v2/screening/jobs/${jobId}/run`,
  JOB_RESULTS: (jobId: string) => `/api/v2/screening/jobs/${jobId}/results`,
  DECISION: (screeningId: string) => `/api/v2/screening/results/${screeningId}/decision`,
  HISTORY: (applicationId: string) => `/api/v2/screening/history/${applicationId}`,
} as const;

export const INTERVIEW_BOT_V2_ENDPOINTS = {
  SESSIONS: "/api/v2/interview-bot/sessions",
  SESSION_START: (sessionId: string) => `/api/v2/interview-bot/sessions/${sessionId}/start`,
  SESSION_ANSWER: (sessionId: string) => `/api/v2/interview-bot/sessions/${sessionId}/answer`,
  SESSION_PROCTOR_ALERT: (sessionId: string) =>
    `/api/v2/interview-bot/sessions/${sessionId}/proctor-alert`,
  SESSION_FINALIZE: (sessionId: string) => `/api/v2/interview-bot/sessions/${sessionId}/finalize`,
  GENERATE_QUESTIONS: "/api/v2/interview/generate-questions",
  EVALUATE_ANSWER: "/api/v2/interview/evaluate-answer",
  SUBMIT_ANSWERS: "/api/v2/interview/submit-answers",
  SESSION_GET: (sessionId: string) => `/api/v2/interview/session/${sessionId}`,
} as const;

export const ANALYTICS_V2_ENDPOINTS = {
  DASHBOARD: "/api/v2/analytics/dashboard",
  DEPARTMENT: "/api/v2/analytics/department",
  HIRING_FUNNEL: "/api/v2/analytics/hiring-funnel",
  INTERVIEW_SUCCESS: "/api/v2/analytics/interview-success",
  OFFER_ACCEPTANCE_RATE: "/api/v2/analytics/offer-acceptance-rate",
  RECRUITER_PERFORMANCE: "/api/v2/analytics/recruiter-performance",
  SOURCE_PERFORMANCE: "/api/v2/analytics/source-performance",
  TIME_TO_HIRE: "/api/v2/analytics/time-to-hire",
} as const;

export const PUBLIC_CAREER_ENDPOINTS = {
  LIST: "/api/public/careers",
  SEARCH: "/api/public/careers/search",
  FILTER: "/api/public/careers/filter",
  BY_SLUG: (slug: string) => `/api/public/careers/${slug}`,
  APPLY_BY_SLUG: (slug: string) => `/api/public/careers/${slug}/apply`,
  BY_UKEY: (ukey: string) => `/api/public/careers/apply/${ukey}`,
  APPLY_BY_UKEY: (ukey: string) => `/api/public/careers/apply/${ukey}`,
} as const;
