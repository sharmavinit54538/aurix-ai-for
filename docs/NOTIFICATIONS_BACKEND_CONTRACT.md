# NOTIFICATIONS BACKEND CONTRACT

**Specification Version**: `1.0.0-draft`  
**Status**: `PROPOSED` (except marked endpoints `CONFIRMED-in-code`)  
**Base URL**: `${API_BASE_URL}/api/v1`  
**Authentication**: All endpoints require `Authorization: Bearer <accessToken>` header unless explicitly noted.  
**Error Standard**: RFC 7807 Problem Details or `{ success: false, error: { code: string, message: string, details?: unknown } }`.

---

## 1. Core Data Models & Zod Schemas

```typescript
import { z } from "zod";

// Priority levels
export const NotificationPrioritySchema = z.enum(["low", "normal", "high", "critical"]);
export type NotificationPriority = z.infer<typeof NotificationPrioritySchema>;

// Business categories
export const NotificationCategorySchema = z.enum([
  "attendance",
  "leave",
  "payroll",
  "documents",
  "assets",
  "recruitment",
  "onboarding_exit",
  "approvals",
  "security",
  "system",
  "ai_insights",
]);
export type NotificationCategory = z.infer<typeof NotificationCategorySchema>;

// Business modules
export const NotificationModuleSchema = z.enum([
  "core_hr",
  "workforce",
  "payroll",
  "recruitment",
  "security",
  "compliance",
  "system",
]);
export type NotificationModule = z.infer<typeof NotificationModuleSchema>;

// Actor schema
export const NotificationActorSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  role: z.string().optional(),
});
export type NotificationActor = z.infer<typeof NotificationActorSchema>;

// Associated Entity schema
export const NotificationEntitySchema = z.object({
  type: z.string(), // e.g. "leave_request", "payroll_run", "candidate"
  id: z.string(),
});
export type NotificationEntity = z.infer<typeof NotificationEntitySchema>;

// Primary Notification Schema
export const NotificationSchema = z.object({
  id: z.string(),
  type: z.string(), // e.g. "leave.requested", "payroll.approval_needed"
  category: NotificationCategorySchema,
  module: NotificationModuleSchema,
  priority: NotificationPrioritySchema,
  title: z.string().max(200),
  body: z.string().max(1000), // Plain text only
  link: z.string().startsWith("/"), // Internal path only, e.g. "/dashboard/payroll/runs/123"
  entity: NotificationEntitySchema.optional(),
  actor: NotificationActorSchema.optional(),
  metadata: z.record(z.unknown()).optional(), // Non-sensitive data only (NO salary/PII)
  dedupeKey: z.string().optional(),
  createdAt: z.string().datetime(),
  readAt: z.string().datetime().nullable().optional(),
  archivedAt: z.string().datetime().nullable().optional(),
  expiresAt: z.string().datetime().nullable().optional(),
});
export type NotificationItem = z.infer<typeof NotificationSchema>;

// Cursor-paginated notification response
export const NotificationListResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    items: z.array(NotificationSchema),
    nextCursor: z.string().nullable(),
    hasMore: z.boolean(),
    totalUnread: z.number().int().nonnegative().optional(),
  }),
});

// Unread count response
export const UnreadCountResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    total: z.number().int().nonnegative(),
    byCategory: z.record(NotificationCategorySchema, z.number().int().nonnegative()).optional(),
  }),
});
```

---

## 2. Notification In-App Endpoints

