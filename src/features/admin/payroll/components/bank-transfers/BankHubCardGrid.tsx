import React from "react";
import {
  LayoutDashboard,
  Layers,
  Send,
  CreditCard,
  ShieldCheck,
  Building2,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Activity,
  ShieldAlert,
  BarChart3,
  Brain,
  Bell,
  Settings,
  ArrowRight,
  Landmark,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface BankModuleCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: "Core Banking" | "Disbursal & Verification" | "Gateways & Files" | "AI & Compliance" | "Analytics & Settings";
  icon: React.ElementType;
  badgeText?: string;
  badgeVariant?: "default" | "secondary" | "outline" | "destructive";
  badgeColor?: string;
  iconBg: string;
  iconColor: string;
  metricLabel?: string;
  metricValue?: string;
}

interface BankHubCardGridProps {
  onSelectModule: (moduleId: string) => void;
  selectedCategory: string;
  searchQuery: string;
}

export const BANK_MODULE_CARDS: BankModuleCard[] = [
  {
    id: "dashboard",
    title: "Transfer Dashboard",
    subtitle: "Real-time Banking & Disbursal Overview",
    description: "Real-time transfer status, monthly disbursement volume, successful vs failed transactions, reconciliation rate, and AI banking insights.",
    category: "Core Banking",
    icon: LayoutDashboard,
    badgeText: "Real-time",
    badgeColor: "border-blue-500/30 text-blue-400 bg-blue-500/10",
    iconBg: "bg-blue-500/10 border-blue-500/20",
    iconColor: "text-blue-400",
    metricLabel: "Total Disbursed",
    metricValue: "₹61,70,000",
  },
  {
    id: "batch-management",
    title: "Payment Batch Management",
    subtitle: "Create, Approve & Track Payment Batches",
    description: "Generate salary payment batches, detect duplicate payments, approve or reject batch files, and view historical disbursal runs.",
    category: "Core Banking",
    icon: Layers,
    badgeText: "Batch Processing",
    badgeColor: "border-purple-500/30 text-purple-400 bg-purple-500/10",
    iconBg: "bg-purple-500/10 border-purple-500/20",
    iconColor: "text-purple-400",
    metricLabel: "Active Batches",
    metricValue: "4 Batches",
  },
  {
    id: "disbursement",
    title: "Salary Disbursement",
    subtitle: "Bulk Salary Transfers & Scheduled Disbursal",
    description: "Execute bulk salary transfers, schedule automated payouts on 1st of month, manage manual transfers, and view transaction timelines.",
    category: "Core Banking",
    icon: Send,
    badgeText: "Direct Disbursal",
    badgeColor: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    iconColor: "text-emerald-400",
    metricLabel: "Pending Disbursal",
    metricValue: "₹7,00,000",
  },
  {
    id: "bank-accounts",
    title: "Employee Bank Accounts",
    subtitle: "Account Verification, IFSC & UPI Details",
    description: "Manage primary & secondary bank accounts, IFSC code validation, UPI ID details, name-match scores, and account history.",
    category: "Disbursal & Verification",
    icon: CreditCard,
    badgeText: "Account Directory",
    badgeColor: "border-cyan-500/30 text-cyan-400 bg-cyan-500/10",
    iconBg: "bg-cyan-500/10 border-cyan-500/20",
    iconColor: "text-cyan-400",
    metricLabel: "Verified Accounts",
    metricValue: "138 Accounts",
  },
  {
    id: "verification-center",
    title: "Bank Verification Center",
    subtitle: "Penny Drop Verification & Blocked Accounts",
    description: "Perform Instant Penny Drop (₹1) verification, validate bank IFSC codes, detect duplicate accounts, and flag blocked bank nodes.",
    category: "Disbursal & Verification",
    icon: ShieldCheck,
    badgeText: "Penny Drop API",
    badgeColor: "border-teal-500/30 text-teal-400 bg-teal-500/10",
    iconBg: "bg-teal-500/10 border-teal-500/20",
    iconColor: "text-teal-400",
    metricLabel: "Penny Drop Rate",
    metricValue: "100% Validated",
  },
  {
    id: "gateway-integration",
    title: "Payment Gateway Integration",
    subtitle: "HDFC, ICICI, Axis, SBI, Razorpay & Cashfree",
    description: "Connect corporate bank gateways (HDFC Host-to-Host, ICICI Corporate API, Axis Bank, SBI) and RazorpayX/Cashfree payout APIs.",
    category: "Gateways & Files",
    icon: Building2,
    badgeText: "Host-to-Host",
    badgeColor: "border-indigo-500/30 text-indigo-400 bg-indigo-500/10",
    iconBg: "bg-indigo-500/10 border-indigo-500/20",
    iconColor: "text-indigo-400",
    metricLabel: "Active Gateways",
    metricValue: "5 Gateways Live",
  },
  {
    id: "file-generator",
    title: "Bank File Generator",
    subtitle: "NEFT, RTGS, IMPS, ACH & NACH Formats",
    description: "Generate bank-specific text/CSV/XML payment advice files (HDFC Enriched NEFT, ICICI Cyberplat, SBI Corporate, ACH Mandates).",
    category: "Gateways & Files",
    icon: FileSpreadsheet,
    badgeText: "NEFT / ACH Generator",
    badgeColor: "border-green-500/30 text-green-400 bg-green-500/10",
    iconBg: "bg-green-500/10 border-green-500/20",
    iconColor: "text-green-400",
    metricLabel: "Generated Files",
    metricValue: "12 Advice Files",
  },
  {
    id: "approval-workflow",
    title: "Approval Workflow",
    subtitle: "Finance, HR, CFO & CEO Sign-offs",
    description: "Multi-level approval matrix with threshold limits (CEO approval required for > ₹50L), bulk approval, and sign-off audit trails.",
    category: "Core Banking",
    icon: CheckCircle2,
    badgeText: "CFO & CEO Sign-off",
    badgeColor: "border-amber-500/30 text-amber-400 bg-amber-500/10",
    iconBg: "bg-amber-500/10 border-amber-500/20",
    iconColor: "text-amber-400",
    metricLabel: "Pending Sign-offs",
    metricValue: "2 Batches",
  },
  {
    id: "failed-payments",
    title: "Failed Payment Center",
    subtitle: "Auto-Retry Queue & IFSC Error Correction",
    description: "Manage failed bank transfers, analyze failure error codes (Invalid IFSC, Account Closed, Name Mismatch), and trigger auto-retries.",
    category: "Disbursal & Verification",
    icon: AlertTriangle,
    badgeText: "Auto-Retry Queue",
    badgeColor: "border-rose-500/30 text-rose-400 bg-rose-500/10",
    iconBg: "bg-rose-500/10 border-rose-500/20",
    iconColor: "text-rose-400",
    metricLabel: "Failed Transfers",
    metricValue: "2 Errors",
  },
  {
    id: "reconciliation",
    title: "Reconciliation Center",
    subtitle: "Bank Statement Matching & Settlement Variance",
    description: "Automated 2-way bank statement reconciliation, UTR reference matching, settlement variance detection, and monthly closing reports.",
    category: "Gateways & Files",
    icon: Scale,
    badgeText: "2-Way Matching",
    badgeColor: "border-blue-500/30 text-blue-400 bg-blue-500/10",
    iconBg: "bg-blue-500/10 border-blue-500/20",
    iconColor: "text-blue-400",
    metricLabel: "Reconciliation",
    metricValue: "100% Matched",
  },
  {
    id: "payment-tracking",
    title: "Payment Tracking",
    subtitle: "Real-time Status & Transaction Timeline",
    description: "Track live status (Queued, Processing, Settled, Failed) with UTR reference numbers and step-by-step transaction timelines.",
    category: "Core Banking",
    icon: Activity,
    badgeText: "Live UTR Track",
    badgeColor: "border-cyan-500/30 text-cyan-400 bg-cyan-500/10",
    iconBg: "bg-cyan-500/10 border-cyan-500/20",
    iconColor: "text-cyan-400",
    metricLabel: "Processing Payouts",
    metricValue: "12 Transfers",
  },
  {
    id: "audit-compliance",
    title: "Audit & NPCI Compliance",
    subtitle: "NPCI Guidelines, RBI Compliance & Audit Trails",
    description: "Ensure 100% NPCI & RBI guidelines compliance for electronic funds transfers, immutable audit logs, and digital signature logs.",
    category: "AI & Compliance",
    icon: ShieldAlert,
    badgeText: "NPCI & RBI Audit",
    badgeColor: "border-slate-400/30 text-slate-300 bg-slate-500/10",
    iconBg: "bg-slate-500/10 border-slate-500/20",
    iconColor: "text-slate-300",
    metricLabel: "Compliance Status",
    metricValue: "100% Compliant",
  },
  {
    id: "reports-analytics",
    title: "Reports & Analytics Hub",
    subtitle: "Export PDF, Excel & CSV Banking Reports",
    description: "Generate and export Bank Transfer Ledgers, Monthly Salary Disbursal Registers, Failed Transfer Reports, and Bank Reconciliation Reports.",
    category: "Analytics & Settings",
    icon: BarChart3,
    badgeText: "Export PDF/XLS",
    badgeColor: "border-green-500/30 text-green-400 bg-green-500/10",
    iconBg: "bg-green-500/10 border-green-500/20",
    iconColor: "text-green-400",
    metricLabel: "Report Formats",
    metricValue: "6 Formats",
  },
  {
    id: "ai-intelligence",
    title: "AI Banking Intelligence",
    subtitle: "Fraud Detection & Duplicate Payment Scanner",
    description: "Consult your AI assistant for duplicate payout detection, anomalous salary transfers, cash flow forecasts, and settlement predictions.",
    category: "AI & Compliance",
    icon: Brain,
    badgeText: "Aurix AI Core",
    badgeColor: "border-purple-500/30 text-purple-400 bg-purple-500/10",
    iconBg: "bg-purple-600/20 border-purple-500/30",
    iconColor: "text-purple-300",
    metricLabel: "Fraud Risk",
    metricValue: "0% Risk Score",
  },
  {
    id: "notifications",
    title: "Notifications & Alerts",
    subtitle: "Bank Webhook Feed & Payment Notices",
    description: "Live activity feed for payment completions, bank gateway webhook events, failed payment alerts, and SMS notifications.",
    category: "Analytics & Settings",
    icon: Bell,
    badgeText: "Live Feed",
    badgeColor: "border-pink-500/30 text-pink-400 bg-pink-500/10",
    iconBg: "bg-pink-500/10 border-pink-500/20",
    iconColor: "text-pink-400",
    metricLabel: "Unread Alerts",
    metricValue: "2 Notices",
  },
  {
    id: "settings",
    title: "Bank Settings",
    subtitle: "Corporate Accounts, API Keys & Limits",
    description: "Configure corporate bank accounts, payment gateway API keys, webhook URLs, daily transaction limits, and holiday calendars.",
    category: "Analytics & Settings",
    icon: Settings,
    badgeText: "System Config",
    badgeColor: "border-slate-500/30 text-slate-300 bg-slate-500/10",
    iconBg: "bg-slate-800 border-white/10",
    iconColor: "text-slate-300",
    metricLabel: "Connected Banks",
    metricValue: "HDFC, ICICI, SBI",
  },
];

export const BankHubCardGrid: React.FC<BankHubCardGridProps> = ({
  onSelectModule,
  selectedCategory,
  searchQuery,
}) => {
  const filteredCards = BANK_MODULE_CARDS.filter((card) => {
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
          Bank Transfer Feature Modules ({filteredCards.length})
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
