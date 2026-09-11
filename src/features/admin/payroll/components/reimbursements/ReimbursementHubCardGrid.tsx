import React from "react";
import {
  BarChart3,
  PlusCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Grid,
  ShieldCheck,
  Scan,
  Plane,
  Stethoscope,
  HandCoins,
  AlertTriangle,
  PieChart,
  Receipt,
  CreditCard,
  FileSpreadsheet,
  History,
  Bell,
  Sparkles,
  Settings,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface ReimbursementModuleCardDef {
  id: string;
  title: string;
  description: string;
  category: "Core Workflow" | "Categories & Policy" | "AI & Compliance" | "Analytics & Settings";
  icon: React.ElementType;
  color: string;
  badge?: string;
}

export const REIMBURSEMENT_HUB_MODULES: ReimbursementModuleCardDef[] = [
  {
    id: "overview",
    title: "Expense Dashboard",
    description: "Overview of company reimbursement spend, department KPIs, pending claims, and monthly spend.",
    category: "Core Workflow",
    icon: BarChart3,
    color: "from-blue-500/20 to-sky-500/20 text-blue-400 border-blue-500/30",
  },
  {
    id: "create-claim",
    title: "Create Expense Claim",
    description: "4-step wizard to upload receipts, auto-extract OCR values, validate policies, and submit claims.",
    category: "Core Workflow",
    icon: PlusCircle,
    color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
    badge: "Wizard",
  },
  {
    id: "pending-approvals",
    title: "Pending Approvals Queue",
    description: "Multi-tier approval queue for Managers, Finance Managers, and Payroll Admins with bulk actions.",
    category: "Core Workflow",
    icon: Clock,
    color: "from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30",
    badge: "3 Queue",
  },
  {
    id: "approved-claims",
    title: "Approved Claims & Settlement",
    description: "Audit verified approved claims ready for salary cycle inclusion or direct bank disbursal.",
    category: "Core Workflow",
    icon: CheckCircle2,
    color: "from-teal-500/20 to-cyan-500/20 text-teal-400 border-teal-500/30",
  },
  {
    id: "rejected-claims",
    title: "Rejected Claims & Appeals",
    description: "Review declined claims, policy violation reasons, employee appeals, and resubmissions.",
    category: "Core Workflow",
    icon: XCircle,
    color: "from-rose-500/20 to-pink-500/20 text-rose-400 border-rose-500/30",
  },
  {
    id: "expense-categories",
    title: "Expense Categories & Caps",
    description: "Configure categories (Travel, Food, Fuel, Internet, WFH) and set monthly spending caps.",
    category: "Categories & Policy",
    icon: Grid,
    color: "from-indigo-500/20 to-purple-500/20 text-indigo-400 border-indigo-500/30",
  },
  {
    id: "expense-policies",
    title: "Expense Policy Engine",
    description: "Define daily limits, metro hotel caps, flight class rules, mileage rates, and auto-validation matrix.",
    category: "Categories & Policy",
    icon: ShieldCheck,
    color: "from-purple-500/20 to-violet-500/20 text-purple-400 border-purple-500/30",
  },
  {
    id: "receipt-management",
    title: "Receipt Management & OCR",
    description: "AI OCR document parser for PDFs, PNGs, JPEGs, duplicate receipt detection, and digital gallery.",
    category: "AI & Compliance",
    icon: Scan,
    color: "from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30",
    badge: "OCR v2.4",
  },
  {
    id: "travel-mileage",
    title: "Travel & Mileage Calculator",
    description: "Audit taxi, flight, hotel receipts, per diem daily allowances, and GPS mileage calculations.",
    category: "Categories & Policy",
    icon: Plane,
    color: "from-sky-500/20 to-indigo-500/20 text-sky-400 border-sky-500/30",
  },
  {
    id: "medical-claims",
    title: "Medical Reimbursements",
    description: "Track insurance claims, hospital bills, medical consultations, and tax-exempt health benefits.",
    category: "Categories & Policy",
    icon: Stethoscope,
    color: "from-emerald-500/20 to-green-500/20 text-emerald-400 border-emerald-500/30",
  },
  {
    id: "advance-settlement",
    title: "Advance & Settlement",
    description: "Manage employee travel advances, pending balance recovery, and final expense settlements.",
    category: "Core Workflow",
    icon: HandCoins,
    color: "from-yellow-500/20 to-amber-500/20 text-yellow-400 border-yellow-500/30",
  },
  {
    id: "fraud-detection",
    title: "Fraud Detection Center",
    description: "OFC360 duplicate bill detection, high-risk dinner expense alerts, and policy violation timeline.",
    category: "AI & Compliance",
    icon: AlertTriangle,
    color: "from-red-500/20 to-rose-500/20 text-red-400 border-red-500/30",
    badge: "AI Risk",
  },
  {
    id: "budget-monitoring",
    title: "Budget Monitoring & Forecast",
    description: "Monitor Q3 department budgets, cost center utilization, threshold alerts, and spend forecasts.",
    category: "Analytics & Settings",
    icon: PieChart,
    color: "from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30",
  },
  {
    id: "tax-gst",
    title: "Tax & GST Credit Center",
    description: "Validate supplier GSTIN numbers, track 18% input tax credits, and Section 10(14) per diem tax exemptions.",
    category: "AI & Compliance",
    icon: Receipt,
    color: "from-cyan-500/20 to-teal-500/20 text-cyan-400 border-cyan-500/30",
  },
  {
    id: "payroll-integration",
    title: "Payroll Integration & Disbursal",
    description: "Synchronize approved reimbursements with active salary cycles or trigger NEFT bank transfers.",
    category: "Core Workflow",
    icon: CreditCard,
    color: "from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30",
  },
  {
    id: "reports-analytics",
    title: "Reports & Analytics Hub",
    description: "Generate and export PDF, Excel, and CSV reports for Departments, Employees, GST Audits, and FY Summaries.",
    category: "Analytics & Settings",
    icon: FileSpreadsheet,
    color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
  },
  {
    id: "audit-logs",
    title: "Audit Trail & Governance Log",
    description: "Full audit trail of user activities, approvals, policy changes, receipt updates, and IP addresses.",
    category: "Analytics & Settings",
    icon: History,
    color: "from-slate-500/20 to-slate-700/20 text-slate-300 border-slate-500/30",
  },
  {
    id: "notifications",
    title: "Notifications & Alerts Center",
    description: "Activity feed for pending approval requests, rejection notices, payment completions, and policy updates.",
    category: "Analytics & Settings",
    icon: Bell,
    color: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30",
  },
  {
    id: "ai-copilot",
    title: "AI Expense Copilot Assistant",
    description: "Interactive AI assistant for policy lookups, tax calculations, meal caps, and instant expense guidance.",
    category: "AI & Compliance",
    icon: Sparkles,
    color: "from-purple-500/20 to-indigo-500/20 text-purple-300 border-purple-500/30",
    badge: "Copilot",
  },
  {
    id: "settings",
    title: "Reimbursement Settings",
    description: "Configure categories, approval matrix, workflow rules, currencies, tax rates, and OCR settings.",
    category: "Analytics & Settings",
    icon: Settings,
    color: "from-slate-600/20 to-slate-800/20 text-slate-300 border-slate-600/30",
  },
];

interface ReimbursementHubCardGridProps {
  onSelectModule: (id: string) => void;
  searchQuery: string;
  selectedCategory: string;
}

export const ReimbursementHubCardGrid: React.FC<ReimbursementHubCardGridProps> = ({
  onSelectModule,
  searchQuery,
  selectedCategory,
}) => {
  const filteredModules = REIMBURSEMENT_HUB_MODULES.filter((mod) => {
    const matchesSearch =
      mod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || mod.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {filteredModules.map((mod) => {
        const Icon = mod.icon;
        return (
          <div
            key={mod.id}
            onClick={() => onSelectModule(mod.id)}
            className="group relative p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900/90 border border-white/5 hover:border-blue-500/30 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl bg-gradient-to-br border ${mod.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                {mod.badge && (
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-[10px] font-bold">
                    {mod.badge}
                  </Badge>
                )}
              </div>

              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors flex items-center gap-1">
                  {mod.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {mod.description}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400 group-hover:text-blue-400 transition-colors">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{mod.category}</span>
              <span className="flex items-center gap-1 font-bold">
                Launch Module <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
