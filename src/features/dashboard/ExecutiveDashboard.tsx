import { Link } from "@tanstack/react-router";
import React, { useState, useEffect, Component, memo, type ReactNode } from "react";
import {
  AlertTriangle,
  Award,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock,
  CreditCard,
  Download,
  FileCheck,
  FileText,
  LogOut,
  MessageSquare,
  Package,
  RefreshCw,
  Sparkles,
  TrendingDown,
  TrendingUp,
  UserCheck,
  UserPlus,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useExecutiveDashboardData } from "./hooks/useExecutiveDashboardData";
import { ExecutiveKpiCards } from "./components/ExecutiveKpiCards";
import { LatestAnnouncementsWidget } from "@/features/announcements/components/LatestAnnouncementsWidget";
import { useNotifications, useArchive } from "@/features/notifications";
import { formatRelativeTime } from "@/lib/notification-utils";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GeminiIcon } from "@/components/icons/GeminiIcon";
import { useAurix, type HRDocument } from "@/lib/aurix-store";
import { statusBadgeClass } from "@/lib/status-styles";
import { getEventTypeDot } from "@/lib/color-maps";
import { toast } from "sonner";
import type {
  ApprovalItem,
  CalendarEvent,
  ActivityItem,
  DeptCard,
} from "./types/executiveDashboardTypes";

// ── UI navigation config (not backend data) ───────────────────
const AI_FEATURES = [
  { title: "HR Copilot", desc: "AI-powered HR Q&A and policy guidance", link: "/ai/chat-assistant" },
  { title: "Resume Screening", desc: "Automated resume parsing & scoring", link: "/ai/recruiter" },
  { title: "AI Analytics", desc: "Predictive workforce intelligence", link: "/ai/analytics-center" },
  { title: "Policy Assistant", desc: "Instant policy answers & summaries", link: "/ai/policy-assistant" },
  { title: "AI Chat", desc: "Multi-modal HR assistant", link: "/ai/chat-assistant" },
];

