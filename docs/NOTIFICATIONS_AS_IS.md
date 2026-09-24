# NOTIFICATIONS AS-IS AUDIT

**Project**: `aurix-ai-for-main` (OFC360 Platform)  
**Date**: September 2026  
**Auditor**: Antigravity Agent  
**Purpose**: Map and analyze all existing notification surfaces, mock implementations, settings mismatches, service worker unregister routines, and API endpoints across the codebase prior to implementing the real notification system.

---

## Executive Summary

The application currently has **no real, persisted notification system**. While the UI displays a notification bell icon, notification center pages, widgets across executive/manager/employee dashboards, and notification settings toggles, these are almost entirely backed by:
1. Hardcoded empty arrays (`[]`), static icons, or fake local React component state.
2. An inverse/corrupted mapping in `src/features/settings/api.ts` that maps completely unrelated backend keys to HR alert labels (e.g. Leave Alerts maps to `slackAlerts`, Payroll Alerts maps to `weeklyDigest`).
3. Aggressive service-worker unregistration logic in `src/lib/chunk-reload.ts` and `src/routes/__root.tsx` that blindly destroys any registered service workers on every single page load.
4. Total separation between user actions (toasts via `sonner`, ~713 occurrences) and persisted system notifications.

---

## 1. Inventory of Current Notification Surfaces

| Surface / Component | Location | Status | Current Implementation | Target Transformation (Phases 1-6) |
|---|---|---|---|---|
| **Top Navigation Bell** | `src/components/aurix/DashboardShell.tsx` (L725-728) | **100% Fake** | Static `<button>` with `<Bell className="h-4 w-4" />` and a hardcoded red dot `<span className="bg-destructive" />`. No click handler, no popover, no unread count. | Replace with interactive Popover/Sheet, live unread badge count (capped at 99+), preview of latest 10 notifications, quick "Mark all read", category tabs, and link to full page. |
| **Recruitment Notifications Page** | `src/features/admin/recruitment/pages/RecruitmentNotificationsPage.tsx` | **100% Fake** | Uses `const seed: N[] = []; const [items, setItems] = useState<N[]>(seed);`. Filter tabs and "Mark all read" only mutate local React state. Zero backend calls. | Replace with shared `<NotificationList />` filtered by `module=recruitment`, backed by `useNotifications()` TanStack Query hook. |
| **Executive Dashboard Notification Center** | `src/features/dashboard/ExecutiveDashboard.tsx` (L94, L965-1010) | **100% Fake** | Uses `const NOTIFICATIONS: NotificationItem[] = [];` and local React `useState<string[]>([])` for dismissed notifications. | Replace with top-priority real alerts using `useNotifications({ priority: "high,critical", limit: 5 })`. |
| **Manager Dashboard Notification Center** | `src/features/portal/manager/ManagerDashboard.tsx` (L73, L939-1010) | **100% Fake** | Uses `const MANAGER_NOTIFICATIONS: any[] = [];` and local React dismiss state. | Wire to real notifications query filtered by manager's direct reports and approvals (`category=approvals,attendance,leave`). |
| **Employee Dashboard Notification Center** | `src/features/portal/employee/EmployeeDashboard.tsx` (L55, L543-600) | **100% Fake** | Uses `const EMP_NOTIFICATIONS: any[] = [];` and local React dismiss state. | Wire to real employee notifications query (`limit: 5`). |
| **CheckInPage "Dynamic Notifications"** | `src/features/attendance/pages/CheckInPage.tsx` (L1267-1315) | **Client-Derived (Not API Notif)** | Shows "Today's Status": Active Shift, On Break, Shift Finished, or Late Punch Alert calculated client-side from the active attendance record. | Keep client-derived shift status as an operational widget; do not confuse with persisted notifications. Persisted attendance notifications (e.g. manager approval, late warning) come via the notification center. |
| **Notification Settings Section** | `src/features/settings/components/sections/NotificationsSection.tsx` | **Misleading UI** | UI renders toggles for Attendance Alerts, Leave Alerts, Payroll Alerts, Document Expiry Alerts. | Fix labels or map to real per-category matrix; separate company-wide channel enablement from user preferences. |
| **Settings API Notification Mapper** | `src/features/settings/api.ts` (L636-656) | **Critical Bug / Corrupted Mapping** | Scrambled keys between frontend form and backend `/settings/notifications`. Attendance alerts toggles `inAppAlerts`, Leave alerts toggles `slackAlerts`, etc. | Immediate fix in Phase 2: restore accurate semantic keys and stop sending phantom mappings. |
| **Organization Settings API** | `src/services/settingsApi.ts` (L54-64, L204-218) | **Real Endpoints (Org Scope)** | `GET/PATCH /settings/notifications` and `POST /settings/email/test`, `POST /settings/sms/test`. Uses `NotificationSettings` interface. | Retain as company/tenant-level channel enablement and test utilities. |
| **User Profile Preferences API** | `src/services/profileApi.ts` (L259-294) | **Real Endpoints (User Scope)** | `GET/PATCH /users/me/preferences` with blanket booleans `emailNotifications`, `pushNotifications`, `soundEnabled`. | Coordinate precedence between global profile toggles and granular category-channel matrix (`/notifications/preferences`). |
| **CTO Settings Notifications Tab** | `src/features/cto/pages/CtoSettingsPage.tsx` (L142-146) | **Static Text Placeholder** | Renders static message: *"No notification channels configured. Add Slack, PagerDuty, or Webhook destinations."* | In Phase 5, replace with real webhook/Slack channel integration manager. |
| **Interview Reminder Modal** | `src/features/admin/recruitment/pages/InterviewsPage.tsx` (L554-585) | **Fake Modal** | "Send Reminder Now" simply calls `toast.success()` and closes dialog. No backend call. | In Phase 5, wire to real template dispatch endpoint. |
| **Legacy Service Worker Unregister** | `src/lib/chunk-reload.ts` (L130-147) & `src/routes/__root.tsx` (L206-210) | **Destructive Routine** | Calls `navigator.serviceWorker.getRegistrations()` and unregisters every worker indiscriminately on startup. | In Phase 4, modify to whitelist `/push-sw.js` and only unregister legacy/stale workers. |

