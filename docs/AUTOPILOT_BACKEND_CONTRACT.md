# Autopilot HR — Backend Contract Specification

This document details the REST & SSE API contracts for the **Autopilot HR** layer of OFC360 / Aurix HRMS. Backend engineers must implement endpoints matching these exact schemas, status codes, and security invariants.

---

## 1. System Invariants & Safety Constraints

1. **Currency**: All monetary amounts are communicated as **integer paise** (`1 INR = 100 paise`). Example: `₹5,000.00` is represented as `500000`. Float currency representations are strictly rejected.
2. **Timestamps**: All timestamps must be in **ISO 8601 UTC format** (e.g., `2026-10-04T12:00:00.000Z`).
3. **Hard Human Verification Boundary**:
   The AI must NEVER execute the following actions autonomously without explicit human sign-off:
   - `termination`: Involuntary employee separation or termination.
   - `disciplinary_action`: Formal warnings, PIPs, suspensions, or show-cause notices.
   - `salary_change`: Base compensation, allowances, pay grade, or structure modifications.
   - `payroll_final_approval`: Final authorization and release of payroll bank disbursement batches.
   - `grievance_posh`: Resolution of workplace harassment (POSH) or formal grievance filings.
4. **Auditability & Overrides**:
   - Every AI action must cite the governing policy clause and record a numerical confidence score (0–100).
   - Any manual override or destructive rejection requires a human justification reason with a **minimum of 10 characters**.
   - Every autonomous action must be undoable or overridable by authorized personnel.
5. **Maker-Checker Integrity**:
   - The AI agent acts as a "maker" for payroll pre-checks and calculation, but is structurally barred from being the "checker" (final approval).

---

## 2. API Endpoints Catalog

| Domain | Method | Endpoint | Allowed Roles | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Settings** | `GET` | `/api/v2/autopilot/settings` | `hr_admin`, `super_admin` | Retrieve current autonomy levels and threshold rules |
| **Settings** | `PUT` | `/api/v2/autopilot/settings` | `hr_admin`, `super_admin` | Update autonomy thresholds and workflow modes |
| **Rules** | `GET` | `/api/v2/autopilot/rules` | `hr_admin`, `super_admin` | List configured if/then policy rules |
| **Rules** | `POST` | `/api/v2/autopilot/rules` | `hr_admin`, `super_admin` | Create a new policy rule |
| **Rules** | `PUT` | `/api/v2/autopilot/rules/{id}` | `hr_admin`, `super_admin` | Update an existing policy rule |
| **Rules** | `DELETE` | `/api/v2/autopilot/rules/{id}` | `hr_admin`, `super_admin` | Delete a policy rule |
| **Rules** | `POST` | `/api/v2/autopilot/rules/simulate` | `hr_admin`, `super_admin` | Dry-run test a rule against sample data |
| **Exceptions** | `GET` | `/api/v2/autopilot/exceptions` | `hr_admin`, `manager` | Fetch unresolvable escalated items inbox |
| **Exceptions** | `POST` | `/api/v2/autopilot/exceptions/{id}/decision` | `hr_admin`, `manager` | Submit Approve, Reject, or Reassign decision |
| **Agent Chat** | `POST` | `/api/v2/autopilot/agent/chat` | Authenticated | Stream chat and propose executable tool calls |
| **Agent Action** | `POST` | `/api/v2/autopilot/agent/actions/{id}/confirm` | Authenticated | Confirm and execute a proposed agent action |
| **Agent Action** | `POST` | `/api/v2/autopilot/agent/actions/{id}/cancel` | Authenticated | Reject or cancel a proposed agent action |
| **Audit** | `GET` | `/api/v2/autopilot/audit` | `hr_admin`, `super_admin` | Server-paginated audit trail of all AI actions |
| **Audit** | `POST` | `/api/v2/autopilot/audit/{id}/undo` | `hr_admin`, `super_admin` | Undo an executed AI action |
| **Audit** | `POST` | `/api/v2/autopilot/audit/{id}/override` | `hr_admin`, `super_admin` | Override an AI decision with required justification |
| **Alerts** | `GET` | `/api/v2/autopilot/alerts` | `hr_admin`, `manager`, `super_admin` | Fetch active proactive AI alerts |
| **Alerts** | `POST` | `/api/v2/autopilot/alerts/{id}/ack` | `hr_admin`, `manager`, `super_admin` | Acknowledge an alert |
| **Alerts** | `POST` | `/api/v2/autopilot/alerts/{id}/snooze` | `hr_admin`, `manager`, `super_admin` | Snooze an alert until specified ISO date |
| **Alerts** | `POST` | `/api/v2/autopilot/alerts/{id}/task` | `hr_admin`, `manager`, `super_admin` | Convert alert to an assigned follow-up task |
| **Overview** | `GET` | `/api/v2/autopilot/overview` | `hr_admin`, `manager`, `super_admin` | Autopilot metrics and 12-month time series |
| **Onboarding** | `GET` | `/api/v2/autopilot/onboarding/runs` | `hr_admin` | List automated onboarding workflow instances |
| **Onboarding** | `GET` | `/api/v2/autopilot/onboarding/runs/{id}` | `hr_admin` | Detailed run timeline and step statuses |
| **Onboarding** | `POST` | `/api/v2/autopilot/onboarding/runs/{id}/retry-step` | `hr_admin` | Retry a failed onboarding automation step |
| **Payroll** | `GET` | `/api/v2/autopilot/payroll/status` | `hr_admin` | Autopilot payroll pre-check pipeline status |

