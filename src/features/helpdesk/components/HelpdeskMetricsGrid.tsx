import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LifeBuoy,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Hourglass,
  TrendingUp,
  Percent,
} from "lucide-react";
import type { HelpdeskMetrics, HelpdeskTicket } from "../types";

interface HelpdeskMetricsGridProps {
  metrics: HelpdeskMetrics | null;
  tickets?: HelpdeskTicket[];
  roleTitle?: string;
}

export function HelpdeskMetricsGrid({ metrics, tickets = [], roleTitle }: HelpdeskMetricsGridProps) {
  // Aggregate real numbers from backend metrics or calculate directly from active tickets if metrics endpoint is empty
  const total = metrics?.total_tickets ?? tickets.length;
  const open = metrics?.open_tickets ?? tickets.filter((t) => t.status === "open").length;
  const inProgress = metrics?.in_progress_tickets ?? tickets.filter((t) => t.status === "in_progress").length;
  const pending =
    metrics?.waiting_tickets ?? tickets.filter((t) => t.status === "waiting_on_employee").length;
  const resolved = metrics?.resolved_tickets ?? tickets.filter((t) => t.status === "resolved").length;
  const closed = metrics?.closed_tickets ?? tickets.filter((t) => t.status === "closed").length;
  const urgent =
    metrics?.urgent_tickets ?? tickets.filter((t) => t.priority === "urgent" && t.status !== "closed" && t.status !== "resolved").length;
  const slaBreached =
    metrics?.sla_breached ?? tickets.filter((t) => t.sla_status === "BREACHED").length;
  const slaAtRisk =
    metrics?.sla_at_risk ?? tickets.filter((t) => t.sla_status === "AT_RISK").length;
  const slaCompliance = metrics?.sla_compliance_percentage ?? (total > 0 ? Number(((total - slaBreached) / total * 100).toFixed(1)) : 100);
  const avgResponse = metrics?.avg_first_response_time_minutes ?? 0;
  const avgResolution = metrics?.avg_resolution_time_hours ?? 0;

  return (
    <div className="space-y-4">
      {roleTitle && (
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground tracking-tight">{roleTitle} Live Metrics</h3>
          <span className="text-xs text-muted-foreground">Aggregated from active support records</span>
        </div>
      )}

      {/* Primary KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Tickets */}
        <Card className="border border-border/70 shadow-xs">
          <CardHeader className="p-3 pb-1 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">Total Tickets</CardTitle>
            <LifeBuoy className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="text-xl font-bold text-foreground">{total}</div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Real database records</p>
          </CardContent>
        </Card>

        {/* Open */}
        <Card className="border border-border/70 shadow-xs">
          <CardHeader className="p-3 pb-1 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">Open</CardTitle>
            <Clock className="h-4 w-4 text-sky-500" />
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="text-xl font-bold text-sky-600 dark:text-sky-400">{open}</div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Awaiting triage</p>
          </CardContent>
        </Card>

        {/* In Progress */}
        <Card className="border border-border/70 shadow-xs">
          <CardHeader className="p-3 pb-1 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">In Progress</CardTitle>
            <Hourglass className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="text-xl font-bold text-amber-600 dark:text-amber-400">{inProgress}</div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Under investigation</p>
          </CardContent>
        </Card>

        {/* Pending Employee */}
        <Card className="border border-border/70 shadow-xs">
          <CardHeader className="p-3 pb-1 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">Pending Info</CardTitle>
            <AlertTriangle className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="text-xl font-bold text-purple-600 dark:text-purple-400">{pending}</div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Waiting on user</p>
          </CardContent>
        </Card>

        {/* Resolved */}
        <Card className="border border-border/70 shadow-xs">
          <CardHeader className="p-3 pb-1 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">Resolved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{resolved}</div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Solution delivered</p>
          </CardContent>
        </Card>

        {/* Urgent Active */}
        <Card className="border border-border/70 shadow-xs">
          <CardHeader className="p-3 pb-1 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">Urgent Active</CardTitle>
            <Flame className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="text-xl font-bold text-red-600 dark:text-red-400">{urgent}</div>
            <p className="text-[11px] text-muted-foreground mt-0.5">High business impact</p>
          </CardContent>
        </Card>
      </div>

      {/* SLA & Performance Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* SLA Compliance */}
        <Card className="border border-border/70 shadow-xs bg-card/60">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">SLA Compliance</p>
              <div className="text-2xl font-bold text-foreground mt-1">{slaCompliance}%</div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {slaBreached} breached • {slaAtRisk} at risk
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Percent className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Avg Response Time */}
        <Card className="border border-border/70 shadow-xs bg-card/60">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Avg First Response</p>
              <div className="text-2xl font-bold text-foreground mt-1">
                {avgResponse > 0 ? `${avgResponse.toFixed(1)}m` : "—"}
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">First agent reply time</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-500">
              <Clock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Avg Resolution Time */}
        <Card className="border border-border/70 shadow-xs bg-card/60">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Avg Resolution Time</p>
              <div className="text-2xl font-bold text-foreground mt-1">
                {avgResolution > 0 ? `${avgResolution.toFixed(1)}h` : "—"}
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">From submission to resolve</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <TrendingUp className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Closed & Archived */}
        <Card className="border border-border/70 shadow-xs bg-card/60">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Closed Tickets</p>
              <div className="text-2xl font-bold text-foreground mt-1">{closed}</div>
              <p className="text-[11px] text-muted-foreground mt-0.5">Confirmed resolved & closed</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
