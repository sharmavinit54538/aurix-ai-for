# Contract Decisions & API Reconciliation

This document records the architectural and API contract decisions established between the frontend (`aurix-ai-for`) and backend (`apiofc360`).

## 1. Authentication & Session Management (F-01 / B-01)
- **Token Delivery**: Backend issues `ofc360_refresh_token` as an HttpOnly, Secure cookie (`path=/api/v1/auth`, `SameSite=Lax`). Backend also returns `refresh_token` in body for backwards compatibility.
- **Frontend Token Storage**: Access token is stored strictly in memory (`src/api/tokens.ts`). Refresh token is never stored in `localStorage` or `sessionStorage`.
- **Session Hint**: Frontend stores a non-sensitive flag `ofc_session_hint=1` in `localStorage` upon successful login/refresh. Cleared on logout/failed refresh. On app boot, refresh is attempted only if `ofc_session_hint` exists; otherwise redirect directly to login without a 401 error.
- **Refresh Endpoint**: `POST /api/v1/auth/refresh` called with `withCredentials: true`.
- **Single-Flight Concurrency**: Within tab, concurrent 401s share a single refresh promise. Across tabs, `navigator.locks` with `BroadcastChannel` fallback coordinates refresh attempts so only one tab executes refresh.

## 2. Data Layer Conventions (F-02 / B-02)
- **List Shape**: List endpoints return `{ items: T[], total: number, page: number, limit: number }`. Frontend maintains backward-compatibility parser to handle both array responses and object responses.
- **Timestamps**: All timestamps sent to API are ISO strings in UTC format (`new Date(\`${date}T${time}\`).toISOString()`). Frontend formats them with `Intl.DateTimeFormat` in user local timezone.
- **AI Scores & Thresholds**: Already scaled 0–100. Frontend does not multiply by 100 or rescale.
- **Polling Backoff**: All pollers use self-scheduling timeouts with exponential backoff (e.g., 3s -> 10s -> max 60s), stop on component unmount, tab hidden (`document.visibilityState === 'hidden'`), and stop after 3 consecutive failures.

## 3. AI Screening Contract (F-03 / B-04)
- `GET /api/v2/screening/jobs/{id}/results` -> `{ thresholds: { shortlist: number, reject: number } | null, run: { run_id, status, completed, total } | null, results: AIScreeningResult[] }`.
- `POST /api/v2/screening/jobs/{id}/run` `{ application_ids?: string[], model?: string, force?: boolean }` -> 202 `{ run_id, status, total }`.
- `POST /api/v2/screening/results/{screening_id}/decision` `{ action: "SHORTLIST" | "REJECT" | "KEEP_REVIEW", reason?: string }` -> `{ data: AIScreeningResult }`.
- Safe screening IDs only: no candidate ID or application ID fallback for screening decision calls. Rejection requires minimum 10-character reason.

## 4. Interviews Contract (F-04 / B-05)
- Separate ID taxonomy: `interview_id`, `round_id`, `schedule_id`, `application_id`.
- `GET /interviews?status=&from=&to=&job_id=&candidate_id=&interviewer_id=&page=&limit=` -> `{ items, total, page, limit }`.
- `GET /interviews/interviewers` -> `[{ id, name, email }]`.
- `POST /interviews/{interview_id}/rounds/{round_id}/schedule` -> schedule interview.
- `PATCH /interviews/schedules/{id}/reschedule` -> reschedule.
- `POST /interviews/schedules/{id}/cancel` -> cancel with reason.
- `POST /interviews/schedules/{id}/reminder` -> send reminder.
- `PATCH /interviews/schedules/{id}/no-show` -> mark no-show.
- `PATCH /interviews/rounds/{round_id}/pass|reject|hold` -> submit scorecard feedback.
- Cancel/reschedule never invoke scorecards endpoint.

## 5. Candidate Public Booking & AI Interview (F-05 / B-06)
- `/interview/book/$token` -> Candidate slot picker, confirms booking, downloads client-side `.ics`.
- `/ai-interview/$token` -> Candidate text-only AI interview session (gated by `VITE_AI_INTERVIEW_ENABLED`).
- HR AI Interview tab under recruitment for scheduling bot invites and viewing transcripts & insights.

## 6. Real APIs for Browser-Only Features (F-07 / B-09)
- Expenses: `/api/v2/expenses`
- Visitors: `/api/v2/visitors`
- Travel: `/api/v2/travel`
- Offboarding: `/api/v1/exits`
- Onboarding Checklist: `/api/v1/onboarding`
- Assets: `/api/v1/assets`
- HR-Ops Command Center: `GET /api/v2/hr-ops/overview`

## 7. Executive Dashboards (F-08 / B-10)
- `GET /api/v2/executive/overview?role=ceo|cfo|coo|cmo|cto|cio`
- Only verified metrics returned. Unmeasured metrics flagged with `available: false` or omitted.
- No placeholder "—" tiles or fabricated metrics.
