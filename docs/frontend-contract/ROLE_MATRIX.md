# Connect, Helpdesk, Reimbursements & Announcements Role Matrix

**Repository Context**: Verified as Frontend Application (`tanstack_start_ts`, React 19, TypeScript). Backend Python source code is not resident in this repository.  
**Contract Baseline Source**: `openapi.json` paths, `src/lib/permissions.ts:1-250`, `src/lib/route-guards.ts:1-180`, `docs/backend_super_admin.py:60-90`.  
**Extraction Policy**: Evidence-based extraction with strict citations. Backend Python decorator implementations (e.g. `@require_roles(...)`) absent from the schema export are explicitly declared as **NOT FOUND IN CODE**.

---

## 1. Role Definitions

In OFC360, the primary roles defined across auth, router guards, and permission stores are:
- `superadmin`: Global platform administrator (cross-tenant, platform configuration).
- `hr_admin`: Company HR administrator (payroll, employee lifecycle, announcements, HR helpdesk).
- `it_admin`: Company IT administrator (assets, MDM, IT helpdesk, security, networks).
- `manager`: People manager (team attendance, approvals for leaves/reimbursements, 1:1 calls).
- `employee`: Regular workforce user (self-service, DM/channels, ticket creation, reimbursement claims).
- `executive`: C-Suite executive (`ceo`, `cfo`, `coo`, `cto`, `cio`, `cmo` - strategic overview, analytics).
- `recruiter`: Talent acquisition user (job postings, candidates, interviews).

---

## 2. Role-to-Endpoint Permission Matrix

| Endpoint Route | Method | superadmin | hr_admin | it_admin | manager | employee | executive | recruiter | Contract Source |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **CONNECT** | | | | | | | | | |
| `/api/v1/connect/channels` | `GET` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | `openapi.json:10961` |
| `/api/v1/connect/channels` | `POST` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | `openapi.json:10971` |
| `/api/v1/connect/channels/{id}` | `PATCH/DELETE` | ✅ | ✅ | ❌ | ⚠️ Owner | ⚠️ Owner | ❌ | ❌ | `openapi.json:10981` |
| `/api/v1/connect/channels/{id}/messages` | `GET/POST` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | `openapi.json:11032` |
| `/api/v1/connect/conversations` | `GET/POST` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | `openapi.json:10868` |
| `/api/v1/connect/calls/*` | ALL | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | `openapi.json:11074-11129` |
| `/api/v1/connect/meetings` | `GET/POST` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | `openapi.json:11140` |
| `/api/v1/connect/presence` | `PUT` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | `openapi.json:11237` |
| `/api/v1/connect/ws` | `WS` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | `openapi.json:11332` |
| **HELPDESK** | | | | | | | | | |
| `/api/v1/helpdesk/tickets/my` | `GET` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | `openapi.json:11333` |
| `/api/v1/helpdesk/tickets` | `POST` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | `openapi.json:11344` |
| `/api/v1/helpdesk/tickets/{id}` | `GET` | ✅ | ✅ (HR) | ✅ (IT) | ⚠️ Requester | ⚠️ Requester | ⚠️ Requester | ⚠️ Requester | `openapi.json:11355` |
| `/api/v1/helpdesk/admin/tickets` | `GET` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | `openapi.json:11397` |
| `/api/v1/helpdesk/tickets/{id}/status` | `PATCH` | ✅ | ✅ | ✅ | ❌ | ⚠️ Close own | ❌ | ❌ | `openapi.json:11408` |
| `/api/v1/helpdesk/tickets/{id}/assign` | `PATCH` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | `openapi.json:11419` |
| `/api/v1/helpdesk/tickets/{id}/internal-notes` | `POST` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | `openapi.json:11430` |
| `/api/v1/helpdesk/admin/metrics` | `GET` | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | `openapi.json:11474` |
| **REIMBURSEMENTS & ADVANCES** | | | | | | | | | |
| `/api/v1/payroll/reimbursements` | `GET` | ✅ | ✅ (Tenant) | ⚠️ Own | ⚠️ Team | ⚠️ Own | ⚠️ Own | ⚠️ Own | `openapi.json:4785` |
| `/api/v1/payroll/reimbursements` | `POST` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | `openapi.json:4795` |
| `/api/v1/payroll/reimbursements/{id}/approve` | `POST` | ✅ | ✅ | ❌ | ✅ (Direct rep) | ❌ | ❌ | ❌ | `openapi.json:4805` |
| `/api/v1/payroll/reimbursements/{id}/reject` | `POST` | ✅ | ✅ | ❌ | ✅ (Direct rep) | ❌ | ❌ | ❌ | `openapi.json:4816` |
| `/api/v1/payroll/reimbursements/bulk-approve` | `POST` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | `openapi.json:4827` |
| `/api/v1/payroll/advances` | `GET` | ✅ | ✅ (Tenant) | ⚠️ Own | ⚠️ Team | ⚠️ Own | ⚠️ Own | ⚠️ Own | `openapi.json:4882` |
| `/api/v1/payroll/advances` | `POST` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | `openapi.json:4892` |
| `/api/v1/payroll/advances/{id}/approve` | `POST` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | `openapi.json:4902` |
| **ANNOUNCEMENTS & NEWS** | | | | | | | | | |
| `/api/v1/announcements` | `GET` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | `openapi.json:967` |
| `/api/v1/announcements` | `POST` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | `openapi.json:957` |
| `/api/v1/announcements/{id}` | `PUT/DELETE` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | `openapi.json:977` |
| `/api/v1/announcements/{id}/publish` | `PATCH` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | `openapi.json:1006` |
| `/api/v1/announcements/{id}/archive` | `PATCH` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | `openapi.json:1017` |
| `/api/v1/news` | `GET` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | `openapi.json:2693` |
| `/api/v1/news` | `POST` | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | `openapi.json:2683` |
| `/api/v1/super-admin/announcements` | `GET/POST`| ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | `openapi.json:8536` |

---

## 3. Backend Decorator Implementation Note
- While route paths and HTTP methods are rigorously recorded in `openapi.json`, the concrete Python decorator code lines (e.g. `@router.get("/", dependencies=[Depends(require_role("hr_admin"))])`) are **NOT FOUND IN CODE** because backend Python files reside on a remote repository.
- Permissions above are mapped from tenant security specifications, route guards (`src/lib/route-guards.ts:40-120`), and contract documentation (`docs/ANNOUNCEMENTS_CONTRACT.md:11-22`).
