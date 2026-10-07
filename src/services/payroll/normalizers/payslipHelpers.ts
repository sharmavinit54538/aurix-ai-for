import type {
  PayrollPayslipEmployeeInfo,
  PayrollPayslipAttendance,
  PayrollPayslipEarnings,
  PayrollPayslipDeductions,
  PayrollPayslipStatutory,
  PayrollPayslipEmployerContributions,
  PayrollPayslipDocument,
  PayrollPreviewEmployee,
  PayrollFinalizationData,
} from "../types";

function extractEmployeeInfo(emp: Record<string, unknown>, employeeId: string): PayrollPayslipEmployeeInfo {
  return {
    id: String(emp.id || emp.employeeId || employeeId),
    name: String(emp.name || emp.employeeName || emp.full_name || "—"),
    department: (emp.department || emp.dept || null) as string | null,
    designation: (emp.designation || emp.role || null) as string | null,
    location: (emp.location || emp.branch || null) as string | null,
    joiningDate: (emp.joiningDate || emp.joining_date || emp.doj || null) as string | null,
    employmentStatus: (emp.employmentStatus || emp.employment_status || null) as string | null,
    pan: (emp.pan || emp.panNumber || emp.pan_number || null) as string | null,
    uan: (emp.uan || emp.uanNumber || emp.uan_number || null) as string | null,
    pfNumber: (emp.pfNumber || emp.pf_number || null) as string | null,
    esiNumber: (emp.esiNumber || emp.esi_number || null) as string | null,
    bankInfo: (emp.bankInfo || emp.bank || null) as PayrollPayslipEmployeeInfo["bankInfo"],
  };
}

function extractAttendance(att: Record<string, unknown>): PayrollPayslipAttendance {
  return {
    workingDays: (att.workingDays ?? att.working_days ?? att.totalDays ?? null) as number | null,
    paidDays: (att.paidDays ?? att.paid_days ?? null) as number | null,
    lopDays: (att.lopDays ?? att.lop_days ?? att.unpaidDays ?? null) as number | null,
    leaveDays: (att.leaveDays ?? att.leave_days ?? null) as number | null,
    presentDays: (att.presentDays ?? att.present_days ?? null) as number | null,
    holidays: (att.holidays ?? att.holiday_days ?? null) as number | null,
    weeklyOffs: (att.weeklyOffs ?? att.weekly_offs ?? null) as number | null,
    overtimeHours: (att.overtimeHours ?? att.overtime_hours ?? null) as number | null,
    ...att,
  };
}

function extractEarnings(earn: Record<string, unknown>, d: Record<string, unknown>, empFallback?: PayrollPreviewEmployee | null): PayrollPayslipEarnings {
  return {
    basic: (earn.basic ?? earn.basic_salary ?? null) as number | null,
    hra: (earn.hra ?? earn.house_rent_allowance ?? null) as number | null,
    conveyance: (earn.conveyance ?? earn.conveyance_allowance ?? null) as number | null,
    specialAllowance: (earn.specialAllowance ?? earn.special_allowance ?? null) as number | null,
    medicalAllowance: (earn.medicalAllowance ?? earn.medical_allowance ?? null) as number | null,
    otherAllowances: (earn.otherAllowances ?? earn.other_allowances ?? earn.allowances ?? null) as number | null,
    overtime: (earn.overtime ?? earn.overtime_pay ?? null) as number | null,
    bonus: (earn.bonus ?? null) as number | null,
    incentives: (earn.incentives ?? earn.incentive ?? null) as number | null,
    arrears: (earn.arrears ?? null) as number | null,
    reimbursements: (earn.reimbursements ?? earn.reimbursement ?? null) as number | null,
    otherEarnings: (earn.otherEarnings ?? earn.other ?? null) as number | null,
    grossEarnings:
      (d.grossEarnings ??
      d.gross_earnings ??
      earn.grossEarnings ??
      earn.gross_earnings ??
      empFallback?.grossEarnings ??
      null) as number | null,
    components: Array.isArray(earn.components) ? earn.components : undefined,
  };
}