### 2.1 List Notifications
- **Method**: `GET`
- **Path**: `/notifications`
- **Status**: `PROPOSED`
- **Query Parameters**:
  | Param | Type | Required | Default | Description |
  |---|---|---|---|---|
  | `cursor` | string | No | `null` | Opaque pagination cursor (created timestamp or ID) |
  | `limit` | number | No | `20` | Max items to return (1–100) |
  | `unread` | boolean | No | `false` | When `true`, returns unread notifications only |
  | `category` | string | No | - | Filter by category |
  | `priority` | string | No | - | Filter by priority |
  | `module` | string | No | - | Filter by module |
  | `includeArchived`| boolean | No | `false` | Include archived items |
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "items": [
        {
          "id": "notif_01J8K3M90A8",
          "type": "payroll.approval_needed",
          "category": "payroll",
          "module": "payroll",
          "priority": "high",
          "title": "September Payroll Ready for Review",
          "body": "Provisional calculation for September 2026 is complete. Review and approve to proceed with disbursal.",
          "link": "/dashboard/payroll/runs/run_sep_2026/review",
          "entity": { "type": "payroll_run", "id": "run_sep_2026" },
          "actor": { "id": "usr_hr_1", "name": "HR Department" },
          "createdAt": "2026-09-24T10:15:00.000Z",
          "readAt": null,
          "archivedAt": null
        }
      ],
      "nextCursor": "2026-09-24T10:15:00.000Z",
      "hasMore": false,
      "totalUnread": 1
    }
  }
  ```
- **Errors**: `401 Unauthorized`, `404 Not Found` (capability check).

---

### 2.2 Get Unread Count
- **Method**: `GET`
- **Path**: `/notifications/unread-count`
- **Status**: `PROPOSED`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "total": 3,
      "byCategory": {
        "payroll": 1,
        "leave": 2,
        "attendance": 0
      }
    }
  }
  ```

---

### 2.3 Mark Single Notification as Read
- **Method**: `POST`
- **Path**: `/notifications/{id}/read`
- **Status**: `PROPOSED`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "id": "notif_01J8K3M90A8",
      "readAt": "2026-09-24T12:00:00.000Z"
    }
  }
  ```

---

### 2.4 Mark Single Notification as Unread
- **Method**: `POST`
- **Path**: `/notifications/{id}/unread`
- **Status**: `PROPOSED`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "id": "notif_01J8K3M90A8",
      "readAt": null
    }
  }
  ```

---

### 2.5 Bulk Mark as Read
- **Method**: `POST`
- **Path**: `/notifications/read`
- **Status**: `PROPOSED`
- **Request Body**:
  ```json
  {
    "ids": ["notif_01J8K3M90A8", "notif_01J8K3M90A9"]
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "updatedCount": 2,
      "readAt": "2026-09-24T12:00:00.000Z"
    }
  }
  ```

---

### 2.6 Mark All as Read
- **Method**: `POST`
- **Path**: `/notifications/read-all`
- **Status**: `PROPOSED`
- **Request Body** (optional):
  ```json
  {
    "category": "payroll" // Omit to mark all categories read
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "updatedCount": 7,
      "readAt": "2026-09-24T12:00:00.000Z"
    }
  }
  ```

---

