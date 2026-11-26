import { statusBadgeClass } from "@/lib/status-styles";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
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
  Sparkles,
  TrendingDown,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { useNotifications, useArchive } from "@/features/notifications";
import { formatRelativeTime } from "@/lib/notification-utils";
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
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { EmpKpi } from "./types";

const EMP_KPI: EmpKpi[] = [];
const MY_ATTENDANCE_TREND: any[] = [];
const MY_ATTENDANCE: any[] = [];
const MY_LEAVES: any[] = [];
const LEAVE_QUOTA: any[] = [];
const MY_GOALS: any[] = [];
const MY_PAYSLIPS: any[] = [];
const MY_DOCUMENTS: any[] = [];
const COMPANY_EVENTS: any[] = [];

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

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-border bg-card shadow-xs p-5 ${className}`}
    >
      {children}
    </div>
  );
}

function SectionHeader({
  title,
  subtitle,
  link,
  linkLabel = "View more",
}: {
  title: string;
  subtitle?: string;
  link?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h2 className="font-display text-base sm:text-lg font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {link && (
        <Link
          to={link as any}
          className="inline-flex min-h-8 shrink-0 items-center gap-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground/80 transition-colors hover:border-primary/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {linkLabel} <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}

const ATTENDANCE_STATUS: Record<string, string> = {
  present: statusBadgeClass("approved"),
  late: statusBadgeClass("warning"),
  leave: statusBadgeClass("info"),
  wfh: statusBadgeClass("info"),
  absent: statusBadgeClass("critical"),
};

export const NOTIF_ICON: Record<string, React.ElementType> = {
  success: CheckCircle2,
  warn: AlertTriangle,
  info: Info,
};

export const NOTIF_COLOR: Record<string, string> = {
  success: "bg-primary/10 text-primary",
  warn: "bg-muted text-foreground",
  info: "bg-primary/10 text-primary",
};

const EVENT_COLOR: Record<string, string> = {
  meeting: statusBadgeClass("info"),
  holiday: statusBadgeClass("approved"),
  event: statusBadgeClass("warning"),
};

const EMP_QUICK_ACTIONS = [
  { label: "My Attendance", icon: Clock, link: "/dashboard/attendance" },
  { label: "Apply Leave", icon: FileText, link: "/dashboard/leaves" },
  { label: "View Payslip", icon: Download, link: "/dashboard/payroll/payslips" },
  { label: "My Documents", icon: FileText, link: "/dashboard/documents" },
  { label: "My Assets", icon: Package, link: "/dashboard/assets" },
  { label: "AI Assistant", icon: Bot, link: "/ai/chat-assistant" },
];

function QuickActionBar() {
  return (
    <section aria-label="Daily tasks and quick actions">
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
        {EMP_QUICK_ACTIONS.map((a) => {
          const Icon = a.icon;
          return (
            <Link
              key={a.label}
              to={a.link as any}
              className="group flex min-h-[84px] flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card p-3.5 text-center shadow-xs transition-colors hover:border-primary/35 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
              </div>
              <span className="text-[13px] sm:text-sm font-medium leading-snug text-foreground break-words">
                {a.label}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function EmployeeKpiCards() {
  const { data } = useQuery({
    queryKey: ["employee-portal-kpis"],
    queryFn: () => api.get<any>("/employees/me/kpis"),
  });

  const kpis: EmpKpi[] = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data?.items)
      ? data.items
      : EMP_KPI;

  if (kpis.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {kpis.map((kpi) => (
        <Card key={kpi.id} className="transition-colors hover:border-primary/35">
          <div className="mb-3 inline-flex items-center rounded-lg bg-primary/10 p-2 text-primary">
            <Zap className="h-3.5 w-3.5" />
          </div>
          <div className="font-display text-xl font-bold tracking-tight tabular-nums text-foreground">
            {kpi.value}
          </div>
          <div className="mt-0.5 text-[13px] font-medium text-muted-foreground leading-snug">
            {kpi.label}
          </div>
          <div
            className={`mt-1.5 flex items-center gap-1 text-xs font-medium ${
              kpi.changeType === "up"
                ? "text-emerald-700 dark:text-emerald-300"
                : kpi.changeType === "down"
                  ? "text-destructive"
                  : "text-muted-foreground"
            }`}
          >
            {kpi.changeType === "up" ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : kpi.changeType === "down" ? (
              <TrendingDown className="h-3.5 w-3.5" />
            ) : null}
            {kpi.change}
          </div>
          <div className="mt-2 h-8 w-full opacity-75">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={kpi.spark || []}>
                <Line
                  type="monotone"
                  dataKey="v"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      ))}
    </div>
  );
}

function MyAttendance() {
  const { data: attData, isLoading } = useQuery({
    queryKey: ["employee-dashboard-attendance"],
    queryFn: () => api.get<any>("/attendance/my-history?limit=5"),
  });

  const records: any[] = Array.isArray(attData?.data?.items)
    ? attData.data.items
    : Array.isArray(attData?.items)
      ? attData.items
      : MY_ATTENDANCE;

  const trend: any[] = Array.isArray(attData?.data?.trend)
    ? attData.data.trend
    : MY_ATTENDANCE_TREND;

  return (
    <motion.div {...fadeUp}>
      <Card>
        <SectionHeader
          title="My Attendance"
          subtitle="Recent check-in / check-out log"
          link="/dashboard/attendance"
        />

        {trend.length > 0 && (
          <div className="mb-4 h-36">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={trend}
                margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  stroke="hsl(var(--border))"
                  vertical={false}
                />
                <XAxis
                  dataKey="week"
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 5]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    color: "hsl(var(--foreground))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(v) => [`${v} days`, "Days Present"]}
                />
                <Bar
                  dataKey="days"
                  radius={[4, 4, 0, 0]}
                  fill="hsl(var(--primary))"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <div>
          {isLoading ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Loading attendance records...
            </p>
          ) : records.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No attendance records found.
            </p>
          ) : (
            <div className="divide-y divide-border rounded-lg border border-border">
              {records.map((a, idx) => {
                const statusKey = String(a.status || "present").toLowerCase();
                return (
                  <div
                    key={a.id || a.date || idx}
                    className="flex flex-wrap items-center gap-x-3 gap-y-1.5 px-3.5 py-2.5"
                  >
                    <div className="w-20 shrink-0 text-xs font-medium text-muted-foreground">
                      {a.date
                        ? new Date(a.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })
                        : "—"}
                    </div>
                    <span
                      className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${
                        ATTENDANCE_STATUS[statusKey] || statusBadgeClass("info")
                      }`}
                    >
                      {statusKey === "wfh" ? "WFH" : a.status || "Present"}
                    </span>
                    <div className="min-w-0 flex-1 text-xs text-muted-foreground">
                      {a.checkIn || a.checkInTime
                        ? `${a.checkIn || a.checkInTime} → ${a.checkOut || a.checkOutTime || "–"}`
                        : "Not recorded"}
                    </div>
                    <div className="shrink-0 text-xs font-medium tabular-nums text-foreground">
                      {a.hours ?? (a.workingHours ? `${a.workingHours}h` : "—")}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

