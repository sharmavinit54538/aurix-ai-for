import React from "react";
import {
  LayoutDashboard,
  FilePlus,
  HeartHandshake,
  FileCheck2,
  Clock,
  Landmark,
  Calculator,
  Receipt,
  ShieldAlert,
  CheckCircle2,
  Percent,
  Users,
  FileText,
  FileSpreadsheet,
  Brain,
  History,
  Bell,
  Settings,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface AdvanceModuleCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: "Core Workflow" | "Loans & Recovery" | "Policies & Credit" | "AI & Compliance" | "Analytics & Settings";
  icon: React.ElementType;
  badgeText?: string;
  badgeVariant?: "default" | "secondary" | "outline" | "destructive";
  badgeColor?: string;
  iconBg: string;
  iconColor: string;
  metricLabel?: string;
  metricValue?: string;
}

interface AdvanceHubCardGridProps {
  onSelectModule: (moduleId: string) => void;
  selectedCategory: string;
  searchQuery: string;
}

export const ADVANCE_MODULE_CARDS: AdvanceModuleCard[] = [
  {
    id: "dashboard",
    title: "Advance Dashboard",
    subtitle: "Company Advance & Loan Overview",
    description: "Company advance KPIs, pending applications, approved loans, disbursed amount, outstanding balances, monthly recovery, and AI insights.",
    category: "Core Workflow",
    icon: LayoutDashboard,
    badgeText: "Real-time",
    badgeColor: "border-blue-500/30 text-blue-400 bg-blue-500/10",
    iconBg: "bg-blue-500/10 border-blue-500/20",
    iconColor: "text-blue-400",
    metricLabel: "Total Disbursed",
    metricValue: "₹4,85,000",
  },
  {
    id: "requests",
    title: "Salary Advance Requests",
    subtitle: "Employee Salary Advance Submission Wizard",
    description: "Draft, submit, and track salary advance applications with proof attachments, business purpose, and approval history.",
    category: "Core Workflow",
    icon: FilePlus,
    badgeText: "Submission",
    badgeColor: "border-indigo-500/30 text-indigo-400 bg-indigo-500/10",
    iconBg: "bg-indigo-500/10 border-indigo-500/20",
    iconColor: "text-indigo-400",
    metricLabel: "Active Requests",
    metricValue: "18 Requests",
  },
  {
    id: "employee-loans",
    title: "Employee Loans",
    subtitle: "Personal, Emergency, Medical & Asset Loans",
    description: "Multi-category loan management including Personal, Emergency, Education, Medical, Travel, and Asset purchase loans.",
    category: "Loans & Recovery",
    icon: HeartHandshake,
    badgeText: "Multi-category",
    badgeColor: "border-teal-500/30 text-teal-400 bg-teal-500/10",
    iconBg: "bg-teal-500/10 border-teal-500/20",
    iconColor: "text-teal-400",
    metricLabel: "Active Loans",
    metricValue: "12 Loans",
  },
  {
    id: "applications",
    title: "Loan Applications",
    subtitle: "New, Review, Approved & Closed Applications",
    description: "Track loan application lifecycle from initial HR review, background check, approval sign-off, to full loan closure.",
    category: "Core Workflow",
    icon: FileCheck2,
    badgeText: "Lifecycle",
    badgeColor: "border-cyan-500/30 text-cyan-400 bg-cyan-500/10",
    iconBg: "bg-cyan-500/10 border-cyan-500/20",
    iconColor: "text-cyan-400",
    metricLabel: "In Review",
    metricValue: "5 Applications",
  },
  {
    id: "approval-workflow",
    title: "Approval Workflow",
    subtitle: "Manager, HR, Finance & Payroll Sign-offs",
    description: "Multi-tier approval matrix with bulk approvals, rejection reasons, audit timelines, and HOD comments.",
    category: "Core Workflow",
    icon: Clock,
    badgeText: "Action Queue",
    badgeColor: "border-amber-500/30 text-amber-400 bg-amber-500/10",
    iconBg: "bg-amber-500/10 border-amber-500/20",
    iconColor: "text-amber-400",
    metricLabel: "Awaiting Sign-off",
    metricValue: "4 Claims",
  },
  {
    id: "disbursement",
    title: "Loan Disbursement",
    subtitle: "Bank Transfer Queue & Payment Advice",
    description: "Disburse approved salary advances directly via NEFT/ACH bank transfer with transaction confirmation receipts.",
    category: "Loans & Recovery",
    icon: Landmark,
    badgeText: "Bank Disbursal",
    badgeColor: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    iconColor: "text-emerald-400",
    metricLabel: "Ready to Pay",
    metricValue: "₹1,20,000",
  },
  {
    id: "emi-management",
    title: "EMI Management",
    subtitle: "EMI Schedules & Installment Calculator",
    description: "Calculate monthly EMI installments, view upcoming repayment schedules, missed EMI penalties, and interest rates.",
    category: "Loans & Recovery",
    icon: Calculator,
    badgeText: "Calculator",
    badgeColor: "border-purple-500/30 text-purple-400 bg-purple-500/10",
    iconBg: "bg-purple-500/10 border-purple-500/20",
    iconColor: "text-purple-400",
    metricLabel: "Monthly EMI",
    metricValue: "₹65,000 / mo",
  },
  {
    id: "payroll-recovery",
    title: "Payroll Recovery",
    subtitle: "Automated Monthly Salary Deductions",
    description: "Automate monthly salary deductions for active advance EMI repayments directly inside the monthly salary processing run.",
    category: "Loans & Recovery",
    icon: Receipt,
    badgeText: "Salary Auto-Deduct",
    badgeColor: "border-green-500/30 text-green-400 bg-green-500/10",
    iconBg: "bg-green-500/10 border-green-500/20",
    iconColor: "text-green-400",
    metricLabel: "Recovery Rate",
    metricValue: "98.4%",
  },
  {
    id: "loan-policies",
    title: "Loan Policies & Rules",
    subtitle: "Max Limits & Policy Builder Engine",
    description: "Set maximum advance limits (e.g., 50% of gross basic), tenure eligibility rules, interest formulas, and policy builders.",
    category: "Policies & Credit",
    icon: ShieldAlert,
    badgeText: "Policy Engine",
    badgeColor: "border-rose-500/30 text-rose-400 bg-rose-500/10",
    iconBg: "bg-rose-500/10 border-rose-500/20",
    iconColor: "text-rose-400",
    metricLabel: "Max Advance Limit",
    metricValue: "50% Gross Basic",
  },
  {
    id: "eligibility-checker",
    title: "Eligibility Checker",
    subtitle: "Credit & Salary Tenure Score Engine",
    description: "Automatically evaluate employee tenure (min 6 months), gross salary cap, existing debt ratio, and AI credit eligibility score.",
    category: "Policies & Credit",
    icon: CheckCircle2,
    badgeText: "Credit Scoring",
    badgeColor: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    iconColor: "text-emerald-400",
    metricLabel: "Eligible Staff",
    metricValue: "142 Employees",
  },
  {
    id: "interest-management",
    title: "Interest Management",
    subtitle: "Simple & Reducing Balance Interest Engine",
    description: "Configure 0% interest for emergency advances, simple interest rates, reducing balance formulas, and penalty rates.",
    category: "Policies & Credit",
    icon: Percent,
    badgeText: "Rate Config",
    badgeColor: "border-yellow-500/30 text-yellow-400 bg-yellow-500/10",
    iconBg: "bg-yellow-500/10 border-yellow-500/20",
    iconColor: "text-yellow-400",
    metricLabel: "Standard Interest",
    metricValue: "0% - 6% p.a.",
  },
  {
    id: "guarantor-management",
    title: "Guarantor Management",
    subtitle: "Co-signer Verification & Document Signing",
    description: "Manage colleague guarantor sign-offs, guarantor document uploads, digital verification, and liability tracking.",
    category: "Policies & Credit",
    icon: Users,
    badgeText: "Co-signers",
    badgeColor: "border-violet-500/30 text-violet-400 bg-violet-500/10",
    iconBg: "bg-violet-500/10 border-violet-500/20",
    iconColor: "text-violet-400",
    metricLabel: "Verified Co-signers",
    metricValue: "8 Guarantors",
  },
  {
    id: "document-center",
    title: "Document Center",
    subtitle: "Salary Slips, Bank Statements & Agreements",
    description: "Store, review, and e-sign digital loan agreements, salary slips, identity proofs, and bank statement attachments.",
    category: "Policies & Credit",
    icon: FileText,
    badgeText: "Digital Vault",
    badgeColor: "border-blue-500/30 text-blue-400 bg-blue-500/10",
    iconBg: "bg-blue-500/10 border-blue-500/20",
    iconColor: "text-blue-400",
    metricLabel: "Documents Stored",
    metricValue: "48 Documents",
  },
  {
    id: "reports-analytics",
    title: "Reports & Analytics Hub",
    subtitle: "Export PDF, Excel & CSV Financial Reports",
    description: "Generate and export Advance Ledgers, Loan Outstanding Summaries, Monthly Recovery Schedules, and Audit Reports.",
    category: "Analytics & Settings",
    icon: FileSpreadsheet,
    badgeText: "Export PDF/XLS",
    badgeColor: "border-green-500/30 text-green-400 bg-green-500/10",
    iconBg: "bg-green-500/10 border-green-500/20",
    iconColor: "text-green-400",
    metricLabel: "Report Formats",
    metricValue: "6 Formats",
  },
  {
    id: "ai-assistant",
    title: "AI Financial Assistant",
    subtitle: "Default Risk Predictor & Recovery Assistant",
    description: "Consult your AI assistant for default risk predictions, loan eligibility evaluations, EMI repayment forecasts, and fraud scoring.",
    category: "AI & Compliance",
    icon: Brain,
    badgeText: "Aurix AI Core",
    badgeColor: "border-purple-500/30 text-purple-400 bg-purple-500/10",
    iconBg: "bg-purple-600/20 border-purple-500/30",
    iconColor: "text-purple-300",
    metricLabel: "AI Risk Level",
    metricValue: "0% Default Risk",
  },
  {
    id: "audit-logs",
    title: "Audit Logs & Governance",
    subtitle: "Timestamped Disbursal & Recovery History",
    description: "Full audit trail of loan approvals, bank disbursal reference numbers, EMI deduction logs, actor roles, and IP addresses.",
    category: "Analytics & Settings",
    icon: History,
    badgeText: "Governance",
    badgeColor: "border-slate-400/30 text-slate-300 bg-slate-500/10",
    iconBg: "bg-slate-500/10 border-slate-500/20",
    iconColor: "text-slate-300",
    metricLabel: "Logged Events",
    metricValue: "840 Events",
  },
  {
    id: "notifications",
    title: "Notifications & Alerts",
    subtitle: "EMI Reminders & Approval Notice Feed",
    description: "Live activity feed for advance sign-offs, upcoming EMI salary deductions, payment confirmations, and SMS alerts.",
    category: "Analytics & Settings",
    icon: Bell,
    badgeText: "Live Feed",
    badgeColor: "border-pink-500/30 text-pink-400 bg-pink-500/10",
    iconBg: "bg-pink-500/10 border-pink-500/20",
    iconColor: "text-pink-400",
    metricLabel: "Unread Alerts",
    metricValue: "3 Notices",
  },
  {
    id: "settings",
    title: "System Settings",
    subtitle: "Approval Matrix, Interest & Bank Accounts",
    description: "Configure multi-level approval hierarchies, bank accounts, automated EMI recovery schedules, and notification settings.",
    category: "Analytics & Settings",
    icon: Settings,
    badgeText: "System Config",
    badgeColor: "border-slate-500/30 text-slate-300 bg-slate-500/10",
    iconBg: "bg-slate-800 border-white/10",
    iconColor: "text-slate-300",
    metricLabel: "Sync Status",
    metricValue: "Bank Connected",
  },
];

