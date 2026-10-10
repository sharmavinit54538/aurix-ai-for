import type { HrLetterCategory, LetterTypeDefinition } from "./types";

export const HR_LETTER_CATEGORIES: HrLetterCategory[] = [
  "JOINING & EMPLOYMENT",
  "SALARY & COMPENSATION",
  "EMPLOYMENT VERIFICATION",
  "ROLE & TRANSFER",
  "LEAVE & ABSENCE",
  "WARNING & DISCIPLINARY",
  "EXIT & SEPARATION",
  "GENERAL HR",
];

export const LETTER_TYPES: LetterTypeDefinition[] = [
  // ── 1. JOINING & EMPLOYMENT ──
  {
    id: "offer_letter",
    title: "Offer Letter",
    category: "JOINING & EMPLOYMENT",
    description: "Formal job offer stating designation, compensation, reporting, and acceptance conditions.",
    defaultTemplateId: "tpl_offer_letter",
    requiredFields: [
      { key: "ctc", label: "Annual CTC (₹)", type: "currency", placeholder: "e.g. 15,00,000", required: true },
      { key: "effective_date", label: "Date of Joining", type: "date", required: true },
      { key: "probation_months", label: "Probation Period (Months)", type: "number", placeholder: "6", required: false, defaultValue: "6" },
      { key: "reporting_to", label: "Reporting Manager / Lead", type: "text", placeholder: "e.g. Engineering Director", required: false },
    ],
  },
  {
    id: "appointment_letter",
    title: "Appointment Letter",
    category: "JOINING & EMPLOYMENT",
    description: "Official appointment contract executed on the employee's first working day.",
    defaultTemplateId: "tpl_appointment_letter",
    requiredFields: [
      { key: "joining_date", label: "Date of Appointment", type: "date", required: true },
      { key: "working_hours", label: "Working Hours / Shift", type: "text", placeholder: "09:30 AM – 06:30 PM IST", required: false, defaultValue: "09:30 AM – 06:30 PM IST" },
      { key: "probation_months", label: "Probation Period", type: "text", placeholder: "6 Months", required: false, defaultValue: "6 Months" },
    ],
  },
  {
    id: "employment_agreement",
    title: "Employment Agreement",
    category: "JOINING & EMPLOYMENT",
    description: "Comprehensive contract covering employment covenants, non-solicitation, and IP ownership.",
    defaultTemplateId: "tpl_employment_agreement",
    requiredFields: [
      { key: "effective_date", label: "Effective Date", type: "date", required: true },
      { key: "notice_period", label: "Notice Period", type: "text", placeholder: "90 Days", required: true, defaultValue: "90 Days" },
      { key: "jurisdiction", label: "Legal Jurisdiction City", type: "text", placeholder: "e.g. Bengaluru, India", required: false, defaultValue: "Bengaluru, India" },
    ],
  },
  {
    id: "joining_letter",
    title: "Joining Letter",
    category: "JOINING & EMPLOYMENT",
    description: "Documentation formalizing the employee's onboarding and reporting induction.",
    defaultTemplateId: "tpl_joining_letter",
    requiredFields: [
      { key: "joining_date", label: "Official Induction Date", type: "date", required: true },
      { key: "reporting_location", label: "Induction Location / Office", type: "text", placeholder: "Headquarters, Main Campus", required: true },
    ],
  },
  {
    id: "confirmation_letter",
    title: "Confirmation Letter",
    category: "JOINING & EMPLOYMENT",
    description: "Confirms satisfactory completion of probation period into permanent employment.",
    defaultTemplateId: "tpl_confirmation_letter",
    requiredFields: [
      { key: "confirmation_date", label: "Confirmation Date", type: "date", required: true },
      { key: "effective_date", label: "Effective From", type: "date", required: true },
    ],
  },
  {
    id: "probation_extension_letter",
    title: "Probation Extension Letter",
    category: "JOINING & EMPLOYMENT",
    description: "Notice outlining formal extension of probation with key review objectives.",
    defaultTemplateId: "tpl_probation_extension",
    requiredFields: [
      { key: "extension_period", label: "Extension Duration", type: "text", placeholder: "e.g. 3 Months", required: true, defaultValue: "3 Months" },
      { key: "new_review_date", label: "Next Review Date", type: "date", required: true },
      { key: "performance_goals", label: "Focus / Performance Areas", type: "textarea", placeholder: "Key milestones to be achieved during extension", required: false },
    ],
  },

  // ── 2. SALARY & COMPENSATION ──
  {
    id: "salary_revision_letter",
    title: "Salary Revision Letter",
    category: "SALARY & COMPENSATION",
    description: "Official update of revised base salary and total compensation structure.",
    defaultTemplateId: "tpl_salary_revision",
    requiredFields: [
      { key: "effective_date", label: "Effective Date", type: "date", required: true },
      { key: "new_ctc", label: "New Annual CTC (₹)", type: "currency", placeholder: "e.g. 18,50,000", required: true },
      { key: "previous_ctc", label: "Previous CTC (₹)", type: "currency", placeholder: "e.g. 15,00,000", required: false },
    ],
  },
  {
    id: "increment_letter",
    title: "Increment Letter",
    category: "SALARY & COMPENSATION",
    description: "Annual appraisal or merit-based increment notification with revision metrics.",
    defaultTemplateId: "tpl_increment_letter",
    requiredFields: [
      { key: "effective_date", label: "Effective Date", type: "date", required: true },
      { key: "increment_percentage", label: "Increment Percentage (%)", type: "text", placeholder: "e.g. 15%", required: true },
      { key: "new_ctc", label: "Revised CTC (₹)", type: "currency", placeholder: "e.g. 16,50,000", required: true },
    ],
  },
  {
    id: "promotion_letter",
    title: "Promotion Letter",
    category: "SALARY & COMPENSATION",
    description: "Promotion announcement with elevated designation, scope, and salary adjustment.",
    defaultTemplateId: "tpl_promotion_letter",
    requiredFields: [
      { key: "new_designation", label: "New Designation", type: "text", placeholder: "e.g. Lead Engineer", required: true },
      { key: "effective_date", label: "Effective Date", type: "date", required: true },
      { key: "new_ctc", label: "Revised CTC (₹)", type: "currency", placeholder: "e.g. 22,00,000", required: false },
    ],
  },
  {
    id: "bonus_letter",
    title: "Bonus Letter",
    category: "SALARY & COMPENSATION",
    description: "Performance or festive bonus award notification with payout timeline.",
    defaultTemplateId: "tpl_bonus_letter",
    requiredFields: [
      { key: "bonus_amount", label: "Bonus Amount (₹)", type: "currency", placeholder: "e.g. 1,50,000", required: true },
      { key: "payout_month", label: "Payout Payroll Cycle", type: "text", placeholder: "e.g. October 2026", required: true },
      { key: "performance_cycle", label: "Performance Period", type: "text", placeholder: "e.g. FY 2025-26", required: false },
    ],
  },
  {
    id: "compensation_revision_letter",
    title: "Compensation Revision Letter",
    category: "SALARY & COMPENSATION",
    description: "Restructuring of compensation components such as allowances, retiral benefits, and ESOPs.",
    defaultTemplateId: "tpl_comp_revision",
    requiredFields: [
      { key: "effective_date", label: "Effective Date", type: "date", required: true },
      { key: "fixed_pay", label: "Fixed Base Pay (₹)", type: "currency", placeholder: "e.g. 12,00,000", required: true },
      { key: "variable_pay", label: "Variable / Performance Pay (₹)", type: "currency", placeholder: "e.g. 2,00,000", required: false },
    ],
  },
  {
    id: "ctc_letter",
    title: "CTC Letter",
    category: "SALARY & COMPENSATION",
    description: "Itemized breakdown of Cost to Company for statutory verification and visa/loan filings.",
    defaultTemplateId: "tpl_ctc_letter",
    requiredFields: [
      { key: "as_of_date", label: "As of Date", type: "date", required: true },
      { key: "gross_monthly", label: "Gross Monthly Salary (₹)", type: "currency", placeholder: "e.g. 1,25,000", required: true },
      { key: "annual_ctc", label: "Total Annual CTC (₹)", type: "currency", placeholder: "e.g. 15,00,000", required: true },
    ],
  },

  // ── 3. EMPLOYMENT VERIFICATION ──
  {
    id: "employment_verification_letter",
    title: "Employment Verification Letter",
    category: "EMPLOYMENT VERIFICATION",
    description: "Standard third-party verification letter for embassies, banks, landlords, or financial institutions.",
    defaultTemplateId: "tpl_emp_verification",
    requiredFields: [
      { key: "recipient_org", label: "Addressed To / Organization", type: "text", placeholder: "To Whom It May Concern", required: false, defaultValue: "To Whom It May Concern" },
      { key: "purpose", label: "Verification Purpose", type: "text", placeholder: "e.g. Visa Application / Bank Loan", required: false },
    ],
  },
  {
    id: "employment_certificate",
    title: "Employment Certificate",
    category: "EMPLOYMENT VERIFICATION",
    description: "Official certificate validating current standing, tenure, and good conduct.",
    defaultTemplateId: "tpl_emp_certificate",
    requiredFields: [
      { key: "issue_date", label: "Date of Issue", type: "date", required: true },
      { key: "recipient_org", label: "Requesting Authority", type: "text", placeholder: "To Whom It May Concern", required: false, defaultValue: "To Whom It May Concern" },
    ],
  },
  {
    id: "experience_letter",
    title: "Experience Letter",
    category: "EMPLOYMENT VERIFICATION",
    description: "Comprehensive testimonial summarizing tenure, skills, roles performed, and contribution.",
    defaultTemplateId: "tpl_experience_letter",
    requiredFields: [
      { key: "joining_date", label: "Joining Date", type: "date", required: true },
      { key: "last_working_date", label: "Relieving / Last Working Date", type: "date", required: true },
      { key: "conduct", label: "Conduct & Character Assessment", type: "text", placeholder: "Exemplary", required: false, defaultValue: "Exemplary" },
    ],
  },
  {
    id: "service_certificate",
    title: "Service Certificate",
    category: "EMPLOYMENT VERIFICATION",
    description: "Statutory proof of continuous service under applicable labor laws.",
    defaultTemplateId: "tpl_service_certificate",
    requiredFields: [
      { key: "joining_date", label: "Date of Commencement", type: "date", required: true },
      { key: "last_working_date", label: "Date of Separation", type: "date", required: true },
    ],
  },

  // ── 4. ROLE & TRANSFER ──
  {
    id: "transfer_letter",
    title: "Transfer Letter",
    category: "ROLE & TRANSFER",
    description: "Formal transfer order moving employee between company branches, hubs, or work centers.",
    defaultTemplateId: "tpl_transfer_letter",
    requiredFields: [
      { key: "new_location", label: "New Location / Branch", type: "text", placeholder: "e.g. Mumbai Hub", required: true },
      { key: "effective_date", label: "Reporting Date at New Location", type: "date", required: true },
      { key: "relocation_support", label: "Relocation Allowance / Terms", type: "text", placeholder: "As per company relocation policy", required: false },
    ],
  },
  {
    id: "role_change_letter",
    title: "Role Change Letter",
    category: "ROLE & TRANSFER",
    description: "Internal role transition letter detailing functional adjustments and reporting changes.",
    defaultTemplateId: "tpl_role_change",
    requiredFields: [
      { key: "new_designation", label: "New Role / Title", type: "text", placeholder: "e.g. Product Specialist", required: true },
      { key: "effective_date", label: "Effective Date", type: "date", required: true },
      { key: "reporting_to", label: "New Reporting Lead", type: "text", placeholder: "e.g. VP of Product", required: false },
    ],
  },
  {
    id: "department_change_letter",
    title: "Department Change Letter",
    category: "ROLE & TRANSFER",
    description: "Cross-departmental reassignment notice aligning organizational restructure.",
    defaultTemplateId: "tpl_dept_change",
    requiredFields: [
      { key: "new_department", label: "Target Department", type: "text", placeholder: "e.g. Customer Success", required: true },
      { key: "effective_date", label: "Effective Date", type: "date", required: true },
    ],
  },
  {
    id: "location_transfer_letter",
    title: "Location Transfer Letter",
    category: "ROLE & TRANSFER",
    description: "Transfer document specifying office facility shift and remote/hybrid alignment.",
    defaultTemplateId: "tpl_location_transfer",
    requiredFields: [
      { key: "current_location", label: "Origin Location", type: "text", placeholder: "Delhi Office", required: true },
      { key: "new_location", label: "Destination Facility", type: "text", placeholder: "Hyderabad Tech Center", required: true },
      { key: "effective_date", label: "Reporting Date", type: "date", required: true },
    ],
  },
  {
    id: "deputation_letter",
    title: "Deputation Letter",
    category: "ROLE & TRANSFER",
    description: "Temporary assignment letter for client on-site deployment or project deputation.",
    defaultTemplateId: "tpl_deputation_letter",
    requiredFields: [
      { key: "client_name", label: "Host Client / Project Name", type: "text", placeholder: "e.g. Enterprise Client A", required: true },
      { key: "deputation_start", label: "Deputation Start Date", type: "date", required: true },
      { key: "deputation_end", label: "Expected Completion Date", type: "date", required: false },
    ],
  },

  // ── 5. LEAVE & ABSENCE ──
  {
    id: "leave_approval_letter",
    title: "Leave Approval Letter",
    category: "LEAVE & ABSENCE",
    description: "Official sanction of extended leave (maternity, paternity, medical, or study).",
    defaultTemplateId: "tpl_leave_approval",
    requiredFields: [
      { key: "leave_type", label: "Leave Type", type: "text", placeholder: "e.g. Maternity / Medical Leave", required: true },
      { key: "start_date", label: "Leave Start Date", type: "date", required: true },
      { key: "end_date", label: "Leave End Date", type: "date", required: true },
      { key: "resume_date", label: "Expected Resumption Date", type: "date", required: true },
    ],
  },
  {
    id: "leave_extension_letter",
    title: "Leave Extension Letter",
    category: "LEAVE & ABSENCE",
    description: "Confirmation of extended absence period approved upon employee request.",
    defaultTemplateId: "tpl_leave_extension",
    requiredFields: [
      { key: "new_end_date", label: "New Extended End Date", type: "date", required: true },
      { key: "resume_date", label: "New Reporting Date", type: "date", required: true },
      { key: "reason", label: "Approved Reason", type: "text", placeholder: "Medical Recovery", required: false },
    ],
  },
  {
    id: "return_to_work_letter",
    title: "Return-to-Work Letter",
    category: "LEAVE & ABSENCE",
    description: "Formal letter acknowledging employee re-entry into active service following extended leave.",
    defaultTemplateId: "tpl_return_to_work",
    requiredFields: [
      { key: "effective_date", label: "Re-entry Date", type: "date", required: true },
      { key: "accommodations", label: "Work Adjustments / Accommodations", type: "text", placeholder: "Gradual phase-in / Hybrid schedule", required: false },
    ],
  },
  {
    id: "sabbatical_approval_letter",
    title: "Sabbatical Approval Letter",
    category: "LEAVE & ABSENCE",
    description: "Agreement granting long-term sabbatical with retention of employment lien.",
    defaultTemplateId: "tpl_sabbatical_approval",
    requiredFields: [
      { key: "start_date", label: "Sabbatical Start Date", type: "date", required: true },
      { key: "end_date", label: "Sabbatical End Date", type: "date", required: true },
      { key: "conditions", label: "Return Conditions", type: "text", placeholder: "Reporting back on or before specified date", required: false },
    ],
  },

  // ── 6. WARNING & DISCIPLINARY ──
  {
    id: "warning_letter",
    title: "Warning Letter",
    category: "WARNING & DISCIPLINARY",
    description: "Formal written warning outlining policy breach, attendance lapse, or code-of-conduct violation.",
    defaultTemplateId: "tpl_warning_letter",
    requiredFields: [
      { key: "incident_date", label: "Date of Incident / Violation", type: "date", required: true },
      { key: "infraction_detail", label: "Infraction Description", type: "textarea", placeholder: "Specific policy or code of conduct violation details", required: true },
      { key: "corrective_action", label: "Expected Corrective Action", type: "textarea", placeholder: "Steps required to resolve infraction", required: true },
    ],
  },
  {
    id: "show_cause_notice",
    title: "Show Cause Notice",
    category: "WARNING & DISCIPLINARY",
    description: "Official statutory notice asking employee to explain why disciplinary action should not be initiated.",
    defaultTemplateId: "tpl_show_cause",
    requiredFields: [
      { key: "notice_date", label: "Notice Date", type: "date", required: true },
      { key: "allegation", label: "Formal Charge / Allegation", type: "textarea", placeholder: "Nature of non-compliance or breach", required: true },
      { key: "reply_deadline_days", label: "Days to Respond", type: "number", placeholder: "e.g. 7", required: true, defaultValue: "7" },
    ],
  },
  {
    id: "pip_letter",
    title: "Performance Improvement Plan Letter",
    category: "WARNING & DISCIPLINARY",
    description: "Structured PIP notice setting specific KPIs, timelines, and monitoring checkpoints.",
    defaultTemplateId: "tpl_pip_letter",
    requiredFields: [
      { key: "pip_duration", label: "PIP Duration", type: "text", placeholder: "30 Days / 60 Days", required: true, defaultValue: "30 Days" },
      { key: "start_date", label: "Plan Start Date", type: "date", required: true },
      { key: "end_date", label: "Plan End Date", type: "date", required: true },
      { key: "goals", label: "Performance Goals", type: "textarea", placeholder: "Measurable deliverables required", required: true },
    ],
  },
  {
    id: "disciplinary_action_letter",
    title: "Disciplinary Action Letter",
    category: "WARNING & DISCIPLINARY",
    description: "Final outcome letter following internal inquiry or repeated policy violations.",
    defaultTemplateId: "tpl_disciplinary_action",
    requiredFields: [
      { key: "action_taken", label: "Disciplinary Action Imposed", type: "text", placeholder: "Written Reprimand / Penalty", required: true },
      { key: "effective_date", label: "Effective Date", type: "date", required: true },
      { key: "findings", label: "Inquiry Findings Summary", type: "textarea", placeholder: "Summary of inquiry findings", required: true },
    ],
  },
  {
    id: "suspension_letter",
    title: "Suspension Letter",
    category: "WARNING & DISCIPLINARY",
    description: "Notice of temporary suspension pending outcome of formal investigation.",
    defaultTemplateId: "tpl_suspension_letter",
    requiredFields: [
      { key: "suspension_date", label: "Effective Suspension Date", type: "date", required: true },
      { key: "subsistence_terms", label: "Subsistence Allowance Terms", type: "text", placeholder: "As per statutory employment standing orders", required: false },
    ],
  },

  // ── 7. EXIT & SEPARATION ──
  {
    id: "resignation_acceptance_letter",
    title: "Resignation Acceptance Letter",
    category: "EXIT & SEPARATION",
    description: "Acknowledges employee resignation, confirms notice period, and sets last working date.",
    defaultTemplateId: "tpl_resignation_acceptance",
    requiredFields: [
      { key: "resignation_date", label: "Date Resignation Received", type: "date", required: true },
      { key: "last_working_date", label: "Last Working Day (LWD)", type: "date", required: true },
      { key: "handover_lead", label: "Knowledge Transfer Lead", type: "text", placeholder: "e.g. Department Manager", required: false },
    ],
  },
  {
    id: "relieving_letter",
    title: "Relieving Letter",
    category: "EXIT & SEPARATION",
    description: "Official relieving letter confirming discharge from employment duties in good standing.",
    defaultTemplateId: "tpl_relieving_letter",
    requiredFields: [
      { key: "last_working_date", label: "Relieving Date / LWD", type: "date", required: true },
      { key: "designation", label: "Designation at Separation", type: "text", placeholder: "e.g. Senior Software Engineer", required: true },
    ],
  },
  {
    id: "full_and_final_letter",
    title: "Full & Final Settlement Letter",
    category: "EXIT & SEPARATION",
    description: "Statement detailing final payroll disbursal, leave encashment, gratuity, and statutory deductions.",
    defaultTemplateId: "tpl_fnf_settlement",
    requiredFields: [
      { key: "settlement_amount", label: "Net Settlement Amount (₹)", type: "text", placeholder: "e.g. 1,42,850", required: true },
      { key: "settlement_date", label: "Disbursal Date", type: "date", required: true },
      { key: "encashed_leaves", label: "Encashed Leave Days", type: "number", placeholder: "12", required: false },
    ],
  },
  {
    id: "termination_letter",
    title: "Termination Letter",
    category: "EXIT & SEPARATION",
    description: "Formal separation letter citing contractual clauses and exit settlement protocol.",
    defaultTemplateId: "tpl_termination_letter",
    requiredFields: [
      { key: "effective_date", label: "Effective Termination Date", type: "date", required: true },
      { key: "reason_category", label: "Clause / Termination Basis", type: "text", placeholder: "e.g. Operational Restructuring / Cause", required: true },
      { key: "severance_terms", label: "Severance & Notice Pay Terms", type: "text", placeholder: "3 Months salary in lieu of notice", required: false },
    ],
  },
  {
    id: "exit_confirmation_letter",
    title: "Exit Confirmation Letter",
    category: "EXIT & SEPARATION",
    description: "Comprehensive separation certificate completing full clearance and offboarding.",
    defaultTemplateId: "tpl_exit_confirmation",
    requiredFields: [
      { key: "last_working_date", label: "Separation Date", type: "date", required: true },
      { key: "status", label: "Exit Status", type: "text", placeholder: "Completed with Full Clearance", required: false, defaultValue: "Completed with Full Clearance" },
    ],
  },
  {
    id: "no_dues_certificate",
    title: "No-Dues Certificate",
    category: "EXIT & SEPARATION",
    description: "Affirmation that all company assets, credentials, and financial liabilities have been cleared.",
    defaultTemplateId: "tpl_no_dues",
    requiredFields: [
      { key: "clearance_date", label: "Clearance Date", type: "date", required: true },
      { key: "cleared_by", label: "Clearance Authority / HR Lead", type: "text", placeholder: "e.g. Operations Department", required: true },
    ],
  },

  // ── 8. GENERAL HR ──
  {
    id: "noc_letter",
    title: "NOC (No Objection Certificate)",
    category: "GENERAL HR",
    description: "Official NOC for passport reissue, higher education, or competitive examinations.",
    defaultTemplateId: "tpl_noc_letter",
    requiredFields: [
      { key: "purpose", label: "Purpose / Addressed Authority", type: "text", placeholder: "e.g. Passport Authority / University Admissions", required: true },
      { key: "issue_date", label: "Issue Date", type: "date", required: true },
    ],
  },
  {
    id: "bank_change_letter",
    title: "Bank Account Change Confirmation",
    category: "GENERAL HR",
    description: "Confirms updating of salary credit bank accounts in the payroll ledger.",
    defaultTemplateId: "tpl_bank_change",
    requiredFields: [
      { key: "bank_name", label: "New Bank Name", type: "text", placeholder: "e.g. HDFC Bank Ltd.", required: true },
      { key: "account_number_last4", label: "Account Number (Last 4 Digits)", type: "text", placeholder: "e.g. 5432", required: true },
      { key: "effective_month", label: "Effective Payroll Cycle", type: "text", placeholder: "e.g. November 2026", required: true },
    ],
  },
  {
    id: "address_change_letter",
    title: "Address Change Confirmation",
    category: "GENERAL HR",
    description: "Validates record of employee residential address update in personnel files.",
    defaultTemplateId: "tpl_address_change",
    requiredFields: [
      { key: "new_address", label: "New Registered Residential Address", type: "textarea", placeholder: "Complete residential address", required: true },
      { key: "effective_date", label: "Effective Date", type: "date", required: true },
    ],
  },
  {
    id: "policy_acknowledgement_letter",
    title: "Policy Acknowledgement Letter",
    category: "GENERAL HR",
    description: "Signed acknowledgment of organizational code of conduct, POSH, and security policies.",
    defaultTemplateId: "tpl_policy_ack",
    requiredFields: [
      { key: "policy_name", label: "Policy Name / Edition", type: "text", placeholder: "OFC360 Information Security & Ethics Policy v2026", required: true },
      { key: "ack_date", label: "Acknowledgment Date", type: "date", required: true },
    ],
  },
  {
    id: "confidentiality_agreement_letter",
    title: "Confidentiality Agreement",
    category: "GENERAL HR",
    description: "Proprietary information and trade secret confidentiality covenant.",
    defaultTemplateId: "tpl_confidentiality",
    requiredFields: [
      { key: "effective_date", label: "Effective Date", type: "date", required: true },
      { key: "duration_years", label: "Covenant Duration", type: "text", placeholder: "Indefinite / 3 Years post separation", required: false, defaultValue: "Indefinite post separation" },
    ],
  },
  {
    id: "nda_letter",
    title: "NDA (Non-Disclosure Agreement)",
    category: "GENERAL HR",
    description: "Standard bilateral non-disclosure agreement for project-specific intellectual property.",
    defaultTemplateId: "tpl_nda",
    requiredFields: [
      { key: "project_name", label: "Project / Engagement Scope", type: "text", placeholder: "e.g. Enterprise Core Architecture", required: true },
      { key: "effective_date", label: "Effective Date", type: "date", required: true },
    ],
  },
  {
    id: "internship_certificate",
    title: "Internship Certificate",
    category: "GENERAL HR",
    description: "Official completion certificate acknowledging intern contribution and project milestones.",
    defaultTemplateId: "tpl_internship_certificate",
    requiredFields: [
      { key: "internship_domain", label: "Internship Domain / Track", type: "text", placeholder: "e.g. Fullstack Software Engineering", required: true },
      { key: "start_date", label: "Commencement Date", type: "date", required: true },
      { key: "end_date", label: "Completion Date", type: "date", required: true },
      { key: "mentor_name", label: "Project Mentor / Guide", type: "text", placeholder: "e.g. Principal Architect", required: false },
    ],
  },
  {
    id: "recommendation_letter",
    title: "Recommendation Letter",
    category: "GENERAL HR",
    description: "Professional letter of recommendation highlighting achievements, leadership, and integrity.",
    defaultTemplateId: "tpl_recommendation_letter",
    requiredFields: [
      { key: "recipient_name", label: "Addressed Recipient / Institution", type: "text", placeholder: "To Whom It May Concern", required: false, defaultValue: "To Whom It May Concern" },
      { key: "recommendation_purpose", label: "Context / Purpose", type: "text", placeholder: "e.g. Academic Admissions / Professional Advancement", required: false },
    ],
  },
];

