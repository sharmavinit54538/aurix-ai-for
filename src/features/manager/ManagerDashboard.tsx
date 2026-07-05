// ============================================================
// Aurix HR — Manager Dashboard Component
// Production-ready manager view for team leads and managers.
// ============================================================
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Bot,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Download,
  FileText,
  MapPin,
  Package,
  RefreshCw,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  UserCheck,
  UserPlus,
  Users,
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
import { useAurix } from "@/lib/aurix-store";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AI_TEAM_INSIGHTS,
  ATTENDANCE_RECORDS,
  ATTENDANCE_SUMMARY,
  CANDIDATE_PIPELINE,
  DEPT_DISTRIBUTION,
  HIRING_REQUESTS,
  LEAVE_REQUESTS,
  LOW_PERFORMERS,
  MANAGER_KPI,
  MANAGER_NOTIFICATIONS,
  MANAGER_REPORTS,
  MANAGER_INTERVIEWS,
  PERF_MONTHLY,
  TEAM_ASSETS,
  TEAM_ASSET_SUMMARY,
  TEAM_GOALS,
  TEAM_MEMBERS,
  TOP_PERFORMERS,
  WEEKLY_TEAM_ATTENDANCE,
  type EmployeeStatus,
  type LeaveRequest,
} from "./manager-data";

// ── Animation helpers ─────────────────────────────────────────
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: "easeOut" as const },
};

const stagger = (i: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: "easeOut" as const, delay: i * 0.055 },
});

