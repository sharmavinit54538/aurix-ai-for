import type {
  PayrollPayslipData,
  PayrollPreviewEmployee,
  PayrollFinalizationData,
} from "../types";
import {
  extractEmployeeInfo,
  extractAttendance,
  extractEarnings,
  extractDeductions,
  extractStatutory,
  extractEmployerContributions,
  extractDocument,
} from "./payslipHelpers";

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
    employee: extractEmployeeInfo(emp, employeeId),
    attendance: extractAttendance(att),
    earnings: extractEarnings(earn, d, empFallback),
    deductions: extractDeductions(ded, d, empFallback),
    statutory: extractStatutory(stat, statEmployee, statEmployer, ded),
    employerContributions: extractEmployerContributions(d, statEmployer, empFallback),
    netPay:
      (d.netPay ??
      d.net_pay ??
      empFallback?.netPay ??
      null) as number | null,
    netPayInWords: (d.netPayInWords || d.net_pay_in_words || null) as string | null,
    salaryStructure: (d.salaryStructure || empFallback?.salaryStructure || null) as PayrollPayslipData["salaryStructure"],
    ytd: (d.ytd || empFallback?.ytd || null) as PayrollPayslipData["ytd"],
    document: extractDocument(doc, d),
    notes: (d.notes || finalFallback?.finalization?.finalizationNotes || null) as string | null,
  };
}