---

## 3. Schema & Endpoint Definitions

### 3.1 Autonomy Settings

#### `GET /api/v2/autopilot/settings`
- **Response 200 OK**:
```json
{
  "success": true,
  "data": {
    "workflows": {
      "leave": {
        "workflow_id": "leave",
        "name": "Leave Requests",
        "description": "Approve routine casual and sick leaves adhering to balance policies.",
        "level": "auto_with_review",
        "thresholds": {
          "max_leave_days": 2,
          "max_expense_amount_paise": 0,
          "confidence_minimum": 85,
          "auto_reject_below_confidence": 40
        },
        "last_updated": "2026-10-01T10:00:00.000Z",
        "updated_by": "System Administrator"
      },
      "expense": {
        "workflow_id": "expense",
        "name": "Expense Claims",
        "description": "Validate receipts, policy caps, and merchant limits.",
        "level": "auto_with_review",
        "thresholds": {
          "max_leave_days": 0,
          "max_expense_amount_paise": 500000,
          "confidence_minimum": 90,
          "auto_reject_below_confidence": 40
        }
      }
    },
    "restricted_actions": [
      { "id": "termination", "name": "Termination of Employment", "enforced_by": "legal" },
      { "id": "disciplinary_action", "name": "Disciplinary Action", "enforced_by": "compliance" },
      { "id": "salary_change", "name": "Salary & Compensation Revision", "enforced_by": "compliance" },
      { "id": "payroll_final_approval", "name": "Payroll Final Approval & Release", "enforced_by": "system_policy" },
      { "id": "grievance_posh", "name": "Grievance & POSH Decisions", "enforced_by": "legal" }
    ],
    "updated_at": "2026-10-01T10:00:00.000Z",
    "updated_by": "System Administrator"
  }
}
```

#### `PUT /api/v2/autopilot/settings`
- **Request Body**:
```json
{
  "workflows": {
    "leave": {
      "workflow_id": "leave",
      "name": "Leave Requests",
      "description": "Approve routine casual and sick leaves.",
      "level": "full_auto",
      "thresholds": {
        "max_leave_days": 3,
        "max_expense_amount_paise": 0,
        "confidence_minimum": 90,
        "auto_reject_below_confidence": 40
      }
    }
  },
  "updated_by": "Jane Doe"
}
```
- **Response 200 OK**: Updated settings payload.
- **Validation**:
  - `confidence_minimum` must be an integer between `50` and `100`.
  - Disallowed actions in `restricted_actions` cannot be updated or converted to automated levels.

---

### 3.2 Policy Rules Builder

