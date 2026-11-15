import type { PayrollPayslipData, PayslipHistoryItem } from "../types";
import {
  formatPeriodLabel,
  normalizeAttendance,
  normalizeBankInfo,
  pickFirst,
  resolveMonetaryField,
  toNullableNumber,
  toNullableString,
} from "./payslipHelpers";

/**
 * Normalizes a backend payslip payload (supporting /api/v2/payroll/payslips/{runId}/{employeeId}
 * and /api/v2/payroll/runs/{runId}/employees/{employeeId}/payslip shapes) into canonical
 * PayrollPayslipData without computing synthetic net pay or rounding values.
 */
export function normalizePayslip(raw: any): PayrollPayslipData | null {
  if (!raw || typeof raw !== "object") return null;

  const empSrc = raw.employee ?? {};
  const earnSrc = raw.earnings && !Array.isArray(raw.earnings) ? raw.earnings : {};
  const earnArray: Array<{ name?: string; code?: string; amount?: number; amount_paise?: number }> =
    Array.isArray(raw.earnings)
      ? raw.earnings
      : Array.isArray(raw.earning_components)
      ? raw.earning_components
      : [];

  const dedSrc = raw.deductions && !Array.isArray(raw.deductions) ? raw.deductions : {};
  const dedArray: Array<{ name?: string; code?: string; amount?: number; amount_paise?: number }> =
    Array.isArray(raw.deductions)
      ? raw.deductions
      : Array.isArray(raw.deduction_components)
      ? raw.deduction_components
      : [];

  const findComponentAmount = (
    arr: Array<{ name?: string; code?: string; amount?: number; amount_paise?: number }>,
    keys: string[]
  ): number | null => {
    const match = arr.find((item) => {
      const code = (item.code || item.name || "").toLowerCase().trim();
      return keys.some((k) => code === k || code.includes(k));
    });
    if (!match) return null;
    return resolveMonetaryField(match.amount, match.amount_paise);
  };

  const basic = resolveMonetaryField(
    pickFirst(earnSrc.basic, earnSrc.basicSalary, earnSrc.basic_salary, raw.basic),
    pickFirst(earnSrc.basic_paise, earnSrc.basicSalaryPaise)
  ) ?? findComponentAmount(earnArray, ["basic"]);

  const hra = resolveMonetaryField(
    pickFirst(earnSrc.hra, earnSrc.houseRentAllowance, earnSrc.house_rent_allowance, raw.hra),
    pickFirst(earnSrc.hra_paise, earnSrc.hraPaise)
  ) ?? findComponentAmount(earnArray, ["hra", "house rent"]);

  const conveyance = resolveMonetaryField(
    pickFirst(earnSrc.conveyance, earnSrc.conveyanceAllowance, earnSrc.conveyance_allowance),
    pickFirst(earnSrc.conveyance_paise)
  ) ?? findComponentAmount(earnArray, ["conveyance"]);

  const specialAllowance = resolveMonetaryField(
    pickFirst(earnSrc.specialAllowance, earnSrc.special_allowance),
    pickFirst(earnSrc.special_allowance_paise)
  ) ?? findComponentAmount(earnArray, ["special allowance", "special_allowance"]);

  const medicalAllowance = resolveMonetaryField(
    pickFirst(earnSrc.medicalAllowance, earnSrc.medical_allowance),
    pickFirst(earnSrc.medical_allowance_paise)
  ) ?? findComponentAmount(earnArray, ["medical"]);

  const otherAllowances = resolveMonetaryField(
    pickFirst(earnSrc.otherAllowances, earnSrc.other_allowances, earnSrc.allowances, raw.allowances),
    pickFirst(earnSrc.other_allowances_paise)
  ) ?? findComponentAmount(earnArray, ["other allowance"]);

  const overtime = resolveMonetaryField(
    pickFirst(earnSrc.overtime, earnSrc.overtimePay, earnSrc.overtime_pay),
    pickFirst(earnSrc.overtime_paise)
  ) ?? findComponentAmount(earnArray, ["overtime"]);

  const bonus = resolveMonetaryField(
    pickFirst(earnSrc.bonus, earnSrc.performanceBonus, earnSrc.performance_bonus),
    pickFirst(earnSrc.bonus_paise)
  ) ?? findComponentAmount(earnArray, ["bonus"]);

  const incentives = resolveMonetaryField(
    pickFirst(earnSrc.incentives, earnSrc.variablePay, earnSrc.variable_pay),
    pickFirst(earnSrc.incentives_paise)
  ) ?? findComponentAmount(earnArray, ["incentive", "variable"]);

  const arrears = resolveMonetaryField(
    pickFirst(earnSrc.arrears, earnSrc.salaryArrears, earnSrc.salary_arrears),
    pickFirst(earnSrc.arrears_paise)
  ) ?? findComponentAmount(earnArray, ["arrear"]);

  const reimbursements = resolveMonetaryField(
    pickFirst(earnSrc.reimbursements, earnSrc.reimbursement),
    pickFirst(earnSrc.reimbursements_paise)
  ) ?? findComponentAmount(earnArray, ["reimburse"]);

  const otherEarnings = resolveMonetaryField(
    pickFirst(earnSrc.otherEarnings, earnSrc.other_earnings, earnSrc.other),
    pickFirst(earnSrc.other_earnings_paise)
  );

  const grossEarnings = resolveMonetaryField(
    pickFirst(
      earnSrc.grossEarnings,
      earnSrc.gross_earnings,
      raw.grossEarnings,
      raw.gross_earnings,
      raw.grossSalary,
      raw.gross_salary,
      raw.gross
    ),
    pickFirst(earnSrc.gross_earnings_paise, raw.gross_paise, raw.grossEarningsPaise)
  );

  // Deductions
  const pf = resolveMonetaryField(
    pickFirst(dedSrc.pf, dedSrc.epf, dedSrc.employeePf, dedSrc.employee_pf, raw.pf),
    pickFirst(dedSrc.pf_paise, dedSrc.epf_paise)
  ) ?? findComponentAmount(dedArray, ["pf", "epf", "provident"]);

  const esi = resolveMonetaryField(
    pickFirst(dedSrc.esi, dedSrc.employeeEsi, dedSrc.employee_esi, raw.esi),
    pickFirst(dedSrc.esi_paise)
  ) ?? findComponentAmount(dedArray, ["esi"]);

  const pt = resolveMonetaryField(
    pickFirst(dedSrc.pt, dedSrc.professionalTax, dedSrc.professional_tax, raw.pt),
    pickFirst(dedSrc.pt_paise, dedSrc.professional_tax_paise)
  ) ?? findComponentAmount(dedArray, ["professional tax", "pt"]);

  const tds = resolveMonetaryField(
    pickFirst(dedSrc.tds, dedSrc.incomeTax, dedSrc.income_tax, raw.tds, raw.tax),
    pickFirst(dedSrc.tds_paise, dedSrc.income_tax_paise)
  ) ?? findComponentAmount(dedArray, ["tds", "income tax"]);

  const loan = resolveMonetaryField(
    pickFirst(dedSrc.loan, dedSrc.loanRecovery, dedSrc.loan_recovery),
    pickFirst(dedSrc.loan_paise)
  ) ?? findComponentAmount(dedArray, ["loan"]);

  const advance = resolveMonetaryField(
    pickFirst(dedSrc.advance, dedSrc.salaryAdvance, dedSrc.salary_advance),
    pickFirst(dedSrc.advance_paise)
  ) ?? findComponentAmount(dedArray, ["advance"]);

  const otherDeductions = resolveMonetaryField(
    pickFirst(dedSrc.otherDeductions, dedSrc.other_deductions, dedSrc.other, raw.other_deductions),
    pickFirst(dedSrc.other_deductions_paise)
  );

  const totalDeductions = resolveMonetaryField(
    pickFirst(
      dedSrc.totalDeductions,
      dedSrc.total_deductions,
      raw.totalDeductions,
      raw.total_deductions
    ),
    pickFirst(dedSrc.total_deductions_paise, raw.total_deductions_paise, raw.totalDeductionsPaise)
  );

  const netPay = resolveMonetaryField(
    pickFirst(raw.netPay, raw.net_pay, raw.netSalary, raw.net_salary),
    pickFirst(raw.net_pay_paise, raw.netPayPaise)
  );

  const empContributionsSrc = raw.employerContributions ?? raw.employer_contributions;
  const statutorySrc = raw.statutory;
  const ytdSrc = raw.ytd;

  const status = toNullableString(pickFirst(raw.status, raw.runStatus, raw.run_status)) || "Processed";
  const isFinalized = Boolean(
    raw.isFinalized ??
      raw.is_finalized ??
      ["finalized", "closed", "locked", "paid"].includes(status.toLowerCase())
  );

  return {
    id: String(pickFirst(raw.id, raw.payslipId, raw.payslip_id, raw.runId, raw.run_id, "")),
    runId: toNullableString(pickFirst(raw.runId, raw.run_id)) || "",
    employeeId: String(
      pickFirst(empSrc.id, empSrc.employeeId, empSrc.employee_id, raw.employeeId, raw.employee_id, "")
    ),
    employeeName:
      toNullableString(
        pickFirst(empSrc.name, empSrc.fullName, empSrc.full_name, raw.employeeName, raw.employee_name)
      ) || undefined,
    payslipNumber: toNullableString(pickFirst(raw.payslipNumber, raw.payslip_number)),
    referenceNumber: toNullableString(pickFirst(raw.referenceNumber, raw.reference_number)),
    status,
    isFinalized,
    periodName: formatPeriodLabel(
      pickFirst(raw.periodName, raw.period_name, raw.cycle?.name),
      pickFirst(raw.periodMonth, raw.period_month, raw.month),
      pickFirst(raw.periodYear, raw.period_year, raw.year)
    ),
    financialYear: toNullableString(pickFirst(raw.financialYear, raw.financial_year)),
    startDate: toNullableString(pickFirst(raw.startDate, raw.start_date, raw.cycle?.start_date)),
    endDate: toNullableString(pickFirst(raw.endDate, raw.end_date, raw.cycle?.end_date)),
    finalizedAt: toNullableString(pickFirst(raw.finalizedAt, raw.finalized_at)),
    finalizedByName: toNullableString(pickFirst(raw.finalizedByName, raw.finalized_by_name)),
    paymentDate: toNullableString(pickFirst(raw.paymentDate, raw.payment_date, raw.payDate, raw.pay_date)),
    netPay,
    netPayInWords: toNullableString(pickFirst(raw.netPayInWords, raw.net_pay_in_words)),
    employee: {
      id: String(
        pickFirst(
          empSrc.employeeCode,
          empSrc.employee_code,
          empSrc.id,
          empSrc.employeeId,
          raw.employeeId,
          raw.employee_id,
          "—"
        )
      ),
      name:
        toNullableString(
          pickFirst(empSrc.name, empSrc.fullName, empSrc.full_name, raw.employeeName, raw.employee_name)
        ) || "Employee",
      department: toNullableString(pickFirst(empSrc.department, raw.department)),
      designation: toNullableString(pickFirst(empSrc.designation, raw.designation)),
      location: toNullableString(pickFirst(empSrc.location, empSrc.workLocation, empSrc.work_location)),
      joiningDate: toNullableString(pickFirst(empSrc.joiningDate, empSrc.joining_date, empSrc.date_of_joining)),
      pan: toNullableString(pickFirst(empSrc.pan, empSrc.panNumber, empSrc.pan_number, raw.pan)),
      uan: toNullableString(pickFirst(empSrc.uan, empSrc.uanNumber, empSrc.uan_number)),
      pfNumber: toNullableString(pickFirst(empSrc.pfNumber, empSrc.pf_number)),
      esiNumber: toNullableString(pickFirst(empSrc.esiNumber, empSrc.esi_number)),
      bankInfo: normalizeBankInfo(raw),
    },
    attendance: normalizeAttendance(raw),
    earnings: {
      basic,
      hra,
      conveyance,
      specialAllowance,
      medicalAllowance,
      otherAllowances,
      overtime,
      bonus,
      incentives,
      arrears,
      reimbursements,
      otherEarnings,
      grossEarnings,
    },
    deductions: {
      pf,
      esi,
      pt,
      tds,
      loan,
      advance,
      otherDeductions,
      totalDeductions,
    },
    employerContributions: empContributionsSrc
      ? {
          pf: resolveMonetaryField(
            pickFirst(empContributionsSrc.pf, empContributionsSrc.employerPf, empContributionsSrc.employer_pf),
            empContributionsSrc.pf_paise
          ),
          esi: resolveMonetaryField(
            pickFirst(empContributionsSrc.esi, empContributionsSrc.employerEsi, empContributionsSrc.employer_esi),
            empContributionsSrc.esi_paise
          ),
          eps: resolveMonetaryField(empContributionsSrc.eps, empContributionsSrc.eps_paise),
          edli: resolveMonetaryField(empContributionsSrc.edli, empContributionsSrc.edli_paise),
        }
      : null,
    statutory: statutorySrc
      ? {
          employerPf: resolveMonetaryField(
            pickFirst(statutorySrc.employerPf, statutorySrc.employer_pf),
            statutorySrc.employer_pf_paise
          ),
          employerEsi: resolveMonetaryField(
            pickFirst(statutorySrc.employerEsi, statutorySrc.employer_esi),
            statutorySrc.employer_esi_paise
          ),
          eps: resolveMonetaryField(statutorySrc.eps, statutorySrc.eps_paise),
          edli: resolveMonetaryField(statutorySrc.edli, statutorySrc.edli_paise),
        }
      : null,
    ytd: ytdSrc
      ? {
          grossEarnings: resolveMonetaryField(
            pickFirst(ytdSrc.grossEarnings, ytdSrc.gross_earnings, ytdSrc.gross),
            ytdSrc.gross_paise
          ),
          taxableIncome: resolveMonetaryField(
            pickFirst(ytdSrc.taxableIncome, ytdSrc.taxable_income),
            ytdSrc.taxable_income_paise
          ),
          tds: resolveMonetaryField(pickFirst(ytdSrc.tds, ytdSrc.tax), ytdSrc.tds_paise),
          netPay: resolveMonetaryField(
            pickFirst(ytdSrc.netPay, ytdSrc.net_pay),
            ytdSrc.net_pay_paise
          ),
        }
      : null,
    earningsBreakdown: earnArray.map((e) => ({
      name: String(e.name || e.code || "Component"),
      amount: resolveMonetaryField(e.amount, e.amount_paise) ?? 0,
    })),
    deductionsBreakdown: dedArray.map((d) => ({
      name: String(d.name || d.code || "Deduction"),
      amount: resolveMonetaryField(d.amount, d.amount_paise) ?? 0,
    })),
  };
}

