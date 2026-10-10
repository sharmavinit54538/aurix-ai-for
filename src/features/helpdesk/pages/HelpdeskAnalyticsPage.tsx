import React, { useState, useEffect } from "react";
import { useCurrentRole } from "@/lib/use-current-role";
import { isSuperAdmin } from "@/lib/roles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LifeBuoy,
  TrendingUp,
  Percent,
  Clock,
  CheckCircle2,
  RefreshCw,
  BarChart3,
  Layers,
  Flame,
} from "lucide-react";
import { helpdeskApi, getHelpdeskErrorMessage } from "../helpdeskApi";
import {
  HelpdeskAccessDeniedState,
  HelpdeskErrorState,
  HelpdeskLoadingState,
} from "../components/HelpdeskStates";
import { formatCategoryLabel } from "../components/TicketTable";
import type { HelpdeskMetrics, HelpdeskTicket } from "../types";

export default function HelpdeskAnalyticsPage() {
  const currentRole = useCurrentRole();

  if (isSuperAdmin(currentRole)) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <HelpdeskAccessDeniedState
          title="Super Admin Access Prohibited"
          description="Super Administrators do not have access to Helpdesk analytics. Access is reserved for company executives and operations managers."
        />
      </div>
    );
  }

  const [metrics, setMetrics] = useState<HelpdeskMetrics | null>(null);
  const [tickets, setTickets] = useState<HelpdeskTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const [mRes, tRes] = await Promise.all([
        helpdeskApi.getHelpdeskMetrics().catch(() => null),
        helpdeskApi.getAdminTickets({ limit: 50 }).catch(() => ({ tickets: [] })),
      ]);
      setMetrics(mRes);
      setTickets(tRes.tickets);
    } catch (err) {
      setError(getHelpdeskErrorMessage(err, "Unable to load Helpdesk analytics."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  const total = metrics?.total_tickets ?? tickets.length;
  const open = metrics?.open_tickets ?? tickets.filter((t) => t.status === "open").length;
  const inProgress = metrics?.in_progress_tickets ?? tickets.filter((t) => t.status === "in_progress").length;
  const resolved = metrics?.resolved_tickets ?? tickets.filter((t) => t.status === "resolved").length;
  const resolutionRate = total > 0 ? ((resolved / total) * 100).toFixed(1) : "0.0";
  const slaCompliance = metrics?.sla_compliance_percentage ?? 100;
  const avgResponse = metrics?.avg_first_response_time_minutes ?? 0;
  const avgResolution = metrics?.avg_resolution_time_hours ?? 0;

  const categoryEntries = Object.entries(metrics?.by_category || {});
  const priorityEntries = Object.entries(metrics?.by_priority || {});

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-7xl space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Helpdesk & Service Level Analytics
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Executive overview of organizational ticket throughput, SLA compliance, and incident resolution times.
              </p>
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadMetrics}
          disabled={loading}
          className="h-9 gap-1.5"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Analytics</span>
        </Button>
      </div>

      {loading ? (
        <div className="py-20">
          <HelpdeskLoadingState message="Aggregating Helpdesk metrics from live records..." />
        </div>
      ) : error ? (
        <HelpdeskErrorState error={error} onRetry={loadMetrics} />
      ) : (
        <div className="space-y-6">
          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <Card className="border border-border/70 shadow-xs">
              <CardHeader className="p-4 pb-1">
                <CardTitle className="text-xs font-medium text-muted-foreground">Total Tickets</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold text-foreground">{total}</div>
                <p className="text-[11px] text-muted-foreground mt-0.5">Real tickets recorded</p>
              </CardContent>
            </Card>

            <Card className="border border-border/70 shadow-xs">
              <CardHeader className="p-4 pb-1">
                <CardTitle className="text-xs font-medium text-muted-foreground">Open Backlog</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold text-sky-600 dark:text-sky-400">{open + inProgress}</div>
                <p className="text-[11px] text-muted-foreground mt-0.5">{open} open • {inProgress} in progress</p>
              </CardContent>
            </Card>

            <Card className="border border-border/70 shadow-xs">
              <CardHeader className="p-4 pb-1">
                <CardTitle className="text-xs font-medium text-muted-foreground">Resolution Rate</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{resolutionRate}%</div>
                <p className="text-[11px] text-muted-foreground mt-0.5">{resolved} tickets resolved</p>
              </CardContent>
            </Card>

            <Card className="border border-border/70 shadow-xs">
              <CardHeader className="p-4 pb-1">
                <CardTitle className="text-xs font-medium text-muted-foreground">SLA Compliance</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold text-primary">{slaCompliance}%</div>
                <p className="text-[11px] text-muted-foreground mt-0.5">Tickets within SLA terms</p>
              </CardContent>
            </Card>

            <Card className="border border-border/70 shadow-xs">
              <CardHeader className="p-4 pb-1">
                <CardTitle className="text-xs font-medium text-muted-foreground">Avg Resolution</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold text-foreground">
                  {avgResolution > 0 ? `${avgResolution.toFixed(1)}h` : "—"}
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">Mean time to resolve</p>
              </CardContent>
            </Card>
          </div>

          {/* Breakdown Distributions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tickets by Category */}
            <Card className="border border-border/70 shadow-xs">
              <CardHeader className="p-4 border-b border-border/60">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" />
                  Tickets by Category
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {categoryEntries.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-6 text-center">
                    No categorical data available yet.
                  </p>
                ) : (
                  categoryEntries.map(([cat, count]) => {
                    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                    return (
                      <div key={cat} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-medium">
                          <span>{formatCategoryLabel(cat)}</span>
                          <span className="text-muted-foreground">
                            {count} ({pct}%)
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>

            {/* Tickets by Priority */}
            <Card className="border border-border/70 shadow-xs">
              <CardHeader className="p-4 border-b border-border/60">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Flame className="h-4 w-4 text-red-500" />
                  Tickets by Priority
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {priorityEntries.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-6 text-center">
                    No priority distribution available yet.
                  </p>
                ) : (
                  priorityEntries.map(([priority, count]) => {
                    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                    const barColor =
                      priority === "urgent"
                        ? "bg-red-500"
                        : priority === "high"
                        ? "bg-rose-500"
                        : priority === "medium"
                        ? "bg-amber-500"
                        : "bg-slate-400";
                    return (
                      <div key={priority} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-medium">
                          <span className="capitalize">{priority}</span>
                          <span className="text-muted-foreground">
                            {count} ({pct}%)
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