// ── Default Production Templates with Standard Placeholders ──────────────────

export const DEFAULT_LETTER_TEMPLATES: Record<string, { title: string; content: string }> = {
  tpl_offer_letter: {
    title: "Standard Offer Letter",
    content: `REF: OFC/OFF/{{employee_id}}/2026
DATE: {{effective_date}}

TO:
{{employee_name}}
Email: {{email}}
Phone: {{phone}}

SUBJECT: OFFER OF EMPLOYMENT FOR THE POSITION OF {{designation}}

Dear {{employee_name}},

On behalf of {{company_name}}, we are pleased to offer you the position of {{designation}} in our {{department}} department, based out of {{location}}.

Your anticipated joining date will be {{effective_date}}. Your total Cost to Company (CTC) will be INR {{ctc}} per annum, payable in accordance with the standard payroll practices of {{company_name}}.

Key Terms:
1. Probation: You will undergo a probation period of {{probation_months}} months from your joining date.
2. Reporting: You will report to {{manager_name}} or as assigned by department leadership.
3. Workplace: {{company_address}}

Please sign and return the duplicate copy of this letter within 5 working days as acceptance of this offer.

We look forward to welcoming you to {{company_name}}!

Sincerely,

Authorized Signatory
People Operations & HR Management
{{company_name}}`,
  },

  tpl_appointment_letter: {
    title: "Official Appointment Letter",
    content: `REF: OFC/APT/{{employee_id}}/2026
DATE: {{joining_date}}

TO:
{{employee_name}} (Employee ID: {{employee_id}})
{{designation}} – {{department}}

SUBJECT: LETTER OF APPOINTMENT

Dear {{employee_name}},

Consequent to your acceptance of our offer, we take immense pleasure in appointing you as {{designation}} at {{company_name}}, effective {{joining_date}}.

Terms and Conditions:
1. Place of Work: Your initial posting will be at our office located at {{company_address}}.
2. Compensation: Your compensation structure is as detailed in your signed offer schedule.
3. Working Hours: Your standard working hours shall be {{working_hours}}.
4. Policies: You shall be governed by the service rules, policies, and code of conduct of {{company_name}}.

We congratulate you on your appointment and look forward to a rewarding association with our team.

Sincerely,

Head of Human Resources
{{company_name}}`,
  },

  tpl_confirmation_letter: {
    title: "Probation Confirmation Letter",
    content: `REF: OFC/CONF/{{employee_id}}/2026
DATE: {{confirmation_date}}

TO:
{{employee_name}} (Employee ID: {{employee_id}})
{{designation}} – {{department}}

SUBJECT: CONFIRMATION OF SERVICES

Dear {{employee_name}},

We are pleased to inform you that upon successful completion of your probation period, your services as {{designation}} in the {{department}} department have been confirmed, effective {{effective_date}}.

All other terms and conditions of your employment contract remain unchanged. We appreciate your diligent contribution and look forward to your continued growth with {{company_name}}.

Warm regards,

People Operations
{{company_name}}`,
  },

  tpl_salary_revision: {
    title: "Salary Revision Letter",
    content: `REF: OFC/REV/{{employee_id}}/2026
DATE: {{effective_date}}

TO:
{{employee_name}} (Employee ID: {{employee_id}})
Designation: {{designation}}
Department: {{department}}

SUBJECT: ANNUAL SALARY REVISION

Dear {{employee_name}},

In recognition of your ongoing dedication, performance, and impact at {{company_name}}, management is delighted to announce a revision in your compensation.

Effective {{effective_date}}, your revised Annual Cost to Company (CTC) will be INR {{new_ctc}} (Previous CTC: INR {{previous_ctc}}).

The detailed breakdown of your revised salary components will be available in your employee portal. All other terms of employment remain in full force.

Thank you for your valuable contribution!

Sincerely,

Director – Human Resources & Compensation
{{company_name}}`,
  },

  tpl_experience_letter: {
    title: "Experience Certificate",
    content: `REF: OFC/EXP/{{employee_id}}/2026
DATE: {{last_working_date}}

TO WHOMSOEVER IT MAY CONCERN

This is to certify that {{employee_name}} (Employee ID: {{employee_id}}) was employed with {{company_name}} from {{joining_date}} to {{last_working_date}}.

At the time of leaving, {{employee_name}} held the position of {{designation}} in the {{department}} department. During the tenure, {{employee_name}} demonstrated professional competence, sincerity, and team spirit. Conduct and character were found to be {{conduct}}.

{{employee_name}} has completed all separation formalities and has been relieved from duties effective the close of business hours on {{last_working_date}}.

We wish {{employee_name}} all the best in future endeavors.

Authorized Signatory
Human Resources Department
{{company_name}}
{{company_address}}`,
  },

  tpl_relieving_letter: {
    title: "Official Relieving Letter",
    content: `REF: OFC/REL/{{employee_id}}/2026
DATE: {{last_working_date}}

TO:
{{employee_name}}
Employee ID: {{employee_id}}
Designation: {{designation}}

SUBJECT: RELIEVING LETTER

Dear {{employee_name}},

This has reference to your resignation from the services of {{company_name}}.

We hereby confirm that your resignation has been accepted and you have been officially relieved from your duties as {{designation}} in the {{department}} department with effect from the close of business hours on {{last_working_date}}.

You have completed all handover protocols and surrendered company property. Your Full and Final settlement statement will be issued as per corporate policy.

We appreciate your contributions to the organization and wish you every success in your future career.

Sincerely,

Head – People Operations
{{company_name}}`,
  },

  tpl_emp_verification: {
    title: "Employment Verification Letter",
    content: `REF: OFC/VER/{{employee_id}}/2026
DATE: {{effective_date}}

{{recipient_org}}

SUBJECT: EMPLOYMENT VERIFICATION FOR {{employee_name}}

Dear Sir / Madam,

This official letter confirms that {{employee_name}} (Employee ID: {{employee_id}}) is an active full-time employee of {{company_name}} since {{joining_date}}.

Employment Details:
- Designation: {{designation}}
- Department: {{department}}
- Work Location: {{location}}
- Employment Status: Permanent / Active Full-Time
- Official Email: {{email}}
- Annual CTC: INR {{ctc}}

This verification is issued at the request of the employee for {{purpose}}. For further verification, please contact our HR Operations office at {{company_address}}.

Sincerely,

Authorized Signatory
Human Resources Verification Desk
{{company_name}}`,
  },

  tpl_warning_letter: {
    title: "Written Warning Notice",
    content: `REF: OFC/WARN/{{employee_id}}/2026
DATE: {{incident_date}}

STRICTLY CONFIDENTIAL

TO:
{{employee_name}} (Employee ID: {{employee_id}})
{{designation}} – {{department}}

SUBJECT: WRITTEN WARNING FOR POLICY INFRACTION

Dear {{employee_name}},

This formal communication serves as a written warning concerning non-compliance with {{company_name}} workplace regulations observed on {{incident_date}}.

Details of Concern:
{{infraction_detail}}

Expected Corrective Action:
{{corrective_action}}

Please note that {{company_name}} maintains high standards of professional discipline. Failure to show immediate and sustained improvement or repeat instances of policy breach may lead to escalated disciplinary proceedings, including potential termination of employment.

A copy of this notice is placed in your personnel records.

Sincerely,

Human Resources & Governance
{{company_name}}`,
  },
};

