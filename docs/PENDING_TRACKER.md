# Pending Tracker — aurix-ai-for

| ID | Status | Files changed | Tests added | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **F-00.1** | DONE | `docs/PENDING_TRACKER.md` | None | Baseline recorded: typecheck green (0 errors), lint green (0 errors, 2036 warnings), build green, tests 30 passed / 4 pre-existing failures |
| **F-00.2** | DONE | `docs/API_GAPS.md`, `docs/CONTRACT_DECISIONS.md`, `scripts/analyze-api-gaps.py` | None | Analyzed 460 frontend API calls vs backend route catalog; categorized FRONTEND_FIX, BACKEND_ADD, REMOVE_DEAD |
| **F-00.3** | DONE | `docs/ROUTES.md`, `scripts/generate-routes-doc.py` | None | Route inventory generated across all 247 route files with component and data source mapping |
| **F-01.1** | DONE | `src/api/apiInstance.ts`, `src/api/tokens.ts`, `src/api/auth.ts`, `src/lib/auth-bootstrap.ts` | `src/api/__tests__/authSession.test.ts` | HttpOnly cookie refresh restoration on reload via POST /api/v1/auth/refresh with empty body & withCredentials |
| **F-01.2** | DONE | `src/api/tokens.ts`, `src/lib/auth-bootstrap.ts`, `src/api/apiInstance.ts` | `src/api/__tests__/authSession.test.ts` | Non-sensitive ofc_session_hint=1 flag in localStorage; boot refreshes ONLY if hint exists; silent 401 on boot |
| **F-01.3** | DONE | `src/api/apiInstance.ts` | `src/api/__tests__/authSession.test.ts` | Single-flight refresh in tab; navigator.locks with BroadcastChannel fallback across tabs; session expired toast & return redirect |
| **F-01.4** | DONE | `src/api/tokens.ts` | `src/api/__tests__/authSession.test.ts` | In-memory token storage only; safeStorage refresh token persistence completely removed |
| **F-01.5** | DONE | `src/api/__tests__/authSession.test.ts` | `src/api/__tests__/authSession.test.ts` | Complete Vitest test suite for cookie reload, no refresh without hint, single-flight refresh, failed refresh logout, hint clearing |
| **F-02.1** | DONE | `src/features/admin/recruitment/recruitmentThunk.ts`, `src/features/admin/recruitment/hooks/useRecruitment.ts` | `src/features/admin/recruitment/__tests__/recruitmentDataLayer.test.tsx` | inFlightFetchRecruitmentPromise module deduplication, condition check on loading & 30s TTL, StrictMode protected |
| **F-02.2** | DONE | `src/services/notificationsApi.ts`, `src/features/notifications/hooks.ts` | `src/features/admin/recruitment/__tests__/recruitmentDataLayer.test.tsx` | Notifications unread-count circuit breaker on 404/5xx, tab visibility check, derived unread count from list |
| **F-02.3** | DONE | `src/hooks/usePoller.ts`, `src/features/leaves/pages/LeavesPage.tsx`, `src/pages/PayrollProcessingPage.tsx` | `src/features/admin/recruitment/__tests__/recruitmentDataLayer.test.tsx` | Reusable usePoller with exponential back-off, stop on hidden tab, stop on 3 consecutive non-2xx errors |
| **F-02.4** | DONE | `src/api/utils.ts`, `src/api/index.ts`, `src/features/admin/recruitment/utils/apiMappers.ts` | `src/features/admin/recruitment/__tests__/recruitmentDataLayer.test.tsx` | Universal parseListResponse and extractItems supporting {items,total,page,limit} and raw arrays |
| **F-02.5** | DONE | `src/api/apiInstance.ts`, `src/features/admin/recruitment/hooks/useRecruitment.ts` | None | All logging isolated to import.meta.env.DEV, duplicate effect dependencies removed |
| **F-03.1** | DONE | `src/services/screeningApi.ts`, `src/features/admin/recruitment/recruitmentSlice.ts`, `src/features/admin/recruitment/utils/apiMappers.ts` | `src/features/admin/recruitment/__tests__/AIScreeningPage.test.tsx` | Removed fake 85/60 defaults; null thresholds until backend returns; 404 throws and displays inline error state with Retry |
| **F-03.2** | DONE | `src/features/admin/recruitment/pages/AIScreeningPage.tsx`, `src/features/admin/recruitment/utils/apiMappers.ts` | `src/features/admin/recruitment/__tests__/AIScreeningPage.test.tsx` | Scores rounded to integer, displayed once with %; confidence <= 1 ? * 100 hack removed; no rescaling |
| **F-03.3** | DONE | `src/features/admin/recruitment/pages/AIScreeningPage.tsx` | `src/features/admin/recruitment/__tests__/AIScreeningPage.test.tsx` | Dead weight sliders and state removed; replaced with read-only criteria card: thresholds + 'AI recommends, a human decides' |
| **F-03.4** | DONE | `src/features/admin/recruitment/pages/AIScreeningPage.tsx` | `src/features/admin/recruitment/__tests__/AIScreeningPage.test.tsx` | Uses candidate.screeningId strictly; Shortlist/Reject disabled unless COMPLETED && screeningId && !humanDecision with tooltip 'Run AI screening first'; Reject reason >= 10 chars with confirm dialog |
| **F-03.5** | DONE | `src/features/admin/recruitment/pages/AIScreeningPage.tsx` | `src/features/admin/recruitment/__tests__/AIScreeningPage.test.tsx` | Polling on PENDING/RUNNING with 3s->10s exponential back-off; stops on COMPLETED/FAILED/unmount/3 errors; 10 min timeout toast + manual refresh |
| **F-03.6** | DONE | `src/features/admin/recruitment/pages/AIScreeningPage.tsx`, `src/features/admin/recruitment/recruitmentSlice.ts`, `src/features/admin/recruitment/recruitmentThunk.ts` | `src/features/admin/recruitment/__tests__/AIScreeningPage.test.tsx` | Job switching immediately dispatches clearScreeningState() and fetches; stale responses from prior jobs ignored |
| **F-03.7** | DONE | `src/features/admin/recruitment/pages/AIScreeningPage.tsx` | `src/features/admin/recruitment/__tests__/AIScreeningPage.test.tsx` | Candidate matching by application_id/candidate_id only (name matching completely removed); no invented candidates from screeningResults |
| **F-03.8** | DONE | `src/features/admin/recruitment/pages/AIScreeningPage.tsx` | `src/features/admin/recruitment/__tests__/AIScreeningPage.test.tsx` | Fixed candidate skills fallback bug; missing skills isolated to Missing Skills section only |
| **F-03.9** | DONE | `src/features/admin/recruitment/utils/apiMappers.ts`, `src/features/admin/recruitment/pages/AIScreeningPage.tsx`, `src/features/admin/recruitment/types/index.ts` | `src/features/admin/recruitment/__tests__/AIScreeningPage.test.tsx` | Full applications array preserved; multi-application candidates resolve the application matching selectedJobId |
| **F-03.10** | DONE | `src/features/admin/recruitment/pages/AIScreeningPage.tsx`, `src/services/screeningApi.ts`, `src/features/admin/recruitment/recruitmentThunk.ts` | `src/features/admin/recruitment/__tests__/AIScreeningPage.test.tsx` | Run button defaults to unscreened applications; secondary 'Re-screen all (uses more AI credits)' with force:true behind confirm; Retry on FAILED sends applicationIds: [cand.applicationId] |
| **F-03.11** | DONE | `src/features/admin/recruitment/recruitmentThunk.ts`, `src/features/admin/recruitment/recruitmentSlice.ts` | `src/features/admin/recruitment/__tests__/AIScreeningPage.test.tsx` | Fake fallback object removed from decision thunk; reducer replaces only humanDecision, humanDecisionBy, humanDecisionReason, humanDecidedAt |
| **F-03.12** | DONE | `src/features/admin/recruitment/pages/AIScreeningPage.tsx` | `src/features/admin/recruitment/__tests__/AIScreeningPage.test.tsx` | FAILED rows display backend error + Retry button; unscreened rows show 'Not screened yet' without fake score |
| **F-03.13** | DONE | `src/features/admin/recruitment/__tests__/AIScreeningPage.test.tsx` | `src/features/admin/recruitment/__tests__/AIScreeningPage.test.tsx` | Comprehensive Vitest suite with 10 passing tests verifying all F-03 contract and safety requirements |
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