---

## 2. Detailed Technical Inspection of Components

### 2.1 DashboardShell Bell (`src/components/aurix/DashboardShell.tsx`)
- **Lines 725–728**:
  ```tsx
  <button className="relative rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer" aria-label="Notifications">
    <Bell className="h-4 w-4" />
    <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-destructive" />
  </button>
  ```
- **Issues**:
  - The red dot is permanent and hardcoded (`bg-destructive`). It never clears even if there are no notifications.
  - Clicking does nothing (no `onClick` or `Popover` trigger).
  - No `aria-expanded`, no live count, no keyboard navigation.

### 2.2 Recruitment Notifications Page (`src/features/admin/recruitment/pages/RecruitmentNotificationsPage.tsx`)
- **Lines 12–19**:
  ```tsx
  const seed: N[] = [];
  export function RecruitmentNotificationsPage() {
    const [items, setItems] = useState<N[]>(seed);
    const [filter, setFilter] = useState<Kind | "all">("all");
    const list = items.filter((n) => filter === "all" || n.kind === filter);
    const unread = items.filter((n) => !n.read).length;
    // ...
    actions={<Button onClick={() => setItems((a) => a.map((x) => ({ ...x, read: true })))}>Mark all read</Button>}
  ```
- **Issues**:
  - Entirely local in-memory state initialized to `[]`.
  - Always shows the empty state `All caught up!`.
  - No connection to any backend notification query.

### 2.3 Executive Dashboard (`src/features/dashboard/ExecutiveDashboard.tsx`)
- **Line 94**: `const NOTIFICATIONS: NotificationItem[] = [];`
- **Lines 965–1010**:
  ```tsx
  function NotificationCenter() {
    const [dismissed, setDismissed] = useState<string[]>([]);
    const visible = NOTIFICATIONS.filter((n) => !dismissed.includes(n.id));
    // ...
  ```
- **Issues**:
  - Pure mock with 0 items.
  - Dismissals stored in temporary component state (`useState`), wiped out on navigation.

### 2.4 Manager & Employee Dashboards
- `src/features/portal/manager/ManagerDashboard.tsx` (L73, L940):
  `const MANAGER_NOTIFICATIONS: any[] = [];`
- `src/features/portal/employee/EmployeeDashboard.tsx` (L55, L544):
  `const EMP_NOTIFICATIONS: any[] = [];`
- **Issues**: Same mock pattern as Executive Dashboard.

