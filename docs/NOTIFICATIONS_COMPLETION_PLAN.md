# NOTIFICATIONS COMPLETION PLAN

**Project**: `aurix-ai-for-main` (OFC360 Platform)  
**Date**: September 2026  
**Architecture**: TanStack Start + React 19 + TypeScript + Vite, Redux Toolkit, TanStack Query, Axios, Zod, Radix/shadcn UI.  
**Decisions Applied**:
- `REALTIME` = `"sse"` (fetch-based with `@microsoft/fetch-event-source` or short-lived stream ticket)
- `PUSH` = `"no"` (Phase 4 architectural groundwork ready, activation deferred until backend VAPID support is enabled)
- `CHANNELS` = `"in-app,email"` (modular for Slack/webhook/SMS expansion)
- `RETENTION_DAYS` = `90` (backend archival policy, UI communicates to users)
- `BACKEND_STATUS` = `"not built yet"` (strict graceful 404/501 capability degradation)
- `DEV_SANDBOX` = `"no"` (zero-mock, no fake seed data in UI)

---

## 1. Core Architecture & Global Invariants

### 1.1 Toast vs. Notification Distinction
- **Toast (`sonner`, 713 call sites)**: Ephemeral, immediate feedback for a direct user action (e.g. *"Settings saved"*, *"Employee invited"*). Never persisted; disappears after a few seconds.
- **Notification**: Persisted record of an asynchronous system event, business milestone, or incoming request (e.g. *"Payroll cycle awaiting your approval"*, *"Leave request submitted by John Doe"*). Lives in the database, appears in the bell dropdown and notification center, supports read/unread/archive states.
- **Strict Rule**: Toasts and Notifications must never be conflated. Toasts will only be triggered by the notification system for incoming **high/critical priority** events with strict coalescing (max 3 toasts / 10 seconds).

### 1.2 State Management & Source of Truth
- **Single Source of Truth**: The **TanStack Query cache** (`['notifications', ...]` and `['notifications', 'unread-count']`).
- **No Redux / LocalStorage Stash**: Notification arrays will never be mirrored into Redux or LocalStorage.
- **Realtime Sync**: SSE events patch the TanStack Query cache directly using `queryClient.setQueryData` and selective invalidations.
- **Cross-Tab Synchronization**: Managed via `BroadcastChannel('ofc360_notifications')` for instant read/unread sync across all open browser tabs.

### 1.3 Zero-Mock & Capability Degradation
- No hardcoded notification lists, fake dots, or random seed items.
- If the backend returns `404 Not Found` or `501 Not Implemented`, the frontend displays a standard graceful empty state:
  > *"Notification service is coming soon to your workspace. (Backend endpoint pending)"*
- Loading states will use sleek skeleton loaders; error states will provide retry controls.

### 1.4 Security & Privacy Guardrails
1. **Rendering Safety**: Title, body, and metadata are **strictly rendered as plain text**. Under no circumstances will `dangerouslySetInnerHTML` be used for notification content.
2. **Link Allowlist**: Navigation links in notifications must match an internal route allowlist (`/dashboard/*`, `/settings/*`, `/portal/*`). Any link starting with `javascript:`, `data:`, or external protocols (`http://`, `https://`) is rejected or sanitized to fallback internal routes.
3. **RBAC Deep Link Protection**: When a user clicks a notification linking to `/dashboard/payroll/...`, existing route guards (`checkRouteAccess` in `src/lib/route-guards.ts`) verify permissions before granting access.
4. **PII Scrubbing**: Notification payloads must never log salary figures, bank account numbers, passwords, or personal identity numbers to console or error tracking. Sentry telemetry (when initialized) must scrub `notification.title`, `notification.body`, and `notification.metadata`.

---

## 2. Phase-by-Phase Roadmap

### PHASE 0: Plan & Contract (Current Phase)
- [x] **0.1 AS-IS Audit**: Documented in `docs/NOTIFICATIONS_AS_IS.md`.
- [x] **0.2 Completion Plan**: Documented in `docs/NOTIFICATIONS_COMPLETION_PLAN.md`.
- [x] **0.3 Backend Contract**: Documented in `docs/NOTIFICATIONS_BACKEND_CONTRACT.md`.
- [x] **0.4 Event Matrix**: Documented in `docs/NOTIFICATIONS_EVENT_MATRIX.md`.
- [ ] **0.5 Clarifications & Sign-off**: User questions submitted, waiting for approval before starting Phase 1.

