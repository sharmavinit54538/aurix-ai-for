import {
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  ArrowUpRight,
  BadgeIndianRupee,
  Banknote,
  BarChart3,
  BellRing,
  Bot,
  Building,
  CalendarCheck2,
  CalendarClock,
  CheckCheck,
  CheckCircle2,
  Clock,
  Coins,
  Cpu,
  CreditCard,
  FileBadge,
  FileCheck2,
  FileClock,
  FileCode2,
  FileSpreadsheet,
  FileText,
  GitPullRequest,
  HandCoins,
  History,
  Layers,
  LayoutDashboard,
  MinusCircle,
  Network,
  Percent,
  PlayCircle,
  Receipt,
  RotateCcw,
  Scale,
  ScanSearch,
  ScrollText,
  Send,
  Settings2,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Stamp,
  UserCheck,
  UserMinus,
  Users,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";

export interface PayrollModuleItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  to: string;
  color: string;
  badge?: string;
  row?: number;
}

/**
 * 30 Core Payroll Modules organized in 10 rows of 3 columns
 */
export const PAYROLL_MODULES_LIST: PayrollModuleItem[] = [
  // ── Row 1 ─────────────────────────────────────────────────────────────
  {
    id: "payroll-dashboard",
    title: "Payroll Dashboard",
    description:
      "Central payroll command center showing current payroll status, pending actions, payroll cost, exceptions and upcoming payroll activities.",
    icon: LayoutDashboard,
    to: "/dashboard/payroll",
    color: "from-indigo-600/20 to-blue-600/20 text-indigo-400 border-indigo-500/30",
    row: 1,
  },
  {
    id: "payroll-periods",
    title: "Payroll Periods",
    description:
      "Create and manage monthly payroll cycles, pay periods, cutoff dates, processing dates and payroll calendars.",
    icon: CalendarClock,
    to: "/dashboard/payroll/periods",
    color: "from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30",
    row: 1,
  },
  {
    id: "payroll-runs",
    title: "Payroll Runs",
    description:
      "Calculate payroll for employees using attendance, leave, salary structures, deductions, taxes and adjustments.",
    icon: PlayCircle,
    to: "/dashboard/payroll/periods",
    color: "from-violet-500/20 to-purple-500/20 text-violet-400 border-violet-500/30",
    row: 1,
  },

  // ── Row 2 ─────────────────────────────────────────────────────────────
  {
    id: "payroll-validation",
    title: "Payroll Validation",
    description:
      "Detect payroll errors, missing employee data, calculation discrepancies, rule violations and compliance issues before approval.",
    icon: ShieldCheck,
    to: "/dashboard/payroll/runs/current/validation",
    color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
    row: 2,
  },
  {
    id: "payroll-preview",
    title: "Payroll Preview",
    description:
      "Review provisional payroll totals, gross earnings, deductions, taxes, employer costs and net pay before finalization.",
    icon: FileSpreadsheet,
    to: "/dashboard/payroll/runs/current/preview",
    color: "from-sky-500/20 to-blue-500/20 text-sky-400 border-sky-500/30",
    row: 2,
  },
  {
    id: "employee-payroll",
    title: "Employee Payroll",
    description:
      "View employee-wise salary breakdown, earnings, deductions, taxes, benefits, net pay and payroll history.",
    icon: Users,
    to: "/dashboard/employee/payroll",
    color: "from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30",
    row: 2,
  },

  // ── Row 3 ─────────────────────────────────────────────────────────────
  {
    id: "review-approval",
    title: "Review & Approval",
    description:
      "Manage HR, Finance and Executive payroll approvals with approval status, comments, exceptions and audit history.",
    icon: Stamp,
    to: "/dashboard/payroll/runs/current/approval",
    color: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30",
    row: 3,
  },
  {
    id: "payments",
    title: "Payments",
    description:
      "Manage payroll payment batches, bank processing, payment status, transaction references and payment dates.",
    icon: CreditCard,
    to: "/dashboard/payroll/payments",
    color: "from-emerald-500/20 to-green-500/20 text-emerald-400 border-emerald-500/30",
    row: 3,
  },
  {
    id: "payslips",
    title: "Payslips",
    description:
      "Generate, publish, download and distribute employee payslips with delivery tracking.",
    icon: Receipt,
    to: "/dashboard/payroll/payslips",
    color: "from-cyan-500/20 to-teal-500/20 text-cyan-400 border-cyan-500/30",
    row: 3,
  },

  // ── Row 4 ─────────────────────────────────────────────────────────────
  {
    id: "payroll-history",
    title: "Payroll History",
    description:
      "Access previous payroll runs, finalized payroll periods, payroll summaries and historical employee payroll records.",
    icon: History,
    to: "/dashboard/payroll/periods",
    color: "from-blue-600/20 to-slate-500/20 text-blue-400 border-blue-500/30",
    row: 4,
  },
  {
    id: "payroll-reports",
    title: "Payroll Reports",
    description:
      "Generate payroll, salary, deduction, tax, employee cost and management reports.",
    icon: BarChart3,
    to: "/dashboard/payroll/reports",
    color: "from-indigo-500/20 to-violet-500/20 text-indigo-400 border-indigo-500/30",
    row: 4,
  },
  {
    id: "payroll-reconciliation",
    title: "Payroll Reconciliation",
    description:
      "Compare calculated payroll against actual payment data and identify discrepancies.",
    icon: Scale,
    to: "/dashboard/payroll/payments",
    color: "from-teal-500/20 to-emerald-500/20 text-teal-400 border-teal-500/30",
    row: 4,
  },

  // ── Row 5 ─────────────────────────────────────────────────────────────
  {
    id: "failed-payments",
    title: "Failed Payments",
    description:
      "Track rejected, failed, pending and returned salary payments with retry and resolution actions.",
    icon: AlertOctagon,
    to: "/dashboard/payroll/payments",
    color: "from-rose-500/20 to-red-500/20 text-rose-400 border-rose-500/30",
    row: 5,
  },
  {
    id: "off-cycle-payroll",
    title: "Off-Cycle Payroll",
    description:
      "Process bonuses, arrears, corrections, emergency payrolls and special salary payments outside the normal cycle.",
    icon: Zap,
    to: "/dashboard/payroll/compensation",
    color: "from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30",
    row: 5,
  },
  {
    id: "final-settlement",
    title: "Final Settlement",
    description:
      "Manage employee Full & Final Settlement including pending salary, leave encashment, deductions, recoveries and final payment.",
    icon: UserMinus,
    to: "/dashboard/payroll/full-and-final",
    color: "from-purple-500/20 to-indigo-500/20 text-purple-400 border-purple-500/30",
    row: 5,
  },

  // ── Row 6 ─────────────────────────────────────────────────────────────
  {
    id: "salary-revision",
    title: "Salary Revision",
    description:
      "Manage increments, promotions, salary changes, effective dates and revision history.",
    icon: ArrowUpRight,
    to: "/dashboard/payroll/compensation",
    color: "from-emerald-500/20 to-cyan-500/20 text-emerald-400 border-emerald-500/30",
    row: 6,
  },
  {
    id: "bonus-incentives",
    title: "Bonus & Incentives",
    description:
      "Manage bonuses, incentives, commissions and performance-linked compensation.",
    icon: Coins,
    to: "/dashboard/payroll/compensation",
    color: "from-yellow-500/20 to-amber-500/20 text-yellow-400 border-yellow-500/30",
    row: 6,
  },
  {
    id: "deductions",
    title: "Deductions",
    description:
      "Manage employee deductions, recoveries, penalties, benefits and other payroll deductions.",
    icon: MinusCircle,
    to: "/dashboard/payroll/variable-inputs",
    color: "from-orange-500/20 to-red-500/20 text-orange-400 border-orange-500/30",
    row: 6,
  },

  // ── Row 7 ─────────────────────────────────────────────────────────────
  {
    id: "tax-tds",
    title: "Tax & TDS",
    description:
      "Manage TDS calculations, tax declarations, exemptions, tax deductions and annual tax information.",
    icon: Percent,
    to: "/dashboard/payroll/statutory",
    color: "from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30",
    row: 7,
  },
  {
    id: "statutory-compliance",
    title: "Statutory Compliance",
    description:
      "Manage PF, ESI, Professional Tax and other statutory payroll requirements.",
    icon: ShieldCheck,
    to: "/dashboard/payroll/statutory",
    color: "from-purple-500/20 to-blue-500/20 text-purple-400 border-purple-500/30",
    row: 7,
  },
  {
    id: "loans-advances",
    title: "Loans & Advances",
    description:
      "Track employee loans, salary advances, repayment schedules, outstanding balances and payroll recoveries.",
    icon: HandCoins,
    to: "/dashboard/payroll/variable-inputs",
    color: "from-teal-500/20 to-sky-500/20 text-teal-400 border-teal-500/30",
    row: 7,
  },

  // ── Row 8 ─────────────────────────────────────────────────────────────
  {
    id: "reimbursements",
    title: "Reimbursements",
    description:
      "Manage employee expense claims, approvals, reimbursements and payroll integration.",
    icon: FileBadge,
    to: "/dashboard/expenses",
    color: "from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30",
    row: 8,
  },
  {
    id: "attendance-leave-inputs",
    title: "Attendance & Leave Inputs",
    description:
      "Review attendance, overtime, leave, unpaid leave and other payroll inputs before calculation.",
    icon: CalendarCheck2,
    to: "/dashboard/payroll/variable-inputs",
    color: "from-indigo-500/20 to-teal-500/20 text-indigo-400 border-indigo-500/30",
    row: 8,
  },
  {
    id: "payroll-adjustments",
    title: "Payroll Adjustments",
    description:
      "Create one-time payroll adjustments, corrections and manual payroll entries with audit tracking.",
    icon: SlidersHorizontal,
    to: "/dashboard/payroll/variable-inputs",
    color: "from-rose-500/20 to-orange-500/20 text-rose-400 border-rose-500/30",
    row: 8,
  },

  // ── Row 9 ─────────────────────────────────────────────────────────────
  {
    id: "arrears-retroactive",
    title: "Arrears & Retroactive Changes",
    description:
      "Calculate and manage salary arrears resulting from backdated salary revisions, promotions or corrections.",
    icon: FileClock,
    to: "/dashboard/payroll/compensation",
    color: "from-amber-500/20 to-purple-500/20 text-amber-400 border-amber-500/30",
    row: 9,
  },
  {
    id: "payroll-policies-rules",
    title: "Payroll Policies & Rules",
    description:
      "Configure payroll calculation rules, processing policies, eligibility rules and organization-specific payroll logic.",
    icon: FileCode2,
    to: "/dashboard/payroll/salary-structure",
    color: "from-sky-500/20 to-indigo-500/20 text-sky-400 border-sky-500/30",
    row: 9,
  },
  {
    id: "salary-structures",
    title: "Salary Structures",
    description:
      "Create and manage salary structures, earning components, deductions, allowances and employer contributions.",
    icon: Layers,
    to: "/dashboard/payroll/salary-structure",
    color: "from-violet-500/20 to-fuchsia-500/20 text-violet-400 border-violet-500/30",
    row: 9,
  },

  // ── Row 10 ────────────────────────────────────────────────────────────
  {
    id: "payment-configuration",
    title: "Payment Configuration",
    description:
      "Configure bank accounts, payment methods, payment schedules and payroll payment settings.",
    icon: Settings2,
    to: "/dashboard/payroll/payments",
    color: "from-slate-500/20 to-indigo-500/20 text-slate-300 border-slate-500/30",
    row: 10,
  },
  {
    id: "payroll-integrations",
    title: "Payroll Integrations",
    description:
      "Connect payroll with attendance, leave, accounting, banking, HR and external systems.",
    icon: Network,
    to: "/dashboard/settings/integrations",
    color: "from-cyan-500/20 to-indigo-500/20 text-cyan-400 border-cyan-500/30",
    row: 10,
  },
  {
    id: "payroll-audit-logs",
    title: "Payroll Audit Logs",
    description:
      "Track every payroll action, modification, approval, calculation change and system event.",
    icon: ScrollText,
    to: "/dashboard/settings/audit-logs",
    color: "from-purple-500/20 to-rose-500/20 text-purple-400 border-purple-500/30",
    row: 10,
  },
];