### 2.5 CheckInPage "Dynamic Notifications" (`src/features/attendance/pages/CheckInPage.tsx`)
- **Lines 1267–1315**:
  - Displays "Today's Status" (`status === "checked-in" ? "Active Shift" : ...`) and "Late Punch Alert" if `lateBy > 0`.
  - This is **client-side operational status** derived directly from the current user's check-in timestamp and schedule rules.
  - **Verdict**: Keep this operational card intact for immediate punch feedback, but do not present it as the notification system.

### 2.6 The Settings API Mapping Bug (`src/features/settings/api.ts`)
- **Lines 636–656**:
  ```ts
  export async function fetchNotificationSettings(): Promise<NotificationSettingsForm> {
    const data = await settingsApi.getNotificationSettings();
    return {
      emailNotifications: Boolean(data?.emailNotifications ?? true),
      attendanceAlerts: Boolean(data?.inAppAlerts ?? true),        // BUG: inAppAlerts mapped to attendanceAlerts
      leaveAlerts: Boolean(data?.slackAlerts ?? true),             // BUG: slackAlerts mapped to leaveAlerts
      payrollAlerts: Boolean(data?.weeklyDigest ?? true),          // BUG: weeklyDigest mapped to payrollAlerts
      documentExpiryAlerts: Boolean(data?.securityAlerts ?? true), // BUG: securityAlerts mapped to documentExpiryAlerts
      weeklyDigest: Boolean(data?.weeklyDigest ?? true),
    };
  }

  export async function updateNotificationSettings(form: NotificationSettingsForm): Promise<void> {
    await settingsApi.updateNotificationSettings({
      emailNotifications: form.emailNotifications,
      inAppAlerts: form.attendanceAlerts,        // BUG: writes back inverted key
      slackAlerts: form.leaveAlerts,             // BUG: writes back inverted key
      weeklyDigest: form.payrollAlerts,          // BUG: writes back inverted key
      securityAlerts: form.documentExpiryAlerts, // BUG: writes back inverted key
      // form.weeklyDigest is completely lost!
    });
  }
  ```
- **Impact**:
  - If a user disables "Leave Alerts", the system secretly disables **all Slack alerts** company-wide!
  - If a user disables "Payroll Alerts", the system disables the **weekly digest**!
  - If a user changes "Weekly Digest", that change is **never saved** at all!
  - This violates fundamental system integrity.

### 2.7 Service Worker Unregistration Conflict
- **`src/lib/chunk-reload.ts` (Lines 130–147)**:
  ```ts
  export function unregisterLegacyServiceWorkers(): void {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    try {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister();
        }
      });
    } catch {}
  }
  ```
- **`src/routes/__root.tsx` (Lines 206–210)**:
  ```html
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(regs) {
      regs.forEach(function(r) { r.unregister(); });
    }).catch(function() {});
  }
  ```
- **Impact**:
  - Any Web Push service worker (`push-sw.js`) registered in the browser will be immediately unregistered as soon as the user opens or refreshes any page.
  - Phase 4 must patch both locations with a URL/scope whitelist before push notifications can function.

---

## 3. Auth, State & Token Storage Findings

1. **Access Token**: Module-scoped memory in `src/api/tokens.ts` (`inMemoryAccessToken`). Never persisted to `localStorage` (any legacy keys are removed on boot).
2. **Refresh Token**: Stored in `httpOnly`, `Secure`, `SameSite` cookie managed automatically by the browser. Refresh happens via `POST /api/v1/auth/refresh` with `withCredentials: true`.
3. **SSE Implications**:
   - Native browser `new EventSource(url)` **cannot set the `Authorization: Bearer <token>` header**.
   - Putting the JWT in the URL query string (`?token=...`) is an unacceptable security risk (tokens leak in server logs, proxy access logs, and browser history).
   - **Solution**: We will implement `@microsoft/fetch-event-source` which uses the browser's `fetch()` API and supports standard `Authorization` headers and 401 token refresh loops, OR use a short-lived, single-use ticket endpoint (`POST /notifications/stream-ticket`).

---

## 4. Current Route Coverage & Access Control

- Currently **no `/dashboard/notifications` route exists**.
- `src/lib/route-guards.ts` defines role access for all `/dashboard/*` paths.
- All authenticated roles (`admin`, `super_admin`, `ceo`, `cto`, `cio`, `cfo`, `coo`, `hr`, `manager`, `employee`) must have access to `/dashboard/notifications`.
- Route title standard across the app: `"<Page Name> — OFC360"`.
