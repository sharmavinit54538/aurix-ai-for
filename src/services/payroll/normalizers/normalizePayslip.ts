import type {
  PayrollPayslipData,
  PayrollPreviewEmployee,
  PayrollFinalizationData,
  PayrollPayslipEmployeeInfo,
  PayrollPayslipAttendance,
  PayrollPayslipEarnings,
  PayrollPayslipDeductions,
  PayrollPayslipStatutory,
  PayrollPayslipEmployerContributions,
  PayrollPayslipDocument,
} from "../types";

export function normalizePayrollPayslipData(
  runId: string,
  employeeId: string,
  raw: unknown,
  empFallback?: PayrollPreviewEmployee | null,
  finalFallback?: PayrollFinalizationData | null,
): PayrollPayslipData {
  const d = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const emp = (d.employee || empFallback || {}) as Record<string, unknown>;
  const att = (d.attendance || empFallback?.attendance || {}) as Record<string, unknown>;
  const earn = (d.earnings || empFallback?.earnings || {}) as Record<string, unknown>;
  const ded = (d.deductions || empFallback?.deductions || {}) as Record<string, unknown>;
  const stat = (d.statutory || empFallback?.statutory || {}) as Record<string, unknown>;
  const doc = (d.document || d.payslipDocument || {}) as Record<string, unknown>;

  const rawStatus = (d.status ||
    d.payslipStatus ||
    finalFallback?.status ||
    empFallback?.runStatus ||
    "Finalized") as string;

  const isFinalized = Boolean(
    d.isFinalized ||
    d.is_finalized ||
    finalFallback?.isFinalized ||
    String(rawStatus).toLowerCase() === "finalized" ||
    String(rawStatus).toLowerCase() === "closed" ||
    String(rawStatus).toLowerCase() === "locked",
  );

  const isLocked = Boolean(
    d.isLocked ||
    d.is_locked ||
    finalFallback?.isLocked ||
    String(rawStatus).toLowerCase() === "locked" ||
    String(rawStatus).toLowerCase() === "finalized",
  );

  const statEmployee = stat && typeof stat === "object" ? (stat.employee as Record<string, unknown> | undefined) : undefined;
  const statEmployer = stat && typeof stat === "object" ? (stat.employer as Record<string, unknown> | undefined) : undefined;

  return {
    id: String(d.id || d.payslipId || d.payslip_id || `${runId}_${employeeId}`),
    runId: String(d.runId || d.run_id || runId),
    employeeId: String(d.employeeId || d.employee_id || employeeId),
    payslipNumber:
      (d.payslipNumber ||
      d.payslip_number ||
      d.referenceNumber ||
      d.reference_number ||
      d.slipNo ||
      null) as string | null,
    referenceNumber:
      (d.referenceNumber ||
      d.reference_number ||
      finalFallback?.finalization?.referenceNumber ||
      null) as string | null,
    periodName:
      (d.periodName ||
      d.period_name ||
      finalFallback?.periodName ||
      empFallback?.periodName ||
      null) as string | null,
    periodId:
      (d.periodId ||
      d.period_id ||
      finalFallback?.periodId ||
      empFallback?.periodId ||
      null) as string | null,
    financialYear:
      (d.financialYear ||
      d.financial_year ||
      empFallback?.financialYear ||
      null) as string | null,
    startDate: (d.startDate || d.start_date || d.periodStartDate || null) as string | null,
    endDate: (d.endDate || d.end_date || d.periodEndDate || null) as string | null,
    paymentDate: (d.paymentDate || d.payment_date || null) as string | null,
    finalizedAt:
      (d.finalizedAt ||
      d.finalized_at ||
      finalFallback?.finalization?.finalizedAt ||
      null) as string | null,
    finalizedByName:
      (d.finalizedByName ||
      d.finalized_by_name ||
      finalFallback?.finalization?.finalizedByName ||
      null) as string | null,
    status: rawStatus,
    isFinalized,
    isLocked,
    employee: {
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
    },
    attendance: {
      workingDays: (att.workingDays ?? att.working_days ?? att.totalDays ?? null) as number | null,
      paidDays: (att.paidDays ?? att.paid_days ?? null) as number | null,
      lopDays: (att.lopDays ?? att.lop_days ?? att.unpaidDays ?? null) as number | null,
      leaveDays: (att.leaveDays ?? att.leave_days ?? null) as number | null,
      presentDays: (att.presentDays ?? att.present_days ?? null) as number | null,
      holidays: (att.holidays ?? att.holiday_days ?? null) as number | null,
      weeklyOffs: (att.weeklyOffs ?? att.weekly_offs ?? null) as number | null,
      overtimeHours: (att.overtimeHours ?? att.overtime_hours ?? null) as number | null,
      ...att,
    },
    earnings: {
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
    },
    deductions: {
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
    },
    statutory: stat && typeof stat === "object" ? {
      employeePf: (statEmployee?.epf ?? stat.employeePf ?? stat.employee_pf ?? ded.pf ?? null) as number | null,
      employerPf: (statEmployer?.epf ?? stat.employerPf ?? stat.employer_pf ?? null) as number | null,
      employeeEsi: (statEmployee?.esi ?? stat.employeeEsi ?? stat.employee_esi ?? ded.esi ?? null) as number | null,
      employerEsi: (statEmployer?.esi ?? stat.employerEsi ?? stat.employer_esi ?? null) as number | null,
      pt: (statEmployee?.pt ?? stat.pt ?? ded.pt ?? null) as number | null,
      tds: (statEmployee?.tds ?? stat.tds ?? ded.tds ?? null) as number | null,
      eps: (statEmployer?.eps ?? stat.eps ?? null) as number | null,
      edli: (statEmployer?.edli ?? stat.edli ?? null) as number | null,
      other: (stat.other || null) as Record<string, unknown> | number | null,
    } : null,
    employerContributions: (d.employerContributions || (statEmployer ? {
      pf: (statEmployer.epf ?? null) as number | null,
      esi: (statEmployer.esi ?? null) as number | null,
      eps: (statEmployer.eps ?? null) as number | null,
      edli: (statEmployer.edli ?? null) as number | null,
      total: (empFallback?.employerContribution ?? null) as number | null,
    } : null)) as PayrollPayslipData["employerContributions"],
    netPay:
      (d.netPay ??
      d.net_pay ??
      empFallback?.netPay ??
      null) as number | null,
    netPayInWords: (d.netPayInWords || d.net_pay_in_words || null) as string | null,
    salaryStructure: (d.salaryStructure || empFallback?.salaryStructure || null) as PayrollPayslipData["salaryStructure"],
    ytd: (d.ytd || empFallback?.ytd || null) as PayrollPayslipData["ytd"],
    document: {
      pdfUrl: (doc.pdfUrl || doc.pdf_url || d.pdfUrl || d.pdf_url || null) as string | null,
      downloadUrl: (doc.downloadUrl || doc.download_url || d.downloadUrl || d.download_url || null) as string | null,
      documentId: (doc.documentId || doc.document_id || d.documentId || null) as string | null,
      hasDocument: Boolean(doc.pdfUrl || doc.downloadUrl || doc.hasDocument || d.hasDocument),
      mimeType: String(doc.mimeType || doc.mime_type || "application/pdf"),
    },
    notes: (d.notes || finalFallback?.finalization?.finalizationNotes || null) as string | null,
  };
}