// ============================================================
// Aurix HR — Employee Dashboard Component
// Self-service portal for individual employees.
// ============================================================
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Bell,
  Bot,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  FileText,
  Info,
  Package,
  RefreshCw,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  UserCircle,
  X,
  Zap,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
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
  COMPANY_EVENTS,
  EMP_KPI,
  EMP_NOTIFICATIONS,
  LEAVE_QUOTA,
  MY_ASSETS,
  MY_ATTENDANCE,
  MY_ATTENDANCE_TREND,
  MY_DOCUMENTS,
  MY_GOALS,
  MY_LEAVES,
  MY_PAYSLIPS,
} from "./employee-data";

// ── Animation helpers ─────────────────────────────────────────
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: "easeOut" as const },
};

const stagger = (i: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: "easeOut" as const, delay: i * 0.06 },
});

// ── Shared card ───────────────────────────────────────────────
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-border bg-card/60 backdrop-blur-xl shadow-sm p-5 ${className}`}>
      {children}
    </div>
  );
}

function SectionHeader({
  title,
  subtitle,
  link,
  linkLabel = "View More",
}: {
  title: string;
  subtitle?: string;
  link?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h2 className="font-display text-lg font-semibold tracking-tight">{title}</h2>
        {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {link && (
        <Link
          to={link as any}
          className="flex shrink-0 items-center gap-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
        >
          {linkLabel} <ChevronRight className="h-3 w-3" />
        </Link>
      )}
    </div>
  );
}

// ── Status helpers ────────────────────────────────────────────
const ATTENDANCE_STATUS: Record<string, string> = {
  present: "bg-emerald-500/15 text-emerald-600 border-emerald-200",
  late: "bg-amber-500/15 text-amber-600 border-amber-200",
  leave: "bg-violet-500/15 text-violet-600 border-violet-200",
  wfh: "bg-blue-500/15 text-blue-600 border-blue-200",
  absent: "bg-rose-500/15 text-rose-600 border-rose-200",
};

const NOTIF_ICON: Record<string, React.ElementType> = {
  success: CheckCircle2,
  warn: AlertTriangle,
  info: Info,
};

const NOTIF_COLOR: Record<string, string> = {
  success: "bg-emerald-500/10 text-emerald-500",
  warn: "bg-amber-500/10 text-amber-500",
  info: "bg-blue-500/10 text-blue-500",
};

const EVENT_COLOR: Record<string, string> = {
  meeting: "bg-blue-500/15 text-blue-600 border-blue-200",
  holiday: "bg-emerald-500/15 text-emerald-600 border-emerald-200",
  event: "bg-amber-500/15 text-amber-600 border-amber-200",
};

// ── Quick Actions ─────────────────────────────────────────────
const EMP_QUICK_ACTIONS = [
  { label: "Apply Leave", icon: FileText, link: "/dashboard/leaves", color: "from-amber-600 to-orange-600" },
  { label: "View Payslip", icon: Download, link: "/dashboard/payroll/payslips", color: "from-green-600 to-emerald-600" },
  { label: "My Attendance", icon: Clock, link: "/dashboard/attendance", color: "from-teal-600 to-cyan-600" },
  { label: "My Documents", icon: FileText, link: "/dashboard/documents", color: "from-blue-600 to-indigo-600" },
  { label: "My Assets", icon: Package, link: "/dashboard/assets", color: "from-slate-600 to-gray-700" },
  { label: "AI Assistant", icon: Bot, link: "/ai/chat-assistant", color: "from-violet-600 to-purple-600" },
];

// ── 1. Employee Header ────────────────────────────────────────
function EmployeeHeader({ firstName, companyName }: { firstName: string; companyName: string }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

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
            <UserCircle className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-xl font-semibold tracking-tight">
              {greeting}, {firstName} 👋
            </h1>
            <p className="text-sm text-muted-foreground">
              {companyName} · Employee Self-Service Portal
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
          <Link
            to="/ai/chat-assistant"
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-3 py-2 text-xs font-semibold text-white shadow transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            <Sparkles className="h-3.5 w-3.5" /> AI Assistant
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {EMP_QUICK_ACTIONS.map((a, i) => {
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

// ── 2. KPI Cards ──────────────────────────────────────────────
function EmployeeKpiCards() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {EMP_KPI.map((kpi, i) => (
        <motion.div key={kpi.id} {...stagger(i)}>
          <Card className="cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className={`mb-3 inline-flex items-center rounded-lg p-2 ${kpi.bgAccent}`}>
              <Zap className={`h-3.5 w-3.5 ${kpi.accent}`} />
            </div>
            <div className="font-display text-xl font-bold tracking-tight">{kpi.value}</div>
            <div className="mt-0.5 text-[11px] text-muted-foreground">{kpi.label}</div>
            <div
              className={`mt-1.5 flex items-center gap-1 text-[11px] font-medium ${
                kpi.changeType === "up" ? "text-emerald-500" : kpi.changeType === "down" ? "text-rose-500" : "text-muted-foreground"
              }`}
            >
              {kpi.changeType === "up" ? <TrendingUp className="h-3 w-3" /> : kpi.changeType === "down" ? <TrendingDown className="h-3 w-3" /> : null}
              {kpi.change}
            </div>
            <div className="mt-2 h-8 w-full opacity-60">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={kpi.spark}>
                  <Line
                    type="monotone"
                    dataKey="v"
                    stroke={
                      kpi.accent.includes("emerald") ? "#10b981"
                        : kpi.accent.includes("blue") ? "#3b82f6"
                        : kpi.accent.includes("violet") ? "#8b5cf6"
                        : kpi.accent.includes("amber") ? "#f59e0b"
                        : kpi.accent.includes("green") ? "#22c55e"
                        : "#f43f5e"
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

// ── 3. My Attendance ──────────────────────────────────────────
function MyAttendance() {
  return (
    <motion.div {...fadeUp}>
      <Card>
        <SectionHeader title="My Attendance" subtitle="Recent check-in / check-out log" link="/dashboard/attendance" />

        {/* Trend chart */}
        <div className="mb-4 h-36">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MY_ATTENDANCE_TREND} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="oklch(0.5 0.02 264 / 0.1)" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} domain={[0, 5]} />
              <Tooltip
                contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                formatter={(v) => [`${v} days`, "Days Present"]}
              />
              <Bar dataKey="days" radius={[4, 4, 0, 0]} fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Log */}
        <div className="space-y-2">
          {MY_ATTENDANCE.map((a) => (
            <div key={a.date} className="flex items-center gap-3 rounded-xl border border-border bg-background/50 px-3 py-2">
              <div className="w-20 shrink-0 text-xs text-muted-foreground">
                {new Date(a.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
              </div>
              <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-medium capitalize ${ATTENDANCE_STATUS[a.status]}`}>
                {a.status === "wfh" ? "WFH" : a.status}
              </span>
              <div className="flex-1 text-xs text-muted-foreground">
                {a.checkIn ? `${a.checkIn} → ${a.checkOut || "–"}` : "Not recorded"}
              </div>
              <div className="shrink-0 text-xs font-medium">{a.hours}</div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