### 2.7 Archive Notification
- **Method**: `POST`
- **Path**: `/notifications/{id}/archive`
- **Status**: `PROPOSED`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "id": "notif_01J8K3M90A8",
      "archivedAt": "2026-09-24T12:00:00.000Z"
    }
  }
  ```

---

## 3. Realtime Stream (SSE) Specification

### 3.1 Server-Sent Events Connection
- **Method**: `GET`
- **Path**: `/notifications/stream`
- **Status**: `PROPOSED`
- **Headers**:
  - `Accept: text/event-stream`
  - `Authorization: Bearer <accessToken>` (via `@microsoft/fetch-event-source`)
  - `Last-Event-ID: <lastEventId>` (sent automatically on reconnection to resume missed events)
- **Alternative (Ticket-Based)**:
  - If a reverse proxy or infrastructure strips headers from long-lived requests, frontend calls `POST /notifications/stream-ticket` first to get a 30-second single-use ticket:
  - Request: `POST /notifications/stream-ticket` $\rightarrow$ `{ "ticket": "stk_01J..." }`
  - Stream: `GET /notifications/stream?ticket=stk_01J...`

### 3.2 SSE Event Formats

#### Event: `notification.created`
```text
event: notification.created
id: evt_01J8K400000000000000000001
data: {"notification":{"id":"notif_100","type":"leave.requested","category":"leave","module":"core_hr","priority":"normal","title":"New Leave Request","body":"Sarah Jenkins requested 2 days of Annual Leave.","link":"/dashboard/workforce/leaves","createdAt":"2026-09-24T12:30:00Z"},"unreadCount":4}
```

#### Event: `notification.updated`
```text
event: notification.updated
id: evt_01J8K400000000000000000002
data: {"id":"notif_100","readAt":"2026-09-24T12:35:00Z","archivedAt":null}
```

#### Event: `unread_count`
```text
event: unread_count
id: evt_01J8K400000000000000000003
data: {"total":4,"byCategory":{"leave":3,"payroll":1}}
```

#### Event: `ping` (Heartbeat every 15–30s)
```text
event: ping
data: {"timestamp":1758717000000}
```

---

## 4. User Preferences Contract

### 4.1 Get User Preferences
- **Method**: `GET`
- **Path**: `/notifications/preferences`
- **Status**: `PROPOSED`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "matrix": {
        "attendance": { "inApp": true, "email": false, "push": false, "mandatory": false },
        "leave": { "inApp": true, "email": true, "push": false, "mandatory": false },
        "payroll": { "inApp": true, "email": true, "push": false, "mandatory": true },
        "documents": { "inApp": true, "email": true, "push": false, "mandatory": false },
        "assets": { "inApp": true, "email": false, "push": false, "mandatory": false },
        "recruitment": { "inApp": true, "email": true, "push": false, "mandatory": false },
        "security": { "inApp": true, "email": true, "push": true, "mandatory": true },
        "system": { "inApp": true, "email": false, "push": false, "mandatory": false }
      },
      "quietHours": {
        "enabled": false,
        "startTime": "22:00",
        "endTime": "08:00",
        "timezone": "Asia/Kolkata"
      },
      "digest": {
        "frequency": "weekly", // "off" | "daily" | "weekly"
        "dayOfWeek": 1,        // 1 = Monday
        "time": "09:00"
      }
    }
  }
  ```

### 4.2 Update User Preferences
- **Method**: `PUT`
- **Path**: `/notifications/preferences`
- **Status**: `PROPOSED`
- **Request Body**:
  ```json
  {
    "matrix": {
      "attendance": { "inApp": true, "email": false },
      "leave": { "inApp": true, "email": false }
    },
    "quietHours": {
      "enabled": true,
      "startTime": "23:00",
      "endTime": "07:00",
      "timezone": "Asia/Kolkata"
    },
    "digest": {
      "frequency": "daily"
    }
  }
  ```
- **Rule**: If the user tries to disable a `mandatory: true` category channel (e.g. security email), the backend returns `400 Bad Request` with `code: "MANDATORY_CHANNEL_CANNOT_BE_DISABLED"`.

---

## 5. Organization-Level Notification Settings (Existing)

### 5.1 Get Organization Notification Settings
- **Method**: `GET`
- **Path**: `/settings/notifications`
- **Status**: `CONFIRMED-in-code` (used by `settingsApi.getNotificationSettings`)
- **Current Response Schema**:
  ```typescript
  export interface NotificationSettings {
    emailNotifications: boolean;
    inAppAlerts: boolean;
    slackAlerts: boolean;
    weeklyDigest: boolean;
    marketingEmails?: boolean;
    securityAlerts?: boolean;
  }
  ```

### 5.2 Update Organization Notification Settings
- **Method**: `PATCH`
- **Path**: `/settings/notifications`
- **Status**: `CONFIRMED-in-code` (used by `settingsApi.updateNotificationSettings`)
- **Request Body**: `Partial<NotificationSettings>`

### 5.3 Test Dispatch Endpoints
- **POST `/settings/email/test`**: `CONFIRMED-in-code` (`{ email: string }`)
- **POST `/settings/sms/test`**: `CONFIRMED-in-code` (`{ phone: string }`)
- **POST `/notifications/test`**: `PROPOSED`
  - Request: `{ "channel": "in-app" | "email" | "push" }`
  - Dispatches a harmless preview notification to the authenticated user.

---

## 6. Admin Broadcasts & Integrations