export const AdvanceHubCardGrid: React.FC<AdvanceHubCardGridProps> = ({
  onSelectModule,
  selectedCategory,
  searchQuery,
}) => {
  const filteredCards = ADVANCE_MODULE_CARDS.filter((card) => {
    const matchesCategory =
      selectedCategory === "All" || card.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      card.title.toLowerCase().includes(q) ||
      card.subtitle.toLowerCase().includes(q) ||
      card.description.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Advance & Loan Feature Modules ({filteredCards.length})
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {filteredCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              onClick={() => onSelectModule(card.id)}
              className="group relative flex flex-col justify-between p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-white/10 hover:border-emerald-500/50 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-xl"
            >
              {/* Top Accent Light Beam */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="space-y-3.5">
                {/* Card Header & Icon */}
                <div className="flex items-start justify-between gap-3">
                  <div className={`p-3 rounded-xl border ${card.iconBg} transition-transform group-hover:scale-110 duration-200`}>
                    <Icon className={`w-5 h-5 ${card.iconColor}`} />
                  </div>
                  {card.badgeText && (
                    <Badge variant="outline" className={`text-[10px] font-bold ${card.badgeColor}`}>
                      {card.badgeText}
                    </Badge>
                  )}
                </div>

                {/* Title & Description */}
                <div>
                  <h4 className="font-extrabold text-white text-base tracking-tight group-hover:text-emerald-400 transition-colors">
                    {card.title}
                  </h4>
                  <p className="text-[11px] font-semibold text-slate-400 mt-0.5">{card.subtitle}</p>
                  <p className="text-xs text-slate-400/90 mt-2 line-clamp-2 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>

              {/* Card Footer Metric */}
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 font-medium block">{card.metricLabel}</span>
                  <span className="text-xs font-bold text-slate-200 font-mono">{card.metricValue}</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-400 opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                  Open <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
