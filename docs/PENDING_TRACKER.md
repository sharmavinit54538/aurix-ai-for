# Pending Tracker — aurix-ai-for

| ID | Status | Files changed | Tests added | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **F-00.1** | DONE | `docs/PENDING_TRACKER.md` | None | Baseline recorded: typecheck green (0 errors), lint green (0 errors, 2036 warnings), build green, tests 30 passed / 4 pre-existing failures |
| **F-00.2** | DONE | `docs/API_GAPS.md`, `docs/CONTRACT_DECISIONS.md`, `scripts/analyze-api-gaps.py` | None | Analyzed 460 frontend API calls vs backend route catalog; categorized FRONTEND_FIX, BACKEND_ADD, REMOVE_DEAD |
| **F-00.3** | DONE | `docs/ROUTES.md`, `scripts/generate-routes-doc.py` | None | Route inventory generated across all 247 route files with component and data source mapping |
| **F-01.1** | TODO | None | None | HttpOnly cookie refresh restoration on reload |
| **F-01.2** | TODO | None | None | Session hint flag ofc_session_hint to avoid pre-login 401 |
| **F-01.3** | TODO | None | None | Single-flight refresh with navigator.locks & BroadcastChannel |
| **F-01.4** | TODO | None | None | Zero token storage in localStorage/sessionStorage; in-memory access token |
| **F-01.5** | TODO | None | None | Auth session & refresh tests |
| **F-02.1** | TODO | None | None | useRecruitmentBase condition/deduping & StrictMode prevention |
| **F-02.2** | TODO | None | None | Notifications unread-count circuit breaker & interval backoff |
| **F-02.3** | TODO | None | None | Self-scheduling polling with back-off & stop on unmount/hidden/errors |
| **F-02.4** | TODO | None | None | Pagination shape support {items,total,page,limit} & old array |
| **F-02.5** | TODO | None | None | Remove console.log noise and effect duplicate runs |
| **F-03.1** | TODO | None | None | AIScreeningPage remove fake default thresholds & silent 404 swallow |
| **F-03.2** | TODO | None | None | Score display cleanups, round to integer, no double rescale |
| **F-03.3** | TODO | None | None | Remove dead weight sliders; replace with read-only criteria card |
| **F-03.4** | TODO | None | None | Decision safety: use screeningId only, enable on COMPLETED, reject reason >=10 chars |
| **F-03.5** | TODO | None | None | Screening polling lifecycle, timeout, back-off, error handling |
| **F-03.6** | TODO | None | None | Job switching: clearScreeningState and ignore stale responses |
| **F-03.7** | TODO | None | None | Match by application_id/candidate_id only, no name matching |
| **F-03.8** | TODO | None | None | Fix candidate skills vs missing skills fallback bug |
| **F-03.9** | TODO | None | None | Multi-application candidates select application matching selectedJobId |
| **F-03.10** | TODO | None | None | Run button: unscreened by default, re-screen all with force:true behind confirm |
| **F-03.11** | TODO | None | None | Decision thunk & reducer cleanup, no fake fallback spread |
| **F-03.12** | TODO | None | None | FAILED row error + Retry, unscreened row status |
| **F-03.13** | TODO | None | None | AIScreening comprehensive Vitest tests |
| **F-04.1** | TODO | None | None | Interviews types & mapper: separate IDs, no fake defaults |
| **F-04.2** | TODO | None | None | Data layer: interview endpoints, remove local upsert & scorecard fallbacks |
| **F-04.3** | TODO | None | None | Schedule dialog: eligible candidate picker, real interviewer select, timezone & ISO conversion |
| **F-04.4** | TODO | None | None | Reschedule and Cancel dialogs: reasons, confirmations, no double submit |
| **F-04.5** | TODO | None | None | Feedback dialog using roundId, PASS/REJECT/HOLD, 1-5 rating, feedback >= 10 chars |
| **F-04.6** | TODO | None | None | Real reminder endpoint, cooldown timer, remove fake toast |
| **F-04.7** | TODO | None | None | Interviews tabs (Upcoming, Pending, Completed, Cancelled, No-show) & local calendar |
| **F-04.8** | TODO | None | None | Interviews test suite |
| **F-05.1** | TODO | None | None | Candidate booking public page /interview/book/$token + .ics download |
| **F-05.2** | TODO | None | None | Candidate AI interview public page /ai-interview/$token (text-only) |
| **F-05.3** | TODO | None | None | HR AI Interview tab, invite modal, results & decision UI |
| **F-05.4** | TODO | None | None | Public routes minimal shell, noindex, no PII leakage |
| **F-05.5** | TODO | None | None | Replace/relabel AIInterviewSimulatorPage as Practice simulator |
| **F-06.1** | TODO | None | None | AI Hub & Analytics API reconciliation and unused code cleanup |
| **F-06.2** | TODO | None | None | Attendance API end-to-end reconciliation |
| **F-06.3** | TODO | None | None | Settings API & method reconciliation (PUT/PATCH, branding, audit logs) |
| **F-06.4** | TODO | None | None | Profile API reconciliation (/users/me vs /profile) |
| **F-06.5** | TODO | None | None | Departments & Managers thunks reconciliation |
| **F-06.6** | TODO | None | None | Documents, Leaves, Timesheets, Policies reconciliation |
| **F-06.7** | TODO | None | None | Reports, Analytics & Payroll APIs reconciliation |
| **F-06.8** | TODO | None | None | Unavailable BACKEND_ADD features graceful disabled UI |
| **F-06.9** | TODO | None | None | scripts/check-api-contract.ts contract validation script |
| **F-07.1** | TODO | None | None | Typed API modules & mappers for browser-only features |
| **F-07.2** | TODO | None | None | Replace useHrms in Expenses, Travel, Visitors, Offboarding, Assets, HrOps |
| **F-07.3** | TODO | None | None | Deprecate and remove src/lib/hrms/store.ts and stale localStorage |
| **F-07.4** | TODO | None | None | DocumentGeneratorPage wire to real endpoint or remove placeholder |
| **F-07.5** | TODO | None | None | OnboardingPage replace hardcoded allInvites with real API |
| **F-07.6** | TODO | None | None | Tests for migrated modules |
| **F-08.1** | TODO | None | None | Executive dashboards wired to GET /api/v2/executive/overview |
| **F-08.2** | TODO | None | None | Remove unsourced tiles, clean up sidebar, docs/EXEC_PAGES_STATUS.md |
| **F-08.3** | TODO | None | None | Remove any[] placeholders and empty settings stubs |
| **F-09.1** | TODO | None | None | Consolidate duplicate routes to canonical URLs, regenerate routeTree |
| **F-09.2** | TODO | None | None | Code-split settings area into sub-routes |
| **F-09.3** | TODO | None | None | Remove unused services, thunks, and duplicate API wrappers |
| **F-10.1** | TODO | None | None | UX completeness: skeletons, inline error+retry, empty states, pending mutations |
| **F-10.2** | TODO | None | None | Form validations, required fields, confirm destructive actions |
| **F-10.3** | TODO | None | None | Route error boundaries and 403 Forbidden page matching RBAC |
| **F-10.4** | TODO | None | None | Accessibility: ARIA, focus traps, badge color contrast |
| **F-10.5** | TODO | None | None | Responsive layout verification at 375px mobile viewport |
| **F-11.1** | TODO | None | None | Comprehensive Vitest tests and route smoke test |
| **F-11.2** | TODO | None | None | Verification: typecheck, lint, test, build all green |
| **F-11.3** | TODO | None | None | docs/FRONTEND_FINAL_REPORT.md documentation |
