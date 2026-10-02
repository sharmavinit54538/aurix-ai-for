import { Link } from "@tanstack/react-router";
import { memo, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity, AlertCircle, AlertTriangle, ArrowDownRight, ArrowUpRight, Award, Brain,
  Briefcase, CheckCircle2, Cpu, FileText, Flame, GraduationCap,
  HeartPulse, Inbox, LineChart as LineChartIcon, MessageSquare, RefreshCw, Send, Shield,
  ShieldAlert, Sparkles, Target, TrendingUp, UserMinus, UserPlus, Users, Zap,
} from "lucide-react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { statusBadgeClass, trendTextClass } from "@/lib/status-styles";
import { getToneDot } from "@/lib/color-maps";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchAIInsightsDashboard } from "@/store/aiInsights/aiInsightsThunk";
import {
  selectAIInsightsAlerts,
  selectAIInsightsAttendance,
  selectAIInsightsAttrition,
  selectAIInsightsBurnout,
  selectAIInsightsCandidates,
  selectAIInsightsDocuments,
  selectAIInsightsError,
  selectAIInsightsHeadcountForecast,
  selectAIInsightsHiringDemand,
  selectAIInsightsKPIs,
  selectAIInsightsLoading,
  selectAIInsightsPayroll,
  selectAIInsightsPayrollAlerts,
  selectAIInsightsPayrollTrend,
  selectAIInsightsRecruitment,
  selectAIInsightsRecommendations,
  selectAIInsightsSatisfactionTrend,
  selectAIInsightsSkillGap,
  selectAIInsightsSummary,
  selectAIInsightsSupportPerformers,
  selectAIInsightsTopPerformers,
  selectAIInsightsHasDataFlag,
  selectAIInsightsPartial,
  selectAIInsightsPartialErrors,
} from "@/store/aiInsights/aiInsightsSelectors";
import type {
  DocumentItem,
  KpiItem,
  PayrollAlertItem,
} from "@/store/aiInsights/aiInsightsTypes";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  HeartPulse,
  Sparkles,
  UserMinus,
  Zap,
  CheckCircle2,
  Briefcase,
  AlertTriangle,
  Flame,
  ShieldAlert,
  Shield,
  TrendingUp,
  Target,
  GraduationCap,
  Cpu,
  Users,
  LineChart: LineChartIcon,
};

function getIconComponent(name?: string, fallback: React.ComponentType<{ className?: string }> = Brain) {
  if (!name) return fallback;
  return ICON_MAP[name] ?? fallback;
}

