import { AlertTriangle, HeartPulse, LineChart as LineChartIcon, ShieldAlert, TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { PayrollAlertItem, PayrollData, PayrollTrendItem } from "@/store/aiInsights/aiInsightsTypes";
import { CHART_TOOLTIP_STYLE } from "../../constants/chartStyles";
import { SeverityBadge } from "../shared/Badges";
import { EmptySection } from "../shared/EmptySection";
import { InsightsPanel } from "../shared/InsightsPanel";
import { MiniStat } from "../shared/MiniStat";
import { SectionTitle } from "../shared/SectionTitle";

export function PayrollSection({
  payroll,
  payrollAlerts,
  payrollTrend,
}: {
  payroll: PayrollData | null;
  payrollAlerts: PayrollAlertItem[];
  payrollTrend: PayrollTrendItem[];
}) {
  console.log(payroll,
    payrollAlerts,
    payrollTrend);
  return (
    <>
      <SectionTitle eyebrow="Payroll" title="AI Payroll Insights" icon={ShieldAlert} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <MiniStat
          label="Payroll Health"
          value={payroll?.payrollHealth != null ? String(payroll.payrollHealth) : "—"}
          hint="payroll score"
          icon={HeartPulse}
        />
        <MiniStat
          label="Savings Opportunities"
          value={payroll?.savingsOpportunities ?? "—"}
          hint="vendor + reimb optimization"
          icon={TrendingUp}
        />
        <MiniStat
          label="Anomalies Detected"
          value={payroll?.anomaliesDetected != null ? String(payroll.anomaliesDetected) : "—"}
          hint="flagged anomalies"
          icon={AlertTriangle}
        />

        <InsightsPanel
          title="Payroll Alerts"
          icon={ShieldAlert}
          accent="from-rose-500/20 to-amber-500/10"
          className="lg:col-span-2"
        >
          {payrollAlerts.length === 0 ? (
            <EmptySection message="No active payroll alerts." />
          ) : (
            <ul className="space-y-3">
              {payrollAlerts.map((alert) => (
                <li
                  key={alert.id ?? alert.title}
                  className="flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-background/40 p-3"
                >
                  <div>
                    <div className="font-medium">{alert.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {alert.who} · {alert.delta}
                    </div>
                  </div>
                  <SeverityBadge severity={alert.severity} />
                </li>
              ))}
            </ul>
          )}
        </InsightsPanel>

        <InsightsPanel title="Payroll Cost Forecast" icon={LineChartIcon} accent="from-sky-500/20 to-indigo-500/10">
          {payrollTrend.length === 0 ? (
            <EmptySection message="No payroll forecast trend data." />
          ) : (
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={payrollTrend}>
                  <defs>
                    <linearGradient id="payroll-cost" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                  <XAxis dataKey="m" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                  <Area
                    type="monotone"
                    dataKey="cost"
                    stroke="hsl(var(--primary))"
                    fill="url(#payroll-cost)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </InsightsPanel>
      </div>
    </>
  );
}
