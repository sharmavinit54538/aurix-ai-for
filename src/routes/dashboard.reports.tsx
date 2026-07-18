import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Download,
  Plus,
  RefreshCw,
  Trash2,
  AlertTriangle,
  FileText,
  CheckCircle2,
  Activity,
  HardDrive,
  Clock,
  PieChart as PieIcon,
  FileSpreadsheet,
} from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import {
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiInstance from "@/api/apiInstance";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GlassCard, SearchBox, StatCard, StatusBadge } from "@/components/hrms/Shared";

export const Route = createFileRoute("/dashboard/reports")({
  head: () => ({ meta: [{ title: "Reports — Aurix" }] }),
  component: ReportsPage,
});

// ---------------- Type Envelopes ----------------
interface ApiResponseEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  errors: unknown;
}

interface DbReport {
  id: string;
  name: string;
  description?: string;
  type: string;
  status: string;
  format: string;
  filters?: Record<string, unknown>;
  schedule?: string;
  file_path?: string;
  file_size_kb: number;
  created_at: string;
  updated_at: string;
}

interface DbReportStats {
  total: number;
  generated_today: number;
  scheduled: number;
  pending: number;
  successful_exports: number;
  failed: number;
  active_dashboards: number;
  storage_usage_mb: number;
}

const COLORS = [
  "oklch(0.6 0.2 285)",
  "oklch(0.7 0.18 320)",
  "oklch(0.65 0.16 200)",
  "oklch(0.75 0.15 90)",
  "oklch(0.55 0.18 25)",
];

const REPORT_TYPES = [
  "employee",
  "payroll",
  "attendance",
  "leave",
  "recruitment",
  "travel",
  "compliance",
  "audit",
  "ai-insights",
];

const TYPE_TONE: Record<string, "muted" | "info" | "warning" | "success" | "danger"> = {
  employee: "info",
  payroll: "success",
  attendance: "muted",
  leave: "warning",
  recruitment: "info",
  travel: "info",
  compliance: "warning",
  audit: "muted",
  "ai-insights": "success",
};

// ---------------- V2 API custom request helper ----------------
const fetchV2 = async <T = unknown,>(
  path: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  data?: unknown,
  params?: unknown,
): Promise<ApiResponseEnvelope<T>> => {
  const v2Base = apiInstance.defaults.baseURL?.replace("/api/v1", "/api/v2") || "";
  const response = await apiInstance.request<ApiResponseEnvelope<T>>({
    method,
    url: `${v2Base}/${path.replace(/^\//, "")}`,
    data,
    params,
  });
  return response.data;
};

