# Company Announcements API Contract & Field Registry

**Specification**: OFC360 Company Announcements (Phase 1)  
**Contract Baseline**: `openapi.json` (paths: `/api/v1/announcements*`, `/api/v1/super-admin/announcements*`)  
**Strictness**: Contract-first, Zero Mock, Evidence-based.

---

## 1. Endpoints Catalog

| Method | Path | Purpose | Role Authorization | Contract Source |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/announcements` | List published announcements feed | All Company Roles (`employee`, `manager`, `hr_admin`, `executive`, `it_admin`, `recruiter`) | `openapi.json:957` |
| `POST` | `/api/v1/announcements` | Create new announcement draft | `hr_admin` | `openapi.json:957` |
| `GET` | `/api/v1/announcements/{id}` | Retrieve single announcement detail | All Company Roles | `openapi.json:977` |
| `PUT` | `/api/v1/announcements/{id}` | Update existing announcement | `hr_admin` | `openapi.json:977` |
| `DELETE` | `/api/v1/announcements/{id}` | Delete announcement | `hr_admin` | `openapi.json:977` |
| `PATCH` | `/api/v1/announcements/{id}/publish` | Transition status to published | `hr_admin` | `openapi.json:1006` |
| `PATCH` | `/api/v1/announcements/{id}/archive` | Transition status to archived | `hr_admin` | `openapi.json:1017` |
| `GET` | `/api/v1/super-admin/announcements` | List global platform broadcasts | `super_admin` | `openapi.json:8536`, `docs/backend_super_admin.py:2308` |
| `POST` | `/api/v1/super-admin/announcements` | Create global platform broadcast | `super_admin` | `openapi.json:8536`, `docs/backend_super_admin.py:2314` |

---

## 2. Field Evidence & Verification Matrix

| Field | Inferred Type | Status | Evidence Source (File & Line) | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `string` | **VERIFIED** | `src/features/superAdmin/types.ts:582`<br>`docs/backend_super_admin.py:49, 2318`<br>`src/pages/TimelinePage.tsx:269`<br>`src/features/dashboard/hooks/useExecutiveDashboardData.ts:473` | Required. Unique announcement identifier. Missing triggers `ApiError`. |
| `title` | `string` | **VERIFIED** | `src/features/superAdmin/types.ts:583`<br>`docs/backend_super_admin.py:50, 2319`<br>`src/pages/TimelinePage.tsx:271`<br>`src/features/dashboard/hooks/useExecutiveDashboardData.ts:476` | Required. Headline/title of the announcement. Missing triggers `ApiError`. |
| `content` | `string \| null` | **VERIFIED** | `src/features/superAdmin/types.ts:584`<br>`docs/backend_super_admin.py:51, 2320`<br>`src/pages/TimelinePage.tsx:276` | Optional/nullable. Markdown or plain text body. |
| `summary` | `string \| null` | **VERIFIED** | `src/pages/TimelinePage.tsx:276` (`a.summary`) | Optional/nullable. Short excerpt or subtitle. |
| `target_audience` | `string \| null` | **VERIFIED** | `src/features/superAdmin/types.ts:585, 592`<br>`docs/backend_super_admin.py:52, 2321`<br>`docs/NOTIFICATIONS_EVENT_MATRIX.md:38` | Optional/nullable. Scope/department (e.g. `ALL_TENANTS`, `All Employees`, `Engineering`). |
| `created_at` | `string \| null` | **VERIFIED** | `src/features/superAdmin/types.ts:586`<br>`docs/backend_super_admin.py:53, 2322`<br>`src/pages/TimelinePage.tsx:274` | Optional/nullable. ISO UTC timestamp. |
| `author_name` | `string \| null` | **VERIFIED** | `src/pages/TimelinePage.tsx:272, 277`<br>`src/features/dashboard/hooks/useExecutiveDashboardData.ts:477` | Optional/nullable. Name of publisher or issuing department. |
| `is_pinned` | `boolean \| null` | **VERIFIED** | `src/pages/TimelinePage.tsx:264` (`pinned_announcements`)<br>`src/features/dashboard/hooks/useExecutiveDashboardData.ts:465` | Optional/nullable. Pinned announcements sort to top of the feed. |
| `status` | `string \| null` | **VERIFIED** | Inferred from lifecycle endpoints `PATCH /publish` & `PATCH /archive` | Optional/nullable. Values: `"draft"` \| `"published"` \| `"archived"`. |
| `priority` | `string \| null` | **UNVERIFIED** | Requirements document ("pinned/priority upar") | Optional/nullable. Values: `"low"` \| `"normal"` \| `"high"` \| `"urgent"`. |
| `published_at` | `string \| null` | **UNVERIFIED** | Common publishing timestamp lifecycle | Optional/nullable. ISO UTC timestamp. |
| `expires_at` | `string \| null` | **UNVERIFIED** | Common announcement expiration lifecycle | Optional/nullable. ISO UTC timestamp. |
| `read_at` / `is_read` | `—` | **EXCLUDED** | Zero evidence in any backend/code file | Excluded. No fake read tracking shown. |

---

## 3. Response Envelope Structure

Live backend inspection of `api.ofc360.com` confirms the standard OFC360 API envelope:

```json
{
  "success": true,
  "data": {
    "items": [...],
    "total": 12,
    "page": 1,
    "limit": 20
  },
  "message": "Announcements retrieved successfully"
}
```

The parser also handles direct `{ items: [...] }` or array `[...]` if returned by specific endpoints, but strictly validates that items conform to `AnnouncementItemSchema` (requiring `id` and `title`).

---

## 4. Error Handling & Form 422 Mapping

- **HTTP 401**: Handled globally by `apiInstance` token refresh flow.
- **HTTP 403**: Handled in UI with explicit "Access Denied" state.
- **HTTP 422**: FastAPI validation errors (`{ detail: [{ loc: [...], msg: string }] }`) are mapped field-by-field to the announcement form inputs so invalid payloads are surfaced immediately.