// ── 4. My Leaves ──────────────────────────────────────────────
function MyLeaves() {
  const [tab, setTab] = useState<"history" | "balance">("history");

  return (
    <motion.div {...fadeUp}>
      <Card>
        <SectionHeader title="My Leaves" subtitle="Leave history and balance" link="/dashboard/leaves" />
        <div className="mb-4 flex gap-2">
          {(["history", "balance"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                tab === t ? "bg-foreground text-background" : "border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === "history" && (
            <motion.div key="history" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.18 }} className="space-y-2">
              {MY_LEAVES.map((l) => (
                <div key={l.id} className="flex items-center gap-3 rounded-xl border border-border bg-background/50 px-3 py-2.5">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{l.type}</span>
                      <Badge
                        variant={l.status === "approved" ? "default" : l.status === "pending" ? "secondary" : "destructive"}
                        className="text-[10px] capitalize"
                      >
                        {l.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {l.from} → {l.to} · {l.days} day{l.days !== 1 ? "s" : ""} · Applied {l.appliedOn}
                    </div>
                    {l.approvedBy && <div className="text-xs text-emerald-600">Approved by {l.approvedBy}</div>}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
          {tab === "balance" && (
            <motion.div key="balance" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.18 }} className="space-y-3">
              {LEAVE_QUOTA.map((q) => (
                <div key={q.type}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium">{q.type}</span>
                    <span className="text-muted-foreground">
                      <span className="font-semibold text-foreground">{q.remaining}</span>/{q.total} remaining
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all duration-700"
                      style={{ width: `${(q.remaining / q.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <Link
          to="/dashboard/leaves"
          className="mt-4 flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-border py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
        >
          <FileText className="h-3.5 w-3.5" /> Apply New Leave
        </Link>
      </Card>
    </motion.div>
  );
}

// ── 5. Performance & Goals ────────────────────────────────────
function MyPerformance() {
  return (
    <motion.div {...fadeUp}>
      <Card>
        <SectionHeader title="My Performance" subtitle="Goals and self-assessment" link="/dashboard/performance" />
        <div className="mb-4 flex items-center gap-4 rounded-xl border border-border bg-background/50 px-4 py-3">
          <div className="text-center">
            <div className="font-display text-3xl font-bold text-violet-500">87</div>
            <div className="text-xs text-muted-foreground">Score</div>
          </div>
          <div className="flex-1">
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-muted-foreground">Performance Rating</span>
              <span className="font-semibold text-violet-500">87/100</span>
            </div>
            <Progress value={87} className="h-2" />
            <p className="mt-1 text-[11px] text-emerald-600">+5pts from last quarter · Excellent trajectory</p>
          </div>
        </div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">My Goals</p>
        <div className="space-y-3">
          {MY_GOALS.map((g) => (
            <div key={g.goal}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-medium">{g.goal}</span>
                <span className="text-muted-foreground">Due {g.due} · <span className="font-semibold text-foreground">{g.progress}%</span></span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${g.progress >= 70 ? "bg-emerald-500" : g.progress >= 40 ? "bg-amber-500" : "bg-rose-500"}`}
                  style={{ width: `${g.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

// ── 6. Payslips ───────────────────────────────────────────────
function MyPayslips() {
  return (
    <motion.div {...fadeUp}>
      <Card>
        <SectionHeader title="My Payslips" subtitle="Salary statements" link="/dashboard/payroll/payslips" />
        <div className="space-y-2">
          {MY_PAYSLIPS.map((p) => (
            <div key={p.month} className="flex items-center gap-3 rounded-xl border border-border bg-background/50 px-3 py-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-green-500/10">
                <Download className="h-4 w-4 text-green-500" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium">{p.month}</div>
                <div className="text-xs text-muted-foreground">Gross: {p.gross} · Paid on {p.date}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-emerald-500">{p.net}</div>
                <Badge variant="default" className="text-[10px]">Paid</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

// ── 7. My Documents ───────────────────────────────────────────
function MyDocuments() {
  const DOC_STATUS_STYLE: Record<string, string> = {
    verified: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
    pending: "bg-amber-500/10 text-amber-600 border-amber-200",
    rejected: "bg-rose-500/10 text-rose-600 border-rose-200",
  };

  return (
    <motion.div {...fadeUp}>
      <Card>
        <SectionHeader title="My Documents" subtitle="Document verification status" link="/dashboard/documents" />
        <div className="space-y-2">
          {MY_DOCUMENTS.map((d) => (
            <div key={d.name} className="flex items-center gap-3 rounded-xl border border-border bg-background/50 px-3 py-2.5">
              <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium">{d.name}</div>
                {d.dueDate && <div className="text-xs text-amber-600">{d.dueDate}</div>}
              </div>
              <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-medium capitalize ${DOC_STATUS_STYLE[d.status]}`}>
                {d.status}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

// ── 8. My Assets ─────────────────────────────────────────────
function MyAssets() {
  return (
    <motion.div {...fadeUp}>
      <Card>
        <SectionHeader title="My Assets" subtitle="Assigned company equipment" link="/dashboard/assets" />
        <div className="space-y-2">
          {MY_ASSETS.map((a) => (
            <div key={a.tag} className="flex items-center gap-3 rounded-xl border border-border bg-background/50 px-3 py-2.5">
              <Package className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium">{a.name}</div>
                <div className="text-xs text-muted-foreground">Tag: {a.tag} · Since {a.assigned}</div>
              </div>
              <Badge variant="secondary" className="text-[10px]">{a.status}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

// ── 9. Company Calendar ───────────────────────────────────────
function EmployeeCalendar() {
  return (
    <motion.div {...fadeUp}>
      <Card>
        <SectionHeader title="Company Calendar" subtitle="Upcoming events and holidays" link="/dashboard/attendance/holidays" />
        <div className="space-y-2">
          {COMPANY_EVENTS.map((ev, i) => (
            <div key={i} className={`flex items-start gap-3 rounded-xl border px-3 py-2.5 ${EVENT_COLOR[ev.type] ?? "bg-muted/40 border-border"}`}>
              <CalendarDays className="mt-0.5 h-4 w-4 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium">{ev.title}</div>
                <div className="text-xs opacity-70">
                  {new Date(ev.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  {ev.time ? ` · ${ev.time}` : ""}
                </div>
              </div>
              <Badge variant="outline" className="shrink-0 capitalize text-[10px] border-current">{ev.type}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

// ── 10. Notifications ─────────────────────────────────────────
function EmployeeNotifications() {
  const [dismissed, setDismissed] = useState<string[]>([]);
  const visible = EMP_NOTIFICATIONS.filter((n) => !dismissed.includes(n.id));

  return (
    <motion.div {...fadeUp}>
      <Card>
        <SectionHeader title="Notifications" />
        <div className="space-y-2">
          {visible.map((n) => {
            const Icon = NOTIF_ICON[n.type] ?? Bell;
            return (
              <div key={n.id} className="flex items-start gap-3 rounded-xl border border-border bg-background/50 px-3 py-2.5">
                <div className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg ${NOTIF_COLOR[n.type]}`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">{n.title}</div>
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
            <div className="py-6 text-center text-sm text-muted-foreground">
              <CheckCircle2 className="mx-auto mb-2 h-7 w-7 text-emerald-500" />
              All caught up!
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

// ── Main Employee Dashboard ───────────────────────────────────
export function EmployeeDashboard() {
  const ws = useAurix();
  const firstName = ws.user?.fullName?.split(" ")[0] ?? "there";
  const companyName = ws.company?.name ?? "Aurix HR";

  return (
    <div className="space-y-6">
      {/* Header */}
      <EmployeeHeader firstName={firstName} companyName={companyName} />

      {/* KPI Cards */}
      <EmployeeKpiCards />

      {/* Attendance + Leaves */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <MyAttendance />
        <MyLeaves />
      </div>
      {/* Performance + Payslips */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <MyPerformance />
        <MyPayslips />
      </div>

      {/* Documents + Assets */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <MyDocuments />
        <MyAssets />
      </div>

      {/* Calendar + Notifications */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <EmployeeCalendar />
        <EmployeeNotifications />
      </div>
    </div>
  );
}
