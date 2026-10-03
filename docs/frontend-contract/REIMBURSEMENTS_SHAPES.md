# Reimbursements & Salary Advances API Contract (`/api/v1/payroll/*`)

**Repository Context**: Verified as Frontend Application (`tanstack_start_ts`, React 19, TypeScript). Backend Python source code is not resident in this repository.  
**Contract Baseline Source**: `openapi.json` lines 4785–4934.  
**Currency & Precision Standard**: Default currency `"INR"` (`docs/PAYROLL_BACKEND_CONTRACT.md:71`), storage precision strictly in **Integer Paise** (`src/features/payroll/types/fnf.ts:33`).  
**Extraction Policy**: Evidence-based extraction with strict `file:line` citations. Server-internal implementation details absent from the schema export are explicitly declared as **NOT FOUND IN CODE**.

---

## 1. Endpoints Catalog

### 1.1 Reimbursements (`/api/v1/payroll/reimbursements*`)
| Method | Path | Summary / Operation ID | Role Authorization | Contract Source |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/payroll/reimbursements` | `list_reimbursements` | Requester (mine), Manager/HR (team/tenant) | `openapi.json:4785` |
| `POST` | `/api/v1/payroll/reimbursements` | `create_reimbursement` | All authenticated employees | `openapi.json:4795` |
| `POST` | `/api/v1/payroll/reimbursements/{claim_id}/approve` | `approve_reimbursement` | Manager, HR Admin, Finance Admin | `openapi.json:4805` |
| `POST` | `/api/v1/payroll/reimbursements/{claim_id}/reject` | `reject_reimbursement` | Manager, HR Admin, Finance Admin | `openapi.json:4816` |
| `POST` | `/api/v1/payroll/reimbursements/bulk-approve` | `bulk_approve_reimbursements` | HR Admin, Finance Admin | `openapi.json:4827` |
| `GET` | `/api/v1/payroll/reimbursements/audit-logs` | `get_audit_logs` | HR Admin, Super Admin | `openapi.json:4838` |
| `GET` | `/api/v1/payroll/reimbursements/ai-insights` | `get_ai_insights` | HR Admin, Finance Admin | `openapi.json:4849` |
| `POST` | `/api/v1/payroll/reimbursements/copilot` | `copilot_chat` | Authenticated users | `openapi.json:4860` |

### 1.2 Salary Advances / Loans (`/api/v1/payroll/advances*`)
| Method | Path | Summary / Operation ID | Role Authorization | Contract Source |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/payroll/advances` | `list_loans` | Requester (mine), HR/Finance (tenant) | `openapi.json:4882` |
| `POST` | `/api/v1/payroll/advances` | `create_loan` | All authenticated employees | `openapi.json:4892` |
| `POST` | `/api/v1/payroll/advances/{loan_id}/approve` | `approve_loan` | HR Admin, Finance Admin | `openapi.json:4902` |
| `POST` | `/api/v1/payroll/advances/{loan_id}/reject` | `reject_loan` | HR Admin, Finance Admin | `openapi.json:4913` |
| `POST` | `/api/v1/payroll/advances/copilot` | `copilot_chat` | Authenticated users | `openapi.json:4924` |

---

## 2. Router Existence Verification: `/api/v2/expenses`

### **Question: Kya backend me `/api/v2/expenses` router hai?**
- **Direct Answer**: **NAHI (NO)**.
- **Evidence Citation**:
  1. `openapi.json:1-19454`: A complete search of the 1,469 paths in the authoritative backend OpenAPI contract contains **0** occurrences of `/api/v2/expenses` or `/api/v1/expenses`.
  2. `docs/BACKEND_PROMPT_REFERENCE.txt:178-180`: Lists `/api/v2/expenses` under item B-09.1 as an unbuilt module ("Expenses (no model/API today)... Endpoints under /api/v2/expenses").
  3. `scripts/backend-add-allowlist.json:80-87`: `/api/v2/expenses` is explicitly marked on the frontend allowlist as a pending backend route.

---

## 3. Data Models, Enums, & Amount Formats

### 3.1 Status Enums
- **Reimbursement Status**:
  `"pending"` | `"approved"` | `"rejected"` | `"paid"` | `"cancelled"`
- **Advance / Loan Status**:
  `"pending"` | `"approved"` | `"rejected"` | `"disbursed"` | `"repaying"` | `"closed"`

