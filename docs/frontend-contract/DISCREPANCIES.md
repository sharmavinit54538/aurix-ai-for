# Contract Discrepancies & Code vs Schema Audit

**Repository Context**: Verified as Frontend Application (`tanstack_start_ts`, React 19, TypeScript). Backend Python source code is not resident in this repository.  
**Baseline Compared**: `openapi.json` (1469 endpoints, version 2.0.0) vs Frontend code, documentation, and pending allowlists (`scripts/backend-add-allowlist.json`, `docs/API_GAPS.md`, `docs/BACKEND_PROMPT_REFERENCE.txt`).  
**Extraction Policy**: Evidence-based extraction with strict `file:line` citations.

---

## 1. Discrepancy Matrix

| Item # | Feature / Route | Expected in UI / Frontend Docs | Actual in `openapi.json` | Discrepancy Nature & Impact | Citation & Evidence |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **D-01** | `/api/v2/expenses` | Full Expense module (list, create, approve, reject, mark-paid) | **NOT PRESENT (0 routes)** | Missing backend router. Frontend allowlist and `BACKEND_PROMPT_REFERENCE.txt:178` treat it as an unbuilt module. Current expense tracking in UI relies on local storage or reimbursement fallback. | `openapi.json:1-19454`<br>`scripts/backend-add-allowlist.json:80-87` |
| **D-02** | `/api/v1/connect/ws` | Rich WebSocket contract with event schemas, handshake parameters, and close codes | **Bare empty object (`{}`)** | FastAPI does not natively generate WebSocket schemas in OpenAPI. Handshake query parameters and event envelopes must be maintained via `CONNECT_WS_PROTOCOL.md`. | `openapi.json:11332` |
| **D-03** | Pydantic Schema Emission | Full request/response component models in `components.schemas` | **`components.schemas: {}` (0 models)** | The provided `openapi.json` contract is an endpoint registry dump with route operation IDs and 200 descriptions, but omits JSON Schema definitions in `components`. | `openapi.json:1-19454` |
| **D-04** | Static Upload Mount | `/uploads/helpdesk` | Registered as path `"/uploads/helpdesk": {}` | Static files are mounted at `/uploads/helpdesk` rather than an API-prefixed route (`/api/v1/uploads/...`). Frontend must resolve directly against `API_BASE_URL`. | `openapi.json:19449` |
| **D-05** | Announcement Read Tracking | Unread counter / `is_read` flag on announcements | **NOT PRESENT** in schema or code | Backend does not track per-user read receipts for company announcements. Verified as explicitly EXCLUDED in existing contract. | `docs/ANNOUNCEMENTS_CONTRACT.md:41` |
| **D-06** | Variable Input Naming | Earning category `"reimbursement"` | Path is plural `/api/v1/payroll/reimbursements` | Semantic difference: Claims API uses plural `/reimbursements`, while the payroll calculation engine registers singular `"reimbursement"`. | `openapi.json:4785`<br>`src/features/payroll/types/variableInputs.ts:11` |
| **D-07** | Super Admin Announcements | `super_admin` broadcast endpoints | Located under `/api/v1/super-admin/announcements` | Standard tenant announcements are under `/api/v1/announcements`, while global platform broadcasts are isolated under `/api/v1/super-admin/announcements`. | `openapi.json:8536`<br>`docs/backend_super_admin.py:2308` |
| **D-08** | Call Signaling Transport | Realtime WebSocket vs REST signaling | Both transports exist in contract | Backend provides REST signaling at `POST /api/v1/connect/calls/{callId}/signal` alongside WebSocket `/api/v1/connect/ws`, offering a robust REST fallback for WebRTC negotiation. | `openapi.json:11129, 11332` |

---

## 2. Recommended Alignments for Frontend & Backend

1. **Expenses Module**: Until `/api/v2/expenses` is built and deployed by the backend team, claims must continue using `/api/v1/payroll/reimbursements` (`openapi.json:4785`).
2. **WebSocket Handshake**: Frontend WebSocket client must connect with `?token=<jwt>` query param to `wss://api.ofc360.com/api/v1/connect/ws` and listen for standard event envelopes.
3. **Static File Resolvers**: Ensure helpdesk attachment links prepend `${API_BASE_URL}` to `/uploads/helpdesk/...` paths.
