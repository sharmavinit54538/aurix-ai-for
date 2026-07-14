import { lazyFeaturePage } from "@/routes/_lib/lazyFeaturePage";
import type { ComponentType, LazyExoticComponent } from "react";

export interface PayrollSectionConfig {
  title: string;
  page: LazyExoticComponent<ComponentType>;
}

export const payrollSections = {
  copilot: {
    title: "AI Payroll Copilot — Aurix",
    page: lazyFeaturePage(
      () => import("./pages/PayrollCopilotPage"),
      "PayrollCopilotPage",
    ),
  },
  "salary-processing": {
    title: "Salary Processing — Aurix",
    page: lazyFeaturePage(
      () => import("./pages/PayrollSalaryProcessingPage"),
      "PayrollSalaryProcessingPage",
    ),
  },
  "salary-structure": {
    title: "Salary Structure — Aurix",
    page: lazyFeaturePage(
      () => import("./pages/PayrollSalaryStructurePage"),
      "PayrollSalaryStructurePage",
    ),
  },
  payslips: {
    title: "Payslips — Aurix",
    page: lazyFeaturePage(
      () => import("./pages/PayrollPayslipsPage"),
      "PayrollPayslipsPage",
    ),
  },
  reimbursements: {
    title: "Reimbursements — Aurix",
    page: lazyFeaturePage(
      () => import("./pages/PayrollReimbursementsPage"),
      "PayrollReimbursementsPage",
    ),
  },
  bonuses: {
    title: "Bonuses & Incentives — Aurix",
    page: lazyFeaturePage(
      () => import("./pages/PayrollBonusesPage"),
      "PayrollBonusesPage",
    ),
  },
  deductions: {
    title: "Deductions — Aurix",
    page: lazyFeaturePage(
      () => import("./pages/PayrollDeductionsPage"),
      "PayrollDeductionsPage",
    ),
  },
  advances: {
    title: "Advances & Loans — Aurix",
    page: lazyFeaturePage(
      () => import("./pages/PayrollAdvancesPage"),
      "PayrollAdvancesPage",
    ),
  },
  overtime: {
    title: "Overtime Payments — Aurix",
    page: lazyFeaturePage(
      () => import("./pages/PayrollOvertimePage"),
      "PayrollOvertimePage",
    ),
  },
  tax: {
    title: "Tax Management — Aurix",
    page: lazyFeaturePage(
      () => import("./pages/PayrollTaxPage"),
      "PayrollTaxPage",
    ),
  },
  approvals: {
    title: "Payroll Approvals — Aurix",
    page: lazyFeaturePage(
      () => import("./pages/PayrollApprovalsPage"),
      "PayrollApprovalsPage",
    ),
  },
  reports: {
    title: "Payroll Reports — Aurix",
    page: lazyFeaturePage(
      () => import("./pages/PayrollReportsPage"),
      "PayrollReportsPage",
    ),
  },
  "bank-transfers": {
    title: "Bank Transfers — Aurix",
    page: lazyFeaturePage(
      () => import("./pages/PayrollBankTransfersPage"),
      "PayrollBankTransfersPage",
    ),
  },
  compliance: {
    title: "Compliance — Aurix",
    page: lazyFeaturePage(
      () => import("./pages/PayrollCompliancePage"),
      "PayrollCompliancePage",
    ),
  },
  settings: {
    title: "Payroll Settings — Aurix",
    page: lazyFeaturePage(
      () => import("./pages/PayrollSettingsPage"),
      "PayrollSettingsPage",
    ),
  },
} satisfies Record<string, PayrollSectionConfig>;

export type PayrollSection = keyof typeof payrollSections;

export function isPayrollSection(section: string): section is PayrollSection {
  return section in payrollSections;
}