function ReportsPage() {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({
    name: "",
    description: "",
    type: "employee",
    format: "pdf",
    schedule: "none",
  });

  // Queries
  const reportsQuery = useQuery<ApiResponseEnvelope<DbReport[]>>({
    queryKey: ["reports-list", typeFilter, statusFilter, query],
    queryFn: () =>
      fetchV2<DbReport[]>("/reports", "GET", undefined, {
        type: typeFilter === "all" ? undefined : typeFilter,
        status: statusFilter === "all" ? undefined : statusFilter,
        search: query || undefined,
      }),
  });

  const statsQuery = useQuery<ApiResponseEnvelope<DbReportStats>>({
    queryKey: ["reports-summary-stats"],
    queryFn: () => fetchV2<DbReportStats>("/reports/stats", "GET"),
  });

  const headcountQuery = useQuery<ApiResponseEnvelope<Array<{ m: string; n: number }>>>({
    queryKey: ["reports-headcount-trend"],
    queryFn: () => fetchV2<Array<{ m: string; n: number }>>("/reports/analytics/headcount", "GET"),
  });

  const deptQuery = useQuery<ApiResponseEnvelope<Array<{ name: string; value: number }>>>({
    queryKey: ["reports-dept-distribution"],
    queryFn: () =>
      fetchV2<Array<{ name: string; value: number }>>("/reports/analytics/department", "GET"),
  });

  const tenureQuery = useQuery<ApiResponseEnvelope<Array<{ range: string; n: number }>>>({
    queryKey: ["reports-tenure-distribution"],
    queryFn: () => fetchV2<Array<{ range: string; n: number }>>("/reports/analytics/tenure", "GET"),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: unknown) => fetchV2("/reports", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports-list"] });
      queryClient.invalidateQueries({ queryKey: ["reports-summary-stats"] });
    },
  });

  const refreshMutation = useMutation({
    mutationFn: (id: string) => fetchV2(`/reports/${id}/refresh`, "POST"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports-list"] });
      queryClient.invalidateQueries({ queryKey: ["reports-summary-stats"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => fetchV2(`/reports/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports-list"] });
      queryClient.invalidateQueries({ queryKey: ["reports-summary-stats"] });
    },
  });

  const reportsList = reportsQuery.data?.data || [];
  const stats = statsQuery.data?.data || {
    total: 0,
    generated_today: 0,
    scheduled: 0,
    pending: 0,
    successful_exports: 0,
    failed: 0,
    active_dashboards: 0,
    storage_usage_mb: 0,
  };

  const headcountData = headcountQuery.data?.data || [];
  const byDept = deptQuery.data?.data || [];
  const tenureData = tenureQuery.data?.data || [];

  const handleRefreshAll = () => {
    reportsQuery.refetch();
    statsQuery.refetch();
    headcountQuery.refetch();
    deptQuery.refetch();
    tenureQuery.refetch();
  };

  const handleDownload = (r: DbReport) => {
    // Generate a temporary file download alert or direct link
    alert(`Downloading ${r.name} (${r.format.toUpperCase()}, ${r.file_size_kb} KB)...`);
  };

  const handleGeneratePdfReport = () => {
    createMutation.mutate({
      name: `Global Executive Summary Report — ${new Date().toLocaleDateString()}`,
      description: "Auto-compiled corporate system intelligence summary PDF.",
      type: "ai-insights",
      format: "pdf",
      schedule: "none",
    });
  };

  function submit() {
    if (!draft.name) return;
    createMutation.mutate(
      {
        name: draft.name,
        description: draft.description || undefined,
        type: draft.type,
        format: draft.format,
        schedule: draft.schedule,
      },
      {
        onSuccess: () => {
          setOpen(false);
          setDraft({
            name: "",
            description: "",
            type: "employee",
            format: "pdf",
            schedule: "none",
          });
        },
      },
    );
  }

  return (
    <>
      <PageHeader
        title="Reports & Analytics"
        description="Cross-cut corporate intelligence and generated exports."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefreshAll} disabled={reportsQuery.isFetching}>
              <RefreshCw
                className={`mr-2 h-4 w-4 ${reportsQuery.isFetching ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button
              variant="outline"
              onClick={handleGeneratePdfReport}
              disabled={createMutation.isPending}
            >
              <Download className="mr-2 h-4 w-4" /> Export PDF
            </Button>
            <Button size="sm" onClick={() => setOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" /> Generate Report
            </Button>
          </div>
        }
      />

      {/* KPI Cards Grid */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Reports" value={stats.total} icon={FileText} accent="brand" />
        <StatCard
          label="Generated Today"
          value={stats.generated_today}
          icon={Activity}
          accent="brand"
        />
        <StatCard
          label="Scheduled runs"
          value={stats.scheduled}
          icon={RefreshCw}
          accent="warning"
        />
        <StatCard
          label="Storage size"
          value={`${stats.storage_usage_mb} MB`}
          icon={HardDrive}
          accent="success"
        />
        <StatCard
          label="Success Exports"
          value={stats.successful_exports}
          icon={CheckCircle2}
          accent="success"
        />
        <StatCard label="Pending queue" value={stats.pending} icon={Clock} accent="warning" />
        <StatCard
          label="Failed Reports"
          value={stats.failed}
          icon={AlertTriangle}
          accent="danger"
        />
        <StatCard
          label="Active Panels"
          value={stats.active_dashboards}
          icon={PieIcon}
          accent="brand"
        />
      </div>

      {/* Analytics Charts Row */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card title="Headcount over time" className="lg:col-span-2">
          {headcountQuery.isLoading ? (
            <ChartSkeleton />
          ) : headcountData.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={headcountData} margin={{ top: 10, right: 10, left: -10 }}>
                <CartesianGrid stroke="oklch(0.5 0.02 264 / 0.15)" vertical={false} />
                <XAxis
                  dataKey="m"
                  stroke="currentColor"
                  className="text-xs text-muted-foreground"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="currentColor"
                  className="text-xs text-muted-foreground"
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="n"
                  stroke="oklch(0.6 0.2 285)"
                  strokeWidth={2.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart />
          )}
        </Card>

        <Card title="By department">
          {deptQuery.isLoading ? (
            <ChartSkeleton />
          ) : byDept.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={byDept}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {byDept.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart />
          )}
        </Card>

        <Card title="Tenure distribution" className="lg:col-span-3">
          {tenureQuery.isLoading ? (
            <ChartSkeleton />
          ) : tenureData.length ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={tenureData} margin={{ top: 10, right: 10, left: -20 }}>
                <CartesianGrid stroke="oklch(0.5 0.02 264 / 0.15)" vertical={false} />
                <XAxis
                  dataKey="range"
                  stroke="currentColor"
                  className="text-xs text-muted-foreground"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="currentColor"
                  className="text-xs text-muted-foreground"
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                  }}
                />
                <Bar dataKey="n" radius={[6, 6, 0, 0]} fill="oklch(0.7 0.18 320)" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart />
          )}
        </Card>
      </div>

      {/* Reports Listing Section */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <SearchBox value={query} onChange={setQuery} placeholder="Search reports by name…" />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="h-9 rounded-md border border-border bg-background px-3 text-sm"
        >
          <option value="all">All Types</option>
          {REPORT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t.replace(/-/g, " ")}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 rounded-md border border-border bg-background px-3 text-sm"
        >
          <option value="all">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="running">Running</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {reportsQuery.isLoading ? (
        <ReportsSkeleton />
      ) : reportsQuery.isError ? (
        <ReportsError onRetry={() => reportsQuery.refetch()} />
      ) : reportsList.length === 0 ? (
        <ReportsEmpty />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {reportsList.map((r) => {
            const isExcel = r.format === "excel";
            const isCsv = r.format === "csv";
            return (
              <GlassCard key={r.id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-foreground">{r.name}</h3>
                      <StatusBadge status={r.type} tone={TYPE_TONE[r.type] || "muted"} />
                      <StatusBadge
                        status={r.status}
                        tone={
                          r.status === "completed"
                            ? "success"
                            : r.status === "failed"
                              ? "danger"
                              : "warning"
                        }
                      />
                    </div>
                    {r.description && (
                      <p className="mt-1 text-xs text-muted-foreground">{r.description}</p>
                    )}
                    <div className="mt-3 grid grid-cols-2 gap-1 text-[11px] text-muted-foreground">
                      <div className="inline-flex items-center gap-1">
                        Format: <span className="font-semibold uppercase">{r.format}</span>
                      </div>
                      <div>
                        Size: <span className="font-semibold">{r.file_size_kb} KB</span>
                      </div>
                      <div>
                        Schedule: <span className="capitalize">{r.schedule || "none"}</span>
                      </div>
                      <div>Compiled: {new Date(r.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex flex-col items-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload(r)}
                      disabled={r.status !== "completed"}
                      className="gap-1.5"
                    >
                      {isExcel || isCsv ? (
                        <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <FileText className="h-3.5 w-3.5 text-rose-500" />
                      )}
                      Download
                    </Button>
                    <div className="flex gap-1.5">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => refreshMutation.mutate(r.id)}
                        disabled={refreshMutation.isPending}
                        title="Recompile Report"
                      >
                        <RefreshCw
                          className={`h-3.5 w-3.5 ${refreshMutation.isPending ? "animate-spin" : ""}`}
                        />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteMutation.mutate(r.id)}
                        disabled={deleteMutation.isPending}
                        title="Delete Report"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* Generation dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Generate new report</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div>
              <Label>Report Title</Label>
              <Input
                placeholder="e.g. Sales Commission Ledger"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                placeholder="Add contextual details about the filters or data parameters..."
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <Label>Scope Category</Label>
                <select
                  value={draft.type}
                  onChange={(e) => setDraft({ ...draft, type: e.target.value })}
                  className="h-9 w-full rounded-md border border-border bg-background px-2 text-xs"
                >
                  {REPORT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t.replace(/-/g, " ")}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Format</Label>
                <select
                  value={draft.format}
                  onChange={(e) => setDraft({ ...draft, format: e.target.value })}
                  className="h-9 w-full rounded-md border border-border bg-background px-2 text-xs"
                >
                  <option value="pdf">PDF</option>
                  <option value="csv">CSV</option>
                  <option value="excel">Excel</option>
                </select>
              </div>
            </div>
            <div>
              <Label>Scheduled Auto-Refresh</Label>
              <select
                value={draft.schedule}
                onChange={(e) => setDraft({ ...draft, schedule: e.target.value })}
                className="h-9 w-full rounded-md border border-border bg-background px-2 text-xs"
              >
                <option value="none">Single execution (None)</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submit} disabled={createMutation.isPending || !draft.name}>
              Initiate Compilation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ---------------- Fallback Subcomponents ----------------
function Card({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl ${className}`}
    >
      <h3 className="mb-4 font-medium">{title}</h3>
      {children}
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="grid h-[260px] place-items-center text-sm text-muted-foreground">
      Not enough data yet
    </div>
  );
}

function ChartSkeleton() {
  return <div className="h-[260px] w-full rounded-lg bg-muted/40 animate-pulse" />;
}

function ReportsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="h-32 rounded-xl border border-border bg-card/60 p-4 animate-pulse"
        />
      ))}
    </div>
  );
}

function ReportsError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-border bg-card/60">
      <AlertTriangle className="h-10 w-10 text-rose-500 mb-2 animate-bounce" />
      <h3 className="font-semibold text-foreground mb-1">Failed to load reports</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Please verify backend connectivity and try again.
      </p>
      <Button onClick={onRetry}>Retry Connection</Button>
    </div>
  );
}

function ReportsEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-border bg-card/60">
      <FileText className="h-12 w-12 text-muted-foreground stroke-[1.5] mb-2 opacity-50" />
      <h3 className="font-semibold text-foreground mb-1">No reports compiled yet</h3>
      <p className="text-sm text-muted-foreground">
        Submit a generation request above to compile a new system export.
      </p>
    </div>
  );
}