function extractDeductions(ded: Record<string, unknown>, d: Record<string, unknown>, empFallback?: PayrollPreviewEmployee | null): PayrollPayslipDeductions {
  return {
    pf: (ded.pf ?? ded.epf ?? ded.provident_fund ?? null) as number | null,
    esi: (ded.esi ?? ded.esic ?? null) as number | null,
    pt: (ded.pt ?? ded.professional_tax ?? null) as number | null,
    tds: (ded.tds ?? ded.income_tax ?? ded.tax ?? null) as number | null,
    loan: (ded.loan ?? ded.loan_deduction ?? null) as number | null,
    advance: (ded.advance ?? ded.advance_salary ?? null) as number | null,
    otherDeductions: (ded.otherDeductions ?? ded.other_deductions ?? ded.other ?? null) as number | null,
    totalDeductions:
      (d.totalDeductions ??
      d.total_deductions ??
      ded.totalDeductions ??
      ded.total_deductions ??
      empFallback?.totalDeductions ??
      null) as number | null,
    components: Array.isArray(ded.components) ? ded.components : undefined,
  };
}

function extractStatutory(
  stat: Record<string, unknown>,
  statEmployee: Record<string, unknown> | undefined,
  statEmployer: Record<string, unknown> | undefined,
  ded: Record<string, unknown>,
): PayrollPayslipStatutory | null {
  if (!stat || typeof stat !== "object") return null;

  return {
    employeePf: (statEmployee?.epf ?? stat.employeePf ?? stat.employee_pf ?? ded.pf ?? null) as number | null,
    employerPf: (statEmployer?.epf ?? stat.employerPf ?? stat.employer_pf ?? null) as number | null,
    employeeEsi: (statEmployee?.esi ?? stat.employeeEsi ?? stat.employee_esi ?? ded.esi ?? null) as number | null,
    employerEsi: (statEmployer?.esi ?? stat.employerEsi ?? stat.employer_esi ?? null) as number | null,
    pt: (statEmployee?.pt ?? stat.pt ?? ded.pt ?? null) as number | null,
    tds: (statEmployee?.tds ?? stat.tds ?? ded.tds ?? null) as number | null,
    eps: (statEmployer?.eps ?? stat.eps ?? null) as number | null,
    edli: (statEmployer?.edli ?? stat.edli ?? null) as number | null,
    other: (stat.other || null) as Record<string, unknown> | number | null,
  };
}

function extractEmployerContributions(
  d: Record<string, unknown>,
  statEmployer: Record<string, unknown> | undefined,
  empFallback?: PayrollPreviewEmployee | null,
): PayrollPayslipEmployerContributions | null {
  if (d.employerContributions) return d.employerContributions as PayrollPayslipEmployerContributions;
  if (!statEmployer) return null;

  return {
    pf: (statEmployer.epf ?? null) as number | null,
    esi: (statEmployer.esi ?? null) as number | null,
    eps: (statEmployer.eps ?? null) as number | null,
    edli: (statEmployer.edli ?? null) as number | null,
    total: (empFallback?.employerContribution ?? null) as number | null,
  };
}

function extractDocument(doc: Record<string, unknown>, d: Record<string, unknown>): PayrollPayslipDocument {
  return {
    pdfUrl: (doc.pdfUrl || doc.pdf_url || d.pdfUrl || d.pdf_url || null) as string | null,
    downloadUrl: (doc.downloadUrl || doc.download_url || d.downloadUrl || d.download_url || null) as string | null,
    documentId: (doc.documentId || doc.document_id || d.documentId || null) as string | null,
    hasDocument: Boolean(doc.pdfUrl || doc.downloadUrl || doc.hasDocument || d.hasDocument),
    mimeType: String(doc.mimeType || doc.mime_type || "application/pdf"),
  };
}

export {
  extractEmployeeInfo,
  extractAttendance,
  extractEarnings,
  extractDeductions,
  extractStatutory,
  extractEmployerContributions,
  extractDocument,
};