// ---------------- Page Component ----------------
export function AIInsightsPage() {
  const dispatch = useAppDispatch();

  const loading = useAppSelector(selectAIInsightsLoading);
  const error = useAppSelector(selectAIInsightsError);
  const summary = useAppSelector(selectAIInsightsSummary);
  const kpis = useAppSelector(selectAIInsightsKPIs);
  const attrition = useAppSelector(selectAIInsightsAttrition);
  const burnout = useAppSelector(selectAIInsightsBurnout);
  const attendance = useAppSelector(selectAIInsightsAttendance);
  const recruitment = useAppSelector(selectAIInsightsRecruitment);
  const candidates = useAppSelector(selectAIInsightsCandidates);
  const topPerformers = useAppSelector(selectAIInsightsTopPerformers);
  const supportPerformers = useAppSelector(selectAIInsightsSupportPerformers);
  const skillGap = useAppSelector(selectAIInsightsSkillGap);
  const payroll = useAppSelector(selectAIInsightsPayroll);
  const payrollAlerts = useAppSelector(selectAIInsightsPayrollAlerts);
  const payrollTrend = useAppSelector(selectAIInsightsPayrollTrend);
  const headcountForecast = useAppSelector(selectAIInsightsHeadcountForecast);
  const hiringDemand = useAppSelector(selectAIInsightsHiringDemand);
  const satisfactionTrend = useAppSelector(selectAIInsightsSatisfactionTrend);
  const alerts = useAppSelector(selectAIInsightsAlerts);
  const recommendations = useAppSelector(selectAIInsightsRecommendations);
  const documents = useAppSelector(selectAIInsightsDocuments);
  const hasDataFlag = useAppSelector(selectAIInsightsHasDataFlag);
  const partial = useAppSelector(selectAIInsightsPartial);
  const partialErrors = useAppSelector(selectAIInsightsPartialErrors);

  useEffect(() => {
    dispatch(fetchAIInsightsDashboard());
  }, [dispatch]);

  const handleRetry = () => {
    dispatch(fetchAIInsightsDashboard());
  };

  const hasData = useMemo(() => {
    if (hasDataFlag === false) return false;
    return Boolean(
      (Array.isArray(kpis) && kpis.length > 0) ||
      (Array.isArray(attrition) && attrition.length > 0) ||
      (Array.isArray(burnout) && burnout.length > 0) ||
      (Array.isArray(attendance) && attendance.length > 0) ||
      (Array.isArray(candidates) && candidates.length > 0) ||
      (Array.isArray(topPerformers) && topPerformers.length > 0) ||
      (Array.isArray(recommendations) && recommendations.length > 0) ||
      (Array.isArray(alerts) && alerts.length > 0) ||
      (summary !== null && (summary.totalInsights > 0 || summary.actionedCount > 0))
    );
  }, [hasDataFlag, kpis, attrition, burnout, attendance, candidates, topPerformers, recommendations, alerts, summary]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Predictive Insights"
        description="Predictive attrition analytics, team sentiment monitoring, burnout risk alerts, and salary benchmarks."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={handleRetry}
            disabled={loading}
          >
            <RefreshCw className={`mr-2 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        }
      />

      {partial ? (
        <div className={`flex items-center justify-between rounded-xl border p-3.5 text-xs ${statusBadgeClass("warning")}`}>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>
              Notice: Some insight metrics are based on partial workforce data.
              {partialErrors && typeof partialErrors === "object"
                ? ` (${Object.keys(partialErrors).length} section(s) reported issues)`
                : ""}
            </span>
          </div>
        </div>
      ) : null}

      {error ? (
        <ErrorBanner message={error} onRetry={handleRetry} />
      ) : null}

      {loading && !hasData ? (
        <LoadingSkeletonView />
      ) : (
        <>
          {kpis.length === 0 ? (
            <EmptySection message="No KPI metrics currently available." />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {kpis.map((k, i) => (
                <KpiCard key={k.label} kpi={k} delay={i * 0.04} />
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
            <div className="space-y-6">
              {/* Workforce analytics */}
              <SectionTitle eyebrow="Workforce" title="AI Workforce Analytics" icon={Brain} />
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Panel title="Attrition Prediction" icon={UserMinus}>
                  {attrition.length === 0 ? (
                    <EmptySection message="No attrition risk predictions found." />
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-sm">
                        <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                          <tr>
                            <th className="py-2.5 pr-4 font-medium">Employee</th>
                            <th className="py-2.5 px-3 font-medium">Risk</th>
                            <th className="py-2.5 pl-2 font-medium">Reason</th>
                          </tr>
                        </thead>
                        <tbody>
                          {attrition.map((a) => (
                            <tr key={a.name} className="border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors">
                              <td className="py-3 pr-4 align-top min-w-[140px]">
                                <div className="font-medium text-foreground">{a.name}</div>
                                <div className="text-xs text-muted-foreground">{a.dept}</div>
                              </td>
                              <td className="py-3 px-3 align-top whitespace-nowrap">
                                <RiskPill score={a.risk} />
                              </td>
                              <td className="py-3 pl-2 align-top text-xs text-muted-foreground">
                                <div className="leading-relaxed">{a.reason}</div>
                                {a.action ? (
                                  <div className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground border border-border">
                                    <Sparkles className="h-3 w-3 text-primary" /> {a.action}
                                  </div>
                                ) : null}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Panel>

                <Panel title="Burnout Detection" icon={Flame}>
                  {burnout.length === 0 ? (
                    <EmptySection message="No burnout warnings detected." />
                  ) : (
                    <div className="space-y-3">
                      {burnout.map((b) => (
                        <div key={b.name} className="rounded-lg border border-border bg-card p-3 shadow-sm">
                          <div className="flex items-center justify-between">
                            <div className="font-medium text-foreground">{b.name}</div>
                            <Badge variant="outline" className={statusBadgeClass(b.score > 80 ? "critical" : "warning")}>
                              {b.score} burnout
                            </Badge>
                          </div>
                          <div className="mt-2 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                            <div>Overtime: <span className="font-medium text-foreground">{b.overtime}h</span></div>
                            <div>Leave balance: <span className="font-medium text-foreground">{b.leave} days</span></div>
                          </div>
                          <Progress value={b.score} className="mt-2 h-1.5" />
                        </div>
                      ))}
                    </div>
                  )}
                </Panel>

                <Panel title="Attendance Insights" icon={CheckCircle2} className="lg:col-span-2">
                  {attendance.length === 0 ? (
                    <EmptySection message="No attendance insight alerts recorded." />
                  ) : (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {attendance.map((a) => (
                        <div key={a.title} className="rounded-lg border border-border bg-card p-4 shadow-sm">
                          <div className="flex items-center gap-2">
                            <ToneDot tone={a.tone} />
                            <div className="text-sm font-medium text-foreground">{a.title}</div>
                          </div>
                          <div className="mt-2 font-display text-2xl font-semibold text-foreground">{a.count}</div>
                          <div className="mt-1 text-xs text-muted-foreground">{a.note}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </Panel>
              </div>

              {/* Recruitment */}
              <SectionTitle eyebrow="Hiring" title="AI Recruitment Assistant" icon={Briefcase} />
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <MiniStat
                  label="Open Positions"
                  value={recruitment?.openPositions != null ? String(recruitment.openPositions) : "—"}
                  hint="across active departments"
                  icon={Briefcase}
                />
                <MiniStat
                  label="Recommended Candidates"
                  value={recruitment?.recommendedCandidatesCount != null ? String(recruitment.recommendedCandidatesCount) : "—"}
                  hint="match score > 80%"
                  icon={UserPlus}
                />
                <MiniStat
                  label="Pipeline Health"
                  value={recruitment?.pipelineHealth ?? "N/A"}
                  hint="active hiring pipeline"
                  icon={LineChartIcon}
                />

                <Panel title="Top Candidate Matches" icon={Target} className="lg:col-span-3">
                  {candidates.length === 0 ? (
                    <EmptySection message="No recommended candidate matches available." />
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-sm">
                        <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                          <tr>
                            <th className="py-2.5 pr-4 font-medium">Candidate</th>
                            <th className="py-2.5 px-3 font-medium">Role</th>
                            <th className="py-2.5 px-3 font-medium">Resume Match</th>
                            <th className="py-2.5 px-3 font-medium">Interview Readiness</th>
                            <th className="py-2.5 pl-3 font-medium text-right"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {candidates.map((c) => (
                            <tr key={c.name} className="border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors">
                              <td className="py-3 pr-4 align-middle font-medium text-foreground whitespace-nowrap">{c.name}</td>
                              <td className="py-3 px-3 align-middle text-muted-foreground whitespace-nowrap">{c.role}</td>
                              <td className="py-3 px-3 align-middle w-48"><BarMeter value={c.match} /></td>
                              <td className="py-3 px-3 align-middle w-48"><BarMeter value={c.readiness} /></td>
                              <td className="py-3 pl-3 align-middle text-right"><Button size="sm" variant="outline">Shortlist</Button></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Panel>
              </div>

              {/* Performance */}
              <SectionTitle eyebrow="Performance" title="AI Performance Insights" icon={Award} />
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Panel title="Top Performers" icon={TrendingUp}>
                  {topPerformers.length === 0 ? (
                    <EmptySection message="No top performers listed." />
                  ) : (
                    <ul className="space-y-3">
                      {topPerformers.map((p) => (
                        <li key={p.name} className="flex items-center justify-between rounded-lg border border-border bg-card p-3 shadow-sm">
                          <div>
                            <div className="font-medium text-foreground">{p.name}</div>
                            <div className="text-xs text-muted-foreground">{p.dept}</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className={statusBadgeClass("positive")}>{p.growth} growth</Badge>
                            <div className="font-display text-lg font-semibold text-foreground">{p.score}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </Panel>

                <Panel title="Needs Support" icon={GraduationCap}>
                  {supportPerformers.length === 0 ? (
                    <EmptySection message="No performers requiring support flagged." />
                  ) : (
                    <ul className="space-y-3">
                      {supportPerformers.map((p) => (
                        <li key={p.name} className="rounded-lg border border-border bg-card p-3 shadow-sm">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-foreground">{p.name}</div>
                              <div className="text-xs text-muted-foreground">{p.dept}</div>
                            </div>
                            <div className="font-display text-lg font-semibold text-foreground">{p.score}</div>
                          </div>
                          {p.coach ? (
                            <div className="mt-2 inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground border border-border">
                              <Sparkles className="h-3 w-3 text-primary" /> AI coaching: {p.coach}
                            </div>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  )}
                </Panel>

                <Panel title="Skill Gap Analysis" icon={Cpu} className="lg:col-span-2">
                  {skillGap.length === 0 ? (
                    <EmptySection message="No skill gap data available." />
                  ) : (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={skillGap} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} vertical={false} />
                          <XAxis dataKey="skill" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                          <Tooltip contentStyle={chartTooltip} itemStyle={{ color: "var(--foreground)" }} labelStyle={{ color: "var(--foreground)" }} />
                          <Legend wrapperStyle={{ fontSize: 12 }} />
                          <Bar dataKey="have" name="Current" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                          <Bar dataKey="need" name="Target" fill="var(--muted-foreground)" radius={[6, 6, 0, 0]} opacity={0.4} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </Panel>
              </div>

              {/* Payroll insights */}
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

                <Panel title="Payroll Alerts" icon={ShieldAlert} className="lg:col-span-2">
                  {payrollAlerts.length === 0 ? (
                    <EmptySection message="No active payroll alerts." />
                  ) : (
                    <ul className="space-y-3">
                      {payrollAlerts.map((p: PayrollAlertItem) => (
                        <li key={p.title} className="flex items-start justify-between gap-3 rounded-lg border border-border bg-card p-3 shadow-sm">
                          <div>
                            <div className="font-medium text-foreground">{p.title}</div>
                            <div className="text-xs text-muted-foreground">{p.who} · {p.delta}</div>
                          </div>
                          <SeverityBadge severity={p.severity} />
                        </li>
                      ))}
                    </ul>
                  )}
                </Panel>

                <Panel title="Payroll Cost Forecast" icon={LineChartIcon}>
                  {payrollTrend.length === 0 ? (
                    <EmptySection message="No payroll forecast trend data." />
                  ) : (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={payrollTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="cost" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                              <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.02} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} vertical={false} />
                          <XAxis dataKey="m" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                          <Tooltip contentStyle={chartTooltip} itemStyle={{ color: "var(--foreground)" }} labelStyle={{ color: "var(--foreground)" }} />
                          <Area type="monotone" dataKey="cost" name="Cost" stroke="var(--primary)" fill="url(#cost)" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </Panel>
              </div>

              {/* Workforce planning */}
              <SectionTitle eyebrow="Planning" title="AI Workforce Planning" icon={Users} />
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Panel title="Headcount Forecast" icon={LineChartIcon}>
                  {headcountForecast.length === 0 ? (
                    <EmptySection message="No headcount forecast available." />
                  ) : (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={headcountForecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} vertical={false} />
                          <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                          <Tooltip contentStyle={chartTooltip} itemStyle={{ color: "var(--foreground)" }} labelStyle={{ color: "var(--foreground)" }} />
                          <Legend wrapperStyle={{ fontSize: 12 }} />
                          <Line type="monotone" dataKey="current" name="Actual" stroke="var(--foreground)" strokeWidth={2} dot={false} />
                          <Line type="monotone" dataKey="forecast" name="AI Forecast" stroke="var(--primary)" strokeWidth={2} strokeDasharray="5 4" dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </Panel>

                <Panel title="Hiring Demand by Dept" icon={Briefcase}>
                  {hiringDemand.length === 0 ? (
                    <EmptySection message="No department hiring demand data." />
                  ) : (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={hiringDemand} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} horizontal={false} />
                          <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis dataKey="dept" type="category" stroke="var(--muted-foreground)" fontSize={12} width={90} tickLine={false} axisLine={false} />
                          <Tooltip contentStyle={chartTooltip} itemStyle={{ color: "var(--foreground)" }} labelStyle={{ color: "var(--foreground)" }} />
                          <Legend wrapperStyle={{ fontSize: 12 }} />
                          <Bar dataKey="open" name="Open" fill="var(--muted-foreground)" opacity={0.4} radius={[0, 6, 6, 0]} />
                          <Bar dataKey="demand" name="AI Demand" fill="var(--primary)" radius={[0, 6, 6, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </Panel>
              </div>

              {/* Document generator */}
              <SectionTitle eyebrow="Generate" title="AI Document Generator" icon={FileText} />
              {documents.length === 0 ? (
                <EmptySection message="No AI document templates configured." />
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                  {documents.map((d) => (
                    <DocumentCard key={d.label} document={d} />
                  ))}
                </div>
              )}

              {/* Satisfaction trend */}
              <Panel title="Employee Satisfaction Trend" icon={Sparkles}>
                {satisfactionTrend.length === 0 ? (
                  <EmptySection message="No satisfaction trend points available." />
                ) : (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={satisfactionTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="sat" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                            <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.02} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} vertical={false} />
                        <XAxis dataKey="m" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="var(--muted-foreground)" fontSize={12} domain={[0, 100]} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={chartTooltip} itemStyle={{ color: "var(--foreground)" }} labelStyle={{ color: "var(--foreground)" }} />
                        <Area type="monotone" dataKey="s" name="Score" stroke="var(--primary)" fill="url(#sat)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </Panel>
            </div>

            {/* RIGHT RAIL */}
            <aside className="space-y-6">
              <AIChatPanel recommendations={recommendations} />

              <Panel title="AI Alerts Center" icon={AlertTriangle}>
                {alerts.length === 0 ? (
                  <EmptySection message="No active AI alerts." />
                ) : (
                  <ul className="space-y-2">
                    {alerts.map((a) => {
                      const IconComp = getIconComponent(a.icon, AlertTriangle);
                      return (
                        <li key={a.title} className="flex items-start gap-3 rounded-lg border border-border bg-card p-3 shadow-sm">
                          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                            <IconComp className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <div className="truncate text-sm font-medium text-foreground">{a.title}</div>
                              <SeverityBadge severity={a.severity} />
                            </div>
                            <div className="text-xs text-muted-foreground">{a.note}</div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </Panel>

              <Panel title="AI Recommendations" icon={Sparkles}>
                {recommendations.length === 0 ? (
                  <EmptySection message="No recommendations available." />
                ) : (
                  <ul className="space-y-2 text-sm">
                    {recommendations.map((r, i) => (
                      <li key={i} className="flex gap-2 rounded-lg border border-border bg-card p-3 shadow-sm">
                        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span className="text-muted-foreground">{r}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </Panel>

              <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Full conversation</div>
                <Link to={"/dashboard/payroll/copilot" as any} className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" /> Open AI Copilot
                </Link>
              </div>
            </aside>
          </div>
        </>
      )}
    </div>
  );
}

// ---------------- Sub Components ----------------
const chartTooltip = {
  backgroundColor: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 12,
  color: "var(--foreground)",
};

const ErrorBanner = memo(function ErrorBanner({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-destructive">
      <div className="flex items-center gap-3">
        <AlertCircle className="h-5 w-5 shrink-0" />
        <div>
          <div className="font-semibold text-sm">Failed to load AI Insights</div>
          <div className="text-xs opacity-90">{message}</div>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onRetry}
        className="border-destructive/30 text-destructive hover:bg-destructive/20 hover:text-destructive"
      >
        <RefreshCw className="mr-2 h-3.5 w-3.5" /> Retry
      </Button>
    </div>
  );
});

const EmptySection = memo(function EmptySection({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-6 text-center text-muted-foreground">
      <Inbox className="mb-2 h-6 w-6 text-muted-foreground" />
      <div className="text-xs font-medium">{message}</div>
    </div>
  );
});

const SectionTitle = memo(function SectionTitle({ eyebrow, title, icon: Icon }: { eyebrow: string; title: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="mb-3 mt-2 flex items-center gap-2">
      <div className="grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div>
        <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{eyebrow}</div>
        <div className="font-display text-base font-semibold tracking-tight text-foreground">{title}</div>
      </div>
    </div>
  );
});

const KpiCard = memo(function KpiCard({ kpi, delay = 0 }: { kpi: KpiItem; delay?: number }) {
  const Icon = getIconComponent(kpi.icon, HeartPulse);
  const up = kpi.trend >= 0;
  const positive = kpi.invert ? !up : up;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="rounded-xl border border-border bg-card p-4 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{kpi.label}</div>
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-2 flex items-end justify-between">
        <div className="font-display text-2xl font-semibold tracking-tight text-foreground">
          {kpi.score}{kpi.label?.toLowerCase().includes("risk") ? "%" : ""}
        </div>
        <div className={`inline-flex items-center gap-0.5 text-xs font-medium ${trendTextClass(positive)}`}>
          {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          {Math.abs(kpi.trend)}%
        </div>
      </div>
      <Progress value={Math.min(100, Math.max(0, kpi.score))} className="mt-3 h-1.5" />
      <div className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground">
        <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
        <span className="truncate">{kpi.hint}</span>
      </div>
    </motion.div>
  );
});

const Panel = memo(function Panel({
  title,
  icon: Icon,
  children,
  className = "",
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-border bg-card shadow-sm ${className}`}>
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <div className="grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-3.5 w-3.5" />
        </div>
        <div className="text-sm font-medium text-foreground">{title}</div>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
});