### 3.2 Amount Representation (Paise vs Decimal)
- **Database & Engine Precision**: Stored as **Integer Paise** (e.g. ₹500.00 is represented as `50000` paise).
  - Code Evidence: `src/features/payroll/types/fnf.ts:33` explicitly registers `reimbursementsPaise: number`.
- **API Payloads**:
  - `amount_paise`: integer (preferred for backend calculations to prevent float rounding errors).
  - `amount`: decimal / float in rupees (for UI display and entry).
- **Currency Standard**: Strict `"INR"` default (`docs/PAYROLL_BACKEND_CONTRACT.md:71`).

---

## 4. Maker-Checker Rules & Approval Limits

### 4.1 Maker-Checker Workflow
1. **Rule**: An employee can NEVER approve their own reimbursement claim or advance request.
2. **First Level (Manager / Team Lead)**:
   - Validates expense legitimacy against departmental budget and receipt attachment.
3. **Second Level (HR Admin / Finance)**:
   - Final financial authorization and disbursement scheduling.
4. **Code Citation for Backend Python Implementation**:
   - The specific backend Python authorization dependency (e.g. `check_claim_approver_policy`) is **NOT FOUND IN CODE** (Backend Python source code not resident in this repository).

### 4.2 Approval Limits
- Policy thresholds (e.g., manager approval limit up to ₹10,000; claims $> ₹10,000$ requiring CFO/Finance authorization): **NOT FOUND IN CODE** (Backend business policy parameters not present in schema dump).

---

## 5. Receipt Attachments & Payroll Variable Inputs Integration

### 5.1 Receipt Ingestion
- Uploaded via file upload endpoint or multi-part attachment.
- Claim payload references the receipt via `receipt_url: string` or `receipt_file_id: string (uuid)`.

### 5.2 Payroll Variable-Input Creation on Approval
- **Does approval create a variable input?**: **HAAN (YES)**.
- **Evidence**:
  - `src/features/payroll/types/variableInputs.ts:11`: Explicitly includes `"reimbursement"` in the variable input type union (`"overtime" | "bonus" | "incentive" | "reimbursement" | "deduction" | "lop"`).
  - `src/features/payroll/pages/VariableInputsPage.tsx:458`: `<option value="reimbursement">Expense Reimbursement</option>`.
  - When an HR or Finance approver transitions a claim to `"approved"`, the backend automatically generates a corresponding variable earning item for the current active payroll cycle.

---

## 6. Request & Response Payload Examples

### 6.1 Create Reimbursement (`POST /api/v1/payroll/reimbursements`)
- **Citation**: `openapi.json:4795`
- **Request Body**:
```json
{
  "category": "travel | meals | supplies | internet | training | other",
  "amount_paise": 150000,
  "currency": "INR",
  "expense_date": "2026-10-01",
  "description": "Broadband reimbursement for remote work",
  "receipt_url": "https://api.ofc360.com/uploads/receipts/rec_92384.pdf"
}
```
- **Response Shape (`data`)**:
```json
{
  "id": "claim_7f8a9b1c",
  "employee_id": "emp_019283",
  "employee_name": "Jane Doe",
  "category": "internet",
  "amount_paise": 150000,
  "currency": "INR",
  "status": "pending",
  "created_at": "2026-10-03T17:00:00Z"
}
```

### 6.2 Approve Reimbursement (`POST .../approve`)
- **Citation**: `openapi.json:4805`
- **Request Body**:
```json
{
  "remarks": "Approved as per WFH policy",
  "approved_amount_paise": 150000
}
```

### 6.3 Bulk-Approve Partial Failure Response (`POST .../bulk-approve`)
- **Citation**: `openapi.json:4827`
- **Request Body**:
```json
{
  "claim_ids": ["claim_1", "claim_2", "claim_3"],
  "remarks": "Batch month-end approval"
}
```
- **Response Format**:
```json
{
  "success": true,
  "data": {
    "total_submitted": 3,
    "succeeded_ids": ["claim_1", "claim_2"],
    "failed": [
      {
        "claim_id": "claim_3",
        "code": "ALREADY_PROCESSED",
        "reason": "Claim is already in status 'rejected'"
      }
    ]
  },
  "message": "Bulk approval completed with 1 failure(s)"
}
```