### 6.1 Create Broadcast Announcement
- **Method**: `POST`
- **Path**: `/notifications/broadcasts`
- **Status**: `PROPOSED`
- **Headers**: `Idempotency-Key: <uuid>`
- **Request Body**:
  ```json
  {
    "title": "Scheduled Maintenance Notice",
    "body": "The OFC360 platform will undergo scheduled maintenance on Sunday from 02:00 to 04:00 IST.",
    "priority": "high",
    "channels": ["in-app", "email"],
    "targetAudience": {
      "type": "all" // "all" | "department" | "role" | "specific_users"
    },
    "link": "/dashboard",
    "expiresAt": "2026-09-30T00:00:00.000Z"
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "success": true,
    "data": {
      "broadcastId": "bc_01J8K5000",
      "recipientCount": 142,
      "dispatchedAt": "2026-09-24T12:00:00.000Z"
    }
  }
  ```

### 6.2 Get Broadcast History
- **Method**: `GET`
- **Path**: `/notifications/broadcasts`
- **Status**: `PROPOSED`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "items": [
        {
          "id": "bc_01J8K5000",
          "title": "Scheduled Maintenance Notice",
          "priority": "high",
          "recipientCount": 142,
          "readCount": 89,
          "createdAt": "2026-09-24T12:00:00.000Z"
        }
      ]
    }
  }
  ```

### 6.3 Notification Channel Integrations (CTO Settings)
- **Method**: `GET` / `PATCH`
- **Path**: `/settings/integrations/notification-channels`
- **Status**: `PROPOSED`
- **Security Rule**: Webhook URLs, Slack Bot Tokens, and PagerDuty routing keys are **never echoed back in plain text**. Responses return masked values (e.g. `https://hooks.slack.com/services/****/****/abcde`).

---

## 7. Web Push Endpoints (`PUSH = "yes"` Blueprint)

| Method | Path | Status | Description |
|---|---|---|---|
| `GET` | `/notifications/push/vapid-public-key` | `PROPOSED` | Returns `{ "publicKey": "..." }` in standard base64url format |
| `POST` | `/notifications/push-subscriptions` | `PROPOSED` | Stores browser push subscription `{ endpoint, keys: { p256dh, auth } }` |
| `DELETE` | `/notifications/push-subscriptions` | `PROPOSED` | Deletes subscription on logout or user opt-out |
| `GET` | `/notifications/push-subscriptions` | `PROPOSED` | Lists user's active push devices (Browser, OS, Created Date) |

---

## 8. Summary Status Table

| Endpoint | Method | Status | Notes |
|---|---|---|---|
| `/notifications` | GET | `PROPOSED` | Cursor pagination, filters |
| `/notifications/unread-count` | GET | `PROPOSED` | Total + category breakdown |
| `/notifications/{id}/read` | POST | `PROPOSED` | Mark single read |
| `/notifications/{id}/unread` | POST | `PROPOSED` | Mark single unread |
| `/notifications/read` | POST | `PROPOSED` | Bulk mark read |
| `/notifications/read-all` | POST | `PROPOSED` | Mark all read |
| `/notifications/{id}/archive` | POST | `PROPOSED` | Archive |
| `/notifications/stream` | GET | `PROPOSED` | Realtime SSE |
| `/notifications/stream-ticket` | POST | `PROPOSED` | Ticket for SSE |
| `/notifications/preferences` | GET, PUT | `PROPOSED` | User category $\times$ channel matrix |
| `/settings/notifications` | GET, PATCH | `CONFIRMED-in-code` | Org-level channels |
| `/settings/email/test` | POST | `CONFIRMED-in-code` | Test email dispatch |
| `/settings/sms/test` | POST | `CONFIRMED-in-code` | Test SMS dispatch |
| `/notifications/test` | POST | `PROPOSED` | Test notification dispatch |
| `/notifications/broadcasts` | GET, POST | `PROPOSED` | Admin broadcasts |
| `/settings/integrations/notification-channels` | GET, PATCH | `PROPOSED` | Slack / Webhook destinations |
| `/notifications/push/*` | GET, POST, DELETE | `PROPOSED` | Browser push (Phase 4) |