#### `GET /api/v2/autopilot/rules?workflow=leave`
- **Response 200 OK**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "rule-101",
        "name": "Auto-approve casual leave up to 2 days",
        "description": "Automatically approves casual leave if balance is sufficient.",
        "workflow": "leave",
        "priority": 1,
        "is_enabled": true,
        "conditions": [
          { "id": "c-1", "field": "leave_type", "operator": "eq", "value": "casual" },
          { "id": "c-2", "field": "days", "operator": "lte", "value": 2 },
          { "id": "c-3", "field": "balance", "operator": "gte", "value": 2 }
        ],
        "consequence": {
          "action": "auto_approve",
          "reason": "Routine casual leave within 2-day policy threshold with positive balance.",
          "confidence": 98,
          "policy_clause": "Section 4.1 Leave Policy 2026"
        },
        "created_at": "2026-09-15T08:00:00.000Z",
        "updated_at": "2026-10-02T11:30:00.000Z"
      }
    ]
  }
}
```

#### `POST /api/v2/autopilot/rules/simulate`
- **Request Body**:
```json
{
  "workflow": "leave",
  "rule_id": "rule-101",
  "sample_data": {
    "leave_type": "casual",
    "days": 2,
    "balance": 5
  }
}
```
- **Response 200 OK**:
```json
{
  "success": true,
  "data": {
    "matched": true,
    "rule_id": "rule-101",
    "rule_name": "Auto-approve casual leave up to 2 days",
    "action": "auto_approve",
    "confidence": 98,
    "policy_clause": "Section 4.1 Leave Policy 2026",
    "reasoning": "All conditions met for rule 'Auto-approve casual leave up to 2 days'.",
    "evaluated_conditions": [
      { "field": "leave_type", "operator": "eq", "expected": "casual", "actual": "casual", "passed": true },
      { "field": "days", "operator": "lte", "expected": 2, "actual": 2, "passed": true },
      { "field": "balance", "operator": "gte", "expected": 2, "actual": 5, "passed": true }
    ]
  }
}
```

---

### 3.3 Exceptions Inbox

#### `GET /api/v2/autopilot/exceptions?status=pending`
- **Response 200 OK**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "exc-5501",
        "workflow": "leave",
        "subject": "Leave Request: Aarav Sharma (Sick Leave, 5 days)",
        "request_id": "req-9801",
        "requester": {
          "id": "emp-101",
          "name": "Aarav Sharma",
          "email": "aarav.sharma@ofc360.com",
          "department": "Engineering",
          "designation": "Staff Engineer"
        },
        "details": {
          "leave_type": "sick",
          "days": 5,
          "balance": 2,
          "medical_certificate_attached": false
        },
        "escalation_reason": "Requested days (5) exceed balance (2) and medical certificate is missing.",
        "suggested_decision": "review",
        "confidence": 62,
        "policy_clause": "Clause 6.3: Sick leave beyond 2 consecutive days mandates a medical certificate.",
        "status": "pending",
        "urgency": "high",
        "created_at": "2026-10-04T06:15:00.000Z"
      }
    ],
    "total": 1
  }
}
```

#### `POST /api/v2/autopilot/exceptions/{id}/decision`
- **Request Body**:
```json
{
  "decision": "reject",
  "reason": "Please attach a verified medical practitioner certificate before resubmitting.",
  "reassigned_to_user_id": null
}
```
- **Validation**: If `decision === "reject"`, `reason` must have `length >= 10`.

---

### 3.4 HR Agent Chat & Tool Execution

#### `POST /api/v2/autopilot/agent/chat`
- Emits Server-Sent Events (SSE) compatible with `@ai-sdk/react` or streaming text responses.
- When an employee requests an action (e.g. "Apply 2 days leave from next Monday"):
  - Agent proposes a tool call card with `action_type`, `parameters`, `effect`, and state `proposed`.
  - No database mutation occurs until explicit confirmation.

#### `POST /api/v2/autopilot/agent/actions/{id}/confirm`
- Executes the tool call.
- **Response 200 OK**:
```json
{
  "success": true,
  "data": {
    "id": "act-332",
    "action_type": "apply_leave",
    "title": "Apply 2 Days Casual Leave",
    "parameters": {
      "start_date": "2026-10-06",
      "end_date": "2026-10-07",
      "leave_type": "casual",
      "reason": "Personal work"
    },
    "effect": "Leave request submitted to Leave Management Ledger.",
    "state": "done",
    "created_at": "2026-10-04T07:00:00.000Z",
    "result_record": {
      "type": "leave_request",
      "id": "lr-9021",
      "label": "Leave #LR-9021",
      "url": "/dashboard/workforce/leaves"
    },
    "undoable": true,
    "undone": false
  }
}
```

#### `POST /api/v2/autopilot/agent/actions/{id}/cancel`
- Cancels the proposed tool call without execution.

---

### 3.5 AI Action Audit Log