// ── HR Admin Mock Data ────────────────────────────────────────
const AI_METRICS = [
  { label: "Resumes Screened", value: "342", change: "+18% this week" },
  { label: "Policy Queries Resolved", value: "1,284", change: "98.4% accuracy" },
  { label: "Attrition Risk Alerts", value: "3", change: "2 mitigated" },
  { label: "Hours Saved by AI", value: "64h", change: "+12h vs last month" },
];
const AI_RECENT = [
  { action: "Resume Screening", detail: "Shortlisted 6 candidates for Senior Backend Engineer", time: "12m ago" },
  { action: "Payroll Audit", detail: "Verified March 2026 statutory PF & TDS compliance across 6 employees", time: "45m ago" },
  { action: "Policy Copilot", detail: "Answered 14 employee queries on Flexi-Leave & WFH guidelines", time: "2h ago" },
];
const ACTIVE_JOBS = [
  { title: "Senior Backend Engineer", dept: "Engineering", posted: "2 days ago", applicants: 34 },
  { title: "Product Designer", dept: "Design", posted: "5 days ago", applicants: 19 },
  { title: "Enterprise Account Executive", dept: "Sales", posted: "1 week ago", applicants: 22 },
];
const ACTIVITY_FEED: ActivityItem[] = [
  { id: "act-1", text: "March 2026 Payroll Cycle approved for disbursement", user: "Aarav Sharma · HR Admin", time: "10m ago", icon: "CreditCard" },
  { id: "act-2", text: "Offer letter accepted by Siddharth Rao (Backend Engineer)", user: "Priya Nair · Talent Acquisition", time: "42m ago", icon: "UserPlus" },
  { id: "act-3", text: "MacBook Pro 16-inch M3 Max assigned to Kabir Mehta", user: "IT Operations", time: "1h ago", icon: "Package" },
  { id: "act-4", text: "Form 16 & Tax Declarations verified for FY 2025-26", user: "Sneha Kulkarni · Finance", time: "3h ago", icon: "FileCheck" },
  { id: "act-5", text: "Annual Appraisal review cycle launched for Engineering", user: "Vikramjit Singh · Engineering Manager", time: "5h ago", icon: "Award" },
];
const APPROVAL_DATA: Record<string, ApprovalItem[]> = {
  Leave: [
    { id: "lv-1", name: "Kabir Mehta", department: "Engineering", type: "Annual Leave", detail: "3 Days (18 Mar – 20 Mar)", requestedAt: "2h ago", urgent: true },
    { id: "lv-2", name: "Ananya Iyer", department: "Design", type: "Sick Leave", detail: "1 Day (16 Mar)", requestedAt: "4h ago" },
  ],
  Attendance: [
    { id: "att-1", name: "Rohan Deshmukh", department: "Product", type: "Regularization", detail: "Missed check-out on 12 Mar (19:15)", requestedAt: "Yesterday" },
  ],
  Recruitment: [
    { id: "rec-1", name: "Siddharth Rao", department: "Engineering", type: "Offer Approval", detail: "CTC ₹26,00,000 · L5 Backend", requestedAt: "1h ago", urgent: true },
  ],
  Onboarding: [
    { id: "onb-1", name: "Neha Kapoor", department: "Engineering", type: "BGV Clearance", detail: "DigiLocker & Aadhaar verified", requestedAt: "3h ago" },
  ],
  Exit: [
    { id: "ext-1", name: "Karan Malhotra", department: "Sales", type: "FnF Clearance", detail: "Last Working Day: 28 Mar 2026", requestedAt: "1d ago" },
  ],
  Assets: [
    { id: "ast-1", name: "Meera Krishnan", department: "Customer Success", type: "Accessory Request", detail: "Logitech MX Master 3S Mouse", requestedAt: "5h ago" },
  ],
  Documents: [
    { id: "doc-1", name: "Rohan Deshmukh", department: "Product", type: "Address Proof", detail: "Passport Verification Pending", requestedAt: "6h ago" },
  ],
  Expenses: [
    { id: "exp-1", name: "Kabir Mehta", department: "Engineering", type: "Client Travel", detail: "₹14,850 · Bengaluru Summit Flight", requestedAt: "3h ago", urgent: true },
  ],
};
const ASSET_STATS = [
  { label: "Total Assets", value: 48, icon: "Package" },
  { label: "Assigned", value: 39, icon: "UserCheck" },
  { label: "Available", value: 6, icon: "CheckCircle2" },
  { label: "Under Repair", value: 2, icon: "Wrench" },
  { label: "Pending Return", value: 1, icon: "Clock" },
  { label: "Warranty Alerts", value: 1, icon: "AlertTriangle" },
];
const ATTRITION_RATE = [
  { month: "Oct", rate: 3.8 },
  { month: "Nov", rate: 3.4 },
  { month: "Dec", rate: 3.1 },
  { month: "Jan", rate: 2.9 },
  { month: "Feb", rate: 2.6 },
  { month: "Mar", rate: 2.4 },
];
const CALENDAR_EVENTS: CalendarEvent[] = [
  { id: "ev-1", title: "March Payroll Disbursement Run", date: "2026-03-30", time: "11:00 AM", type: "deadline" },
  { id: "ev-2", title: "Q1 Townhall & Leadership All-Hands", date: "2026-03-25", time: "04:00 PM", type: "meeting" },
  { id: "ev-3", title: "Holi Festival Holiday", date: "2026-03-14", type: "holiday" },
  { id: "ev-4", title: "New Batch Engineering Onboarding", date: "2026-04-01", time: "10:00 AM", type: "onboarding" },
];
const DEPT_ATTENDANCE = [
  { name: "Engineering", value: 96 },
  { name: "Product", value: 94 },
  { name: "Design", value: 95 },
  { name: "Finance", value: 98 },
  { name: "People & HR", value: 100 },
  { name: "Customer Success", value: 93 },
];
const DEPT_DISTRIBUTION = [
  { dept: "Engineering", employees: 42 },
  { dept: "Product", employees: 14 },
  { dept: "Design", employees: 11 },
  { dept: "Sales & CS", employees: 19 },
  { dept: "Finance & Ops", employees: 10 },
  { dept: "People & HR", employees: 6 },
];
const DEPT_PERFORMANCE: DeptCard[] = [
  { name: "Engineering", headcount: 42, attendance: 96, productivity: 94, openPositions: 2 },
  { name: "Product", headcount: 14, attendance: 94, productivity: 91, openPositions: 1 },
  { name: "Design", headcount: 11, attendance: 95, productivity: 92, openPositions: 1 },
  { name: "People & HR", headcount: 6, attendance: 99, productivity: 96, openPositions: 0 },
  { name: "Finance", headcount: 10, attendance: 97, productivity: 95, openPositions: 0 },
  { name: "Customer Success", headcount: 19, attendance: 93, productivity: 90, openPositions: 1 },
];
const EXIT_STAGES = [
  { label: "Notice Period", count: 1, icon: "Clock" },
  { label: "Exit Interview", count: 1, icon: "MessageSquare" },
  { label: "Asset Handover", count: 1, icon: "Package" },
  { label: "FnF Settlement", count: 1, icon: "CreditCard" },
  { label: "Completed (Q1)", count: 3, icon: "CheckCircle2" },
];
const GENDER_DIVERSITY = [
  { name: "Women", value: 46 },
  { name: "Men", value: 52 },
  { name: "Non-Binary", value: 2 },
];
const HEADCOUNT_GROWTH = [
  { month: "Oct", headcount: 242 },
  { month: "Nov", headcount: 251 },
  { month: "Dec", headcount: 259 },
  { month: "Jan", headcount: 268 },
  { month: "Feb", headcount: 276 },
  { month: "Mar", headcount: 284 },
];
const INTERVIEWS_TODAY = [
  { candidate: "Siddharth Rao", role: "Senior Backend Engineer", type: "System Design Round", time: "02:30 PM" },
  { candidate: "Aisha Verma", role: "Product Designer", type: "Portfolio Walkthrough", time: "04:15 PM" },
];
const MONTHLY_PAYROLL = [
  { month: "Oct", cost: 8.6 },
  { month: "Nov", cost: 8.8 },
  { month: "Dec", cost: 9.0 },
  { month: "Jan", cost: 9.1 },
  { month: "Feb", cost: 9.2 },
  { month: "Mar", cost: 9.4 },
];
const ONBOARDING_STAGES = [
  { label: "Pre-boarding", count: 3 },
  { label: "Docs Verification", count: 2 },
  { label: "IT & Asset Setup", count: 2 },
  { label: "Team Induction", count: 4 },
  { label: "Completed (Mar)", count: 8 },
];
const PAYROLL_STATUS = [
  { label: "Processed Employees", value: "6 / 6" },
  { label: "Statutory Compliance", value: "100%" },
  { label: "Pending Reimbursements", value: "2" },
];
const PIPELINE_STAGES = [
  { stage: "Applied", count: 75 },
  { stage: "Screened", count: 38 },
  { stage: "Interview", count: 16 },
  { stage: "Offered", count: 5 },
  { stage: "Hired", count: 3 },
];
const SALARY_DISTRIBUTION = [
  { band: "8-12L", employees: 18 },
  { band: "12-18L", employees: 34 },
  { band: "18-25L", employees: 28 },
  { band: "25-35L", employees: 15 },
  { band: "35L+", employees: 7 },
];
const WEEKLY_ATTENDANCE = [
  { day: "Mon", present: 96, late: 3 },
  { day: "Tue", present: 97, late: 2 },
  { day: "Wed", present: 95, late: 4 },
  { day: "Thu", present: 98, late: 1 },
  { day: "Fri", present: 94, late: 3 },
];
const WIDGET_SCORES = [
  { label: "Workforce Health Index", value: 94, max: 100, description: "Based on retention, engagement & attendance consistency" },
  { label: "Employee eNPS Score", value: 88, max: 100, description: "Q1 pulse survey across all 6 departments" },
  { label: "Statutory Compliance Score", value: 100, max: 100, description: "PF, ESI, PT & TDS filings up to date" },
];
const WORLD_CLOCKS = [
  { city: "Bengaluru (HQ)", tz: "Asia/Kolkata", flag: "🇮🇳" },
  { city: "London", tz: "Europe/London", flag: "🇬🇧" },
  { city: "Singapore", tz: "Asia/Singapore", flag: "🇸🇬" },
  { city: "San Francisco", tz: "America/Los_Angeles", flag: "🇺🇸" },
];