// ── Shared Components ─────────────────────────────────────────
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
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h2 className="font-display text-lg font-semibold tracking-tight">{title}</h2>
        {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
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

// ── Status badge for employees ────────────────────────────────
const STATUS_CONFIG: Record<EmployeeStatus, { label: string; class: string }> = {
  present: { label: "Present", class: "bg-emerald-500/15 text-emerald-600 border-emerald-200" },
  absent: { label: "Absent", class: "bg-rose-500/15 text-rose-600 border-rose-200" },
  leave: { label: "On Leave", class: "bg-violet-500/15 text-violet-600 border-violet-200" },
  wfh: { label: "WFH", class: "bg-blue-500/15 text-blue-600 border-blue-200" },
  late: { label: "Late", class: "bg-amber-500/15 text-amber-600 border-amber-200" },
};

// ── Live Clock util ───────────────────────────────────────────
function getGreeting() {
  const hour = new Date().getHours();
  return hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
}

// ── Quick Actions ─────────────────────────────────────────────
const QUICK_ACTIONS = [
  { label: "Approve Leave", icon: FileText, link: "/dashboard/leaves", color: "from-amber-600 to-orange-600" },
  { label: "Approve Attendance", icon: CheckCircle2, link: "/dashboard/attendance", color: "from-teal-600 to-cyan-600" },
  { label: "Performance Review", icon: Target, link: "/dashboard/performance", color: "from-violet-600 to-purple-600" },
  { label: "Assign Asset", icon: Package, link: "/dashboard/assets", color: "from-slate-600 to-gray-700" },
  { label: "Schedule Interview", icon: CalendarDays, link: "/dashboard/recruitment/calendar", color: "from-blue-600 to-indigo-600" },
  { label: "Add Team Member", icon: UserPlus, link: "/dashboard/employees", color: "from-emerald-600 to-teal-600" },
];

// ── 1. Header ─────────────────────────────────────────────────
function ManagerHeader({ greeting, userName, companyName }: { greeting: string; userName: string; companyName: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className="grid h-12 w-12 shrink-0 place-items-center rounded-xl shadow-lg"
            style={{ background: "var(--gradient-brand)" }}
          >
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-xl font-semibold tracking-tight">
              {greeting}, {userName} 👋
            </h1>
            <p className="text-sm text-muted-foreground">
              {companyName} · Manager Dashboard · Engineering Team
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <div className="text-sm font-semibold tabular-nums">
              {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </div>
            <div className="text-xs text-muted-foreground">
              {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
          <Link to="/ai/chat-assistant" className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-3 py-2 text-xs font-semibold text-white shadow transition-all hover:shadow-md hover:-translate-y-0.5">
            <Bot className="h-3.5 w-3.5" /> AI Copilot
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {QUICK_ACTIONS.map((a, i) => {
          const Icon = a.icon;
          return (
            <motion.div key={a.label} {...stagger(i)}>
              <Link
                to={a.link as any}
                className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-background/60 p-3 text-center transition-all hover:border-foreground/20 hover:shadow-md hover:-translate-y-0.5"
              >
                <div className={`grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br ${a.color}`}>
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
    </motion.div>
  );
}

// ── 2. KPI Cards ─────────────────────────────────────────────
function KpiCards() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
      {MANAGER_KPI.map((kpi, i) => (
        <motion.div key={kpi.id} {...stagger(i)}>
          <Card className="cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className={`mb-3 inline-flex items-center rounded-lg p-2 ${kpi.bgAccent}`}>
              <Zap className={`h-3.5 w-3.5 ${kpi.accent}`} />
            </div>
            <div className="font-display text-xl font-bold tracking-tight">{kpi.value}</div>
            <div className="mt-0.5 text-[11px] text-muted-foreground">{kpi.label}</div>
            <div
              className={`mt-1.5 flex items-center gap-1 text-[11px] font-medium ${
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
            <div className="mt-2 h-8 w-full opacity-60">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={kpi.spark}>
                  <Line
                    type="monotone"
                    dataKey="v"
                    stroke={
                      kpi.accent.includes("emerald")
                        ? "#10b981"
                        : kpi.accent.includes("indigo")
                        ? "#6366f1"
                        : kpi.accent.includes("amber")
                        ? "#f59e0b"
                        : kpi.accent.includes("teal")
                        ? "#14b8a6"
                        : kpi.accent.includes("rose")
                        ? "#f43f5e"
                        : kpi.accent.includes("violet")
                        ? "#8b5cf6"
                        : kpi.accent.includes("orange")
                        ? "#f97316"
                        : "#06b6d4"
                    }
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

// ── 3. Team Overview ──────────────────────────────────────────
function TeamOverview() {
  const office = TEAM_MEMBERS.filter((m) => m.location === "office").length;
  const remote = TEAM_MEMBERS.filter((m) => m.location === "remote").length;

  return (
    <motion.div {...fadeUp}>
      <Card>
        <SectionHeader
          title="Team Overview"
          subtitle="Current team status and structure"
          link="/dashboard/employees"
        />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Members list */}
          <div className="lg:col-span-2">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Team Members</p>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {TEAM_MEMBERS.map((m) => {
                const cfg = STATUS_CONFIG[m.status];
                return (
                  <div
                    key={m.id}
                    className="flex items-center gap-3 rounded-xl border border-border bg-background/50 px-3 py-2.5 transition-colors hover:bg-accent/30"
                  >
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-semibold text-white">
                      {m.avatar}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{m.name}</span>
                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${cfg.class}`}>
                          {cfg.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{m.role}</span>
                        <span>·</span>
                        <span className="flex items-center gap-0.5">
                          <MapPin className="h-2.5 w-2.5" />
                          {m.location === "office" ? "Office" : "Remote"}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-violet-500">{m.performanceScore}</div>
                      <div className="text-[10px] text-muted-foreground">perf</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right panel */}
          <div className="space-y-4">
            {/* Dept distribution */}
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Department Split</p>
              <div className="h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={DEPT_DISTRIBUTION}
                      cx="50%"
                      cy="50%"
                      innerRadius={32}
                      outerRadius={56}
                      dataKey="count"
                      paddingAngle={4}
                    >
                      {DEPT_DISTRIBUTION.map((d, i) => (
                        <Cell key={i} fill={d.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 11 }}
                    />
                    <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Remote vs Office */}
            <div className="rounded-xl border border-border bg-background/50 p-3">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Work Location</p>
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <div className="font-display text-2xl font-bold text-indigo-500">{office}</div>
                  <div className="text-xs text-muted-foreground">In Office</div>
                </div>
                <div className="flex-1">
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-indigo-500"
                      style={{ width: `${(office / TEAM_MEMBERS.length) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-display text-2xl font-bold text-violet-500">{remote}</div>
                  <div className="text-xs text-muted-foreground">Remote</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// ── 4. Attendance Center ──────────────────────────────────────
function AttendanceCenter() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <motion.div {...fadeUp}>
      <Card>
        <SectionHeader title="Attendance Center" subtitle="Today's team attendance" link="/dashboard/attendance" />

        {/* Summary pills */}
        <div className="mb-4 flex flex-wrap gap-2">
          {ATTENDANCE_SUMMARY.map((s) => (
            <div
              key={s.label}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2 ${s.bg} border-border`}
            >
              <span className={`font-display text-xl font-bold ${s.color}`}>{s.count}</span>
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Weekly chart */}
        <div className="mb-4 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={WEEKLY_TEAM_ATTENDANCE} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="oklch(0.5 0.02 264 / 0.1)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="present" name="Present" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
              <Bar dataKey="wfh" name="WFH" stackId="a" fill="#6366f1" />
              <Bar dataKey="late" name="Late" stackId="a" fill="#f59e0b" />
              <Bar dataKey="absent" name="Absent" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Records needing action */}
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Attendance Actions Required
        </p>
        <div className="space-y-2">
          {ATTENDANCE_RECORDS.filter((r) => r.status === "late" || r.status === "absent" || r.regularisationRequired).map((r) => (
            <div
              key={r.id}
              className="flex items-center gap-3 rounded-xl border border-border bg-background/50 px-3 py-2.5"
            >
              <div
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg text-xs font-semibold ${
                  r.status === "absent"
                    ? "bg-rose-500/10 text-rose-500"
                    : r.status === "late"
                    ? "bg-amber-500/10 text-amber-500"
                    : "bg-blue-500/10 text-blue-500"
                }`}
              >
                {r.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{r.name}</span>
                  <Badge
                    variant="outline"
                    className={`text-[10px] capitalize ${
                      r.status === "absent"
                        ? "border-rose-200 text-rose-600"
                        : r.status === "late"
                        ? "border-amber-200 text-amber-600"
                        : "border-blue-200 text-blue-600"
                    }`}
                  >
                    {r.status}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {r.date} {r.checkIn ? `· Check-in: ${r.checkIn}` : "· No check-in recorded"}
                  {r.overtime ? ` · OT: ${r.overtime}` : ""}
                </div>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <button className="rounded-lg bg-emerald-500/10 px-2.5 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-500/20 transition-colors">
                  Approve
                </button>
                <button className="rounded-lg bg-blue-500/10 px-2.5 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-500/20 transition-colors">
                  Correct
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

// ── 5. Leave Center ───────────────────────────────────────────
type LeaveTab = "Pending" | "Approved" | "Upcoming";

function LeaveCenter() {
  const [tab, setTab] = useState<LeaveTab>("Pending");

  const filtered: Record<LeaveTab, LeaveRequest[]> = {
    Pending: LEAVE_REQUESTS.filter((l) => l.status === "pending"),
    Approved: LEAVE_REQUESTS.filter((l) => l.status === "approved"),
    Upcoming: LEAVE_REQUESTS.filter(
      (l) => l.status === "approved" && new Date(l.from) > new Date()
    ),
  };

  return (
    <motion.div {...fadeUp}>
      <Card>
        <SectionHeader title="Leave Center" subtitle="Team leave requests and approvals" link="/dashboard/leaves" />
        <div className="mb-4 flex gap-2">
          {(["Pending", "Approved", "Upcoming"] as LeaveTab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                tab === t
                  ? "bg-foreground text-background"
                  : "border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
              <span
                className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  tab === t ? "bg-background/20 text-background" : "bg-muted text-muted-foreground"
                }`}
              >
                {filtered[t].length}
              </span>
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.18 }}
            className="space-y-2"
          >
            {filtered[tab].length === 0 && (
              <div className="py-8 text-center text-sm text-muted-foreground">
                <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-emerald-500" />
                No {tab.toLowerCase()} leave requests.
              </div>
            )}
            {filtered[tab].map((req) => (
              <div
                key={req.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-background/50 px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{req.name}</span>
                    {req.urgent && (
                      <Badge variant="destructive" className="h-4 px-1.5 text-[10px]">
                        Urgent
                      </Badge>
                    )}
                    <Badge variant="secondary" className="text-[10px]">{req.type}</Badge>
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {req.from} → {req.to} · {req.days} day{req.days !== 1 ? "s" : ""} · "{req.reason}"
                  </div>
                </div>
                <div className="shrink-0 text-xs text-muted-foreground">{req.requestedAt}</div>
                {tab === "Pending" && (
                  <div className="flex shrink-0 gap-1.5">
                    <button className="flex items-center gap-1 rounded-lg bg-emerald-500/10 px-2.5 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-500/20 transition-colors">
                      <CheckCircle2 className="h-3 w-3" /> Approve
                    </button>
                    <button className="flex items-center gap-1 rounded-lg bg-rose-500/10 px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-500/20 transition-colors">
                      <X className="h-3 w-3" /> Reject
                    </button>
                  </div>
                )}
                {tab !== "Pending" && (
                  <Badge
                    variant={req.status === "approved" ? "default" : "destructive"}
                    className="shrink-0 text-[10px] capitalize"
                  >
                    {req.status}
                  </Badge>
                )}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

// ── 6. Performance Center ─────────────────────────────────────
const PRIORITY_COLORS = {
  high: "text-rose-500",
  medium: "text-amber-500",
  low: "text-blue-500",
};

function PerformanceCenter() {
  return (
    <motion.div {...fadeUp}>
      <Card>
        <SectionHeader title="Performance Center" subtitle="Team KPIs, goals & reviews" link="/dashboard/performance" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Monthly performance trend */}
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Team Score Trend
            </p>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={PERF_MONTHLY} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="oklch(0.5 0.02 264 / 0.1)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} domain={[70, 100]} />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={2} fill="url(#perfGrad)" name="Score" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Goal Progress */}
          <div className="lg:col-span-2">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Team Goal Progress
            </p>
            <div className="space-y-3">
              {TEAM_GOALS.map((g) => (
                <div key={g.goal}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-medium truncate">{g.goal}</span>
                      <span className={`shrink-0 font-semibold text-[10px] uppercase ${PRIORITY_COLORS[g.priority]}`}>
                        {g.priority}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center gap-2 ml-2">
                      <span className="text-muted-foreground">{g.owner.split(" ")[0]}</span>
                      <span className="font-semibold text-violet-500">{g.progress}%</span>
                      <span className="text-muted-foreground">· {g.dueDate}</span>
                    </div>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        g.progress >= 80 ? "bg-emerald-500" : g.progress >= 50 ? "bg-amber-500" : "bg-rose-500"
                      }`}
                      style={{ width: `${g.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top / Low Performers */}
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              🏆 Top Performers
            </p>
            <div className="space-y-2">
              {TOP_PERFORMERS.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3 rounded-xl border border-border bg-background/50 px-3 py-2">
                  <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-500/10 text-xs font-bold text-emerald-500">
                    {i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.role}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-emerald-500">{p.score}</div>
                    <div className="text-[10px] text-emerald-500">{p.trend}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              ⚠️ Needs Attention
            </p>
            <div className="space-y-2">
              {LOW_PERFORMERS.map((p) => (
                <div key={p.name} className="rounded-xl border border-amber-200 bg-amber-500/5 px-3 py-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.role}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-amber-500">{p.score}</div>
                      <div className="text-[10px] text-rose-500">{p.trend}</div>
                    </div>
                  </div>
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs text-amber-700">
                    <Zap className="h-3 w-3" /> {p.action}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// ── 7. Recruitment ────────────────────────────────────────────
function RecruitmentSection() {
  const PRIORITY_BG: Record<string, string> = {
    high: "bg-rose-500/10 text-rose-600",
    medium: "bg-amber-500/10 text-amber-600",
    low: "bg-blue-500/10 text-blue-600",
  };

  return (
    <motion.div {...fadeUp}>
      <Card>
        <SectionHeader title="Recruitment" subtitle="Team hiring requests and pipeline" link="/dashboard/recruitment" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Hiring requests */}
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Hiring Requests</p>
            <div className="space-y-2">
              {HIRING_REQUESTS.map((r) => (
                <div key={r.id} className="flex items-center gap-3 rounded-xl border border-border bg-background/50 px-3 py-2.5">
                  <Briefcase className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">{r.role}</div>
                    <div className="text-xs text-muted-foreground">{r.department} · Target: {r.targetDate}</div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${PRIORITY_BG[r.priority]}`}>
                      {r.priority}
                    </span>
                    <Badge
                      variant={r.status === "interviewing" ? "default" : "secondary"}
                      className="text-[10px] capitalize"
                    >
                      {r.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            {/* Candidate pipeline */}
            <p className="mb-2 mt-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Candidate Pipeline
            </p>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CANDIDATE_PIPELINE} layout="vertical" margin={{ left: 0, right: 16, top: 0, bottom: 0 }}>
                  <CartesianGrid stroke="oklch(0.5 0.02 264 / 0.1)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="stage" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={64} />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]} fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Upcoming interviews */}
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Upcoming Interviews
            </p>
            <div className="space-y-2">
              {MANAGER_INTERVIEWS.map((iv) => (
                <div key={iv.candidate} className="flex items-center gap-3 rounded-xl border border-border bg-background/50 px-3 py-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-indigo-500/10">
                    <CalendarDays className="h-4 w-4 text-indigo-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">{iv.candidate}</div>
                    <div className="text-xs text-muted-foreground">{iv.role} · {iv.type}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-medium">{iv.time}</div>
                    <Badge variant="outline" className="mt-0.5 text-[10px]">{iv.stage}</Badge>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              <Link
                to="/dashboard/recruitment/calendar"
                className="flex-1 rounded-xl border border-border bg-background/50 py-2.5 text-center text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                View Calendar
              </Link>
              <Link
                to="/dashboard/recruitment/candidates"
                className="flex-1 rounded-xl border border-border bg-background/50 py-2.5 text-center text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                All Candidates
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// ── 8. Assets Section ─────────────────────────────────────────
function AssetsSection() {
  const STATUS_COLORS: Record<string, string> = {
    assigned: "bg-blue-500/10 text-blue-600",
    "pending-return": "bg-amber-500/10 text-amber-600",
    damaged: "bg-rose-500/10 text-rose-600",
    returned: "bg-emerald-500/10 text-emerald-600",
  };

  return (
    <motion.div {...fadeUp}>
      <Card>
        <SectionHeader title="Team Assets" subtitle="Asset inventory for your team" link="/dashboard/assets" />

        {/* Summary */}
        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {TEAM_ASSET_SUMMARY.map((a) => (
            <div key={a.label} className={`rounded-xl border border-border ${a.bg} p-3 text-center`}>
              <div className={`font-display text-2xl font-bold ${a.color}`}>{a.count}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">{a.label}</div>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          {TEAM_ASSETS.map((a) => (
            <div key={a.id} className="flex items-center gap-3 rounded-xl border border-border bg-background/50 px-3 py-2.5">
              <Package className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium">{a.name}</div>
                <div className="text-xs text-muted-foreground">
                  {a.assignedTo} · Tag: {a.tag} · Since: {a.since}
                </div>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-medium capitalize ${
                  STATUS_COLORS[a.status] ?? "bg-muted text-muted-foreground"
                }`}
              >
                {a.status.replace("-", " ")}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

// ── 9. AI Insights ────────────────────────────────────────────
const LEVEL_BADGE: Record<string, string> = {
  high: "border-emerald-200 text-emerald-600",
  moderate: "border-amber-200 text-amber-600",
  low: "border-rose-200 text-rose-600",
  positive: "border-blue-200 text-blue-600",
};

function AIInsights() {
  return (
    <motion.div {...fadeUp}>
      <Card>
        <SectionHeader title="AI Insights" subtitle="AI-powered team intelligence" link="/ai/workforce-insights" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {AI_TEAM_INSIGHTS.map((insight, i) => (
            <motion.div
              key={insight.category}
              {...stagger(i)}
              className={`flex flex-col gap-3 rounded-xl bg-gradient-to-br ${insight.color} p-4`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-white/80" />
                  <span className="text-xs font-semibold text-white">{insight.category}</span>
                </div>
                <Badge variant="outline" className={`text-[10px] capitalize border ${LEVEL_BADGE[insight.level]} bg-white/10`}>
                  {insight.level}
                </Badge>
              </div>
              <div className="text-xs text-white/80 leading-relaxed">{insight.detail}</div>
              <div className="mt-auto rounded-lg bg-black/20 px-3 py-2 text-[11px] text-white/90">
                💡 {insight.recommendation}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60">AI Score</span>
                <span className="font-display text-lg font-bold text-white">{insight.score}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

// ── 10. Notifications + Reports ───────────────────────────────
function NotificationsSection() {
  const [dismissed, setDismissed] = useState<string[]>([]);
  const visible = MANAGER_NOTIFICATIONS.filter((n) => !dismissed.includes(n.id));

  const TYPE_ICON: Record<string, React.ElementType> = {
    approval: CheckCircle2,
    joiner: UserPlus,
    exit: UserCheck,
    document: FileText,
    alert: AlertTriangle,
  };

  const TYPE_COLOR: Record<string, string> = {
    approval: "bg-amber-500/10 text-amber-500",
    joiner: "bg-emerald-500/10 text-emerald-500",
    exit: "bg-rose-500/10 text-rose-500",
    document: "bg-blue-500/10 text-blue-500",
    alert: "bg-violet-500/10 text-violet-500",
  };

  return (
    <motion.div {...fadeUp}>
      <Card>
        <SectionHeader title="Notifications" subtitle="Pending actions and alerts" />
        <div className="space-y-2">
          {visible.map((n) => {
            const Icon = TYPE_ICON[n.type] ?? AlertTriangle;
            return (
              <div
                key={n.id}
                className={`flex items-start gap-3 rounded-xl border border-border px-3 py-2.5 ${
                  n.urgent ? "bg-rose-500/5 border-rose-200" : "bg-background/50"
                }`}
              >
                <div className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg ${TYPE_COLOR[n.type]}`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{n.title}</span>
                    {n.urgent && (
                      <Badge variant="destructive" className="h-4 px-1.5 text-[10px]">Urgent</Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">{n.detail}</div>
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
            );
          })}
          {visible.length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-emerald-500" />
              All caught up!
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

function ReportsSection() {
  return (
    <motion.div {...fadeUp}>
      <Card>
        <SectionHeader title="Reports" subtitle="Generate team reports instantly" link="/dashboard/reports" />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {MANAGER_REPORTS.map((r) => (
            <Link key={r.label} to={r.link as any}>
              <div
                className={`group flex flex-col items-center gap-2.5 rounded-xl bg-gradient-to-br ${r.color} p-4 text-center transition-all hover:shadow-md hover:-translate-y-0.5`}
              >
                <Download className="h-5 w-5 text-white/90" />
                <span className="text-xs font-semibold text-white leading-tight">{r.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

// ── Main Manager Dashboard ────────────────────────────────────
export function ManagerDashboard() {
  const ws = useAurix();
  const firstName = ws.user?.fullName?.split(" ")[0] ?? "Manager";
  const companyName = ws.company?.name ?? "Aurix HR";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6">
      {/* Header */}
      <ManagerHeader greeting={greeting} userName={firstName} companyName={companyName} />

      {/* KPI Cards */}
      <KpiCards />

      {/* Team Overview + Notifications */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TeamOverview />
        </div>
        <NotificationsSection />
      </div>

      {/* Attendance + Leave */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AttendanceCenter />
        <LeaveCenter />
      </div>

      {/* Performance */}
      <PerformanceCenter />

      {/* Recruitment + Assets */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecruitmentSection />
        <AssetsSection />
      </div>

      {/* AI Insights */}
      <AIInsights />

      {/* Reports */}
      <ReportsSection />
    </div>
  );
}
