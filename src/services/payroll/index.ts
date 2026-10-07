// ── Barrel Export for Payroll Services ────────────────────────────────

// Types
export * from "./types";

// Errors
export * from "./errors";

// Utils
export * from "./utils";

// Normalizers
export * from "./normalizers";

// API Modules
export * from "./periodsApi";
export * from "./dashboardApi";
export * from "./runsApi";
export * from "./previewApi";
export * from "./validationApi";
export * from "./reviewApi";
export * from "./finalizationApi";
export * from "./payslipsApi";

// Default export for backward compatibility
import * as periodsApi from "./periodsApi";
import * as dashboardApi from "./dashboardApi";
import * as runsApi from "./runsApi";
import * as previewApi from "./previewApi";
import * as validationApi from "./validationApi";
import * as reviewApi from "./reviewApi";
import * as finalizationApi from "./finalizationApi";
import * as payslipsApi from "./payslipsApi";

const payrollApi = {
  // Periods
  getPeriodsList: periodsApi.getPeriodsList,
  getPeriods: periodsApi.getPeriods,
  getPeriod: periodsApi.getPeriod,
  createPeriod: periodsApi.createPeriod,
  lockPeriod: periodsApi.lockPeriod,
  reopenPeriod: periodsApi.reopenPeriod,
  voidPeriod: periodsApi.voidPeriod,

  // Dashboard
  getDashboard: dashboardApi.getDashboard,

  // Runs
  runPayroll: runsApi.runPayroll,
  getPayrollRunStatus: runsApi.getPayrollRunStatus,
  cancelPayrollRun: runsApi.cancelPayrollRun,
  retryPayrollRun: runsApi.retryPayrollRun,
  getPayrollRunValidationIssues: runsApi.getPayrollRunValidationIssues,
  recalculatePayroll: runsApi.recalculatePayroll,

  // Preview
  getPayrollPreview: previewApi.getPayrollPreview,
  getRunEmployees: previewApi.getRunEmployees,
  getRunEmployeeDetail: previewApi.getRunEmployeeDetail,

  // Validation
  getPayrollValidation: validationApi.getPayrollValidation,
  runPayrollValidation: validationApi.runPayrollValidation,

  // Review & Approval
  getPayrollReview: reviewApi.getPayrollReview,
  approvePayroll: reviewApi.approvePayroll,
  rejectPayroll: reviewApi.rejectPayroll,

  // Finalization
  getPayrollFinalization: finalizationApi.getPayrollFinalization,
  finalizePayroll: finalizationApi.finalizePayroll,

  // Payslips
  getPayslip: payslipsApi.getPayslip,
  getPayslipById: payslipsApi.getPayslipById,
  downloadPayslip: payslipsApi.downloadPayslip,
  generatePayslips: payslipsApi.generatePayslips,
  getEmployeePayslipHistory: payslipsApi.getEmployeePayslipHistory,
  getMyPayslips: payslipsApi.getMyPayslips,
};

export default payrollApi;