// ── Shared chart tooltip style ────────────────────────────────
const chartTooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 8,
  fontSize: 12,
  color: "hsl(var(--foreground))",
};

// ── Shared card wrapper ───────────────────────────────────────
function Card({
  children,
  className = "",
  noPad = false,
}: {
  children: React.ReactNode;
  className?: string;
  noPad?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border border-border bg-card shadow-xs ${
        noPad ? "" : "p-5"
      } ${className}`}
    >
      {children}
    </div>
  );
}

// ── Resilient Widget Error Boundary ───────────────────────────
interface WidgetErrorBoundaryProps {
  name?: string;
  children: ReactNode;
}

interface WidgetErrorBoundaryState {
  hasError: boolean;
}

class WidgetErrorBoundary extends Component<WidgetErrorBoundaryProps, WidgetErrorBoundaryState> {
  constructor(props: WidgetErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): WidgetErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(`Error in widget "${this.props.name || "DashboardWidget"}":`, error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-center">
          <div className="flex flex-col items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <p className="text-xs font-medium text-destructive">
              Unable to load {this.props.name || "this section"}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => this.setState({ hasError: false })}
              className="h-7 border-destructive/30 text-xs text-destructive hover:bg-destructive/20 cursor-pointer"
            >
              Retry
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function SectionHeader({
  title,
  subtitle,
  link,
  linkLabel = "View more",
  action,
}: {
  title: string;
  subtitle?: string;
  link?: string;
  linkLabel?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h2 className="font-display text-base sm:text-lg font-semibold tracking-tight text-foreground">{title}</h2>
        {subtitle && (
          <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {action ||
        (link && (
          <Link
            to={link as any}
            className="inline-flex min-h-8 shrink-0 items-center gap-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground/80 transition-colors hover:border-primary/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {linkLabel} <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        ))}
    </div>
  );
}

const ICON_MAP: Record<string, React.ElementType> = {
  Package, UserCheck, CheckCircle2, AlertTriangle, Clock, Wrench,
  UserPlus, Briefcase, FileText, CreditCard, MessageSquare, ClipboardCheck,
  LogOut, FileCheck, Award,
};

// ── 2. Quick Actions Strip ────────────────────────────────────
const QUICK_ACTIONS = [
  { label: "Add Employee", icon: UserPlus, link: "/dashboard/employees?action=add" },
  { label: "Create Job", icon: Briefcase, link: "/dashboard/recruitment/jobs/new" },
  { label: "Run Payroll", icon: CreditCard, link: "/dashboard/payroll" },
  { label: "Start Onboarding", icon: UserCheck, link: "/dashboard/onboarding-checklist" },
  { label: "Approve Leave", icon: FileText, link: "/dashboard/leaves" },
  { label: "Assign Asset", icon: Package, link: "/dashboard/assets" },
  { label: "Generate Report", icon: Download, link: "/dashboard/reports" },
  { label: "AI Copilot", icon: GeminiIcon, link: "/ai/chat-assistant" },
];

const QuickActions = memo(function QuickActions() {
  return (
    <section aria-label="Quick actions">
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-8">
        {QUICK_ACTIONS.map((a) => {
          const Icon = a.icon;
          return (
            <Link
              key={a.label}
              to={a.link as any}
              className="group flex min-h-[84px] flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card p-3 text-center shadow-xs transition-colors hover:border-primary/35 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
              </div>
              <span className="text-[13px] font-medium leading-snug text-foreground/90 group-hover:text-foreground break-words">
                {a.label}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
});

// ── 3. KPI Cards ─────────────────────────────────────────────
const KpiCards = ExecutiveKpiCards;

// ── 4. HR Operations Center (Approvals) ──────────────────────
const APPROVAL_TABS = ["Leave", "Attendance", "Recruitment", "Onboarding", "Exit", "Assets", "Documents", "Expenses"] as const;
type ApprovalTab = (typeof APPROVAL_TABS)[number];

function ApprovalCenter() {
  const [activeTab, setActiveTab] = useState<ApprovalTab>("Leave");
  const [approvalItems, setApprovalItems] = useState<Record<string, ApprovalItem[]>>(APPROVAL_DATA);
  const items = approvalItems[activeTab] ?? [];

  function handleDecision(id: string, name: string, decision: "approved" | "rejected") {
    setApprovalItems((prev) => ({
      ...prev,
      [activeTab]: (prev[activeTab] ?? []).filter((item) => item.id !== id),
    }));
    if (decision === "approved") {
      toast.success(`Approved ${activeTab.toLowerCase()} request for ${name}`);
    } else {
      toast.info(`Rejected ${activeTab.toLowerCase()} request for ${name}`);
    }
  }

  return (
    <div>
      <Card>
        <SectionHeader
          title="HR Operations Center"
          subtitle="Unified approval hub across all modules"
          link="/dashboard/hr-ops"
        />
        {/* Tabs */}
        <div className="mb-4 flex gap-1.5 overflow-x-auto rounded-lg bg-muted p-1">
          {APPROVAL_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                activeTab === tab
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
              {(approvalItems[tab]?.length ?? 0) > 0 && (
                <span
                  className={`ml-1.5 rounded-full px-1.5 py-0.5 text-xs font-semibold tabular-nums ${
                    activeTab === tab ? "bg-primary/15 text-primary" : "bg-background/70 text-muted-foreground"
                  }`}
                >
                  {approvalItems[tab]?.length ?? 0}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Pending Approvals List */}
        <div key={activeTab}>
          {items.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border py-6 text-center text-sm text-muted-foreground">
              All {activeTab.toLowerCase()} approvals are cleared.
            </div>
          ) : (
            <div className="divide-y divide-border rounded-lg border border-border">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-3 px-4 py-3 transition-colors hover:bg-muted/35 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{item.name}</span>
                      {item.urgent && (
                        <Badge variant="destructive" className="px-1.5 py-0 text-xs">
                          Urgent
                        </Badge>
                      )}
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                      <span>{item.department}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.type}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.detail}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 sm:justify-end">
                    <span className="text-xs text-muted-foreground">{item.requestedAt}</span>
                    <div className="flex shrink-0 gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDecision(item.id, item.name, "approved")}
                        className="h-8 border-emerald-300 text-[13px] text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800/60 dark:text-emerald-300 dark:hover:bg-emerald-950/40"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDecision(item.id, item.name, "rejected")}
                        className="h-8 border-destructive/35 text-[13px] text-destructive hover:bg-destructive/10"
                      >
                        <X className="h-3.5 w-3.5" /> Reject
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

// ── 5. Recruitment Dashboard ──────────────────────────────────
function RecruitmentDashboard() {
  return (
    <div>
      <Card>
        <SectionHeader
          title="Recruitment Dashboard"
          subtitle="Hiring pipeline and active roles"
          link="/dashboard/recruitment"
        />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Pipeline funnel */}
          <div>
            <p className="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Candidate Pipeline</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PIPELINE_STAGES} layout="vertical" margin={{ left: 0, right: 16, top: 0, bottom: 0 }}>
                  <CartesianGrid stroke="hsl(var(--border))" horizontal={false} />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="stage" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} width={72} />
                  <Tooltip
                    contentStyle={chartTooltipStyle}
                    itemStyle={{ color: "hsl(var(--foreground))" }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]} fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Active jobs + today's interviews */}
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Active Jobs</p>
              <div className="divide-y divide-border rounded-lg border border-border">
                {ACTIVE_JOBS.map((job) => (
                  <div
                    key={job.title}
                    className="flex items-center justify-between gap-2 px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-foreground">{job.title}</div>
                      <div className="text-xs text-muted-foreground">{job.dept} · {job.posted}</div>
                    </div>
                    <Badge variant="outline" className={`shrink-0 ${statusBadgeClass("active")}`}>
                      {job.applicants} applicants
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Interviews Today</p>
              <div className="divide-y divide-border rounded-lg border border-border">
                {INTERVIEWS_TODAY.map((iv) => (
                  <div
                    key={iv.candidate}
                    className="flex items-center gap-3 px-3 py-2.5"
                  >
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                      <CalendarDays className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-foreground">{iv.candidate}</div>
                      <div className="text-xs text-muted-foreground">{iv.role} · {iv.type}</div>
                    </div>
                    <div className="shrink-0 text-xs font-medium text-muted-foreground">{iv.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ── 6. Attendance Analytics ───────────────────────────────────
const AttendanceAnalytics = memo(function AttendanceAnalytics() {
  return (
    <div>
      <Card>
        <SectionHeader
          title="Attendance Analytics"
          subtitle="Weekly trends and department breakdown"
          link="/dashboard/attendance"
        />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Daily Attendance — This Week</p>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={WEEKLY_ATTENDANCE} margin={{ top: 6, right: 8, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.28} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={chartTooltipStyle} itemStyle={{ color: "hsl(var(--foreground))" }} labelStyle={{ color: "hsl(var(--foreground))" }} />
                  <Area type="monotone" dataKey="present" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#attGrad)" name="Present" />
                  <Area type="monotone" dataKey="late" stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} fill="transparent" name="Late" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Dept Attendance %</p>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DEPT_ATTENDANCE} margin={{ top: 6, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} domain={[80, 100]} />
                  <Tooltip contentStyle={chartTooltipStyle} itemStyle={{ color: "hsl(var(--foreground))" }} labelStyle={{ color: "hsl(var(--foreground))" }} formatter={(v) => [`${v}%`, "Attendance"]} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
});

// ── 7. Payroll Overview ───────────────────────────────────────
const PayrollOverview = memo(function PayrollOverview({ data }: { data?: ReturnType<typeof useExecutiveDashboardData>["payrollOverview"] }) {
  const statusItems = data?.payrollStatus && data.payrollStatus.length > 0 ? data.payrollStatus : PAYROLL_STATUS;
  const totalCostText = data?.totalCostFormatted ?? "₹0.0L";
  const chartData = data?.monthlySalaryCostChart && data.monthlySalaryCostChart.length > 0
    ? data.monthlySalaryCostChart
    : MONTHLY_PAYROLL;

  return (
    <div>
      <Card>
        <SectionHeader title="Payroll Overview" subtitle="Monthly salary cost & status" link="/dashboard/payroll" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Status summary */}
          <div className="space-y-2.5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Payroll Status</p>
            {statusItems.map((s) => (
              <div
                key={s.label}
                className="flex items-center justify-between rounded-lg bg-muted/40 px-4 py-3"
              >
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                  {s.label}
                </div>
                <span className="font-display text-lg font-semibold tabular-nums text-foreground">{s.value}</span>
              </div>
            ))}
            <div className="rounded-lg border border-border bg-muted/25 px-4 py-3">
              <div className="text-xs text-muted-foreground">Total Cost This Month</div>
              <div className="mt-1 font-display text-2xl font-bold tabular-nums text-foreground">{totalCostText}</div>
            </div>
          </div>

          {/* Monthly chart */}
          <div className="lg:col-span-2">
            <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Monthly Salary Cost (Lakhs ₹)</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 6, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={chartTooltipStyle}
                    itemStyle={{ color: "hsl(var(--foreground))" }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                    formatter={(v) => [`₹${v}L`, "Payroll"]}
                  />
                  <Bar dataKey="cost" radius={[6, 6, 0, 0]} fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
});

// ── 8. Asset Management Overview ─────────────────────────────
function AssetOverview() {
  return (
    <div>
      <Card>
        <SectionHeader title="Asset Management" subtitle="Company asset inventory at a glance" link="/dashboard/assets" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {ASSET_STATS.map((a) => {
            const Icon = ICON_MAP[a.icon] ?? Package;
            return (
              <div
                key={a.label}
                className="flex flex-col items-center gap-2 rounded-lg bg-muted/35 p-4 text-center"
              >
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="font-display text-2xl font-bold tabular-nums text-foreground">{a.value}</div>
                <div className="text-xs font-medium leading-snug text-muted-foreground">{a.label}</div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

// ── 9. Onboarding Center ──────────────────────────────────────
function OnboardingCenter() {
  const total = ONBOARDING_STAGES.reduce((s, o) => s + o.count, 0);
  return (
    <div>
      <Card>
        <SectionHeader title="Onboarding Center" subtitle="New employee journey tracking" link="/dashboard/onboarding-checklist" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {ONBOARDING_STAGES.map((s) => (
            <div key={s.label} className="rounded-lg bg-muted/35 p-3.5 text-center">
              <div className="font-display text-2xl font-bold tabular-nums text-foreground">{s.count}</div>
              <div className="mt-1 text-xs font-medium text-muted-foreground">{s.label}</div>
              <div className="mt-2">
                <Progress
                  value={total > 0 ? (s.count / total) * 100 : 0}
                  className="h-1.5 w-full"
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── 10. Exit Management ───────────────────────────────────────
function ExitManagement() {
  return (
    <div>
      <Card>
        <SectionHeader title="Exit Management" subtitle="Offboarding pipeline status" link="/dashboard/exit" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {EXIT_STAGES.map((s) => {
            const Icon = ICON_MAP[s.icon] ?? Clock;
            return (
              <div key={s.label} className="rounded-lg bg-muted/35 p-3.5 text-center">
                <div className="mx-auto mb-2 grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="font-display text-2xl font-bold tabular-nums text-foreground">{s.count}</div>
                <div className="mt-1 text-xs font-medium text-muted-foreground">{s.label}</div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

// ── 11. Documents Center ──────────────────────────────────────
function DocumentsCenter() {
  const ws = useAurix();
  const docs = ws.documents ?? [];
  const pending = docs.filter((d: HRDocument) => d.status === "Pending");
  const missing = docs.filter((d: HRDocument) => d.status === "Rejected");
  const expiring = docs.filter((d: HRDocument) => {
    if (!d.expiryDate) return false;
    const exp = new Date(d.expiryDate);
    const diff = (exp.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return diff < 60 && diff > 0;
  });
  const recent = [...docs].sort((a: HRDocument, b: HRDocument) => (b.uploadDate || "").localeCompare(a.uploadDate || "")).slice(0, 4);

  return (
    <div>
      <Card>
        <SectionHeader title="Documents Center" subtitle="Document status and verifications" link="/dashboard/documents" />
        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Missing/Rejected", value: missing.length },
            { label: "Pending Review", value: pending.length },
            { label: "Expiring Soon", value: expiring.length },
            { label: "Total Documents", value: docs.length },
          ].map((s) => (
            <div key={s.label} className="rounded-lg bg-muted/35 p-3.5 text-center">
              <div className="font-display text-2xl font-bold tabular-nums text-foreground">{s.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
        <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Recent Uploads</p>
        <div>
          {recent.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-6 text-center">
              <FileText className="mb-1.5 h-7 w-7 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No recent documents uploaded</p>
              <Link to="/dashboard/documents" className="mt-2 text-[13px] font-medium text-primary hover:underline">
                Upload or manage documents &rarr;
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border rounded-lg border border-border">
              {recent.map((d: HRDocument) => (
                <div key={d.id} className="flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-muted/35">
                  <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-foreground">{d.name}</div>
                    <div className="text-xs text-muted-foreground">{d.uploadDate || "Recent"}</div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`shrink-0 text-xs ${statusBadgeClass(d.status)}`}
                  >
                    {d.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

// ── 12. AI Command Center ─────────────────────────────────────
function AICommandCenter() {
  return (
    <div>
      <Card>
        <SectionHeader title="AI Command Center" subtitle="Powered by OFC360" link="/ai" />
        {/* Metrics row */}
        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {AI_METRICS.map((m) => (
            <div key={m.label} className="rounded-lg bg-muted/35 p-3.5 text-center">
              <div className="font-display text-xl font-bold tabular-nums text-foreground">{m.value}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">{m.label}</div>
              <div className="mt-1 text-xs font-medium text-primary">{m.change}</div>
            </div>
          ))}
        </div>

        {/* Feature cards */}
        <div className="mb-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
          {AI_FEATURES.map((f) => (
            <Link key={f.title} to={f.link as any} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg">
              <div className="group flex h-full flex-col gap-2 rounded-lg border border-border bg-background/50 p-3.5 transition-colors hover:border-primary/35 hover:bg-muted/40">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                  <GeminiIcon className="h-4 w-4" />
                </div>
                <div className="text-[13px] font-semibold text-foreground">{f.title}</div>
                <div className="text-xs text-muted-foreground leading-relaxed">{f.desc}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent activity */}
        <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Recent AI Activity</p>
        <div className="divide-y divide-border rounded-lg border border-border">
          {AI_RECENT.map((r, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2.5">
              <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-sm font-medium text-foreground">{r.action}: </span>
                <span className="text-sm text-muted-foreground">{r.detail}</span>
              </div>
              <div className="shrink-0 text-xs text-muted-foreground">{r.time}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── 13. Executive Analytics ───────────────────────────────────
function ExecutiveAnalytics() {
  return (
    <div>
      <Card>
        <SectionHeader title="Executive Analytics" subtitle="Key workforce metrics and trends" link="/dashboard/reports" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Headcount Growth */}
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Headcount Growth</p>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={HEADCOUNT_GROWTH} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="hcGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.28} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} domain={[230, 295]} />
                  <Tooltip contentStyle={chartTooltipStyle} itemStyle={{ color: "hsl(var(--foreground))" }} labelStyle={{ color: "hsl(var(--foreground))" }} />
                  <Area type="monotone" dataKey="headcount" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#hcGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Attrition Rate */}
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Attrition Rate (%)</p>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ATTRITION_RATE} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} domain={[2, 5]} />
                  <Tooltip contentStyle={chartTooltipStyle} itemStyle={{ color: "hsl(var(--foreground))" }} labelStyle={{ color: "hsl(var(--foreground))" }} formatter={(v) => [`${v}%`, "Attrition"]} />
                  <Line type="monotone" dataKey="rate" stroke="hsl(var(--destructive))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gender Diversity donut */}
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Gender Diversity</p>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={GENDER_DIVERSITY}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={65}
                    dataKey="value"
                    paddingAngle={3}
                  >
                    {GENDER_DIVERSITY.map((_, i) => (
                      <Cell key={i} fill={i === 0 ? "hsl(var(--primary))" : i === 1 ? "hsl(var(--muted-foreground))" : "hsl(var(--chart-2))"} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={chartTooltipStyle} itemStyle={{ color: "hsl(var(--foreground))" }} labelStyle={{ color: "hsl(var(--foreground))" }} />
                  <Legend iconSize={10} wrapperStyle={{ fontSize: 12, color: "hsl(var(--muted-foreground))" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Salary Distribution */}
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Salary Distribution</p>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SALARY_DISTRIBUTION} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="band" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={chartTooltipStyle} itemStyle={{ color: "hsl(var(--foreground))" }} labelStyle={{ color: "hsl(var(--foreground))" }} />
                  <Bar dataKey="employees" radius={[4, 4, 0, 0]} fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Dept Distribution */}
          <div className="lg:col-span-2">
            <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Department Distribution</p>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DEPT_DISTRIBUTION} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="dept" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={chartTooltipStyle} itemStyle={{ color: "hsl(var(--foreground))" }} labelStyle={{ color: "hsl(var(--foreground))" }} />
                  <Bar dataKey="employees" radius={[4, 4, 0, 0]} fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ── 14. Company Calendar ──────────────────────────────────────
function CompanyCalendar() {
  return (
    <div>
      <Card>
        <SectionHeader title="Company Calendar" subtitle="Upcoming meetings, holidays & key dates" link="/dashboard/attendance/holidays" />
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {CALENDAR_EVENTS.map((ev) => (
            <div
              key={ev.id}
              className="flex items-start gap-3 rounded-lg bg-muted/35 px-3.5 py-2.5"
            >
              <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${getEventTypeDot(ev.type)}`} />
              <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-foreground">{ev.title}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(ev.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  {ev.time ? ` · ${ev.time}` : ""}
                </div>
              </div>
              <Badge variant="outline" className={`ml-auto shrink-0 capitalize text-xs ${statusBadgeClass(ev.type)}`}>
                {ev.type}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── 15. Live Activity Feed ────────────────────────────────────
function ActivityFeed() {
  return (
    <div>
      <Card>
        <SectionHeader title="Live Activity Feed" subtitle="Real-time HR system activity" link="/dashboard/hr-operations/timeline" />
        <div className="divide-y divide-border rounded-lg border border-border max-h-96 overflow-y-auto">
          {ACTIVITY_FEED.map((a) => {
            const Icon = ICON_MAP[a.icon] ?? Zap;
            return (
              <div
                key={a.id}
                className="flex items-start gap-3 px-3.5 py-3"
              >
                <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-foreground">{a.text}</p>
                  <p className="text-xs text-muted-foreground">{a.user}</p>
                </div>
                <div className="shrink-0 text-xs text-muted-foreground">{a.time}</div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

// ── 16. Smart Notification Center ────────────────────────────
function NotificationCenter() {
  const { items } = useNotifications({ priority: "high,critical", limit: 5 });
  const archiveMutation = useArchive();

  return (
    <div>
      <Card>
        <SectionHeader
          title="Priority Alerts"
          subtitle="Compliance notices & system exceptions"
          link="/dashboard/notifications"
        />
        <div>
          {items.length > 0 ? (
            <div className="divide-y divide-border rounded-lg border border-border">
              {items.map((n) => (
                <div
                  key={n.id}
                  className="flex items-start gap-3 px-3.5 py-3"
                >
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{n.title}</span>
                      <Badge variant="outline" className={`shrink-0 text-xs capitalize ${statusBadgeClass(n.priority)}`}>
                        {n.category.replace(/_/g, " ")}
                      </Badge>
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{n.body}</div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <span className="text-xs text-muted-foreground font-mono">
                      {formatRelativeTime(n.createdAt)}
                    </span>
                    <button
                      type="button"
                      onClick={() => archiveMutation.mutate(n.id)}
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                      aria-label="Dismiss notification"
                      title="Dismiss"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-muted-foreground">
              <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-primary" />
              All caught up! No active high-priority alerts.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

// ── 17. Department Performance Cards ─────────────────────────
function DepartmentPerformance() {
  return (
    <div>
      <Card>
        <SectionHeader title="Department Performance" subtitle="Workforce metrics by department" link="/dashboard/departments" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {DEPT_PERFORMANCE.map((d) => (
            <div
              key={d.name}
              className="rounded-lg border border-border bg-muted/20 p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-foreground">{d.name}</span>
                <Badge variant="outline" className="text-xs">
                  {d.headcount} employees
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Attendance</span>
                  <span className="font-medium text-foreground">{d.attendance}%</span>
                </div>
                <Progress value={d.attendance} className="h-1.5" />
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Productivity</span>
                  <span className="font-medium text-foreground">{d.productivity}%</span>
                </div>
                <Progress value={d.productivity} className="h-1.5" />
                <div className="mt-1 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Open Positions</span>
                  <span className="font-semibold text-foreground">{d.openPositions} open</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── 18. Reports Center ────────────────────────────────────────
const REPORT_CARD_ITEMS = [
  { label: "Attendance", link: "/dashboard/attendance" },
  { label: "Payroll", link: "/dashboard/payroll/reports" },
  { label: "Recruitment", link: "/dashboard/recruitment/reports", isLong: true },
  { label: "Assets", link: "/dashboard/assets" },
  { label: "Leave", link: "/dashboard/leaves" },
  { label: "Exit", link: "/dashboard/exit" },
  { label: "Analytics", link: "/dashboard/recruitment/analytics" },
];

function ReportsCenter() {
  return (
    <div>
      <Card>
        <SectionHeader
          title="Reports Center"
          subtitle="One-click report generation"
          link="/dashboard/reports"
        />

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
          {REPORT_CARD_ITEMS.map((r) => (
            <Link
              key={r.label}
              to={r.link as any}
              className="group flex min-h-[82px] flex-col items-center justify-center gap-2 rounded-lg border border-border bg-background/50 px-3 py-3 text-center transition-colors hover:border-primary/35 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <Download className="h-4 w-4" />
              </div>
              <span className="text-[13px] font-medium leading-snug text-foreground break-words">
                {r.label}
              </span>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── 19. Enterprise Widgets ────────────────────────────────────
function WorldClock() {
  const [clocks, setClocks] = useState<{ city: string; time: string; flag: string }[]>([]);
  useEffect(() => {
    if (WORLD_CLOCKS.length === 0) return;
    function update() {
      setClocks(
        WORLD_CLOCKS.map((wc) => ({
          city: wc.city,
          flag: wc.flag,
          time: new Date().toLocaleTimeString("en-US", {
            timeZone: wc.tz,
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
        }))
      );
    }
    update();
    const t = setInterval(update, 30_000);
    return () => clearInterval(t);
  }, []);

  return (
    <Card>
      <SectionHeader title="World Clock" />
      <div className="grid grid-cols-2 gap-2.5">
        {clocks.map((c) => (
          <div key={c.city} className="flex items-center gap-2.5 rounded-lg bg-muted/35 px-3 py-2.5">
            <span className="text-lg">{c.flag}</span>
            <div>
              <div className="text-xs text-muted-foreground">{c.city}</div>
              <div className="font-display text-base font-semibold tabular-nums text-foreground">{c.time}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function ScoreWidgets() {
  return (
    <Card>
      <SectionHeader title="Company Scores" subtitle="Health, Satisfaction & Productivity" />
      <div className="space-y-4">
        {WIDGET_SCORES.map((w) => (
          <div key={w.label}>
            <div className="mb-1 flex items-center justify-between text-[13px]">
              <span className="font-medium text-foreground">{w.label}</span>
              <span className="font-semibold tabular-nums text-foreground">
                {w.value}/{w.max}
              </span>
            </div>
            <Progress
              value={w.max > 0 ? (w.value / w.max) * 100 : 0}
              className="h-2 w-full"
            />
            <p className="mt-1 text-xs text-muted-foreground">{w.description}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Main Executive Dashboard ──────────────────────────────────
export function ExecutiveDashboard() {
  const live = useExecutiveDashboardData();

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button asChild size="sm">
          <Link to={"/dashboard/employees?action=add" as any}>
            <UserPlus className="h-4 w-4" />
            Add employee
          </Link>
        </Button>
      </div>

      {/* Live Error Banner if an API had issues */}
      {live.error && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-destructive" />
            <span>Some live metrics could not be loaded ({live.error}). Showing cached metrics.</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={live.refetch}
            disabled={live.loading}
            className="h-8 border-destructive/30 text-[13px] text-destructive hover:bg-destructive/15"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${live.loading ? "animate-spin" : ""}`} />
            Retry
          </Button>
        </div>
      )}

      {/* Priority KPI Metrics */}
      <WidgetErrorBoundary name="KPI Metrics">
        <ExecutiveKpiCards details={live.kpiDetails} loading={live.loading} />
      </WidgetErrorBoundary>

      {/* Exceptions & Pending Approvals */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <WidgetErrorBoundary name="HR Approvals">
            <ApprovalCenter />
          </WidgetErrorBoundary>
        </div>
        <WidgetErrorBoundary name="Priority Alerts">
          <NotificationCenter />
        </WidgetErrorBoundary>
      </div>

      {/* Quick Actions */}
      <WidgetErrorBoundary name="Quick Actions">
        <QuickActions />
      </WidgetErrorBoundary>

      {/* Activity + Announcements */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <WidgetErrorBoundary name="Activity Feed">
          <ActivityFeed />
        </WidgetErrorBoundary>
        <WidgetErrorBoundary name="Latest Announcements">
          <LatestAnnouncementsWidget />
        </WidgetErrorBoundary>
      </div>

      {/* Dept Performance */}
      <WidgetErrorBoundary name="Department Performance">
        <DepartmentPerformance />
      </WidgetErrorBoundary>

      {/* Recruitment */}
      <WidgetErrorBoundary name="Recruitment Pipeline">
        <RecruitmentDashboard />
      </WidgetErrorBoundary>

      {/* Attendance */}
      <WidgetErrorBoundary name="Attendance Analytics">
        <AttendanceAnalytics />
      </WidgetErrorBoundary>

      {/* Payroll + Onboarding + Exit */}
      <div className="grid grid-cols-1 gap-6">
        <WidgetErrorBoundary name="Payroll Overview">
          <PayrollOverview data={live.payrollOverview} />
        </WidgetErrorBoundary>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <WidgetErrorBoundary name="Onboarding Center">
          <OnboardingCenter />
        </WidgetErrorBoundary>
        <WidgetErrorBoundary name="Exit Management">
          <ExitManagement />
        </WidgetErrorBoundary>
      </div>

      {/* Assets + Documents */}
      <div className="grid grid-cols-1 gap-6">
        <WidgetErrorBoundary name="Assets Overview">
          <AssetOverview />
        </WidgetErrorBoundary>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <WidgetErrorBoundary name="Documents Center">
            <DocumentsCenter />
          </WidgetErrorBoundary>
        </div>
        <div className="space-y-6">
          <WidgetErrorBoundary name="World Clock">
            <WorldClock />
          </WidgetErrorBoundary>
          <WidgetErrorBoundary name="Company Scores">
            <ScoreWidgets />
          </WidgetErrorBoundary>
        </div>
      </div>

      {/* AI Command Center */}
      <WidgetErrorBoundary name="AI Command Center">
        <AICommandCenter />
      </WidgetErrorBoundary>

      {/* Executive Analytics */}
      <WidgetErrorBoundary name="Executive Analytics">
        <ExecutiveAnalytics />
      </WidgetErrorBoundary>

      {/* Calendar + Reports */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <WidgetErrorBoundary name="Company Calendar">
          <CompanyCalendar />
        </WidgetErrorBoundary>
        <WidgetErrorBoundary name="Reports Center">
          <ReportsCenter />
        </WidgetErrorBoundary>
      </div>
    </div>
  );
}

export default ExecutiveDashboard;