function MyLeaves() {
  const [tab, setTab] = useState<"history" | "balance">("history");

  const { data: leaveData, isLoading } = useQuery({
    queryKey: ["employee-dashboard-leaves"],
    queryFn: () => api.get<any>("/leaves/my"),
  });

  const leaves: any[] = Array.isArray(leaveData?.data?.items)
    ? leaveData.data.items
    : Array.isArray(leaveData?.items)
      ? leaveData.items
      : MY_LEAVES;

  const quota: any[] = Array.isArray(leaveData?.data?.quota)
    ? leaveData.data.quota
    : LEAVE_QUOTA;

  return (
    <motion.div {...fadeUp}>
      <Card>
        <SectionHeader
          title="My Leaves"
          subtitle="Leave history and balance"
          link="/dashboard/leaves"
        />
        <div className="mb-4 flex gap-2">
          {(["history", "balance"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded-lg px-3 py-1.5 text-[13px] font-medium capitalize transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                tab === t
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === "history" && (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
            >
              {isLoading ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  Loading leave history...
                </p>
              ) : leaves.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No leave history found.
                </p>
              ) : (
                <div className="divide-y divide-border rounded-lg border border-border">
                  {leaves.map((l) => (
                    <div
                      key={l.id}
                      className="flex items-center gap-3 px-3.5 py-2.5"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-medium text-foreground">
                            {l.type || l.leave_type}
                          </span>
                          <Badge
                            variant="outline"
                            className={`text-xs capitalize ${statusBadgeClass(String(l.status || "pending"))}`}
                          >
                            {l.status}
                          </Badge>
                        </div>
                        <div className="mt-0.5 text-xs text-muted-foreground">
                          {l.from || l.start_date} → {l.to || l.end_date} ·{" "}
                          {l.days ?? 1} day{(l.days ?? 1) !== 1 ? "s" : ""}
                        </div>
                        {l.approvedBy && (
                          <div className="text-xs text-muted-foreground">
                            Approved by {l.approvedBy}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
          {tab === "balance" && (
            <motion.div
              key="balance"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
              className="space-y-3"
            >
              {quota.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No leave balance data available.
                </p>
              ) : (
                quota.map((q) => (
                  <div key={q.type}>
                    <div className="mb-1 flex items-center justify-between text-[13px]">
                      <span className="font-medium text-foreground">{q.type}</span>
                      <span className="text-muted-foreground">
                        <span className="font-semibold text-foreground tabular-nums">
                          {q.remaining}
                        </span>
                        /{q.total} remaining
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-700"
                        style={{
                          width: `${q.total ? (q.remaining / q.total) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <Link
          to="/dashboard/leaves"
          className="mt-4 flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-dashed border-border py-2 text-[13px] font-medium text-foreground/80 transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <FileText className="h-4 w-4" /> Apply New Leave
        </Link>
      </Card>
    </motion.div>
  );
}

function MyPerformance() {
  const { data: perfData, isLoading } = useQuery({
    queryKey: ["employee-dashboard-performance"],
    queryFn: () => api.get<any>("/performance/my"),
  });

  const goals: any[] = Array.isArray(perfData?.data?.goals)
    ? perfData.data.goals
    : Array.isArray(perfData?.goals)
      ? perfData.goals
      : MY_GOALS;
  const score = perfData?.data?.score ?? perfData?.score ?? null;

  return (
    <motion.div {...fadeUp}>
      <Card>
        <SectionHeader
          title="My Performance"
          subtitle="Goals and self-assessment"
          link="/dashboard/performance"
        />
        {score !== null && (
          <div className="mb-4 flex items-center gap-4 rounded-lg bg-muted/35 px-4 py-3">
            <div className="text-center">
              <div className="font-display text-3xl font-bold tabular-nums text-foreground">
                {score}
              </div>
              <div className="text-xs text-muted-foreground">Score</div>
            </div>
            <div className="flex-1">
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-muted-foreground">
                  Performance Rating
                </span>
                <span className="font-semibold text-foreground">
                  {score}/100
                </span>
              </div>
              <Progress value={Number(score)} className="h-2" />
            </div>
          </div>
        )}
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          My Goals
        </p>
        <div className="space-y-3">
          {isLoading ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Loading goals...
            </p>
          ) : goals.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No active goals assigned yet.
            </p>
          ) : (
            goals.map((g, idx) => (
              <div key={g.id || g.goal || idx}>
                <div className="mb-1 flex items-center justify-between text-[13px]">
                  <span className="font-medium text-foreground">{g.goal || g.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {g.due ? `Due ${g.due} · ` : ""}
                    <span className="font-semibold text-foreground">
                      {g.progress ?? 0}%
                    </span>
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-700"
                    style={{ width: `${g.progress ?? 0}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </motion.div>
  );
}

function MyPayslips() {
  const { data: slipData, isLoading } = useQuery({
    queryKey: ["employee-dashboard-payslips"],
    queryFn: () => api.get<any>("/payroll/payslips"),
  });

  const payslips: any[] = Array.isArray(slipData?.data?.items)
    ? slipData.data.items
    : Array.isArray(slipData?.items)
      ? slipData.items
      : Array.isArray(slipData)
        ? slipData
        : MY_PAYSLIPS;

  return (
    <motion.div {...fadeUp}>
      <Card>
        <SectionHeader
          title="My Payslips"
          subtitle="Salary statements"
          link="/dashboard/payroll/payslips"
        />
        <div>
          {isLoading ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Loading payslips...
            </p>
          ) : payslips.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No finalized payslips available yet.
            </p>
          ) : (
            <div className="divide-y divide-border rounded-lg border border-border">
              {payslips.map((p, idx) => (
                <div
                  key={p.id || p.month || idx}
                  className="flex items-center gap-3 px-3.5 py-3"
                >
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Download className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-foreground">
                      {p.month || p.period_name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Gross: {p.gross ?? p.gross_pay ?? "—"}
                      {p.date ? ` · Paid on ${p.date}` : ""}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold tabular-nums text-foreground">
                      {p.net ?? p.net_pay ?? "—"}
                    </div>
                    <Badge variant="outline" className={`mt-0.5 text-xs ${statusBadgeClass("approved")}`}>
                      Paid
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

function MyDocuments() {
  const DOC_STATUS_STYLE: Record<string, string> = {
    verified: statusBadgeClass("approved"),
    pending: statusBadgeClass("pending"),
    rejected: statusBadgeClass("critical"),
  };

  const { data: docData, isLoading } = useQuery({
    queryKey: ["employee-dashboard-documents"],
    queryFn: () => api.get<any>("/documents/my"),
  });

  const documents: any[] = Array.isArray(docData?.data?.items)
    ? docData.data.items
    : Array.isArray(docData?.items)
      ? docData.items
      : Array.isArray(docData)
        ? docData
        : MY_DOCUMENTS;

  return (
    <motion.div {...fadeUp}>
      <Card>
        <SectionHeader
          title="My Documents"
          subtitle="Document verification status"
          link="/dashboard/documents"
        />
        <div>
          {isLoading ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Loading documents...
            </p>
          ) : documents.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No documents uploaded yet.
            </p>
          ) : (
            <div className="divide-y divide-border rounded-lg border border-border">
              {documents.map((d, idx) => {
                const statusKey = String(d.status || "pending").toLowerCase();
                return (
                  <div
                    key={d.id || d.name || idx}
                    className="flex items-center gap-3 px-3.5 py-2.5"
                  >
                    <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-foreground">
                        {d.name || d.title}
                      </div>
                      {d.dueDate && (
                        <div className="text-xs text-muted-foreground">
                          {d.dueDate}
                        </div>
                      )}
                    </div>
                    <span
                      className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${
                        DOC_STATUS_STYLE[statusKey] || statusBadgeClass("pending")
                      }`}
                    >
                      {d.status || "Pending"}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

function MyAssets() {
  const ws = useAurix();
  const userName = (ws.user?.fullName || "").trim().toLowerCase();
  const userId = String(ws.user?.id || "").toLowerCase();

  const { data: listData, isLoading } = useQuery({
    queryKey: ["assets"],
    queryFn: () => api.get<any>("assets?limit=100"),
  });

  const raw =
    listData?.data?.items ??
    listData?.data ??
    listData?.items ??
    (Array.isArray(listData) ? listData : []);
  const allItems: any[] = Array.isArray(raw) ? raw : [];
  const assignedAssets = allItems.filter((a: any) => {
    const assigned = (
      a.assignedTo ||
      a.assigned_to ||
      a.assigned_to_name ||
      a.assigned_employee_name ||
      ""
    )
      .toString()
      .trim()
      .toLowerCase();
    const assignedId = String(
      a.assignedToId ||
        a.assigned_to_id ||
        a.employeeId ||
        a.employee_id ||
        a.userId ||
        a.user_id ||
        "",
    ).toLowerCase();
    if (
      userName &&
      (assigned === userName ||
        assigned.includes(userName) ||
        userName.includes(assigned))
    )
      return true;
    if (userId && (assigned === userId || assignedId === userId)) return true;
    return false;
  });

  return (
    <motion.div {...fadeUp}>
      <Card>
        <SectionHeader
          title="My Assets"
          subtitle="Assigned company equipment"
          link="/dashboard/assets"
        />
        <div className="space-y-2">
          {isLoading ? (
            <div className="py-6 text-center text-xs text-muted-foreground">
              Loading assigned equipment...
            </div>
          ) : assignedAssets.length === 0 ? (
            <div className="py-6 text-center text-xs text-muted-foreground">
              No company equipment currently assigned.
            </div>
          ) : (
            assignedAssets.slice(0, 4).map((a: any) => (
              <div
                key={a.id || a.tag}
                className="flex items-center gap-3 rounded-xl border border-border bg-background/50 px-3 py-2.5"
              >
                <Package className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">
                    {a.name || a.asset_name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Tag: {a.tag || a.asset_tag || "AST"} ·{" "}
                    {a.brand || "Hardware"}
                  </div>
                </div>
                <Badge variant="secondary" className="text-[10px] capitalize">
                  {a.status || "active"}
                </Badge>
              </div>
            ))
          )}
        </div>
      </Card>
    </motion.div>
  );
}

function EmployeeCalendar() {
  const { data: holData, isLoading } = useQuery({
    queryKey: ["employee-dashboard-holidays"],
    queryFn: () => api.get<any>("/holidays"),
  });

  const events: any[] = Array.isArray(holData?.data?.items)
    ? holData.data.items
    : Array.isArray(holData?.items)
      ? holData.items
      : Array.isArray(holData)
        ? holData
        : COMPANY_EVENTS;

  return (
    <motion.div {...fadeUp}>
      <Card>
        <SectionHeader
          title="Company Calendar"
          subtitle="Upcoming events and holidays"
          link="/dashboard/attendance/holidays"
        />
        <div className="space-y-2">
          {isLoading ? (
            <p className="py-6 text-center text-xs text-muted-foreground">
              Loading calendar events...
            </p>
          ) : events.length === 0 ? (
            <p className="py-6 text-center text-xs text-muted-foreground">
              No upcoming events or holidays found.
            </p>
          ) : (
            events.slice(0, 5).map((ev, i) => (
              <div
                key={ev.id || i}
                className={`flex items-start gap-3 rounded-xl border px-3 py-2.5 ${
                  EVENT_COLOR[String(ev.type || "holiday").toLowerCase()] ??
                  "bg-muted/40 border-border"
                }`}
              >
                <CalendarDays className="mt-0.5 h-4 w-4 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">
                    {ev.title || ev.name}
                  </div>
                  <div className="text-xs opacity-70">
                    {ev.date
                      ? new Date(ev.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })
                      : ""}
                    {ev.time ? ` · ${ev.time}` : ""}
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="shrink-0 capitalize text-[10px] border-current"
                >
                  {ev.type || "holiday"}
                </Badge>
              </div>
            ))
          )}
        </div>
      </Card>
    </motion.div>
  );
}

function EmployeeNotifications() {
  const { items } = useNotifications({ limit: 5 });
  const archiveMutation = useArchive();

  return (
    <motion.div {...fadeUp}>
      <Card>
        <SectionHeader title="Notifications" link="/dashboard/notifications" />
        <div className="space-y-2">
          {items.map((n) => {
            const isUrgent =
              n.priority === "critical" || n.priority === "high";
            return (
              <div
                key={n.id}
                className="flex items-start gap-3 rounded-xl border border-border bg-background/50 px-3 py-2.5"
              >
                <div
                  className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg ${
                    isUrgent
                      ? "bg-destructive/10 text-destructive"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  <Bell className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{n.title}</span>
                    {isUrgent && (
                      <Badge
                        variant="destructive"
                        className="h-4 px-1.5 text-[10px] uppercase font-bold"
                      >
                        {n.priority}
                      </Badge>
                    )}
                    <Badge
                      variant="outline"
                      className="h-4 px-1 text-[9px] capitalize"
                    >
                      {n.category.replace(/_/g, " ")}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {n.body}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-xs text-muted-foreground font-mono">
                    {formatRelativeTime(n.createdAt)}
                  </span>
                  <button
                    onClick={() => archiveMutation.mutate(n.id)}
                    className="rounded-md p-1 text-muted-foreground hover:bg-background/60 hover:text-foreground cursor-pointer"
                    aria-label="Dismiss notification"
                    title="Dismiss"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
          {items.length === 0 && (
            <div className="py-6 text-center text-sm text-muted-foreground">
              <CheckCircle2 className="mx-auto mb-2 h-7 w-7 text-muted-foreground" />
              All caught up! No notifications.
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

export function EmployeeDashboard() {
  const ws = useAurix();
  const firstName = ws.user?.fullName?.split(" ")[0] ?? "there";
  const companyName = ws.company?.name ?? "OFC360";

  return (
    <div className="space-y-6">
      <EmployeeHeader firstName={firstName} companyName={companyName} />
      <EmployeeKpiCards />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <MyAttendance />
        <MyLeaves />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <MyPerformance />
        <MyPayslips />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <MyDocuments />
        <MyAssets />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <EmployeeCalendar />
        <EmployeeNotifications />
      </div>
    </div>
  );
}
