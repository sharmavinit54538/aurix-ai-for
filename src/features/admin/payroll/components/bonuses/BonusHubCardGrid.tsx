import React from "react";
import {
  LayoutDashboard,
  Award,
  PartyPopper,
  Sparkles,
  FilePlus,
  Clock,
  Calculator,
  Receipt,
  Scale,
  PieChart,
  Trophy,
  Brain,
  FileSpreadsheet,
  History,
  Bell,
  UserCheck,
  Crown,
  Settings,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface BonusModuleCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: "Core Workflow" | "Performance & Rewards" | "Calculations & Budget" | "AI & Governance" | "Analytics & Settings";
  icon: React.ElementType;
  badgeText?: string;
  badgeVariant?: "default" | "secondary" | "outline" | "destructive";
  badgeColor?: string;
  iconBg: string;
  iconColor: string;
  metricLabel?: string;
  metricValue?: string;
}

interface BonusHubCardGridProps {
  onSelectModule: (moduleId: string) => void;
  selectedCategory: string;
  searchQuery: string;
}

export const BONUS_MODULE_CARDS: BonusModuleCard[] = [
  {
    id: "dashboard",
    title: "Bonus Dashboard",
    subtitle: "Company Bonus & Incentive Overview",
    description: "Company bonus summary, monthly/yearly bonus payouts, pending & approved bonuses, budget tracking, and AI insights.",
    category: "Core Workflow",
    icon: LayoutDashboard,
    badgeText: "Real-time",
    badgeColor: "border-purple-500/30 text-purple-400 bg-purple-500/10",
    iconBg: "bg-purple-500/10 border-purple-500/20",
    iconColor: "text-purple-400",
    metricLabel: "Total Bonus Pool",
    metricValue: "₹12,40,000",
  },
  {
    id: "performance-bonus",
    title: "Performance Bonus",
    subtitle: "KPI & Goal Achievement Based Payouts",
    description: "Calculate performance bonuses based on individual KPI ratings, department rankings, quarterly goal achievements, and spot recommendations.",
    category: "Performance & Rewards",
    icon: Award,
    badgeText: "KPI Driven",
    badgeColor: "border-blue-500/30 text-blue-400 bg-blue-500/10",
    iconBg: "bg-blue-500/10 border-blue-500/20",
    iconColor: "text-blue-400",
    metricLabel: "KPI Target Rate",
    metricValue: "94.2% Achieved",
  },
  {
    id: "festival-bonus",
    title: "Festival Bonus",
    subtitle: "Diwali, Christmas & New Year Disbursals",
    description: "Manage annual festival bonus disbursals, statutory festive allocations, custom festival rules, and employee payout schedules.",
    category: "Performance & Rewards",
    icon: PartyPopper,
    badgeText: "Festive Season",
    badgeColor: "border-pink-500/30 text-pink-400 bg-pink-500/10",
    iconBg: "bg-pink-500/10 border-pink-500/20",
    iconColor: "text-pink-400",
    metricLabel: "Next Festive Pool",
    metricValue: "Diwali 2026",
  },
  {
    id: "incentive-management",
    title: "Incentive Management",
    subtitle: "Sales, Referral, Retention & Spot Awards",
    description: "Track sales target commissions, employee referral rewards, attendance incentives, retention bonuses, and spot cash awards.",
    category: "Performance & Rewards",
    icon: Sparkles,
    badgeText: "Spot & Sales",
    badgeColor: "border-yellow-500/30 text-yellow-400 bg-yellow-500/10",
    iconBg: "bg-yellow-500/10 border-yellow-500/20",
    iconColor: "text-yellow-400",
    metricLabel: "Active Spot Awards",
    metricValue: "14 Awarded",
  },
  {
    id: "requests",
    title: "Bonus Requests",
    subtitle: "Bonus Allocation & Request Submission",
    description: "Create, draft, and submit bonus requests with performance justification documents, department tags, and manager sign-offs.",
    category: "Core Workflow",
    icon: FilePlus,
    badgeText: "Submission",
    badgeColor: "border-indigo-500/30 text-indigo-400 bg-indigo-500/10",
    iconBg: "bg-indigo-500/10 border-indigo-500/20",
    iconColor: "text-indigo-400",
    metricLabel: "Active Requests",
    metricValue: "22 Claims",
  },
  {
    id: "approval-workflow",
    title: "Bonus Approval Workflow",
    subtitle: "Manager, HR, Finance & Payroll Sign-offs",
    description: "Multi-tier approval matrix with bulk approvals, rejection comments, approval timelines, and HOD sign-off tracking.",
    category: "Core Workflow",
    icon: Clock,
    badgeText: "Sign-off Queue",
    badgeColor: "border-amber-500/30 text-amber-400 bg-amber-500/10",
    iconBg: "bg-amber-500/10 border-amber-500/20",
    iconColor: "text-amber-400",
    metricLabel: "Pending Sign-offs",
    metricValue: "6 Requests",
  },
  {
    id: "calculation-engine",
    title: "Bonus Calculation Engine",
    subtitle: "Formula Builder & Live Calculator",
    description: "Custom formula builder for performance multipliers, revenue share percentages, fixed bonuses, and department weighting formulas.",
    category: "Calculations & Budget",
    icon: Calculator,
    badgeText: "Formula Engine",
    badgeColor: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    iconColor: "text-emerald-400",
    metricLabel: "Active Formulas",
    metricValue: "8 Rules",
  },
  {
    id: "payroll-integration",
    title: "Payroll Integration",
    subtitle: "Salary Run Sync & Payslip Preview",
    description: "Sync approved bonus earnings directly into monthly salary processing cycles, payslips, bank transfer advice, and settlement runs.",
    category: "Core Workflow",
    icon: Receipt,
    badgeText: "Salary Sync",
    badgeColor: "border-cyan-500/30 text-cyan-400 bg-cyan-500/10",
    iconBg: "bg-cyan-500/10 border-cyan-500/20",
    iconColor: "text-cyan-400",
    metricLabel: "Cycle Status",
    metricValue: "Ready for July Run",
  },
  {
    id: "tax-compliance",
    title: "Tax & Compliance",
    subtitle: "TDS Deduction & PF/ESI Compliance Rules",
    description: "Auto-calculate bonus TDS tax deductions, statutory PF/ESI impact, Tax Section 192 rules, and tax compliance certificates.",
    category: "Calculations & Budget",
    icon: Scale,
    badgeText: "Statutory Tax",
    badgeColor: "border-rose-500/30 text-rose-400 bg-rose-500/10",
    iconBg: "bg-rose-500/10 border-rose-500/20",
    iconColor: "text-rose-400",
    metricLabel: "TDS Rate",
    metricValue: "100% Tax Compliant",
  },
  {
    id: "budget-management",
    title: "Budget Management",
    subtitle: "Annual Pool & Department Allocation",
    description: "Track corporate annual bonus budgets, department allocations, remaining balances, forecast burn rates, and budget alerts.",
    category: "Calculations & Budget",
    icon: PieChart,
    badgeText: "Pool Budget",
    badgeColor: "border-teal-500/30 text-teal-400 bg-teal-500/10",
    iconBg: "bg-teal-500/10 border-teal-500/20",
    iconColor: "text-teal-400",
    metricLabel: "Annual Pool",
    metricValue: "₹50.0L Budget",
  },
  {
    id: "reward-recognition",
    title: "Reward & Recognition",
    subtitle: "Star Performer & Employee of the Month Wall",
    description: "Showcase Employee of the Month/Year awards, digital recognition certificates, star performer badges, and praise walls.",
    category: "Performance & Rewards",
    icon: Trophy,
    badgeText: "Wall of Fame",
    badgeColor: "border-yellow-500/30 text-yellow-400 bg-yellow-500/10",
    iconBg: "bg-yellow-500/10 border-yellow-500/20",
    iconColor: "text-yellow-400",
    metricLabel: "Star Performers",
    metricValue: "12 Star Staff",
  },
  {
    id: "ai-intelligence",
    title: "AI Bonus Intelligence",
    subtitle: "Predictive Analytics & Compensation Engine",
    description: "Consult your AI assistant for bonus payout predictions, performance anomaly detection, compensation benchmarking, and budget optimization.",
    category: "AI & Governance",
    icon: Brain,
    badgeText: "OFC360 Core",
    badgeColor: "border-purple-500/30 text-purple-400 bg-purple-500/10",
    iconBg: "bg-purple-600/20 border-purple-500/30",
    iconColor: "text-purple-300",
    metricLabel: "AI Recommendation",
    metricValue: "99.8% Accuracy",
  },
  {
    id: "reports-analytics",
    title: "Reports & Analytics Hub",
    subtitle: "Export PDF, Excel & CSV Bonus Statements",
    description: "Generate and export Bonus Ledgers, Department Payout Reports, Tax TDS Statements, and Executive Compensation Summaries.",
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
    id: "audit-logs",
    title: "Audit Logs & Governance",
    subtitle: "Timestamped Payout & Calculation History",
    description: "Full audit trail of bonus allocations, approval sign-offs, formula modifications, user roles, and IP addresses.",
    category: "AI & Governance",
    icon: History,
    badgeText: "Governance",
    badgeColor: "border-slate-400/30 text-slate-300 bg-slate-500/10",
    iconBg: "bg-slate-500/10 border-slate-500/20",
    iconColor: "text-slate-300",
    metricLabel: "Logged Events",
    metricValue: "620 Events",
  },
  {
    id: "notifications",
    title: "Notifications & Alerts",
    subtitle: "Bonus Disbursal & Approval Notice Feed",
    description: "Live activity feed for bonus approvals, payment completions, budget threshold warnings, and SMS alerts.",
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
    id: "employee-portal",
    title: "Employee Bonus Portal",
    subtitle: "My Bonuses, Statements & Certificates",
    description: "Employee self-service portal to view bonus history, download reward certificates, check performance ratings, and view TDS tax breakdowns.",
    category: "Performance & Rewards",
    icon: UserCheck,
    badgeText: "Self Service",
    badgeColor: "border-blue-500/30 text-blue-400 bg-blue-500/10",
    iconBg: "bg-blue-500/10 border-blue-500/20",
    iconColor: "text-blue-400",
    metricLabel: "Active Portal",
    metricValue: "100% Staff Access",
  },
  {
    id: "executive-center",
    title: "Executive Bonus Center",
    subtitle: "C-Suite Compensation & Board Approval",
    description: "Manage C-Suite executive bonuses (CEO, CTO, CFO, COO), stock option grants, performance multipliers, and Board sign-off workflows.",
    category: "AI & Governance",
    icon: Crown,
    badgeText: "C-Suite & Board",
    badgeColor: "border-yellow-500/30 text-yellow-400 bg-yellow-500/10",
    iconBg: "bg-yellow-600/20 border-yellow-500/30",
    iconColor: "text-yellow-300",
    metricLabel: "Board Approved",
    metricValue: "100% Signed",
  },
  {
    id: "settings",
    title: "System Settings",
    subtitle: "Bonus Categories, Matrix & Tax Config",
    description: "Configure bonus categories, performance rating scales, multi-tier approval matrix, budget rules, and notification defaults.",
    category: "Analytics & Settings",
    icon: Settings,
    badgeText: "System Config",
    badgeColor: "border-slate-500/30 text-slate-300 bg-slate-500/10",
    iconBg: "bg-slate-800 border-white/10",
    iconColor: "text-slate-300",
    metricLabel: "System Status",
    metricValue: "Active Rules",
  },
];

export const BonusHubCardGrid: React.FC<BonusHubCardGridProps> = ({
  onSelectModule,
  selectedCategory,
  searchQuery,
}) => {
  const filteredCards = BONUS_MODULE_CARDS.filter((card) => {
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
          Bonus & Incentive Feature Modules ({filteredCards.length})
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {filteredCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              onClick={() => onSelectModule(card.id)}
              className="group relative flex flex-col justify-between p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-white/10 hover:border-purple-500/50 shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-xl"
            >
              {/* Top Accent Light Beam */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

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
                  <h4 className="font-extrabold text-white text-base tracking-tight group-hover:text-purple-400 transition-colors">
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
                <div className="flex items-center gap-1 text-xs font-bold text-purple-400 opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
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
