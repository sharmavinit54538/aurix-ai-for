# NOTIFICATIONS EVENT MATRIX

**Specification**: OFC360 Business Event Registry  
**Purpose**: Defines every backend event, recipient audience, default delivery channels, target navigation deep links, and opt-out restrictions (mandatory vs. optional).  
**Security Standard**: Titles and bodies must be generic when pushed outside the app (e.g. push/email lock-screen: *"Payroll update available"*, rather than detailing net pay amounts).

---

## Event Catalog

| Module | Event Name (`type`) | Recipients | Default Channels | Internal Allowlisted Deep Link | Mandatory? (Locked) | Sensitivity & Body Template |
|---|---|---|---|---|---|---|
| **Attendance** | `attendance.missed_checkout` | Employee, Direct Manager | In-App | `/dashboard/workforce/attendance` | No | Low: *"Missed check-out detected for yesterday's shift."* |
| **Attendance** | `attendance.late_arrival` | Employee, Direct Manager | In-App | `/dashboard/workforce/attendance` | No | Low: *"Late arrival recorded. Grace window exceeded."* |
| **Attendance** | `attendance.roster_published` | Assigned Employees | In-App, Email | `/dashboard/workforce/attendance` | No | Low: *"New shift roster published for upcoming week."* |
| **Leave** | `leave.requested` | Approving Manager | In-App, Email | `/dashboard/workforce/leaves` | No | Normal: *"{Employee} requested {days} days of {leave_type}."* |
| **Leave** | `leave.approved` | Requesting Employee | In-App, Email | `/dashboard/workforce/leaves` | No | Normal: *"Your leave request has been approved."* |
| **Leave** | `leave.rejected` | Requesting Employee | In-App, Email | `/dashboard/workforce/leaves` | No | Normal: *"Your leave request was rejected."* |
| **Payroll** | `payroll.run_approval_needed` | Payroll Admin, Finance, CEO | In-App, Email | `/dashboard/payroll/runs/{runId}/review` | **Yes (Mandatory)** | High: *"Payroll cycle for {period} requires your review and authorization."* (No salary numbers) |
| **Payroll** | `payroll.run_finalized` | HR Admin, Finance Ops | In-App, Email | `/dashboard/payroll/runs/{runId}/finalize` | No | Normal: *"Payroll run {period} finalized and locked."* |
| **Payroll** | `payroll.disbursal_paid` | All Processed Employees | In-App, Email | `/dashboard/employee/documents` | No | Normal: *"Salary disbursal processed for {period}."* (No salary numbers) |
| **Payroll** | `payroll.disbursal_failed` | Finance Admin | In-App, Email | `/dashboard/payroll/runs/{runId}/finalize` | **Yes (Mandatory)** | High: *"Bank transfer failed for {count} transactions in {period}."* |
| **Payroll** | `payroll.statutory_due` | HR Admin, Compliance | In-App, Email | `/dashboard/payroll` | **Yes (Mandatory)** | Normal: *"PF / ESI / TDS compliance filing deadline in 3 days."* |
| **Documents** | `document.payslip_published` | Target Employee | In-App, Email | `/dashboard/employee/documents` | No | Normal: *"Your payslip for {period} is now available to download."* |
| **Documents** | `document.expiring_soon` | Document Owner, HR Admin | In-App, Email | `/dashboard/documents` | No | Normal: *"Your {doc_type} expires in {days} days. Please upload updated copy."* |
| **Documents** | `document.expired` | Document Owner, HR Admin | In-App, Email | `/dashboard/documents` | **Yes (Mandatory)** | High: *"Compliance Alert: {doc_type} has expired."* |
| **Assets** | `asset.warranty_expiring` | IT Admin | In-App | `/dashboard/assets` | No | Low: *"Warranty expiring for asset {asset_tag} in 30 days."* |
| **Assets** | `asset.return_due` | Employee, IT Admin | In-App, Email | `/dashboard/assets` | Normal | Normal: *"Asset {asset_tag} return is scheduled for {date}."* |
| **Recruitment** | `recruitment.mention` | Mentioned User | In-App, Email | `/dashboard/recruitment/candidates/{candidateId}` | No | Normal: *"{Author} mentioned you on candidate {candidate_name}."* |
| **Recruitment** | `recruitment.interview_reminder`| Interviewer, Candidate | In-App, Email | `/dashboard/recruitment/interviews` | No | Normal: *"Interview reminder: {round} with {candidate_name} in 24 hours."* |
| **Recruitment** | `recruitment.offer_status` | Hiring Manager, HR Admin | In-App, Email | `/dashboard/recruitment/candidates/{candidateId}` | No | Normal: *"Offer letter for {candidate_name} was {status}."* |
| **Recruitment** | `recruitment.sla_breach` | Hiring Manager, Lead Recruiter | In-App, Email | `/dashboard/recruitment/candidates/{candidateId}` | No | High: *"SLA breached: Candidate in stage {stage} for over {days} days."* |
| **Onboarding/Exit**| `onboarding.task_assigned` | New Hire, Manager | In-App, Email | `/dashboard/onboarding-checklist` | No | Normal: *"New onboarding tasks assigned to you."* |
| **Onboarding/Exit**| `exit.clearance_requested` | Dept Heads (IT, Finance, HR) | In-App, Email | `/dashboard/exit-management` | **Yes (Mandatory)** | High: *"Exit clearance sign-off needed for {employee_name}."* |
| **Approvals** | `approval.task_assigned` | Designated Approver | In-App, Email | `/dashboard/manager` | **Yes (Mandatory)** | High: *"You have an approval task pending: {task_title}."* |
| **Security** | `security.new_device_login` | User Account Owner | In-App, Email | `/dashboard/settings/security` | **Yes (Mandatory)** | High: *"New login from {browser} on {os} from IP {ip}."* |
| **Security** | `security.password_changed` | User Account Owner | In-App, Email | `/dashboard/settings/security` | **Yes (Mandatory)** | High: *"Your password was changed successfully."* |
| **System** | `system.announcement` | Audience Selected (All / Dept) | In-App, Email | `/dashboard` | No | Normal: *"{Broadcast title}"* |
| **System** | `system.maintenance` | All Active Users | In-App | `/dashboard` | **Yes (Mandatory)** | High: *"Scheduled maintenance notice: {window}."* |
| **AI Insights** | `ai.anomaly_detected` | Executive / Manager | In-App | `/dashboard/ai-hub` | No | Low: *"AI detected unusual attendance pattern in {department}."* |
| **AI Insights** | `ai.attrition_risk` | HR Admin, Executive | In-App | `/dashboard/workforce` | No | Normal: *"Workforce intelligence insight generated for Q3 retention."* |

---

## Mandatory Channels Rationale

Events marked **Mandatory** (`mandatory: true`) cannot be turned off by regular employees in their notification preferences matrix. These fall into 4 specific compliance and security categories:
1. **Security & Authentication**: New device login, password changes, active session revocations (prevents account takeovers being masked by silenced notifications).
2. **Statutory & Financial Compliance**: Payroll approvals, statutory filing deadlines (prevents regulatory penalties).
3. **Exit & Asset Clearance**: Departmental sign-offs required prior to employee relieving (prevents property/data loss).
4. **Emergency / System Maintenance**: Critical outage alerts and scheduled maintenance windows.
