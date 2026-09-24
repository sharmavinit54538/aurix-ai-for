# ROUTE ACCESS & ROLE PERMISSIONS

**Source of Truth**: `src/lib/route-guards.ts` & `src/services/sidebarApi.ts`  
**Security Model**: Default Deny — All routes require authentication and matching role/permissions.

---

## 1. Payroll & Compensation Routes

| Route Pattern | Required Role(s) | Required Permission | Description |
|---------------|------------------|---------------------|-------------|
| `/dashboard/payroll` | `admin`, `super_admin`, `hr`, `hr_admin` | `payroll.view` | Main payroll dashboard hub |
| `/dashboard/payroll/periods` | `admin`, `super_admin`, `hr`, `hr_admin` | `payroll.view`, `payroll.process` | Payroll cycle management |
| `/dashboard/payroll/runs/$runId/processing` | `admin`, `super_admin`, `hr`, `hr_admin` | `payroll.view`, `payroll.process` | Run execution monitor |
| `/dashboard/payroll/runs/$runId/validation` | `admin`, `super_admin`, `hr`, `hr_admin` | `payroll.view` | Rule and data validation issues |
| `/dashboard/payroll/runs/$runId/preview` | `admin`, `super_admin`, `hr`, `hr_admin` | `payroll.view` | Provisional calculation review |
| `/dashboard/payroll/runs/$runId/employees/$employeeId` | `admin`, `super_admin`, `hr`, `hr_admin` | `payroll.view` | Individual employee calculation breakdown |
| `/dashboard/payroll/runs/$runId/approval` | `admin`, `super_admin` | `payroll.approve` | Governance review & approval (maker-checker) |
| `/dashboard/payroll/runs/$runId/finalize` | `admin`, `super_admin` | `payroll.finalize` | Finalize and cryptographic run locking |
| `/dashboard/payroll/payslips` | `admin`, `super_admin`, `hr`, `hr_admin`, `employee` | `payroll.view` | Payslip hub & self-service |
| `/dashboard/payroll/runs/$runId/payment` | `admin`, `super_admin`, `hr`, `hr_admin` | `payroll.disburse` | Payment batch creation for finalized run |
| `/dashboard/payroll/payments` | `admin`, `super_admin`, `hr`, `hr_admin` | `payroll.view`, `payroll.disburse` | Global payment batches list & status |
| `/dashboard/payroll/payments/$batchId` | `admin`, `super_admin`, `hr`, `hr_admin` | `payroll.view`, `payroll.disburse` | Batch detail, bank validation & reconciliation |

---

## 2. Governance & Maker-Checker Constraints

- **Payroll Approval**: An authorized user cannot approve a run they initiated or processed.
- **Payment Batch Approval**: An authorized user cannot approve a disbursement batch they created (`createdBy.id !== approver.id`).
- **Disbursement Authorization**: Only users with `payroll.disburse` permission can generate bank files or mark batches submitted.