/**
 * OFC360 Payroll Intelligence & Autopilot Modules (10 modules)
 */
export const PAYROLL_INTELLIGENCE_MODULES: PayrollModuleItem[] = [
  {
    id: "payroll-autopilot",
    title: "Payroll Autopilot",
    description:
      "Automatically orchestrate payroll preparation, validation, approvals, payment processing and payslip generation.",
    icon: Sparkles,
    to: "/dashboard/autopilot",
    color: "from-indigo-600/25 to-purple-600/25 text-indigo-400 border-indigo-500/30",
    badge: "Autopilot",
  },
  {
    id: "automation-rules",
    title: "Automation Rules",
    description:
      "Create trigger-based payroll automation rules for recurring payroll actions.",
    icon: Workflow,
    to: "/dashboard/autopilot/rules",
    color: "from-blue-500/20 to-violet-500/20 text-blue-400 border-blue-500/30",
    badge: "Rules",
  },
  {
    id: "auto-validation",
    title: "Auto Validation",
    description:
      "Automatically validate employee data, attendance, salary components, deductions and payroll calculations.",
    icon: CheckCheck,
    to: "/dashboard/autopilot/exceptions",
    color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
    badge: "Continuous",
  },
  {
    id: "auto-error-detection",
    title: "Auto Error Detection",
    description:
      "Detect anomalies, missing data, unusual salary changes and calculation errors before payroll approval.",
    icon: ScanSearch,
    to: "/dashboard/autopilot/audit",
    color: "from-rose-500/20 to-orange-500/20 text-rose-400 border-rose-500/30",
    badge: "Anomalies",
  },
  {
    id: "auto-approval-workflow",
    title: "Auto Approval Workflow",
    description:
      "Automatically route payroll approvals to the correct HR, Finance and Executive stakeholders.",
    icon: GitPullRequest,
    to: "/dashboard/autopilot/agent",
    color: "from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30",
    badge: "Workflow",
  },
  {
    id: "auto-payment-processing",
    title: "Auto Payment Processing",
    description:
      "Automatically prepare approved payroll payment batches and track payment execution.",
    icon: Banknote,
    to: "/dashboard/payroll/payments",
    color: "from-emerald-500/20 to-cyan-500/20 text-emerald-400 border-emerald-500/30",
    badge: "Payments",
  },
  {
    id: "auto-payslip-generation",
    title: "Auto Payslip Generation",
    description:
      "Automatically generate and publish finalized employee payslips.",
    icon: FileCheck2,
    to: "/dashboard/payroll/payslips",
    color: "from-sky-500/20 to-indigo-500/20 text-sky-400 border-sky-500/30",
    badge: "Publish",
  },
  {
    id: "auto-notifications",
    title: "Auto Notifications",
    description:
      "Automatically notify HR, managers and employees about payroll events, approvals, failures and payslip availability.",
    icon: BellRing,
    to: "/dashboard/notifications",
    color: "from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30",
    badge: "Alerts",
  },
  {
    id: "payroll-alerts",
    title: "Payroll Alerts",
    description:
      "Surface critical payroll exceptions, deadlines, failed payments and compliance risks.",
    icon: AlertTriangle,
    to: "/dashboard/autopilot/alerts",
    color: "from-red-500/20 to-rose-500/20 text-red-400 border-red-500/30",
    badge: "Real-time",
  },
  {
    id: "ai-payroll-assistant",
    title: "AI Payroll Assistant",
    description:
      "Provide a natural-language AI assistant that can answer payroll questions, analyze payroll data and execute permitted payroll actions.",
    icon: Bot,
    to: "/dashboard/ai-hub/assistant",
    color: "from-violet-500/20 to-indigo-500/20 text-violet-400 border-violet-500/30",
    badge: "AI Agent",
  },
];