/**
 * Normalizes a payslip list item from /api/v2/payroll/my-payslips or
 * /api/v2/payroll/employees/{employeeId}/payslips.
 */
export function normalizePayslipHistoryItem(raw: any): PayslipHistoryItem {
  const month = toNullableNumber(pickFirst(raw?.periodMonth, raw?.period_month, raw?.month));
  const year = toNullableNumber(pickFirst(raw?.periodYear, raw?.period_year, raw?.year));
  const netPay = resolveMonetaryField(
    pickFirst(raw?.netPay, raw?.net_pay, raw?.netSalary, raw?.net_salary),
    pickFirst(raw?.net_pay_paise, raw?.netPayPaise)
  );
  const grossPay = resolveMonetaryField(
    pickFirst(raw?.grossPay, raw?.gross_pay, raw?.grossEarnings, raw?.gross_earnings),
    pickFirst(raw?.gross_paise, raw?.grossPaise)
  );
  const totalDeductions = resolveMonetaryField(
    pickFirst(raw?.totalDeductions, raw?.total_deductions),
    pickFirst(raw?.total_deductions_paise, raw?.totalDeductionsPaise)
  );

  return {
    id: String(pickFirst(raw?.id, raw?.payslipId, raw?.payslip_id, raw?.runId, raw?.run_id, "")),
    runId: String(pickFirst(raw?.runId, raw?.run_id, "")),
    employeeId: String(pickFirst(raw?.employeeId, raw?.employee_id, "")),
    employeeName: toNullableString(pickFirst(raw?.employeeName, raw?.employee_name)) ?? undefined,
    payslipNumber: toNullableString(pickFirst(raw?.payslipNumber, raw?.payslip_number)) ?? undefined,
    periodName: formatPeriodLabel(
      pickFirst(raw?.periodName, raw?.period_name),
      month,
      year
    ),
    month: month ? String(month) : "",
    year: year ?? 0,
    netPay,
    grossPay,
    totalDeductions,
    status: toNullableString(raw?.status) ?? undefined,
    finalizedAt: toNullableString(pickFirst(raw?.finalizedAt, raw?.finalized_at)) ?? undefined,
    paymentDate: toNullableString(pickFirst(raw?.paymentDate, raw?.payment_date, raw?.payDate, raw?.pay_date)) ?? undefined,
    downloadUrl: toNullableString(pickFirst(raw?.downloadUrl, raw?.download_url)) ?? undefined,
  };
}