---

### PHASE 1: Core In-App Notification Center
**Objective**: Replace the hardcoded red dot in `DashboardShell` and fake pages with a real, responsive notification popover and full-page notification center.

1. **Directory Structure**:
   ```
   src/features/notifications/
   ├── api/
   │   ├── notificationsApi.ts      # Axios calls with Zod parsing & capability checks
   │   └── queryKeys.ts             # TanStack Query key factory
   ├── types/
   │   ├── notification.ts          # Zod schemas & TypeScript types
   │   └── preferences.ts           # Preference matrix types
   ├── hooks/
   │   ├── useNotifications.ts      # Infinite cursor query
   │   ├── useUnreadCount.ts        # Polling/cached unread count hook
   │   └── useNotificationActions.ts# Optimistic mark read, unread, archive
   ├── components/
   │   ├── NotificationBell.tsx     # Topbar bell button with real badge & Popover
   │   ├── NotificationPopover.tsx  # Latest 10 items, tab filters, quick actions
   │   ├── NotificationItem.tsx     # Individual notification row (accessible, plain-text)
   │   ├── NotificationList.tsx     # Reusable virtualized/infinite list
   │   ├── NotificationSkeleton.tsx # Skeleton loader
   │   └── NotificationEmptyState.tsx# 404/501 capability + empty state
   ├── pages/
   │   └── NotificationsPage.tsx    # Full /dashboard/notifications page
   └── utils/
       ├── safeLinks.ts             # Internal link validator & allowlist
       ├── formatTime.ts            # Relative time formatting (date-fns)
       └── capability.ts            # Detect 404/501 backend unavailability
   ```

2. **Core Functionality**:
   - **`useNotifications`**: Infinite TanStack Query (`useInfiniteQuery`) supporting cursor pagination (`cursor`, `limit=20`), filters (`unread`, `category`, `priority`, `module`).
   - **`useUnreadCount`**: Caches and periodically refreshes the badge count with smart window focus and document visibility checks (`document.visibilityState === 'visible'`).
   - **Optimistic Updates**: `useMarkRead`, `useMarkAllRead`, `useArchive` optimistically update query cache and unread count, rolling back seamlessly on network failure.
   - **Bell Component**:
     - Dynamic badge count: shows `1` to `99`, or `99+`. If 0 unread, badge is hidden.
     - `aria-label="Notifications, N unread"`.
     - Popover opens on click, supports `Escape` key dismissal, focus trap, and keyboard navigation.
   - **Full Page `/dashboard/notifications`**:
     - Register route in TanStack Router: `src/routes/dashboard.notifications.tsx`.
     - Add route to `src/lib/route-guards.ts` for all authenticated roles.
     - Provide full filtering (Category, Priority, Unread Only, Date Range) and bulk actions.
   - **Retire Existing Fakes**:
     - Replace fake seed in `RecruitmentNotificationsPage.tsx` with `<NotificationList module="recruitment" />`.
     - Replace fake arrays in `ExecutiveDashboard.tsx`, `ManagerDashboard.tsx`, and `EmployeeDashboard.tsx` with real prioritized hooks.

---

### PHASE 2: Preferences & Settings Bug Fix
**Objective**: Fix the corrupted settings mapping bug immediately, design the 3-tier preference model, and build the user preference matrix.

1. **Bug Fix in `src/features/settings/api.ts`**:
   - Disconnect HR operational alert toggles from backend channel toggles (`inAppAlerts`, `slackAlerts`, `weeklyDigest`, `securityAlerts`).
   - Update `NotificationsSection.tsx` to display truthful labels for the current backend capabilities:
     - Email Alerts (`emailNotifications`)
     - In-App Alerts (`inAppAlerts`)
     - Slack Alerts (`slackAlerts`)
     - Weekly Digest (`weeklyDigest`)
     - Security Alerts (`securityAlerts`)
   - Ensure `weeklyDigest` is correctly passed in `updateNotificationSettings`.