const MiniStat = memo(function MiniStat({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-2 font-display text-2xl font-semibold text-foreground">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
    </div>
  );
});

const DocumentCard = memo(function DocumentCard({ document }: { document: DocumentItem }) {
  const Icon = getIconComponent(document.type, FileText);
  return (
    <button
      type="button"
      className="group relative rounded-xl border border-border bg-card p-4 text-left shadow-sm transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="mb-3 grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div className="text-sm font-medium text-foreground">{document.label}</div>
      <div className="mt-1 text-xs text-muted-foreground">Auto-fill from employee data</div>
      <div className="absolute right-3 top-3 text-[10px] uppercase tracking-wider text-muted-foreground">AI</div>
    </button>
  );
});

const RiskPill = memo(function RiskPill({ score }: { score: number }) {
  const status = score >= 80 ? "critical" : score >= 65 ? "warning" : "low";
  return (
    <Badge variant="outline" className={statusBadgeClass(status)}>
      {score}%
    </Badge>
  );
});

const ToneDot = memo(function ToneDot({ tone }: { tone: string }) {
  return <span className={`h-2 w-2 shrink-0 rounded-full ${getToneDot(tone)}`} />;
});

const SeverityBadge = memo(function SeverityBadge({ severity }: { severity: string }) {
  return (
    <Badge variant="outline" className={statusBadgeClass(severity)}>
      {severity}
    </Badge>
  );
});