/**
 * Replaces all {{key}} occurrences in template content with real context values.
 */
export function replaceTemplateVariables(
  templateContent: string,
  context: Record<string, string | number | undefined | null>
): string {
  let result = templateContent;

  for (const [key, rawValue] of Object.entries(context)) {
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const val = rawValue !== undefined && rawValue !== null && rawValue !== "" ? String(rawValue) : `[${key}]`;
    const regex = new RegExp(`{{\\s*${escapedKey}\\s*}}`, "g");
    result = result.replace(regex, val);
  }

  return result;
}

/**
 * Returns any unresolved placeholders remaining in the template content (e.g. {{key}} or [key]).
 */
export function getUnresolvedPlaceholders(content: string): string[] {
  const matches = new Set<string>();
  const curlyMatches = content.match(/\{\{\s*[\w.-]+\s*\}\}/g);
  if (curlyMatches) {
    curlyMatches.forEach((m) => matches.add(m));
  }
  const bracketMatches = content.match(/\[[\w.-]+\]/g);
  if (bracketMatches) {
    bracketMatches.forEach((m) => matches.add(m));
  }
  return Array.from(matches);
}

/**
 * Checks if the content contains any unreplaced {{...}} or [...] placeholders.
 */
export function hasUnresolvedPlaceholders(content: string): boolean {
  return getUnresolvedPlaceholders(content).length > 0;
}