2. **Three-Tier Precedence Architecture**:
   - **Tier 1 (Org Policy)**: `GET/PATCH /settings/notifications` — Which channels the company enables workspace-wide.
   - **Tier 2 (User Preferences)**: `GET/PUT /notifications/preferences` — Per-user Category $\times$ Channel matrix within org-allowed channels, quiet hours schedule, and digest preferences.
   - **Tier 3 (User Profile Legacy)**: `GET/PATCH /users/me/preferences` — Synchronize blanket toggles with the matrix.
3. **Settings UI (Settings > Notifications)**:
   - Category $\times$ Channel matrix (In-App, Email).
   - Mandatory categories: Security (logins/passwords), Payroll Approvals (`payroll.run_approval_needed`), and Exit Clearance (`exit.clearance_requested`) are strictly locked with a disabled toggle and explanatory tooltip.
   - Quiet hours default to disabled (`enabled: false`), allowing users to opt in and configure start/end times in their local timezone.
   - Active delivery channels in the matrix are strictly In-App and Email; third-party integrations (Slack, Webhook) remain under Admin integrations until backend readiness.
   - "Send Test Notification" triggers real backend test endpoint (`/settings/email/test`, `/settings/sms/test`, `/notifications/test`).

---

### PHASE 3: Realtime Transport (SSE)
**Objective**: Live push updates to browser tabs without polling overhead, maintaining cache consistency.

1. **Transport Implementation**:
   - Use `@microsoft/fetch-event-source` connecting to `GET /api/v1/notifications/stream`.
   - Passes `Authorization: Bearer <inMemoryAccessToken>` directly via HTTP headers.
   - On 401 Unauthorized, automatically triggers `refreshAccessToken()` from `src/api/apiInstance.ts` and reconnects with the fresh token.
   - Reconnection strategy: Exponential backoff with jitter (1s, 2s, 4s, 8s, up to 30s max).
   - Sends `Last-Event-ID` on reconnect to fetch missed notifications.
2. **Cache Patching & Deduplication**:
   - Handlers for `notification.created`, `notification.updated`, `notification.read`, `unread_count`.
   - On `notification.created`: prepends to `['notifications']` query data and increments `unread-count`. Deduplicates by `id` or `dedupeKey`.
   - On `notification.read`: updates matching item's `readAt` and decrements `unread-count`.
3. **Multi-Tab Leadership**:
   - Avoid multiple simultaneous SSE connections per user across open tabs.
   - Use `BroadcastChannel('ofc360_notifications')` with a simple leader election or Web Locks API (`navigator.locks`).
   - The leader tab maintains the SSE stream and broadcasts events to all follower tabs.
4. **Toast Coalescing**:
   - Critical events trigger an in-app sonner toast.
   - Burst limiter: max 3 toasts per 10 seconds; subsequent events in that burst are grouped into *"and N more updates"*.
5. **Accessibility**:
   - Dynamic additions announced via a throttled `aria-live="polite"` region.
   - Bell wiggle animation respects `prefers-reduced-motion: reduce`.

---

### PHASE 4: Browser Web Push (Architectural Groundwork)
**Objective**: Prepare the Web Push infrastructure and fix the service worker unregister conflict.

1. **Service Worker Conflict Fix**:
   - Update `src/lib/chunk-reload.ts` (`unregisterLegacyServiceWorkers`): only unregister workers whose script URL does not match `/push-sw.js`.
   - Update `src/routes/__root.tsx`: prevent inline script from nuking active push workers.
2. **`public/push-sw.js`**:
   - Lightweight service worker dedicated purely to Web Push events.
   - Listens to `push` event, shows generic non-sensitive title/body.
   - Listens to `notificationclick`: checks allowlist, focuses existing window/tab if open, or navigates safely.
3. **Lifecycle & UX**:
   - Never show browser permission prompt on page load.
   - Only triggered when the user explicitly clicks "Enable Push Notifications" in Settings or the Bell popover.
   - Handle permission states: `default`, `granted`, `denied`. If denied, render helpful instructions for browser settings.
   - When `PUSH = "no"`, UI hides push toggles or displays *"Web push notifications not enabled for this workspace"*.

