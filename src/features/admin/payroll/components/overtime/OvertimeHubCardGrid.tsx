import React from "react";
import {
  LayoutDashboard,
  FilePlus,
  Clock,
  CheckCircle2,
  XCircle,
  Fingerprint,
  Calendar,
  Sun,
  PartyPopper,
  Moon,
  ShieldAlert,
  Landmark,
  Calculator,
  Scale,
  Activity,
  Brain,
  PieChart,
  FileSpreadsheet,
  History,
  Bell,
  Sparkles,
  Settings,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface OvertimeModuleCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: "Core Workflow" | "Shift & Attendance" | "Compensation & Rules" | "AI & Compliance" | "Analytics & Settings";
  icon: React.ElementType;
  badgeText?: string;
  badgeVariant?: "default" | "secondary" | "outline" | "destructive";
  badgeColor?: string;
  iconBg: string;
  iconColor: string;
  metricLabel?: string;
  metricValue?: string;
}

interface OvertimeHubCardGridProps {
  onSelectModule: (moduleId: string) => void;
  selectedCategory: string;
  searchQuery: string;
}

export const OVERTIME_MODULE_CARDS: OvertimeModuleCard[] = [
  {
    id: "dashboard",
    title: "Overtime Dashboard",
    subtitle: "Real-time Company Overtime Intelligence",
    description: "Company OT KPIs, department summaries, today's active overtime hours, weekly trends, payroll impact, and compliance scores.",
    category: "Core Workflow",
    icon: LayoutDashboard,
    badgeText: "Real-time",
    badgeColor: "border-blue-500/30 text-blue-400 bg-blue-500/10",
    iconBg: "bg-blue-500/10 border-blue-500/20",
    iconColor: "text-blue-400",
    metricLabel: "Total OT Hours",
    metricValue: "428.5 Hrs",
  },
  {
    id: "requests",
    title: "Overtime Requests",
    subtitle: "Employee OT Application & Submission Wizard",
    description: "Draft, submit, and track overtime applications with shift attachments, business justifications, and approval workflow logs.",
    category: "Core Workflow",
    icon: FilePlus,
    badgeText: "Submission",
    badgeColor: "border-indigo-500/30 text-indigo-400 bg-indigo-500/10",
    iconBg: "bg-indigo-500/10 border-indigo-500/20",
    iconColor: "text-indigo-400",
    metricLabel: "Active Applications",
    metricValue: "24 Requests",
  },
  {
    id: "pending-approvals",
    title: "Pending Approvals",
    subtitle: "Multi-tier Queue (Manager, HR, Payroll)",
    description: "Line Manager, HR, and Payroll approval queue with bulk actions, approval timelines, comments, and escalation triggers.",
    category: "Core Workflow",
    icon: Clock,
    badgeText: "Action Required",
    badgeColor: "border-amber-500/30 text-amber-400 bg-amber-500/10",
    iconBg: "bg-amber-500/10 border-amber-500/20",
    iconColor: "text-amber-400",
    metricLabel: "Awaiting Sign-off",
    metricValue: "8 Claims",
  },
  {
    id: "approved-ot",
    title: "Approved Overtime",
    subtitle: "Audit Verified Records & Salary Run Queue",
    description: "Verified overtime records ready for direct bank disbursal or upcoming monthly salary cycle inclusion.",
    category: "Core Workflow",
    icon: CheckCircle2,
    badgeText: "Verified",
    badgeColor: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    iconColor: "text-emerald-400",
    metricLabel: "Approved Value",
    metricValue: "₹1,92,450",
  },
  {
    id: "rejected-requests",
    title: "Rejected Requests",
    subtitle: "Declined History & Appeal Filing Center",
    description: "Review rejected overtime requests, policy violation grounds, line manager feedback, and file formal appeals.",
    category: "Core Workflow",
    icon: XCircle,
    badgeText: "Audit Log",
    badgeColor: "border-rose-500/30 text-rose-400 bg-rose-500/10",
    iconBg: "bg-rose-500/10 border-rose-500/20",
    iconColor: "text-rose-400",
    metricLabel: "Rejected Count",
    metricValue: "3 Requests",
  },
  {
    id: "attendance-verification",
    title: "Attendance Verification",
    subtitle: "Biometric & GPS Punch Validation",
    description: "Cross-verify biometric IN/OUT punches, GPS geofencing logs, missing punch corrections, and shift attendance matches.",
    category: "Shift & Attendance",
    icon: Fingerprint,
    badgeText: "Biometric Sync",
    badgeColor: "border-cyan-500/30 text-cyan-400 bg-cyan-500/10",
    iconBg: "bg-cyan-500/10 border-cyan-500/20",
    iconColor: "text-cyan-400",
    metricLabel: "Punch Match Rate",
    metricValue: "99.2%",
  },
  {
    id: "shift-management",
    title: "Shift Management",
    subtitle: "Rotational Shift Rosters & Calendars",
    description: "Manage Morning, Evening, Night, Weekend, and Rotational shifts with shift calendar view and roster allocations.",
    category: "Shift & Attendance",
    icon: Calendar,
    badgeText: "Roster Engine",
    badgeColor: "border-purple-500/30 text-purple-400 bg-purple-500/10",
    iconBg: "bg-purple-500/10 border-purple-500/20",
    iconColor: "text-purple-400",
    metricLabel: "Active Shifts",
    metricValue: "5 Shifts",
  },
  {
    id: "weekend-ot",
    title: "Weekend Overtime",
    subtitle: "Saturday & Sunday Double Pay Rules (2.0x)",
    description: "Audit Saturday and Sunday overtime entries with automated 2.0x double pay multipliers and weekend approval controls.",
    category: "Compensation & Rules",
    icon: Sun,
    badgeText: "2.0x Rate",
    badgeColor: "border-orange-500/30 text-orange-400 bg-orange-500/10",
    iconBg: "bg-orange-500/10 border-orange-500/20",
    iconColor: "text-orange-400",
    metricLabel: "Weekend OT Hours",
    metricValue: "84.0 Hrs",
  },
  {
    id: "holiday-ot",
    title: "Holiday Overtime",
    subtitle: "National Holiday Triple Pay Rules (3.0x)",
    description: "National & Gazetted holiday overtime tracking with statutory 3.0x triple pay compensation calculations and holiday approvals.",
    category: "Compensation & Rules",
    icon: PartyPopper,
    badgeText: "3.0x Rate",
    badgeColor: "border-yellow-500/30 text-yellow-400 bg-yellow-500/10",
    iconBg: "bg-yellow-500/10 border-yellow-500/20",
    iconColor: "text-yellow-400",
    metricLabel: "Holiday OT Hours",
    metricValue: "36.0 Hrs",
  },
  {
    id: "night-shift",
    title: "Night Shift Management",
    subtitle: "Night Differential Allowance & Shift Audits",
    description: "Track night shift attendance, calculate night differential allowances, safety transport compliance, and night payroll sync.",
    category: "Shift & Attendance",
    icon: Moon,
    badgeText: "Night Allowance",
    badgeColor: "border-violet-500/30 text-violet-400 bg-violet-500/10",
    iconBg: "bg-violet-500/10 border-violet-500/20",
    iconColor: "text-violet-400",
    metricLabel: "Night Staff Count",
    metricValue: "42 Staff",
  },
  {
    id: "ot-policies",
    title: "Overtime Policies",
    subtitle: "Factories Act 1948 & Custom Policy Builder",
    description: "Configure company overtime rules, Factories Act 1948 maximum OT limits (50 hrs/quarter), shift caps, and policy builders.",
    category: "AI & Compliance",
    icon: ShieldAlert,
    badgeText: "Factories Act",
    badgeColor: "border-red-500/30 text-red-400 bg-red-500/10",
    iconBg: "bg-red-500/10 border-red-500/20",
    iconColor: "text-red-400",
    metricLabel: "Active Policies",
    metricValue: "4 Rulesets",
  },
  {
    id: "payroll-integration",
    title: "Payroll Integration",
    subtitle: "Salary Run Sync & Bank Transfer Advice",
    description: "Synchronize approved overtime earnings directly into active salary processing cycles or export NEFT bank disbursal files.",
    category: "Compensation & Rules",
    icon: Landmark,
    badgeText: "Salary Sync",
    badgeColor: "border-teal-500/30 text-teal-400 bg-teal-500/10",
    iconBg: "bg-teal-500/10 border-teal-500/20",
    iconColor: "text-teal-400",
    metricLabel: "Queued for Payout",
    metricValue: "₹2,10,000",
  },
  {
    id: "compensation-rules",
    title: "Compensation Rules",
    subtitle: "Rate Multipliers (1.5x, 2.0x, 3.0x) & Formulas",
    description: "Configure custom formula logic, department-specific multipliers, hourly rate calculations, and formula preview engine.",
    category: "Compensation & Rules",
    icon: Calculator,
    badgeText: "Formula Engine",
    badgeColor: "border-sky-500/30 text-sky-400 bg-sky-500/10",
    iconBg: "bg-sky-500/10 border-sky-500/20",
    iconColor: "text-sky-400",
    metricLabel: "Default Multiplier",
    metricValue: "1.5x Base",
  },
  {
    id: "compliance-center",
    title: "Compliance Center",
    subtitle: "Factories Act & State Labour Law Limits",
    description: "Enforce statutory daily limits (max 12 hrs/day), weekly caps (max 60 hrs/week), mandatory rest periods, and compliance alerts.",
    category: "AI & Compliance",
    icon: Scale,
    badgeText: "Statutory Law",
    badgeColor: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    iconColor: "text-emerald-400",
    metricLabel: "Compliance Score",
    metricValue: "98.8%",
  },
  {
    id: "burnout-fatigue",
    title: "Burnout & Fatigue Monitoring",
    subtitle: "AI Employee Fatigue Scores & Workload Risk",
    description: "Predict employee burnout using AI fatigue scoring, continuous working days tracking, health alerts, and workload redistribution.",
    category: "AI & Compliance",
    icon: Activity,
    badgeText: "AI Fatigue Score",
    badgeColor: "border-amber-500/30 text-amber-400 bg-amber-500/10",
    iconBg: "bg-amber-500/10 border-amber-500/20",
    iconColor: "text-amber-400",
    metricLabel: "High Fatigue Risk",
    metricValue: "2 Employees",
  },
  {
    id: "ai-intelligence",
    title: "AI Overtime Intelligence",
    subtitle: "Abnormal OT Detection & Fraud Scanner",
    description: "Identify ghost overtime punches, abnormal overtime patterns, fake biometric entries, and AI recommendation engines.",
    category: "AI & Compliance",
    icon: Brain,
    badgeText: "Aurix AI Core",
    badgeColor: "border-purple-500/30 text-purple-400 bg-purple-500/10",
    iconBg: "bg-purple-500/10 border-purple-500/20",
    iconColor: "text-purple-400",
    metricLabel: "Anomalies Caught",
    metricValue: "0 Threats",
  },
  {
    id: "dept-analytics",
    title: "Department Analytics",
    subtitle: "Department OT Cost & Hours Comparison",
    description: "Analyze overtime cost distribution across Engineering, Sales, Operations, and HR with budget usage progress metrics.",
    category: "Analytics & Settings",
    icon: PieChart,
    badgeText: "Cost Analytics",
    badgeColor: "border-blue-500/30 text-blue-400 bg-blue-500/10",
    iconBg: "bg-blue-500/10 border-blue-500/20",
    iconColor: "text-blue-400",
    metricLabel: "Top OT Dept",
    metricValue: "Engineering",
  },
  {
    id: "reports-analytics",
    title: "Reports & Analytics Hub",
    subtitle: "Export PDF, Excel & CSV Overtime Reports",
    description: "Generate and export Daily, Weekly, Monthly, Department, Employee, and Factories Act Statutory Overtime Audit Reports.",
    category: "Analytics & Settings",
    icon: FileSpreadsheet,
    badgeText: "Export PDF/XLS",
    badgeColor: "border-green-500/30 text-green-400 bg-green-500/10",
    iconBg: "bg-green-500/10 border-green-500/20",
    iconColor: "text-green-400",
    metricLabel: "Report Types",
    metricValue: "8 Formats",
  },
  {
    id: "audit-logs",
    title: "Audit Logs & Governance",
    subtitle: "Timestamped User Activity & Modification Log",
    description: "Full audit trail of overtime approvals, punch overrides, policy updates, actor roles, IP addresses, and export logs.",
    category: "Analytics & Settings",
    icon: History,
    badgeText: "Governance",
    badgeColor: "border-slate-400/30 text-slate-300 bg-slate-500/10",
    iconBg: "bg-slate-500/10 border-slate-500/20",
    iconColor: "text-slate-300",
    metricLabel: "Logged Events",
    metricValue: "1,240 Events",
  },
  {
    id: "notifications",
    title: "Notifications & Alerts",
    subtitle: "Real-time Activity & Compliance Notice Feed",
    description: "Live notification center for pending OT sign-offs, rejection warnings, compliance limit breaches, and SMS/Email alerts.",
    category: "Analytics & Settings",
    icon: Bell,
    badgeText: "Live Feed",
    badgeColor: "border-pink-500/30 text-pink-400 bg-pink-500/10",
    iconBg: "bg-pink-500/10 border-pink-500/20",
    iconColor: "text-pink-400",
    metricLabel: "Unread Alerts",
    metricValue: "5 Notices",
  },
  {
    id: "ai-copilot",
    title: "AI Overtime Copilot",
    subtitle: "Labour Law & Rate Calculation Assistant",
    description: "Interactive AI Assistant for Factories Act rules, 1.5x/2.0x rate calculations, fatigue checks, and policy guidance.",
    category: "AI & Compliance",
    icon: Sparkles,
    badgeText: "Aurix AI Assistant",
    badgeColor: "border-purple-500/30 text-purple-400 bg-purple-500/10",
    iconBg: "bg-purple-600/20 border-purple-500/30",
    iconColor: "text-purple-300",
    metricLabel: "AI Model",
    metricValue: "Aurix LLM v2026",
  },
  {
    id: "settings",
    title: "Overtime System Settings",
    subtitle: "Approval Workflows, Shift Rules & Biometric Integration",
    description: "Configure multi-level approval hierarchies, biometric device API sync, overtime rate formulas, and automated alert triggers.",
    category: "Analytics & Settings",
    icon: Settings,
    badgeText: "System Config",
    badgeColor: "border-slate-500/30 text-slate-300 bg-slate-500/10",
    iconBg: "bg-slate-800 border-white/10",
    iconColor: "text-slate-300",
    metricLabel: "Sync Status",
    metricValue: "Biometric Connected",
  },
];

export const OvertimeHubCardGrid: React.FC<OvertimeHubCardGridProps> = ({
  onSelectModule,
  selectedCategory,
  searchQuery,
}) => {
  const filteredCards = OVERTIME_MODULE_CARDS.filter((card) => {
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
          Overtime Feature Modules ({filteredCards.length})
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              onClick={() => onSelectModule(card.id)}
              className="group relative flex flex-col justify-between p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-white/10 hover:border-blue-500/50 shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-xl"
            >
              {/* Top Accent Light Beam */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

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
                  <h4 className="font-extrabold text-white text-base tracking-tight group-hover:text-blue-400 transition-colors">
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
                <div className="flex items-center gap-1 text-xs font-bold text-blue-400 opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
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