const BarMeter = memo(function BarMeter({ value }: { value: number; tone?: "primary" | "violet" }) {
  return (
    <div className="flex items-center gap-2">
      <Progress value={Math.min(100, Math.max(0, value))} className="h-1.5 flex-1" />
      <span className="w-9 text-right text-xs font-medium text-foreground">{value}%</span>
    </div>
  );
});

const AIChatPanel = memo(function AIChatPanel({ recommendations }: { recommendations: string[] }) {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "Hi! I’m OFC360 AI. Ask me about workforce metrics, attrition, burnout, or hiring forecasts." },
  ]);

  const examples = useMemo(() => {
    if (Array.isArray(recommendations) && recommendations.length > 0) {
      return recommendations.slice(0, 4);
    }
    return [];
  }, [recommendations]);

  function send(value?: string) {
    const t = (value ?? text).trim();
    if (!t) return;
    setText("");
    setMessages((m) => [...m, { role: "user", text: t }]);
    setMessages((m) => [...m, { role: "ai", text: `Querying workforce intelligence backend for: "${t}"...` }]);
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary">
            <Brain className="h-3.5 w-3.5" />
          </div>
          <div className="text-sm font-medium text-foreground">AI Assistant</div>
        </div>
        <Badge variant="outline" className={statusBadgeClass("active")}>Live</Badge>
      </div>

      <div className="max-h-72 space-y-2 overflow-y-auto p-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] whitespace-pre-wrap rounded-xl px-3 py-2 text-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2 border-t border-border p-3">
        <div className="flex flex-wrap gap-1.5">
          {examples.map((e, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => send(e)}
              className="truncate max-w-[280px] rounded-full border border-border bg-muted/50 px-2.5 py-1 text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {e}
            </button>
          ))}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex items-center gap-2">
          <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Ask AI anything..." className="h-9" />
          <Button type="submit" size="sm" aria-label="Send message"><Send className="h-4 w-4" /></Button>
        </form>
      </div>
    </div>
  );
});

// ---------------- Loading Skeletons ----------------
function LoadingSkeletonView() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-20 w-full rounded-xl" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-48 rounded-xl lg:col-span-2" />
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-64 rounded-xl lg:col-span-3" />
          </div>
        </div>
        <div className="space-y-6">
          <Skeleton className="h-72 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default AIInsightsPage;