---

### PHASE 5: Admin Broadcasts & Integrations
**Objective**: Enable HR and IT administrators to broadcast announcements and configure third-party notification channels.

1. **Broadcast Announcements**:
   - Endpoint: `POST /notifications/broadcasts`.
   - Composer UI: Title, body, priority, target audience (All Employees, Specific Department, Specific Role), delivery channels.
   - Recipient count estimation preview before dispatch.
   - Confirmation dialog with explicit safety check.
   - Delivery stats dashboard: Sent, Read, Failed count.
2. **Integration Channels (`CtoSettingsPage`)**:
   - Replace placeholder text in `src/features/cto/pages/CtoSettingsPage.tsx`.
   - Destination management: Slack incoming webhooks, generic webhooks.
   - Security: Webhook URLs and secrets are masked after input; never echoed in plain text from the backend.
3. **Interview Reminder Dispatch**:
   - Connect `src/features/admin/recruitment/pages/InterviewsPage.tsx` reminder modal to real backend recruitment reminder dispatch endpoint.

---

### PHASE 6: Module Wiring & Type Registry
**Objective**: Deeply integrate notifications into every business module with deep linking and contextual badges.

1. **Type Registry (`src/features/notifications/registry.ts`)**:
   - Comprehensive registry mapping each `notification.type` to:
     - Friendly category & module
     - Lucide icon component
     - Default priority & styling
     - Safe deep-link resolver function
     - Mandatory flag (whether user can opt out)
2. **Module Deep Link Validation**:
   - Payroll: `/dashboard/payroll/runs/:runId/review`, `/dashboard/payroll/runs/:runId/preview`
   - Attendance: `/dashboard/workforce/attendance`, `/dashboard/attendance/checkin`
   - Leaves: `/dashboard/workforce/leaves`
   - Documents: `/dashboard/documents`, `/dashboard/employee/documents`
   - Assets: `/dashboard/assets`
   - Recruitment: `/dashboard/recruitment/interviews`, `/dashboard/recruitment/candidates/:id`
3. **Fallback Grace**: Unknown notification types render cleanly with a generic bell icon and safe link validation rather than crashing the interface.

---

### PHASE 7: Hardening, Security & Verification
**Objective**: Ensure enterprise-grade reliability, compliance, and automated test coverage.

1. **Performance**: Virtualized list rendering for large notification histories; zero re-render storms during high-frequency event bursts.
2. **Accessibility**: Full WCAG 2.2 AA audit, screen-reader testing, focus indicators, keyboard accessibility for popovers and list items.
3. **Security Checklist**:
   - Cross-Site Scripting (XSS): Verify all text nodes are rendered safely.
   - Open Redirect Prevention: Verify no arbitrary external URLs can be opened.
   - Sensitive Data Protection: Zero salary or PII logs.
   - SSE Token Isolation: No token in query params.
4. **Automated Vitest & MSW Suite**:
   - Unit tests for optimistic updates and rollbacks.
   - MSW handlers for 200 OK, 400 Bad Request, 401 Unauthorized, 404 Not Found, 501 Not Implemented.
   - Capability degradation verification (graceful display when backend is pending).

---

## 3. Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| **Backend Not Built Yet (404/501)** | User sees broken screens or console error spam | Centralized `isBackendCapabilityAvailable()` utility that intercepts 404/501 responses and renders a unified "Coming Soon / Backend Pending" state without throwing uncaught errors. |
| **SSE Reconnection Storms** | Overwhelms server if multiple tabs disconnect simultaneously | Exponential backoff with random jitter, plus multi-tab leader election to ensure only 1 active SSE connection per client machine. |
| **Service Worker Conflict** | Legacy code unregisters push worker repeatedly | Strict whitelist check matching script name `/push-sw.js` in `chunk-reload.ts` and `__root.tsx`. |
| **Deep Link Permission Denial** | User clicks notification link for a role they do not possess | Standard route-guard redirection to `/dashboard/forbidden` or default home page with friendly toast message. |
| **Memory Leaks from Event Listeners** | Degrades tab performance over long sessions | Strict cleanup routines in `useEffect` for SSE event streams and BroadcastChannel listeners on unmount. |
