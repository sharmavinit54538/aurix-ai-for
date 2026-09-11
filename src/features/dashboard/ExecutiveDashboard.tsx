import { Link } from "@tanstack/react-router";
import React, { useState, useEffect, Component, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useExecutiveDashboardData } from "./hooks/useExecutiveDashboardData";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GeminiIcon } from "@/components/icons/GeminiIcon";
import { useAurix, type HRDocument } from "@/lib/aurix-store";
import {
  AI_FEATURES,
  AI_METRICS,
  AI_RECENT,
  ACTIVE_JOBS,
  ACTIVITY_FEED,
  APPROVAL_DATA,
  ASSET_STATS,
  ATTRITION_RATE,
  CALENDAR_EVENTS,
  DEPT_ATTENDANCE,
  DEPT_DISTRIBUTION,
  DEPT_PERFORMANCE,
  EXIT_STAGES,
  GENDER_DIVERSITY,
  HEADCOUNT_GROWTH,
  INTERVIEWS_TODAY,
  KPI_CARDS,
  MONTHLY_PAYROLL,
  NOTIFICATIONS,
  ONBOARDING_STAGES,
  PAYROLL_STATUS,
  PIPELINE_STAGES,
  SALARY_DISTRIBUTION,
  WEEKLY_ATTENDANCE,
  WIDGET_SCORES,
  WORLD_CLOCKS,
} from "./executive-data";

// ── Animation variants ────────────────────────────────────────
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" as const },
};