#### `GET /api/v2/autopilot/audit`
- **Query Parameters**:
  - `page` (default 1), `limit` (default 20)
  - `workflow`, `decision`, `confidence_min`, `confidence_max`, `start_date`, `end_date`
- **Response 200 OK**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "aud-1092",
        "timestamp": "2026-10-04T05:22:10.000Z",
        "workflow": "expense",
        "subject": "Expense Claim #EXP-4412 (₹3,200) by Priya Mehta",
        "action_taken": "Auto-approved reimbursement",
        "decision": "auto_approved",
        "confidence": 94,
        "rule_id": "rule-exp-01",
        "rule_name": "Standard Travel Meal Reimbursement",
        "policy_clause": "Travel & Expense Policy 2026, Section 3.2",
        "full_reasoning": "Receipt verified via OCR. Meal expense is ₹3,200 under the ₹5,000 threshold with valid GSTIN.",
        "evidence": { "merchant": "Subway", "amount_paise": 320000, "gstin_valid": true },
        "target_record": { "type": "expense", "id": "exp-4412", "name": "EXP-4412", "link": "/dashboard/expenses" },
        "status": "active",
        "can_undo": true,
        "can_override": true
      }
    ],
    "total": 1
  }
}
```

#### `POST /api/v2/autopilot/audit/{id}/undo`
- Request: `{ "reason": "Accidental submission by employee; requested cancellation." }`

#### `POST /api/v2/autopilot/audit/{id}/override`
- Request: `{ "new_decision": "rejected", "reason": "Exceeded client hospitality allowance per project agreement." }`
- Validation: Reason must be at least 10 characters.

---

### 3.6 Proactive Alerts Center

#### `GET /api/v2/autopilot/alerts`
- **Response 200 OK**:
```json
{
  "success": true,
  "data": [
    {
      "id": "alt-801",
      "category": "attrition_risk",
      "severity": "high",
      "title": "High flight risk signal detected: Senior Frontend Engineer",
      "description": "Consistent overtime (>60h/week) paired with reduced git velocity and 3 PTO cancellations.",
      "employee": { "id": "emp-204", "name": "Rohan Verma", "department": "Platform" },
      "evidence": [
        { "key": "Weekly Average Hours", "value": "62.4 hrs" },
        { "key": "Tenure", "value": "2.8 yrs" },
        { "key": "Last Compensation Review", "value": "14 months ago" }
      ],
      "suggested_next_step": "Schedule 1:1 retention dialogue and review compensation band.",
      "status": "active",
      "created_at": "2026-10-04T04:00:00.000Z"
    }
  ]
}
```

---

### 3.7 Autopilot Overview Dashboard

#### `GET /api/v2/autopilot/overview`
- **Response 200 OK**:
```json
{
  "success": true,
  "data": {
    "auto_resolved_percentage": { "value": 78.4, "available": true },
    "exceptions_pending": { "value": 14, "available": true },
    "hours_saved": { "value": 342, "available": true },
    "override_rate_percentage": { "value": 2.1, "available": true },
    "history_12_months": [
      { "month": "2025-11", "auto_resolved": 420, "escalated": 95, "overridden": 8, "hours_saved": 210 },
      { "month": "2026-09", "auto_resolved": 890, "escalated": 112, "overridden": 15, "hours_saved": 342 }
    ]
  }
}
```
*Frontend rule*: Any metric where `available: false` is omitted from the UI to avoid misleading numbers.

---

### 3.8 Auto Onboarding & Auto Payroll

#### `GET /api/v2/autopilot/onboarding/runs`
- Returns timeline of automated steps:
  - `documents` (e-signing, tax forms)
  - `assets` (laptop, identity badge)
  - `accounts` (email, SSO, Slack, HRMS)
  - `welcome_mail` (orientation briefing)
  - `training` (mandatory compliance modules)
- Failed steps can be retried via `POST /api/v2/autopilot/onboarding/runs/{id}/retry-step`.

#### `GET /api/v2/autopilot/payroll/status`
- Pre-check stages:
  - `attendance_sync`: Swipe reconciliation and LOP calculation.
  - `variable_inputs`: Bonuses, incentives, reimbursements.
  - `calculation`: Gross-to-net pay computations.
  - `validation`: Statutory deduction checks (PF, ESI, TDS, PT).
  - `anomaly_check`: Outlier detection against historical variance.
- **Maker-Checker Constraint**: `can_approve` is always restricted to human HR administrators. The AI cannot approve its own payroll calculation.