const stagger = (i: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" as const, delay: i * 0.06 },
});

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
      className={`rounded-2xl border border-border bg-card/60 backdrop-blur-xl shadow-sm ${
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
        <Card className="border-rose-500/30 bg-rose-500/5 p-4 text-center">
          <div className="flex flex-col items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-rose-500" />
            <p className="text-xs font-medium text-rose-600 dark:text-rose-400">
              Unable to load {this.props.name || "this section"}
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="text-[11px] font-semibold text-primary underline underline-offset-2 hover:opacity-80 cursor-pointer"
            >
              Retry
            </button>
          </div>
        </Card>
      );
    }
    return this.props.children;
  }
}

function SectionHeader({
  title,
  subtitle,
  link,
  linkLabel = "View More",
  action,
}: {
  title: string;
  subtitle?: string;
  link?: string;
  linkLabel?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex items-start justify-between gap-3">
      <div>
        <h2 className="font-display text-lg font-semibold tracking-tight">{title}</h2>
        {subtitle && (
          <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {action ||
        (link && (
          <Link
            to={link as any}
            className="flex shrink-0 items-center gap-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
          >
            {linkLabel} <ChevronRight className="h-3 w-3" />
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
  { label: "Add Employee", icon: UserPlus, link: "/dashboard/employees", color: "from-emerald-600 to-teal-600" },
  { label: "Create Job", icon: Briefcase, link: "/dashboard/recruitment/jobs/new", color: "from-blue-600 to-indigo-600" },
  { label: "Run Payroll", icon: CreditCard, link: "/dashboard/payroll", color: "from-green-600 to-emerald-600" },
  { label: "Start Onboarding", icon: UserCheck, link: "/dashboard/onboarding-checklist", color: "from-violet-600 to-purple-600" },
  { label: "Approve Leave", icon: FileText, link: "/dashboard/leaves", color: "from-amber-600 to-orange-600" },
  { label: "Assign Asset", icon: Package, link: "/dashboard/assets", color: "from-slate-600 to-gray-700" },
  { label: "Generate Report", icon: Download, link: "/dashboard/reports", color: "from-cyan-600 to-blue-600" },
  { label: "AI Copilot", icon: GeminiIcon, link: "/ai/chat-assistant", color: "from-pink-600 to-rose-600" },
];

function QuickActions() {
  return (
    <div className="mb-6">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
        {QUICK_ACTIONS.map((a, i) => {
          const Icon = a.icon;
          return (
            <motion.div key={a.label} {...stagger(i)}>
              <Link
                to={a.link as any}
                className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-card/60 p-3 text-center transition-all hover:border-foreground/20 hover:shadow-md hover:-translate-y-0.5"
              >
                <div
                  className={`grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br ${a.color} shadow-sm`}
                >
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <span className="text-[11px] font-medium leading-tight text-muted-foreground group-hover:text-foreground">
                  {a.label}
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ── 3. KPI Cards ─────────────────────────────────────────────
function KpiCards({ cards }: { cards?: ReturnType<typeof useExecutiveDashboardData>["kpiCards"] }) {
  const items = cards && cards.length > 0 ? cards : KPI_CARDS;
  return (
    <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {items.map((kpi, i) => (
        <motion.div key={kpi.id} {...stagger(i)}>
          <Link to={kpi.link as any}>
            <Card className="group relative overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer">
              <div className={`mb-3 inline-flex items-center rounded-lg p-2 ${kpi.bgAccent}`}>
                <TrendingUp className={`h-4 w-4 ${kpi.accent}`} />
              </div>
              <div className="font-display text-2xl font-bold tracking-tight">{kpi.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{kpi.label}</div>
              <div
                className={`mt-2 flex items-center gap-1 text-xs font-medium ${
                  kpi.changeType === "up"
                    ? "text-emerald-500"
                    : kpi.changeType === "down"
                    ? "text-rose-500"
                    : "text-muted-foreground"
                }`}
              >
                {kpi.changeType === "up" ? (
                  <TrendingUp className="h-3 w-3" />
                ) : kpi.changeType === "down" ? (
                  <TrendingDown className="h-3 w-3" />
                ) : null}
                {kpi.change}
              </div>
              {/* Mini sparkline */}
              <div className="mt-3 h-10 w-full opacity-60">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={kpi.spark}>
                    <Line
                      type="monotone"
                      dataKey="v"
                      stroke={
                        kpi.accent.includes("emerald")
                          ? "#10b981"
                          : kpi.accent.includes("blue")
                          ? "#3b82f6"
                          : kpi.accent.includes("violet")
                          ? "#8b5cf6"
                          : kpi.accent.includes("amber")
                          ? "#f59e0b"
                          : kpi.accent.includes("rose")
                          ? "#f43f5e"
                          : kpi.accent.includes("cyan")
                          ? "#06b6d4"
                          : kpi.accent.includes("indigo")
                          ? "#6366f1"
                          : kpi.accent.includes("teal")
                          ? "#14b8a6"
                          : kpi.accent.includes("orange")
                          ? "#f97316"
                          : kpi.accent.includes("green")
                          ? "#22c55e"
                          : kpi.accent.includes("slate")
                          ? "#64748b"
                          : "#6366f1"
                      }
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

// ── 4. HR Operations Center (Approvals) ──────────────────────
const APPROVAL_TABS = ["Leave", "Attendance", "Recruitment", "Onboarding", "Exit", "Assets", "Documents", "Expenses"] as const;
type ApprovalTab = (typeof APPROVAL_TABS)[number];

function ApprovalCenter() {
  const [activeTab, setActiveTab] = useState<ApprovalTab>("Leave");
  const items = APPROVAL_DATA[activeTab] ?? [];

  return (
    <motion.div {...fadeUp}>
      <Card>
        <SectionHeader
          title="HR Operations Center"
          subtitle="Unified approval hub across all modules"
          link="/dashboard/hr-ops"
        />
        {/* Tabs */}
        <div className="mb-4 flex gap-1.5 overflow-x-auto pb-1">
          {APPROVAL_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === tab
                  ? "bg-foreground text-background"
                  : "border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
              {APPROVAL_DATA[tab].length > 0 && (
                <span
                  className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                    activeTab === tab ? "bg-background/20 text-background" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {APPROVAL_DATA[tab].length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Table */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-2"
          >
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-background/50 px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{item.name}</span>
                    {item.urgent && (
                      <Badge variant="destructive" className="h-4 px-1.5 text-[10px]">
                        Urgent
                      </Badge>
                    )}
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{item.department}</span>
                    <span>·</span>
                    <span>{item.type}</span>
                    <span>·</span>
                    <span>{item.detail}</span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground shrink-0">{item.requestedAt}</div>
                <div className="flex shrink-0 gap-1.5">
                  <button className="flex items-center gap-1 rounded-lg bg-emerald-500/10 px-2.5 py-1.5 text-xs font-medium text-emerald-600 transition-colors hover:bg-emerald-500/20">
                    <CheckCircle2 className="h-3 w-3" /> Approve
                  </button>
                  <button className="flex items-center gap-1 rounded-lg bg-rose-500/10 px-2.5 py-1.5 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-500/20">
                    <X className="h-3 w-3" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

// ── 5. Recruitment Dashboard ──────────────────────────────────
function RecruitmentDashboard() {
  return (
    <motion.div {...fadeUp}>
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
                  <CartesianGrid stroke="oklch(0.5 0.02 264 / 0.1)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="stage" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={64} />
                  <Tooltip
                    contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                  />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                    {PIPELINE_STAGES.map((s) => (
                      <Cell key={s.stage} fill={s.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Active jobs + today's interviews */}
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Active Jobs</p>
              <div className="space-y-2">
                {ACTIVE_JOBS.map((job) => (
                  <div
                    key={job.title}
                    className="flex items-center justify-between rounded-lg border border-border bg-background/50 px-3 py-2"
                  >
                    <div>
                      <div className="text-sm font-medium">{job.title}</div>
                      <div className="text-xs text-muted-foreground">{job.dept} · {job.posted}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {job.applicants} applicants
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Interviews Today</p>
              <div className="space-y-2">
                {INTERVIEWS_TODAY.map((iv) => (
                  <div
                    key={iv.candidate}
                    className="flex items-center gap-3 rounded-lg border border-border bg-background/50 px-3 py-2"
                  >
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-indigo-500/10">
                      <CalendarDays className="h-4 w-4 text-indigo-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium">{iv.candidate}</div>
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
    </motion.div>
  );
}

// ── 6. Attendance Analytics ───────────────────────────────────
function AttendanceAnalytics() {
  const COLORS = ["#6366f1", "#f59e0b", "#10b981", "#06b6d4", "#ec4899", "#f97316"];
  return (
    <motion.div {...fadeUp}>
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
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="oklch(0.5 0.02 264 / 0.1)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="present" stroke="#10b981" strokeWidth={2} fill="url(#attGrad)" name="Present" />
                  <Area type="monotone" dataKey="late" stroke="#f59e0b" strokeWidth={1.5} fill="transparent" name="Late" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Dept Attendance %</p>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DEPT_ATTENDANCE} margin={{ top: 6, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid stroke="oklch(0.5 0.02 264 / 0.1)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} domain={[80, 100]} />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} formatter={(v) => [`${v}%`, "Attendance"]} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {DEPT_ATTENDANCE.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// ── 7. Payroll Overview ───────────────────────────────────────
function PayrollOverview({ data }: { data?: ReturnType<typeof useExecutiveDashboardData>["payrollOverview"] }) {
  const statusItems = data?.payrollStatus && data.payrollStatus.length > 0 ? data.payrollStatus : PAYROLL_STATUS;
  const totalCostText = data?.totalCostFormatted ?? "₹0.0L";
  const chartData = data?.monthlySalaryCostChart && data.monthlySalaryCostChart.length > 0
    ? data.monthlySalaryCostChart
    : MONTHLY_PAYROLL;

  return (
    <motion.div {...fadeUp}>
      <Card>
        <SectionHeader title="Payroll Overview" subtitle="Monthly salary cost & status" link="/dashboard/payroll" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Status cards */}
          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Payroll Status</p>
            {statusItems.map((s) => (
              <div
                key={s.label}
                className="flex items-center justify-between rounded-xl border border-border bg-background/50 px-4 py-3"
              >
                <div className={`flex items-center gap-2 text-sm font-medium ${s.color}`}>
                  <span className={`h-2 w-2 rounded-full ${s.bg.replace("/10", "")}`} />
                  {s.label}
                </div>
                <span className="font-display text-xl font-semibold">{s.value}</span>
              </div>
            ))}
            <div className="rounded-xl border border-border bg-background/50 px-4 py-3">
              <div className="text-xs text-muted-foreground">Total Cost This Month</div>
              <div className="mt-1 font-display text-2xl font-bold text-emerald-500">{totalCostText}</div>
            </div>
          </div>

          {/* Monthly chart */}
          <div className="lg:col-span-2">
            <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Monthly Salary Cost (Lakhs ₹)</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 6, right: 8, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="payGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0.5} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="oklch(0.5 0.02 264 / 0.1)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                    formatter={(v) => [`₹${v}L`, "Payroll"]}
                  />
                  <Bar dataKey="cost" radius={[6, 6, 0, 0]} fill="url(#payGrad)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// ── 8. Asset Management Overview ─────────────────────────────
function AssetOverview() {
  return (
    <motion.div {...fadeUp}>
      <Card>
        <SectionHeader title="Asset Management" subtitle="Company asset inventory at a glance" link="/dashboard/assets" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {ASSET_STATS.map((a) => {
            const Icon = ICON_MAP[a.icon] ?? Package;
            return (
              <div
                key={a.label}
                className={`flex flex-col items-center gap-2 rounded-xl border border-border ${a.bg} p-4 text-center`}
              >
                <div className={`grid h-9 w-9 place-items-center rounded-full bg-background/60 ${a.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className={`font-display text-2xl font-bold ${a.color}`}>{a.value}</div>
                <div className="text-[11px] font-medium leading-tight text-muted-foreground">{a.label}</div>
              </div>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
}

// ── 9. Onboarding Center ──────────────────────────────────────
function OnboardingCenter() {
  const total = ONBOARDING_STAGES.reduce((s, o) => s + o.count, 0);
  return (
    <motion.div {...fadeUp}>
      <Card>
        <SectionHeader title="Onboarding Center" subtitle="New employee journey tracking" link="/dashboard/onboarding-checklist" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {ONBOARDING_STAGES.map((s, i) => (
            <div key={s.label} className="rounded-xl border border-border bg-background/50 p-4 text-center">
              <div className={`font-display text-3xl font-bold ${s.textColor}`}>{s.count}</div>
              <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
              <div className="mt-2">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${s.color}`}
                    style={{ width: `${(s.count / total) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

// ── 10. Exit Management ───────────────────────────────────────
function ExitManagement() {
  return (
    <motion.div {...fadeUp}>
      <Card>
        <SectionHeader title="Exit Management" subtitle="Offboarding pipeline status" link="/dashboard/exit" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {EXIT_STAGES.map((s) => {
            const Icon = ICON_MAP[s.icon] ?? Clock;
            return (
              <div key={s.label} className={`rounded-xl border border-border ${s.bg} p-4 text-center`}>
                <div className={`mx-auto mb-2 grid h-9 w-9 place-items-center rounded-full bg-background/60 ${s.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className={`font-display text-2xl font-bold ${s.color}`}>{s.count}</div>
                <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
              </div>
            );
          })}
        </div>
      </Card>
    </motion.div>
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
    <motion.div {...fadeUp}>
      <Card>
        <SectionHeader title="Documents Center" subtitle="Document status and verifications" link="/dashboard/documents" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-4">
          {[
            { label: "Missing/Rejected", value: missing.length, color: "text-rose-500", bg: "bg-rose-500/10" },
            { label: "Pending Review", value: pending.length, color: "text-amber-500", bg: "bg-amber-500/10" },
            { label: "Expiring Soon", value: expiring.length, color: "text-orange-500", bg: "bg-orange-500/10" },
            { label: "Total Documents", value: docs.length, color: "text-blue-500", bg: "bg-blue-500/10" },
          ].map((s) => (
            <div key={s.label} className={`rounded-xl border border-border ${s.bg} p-4 text-center`}>
              <div className={`font-display text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
        <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Recent Uploads</p>
        <div className="space-y-2">
          {recent.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-6 text-center">
              <FileText className="h-8 w-8 text-muted-foreground/40 mb-1" />
              <p className="text-xs text-muted-foreground">No recent documents uploaded</p>
              <Link to="/dashboard/documents" className="mt-2 text-xs font-medium text-primary hover:underline">
                Upload or manage documents &rarr;
              </Link>
            </div>
          ) : (
            recent.map((d: HRDocument) => (
              <div key={d.id} className="flex items-center gap-3 rounded-lg border border-border bg-background/50 px-3 py-2">
                <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{d.name}</div>
                  <div className="text-xs text-muted-foreground">{d.uploadDate || "Recent"}</div>
                </div>
                <Badge
                  variant={
                    d.status === "Verified" ? "default" : d.status === "Pending" ? "secondary" : "destructive"
                  }
                  className="shrink-0 text-[10px]"
                >
                  {d.status}
                </Badge>
              </div>
            ))
          )}
        </div>
      </Card>
    </motion.div>
  );
}

// ── 12. AI Command Center ─────────────────────────────────────
function AICommandCenter() {
  return (
    <motion.div {...fadeUp}>
      <Card>
        <SectionHeader title="AI Command Center" subtitle="Powered by Aurix AI" link="/ai" />
        {/* Metrics row */}
        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {AI_METRICS.map((m) => (
            <div key={m.label} className="rounded-xl border border-border bg-background/50 p-3 text-center">
              <div className={`font-display text-xl font-bold ${m.color}`}>{m.value}</div>
              <div className="mt-0.5 text-[10px] text-muted-foreground">{m.label}</div>
              <div className={`mt-1 text-[10px] font-medium ${m.color}`}>{m.change}</div>
            </div>
          ))}
        </div>

        {/* Feature cards */}
        <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {AI_FEATURES.map((f) => (
            <Link key={f.title} to={f.link as any}>
              <div
                className={`group flex flex-col gap-2 rounded-xl bg-gradient-to-br ${f.color} p-3 transition-all hover:shadow-md hover:-translate-y-0.5`}
              >
                <GeminiIcon className="h-5 w-5 text-white/90 transition-transform group-hover:scale-110" />
                <div className="text-xs font-semibold text-white">{f.title}</div>
                <div className="text-[10px] text-white/70 leading-snug">{f.desc}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent activity */}
        <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Recent AI Activity</p>
        <div className="space-y-2">
          {AI_RECENT.map((r, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border border-border bg-background/50 px-3 py-2">
              <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-violet-500/10">
                <Sparkles className="h-3.5 w-3.5 text-violet-500" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-sm font-medium">{r.action}: </span>
                <span className="text-sm text-muted-foreground">{r.detail}</span>
              </div>
              <div className="shrink-0 text-xs text-muted-foreground">{r.time}</div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

// ── 13. Executive Analytics ───────────────────────────────────
function ExecutiveAnalytics() {
  const COLORS = GENDER_DIVERSITY.map((d) => d.fill);
  return (
    <motion.div {...fadeUp}>
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
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="oklch(0.5 0.02 264 / 0.1)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} domain={[230, 295]} />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 11 }} />
                  <Area type="monotone" dataKey="headcount" stroke="#6366f1" strokeWidth={2} fill="url(#hcGrad)" />
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
                  <CartesianGrid stroke="oklch(0.5 0.02 264 / 0.1)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} domain={[2, 5]} />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 11 }} formatter={(v) => [`${v}%`, "Attrition"]} />
                  <Line type="monotone" dataKey="rate" stroke="#f43f5e" strokeWidth={2} dot={false} />
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
                    {GENDER_DIVERSITY.map((d, i) => (
                      <Cell key={i} fill={d.fill} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 11 }} />
                  <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
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
                  <CartesianGrid stroke="oklch(0.5 0.02 264 / 0.1)" vertical={false} />
                  <XAxis dataKey="band" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 11 }} />
                  <Bar dataKey="employees" radius={[4, 4, 0, 0]} fill="#f59e0b" />
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
                  <CartesianGrid stroke="oklch(0.5 0.02 264 / 0.1)" vertical={false} />
                  <XAxis dataKey="dept" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 11 }} />
                  <Bar dataKey="employees" radius={[4, 4, 0, 0]}>
                    {DEPT_DISTRIBUTION.map((d, i) => (
                      <Cell key={i} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// ── 14. Company Calendar ──────────────────────────────────────
const EVENT_COLOR: Record<string, string> = {
  meeting: "bg-blue-500/15 text-blue-600 border-blue-200",
  holiday: "bg-emerald-500/15 text-emerald-600 border-emerald-200",
  birthday: "bg-pink-500/15 text-pink-600 border-pink-200",
  interview: "bg-violet-500/15 text-violet-600 border-violet-200",
  payroll: "bg-green-500/15 text-green-600 border-green-200",
  event: "bg-amber-500/15 text-amber-600 border-amber-200",
};

function CompanyCalendar() {
  return (
    <motion.div {...fadeUp}>
      <Card>
        <SectionHeader title="Company Calendar" subtitle="Upcoming meetings, holidays & key dates" link="/dashboard/attendance/holidays" />
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {CALENDAR_EVENTS.map((ev) => (
            <div
              key={ev.id}
              className={`flex items-start gap-3 rounded-xl border px-3 py-2.5 ${EVENT_COLOR[ev.type]}`}
            >
              <CalendarDays className="mt-0.5 h-4 w-4 shrink-0" />
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{ev.title}</div>
                <div className="text-xs opacity-75">
                  {new Date(ev.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  {ev.time ? ` · ${ev.time}` : ""}
                </div>
              </div>
              <Badge variant="outline" className="ml-auto shrink-0 capitalize text-[10px] border-current">
                {ev.type}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

// ── 15. Live Activity Feed ────────────────────────────────────
function ActivityFeed() {
  return (
    <motion.div {...fadeUp}>
      <Card>
        <SectionHeader title="Live Activity Feed" subtitle="Real-time HR system activity" link="/dashboard/timeline" />
        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
          {ACTIVITY_FEED.map((a) => {
            const Icon = ICON_MAP[a.icon] ?? Zap;
            return (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-3 rounded-xl border border-border bg-background/50 px-3 py-2.5"
              >
                <div className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg ${a.color}`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm">{a.text}</p>
                  <p className="text-xs text-muted-foreground">{a.user}</p>
                </div>
                <div className="shrink-0 text-xs text-muted-foreground">{a.time}</div>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
}

// ── 16. Smart Notification Center ────────────────────────────
const NOTIF_COLORS = {
  critical: "border-rose-500/30 bg-rose-500/5",
  warn: "border-amber-500/30 bg-amber-500/5",
  info: "border-blue-500/30 bg-blue-500/5",
};
const NOTIF_ICON_COLORS = {
  critical: "text-rose-500",
  warn: "text-amber-500",
  info: "text-blue-500",
};

function NotificationCenter() {
  const [dismissed, setDismissed] = useState<string[]>([]);
  const visible = NOTIFICATIONS.filter((n) => !dismissed.includes(n.id));

  return (
    <motion.div {...fadeUp}>
      <Card>
        <SectionHeader title="Smart Notification Center" subtitle="Alerts, compliance & AI suggestions" />
        <div className="space-y-2">
          {visible.map((n) => (
            <div
              key={n.id}
              className={`flex items-start gap-3 rounded-xl border px-3 py-2.5 ${NOTIF_COLORS[n.severity]}`}
            >
              <AlertTriangle className={`mt-0.5 h-4 w-4 shrink-0 ${NOTIF_ICON_COLORS[n.severity]}`} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{n.title}</span>
                  <Badge variant="outline" className="shrink-0 text-[10px] capitalize">
                    {n.category}
                  </Badge>
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">{n.detail}</div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="text-xs text-muted-foreground">{n.time}</span>
                <button
                  onClick={() => setDismissed((d) => [...d, n.id])}
                  className="rounded-md p-1 text-muted-foreground hover:bg-background/60 hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
          {visible.length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-emerald-500" />
              All caught up! No active notifications.
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

// ── 17. Department Performance Cards ─────────────────────────
function DepartmentPerformance() {
  return (
    <motion.div {...fadeUp}>
      <Card>
        <SectionHeader title="Department Performance" subtitle="Workforce metrics by department" link="/dashboard/departments" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {DEPT_PERFORMANCE.map((d, i) => (
            <motion.div
              key={d.name}
              {...stagger(i)}
              className={`rounded-xl border border-border ${d.bgColor} p-4`}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className={`text-sm font-semibold ${d.color}`}>{d.name}</span>
                <Badge variant="outline" className={`text-[10px] border-current ${d.color}`}>
                  {d.headcount} employees
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Attendance</span>
                  <span className="font-medium">{d.attendance}%</span>
                </div>
                <Progress value={d.attendance} className="h-1.5" />
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Productivity</span>
                  <span className="font-medium">{d.productivity}%</span>
                </div>
                <Progress value={d.productivity} className="h-1.5" />
                <div className="mt-1 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Open Positions</span>
                  <span className={`font-semibold ${d.color}`}>{d.openPositions} open</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

// ── 18. Reports Center ────────────────────────────────────────
const REPORT_CARD_ITEMS = [
  {
    label: "Attendance",
    link: "/dashboard/attendance",
    color: "from-teal-600 to-cyan-600 border-teal-500/20",
    shadow: "hover:shadow-teal-500/20",
  },
  {
    label: "Payroll",
    link: "/dashboard/payroll/reports",
    color: "from-emerald-600 to-green-600 border-emerald-500/20",
    shadow: "hover:shadow-emerald-500/20",
  },
  {
    label: "Recruitment",
    link: "/dashboard/recruitment/reports",
    color: "from-blue-600 to-indigo-600 border-blue-500/20",
    shadow: "hover:shadow-blue-500/20",
    isLong: true,
  },
  {
    label: "Assets",
    link: "/dashboard/assets",
    color: "from-slate-600 to-gray-700 border-slate-500/20",
    shadow: "hover:shadow-slate-500/20",
  },
  {
    label: "Leave",
    link: "/dashboard/leaves",
    color: "from-amber-600 to-orange-600 border-orange-500/20",
    shadow: "hover:shadow-orange-500/20",
  },
  {
    label: "Exit",
    link: "/dashboard/exit",
    color: "from-rose-600 to-red-600 border-rose-500/20",
    shadow: "hover:shadow-rose-500/20",
  },
  {
    label: "Analytics",
    link: "/dashboard/recruitment/analytics",
    color: "from-purple-600 to-violet-600 border-purple-500/20",
    shadow: "hover:shadow-purple-500/20",
  },
];

function ReportsCenter() {
  return (
    <motion.div {...fadeUp}>
      <Card>
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">
              Reports Center
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              One-click report generation
            </p>
          </div>
          <Link
            to="/dashboard/reports"
            className="group inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all duration-200 hover:border-foreground/30 hover:bg-accent hover:text-foreground"
          >
            <span>View More</span>
            <ChevronRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="reports-center-container w-full">
          <div className="reports-center-grid">
            {REPORT_CARD_ITEMS.map((r) => (
              <Link
                key={r.label}
                to={r.link as any}
                className="group flex flex-col justify-center outline-hidden"
              >
                <div
                  className={`flex h-24 w-full flex-col items-center justify-center gap-3.5 rounded-xl border bg-gradient-to-br ${r.color} px-2 py-3 text-center transition-all duration-200 ease-out hover:-translate-y-1 hover:brightness-105 hover:shadow-md ${r.shadow} active:translate-y-0 cursor-pointer select-none`}
                >
                  <Download className="h-5 w-5 shrink-0 text-white/95 transition-transform duration-200 group-hover:scale-110" />
                  <span
                    className={`w-full max-w-full truncate px-1 text-center font-semibold text-white tracking-tight leading-none ${
                      r.isLong ? "text-[11px]" : "text-xs"
                    }`}
                    title={r.label}
                  >
                    {r.label}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// ── 19. Enterprise Widgets ────────────────────────────────────
function WorldClock() {
  const [clocks, setClocks] = useState<{ city: string; time: string; flag: string }[]>([]);
  useEffect(() => {
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
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <Card>
      <SectionHeader title="World Clock" />
      <div className="grid grid-cols-2 gap-2">
        {clocks.map((c) => (
          <div key={c.city} className="flex items-center gap-2 rounded-lg border border-border bg-background/50 px-3 py-2">
            <span className="text-lg">{c.flag}</span>
            <div>
              <div className="text-xs text-muted-foreground">{c.city}</div>
              <div className="font-display text-base font-semibold tabular-nums">{c.time}</div>
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
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-medium">{w.label}</span>
              <span className="font-semibold" style={{ color: w.color }}>
                {w.value}/{w.max}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${(w.value / w.max) * 100}%`, background: w.color }}
              />
            </div>
            <p className="mt-0.5 text-[10px] text-muted-foreground">{w.description}</p>
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
      {/* Live Error Banner if an API had issues */}
      {live.error && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs text-amber-600 dark:text-amber-400">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
            <span>Some live metrics could not be loaded ({live.error}). Showing cached metrics.</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={live.refetch}
            disabled={live.loading}
            className="h-7 border-amber-500/30 bg-transparent text-xs hover:bg-amber-500/20"
          >
            <RefreshCw className={`mr-1.5 h-3 w-3 ${live.loading ? "animate-spin" : ""}`} />
            Retry
          </Button>
        </div>
      )}

      {/* Quick Actions */}
      <WidgetErrorBoundary name="Quick Actions">
        <QuickActions />
      </WidgetErrorBoundary>

      {/* KPI Command Cards */}
      <WidgetErrorBoundary name="KPI Metrics">
        <KpiCards cards={live.kpiCards} />
      </WidgetErrorBoundary>

      {/* Approvals + Activity Feed */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <WidgetErrorBoundary name="HR Approvals">
            <ApprovalCenter />
          </WidgetErrorBoundary>
        </div>
        <WidgetErrorBoundary name="Activity Feed">
          <ActivityFeed />
        </WidgetErrorBoundary>
      </div>

      {/* Notifications + Dept Performance */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <WidgetErrorBoundary name="Notifications">
          <NotificationCenter />
        </WidgetErrorBoundary>
        <WidgetErrorBoundary name="Department Performance">
          <DepartmentPerformance />
        </WidgetErrorBoundary>
      </div>

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
